/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const predicateOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['predicate'],
			},
		},
		options: [
			{
				name: 'Apply Bulk',
				value: 'applyBulk',
				description: 'Apply state changes to multiple results',
				action: 'Apply bulk state changes',
			},
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new predicate (bulk state change rule)',
				action: 'Create a predicate',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a predicate',
				action: 'Delete a predicate',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get all predicates for a project',
				action: 'Get many predicates',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a predicate',
				action: 'Update a predicate',
			},
		],
		default: 'getAll',
	},
];

export const predicateFields: INodeProperties[] = [
	// ----------------------------------
	//         predicate: getAll, create
	// ----------------------------------
	{
		displayName: 'Project ID',
		name: 'projectId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['predicate'],
				operation: ['getAll', 'create'],
			},
		},
		description: 'The UUID of the project',
	},

	// ----------------------------------
	//         predicate: create
	// ----------------------------------
	{
		displayName: 'Similarity ID',
		name: 'similarityId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['predicate'],
				operation: ['create'],
			},
		},
		description: 'The similarity ID for matching results',
	},
	{
		displayName: 'State',
		name: 'state',
		type: 'options',
		required: true,
		options: [
			{ name: 'Confirmed', value: 'CONFIRMED' },
			{ name: 'Not Exploitable', value: 'NOT_EXPLOITABLE' },
			{ name: 'To Verify', value: 'TO_VERIFY' },
			{ name: 'Urgent', value: 'URGENT' },
		],
		default: 'TO_VERIFY',
		displayOptions: {
			show: {
				resource: ['predicate'],
				operation: ['create'],
			},
		},
		description: 'The state to apply to matching results',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['predicate'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Comment',
				name: 'comment',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				default: '',
				description: 'Comment explaining the state change',
			},
			{
				displayName: 'Severity',
				name: 'severity',
				type: 'options',
				options: [
					{ name: 'High', value: 'HIGH' },
					{ name: 'Info', value: 'INFO' },
					{ name: 'Low', value: 'LOW' },
					{ name: 'Medium', value: 'MEDIUM' },
				],
				default: '',
				description: 'Override severity for matching results',
			},
		],
	},

	// ----------------------------------
	//         predicate: update, delete
	// ----------------------------------
	{
		displayName: 'Predicate ID',
		name: 'predicateId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['predicate'],
				operation: ['update', 'delete'],
			},
		},
		description: 'The UUID of the predicate',
	},

	// ----------------------------------
	//         predicate: update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['predicate'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Comment',
				name: 'comment',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				default: '',
				description: 'Comment explaining the state change',
			},
			{
				displayName: 'Severity',
				name: 'severity',
				type: 'options',
				options: [
					{ name: 'High', value: 'HIGH' },
					{ name: 'Info', value: 'INFO' },
					{ name: 'Low', value: 'LOW' },
					{ name: 'Medium', value: 'MEDIUM' },
				],
				default: '',
				description: 'Override severity for matching results',
			},
			{
				displayName: 'State',
				name: 'state',
				type: 'options',
				options: [
					{ name: 'Confirmed', value: 'CONFIRMED' },
					{ name: 'Not Exploitable', value: 'NOT_EXPLOITABLE' },
					{ name: 'To Verify', value: 'TO_VERIFY' },
					{ name: 'Urgent', value: 'URGENT' },
				],
				default: '',
				description: 'The state to apply to matching results',
			},
		],
	},

	// ----------------------------------
	//         predicate: applyBulk
	// ----------------------------------
	{
		displayName: 'Project ID',
		name: 'projectId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['predicate'],
				operation: ['applyBulk'],
			},
		},
		description: 'The UUID of the project',
	},
	{
		displayName: 'Similarity IDs',
		name: 'similarityIds',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['predicate'],
				operation: ['applyBulk'],
			},
		},
		description: 'Comma-separated list of similarity IDs to update',
	},
	{
		displayName: 'State',
		name: 'bulkState',
		type: 'options',
		required: true,
		options: [
			{ name: 'Confirmed', value: 'CONFIRMED' },
			{ name: 'Not Exploitable', value: 'NOT_EXPLOITABLE' },
			{ name: 'To Verify', value: 'TO_VERIFY' },
			{ name: 'Urgent', value: 'URGENT' },
		],
		default: 'TO_VERIFY',
		displayOptions: {
			show: {
				resource: ['predicate'],
				operation: ['applyBulk'],
			},
		},
		description: 'The state to apply to all matching results',
	},
	{
		displayName: 'Comment',
		name: 'bulkComment',
		type: 'string',
		typeOptions: {
			rows: 4,
		},
		default: '',
		displayOptions: {
			show: {
				resource: ['predicate'],
				operation: ['applyBulk'],
			},
		},
		description: 'Comment explaining the bulk state change',
	},

	// ----------------------------------
	//         predicate: getAll pagination
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['predicate'],
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
				resource: ['predicate'],
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
];
