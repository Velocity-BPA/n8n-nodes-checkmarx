/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const reportOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['report'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Generate a new report',
				action: 'Create a report',
			},
			{
				name: 'Download',
				value: 'download',
				description: 'Download a generated report',
				action: 'Download a report',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a report by ID',
				action: 'Get a report',
			},
			{
				name: 'Get Available Templates',
				value: 'getAvailableTemplates',
				description: 'List available report templates',
				action: 'Get available templates',
			},
			{
				name: 'Get Status',
				value: 'getStatus',
				description: 'Check report generation status',
				action: 'Get report status',
			},
		],
		default: 'create',
	},
];

export const reportFields: INodeProperties[] = [
	// ----------------------------------
	//         report: create
	// ----------------------------------
	{
		displayName: 'Scan ID',
		name: 'scanId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['report'],
				operation: ['create'],
			},
		},
		description: 'The UUID of the scan to generate a report for',
	},
	{
		displayName: 'Report Type',
		name: 'reportType',
		type: 'options',
		required: true,
		options: [
			{
				name: 'Executive Summary',
				value: 'ExecutiveSummary',
				description: 'High-level summary report',
			},
			{
				name: 'Risk Report',
				value: 'RiskReport',
				description: 'Risk assessment report',
			},
			{
				name: 'Scan Report',
				value: 'ScanReport',
				description: 'Detailed scan results report',
			},
		],
		default: 'ScanReport',
		displayOptions: {
			show: {
				resource: ['report'],
				operation: ['create'],
			},
		},
		description: 'The type of report to generate',
	},
	{
		displayName: 'Format',
		name: 'format',
		type: 'options',
		required: true,
		options: [
			{ name: 'CSV', value: 'csv' },
			{ name: 'JSON', value: 'json' },
			{ name: 'PDF', value: 'pdf' },
			{ name: 'SARIF', value: 'sarif' },
			{ name: 'XML', value: 'xml' },
		],
		default: 'pdf',
		displayOptions: {
			show: {
				resource: ['report'],
				operation: ['create'],
			},
		},
		description: 'The format of the report',
	},
	{
		displayName: 'Additional Options',
		name: 'additionalOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['report'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Email Recipients',
				name: 'emailRecipients',
				type: 'string',
				default: '',
				description: 'Comma-separated email addresses to send the report to',
			},
			{
				displayName: 'Include Results',
				name: 'includeResults',
				type: 'boolean',
				default: true,
				description: 'Whether to include detailed results in the report',
			},
			{
				displayName: 'Project ID',
				name: 'projectId',
				type: 'string',
				default: '',
				description: 'Project ID for aggregate reports',
			},
			{
				displayName: 'Sections',
				name: 'sections',
				type: 'multiOptions',
				options: [
					{ name: 'Compliance', value: 'compliance' },
					{ name: 'Executive Summary', value: 'executiveSummary' },
					{ name: 'Overview', value: 'overview' },
					{ name: 'Results', value: 'results' },
					{ name: 'Scan Info', value: 'scanInfo' },
				],
				default: ['executiveSummary', 'scanInfo', 'results'],
				description: 'Report sections to include',
			},
		],
	},

	// ----------------------------------
	//         report: get, getStatus, download
	// ----------------------------------
	{
		displayName: 'Report ID',
		name: 'reportId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['report'],
				operation: ['get', 'getStatus', 'download'],
			},
		},
		description: 'The UUID of the report',
	},

	// ----------------------------------
	//         report: download
	// ----------------------------------
	{
		displayName: 'Binary Property',
		name: 'binaryPropertyName',
		type: 'string',
		default: 'data',
		displayOptions: {
			show: {
				resource: ['report'],
				operation: ['download'],
			},
		},
		description: 'Name of the binary property to which the file will be written',
	},
];
