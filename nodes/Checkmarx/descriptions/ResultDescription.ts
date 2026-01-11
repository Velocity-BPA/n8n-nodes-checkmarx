/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const resultOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['result'],
			},
		},
		options: [
			{
				name: 'Add Comment',
				value: 'addComment',
				description: 'Add a comment to a result',
				action: 'Add comment to a result',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a result by ID',
				action: 'Get a result',
			},
			{
				name: 'Get by Project',
				value: 'getByProject',
				description: 'Get results across project scans',
				action: 'Get results by project',
			},
			{
				name: 'Get by Scan',
				value: 'getByScan',
				description: 'Get results for a specific scan',
				action: 'Get results by scan',
			},
			{
				name: 'Get KICS Results',
				value: 'getKicsResults',
				description: 'Get KICS-specific results',
				action: 'Get KICS results',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many results',
				action: 'Get many results',
			},
			{
				name: 'Get SAST Results',
				value: 'getSastResults',
				description: 'Get SAST-specific results',
				action: 'Get SAST results',
			},
			{
				name: 'Get SCA Results',
				value: 'getScaResults',
				description: 'Get SCA-specific results',
				action: 'Get SCA results',
			},
			{
				name: 'Update State',
				value: 'updateState',
				description: 'Update result state (confirmed, not-exploitable, etc.)',
				action: 'Update result state',
			},
		],
		default: 'getByScan',
	},
];

export const resultFields: INodeProperties[] = [
	// ----------------------------------
	//         result: get
	// ----------------------------------
	{
		displayName: 'Result ID',
		name: 'resultId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['result'],
				operation: ['get', 'updateState', 'addComment'],
			},
		},
		description: 'The UUID of the result',
	},

	// ----------------------------------
	//         result: getByScan, getSastResults, getScaResults, getKicsResults
	// ----------------------------------
	{
		displayName: 'Scan ID',
		name: 'scanId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['result'],
				operation: ['getByScan', 'getSastResults', 'getScaResults', 'getKicsResults'],
			},
		},
		description: 'The UUID of the scan',
	},

	// ----------------------------------
	//         result: getByProject
	// ----------------------------------
	{
		displayName: 'Project ID',
		name: 'projectId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['result'],
				operation: ['getByProject'],
			},
		},
		description: 'The UUID of the project',
	},

	// ----------------------------------
	//         result: getAll, getByScan, getByProject, getSastResults, getScaResults, getKicsResults
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['result'],
				operation: ['getAll', 'getByScan', 'getByProject', 'getSastResults', 'getScaResults', 'getKicsResults'],
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
				resource: ['result'],
				operation: ['getAll', 'getByScan', 'getByProject', 'getSastResults', 'getScaResults', 'getKicsResults'],
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
				resource: ['result'],
				operation: ['getAll', 'getByScan', 'getByProject', 'getSastResults', 'getScaResults', 'getKicsResults'],
			},
		},
		options: [
			{
				displayName: 'Query ID',
				name: 'queryId',
				type: 'string',
				default: '',
				description: 'Filter by query/rule ID',
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
				description: 'Filter by severity',
			},
			{
				displayName: 'Source File',
				name: 'sourceFile',
				type: 'string',
				default: '',
				description: 'Filter by source file path',
			},
			{
				displayName: 'State',
				name: 'state',
				type: 'options',
				options: [
					{ name: 'Confirmed', value: 'CONFIRMED' },
					{ name: 'Not Exploitable', value: 'NOT_EXPLOITABLE' },
					{ name: 'Proposed Not Exploitable', value: 'PROPOSED_NOT_EXPLOITABLE' },
					{ name: 'To Verify', value: 'TO_VERIFY' },
					{ name: 'Urgent', value: 'URGENT' },
				],
				default: '',
				description: 'Filter by result state',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'Fixed', value: 'FIXED' },
					{ name: 'New', value: 'NEW' },
					{ name: 'Recurrent', value: 'RECURRENT' },
				],
				default: '',
				description: 'Filter by result status',
			},
		],
	},

	// ----------------------------------
	//         result: updateState
	// ----------------------------------
	{
		displayName: 'State',
		name: 'state',
		type: 'options',
		required: true,
		options: [
			{ name: 'Confirmed', value: 'CONFIRMED' },
			{ name: 'Not Exploitable', value: 'NOT_EXPLOITABLE' },
			{ name: 'Proposed Not Exploitable', value: 'PROPOSED_NOT_EXPLOITABLE' },
			{ name: 'To Verify', value: 'TO_VERIFY' },
			{ name: 'Urgent', value: 'URGENT' },
		],
		default: 'TO_VERIFY',
		displayOptions: {
			show: {
				resource: ['result'],
				operation: ['updateState'],
			},
		},
		description: 'The new state for the result',
	},
	{
		displayName: 'Comment',
		name: 'stateComment',
		type: 'string',
		typeOptions: {
			rows: 4,
		},
		default: '',
		displayOptions: {
			show: {
				resource: ['result'],
				operation: ['updateState'],
			},
		},
		description: 'Comment explaining the state change',
	},

	// ----------------------------------
	//         result: addComment
	// ----------------------------------
	{
		displayName: 'Comment',
		name: 'comment',
		type: 'string',
		required: true,
		typeOptions: {
			rows: 4,
		},
		default: '',
		displayOptions: {
			show: {
				resource: ['result'],
				operation: ['addComment'],
			},
		},
		description: 'The comment to add',
	},
];
