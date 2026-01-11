/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const auditTrailOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['auditTrail'],
			},
		},
		options: [
			{
				name: 'Get by Action',
				value: 'getByAction',
				description: 'Get audit events by action type',
				action: 'Get events by action',
			},
			{
				name: 'Get by Date Range',
				value: 'getByDateRange',
				description: 'Get audit events within a date range',
				action: 'Get events by date range',
			},
			{
				name: 'Get by User',
				value: 'getByUser',
				description: 'Get audit events by user',
				action: 'Get events by user',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many audit events',
				action: 'Get many events',
			},
		],
		default: 'getAll',
	},
];

export const auditTrailFields: INodeProperties[] = [
	// ----------------------------------
	//         auditTrail: getByDateRange
	// ----------------------------------
	{
		displayName: 'Start Date',
		name: 'startDate',
		type: 'dateTime',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['auditTrail'],
				operation: ['getByDateRange'],
			},
		},
		description: 'Start of the date range',
	},
	{
		displayName: 'End Date',
		name: 'endDate',
		type: 'dateTime',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['auditTrail'],
				operation: ['getByDateRange'],
			},
		},
		description: 'End of the date range',
	},

	// ----------------------------------
	//         auditTrail: getByUser
	// ----------------------------------
	{
		displayName: 'User ID',
		name: 'userId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['auditTrail'],
				operation: ['getByUser'],
			},
		},
		description: 'The UUID of the user to filter by',
	},

	// ----------------------------------
	//         auditTrail: getByAction
	// ----------------------------------
	{
		displayName: 'Action Type',
		name: 'action',
		type: 'options',
		required: true,
		options: [
			{ name: 'Create', value: 'CREATE' },
			{ name: 'Delete', value: 'DELETE' },
			{ name: 'Login', value: 'LOGIN' },
			{ name: 'Scan', value: 'SCAN' },
			{ name: 'Update', value: 'UPDATE' },
		],
		default: 'CREATE',
		displayOptions: {
			show: {
				resource: ['auditTrail'],
				operation: ['getByAction'],
			},
		},
		description: 'The action type to filter by',
	},

	// ----------------------------------
	//         auditTrail: all operations pagination
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['auditTrail'],
				operation: ['getAll', 'getByDateRange', 'getByUser', 'getByAction'],
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
				resource: ['auditTrail'],
				operation: ['getAll', 'getByDateRange', 'getByUser', 'getByAction'],
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
				resource: ['auditTrail'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Action',
				name: 'action',
				type: 'options',
				options: [
					{ name: 'Create', value: 'CREATE' },
					{ name: 'Delete', value: 'DELETE' },
					{ name: 'Login', value: 'LOGIN' },
					{ name: 'Scan', value: 'SCAN' },
					{ name: 'Update', value: 'UPDATE' },
				],
				default: '',
				description: 'Filter by action type',
			},
			{
				displayName: 'Resource Type',
				name: 'resourceType',
				type: 'options',
				options: [
					{ name: 'Application', value: 'APPLICATION' },
					{ name: 'Group', value: 'GROUP' },
					{ name: 'Project', value: 'PROJECT' },
					{ name: 'Scan', value: 'SCAN' },
				],
				default: '',
				description: 'Filter by resource type',
			},
			{
				displayName: 'User ID',
				name: 'userId',
				type: 'string',
				default: '',
				description: 'Filter by user ID',
			},
		],
	},
];
