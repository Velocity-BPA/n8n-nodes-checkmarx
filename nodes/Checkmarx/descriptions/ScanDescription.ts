/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const scanOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['scan'],
			},
		},
		options: [
			{
				name: 'Cancel',
				value: 'cancel',
				description: 'Cancel a running scan',
				action: 'Cancel a scan',
			},
			{
				name: 'Create',
				value: 'create',
				description: 'Run a new scan',
				action: 'Create a scan',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a scan',
				action: 'Delete a scan',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a scan by ID',
				action: 'Get a scan',
			},
			{
				name: 'Get Logs',
				value: 'getLogs',
				description: 'Get scan logs',
				action: 'Get scan logs',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many scans',
				action: 'Get many scans',
			},
			{
				name: 'Get Status',
				value: 'getStatus',
				description: 'Get scan status',
				action: 'Get scan status',
			},
			{
				name: 'Get Summary',
				value: 'getSummary',
				description: 'Get scan results summary',
				action: 'Get scan summary',
			},
			{
				name: 'Get Workflow',
				value: 'getWorkflow',
				description: 'Get scan workflow steps',
				action: 'Get scan workflow',
			},
		],
		default: 'getAll',
	},
];

export const scanFields: INodeProperties[] = [
	// ----------------------------------
	//         scan: create
	// ----------------------------------
	{
		displayName: 'Project ID',
		name: 'projectId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['scan'],
				operation: ['create'],
			},
		},
		description: 'The UUID of the project to scan',
	},
	{
		displayName: 'Source Type',
		name: 'sourceType',
		type: 'options',
		required: true,
		options: [
			{
				name: 'Git Repository',
				value: 'git',
				description: 'Scan from a Git repository',
			},
			{
				name: 'Uploaded Source',
				value: 'upload',
				description: 'Scan from uploaded source code',
			},
		],
		default: 'git',
		displayOptions: {
			show: {
				resource: ['scan'],
				operation: ['create'],
			},
		},
		description: 'The source type for the scan',
	},
	{
		displayName: 'Repository URL',
		name: 'repoUrl',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['scan'],
				operation: ['create'],
				sourceType: ['git'],
			},
		},
		description: 'The URL of the Git repository to scan',
	},
	{
		displayName: 'Branch',
		name: 'branch',
		type: 'string',
		default: 'main',
		displayOptions: {
			show: {
				resource: ['scan'],
				operation: ['create'],
			},
		},
		description: 'The branch to scan',
	},
	{
		displayName: 'Upload ID',
		name: 'uploadId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['scan'],
				operation: ['create'],
				sourceType: ['upload'],
			},
		},
		description: 'The ID from the upload operation',
	},
	{
		displayName: 'Scan Engines',
		name: 'engines',
		type: 'multiOptions',
		options: [
			{
				name: 'API Security',
				value: 'apisec',
			},
			{
				name: 'KICS (IaC)',
				value: 'kics',
			},
			{
				name: 'SAST',
				value: 'sast',
			},
			{
				name: 'SCA',
				value: 'sca',
			},
		],
		default: ['sast'],
		displayOptions: {
			show: {
				resource: ['scan'],
				operation: ['create'],
			},
		},
		description: 'The scanning engines to use',
	},
	{
		displayName: 'Additional Options',
		name: 'additionalOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['scan'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Incremental Scan',
				name: 'incremental',
				type: 'boolean',
				default: false,
				description: 'Whether to perform an incremental scan (SAST only)',
			},
			{
				displayName: 'Preset Name',
				name: 'presetName',
				type: 'string',
				default: '',
				description: 'SAST preset name to use',
			},
			{
				displayName: 'Tags',
				name: 'tags',
				type: 'string',
				default: '',
				description: 'Tags in key=value format, comma-separated',
			},
		],
	},

	// ----------------------------------
	//         scan: get, delete, cancel, getStatus, getWorkflow, getLogs, getSummary
	// ----------------------------------
	{
		displayName: 'Scan ID',
		name: 'scanId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['scan'],
				operation: ['get', 'delete', 'cancel', 'getStatus', 'getWorkflow', 'getLogs', 'getSummary'],
			},
		},
		description: 'The UUID of the scan',
	},

	// ----------------------------------
	//         scan: getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['scan'],
				operation: ['getAll'],
			},
		},
		default: false,
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['scan'],
				operation: ['getAll'],
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 1,
			maxValue: 100,
		},
		default: 50,
		description: 'Max number of results to return',
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['scan'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Branch',
				name: 'branch',
				type: 'string',
				default: '',
				description: 'Filter by branch name',
			},
			{
				displayName: 'Project ID',
				name: 'projectId',
				type: 'string',
				default: '',
				description: 'Filter by project ID',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'Canceled', value: 'Canceled' },
					{ name: 'Completed', value: 'Completed' },
					{ name: 'Failed', value: 'Failed' },
					{ name: 'Partial', value: 'Partial' },
					{ name: 'Queued', value: 'Queued' },
					{ name: 'Running', value: 'Running' },
				],
				default: '',
				description: 'Filter by scan status',
			},
			{
				displayName: 'Tag Key',
				name: 'tagKey',
				type: 'string',
				default: '',
				description: 'Filter by tag key',
			},
			{
				displayName: 'Tag Value',
				name: 'tagValue',
				type: 'string',
				default: '',
				description: 'Filter by tag value',
			},
		],
	},
];
