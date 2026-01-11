/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IDataObject,
	IExecuteFunctions,
	ILoadOptionsFunctions,
	INodeExecutionData,
	INodePropertyOptions,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

import {
	checkmarxApiRequest,
	checkmarxApiRequestAllItems,
	checkmarxApiDownload,
	checkmarxUploadSource,
	parseTags,
	validateUuid,
} from './GenericFunctions';

import { projectOperations, projectFields } from './descriptions/ProjectDescription';
import { applicationOperations, applicationFields } from './descriptions/ApplicationDescription';
import { scanOperations, scanFields } from './descriptions/ScanDescription';
import { resultOperations, resultFields } from './descriptions/ResultDescription';
import { groupOperations, groupFields } from './descriptions/GroupDescription';
import { queryOperations, queryFields } from './descriptions/QueryDescription';
import { reportOperations, reportFields } from './descriptions/ReportDescription';
import { presetOperations, presetFields } from './descriptions/PresetDescription';
import { auditTrailOperations, auditTrailFields } from './descriptions/AuditTrailDescription';
import { uploadOperations, uploadFields } from './descriptions/UploadDescription';
import { predicateOperations, predicateFields } from './descriptions/PredicateDescription';
import { configurationOperations, configurationFields } from './descriptions/ConfigurationDescription';

// Emit licensing notice once on module load
const LICENSING_NOTICE = `[Velocity BPA Licensing Notice]

This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).

Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.

For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.`;

let licenseNoticeEmitted = false;

function emitLicenseNotice(): void {
	if (!licenseNoticeEmitted) {
		console.warn(LICENSING_NOTICE);
		licenseNoticeEmitted = true;
	}
}

export class Checkmarx implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Checkmarx',
		name: 'checkmarx',
		icon: 'file:checkmarx.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Checkmarx One application security platform',
		defaults: {
			name: 'Checkmarx',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'checkmarxOneApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Application', value: 'application' },
					{ name: 'Audit Trail', value: 'auditTrail' },
					{ name: 'Configuration', value: 'configuration' },
					{ name: 'Group', value: 'group' },
					{ name: 'Predicate', value: 'predicate' },
					{ name: 'Preset', value: 'preset' },
					{ name: 'Project', value: 'project' },
					{ name: 'Query', value: 'query' },
					{ name: 'Report', value: 'report' },
					{ name: 'Result', value: 'result' },
					{ name: 'Scan', value: 'scan' },
					{ name: 'Upload', value: 'upload' },
				],
				default: 'project',
			},
			// Project operations and fields
			...projectOperations,
			...projectFields,
			// Application operations and fields
			...applicationOperations,
			...applicationFields,
			// Scan operations and fields
			...scanOperations,
			...scanFields,
			// Result operations and fields
			...resultOperations,
			...resultFields,
			// Group operations and fields
			...groupOperations,
			...groupFields,
			// Query operations and fields
			...queryOperations,
			...queryFields,
			// Report operations and fields
			...reportOperations,
			...reportFields,
			// Preset operations and fields
			...presetOperations,
			...presetFields,
			// Audit Trail operations and fields
			...auditTrailOperations,
			...auditTrailFields,
			// Upload operations and fields
			...uploadOperations,
			...uploadFields,
			// Predicate operations and fields
			...predicateOperations,
			...predicateFields,
			// Configuration operations and fields
			...configurationOperations,
			...configurationFields,
		],
	};

	methods = {
		loadOptions: {
			async getProjects(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const projects = await checkmarxApiRequestAllItems.call(this, 'GET', '/projects');
				return projects.map((project: IDataObject) => ({
					name: project.name as string,
					value: project.id as string,
				}));
			},
			async getApplications(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const applications = await checkmarxApiRequestAllItems.call(this, 'GET', '/applications');
				return applications.map((app: IDataObject) => ({
					name: app.name as string,
					value: app.id as string,
				}));
			},
			async getGroups(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const groups = await checkmarxApiRequestAllItems.call(this, 'GET', '/groups');
				return groups.map((group: IDataObject) => ({
					name: group.name as string,
					value: group.id as string,
				}));
			},
			async getPresets(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const presets = await checkmarxApiRequestAllItems.call(this, 'GET', '/presets');
				return presets.map((preset: IDataObject) => ({
					name: preset.name as string,
					value: preset.id as string,
				}));
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		// Emit licensing notice once per node load
		emitLicenseNotice();

		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData: IDataObject | IDataObject[] = {};

				// ==================== PROJECT ====================
				if (resource === 'project') {
					if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i) as IDataObject;
						const query: IDataObject = {};

						if (filters.name) query.name = filters.name;
						if (filters.groupId) query['group-id'] = filters.groupId;
						if (filters.tagKey) query['tags-keys'] = filters.tagKey;
						if (filters.tagValue) query['tags-values'] = filters.tagValue;

						if (returnAll) {
							responseData = await checkmarxApiRequestAllItems.call(this, 'GET', '/projects', undefined, query);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							query.limit = limit;
							const response = await checkmarxApiRequest.call(this, 'GET', '/projects', undefined, query) as IDataObject;
							responseData = (response.projects || response.results || response) as IDataObject[];
						}
					} else if (operation === 'get') {
						const projectId = this.getNodeParameter('projectId', i) as string;
						validateUuid(projectId, 'Project ID');
						responseData = await checkmarxApiRequest.call(this, 'GET', `/projects/${projectId}`) as IDataObject;
					} else if (operation === 'create') {
						const name = this.getNodeParameter('name', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body: IDataObject = { name };

						if (additionalFields.groups) {
							body.groups = (additionalFields.groups as string).split(',').map((g) => g.trim());
						}
						if (additionalFields.repoUrl) body.repoUrl = additionalFields.repoUrl;
						if (additionalFields.mainBranch) body.mainBranch = additionalFields.mainBranch;
						if (additionalFields.origin) body.origin = additionalFields.origin;
						if (additionalFields.criticality) body.criticality = additionalFields.criticality;
						if (additionalFields.tags) body.tags = parseTags(additionalFields.tags as string);

						responseData = await checkmarxApiRequest.call(this, 'POST', '/projects', body) as IDataObject;
					} else if (operation === 'update') {
						const projectId = this.getNodeParameter('projectId', i) as string;
						validateUuid(projectId, 'Project ID');
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

						const body: IDataObject = {};

						if (updateFields.name) body.name = updateFields.name;
						if (updateFields.groups) {
							body.groups = (updateFields.groups as string).split(',').map((g) => g.trim());
						}
						if (updateFields.repoUrl) body.repoUrl = updateFields.repoUrl;
						if (updateFields.mainBranch) body.mainBranch = updateFields.mainBranch;
						if (updateFields.criticality) body.criticality = updateFields.criticality;
						if (updateFields.tags) body.tags = parseTags(updateFields.tags as string);

						responseData = await checkmarxApiRequest.call(this, 'PUT', `/projects/${projectId}`, body) as IDataObject;
					} else if (operation === 'delete') {
						const projectId = this.getNodeParameter('projectId', i) as string;
						validateUuid(projectId, 'Project ID');
						await checkmarxApiRequest.call(this, 'DELETE', `/projects/${projectId}`);
						responseData = { success: true, projectId };
					} else if (operation === 'getTags') {
						const projectId = this.getNodeParameter('projectId', i) as string;
						validateUuid(projectId, 'Project ID');
						const project = await checkmarxApiRequest.call(this, 'GET', `/projects/${projectId}`) as IDataObject;
						responseData = { tags: project.tags || {} };
					} else if (operation === 'addTag') {
						const projectId = this.getNodeParameter('projectId', i) as string;
						validateUuid(projectId, 'Project ID');
						const tagKey = this.getNodeParameter('tagKey', i) as string;
						const tagValue = this.getNodeParameter('tagValue', i) as string;

						// Get current project to preserve existing tags
						const project = await checkmarxApiRequest.call(this, 'GET', `/projects/${projectId}`) as IDataObject;
						const tags = (project.tags || {}) as IDataObject;
						tags[tagKey] = tagValue;

						responseData = await checkmarxApiRequest.call(this, 'PUT', `/projects/${projectId}`, { tags }) as IDataObject;
					} else if (operation === 'removeTag') {
						const projectId = this.getNodeParameter('projectId', i) as string;
						validateUuid(projectId, 'Project ID');
						const tagKey = this.getNodeParameter('tagKey', i) as string;

						const project = await checkmarxApiRequest.call(this, 'GET', `/projects/${projectId}`) as IDataObject;
						const tags = (project.tags || {}) as IDataObject;
						delete tags[tagKey];

						responseData = await checkmarxApiRequest.call(this, 'PUT', `/projects/${projectId}`, { tags }) as IDataObject;
					} else if (operation === 'getBranches') {
						const projectId = this.getNodeParameter('projectId', i) as string;
						validateUuid(projectId, 'Project ID');
						responseData = await checkmarxApiRequest.call(this, 'GET', `/projects/${projectId}/branches`) as IDataObject;
					} else if (operation === 'getLastScan') {
						const projectId = this.getNodeParameter('projectId', i) as string;
						validateUuid(projectId, 'Project ID');
						const response = await checkmarxApiRequest.call(this, 'GET', '/scans', undefined, {
							'project-id': projectId,
							limit: 1,
							sort: '-created_at',
						}) as IDataObject;
						responseData = ((response.scans || response.results) as IDataObject[])?.[0] || {};
					}
				}

				// ==================== APPLICATION ====================
				else if (resource === 'application') {
					if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i) as IDataObject;
						const query: IDataObject = {};

						if (filters.name) query.name = filters.name;
						if (filters.tagKey) query['tags-keys'] = filters.tagKey;
						if (filters.tagValue) query['tags-values'] = filters.tagValue;

						if (returnAll) {
							responseData = await checkmarxApiRequestAllItems.call(this, 'GET', '/applications', undefined, query);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							query.limit = limit;
							const response = await checkmarxApiRequest.call(this, 'GET', '/applications', undefined, query) as IDataObject;
							responseData = (response.applications || response.results || response) as IDataObject[];
						}
					} else if (operation === 'get') {
						const applicationId = this.getNodeParameter('applicationId', i) as string;
						validateUuid(applicationId, 'Application ID');
						responseData = await checkmarxApiRequest.call(this, 'GET', `/applications/${applicationId}`) as IDataObject;
					} else if (operation === 'create') {
						const name = this.getNodeParameter('name', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body: IDataObject = { name };

						if (additionalFields.description) body.description = additionalFields.description;
						if (additionalFields.criticality) body.criticality = additionalFields.criticality;
						if (additionalFields.tags) body.tags = parseTags(additionalFields.tags as string);

						responseData = await checkmarxApiRequest.call(this, 'POST', '/applications', body) as IDataObject;
					} else if (operation === 'update') {
						const applicationId = this.getNodeParameter('applicationId', i) as string;
						validateUuid(applicationId, 'Application ID');
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

						const body: IDataObject = {};

						if (updateFields.name) body.name = updateFields.name;
						if (updateFields.description) body.description = updateFields.description;
						if (updateFields.criticality) body.criticality = updateFields.criticality;
						if (updateFields.tags) body.tags = parseTags(updateFields.tags as string);

						responseData = await checkmarxApiRequest.call(this, 'PUT', `/applications/${applicationId}`, body) as IDataObject;
					} else if (operation === 'delete') {
						const applicationId = this.getNodeParameter('applicationId', i) as string;
						validateUuid(applicationId, 'Application ID');
						await checkmarxApiRequest.call(this, 'DELETE', `/applications/${applicationId}`);
						responseData = { success: true, applicationId };
					} else if (operation === 'getProjects') {
						const applicationId = this.getNodeParameter('applicationId', i) as string;
						validateUuid(applicationId, 'Application ID');
						const app = await checkmarxApiRequest.call(this, 'GET', `/applications/${applicationId}`) as IDataObject;
						responseData = { projectIds: app.projectIds || [] };
					} else if (operation === 'addProject') {
						const applicationId = this.getNodeParameter('applicationId', i) as string;
						validateUuid(applicationId, 'Application ID');
						const projectId = this.getNodeParameter('projectId', i) as string;
						validateUuid(projectId, 'Project ID');

						const app = await checkmarxApiRequest.call(this, 'GET', `/applications/${applicationId}`) as IDataObject;
						const projectIds = (app.projectIds || []) as string[];
						if (!projectIds.includes(projectId)) {
							projectIds.push(projectId);
						}

						responseData = await checkmarxApiRequest.call(this, 'PUT', `/applications/${applicationId}`, { projectIds }) as IDataObject;
					} else if (operation === 'removeProject') {
						const applicationId = this.getNodeParameter('applicationId', i) as string;
						validateUuid(applicationId, 'Application ID');
						const projectId = this.getNodeParameter('projectId', i) as string;
						validateUuid(projectId, 'Project ID');

						const app = await checkmarxApiRequest.call(this, 'GET', `/applications/${applicationId}`) as IDataObject;
						const projectIds = ((app.projectIds || []) as string[]).filter((id) => id !== projectId);

						responseData = await checkmarxApiRequest.call(this, 'PUT', `/applications/${applicationId}`, { projectIds }) as IDataObject;
					} else if (operation === 'getRules') {
						const applicationId = this.getNodeParameter('applicationId', i) as string;
						validateUuid(applicationId, 'Application ID');
						const app = await checkmarxApiRequest.call(this, 'GET', `/applications/${applicationId}`) as IDataObject;
						responseData = { rules: app.rules || [] };
					}
				}

				// ==================== SCAN ====================
				else if (resource === 'scan') {
					if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i) as IDataObject;
						const query: IDataObject = {};

						if (filters.projectId) query['project-id'] = filters.projectId;
						if (filters.branch) query.branch = filters.branch;
						if (filters.status) query.status = filters.status;
						if (filters.tagKey) query['tags-keys'] = filters.tagKey;
						if (filters.tagValue) query['tags-values'] = filters.tagValue;

						if (returnAll) {
							responseData = await checkmarxApiRequestAllItems.call(this, 'GET', '/scans', undefined, query);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							query.limit = limit;
							const response = await checkmarxApiRequest.call(this, 'GET', '/scans', undefined, query) as IDataObject;
							responseData = (response.scans || response.results || response) as IDataObject[];
						}
					} else if (operation === 'get') {
						const scanId = this.getNodeParameter('scanId', i) as string;
						validateUuid(scanId, 'Scan ID');
						responseData = await checkmarxApiRequest.call(this, 'GET', `/scans/${scanId}`) as IDataObject;
					} else if (operation === 'create') {
						const projectId = this.getNodeParameter('projectId', i) as string;
						validateUuid(projectId, 'Project ID');
						const sourceType = this.getNodeParameter('sourceType', i) as string;
						const branch = this.getNodeParameter('branch', i) as string;
						const engines = this.getNodeParameter('engines', i) as string[];
						const additionalOptions = this.getNodeParameter('additionalOptions', i) as IDataObject;

						const body: IDataObject = {
							project: { id: projectId },
							type: sourceType,
							config: engines.map((engine) => ({ type: engine, value: {} })),
						};

						if (sourceType === 'git') {
							const repoUrl = this.getNodeParameter('repoUrl', i) as string;
							body.handler = {
								gitHandler: {
									repoUrl,
									branch,
								},
							};
						} else if (sourceType === 'upload') {
							const uploadId = this.getNodeParameter('uploadId', i) as string;
							body.handler = {
								uploadHandler: {
									uploadId,
									branch,
								},
							};
						}

						if (additionalOptions.tags) {
							body.tags = parseTags(additionalOptions.tags as string);
						}
						if (additionalOptions.presetName) {
							const sastConfig = (body.config as IDataObject[]).find((c) => c.type === 'sast');
							if (sastConfig) {
								(sastConfig.value as IDataObject).presetName = additionalOptions.presetName;
							}
						}
						if (additionalOptions.incremental) {
							const sastConfig = (body.config as IDataObject[]).find((c) => c.type === 'sast');
							if (sastConfig) {
								(sastConfig.value as IDataObject).incremental = 'true';
							}
						}

						responseData = await checkmarxApiRequest.call(this, 'POST', '/scans', body) as IDataObject;
					} else if (operation === 'cancel') {
						const scanId = this.getNodeParameter('scanId', i) as string;
						validateUuid(scanId, 'Scan ID');
						responseData = await checkmarxApiRequest.call(this, 'PATCH', `/scans/${scanId}`, { status: 'Canceled' }) as IDataObject;
					} else if (operation === 'delete') {
						const scanId = this.getNodeParameter('scanId', i) as string;
						validateUuid(scanId, 'Scan ID');
						await checkmarxApiRequest.call(this, 'DELETE', `/scans/${scanId}`);
						responseData = { success: true, scanId };
					} else if (operation === 'getStatus') {
						const scanId = this.getNodeParameter('scanId', i) as string;
						validateUuid(scanId, 'Scan ID');
						const scan = await checkmarxApiRequest.call(this, 'GET', `/scans/${scanId}`) as IDataObject;
						responseData = { scanId, status: scan.status };
					} else if (operation === 'getWorkflow') {
						const scanId = this.getNodeParameter('scanId', i) as string;
						validateUuid(scanId, 'Scan ID');
						responseData = await checkmarxApiRequest.call(this, 'GET', `/scans/${scanId}/workflow`) as IDataObject;
					} else if (operation === 'getLogs') {
						const scanId = this.getNodeParameter('scanId', i) as string;
						validateUuid(scanId, 'Scan ID');
						responseData = await checkmarxApiRequest.call(this, 'GET', `/logs/${scanId}`) as IDataObject;
					} else if (operation === 'getSummary') {
						const scanId = this.getNodeParameter('scanId', i) as string;
						validateUuid(scanId, 'Scan ID');
						responseData = await checkmarxApiRequest.call(this, 'GET', `/scan-summary`, undefined, { 'scan-ids': scanId }) as IDataObject;
					}
				}

				// ==================== RESULT ====================
				else if (resource === 'result') {
					if (operation === 'getAll' || operation === 'getByScan') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i) as IDataObject;
						const query: IDataObject = {};

						if (operation === 'getByScan') {
							const scanId = this.getNodeParameter('scanId', i) as string;
							validateUuid(scanId, 'Scan ID');
							query['scan-id'] = scanId;
						}

						if (filters.severity) query.severity = filters.severity;
						if (filters.state) query.state = filters.state;
						if (filters.status) query.status = filters.status;
						if (filters.queryId) query['query-id'] = filters.queryId;
						if (filters.sourceFile) query['source-file'] = filters.sourceFile;

						if (returnAll) {
							responseData = await checkmarxApiRequestAllItems.call(this, 'GET', '/results', undefined, query);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							query.limit = limit;
							const response = await checkmarxApiRequest.call(this, 'GET', '/results', undefined, query) as IDataObject;
							responseData = (response.results || response) as IDataObject[];
						}
					} else if (operation === 'get') {
						const resultId = this.getNodeParameter('resultId', i) as string;
						responseData = await checkmarxApiRequest.call(this, 'GET', `/results/${resultId}`) as IDataObject;
					} else if (operation === 'getByProject') {
						const projectId = this.getNodeParameter('projectId', i) as string;
						validateUuid(projectId, 'Project ID');
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i) as IDataObject;
						const query: IDataObject = { 'project-id': projectId };

						if (filters.severity) query.severity = filters.severity;
						if (filters.state) query.state = filters.state;
						if (filters.status) query.status = filters.status;

						if (returnAll) {
							responseData = await checkmarxApiRequestAllItems.call(this, 'GET', '/results', undefined, query);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							query.limit = limit;
							const response = await checkmarxApiRequest.call(this, 'GET', '/results', undefined, query) as IDataObject;
							responseData = (response.results || response) as IDataObject[];
						}
					} else if (operation === 'getSastResults') {
						const scanId = this.getNodeParameter('scanId', i) as string;
						validateUuid(scanId, 'Scan ID');
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i) as IDataObject;
						const query: IDataObject = { 'scan-id': scanId, type: 'sast' };

						if (filters.severity) query.severity = filters.severity;
						if (filters.state) query.state = filters.state;

						if (returnAll) {
							responseData = await checkmarxApiRequestAllItems.call(this, 'GET', '/results', undefined, query);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							query.limit = limit;
							const response = await checkmarxApiRequest.call(this, 'GET', '/results', undefined, query) as IDataObject;
							responseData = (response.results || response) as IDataObject[];
						}
					} else if (operation === 'getScaResults') {
						const scanId = this.getNodeParameter('scanId', i) as string;
						validateUuid(scanId, 'Scan ID');
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i) as IDataObject;
						const query: IDataObject = { 'scan-id': scanId, type: 'sca' };

						if (filters.severity) query.severity = filters.severity;
						if (filters.state) query.state = filters.state;

						if (returnAll) {
							responseData = await checkmarxApiRequestAllItems.call(this, 'GET', '/results', undefined, query);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							query.limit = limit;
							const response = await checkmarxApiRequest.call(this, 'GET', '/results', undefined, query) as IDataObject;
							responseData = (response.results || response) as IDataObject[];
						}
					} else if (operation === 'getKicsResults') {
						const scanId = this.getNodeParameter('scanId', i) as string;
						validateUuid(scanId, 'Scan ID');
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i) as IDataObject;
						const query: IDataObject = { 'scan-id': scanId, type: 'kics' };

						if (filters.severity) query.severity = filters.severity;
						if (filters.state) query.state = filters.state;

						if (returnAll) {
							responseData = await checkmarxApiRequestAllItems.call(this, 'GET', '/results', undefined, query);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							query.limit = limit;
							const response = await checkmarxApiRequest.call(this, 'GET', '/results', undefined, query) as IDataObject;
							responseData = (response.results || response) as IDataObject[];
						}
					} else if (operation === 'updateState') {
						const resultId = this.getNodeParameter('resultId', i) as string;
						const state = this.getNodeParameter('state', i) as string;
						const stateComment = this.getNodeParameter('stateComment', i) as string;

						const body: IDataObject = { state };
						if (stateComment) body.comment = stateComment;

						responseData = await checkmarxApiRequest.call(this, 'PATCH', `/results/${resultId}`, body) as IDataObject;
					} else if (operation === 'addComment') {
						const resultId = this.getNodeParameter('resultId', i) as string;
						const comment = this.getNodeParameter('comment', i) as string;

						responseData = await checkmarxApiRequest.call(this, 'POST', `/results/${resultId}/comments`, { comment }) as IDataObject;
					}
				}

				// ==================== GROUP ====================
				else if (resource === 'group') {
					if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i) as IDataObject;
						const query: IDataObject = {};

						if (filters.name) query.name = filters.name;
						if (filters.parentId) query['parent-id'] = filters.parentId;

						if (returnAll) {
							responseData = await checkmarxApiRequestAllItems.call(this, 'GET', '/groups', undefined, query);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							query.limit = limit;
							const response = await checkmarxApiRequest.call(this, 'GET', '/groups', undefined, query) as IDataObject;
							responseData = (response.groups || response.results || response) as IDataObject[];
						}
					} else if (operation === 'get') {
						const groupId = this.getNodeParameter('groupId', i) as string;
						validateUuid(groupId, 'Group ID');
						responseData = await checkmarxApiRequest.call(this, 'GET', `/groups/${groupId}`) as IDataObject;
					} else if (operation === 'create') {
						const name = this.getNodeParameter('name', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body: IDataObject = { name };
						if (additionalFields.parentId) body.parentId = additionalFields.parentId;

						responseData = await checkmarxApiRequest.call(this, 'POST', '/groups', body) as IDataObject;
					} else if (operation === 'update') {
						const groupId = this.getNodeParameter('groupId', i) as string;
						validateUuid(groupId, 'Group ID');
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

						const body: IDataObject = {};
						if (updateFields.name) body.name = updateFields.name;
						if (updateFields.parentId) body.parentId = updateFields.parentId;

						responseData = await checkmarxApiRequest.call(this, 'PUT', `/groups/${groupId}`, body) as IDataObject;
					} else if (operation === 'delete') {
						const groupId = this.getNodeParameter('groupId', i) as string;
						validateUuid(groupId, 'Group ID');
						await checkmarxApiRequest.call(this, 'DELETE', `/groups/${groupId}`);
						responseData = { success: true, groupId };
					} else if (operation === 'getProjects') {
						const groupId = this.getNodeParameter('groupId', i) as string;
						validateUuid(groupId, 'Group ID');
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const query: IDataObject = { 'group-id': groupId };

						if (returnAll) {
							responseData = await checkmarxApiRequestAllItems.call(this, 'GET', '/projects', undefined, query);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							query.limit = limit;
							const response = await checkmarxApiRequest.call(this, 'GET', '/projects', undefined, query) as IDataObject;
							responseData = (response.projects || response.results || response) as IDataObject[];
						}
					} else if (operation === 'getApplications') {
						const groupId = this.getNodeParameter('groupId', i) as string;
						validateUuid(groupId, 'Group ID');
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const query: IDataObject = { 'group-id': groupId };

						if (returnAll) {
							responseData = await checkmarxApiRequestAllItems.call(this, 'GET', '/applications', undefined, query);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							query.limit = limit;
							const response = await checkmarxApiRequest.call(this, 'GET', '/applications', undefined, query) as IDataObject;
							responseData = (response.applications || response.results || response) as IDataObject[];
						}
					}
				}

				// ==================== QUERY ====================
				else if (resource === 'query') {
					if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i) as IDataObject;
						const query: IDataObject = {};

						if (filters.severity) query.severity = filters.severity;
						if (filters.cweId) query['cwe-id'] = filters.cweId;
						if (filters.category) query.category = filters.category;
						if (filters.name) query.name = filters.name;

						if (returnAll) {
							responseData = await checkmarxApiRequestAllItems.call(this, 'GET', '/queries', undefined, query);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							query.limit = limit;
							const response = await checkmarxApiRequest.call(this, 'GET', '/queries', undefined, query) as IDataObject;
							responseData = (response.queries || response.results || response) as IDataObject[];
						}
					} else if (operation === 'get') {
						const queryId = this.getNodeParameter('queryId', i) as string;
						responseData = await checkmarxApiRequest.call(this, 'GET', `/queries/${queryId}`) as IDataObject;
					} else if (operation === 'getByLanguage') {
						const language = this.getNodeParameter('language', i) as string;
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const query: IDataObject = { language };

						if (returnAll) {
							responseData = await checkmarxApiRequestAllItems.call(this, 'GET', '/queries', undefined, query);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							query.limit = limit;
							const response = await checkmarxApiRequest.call(this, 'GET', '/queries', undefined, query) as IDataObject;
							responseData = (response.queries || response.results || response) as IDataObject[];
						}
					} else if (operation === 'getSastQueries') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i) as IDataObject;
						const query: IDataObject = { type: 'sast' };

						if (filters.severity) query.severity = filters.severity;
						if (filters.cweId) query['cwe-id'] = filters.cweId;
						if (filters.category) query.category = filters.category;

						if (returnAll) {
							responseData = await checkmarxApiRequestAllItems.call(this, 'GET', '/queries', undefined, query);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							query.limit = limit;
							const response = await checkmarxApiRequest.call(this, 'GET', '/queries', undefined, query) as IDataObject;
							responseData = (response.queries || response.results || response) as IDataObject[];
						}
					} else if (operation === 'getKicsQueries') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i) as IDataObject;
						const query: IDataObject = { type: 'kics' };

						if (filters.severity) query.severity = filters.severity;
						if (filters.category) query.category = filters.category;

						if (returnAll) {
							responseData = await checkmarxApiRequestAllItems.call(this, 'GET', '/queries', undefined, query);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							query.limit = limit;
							const response = await checkmarxApiRequest.call(this, 'GET', '/queries', undefined, query) as IDataObject;
							responseData = (response.queries || response.results || response) as IDataObject[];
						}
					} else if (operation === 'getPresets') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;

						if (returnAll) {
							responseData = await checkmarxApiRequestAllItems.call(this, 'GET', '/presets');
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							const response = await checkmarxApiRequest.call(this, 'GET', '/presets', undefined, { limit }) as IDataObject;
							responseData = (response.presets || response.results || response) as IDataObject[];
						}
					} else if (operation === 'getCustomQueries') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const query: IDataObject = { custom: true };

						if (returnAll) {
							responseData = await checkmarxApiRequestAllItems.call(this, 'GET', '/queries', undefined, query);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							query.limit = limit;
							const response = await checkmarxApiRequest.call(this, 'GET', '/queries', undefined, query) as IDataObject;
							responseData = (response.queries || response.results || response) as IDataObject[];
						}
					}
				}

				// ==================== REPORT ====================
				else if (resource === 'report') {
					if (operation === 'create') {
						const scanId = this.getNodeParameter('scanId', i) as string;
						validateUuid(scanId, 'Scan ID');
						const reportType = this.getNodeParameter('reportType', i) as string;
						const format = this.getNodeParameter('format', i) as string;
						const additionalOptions = this.getNodeParameter('additionalOptions', i) as IDataObject;

						const body: IDataObject = {
							scanId,
							reportType,
							fileFormat: format,
						};

						if (additionalOptions.projectId) body.projectId = additionalOptions.projectId;
						if (additionalOptions.includeResults !== undefined) body.includeResults = additionalOptions.includeResults;
						if (additionalOptions.sections) body.sections = additionalOptions.sections;
						if (additionalOptions.emailRecipients) {
							body.email = (additionalOptions.emailRecipients as string).split(',').map((e) => e.trim());
						}

						responseData = await checkmarxApiRequest.call(this, 'POST', '/reports', body) as IDataObject;
					} else if (operation === 'get') {
						const reportId = this.getNodeParameter('reportId', i) as string;
						responseData = await checkmarxApiRequest.call(this, 'GET', `/reports/${reportId}`) as IDataObject;
					} else if (operation === 'getStatus') {
						const reportId = this.getNodeParameter('reportId', i) as string;
						const report = await checkmarxApiRequest.call(this, 'GET', `/reports/${reportId}`) as IDataObject;
						responseData = { reportId, status: report.status };
					} else if (operation === 'download') {
						const reportId = this.getNodeParameter('reportId', i) as string;
						const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;

						const reportData = await checkmarxApiDownload.call(this, 'GET', `/reports/${reportId}/download`);

						const newItem: INodeExecutionData = {
							json: { reportId, downloaded: true },
							binary: {
								[binaryPropertyName]: await this.helpers.prepareBinaryData(reportData, `report_${reportId}`),
							},
						};
						returnData.push(newItem);
						continue;
					} else if (operation === 'getAvailableTemplates') {
						responseData = await checkmarxApiRequest.call(this, 'GET', '/reports/templates') as IDataObject;
					}
				}

				// ==================== PRESET ====================
				else if (resource === 'preset') {
					if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i) as IDataObject;
						const query: IDataObject = {};

						if (filters.name) query.name = filters.name;
						if (filters.customOnly) query.custom = true;

						if (returnAll) {
							responseData = await checkmarxApiRequestAllItems.call(this, 'GET', '/presets', undefined, query);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							query.limit = limit;
							const response = await checkmarxApiRequest.call(this, 'GET', '/presets', undefined, query) as IDataObject;
							responseData = (response.presets || response.results || response) as IDataObject[];
						}
					} else if (operation === 'get') {
						const presetId = this.getNodeParameter('presetId', i) as string;
						responseData = await checkmarxApiRequest.call(this, 'GET', `/presets/${presetId}`) as IDataObject;
					} else if (operation === 'create') {
						const name = this.getNodeParameter('name', i) as string;
						const queryIds = this.getNodeParameter('queryIds', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body: IDataObject = {
							name,
							queryIds: queryIds.split(',').map((id) => id.trim()),
						};

						if (additionalFields.description) body.description = additionalFields.description;

						responseData = await checkmarxApiRequest.call(this, 'POST', '/presets', body) as IDataObject;
					} else if (operation === 'update') {
						const presetId = this.getNodeParameter('presetId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

						const body: IDataObject = {};
						if (updateFields.name) body.name = updateFields.name;
						if (updateFields.description) body.description = updateFields.description;
						if (updateFields.queryIds) {
							body.queryIds = (updateFields.queryIds as string).split(',').map((id) => id.trim());
						}

						responseData = await checkmarxApiRequest.call(this, 'PUT', `/presets/${presetId}`, body) as IDataObject;
					} else if (operation === 'delete') {
						const presetId = this.getNodeParameter('presetId', i) as string;
						await checkmarxApiRequest.call(this, 'DELETE', `/presets/${presetId}`);
						responseData = { success: true, presetId };
					} else if (operation === 'clone') {
						const presetId = this.getNodeParameter('presetId', i) as string;
						const newName = this.getNodeParameter('newName', i) as string;

						responseData = await checkmarxApiRequest.call(this, 'POST', `/presets/${presetId}/clone`, { name: newName }) as IDataObject;
					} else if (operation === 'getQueries') {
						const presetId = this.getNodeParameter('presetId', i) as string;
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;

						if (returnAll) {
							responseData = await checkmarxApiRequestAllItems.call(this, 'GET', `/presets/${presetId}/queries`);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							const response = await checkmarxApiRequest.call(this, 'GET', `/presets/${presetId}/queries`, undefined, { limit }) as IDataObject;
							responseData = (response.queries || response.results || response) as IDataObject[];
						}
					}
				}

				// ==================== AUDIT TRAIL ====================
				else if (resource === 'auditTrail') {
					if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i) as IDataObject;
						const query: IDataObject = {};

						if (filters.action) query.action = filters.action;
						if (filters.resourceType) query['resource-type'] = filters.resourceType;
						if (filters.userId) query['user-id'] = filters.userId;

						if (returnAll) {
							responseData = await checkmarxApiRequestAllItems.call(this, 'GET', '/audit', undefined, query);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							query.limit = limit;
							const response = await checkmarxApiRequest.call(this, 'GET', '/audit', undefined, query) as IDataObject;
							responseData = (response.events || response.results || response) as IDataObject[];
						}
					} else if (operation === 'getByDateRange') {
						const startDate = this.getNodeParameter('startDate', i) as string;
						const endDate = this.getNodeParameter('endDate', i) as string;
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const query: IDataObject = {
							'from-date': startDate,
							'to-date': endDate,
						};

						if (returnAll) {
							responseData = await checkmarxApiRequestAllItems.call(this, 'GET', '/audit', undefined, query);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							query.limit = limit;
							const response = await checkmarxApiRequest.call(this, 'GET', '/audit', undefined, query) as IDataObject;
							responseData = (response.events || response.results || response) as IDataObject[];
						}
					} else if (operation === 'getByUser') {
						const userId = this.getNodeParameter('userId', i) as string;
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const query: IDataObject = { 'user-id': userId };

						if (returnAll) {
							responseData = await checkmarxApiRequestAllItems.call(this, 'GET', '/audit', undefined, query);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							query.limit = limit;
							const response = await checkmarxApiRequest.call(this, 'GET', '/audit', undefined, query) as IDataObject;
							responseData = (response.events || response.results || response) as IDataObject[];
						}
					} else if (operation === 'getByAction') {
						const action = this.getNodeParameter('action', i) as string;
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const query: IDataObject = { action };

						if (returnAll) {
							responseData = await checkmarxApiRequestAllItems.call(this, 'GET', '/audit', undefined, query);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							query.limit = limit;
							const response = await checkmarxApiRequest.call(this, 'GET', '/audit', undefined, query) as IDataObject;
							responseData = (response.events || response.results || response) as IDataObject[];
						}
					}
				}

				// ==================== UPLOAD ====================
				else if (resource === 'upload') {
					if (operation === 'generateLink') {
						const projectId = this.getNodeParameter('projectId', i) as string;
						validateUuid(projectId, 'Project ID');

						responseData = await checkmarxApiRequest.call(this, 'POST', '/uploads', { projectId }) as IDataObject;
					} else if (operation === 'uploadSource') {
						const uploadUrl = this.getNodeParameter('uploadUrl', i) as string;
						const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;

						const binaryData = this.helpers.assertBinaryData(i, binaryPropertyName);
						const buffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);

						await checkmarxUploadSource.call(this, uploadUrl, buffer, binaryData.fileName || 'source.zip');
						responseData = { success: true, fileName: binaryData.fileName };
					} else if (operation === 'getUploadStatus') {
						const uploadId = this.getNodeParameter('uploadId', i) as string;
						responseData = await checkmarxApiRequest.call(this, 'GET', `/uploads/${uploadId}`) as IDataObject;
					}
				}

				// ==================== PREDICATE ====================
				else if (resource === 'predicate') {
					if (operation === 'getAll') {
						const projectId = this.getNodeParameter('projectId', i) as string;
						validateUuid(projectId, 'Project ID');
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const query: IDataObject = { 'project-id': projectId };

						if (returnAll) {
							responseData = await checkmarxApiRequestAllItems.call(this, 'GET', '/predicates', undefined, query);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							query.limit = limit;
							const response = await checkmarxApiRequest.call(this, 'GET', '/predicates', undefined, query) as IDataObject;
							responseData = (response.predicates || response.results || response) as IDataObject[];
						}
					} else if (operation === 'create') {
						const projectId = this.getNodeParameter('projectId', i) as string;
						validateUuid(projectId, 'Project ID');
						const similarityId = this.getNodeParameter('similarityId', i) as string;
						const state = this.getNodeParameter('state', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body: IDataObject = {
							projectId,
							similarityId,
							state,
						};

						if (additionalFields.severity) body.severity = additionalFields.severity;
						if (additionalFields.comment) body.comment = additionalFields.comment;

						responseData = await checkmarxApiRequest.call(this, 'POST', '/predicates', body) as IDataObject;
					} else if (operation === 'update') {
						const predicateId = this.getNodeParameter('predicateId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

						const body: IDataObject = {};
						if (updateFields.state) body.state = updateFields.state;
						if (updateFields.severity) body.severity = updateFields.severity;
						if (updateFields.comment) body.comment = updateFields.comment;

						responseData = await checkmarxApiRequest.call(this, 'PUT', `/predicates/${predicateId}`, body) as IDataObject;
					} else if (operation === 'delete') {
						const predicateId = this.getNodeParameter('predicateId', i) as string;
						await checkmarxApiRequest.call(this, 'DELETE', `/predicates/${predicateId}`);
						responseData = { success: true, predicateId };
					} else if (operation === 'applyBulk') {
						const projectId = this.getNodeParameter('projectId', i) as string;
						validateUuid(projectId, 'Project ID');
						const similarityIds = this.getNodeParameter('similarityIds', i) as string;
						const bulkState = this.getNodeParameter('bulkState', i) as string;
						const bulkComment = this.getNodeParameter('bulkComment', i) as string;

						const body: IDataObject = {
							projectId,
							similarityIds: similarityIds.split(',').map((id) => id.trim()),
							state: bulkState,
						};

						if (bulkComment) body.comment = bulkComment;

						responseData = await checkmarxApiRequest.call(this, 'POST', '/predicates/bulk', body) as IDataObject;
					}
				}

				// ==================== CONFIGURATION ====================
				else if (resource === 'configuration') {
					const projectId = this.getNodeParameter('projectId', i) as string;
					validateUuid(projectId, 'Project ID');

					if (operation === 'getProjectConfig') {
						responseData = await checkmarxApiRequest.call(this, 'GET', `/configuration/project`, undefined, { 'project-id': projectId }) as IDataObject;
					} else if (operation === 'updateProjectConfig') {
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;
						const sastOptions = this.getNodeParameter('sastOptions', i) as IDataObject;
						const scaOptions = this.getNodeParameter('scaOptions', i) as IDataObject;
						const kicsOptions = this.getNodeParameter('kicsOptions', i) as IDataObject;

						const body: IDataObject = { projectId };

						if (updateFields.presetName) body.presetName = updateFields.presetName;
						if (updateFields.engineConfiguration) body.engineConfiguration = updateFields.engineConfiguration;
						if (updateFields.exclusions) {
							body.exclusions = (updateFields.exclusions as string).split(',').map((e) => e.trim());
						}
						if (updateFields.incremental !== undefined) body.incremental = updateFields.incremental;

						// SAST options
						if (Object.keys(sastOptions).length > 0) {
							body.sast = sastOptions;
						}

						// SCA options
						if (Object.keys(scaOptions).length > 0) {
							body.sca = scaOptions;
						}

						// KICS options
						if (Object.keys(kicsOptions).length > 0) {
							if (kicsOptions.excludedQueries) {
								(kicsOptions as IDataObject).excludedQueries = (kicsOptions.excludedQueries as string).split(',').map((q) => q.trim());
							}
							body.kics = kicsOptions;
						}

						responseData = await checkmarxApiRequest.call(this, 'PUT', '/configuration/project', body) as IDataObject;
					} else if (operation === 'getSastConfig') {
						responseData = await checkmarxApiRequest.call(this, 'GET', '/configuration/sast', undefined, { 'project-id': projectId }) as IDataObject;
					} else if (operation === 'getScaConfig') {
						responseData = await checkmarxApiRequest.call(this, 'GET', '/configuration/sca', undefined, { 'project-id': projectId }) as IDataObject;
					} else if (operation === 'getKicsConfig') {
						responseData = await checkmarxApiRequest.call(this, 'GET', '/configuration/kics', undefined, { 'project-id': projectId }) as IDataObject;
					} else if (operation === 'getEngineConfigs') {
						responseData = await checkmarxApiRequest.call(this, 'GET', '/configuration/engines', undefined, { 'project-id': projectId }) as IDataObject;
					}
				}

				// Add response data to return
				if (Array.isArray(responseData)) {
					returnData.push(...responseData.map((item) => ({ json: item })));
				} else {
					returnData.push({ json: responseData });
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: (error as Error).message } });
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
