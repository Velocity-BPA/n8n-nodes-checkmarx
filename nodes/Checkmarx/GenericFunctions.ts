/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IDataObject,
	IExecuteFunctions,
	IHttpRequestMethods,
	ILoadOptionsFunctions,
	IPollFunctions,
	IRequestOptions,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

import type { ICheckmarxCredentials, ITokenCache, ITokenResponse, CheckmarxRegion } from './types/CheckmarxTypes';

// Token cache for OAuth2 refresh token flow
let tokenCache: ITokenCache | null = null;

const REGION_URLS: Record<CheckmarxRegion, string> = {
	US: 'https://ast.checkmarx.net',
	US2: 'https://us.ast.checkmarx.net',
	EU: 'https://eu.ast.checkmarx.net',
	EU2: 'https://eu-2.ast.checkmarx.net',
	DEU: 'https://deu.ast.checkmarx.net',
	ANZ: 'https://anz.ast.checkmarx.net',
	India: 'https://ind.ast.checkmarx.net',
};

const REGION_IAM_URLS: Record<CheckmarxRegion, string> = {
	US: 'https://iam.checkmarx.net',
	US2: 'https://us.iam.checkmarx.net',
	EU: 'https://eu.iam.checkmarx.net',
	EU2: 'https://eu-2.iam.checkmarx.net',
	DEU: 'https://deu.iam.checkmarx.net',
	ANZ: 'https://anz.iam.checkmarx.net',
	India: 'https://ind.iam.checkmarx.net',
};

/**
 * Get the base URL for the Checkmarx API based on the region
 */
export function getBaseUrl(region: string): string {
	return REGION_URLS[region as CheckmarxRegion] || REGION_URLS.US;
}

/**
 * Get the IAM URL for authentication based on the region
 */
export function getIamUrl(region: string, customIamUrl?: string): string {
	if (customIamUrl && customIamUrl.trim()) {
		return customIamUrl.trim();
	}
	return REGION_IAM_URLS[region as CheckmarxRegion] || REGION_IAM_URLS.US;
}

/**
 * Get OAuth2 access token using refresh token flow
 */
export async function getAccessToken(
	this: IExecuteFunctions | ILoadOptionsFunctions | IPollFunctions,
): Promise<string> {
	const credentials = await this.getCredentials('checkmarxOneApi') as ICheckmarxCredentials;

	// Check cache - subtract 60 seconds for safety margin
	if (tokenCache && tokenCache.expires > Date.now()) {
		return tokenCache.token;
	}

	const iamUrl = getIamUrl(credentials.region, credentials.iamUrl);

	const options: IRequestOptions = {
		method: 'POST',
		uri: `${iamUrl}/auth/realms/${credentials.tenantName}/protocol/openid-connect/token`,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		form: {
			grant_type: 'refresh_token',
			client_id: 'ast-app',
			refresh_token: credentials.apiKey,
		},
		json: true,
	};

	try {
		const response = await this.helpers.request(options) as ITokenResponse;

		// Cache token with 60 second safety margin
		tokenCache = {
			token: response.access_token,
			expires: Date.now() + (response.expires_in - 60) * 1000,
		};

		return response.access_token;
	} catch (error) {
		tokenCache = null;
		throw new NodeApiError(this.getNode(), error as JsonObject, {
			message: 'Failed to authenticate with Checkmarx One. Please check your API Key and Tenant Name.',
		});
	}
}

/**
 * Clear the token cache - useful for testing or when credentials change
 */
export function clearTokenCache(): void {
	tokenCache = null;
}

/**
 * Make an authenticated request to the Checkmarx One API
 */
export async function checkmarxApiRequest(
	this: IExecuteFunctions | ILoadOptionsFunctions | IPollFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body?: IDataObject,
	query?: IDataObject,
): Promise<IDataObject | IDataObject[]> {
	const credentials = await this.getCredentials('checkmarxOneApi') as ICheckmarxCredentials;
	const accessToken = await getAccessToken.call(this);
	const baseUrl = getBaseUrl(credentials.region);

	const options: IRequestOptions = {
		method,
		uri: `${baseUrl}/api${endpoint}`,
		headers: {
			Authorization: `Bearer ${accessToken}`,
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
		json: true,
	};

	if (body && Object.keys(body).length > 0) {
		options.body = body;
	}

	if (query && Object.keys(query).length > 0) {
		options.qs = query;
	}

	try {
		const response = await this.helpers.request(options);
		return response as IDataObject | IDataObject[];
	} catch (error) {
		// If we get a 401, clear the token cache and retry once
		if ((error as JsonObject).statusCode === 401) {
			clearTokenCache();
			try {
				const newAccessToken = await getAccessToken.call(this);
				options.headers = {
					...options.headers,
					Authorization: `Bearer ${newAccessToken}`,
				};
				const response = await this.helpers.request(options);
				return response as IDataObject | IDataObject[];
			} catch (retryError) {
				throw new NodeApiError(this.getNode(), retryError as JsonObject);
			}
		}
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}

/**
 * Make a request to download binary data (for reports)
 */
export async function checkmarxApiDownload(
	this: IExecuteFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	query?: IDataObject,
): Promise<Buffer> {
	const credentials = await this.getCredentials('checkmarxOneApi') as ICheckmarxCredentials;
	const accessToken = await getAccessToken.call(this);
	const baseUrl = getBaseUrl(credentials.region);

	const options: IRequestOptions = {
		method,
		uri: `${baseUrl}/api${endpoint}`,
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
		encoding: null, // Return buffer
	};

	if (query && Object.keys(query).length > 0) {
		options.qs = query;
	}

	try {
		const response = await this.helpers.request(options);
		return response as Buffer;
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}

/**
 * Make paginated requests to retrieve all items
 */
export async function checkmarxApiRequestAllItems(
	this: IExecuteFunctions | ILoadOptionsFunctions | IPollFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body?: IDataObject,
	query?: IDataObject,
): Promise<IDataObject[]> {
	const returnData: IDataObject[] = [];
	let offset = 0;
	const limit = 100;

	const qs = query || {};
	qs.limit = limit;

	do {
		qs.offset = offset;

		const response = await checkmarxApiRequest.call(this, method, endpoint, body, qs) as IDataObject;

		if (response.results && Array.isArray(response.results)) {
			returnData.push(...(response.results as IDataObject[]));

			if ((response.results as IDataObject[]).length < limit) {
				break;
			}
			offset += limit;
		} else if (Array.isArray(response)) {
			returnData.push(...response);
			break;
		} else {
			// Single object or unexpected format
			if (Object.keys(response).length > 0) {
				returnData.push(response);
			}
			break;
		}
	} while (true);

	return returnData;
}

/**
 * Handle form-urlencoded requests (for upload link generation)
 */
export async function checkmarxApiFormRequest(
	this: IExecuteFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	formData: IDataObject,
): Promise<IDataObject> {
	const credentials = await this.getCredentials('checkmarxOneApi') as ICheckmarxCredentials;
	const accessToken = await getAccessToken.call(this);
	const baseUrl = getBaseUrl(credentials.region);

	const options: IRequestOptions = {
		method,
		uri: `${baseUrl}/api${endpoint}`,
		headers: {
			Authorization: `Bearer ${accessToken}`,
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		form: formData,
		json: true,
	};

	try {
		const response = await this.helpers.request(options);
		return response as IDataObject;
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}

/**
 * Upload binary data (for source code uploads)
 */
export async function checkmarxUploadSource(
	this: IExecuteFunctions,
	uploadUrl: string,
	data: Buffer,
	fileName: string,
): Promise<void> {
	const options: IRequestOptions = {
		method: 'PUT',
		uri: uploadUrl,
		headers: {
			'Content-Type': 'application/zip',
			'Content-Length': data.length,
		},
		body: data,
	};

	try {
		await this.helpers.request(options);
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject, {
			message: `Failed to upload source file: ${fileName}`,
		});
	}
}

/**
 * Validate UUID format
 */
export function validateUuid(value: string, fieldName: string): void {
	const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
	if (!uuidRegex.test(value)) {
		throw new Error(`${fieldName} must be a valid UUID`);
	}
}

/**
 * Parse tags from key=value format to object
 */
export function parseTags(tagsString: string): IDataObject {
	const tags: IDataObject = {};
	if (!tagsString || !tagsString.trim()) {
		return tags;
	}

	const pairs = tagsString.split(',');
	for (const pair of pairs) {
		const [key, value] = pair.split('=').map((s) => s.trim());
		if (key) {
			tags[key] = value || '';
		}
	}
	return tags;
}

/**
 * Format tags object to key=value string
 */
export function formatTags(tags: IDataObject): string {
	return Object.entries(tags)
		.map(([key, value]) => `${key}=${value}`)
		.join(', ');
}

/**
 * Sleep utility for polling and rate limiting
 */
export function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
