/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class CheckmarxOneApi implements ICredentialType {
	name = 'checkmarxOneApi';
	displayName = 'Checkmarx One API';
	documentationUrl = 'https://checkmarx.com/resource/documents/en/34965-68618-checkmarx-one-api-guide.html';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key (Refresh Token)',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'The API Key (Refresh Token) from Checkmarx One. Generate this in Settings > API Keys.',
		},
		{
			displayName: 'Tenant Name',
			name: 'tenantName',
			type: 'string',
			default: '',
			required: true,
			description: 'Your Checkmarx One tenant name',
		},
		{
			displayName: 'Region',
			name: 'region',
			type: 'options',
			options: [
				{
					name: 'US',
					value: 'US',
				},
				{
					name: 'US2',
					value: 'US2',
				},
				{
					name: 'EU',
					value: 'EU',
				},
				{
					name: 'EU2',
					value: 'EU2',
				},
				{
					name: 'DEU (Germany)',
					value: 'DEU',
				},
				{
					name: 'ANZ (Australia/New Zealand)',
					value: 'ANZ',
				},
				{
					name: 'India',
					value: 'India',
				},
			],
			default: 'US',
			required: true,
			description: 'The Checkmarx One region for your tenant',
		},
		{
			displayName: 'Custom IAM URL',
			name: 'iamUrl',
			type: 'string',
			default: '',
			description: 'Custom IAM URL if using a dedicated instance. Leave empty for standard regions.',
		},
	];

	// Note: Authentication is handled via OAuth2 refresh token flow in GenericFunctions.ts
	// This authenticate block is not directly used since we need to exchange the refresh token first
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.region === "US" ? "https://ast.checkmarx.net" : $credentials.region === "US2" ? "https://us.ast.checkmarx.net" : $credentials.region === "EU" ? "https://eu.ast.checkmarx.net" : $credentials.region === "EU2" ? "https://eu-2.ast.checkmarx.net" : $credentials.region === "DEU" ? "https://deu.ast.checkmarx.net" : $credentials.region === "ANZ" ? "https://anz.ast.checkmarx.net" : "https://ind.ast.checkmarx.net"}}',
			url: '/api/projects',
			method: 'GET',
			qs: {
				limit: 1,
			},
		},
	};
}
