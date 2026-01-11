/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IDataObject } from 'n8n-workflow';

export interface ICheckmarxCredentials {
	apiKey: string;
	tenantName: string;
	region: string;
	iamUrl?: string;
}

export interface ITokenCache {
	token: string;
	expires: number;
}

export interface ITokenResponse {
	access_token: string;
	expires_in: number;
	refresh_expires_in: number;
	refresh_token: string;
	token_type: string;
}

export interface ICheckmarxProject {
	id: string;
	name: string;
	createdAt: string;
	updatedAt: string;
	groups: string[];
	tags: IDataObject;
	repoUrl?: string;
	mainBranch?: string;
	origin?: string;
	criticality?: number;
}

export interface ICheckmarxApplication {
	id: string;
	name: string;
	description?: string;
	criticality?: number;
	rules?: IApplicationRule[];
	tags?: IDataObject;
	projectIds?: string[];
	createdAt?: string;
	updatedAt?: string;
}

export interface IApplicationRule {
	type: string;
	value: string;
}

export interface ICheckmarxScan {
	id: string;
	status: string;
	projectId: string;
	projectName?: string;
	branch?: string;
	createdAt: string;
	updatedAt: string;
	tags?: IDataObject;
	engines?: string[];
	initiator?: string;
}

export interface IScanConfig {
	type: 'sast' | 'sca' | 'kics' | 'apisec';
	value: IDataObject;
}

export interface ICheckmarxResult {
	id: string;
	similarityId: string;
	scanId: string;
	projectId?: string;
	state: string;
	severity: string;
	status: string;
	type: string;
	description?: string;
	data?: IDataObject;
	firstFoundAt?: string;
	foundAt?: string;
}

export interface ICheckmarxGroup {
	id: string;
	name: string;
	parentId?: string;
	path?: string;
	createdAt?: string;
	updatedAt?: string;
}

export interface ICheckmarxQuery {
	id: string;
	name: string;
	language?: string;
	severity?: string;
	cweId?: string;
	category?: string;
	description?: string;
	isCustom?: boolean;
}

export interface ICheckmarxReport {
	reportId: string;
	status: string;
	scanId?: string;
	projectId?: string;
	templateId?: string;
	format?: string;
	createdAt?: string;
	completedAt?: string;
	url?: string;
}

export interface ICheckmarxPreset {
	id: string;
	name: string;
	description?: string;
	isCustom?: boolean;
	queryIds?: string[];
	createdAt?: string;
	updatedAt?: string;
}

export interface ICheckmarxAuditEvent {
	id: string;
	action: string;
	resourceType: string;
	resourceId?: string;
	userId?: string;
	username?: string;
	timestamp: string;
	details?: IDataObject;
}

export interface ICheckmarxUpload {
	url: string;
	uploadId?: string;
	status?: string;
}

export interface ICheckmarxPredicate {
	id: string;
	projectId: string;
	similarityId: string;
	state: string;
	severity?: string;
	comment?: string;
	createdAt?: string;
	updatedAt?: string;
}

export interface ICheckmarxConfig {
	projectId: string;
	presetName?: string;
	engineConfiguration?: string;
	exclusions?: string[];
	incremental?: boolean;
	sastConfig?: IDataObject;
	scaConfig?: IDataObject;
	kicsConfig?: IDataObject;
}

export interface IPaginatedResponse<T> {
	totalCount: number;
	filteredTotalCount: number;
	results: T[];
}

export type CheckmarxRegion = 'US' | 'US2' | 'EU' | 'EU2' | 'DEU' | 'ANZ' | 'India';

export type ScanStatus = 'Queued' | 'Running' | 'Completed' | 'Failed' | 'Canceled' | 'Partial';

export type ResultSeverity = 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';

export type ResultState = 'TO_VERIFY' | 'NOT_EXPLOITABLE' | 'PROPOSED_NOT_EXPLOITABLE' | 'CONFIRMED' | 'URGENT';

export type ResultStatus = 'NEW' | 'RECURRENT' | 'FIXED';

export type AuditAction = 'CREATE' | 'UPDATE' | 'DELETE' | 'SCAN' | 'LOGIN';

export type ResourceType = 'PROJECT' | 'APPLICATION' | 'SCAN' | 'GROUP';

export type ReportFormat = 'pdf' | 'json' | 'csv' | 'xml' | 'sarif';

export type EngineType = 'sast' | 'sca' | 'kics' | 'apisec';

export type ProjectOrigin = 'API' | 'GITHUB' | 'GITLAB' | 'BITBUCKET' | 'AZURE';
