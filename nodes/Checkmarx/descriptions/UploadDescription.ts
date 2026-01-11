/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const uploadOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['upload'],
			},
		},
		options: [
			{
				name: 'Generate Upload Link',
				value: 'generateLink',
				description: 'Generate an upload link for source code',
				action: 'Generate upload link',
			},
			{
				name: 'Get Upload Status',
				value: 'getUploadStatus',
				description: 'Check the status of an upload',
				action: 'Get upload status',
			},
			{
				name: 'Upload Source',
				value: 'uploadSource',
				description: 'Upload source code zip file',
				action: 'Upload source code',
			},
		],
		default: 'generateLink',
	},
];

export const uploadFields: INodeProperties[] = [
	// ----------------------------------
	//         upload: generateLink
	// ----------------------------------
	{
		displayName: 'Project ID',
		name: 'projectId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['upload'],
				operation: ['generateLink'],
			},
		},
		description: 'The UUID of the target project',
	},

	// ----------------------------------
	//         upload: uploadSource
	// ----------------------------------
	{
		displayName: 'Upload URL',
		name: 'uploadUrl',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['upload'],
				operation: ['uploadSource'],
			},
		},
		description: 'The pre-signed upload URL from generateLink operation',
	},
	{
		displayName: 'Binary Property',
		name: 'binaryPropertyName',
		type: 'string',
		required: true,
		default: 'data',
		displayOptions: {
			show: {
				resource: ['upload'],
				operation: ['uploadSource'],
			},
		},
		description: 'Name of the binary property containing the zip file to upload',
	},

	// ----------------------------------
	//         upload: getUploadStatus
	// ----------------------------------
	{
		displayName: 'Upload ID',
		name: 'uploadId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['upload'],
				operation: ['getUploadStatus'],
			},
		},
		description: 'The ID of the upload to check status for',
	},
];
