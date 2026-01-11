/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const projectOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['project'],
			},
		},
		options: [
			{
				name: 'Add Tag',
				value: 'addTag',
				description: 'Add a tag to a project',
				action: 'Add tag to a project',
			},
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new project',
				action: 'Create a project',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a project',
				action: 'Delete a project',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a project by ID',
				action: 'Get a project',
			},
			{
				name: 'Get Branches',
				value: 'getBranches',
				description: 'Get branches for a project',
				action: 'Get branches for a project',
			},
			{
				name: 'Get Last Scan',
				value: 'getLastScan',
				description: 'Get the most recent scan for a project',
				action: 'Get last scan for a project',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many projects',
				action: 'Get many projects',
			},
			{
				name: 'Get Tags',
				value: 'getTags',
				description: 'Get tags for a project',
				action: 'Get tags for a project',
			},
			{
				name: 'Remove Tag',
				value: 'removeTag',
				description: 'Remove a tag from a project',
				action: 'Remove tag from a project',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a project',
				action: 'Update a project',
			},
		],
		default: 'getAll',
	},
];

export const projectFields: INodeProperties[] = [
	// ----------------------------------
	//         project: create
	// ----------------------------------
	{
		displayName: 'Project Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['project'],
				operation: ['create'],
			},
		},
		description: 'The name of the project to create',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['project'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Criticality',
				name: 'criticality',
				type: 'number',
				typeOptions: {
					minValue: 1,
					maxValue: 5,
				},
				default: 3,
				description: 'Project criticality level (1-5)',
			},
			{
				displayName: 'Group IDs',
				name: 'groups',
				type: 'string',
				default: '',
				description: 'Comma-separated list of group IDs to assign the project to',
			},
			{
				displayName: 'Main Branch',
				name: 'mainBranch',
				type: 'string',
				default: 'main',
				description: 'The main branch of the repository',
			},
			{
				displayName: 'Origin',
				name: 'origin',
				type: 'options',
				options: [
					{ name: 'API', value: 'API' },
					{ name: 'Azure', value: 'AZURE' },
					{ name: 'Bitbucket', value: 'BITBUCKET' },
					{ name: 'GitHub', value: 'GITHUB' },
					{ name: 'GitLab', value: 'GITLAB' },
				],
				default: 'API',
				description: 'The origin/source of the project',
			},
			{
				displayName: 'Repository URL',
				name: 'repoUrl',
				type: 'string',
				default: '',
				description: 'The URL of the repository',
			},
			{
				displayName: 'Tags',
				name: 'tags',
				type: 'string',
				default: '',
				description: 'Tags in key=value format, comma-separated (e.g., "env=prod, team=security")',
			},
		],
	},

	// ----------------------------------
	//         project: get
	// ----------------------------------
	{
		displayName: 'Project ID',
		name: 'projectId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['project'],
				operation: ['get', 'delete', 'update', 'getTags', 'addTag', 'removeTag', 'getBranches', 'getLastScan'],
			},
		},
		description: 'The UUID of the project',
	},

	// ----------------------------------
	//         project: getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['project'],
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
				resource: ['project'],
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
				resource: ['project'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Group ID',
				name: 'groupId',
				type: 'string',
				default: '',
				description: 'Filter by group ID',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Filter by project name (partial match)',
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

	// ----------------------------------
	//         project: update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['project'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Criticality',
				name: 'criticality',
				type: 'number',
				typeOptions: {
					minValue: 1,
					maxValue: 5,
				},
				default: 3,
				description: 'Project criticality level (1-5)',
			},
			{
				displayName: 'Group IDs',
				name: 'groups',
				type: 'string',
				default: '',
				description: 'Comma-separated list of group IDs',
			},
			{
				displayName: 'Main Branch',
				name: 'mainBranch',
				type: 'string',
				default: '',
				description: 'The main branch of the repository',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'New name for the project',
			},
			{
				displayName: 'Repository URL',
				name: 'repoUrl',
				type: 'string',
				default: '',
				description: 'The URL of the repository',
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
	//         project: addTag/removeTag
	// ----------------------------------
	{
		displayName: 'Tag Key',
		name: 'tagKey',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['project'],
				operation: ['addTag', 'removeTag'],
			},
		},
		description: 'The key of the tag',
	},
	{
		displayName: 'Tag Value',
		name: 'tagValue',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['project'],
				operation: ['addTag'],
			},
		},
		description: 'The value of the tag',
	},
];
