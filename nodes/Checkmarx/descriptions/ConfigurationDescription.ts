/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const configurationOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['configuration'],
			},
		},
		options: [
			{
				name: 'Get Engine Configs',
				value: 'getEngineConfigs',
				description: 'Get all engine configurations',
				action: 'Get all engine configs',
			},
			{
				name: 'Get KICS Config',
				value: 'getKicsConfig',
				description: 'Get KICS (IaC) engine configuration',
				action: 'Get KICS config',
			},
			{
				name: 'Get Project Config',
				value: 'getProjectConfig',
				description: 'Get project configuration',
				action: 'Get project config',
			},
			{
				name: 'Get SAST Config',
				value: 'getSastConfig',
				description: 'Get SAST engine configuration',
				action: 'Get SAST config',
			},
			{
				name: 'Get SCA Config',
				value: 'getScaConfig',
				description: 'Get SCA engine configuration',
				action: 'Get SCA config',
			},
			{
				name: 'Update Project Config',
				value: 'updateProjectConfig',
				description: 'Update project configuration',
				action: 'Update project config',
			},
		],
		default: 'getProjectConfig',
	},
];

export const configurationFields: INodeProperties[] = [
	// ----------------------------------
	//         configuration: all operations
	// ----------------------------------
	{
		displayName: 'Project ID',
		name: 'projectId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['configuration'],
				operation: ['getProjectConfig', 'updateProjectConfig', 'getSastConfig', 'getScaConfig', 'getKicsConfig', 'getEngineConfigs'],
			},
		},
		description: 'The UUID of the project',
	},

	// ----------------------------------
	//         configuration: updateProjectConfig
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['configuration'],
				operation: ['updateProjectConfig'],
			},
		},
		options: [
			{
				displayName: 'Engine Configuration ID',
				name: 'engineConfiguration',
				type: 'string',
				default: '',
				description: 'The ID of the engine configuration to use',
			},
			{
				displayName: 'Exclusions',
				name: 'exclusions',
				type: 'string',
				default: '',
				description: 'Comma-separated list of file/folder patterns to exclude from scanning',
			},
			{
				displayName: 'Incremental Scanning',
				name: 'incremental',
				type: 'boolean',
				default: false,
				description: 'Whether to enable incremental scanning (SAST)',
			},
			{
				displayName: 'Preset Name',
				name: 'presetName',
				type: 'string',
				default: '',
				description: 'SAST preset name to use for this project',
			},
		],
	},

	// ----------------------------------
	//         configuration: SAST-specific settings
	// ----------------------------------
	{
		displayName: 'SAST Options',
		name: 'sastOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['configuration'],
				operation: ['updateProjectConfig'],
			},
		},
		options: [
			{
				displayName: 'Enable Fast Scan',
				name: 'fastScanMode',
				type: 'boolean',
				default: false,
				description: 'Whether to enable fast scan mode (less accurate but faster)',
			},
			{
				displayName: 'Engine Verbose Mode',
				name: 'engineVerbose',
				type: 'boolean',
				default: false,
				description: 'Whether to enable verbose engine logging',
			},
			{
				displayName: 'Language Override',
				name: 'languageMode',
				type: 'options',
				options: [
					{ name: 'Auto-Detect', value: 'auto' },
					{ name: 'Multi-Language', value: 'multi' },
					{ name: 'Primary Only', value: 'primary' },
				],
				default: 'auto',
				description: 'Language detection mode',
			},
		],
	},

	// ----------------------------------
	//         configuration: SCA-specific settings
	// ----------------------------------
	{
		displayName: 'SCA Options',
		name: 'scaOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['configuration'],
				operation: ['updateProjectConfig'],
			},
		},
		options: [
			{
				displayName: 'Enable Exploitable Path',
				name: 'exploitablePath',
				type: 'boolean',
				default: true,
				description: 'Whether to enable exploitable path analysis',
			},
			{
				displayName: 'Last SAST Scan Time',
				name: 'lastSastScanTime',
				type: 'string',
				default: '',
				description: 'Reference time for incremental SCA scan',
			},
		],
	},

	// ----------------------------------
	//         configuration: KICS-specific settings
	// ----------------------------------
	{
		displayName: 'KICS Options',
		name: 'kicsOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['configuration'],
				operation: ['updateProjectConfig'],
			},
		},
		options: [
			{
				displayName: 'Excluded Queries',
				name: 'excludedQueries',
				type: 'string',
				default: '',
				description: 'Comma-separated list of KICS query IDs to exclude',
			},
			{
				displayName: 'Platforms',
				name: 'platforms',
				type: 'multiOptions',
				options: [
					{ name: 'Ansible', value: 'Ansible' },
					{ name: 'AWS CloudFormation', value: 'CloudFormation' },
					{ name: 'Azure Resource Manager', value: 'AzureResourceManager' },
					{ name: 'Docker', value: 'Dockerfile' },
					{ name: 'Google Deployment Manager', value: 'GoogleDeploymentManager' },
					{ name: 'Kubernetes', value: 'Kubernetes' },
					{ name: 'OpenAPI', value: 'OpenAPI' },
					{ name: 'Pulumi', value: 'Pulumi' },
					{ name: 'Terraform', value: 'Terraform' },
				],
				default: [],
				description: 'IaC platforms to scan',
			},
		],
	},
];
