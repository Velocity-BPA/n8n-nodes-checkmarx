/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const applicationOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['application'],
			},
		},
		options: [
			{
				name: 'Add Project',
				value: 'addProject',
				description: 'Add a project to an application',
				action: 'Add project to an application',
			},
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new application',
				action: 'Create an application',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete an application',
				action: 'Delete an application',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get an application by ID',
				action: 'Get an application',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many applications',
				action: 'Get many applications',
			},
			{
				name: 'Get Projects',
				value: 'getProjects',
				description: 'Get projects in an application',
				action: 'Get projects in an application',
			},
			{
				name: 'Get Rules',
				value: 'getRules',
				description: 'Get application rules',
				action: 'Get application rules',
			},
			{
				name: 'Remove Project',
				value: 'removeProject',
				description: 'Remove a project from an application',
				action: 'Remove project from an application',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update an application',
				action: 'Update an application',
			},
		],
		default: 'getAll',
	},
];

export const applicationFields: INodeProperties[] = [
	// ----------------------------------
	//         application: create
	// ----------------------------------
	{
		displayName: 'Application Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['application'],
				operation: ['create'],
			},
		},
		description: 'The name of the application to create',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['application'],
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
				description: 'Application criticality level (1-5)',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				default: '',
				description: 'Description of the application',
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
	//         application: get, delete, update, getProjects, getRules
	// ----------------------------------
	{
		displayName: 'Application ID',
		name: 'applicationId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['application'],
				operation: ['get', 'delete', 'update', 'getProjects', 'getRules', 'addProject', 'removeProject'],
			},
		},
		description: 'The UUID of the application',
	},

	// ----------------------------------
	//         application: getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['application'],
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
				resource: ['application'],
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
				resource: ['application'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Filter by application name (partial match)',
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
	//         application: update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['application'],
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
				description: 'Application criticality level (1-5)',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				default: '',
				description: 'Description of the application',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'New name for the application',
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
	//         application: addProject/removeProject
	// ----------------------------------
	{
		displayName: 'Project ID',
		name: 'projectId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['application'],
				operation: ['addProject', 'removeProject'],
			},
		},
		description: 'The UUID of the project to add or remove',
	},
];
