/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const queryOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['query'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get a query by ID',
				action: 'Get a query',
			},
			{
				name: 'Get by Language',
				value: 'getByLanguage',
				description: 'Get queries for a specific language',
				action: 'Get queries by language',
			},
			{
				name: 'Get Custom Queries',
				value: 'getCustomQueries',
				description: 'Get custom queries',
				action: 'Get custom queries',
			},
			{
				name: 'Get KICS Queries',
				value: 'getKicsQueries',
				description: 'Get KICS (IaC) queries',
				action: 'Get KICS queries',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many queries',
				action: 'Get many queries',
			},
			{
				name: 'Get Presets',
				value: 'getPresets',
				description: 'Get query presets',
				action: 'Get query presets',
			},
			{
				name: 'Get SAST Queries',
				value: 'getSastQueries',
				description: 'Get SAST queries',
				action: 'Get SAST queries',
			},
		],
		default: 'getAll',
	},
];

export const queryFields: INodeProperties[] = [
	// ----------------------------------
	//         query: get
	// ----------------------------------
	{
		displayName: 'Query ID',
		name: 'queryId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['query'],
				operation: ['get'],
			},
		},
		description: 'The UUID of the query',
	},

	// ----------------------------------
	//         query: getByLanguage
	// ----------------------------------
	{
		displayName: 'Language',
		name: 'language',
		type: 'options',
		required: true,
		options: [
			{ name: 'Apex', value: 'Apex' },
			{ name: 'ASP', value: 'ASP' },
			{ name: 'C#', value: 'CSharp' },
			{ name: 'C++', value: 'CPP' },
			{ name: 'Cobol', value: 'Cobol' },
			{ name: 'Go', value: 'Go' },
			{ name: 'Groovy', value: 'Groovy' },
			{ name: 'Java', value: 'Java' },
			{ name: 'JavaScript', value: 'JavaScript' },
			{ name: 'Kotlin', value: 'Kotlin' },
			{ name: 'Objective-C', value: 'Objc' },
			{ name: 'Perl', value: 'Perl' },
			{ name: 'PHP', value: 'PHP' },
			{ name: 'PL/SQL', value: 'PLSQL' },
			{ name: 'Python', value: 'Python' },
			{ name: 'Ruby', value: 'Ruby' },
			{ name: 'Scala', value: 'Scala' },
			{ name: 'Swift', value: 'Swift' },
			{ name: 'TypeScript', value: 'TypeScript' },
			{ name: 'VB.NET', value: 'VbNet' },
			{ name: 'VB6', value: 'VB6' },
			{ name: 'VBScript', value: 'VbScript' },
		],
		default: 'JavaScript',
		displayOptions: {
			show: {
				resource: ['query'],
				operation: ['getByLanguage'],
			},
		},
		description: 'The programming language to get queries for',
	},

	// ----------------------------------
	//         query: getAll, getByLanguage, getSastQueries, getKicsQueries, getCustomQueries, getPresets
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['query'],
				operation: ['getAll', 'getByLanguage', 'getSastQueries', 'getKicsQueries', 'getCustomQueries', 'getPresets'],
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
				resource: ['query'],
				operation: ['getAll', 'getByLanguage', 'getSastQueries', 'getKicsQueries', 'getCustomQueries', 'getPresets'],
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
				resource: ['query'],
				operation: ['getAll', 'getSastQueries', 'getKicsQueries'],
			},
		},
		options: [
			{
				displayName: 'Category',
				name: 'category',
				type: 'string',
				default: '',
				description: 'Filter by query category',
			},
			{
				displayName: 'CWE ID',
				name: 'cweId',
				type: 'string',
				default: '',
				description: 'Filter by CWE identifier (e.g., "CWE-79")',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Filter by query name (partial match)',
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
		],
	},
];
