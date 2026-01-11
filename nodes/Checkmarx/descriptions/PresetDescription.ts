/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const presetOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['preset'],
			},
		},
		options: [
			{
				name: 'Clone',
				value: 'clone',
				description: 'Clone an existing preset',
				action: 'Clone a preset',
			},
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new custom preset',
				action: 'Create a preset',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a preset',
				action: 'Delete a preset',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a preset by ID',
				action: 'Get a preset',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many presets',
				action: 'Get many presets',
			},
			{
				name: 'Get Queries',
				value: 'getQueries',
				description: 'Get queries included in a preset',
				action: 'Get queries in a preset',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a preset',
				action: 'Update a preset',
			},
		],
		default: 'getAll',
	},
];

export const presetFields: INodeProperties[] = [
	// ----------------------------------
	//         preset: create
	// ----------------------------------
	{
		displayName: 'Preset Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['preset'],
				operation: ['create'],
			},
		},
		description: 'The name of the preset to create',
	},
	{
		displayName: 'Query IDs',
		name: 'queryIds',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['preset'],
				operation: ['create'],
			},
		},
		description: 'Comma-separated list of query IDs to include in the preset',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['preset'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				default: '',
				description: 'Description of the preset',
			},
		],
	},

	// ----------------------------------
	//         preset: get, delete, update, getQueries
	// ----------------------------------
	{
		displayName: 'Preset ID',
		name: 'presetId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['preset'],
				operation: ['get', 'delete', 'update', 'getQueries', 'clone'],
			},
		},
		description: 'The UUID of the preset',
	},

	// ----------------------------------
	//         preset: clone
	// ----------------------------------
	{
		displayName: 'New Preset Name',
		name: 'newName',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['preset'],
				operation: ['clone'],
			},
		},
		description: 'The name for the cloned preset',
	},

	// ----------------------------------
	//         preset: getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['preset'],
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
				resource: ['preset'],
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
				resource: ['preset'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Custom Only',
				name: 'customOnly',
				type: 'boolean',
				default: false,
				description: 'Whether to only return custom presets',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Filter by preset name (partial match)',
			},
		],
	},

	// ----------------------------------
	//         preset: update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['preset'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				default: '',
				description: 'Description of the preset',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'New name for the preset',
			},
			{
				displayName: 'Query IDs',
				name: 'queryIds',
				type: 'string',
				default: '',
				description: 'Comma-separated list of query IDs to include in the preset',
			},
		],
	},

	// ----------------------------------
	//         preset: getQueries pagination
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['preset'],
				operation: ['getQueries'],
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
				resource: ['preset'],
				operation: ['getQueries'],
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
];
