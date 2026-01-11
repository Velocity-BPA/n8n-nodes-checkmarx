/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
	IDataObject,
	INodeType,
	INodeTypeDescription,
	IPollFunctions,
	ILoadOptionsFunctions,
	INodeExecutionData,
	NodeApiError,
	JsonObject,
} from 'n8n-workflow';

import {
	checkmarxApiRequest,
	checkmarxApiRequestAllItems,
} from './GenericFunctions';

let licensingNoticeEmitted = false;

export class CheckmarxTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Checkmarx Trigger',
		name: 'checkmarxTrigger',
		icon: 'file:checkmarx.svg',
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["event"]}}',
		description: 'Triggers when scan events occur in Checkmarx One',
		defaults: {
			name: 'Checkmarx Trigger',
		},
		credentials: [
			{
				name: 'checkmarxOneApi',
				required: true,
			},
		],
		polling: true,
		inputs: [],
		outputs: ['main'],
		properties: [
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				required: true,
				default: 'scanCompleted',
				options: [
					{
						name: 'Scan Completed',
						value: 'scanCompleted',
						description: 'Triggers when a scan finishes successfully',
					},
					{
						name: 'Scan Failed',
						value: 'scanFailed',
						description: 'Triggers when a scan fails',
					},
					{
						name: 'High Severity Found',
						value: 'highSeverityFound',
						description: 'Triggers when high severity results are found',
					},
					{
						name: 'New Vulnerability',
						value: 'newVulnerability',
						description: 'Triggers when new vulnerabilities are detected',
					},
					{
						name: 'Result State Changed',
						value: 'resultStateChanged',
						description: 'Triggers when a result state changes',
					},
					{
						name: 'Any Scan Event',
						value: 'anyScanEvent',
						description: 'Triggers on any scan status change',
					},
				],
			},
			{
				displayName: 'Project',
				name: 'projectId',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getProjects',
				},
				default: '',
				description: 'Filter by specific project (leave empty for all projects)',
			},
			{
				displayName: 'Severity Filter',
				name: 'severityFilter',
				type: 'multiOptions',
				displayOptions: {
					show: {
						event: ['highSeverityFound', 'newVulnerability'],
					},
				},
				options: [
					{ name: 'Critical', value: 'CRITICAL' },
					{ name: 'High', value: 'HIGH' },
					{ name: 'Medium', value: 'MEDIUM' },
					{ name: 'Low', value: 'LOW' },
					{ name: 'Info', value: 'INFO' },
				],
				default: ['CRITICAL', 'HIGH'],
				description: 'Severity levels to trigger on',
			},
			{
				displayName: 'Engine Filter',
				name: 'engineFilter',
				type: 'multiOptions',
				options: [
					{ name: 'SAST', value: 'sast' },
					{ name: 'SCA', value: 'sca' },
					{ name: 'KICS', value: 'kics' },
					{ name: 'API Security', value: 'apisec' },
				],
				default: [],
				description: 'Filter by scan engine (leave empty for all)',
			},
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				options: [
					{
						displayName: 'Include Results Summary',
						name: 'includeResultsSummary',
						type: 'boolean',
						default: true,
						description: 'Whether to include results summary in the output',
					},
					{
						displayName: 'Include Scan Details',
						name: 'includeScanDetails',
						type: 'boolean',
						default: true,
						description: 'Whether to include full scan details in the output',
					},
					{
						displayName: 'Max Results Per Poll',
						name: 'maxResults',
						type: 'number',
						default: 10,
						description: 'Maximum number of events to return per poll',
					},
				],
			},
		],
	};

	methods = {
		loadOptions: {
			async getProjects(this: ILoadOptionsFunctions) {
				const projects = await checkmarxApiRequestAllItems.call(
					this,
					'GET',
					'/projects',
				);
				return projects.map((project: IDataObject) => ({
					name: project.name as string,
					value: project.id as string,
				}));
			},
		},
	};

	async poll(this: IPollFunctions): Promise<INodeExecutionData[][] | null> {
		// Emit licensing notice once per node load
		if (!licensingNoticeEmitted) {
			console.warn(
				'[Velocity BPA Licensing Notice]\n\n' +
				'This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).\n\n' +
				'Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.\n\n' +
				'For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.',
			);
			licensingNoticeEmitted = true;
		}

		const webhookData = this.getWorkflowStaticData('node');
		const event = this.getNodeParameter('event') as string;
		const projectId = this.getNodeParameter('projectId', '') as string;
		const options = this.getNodeParameter('options', {}) as IDataObject;

		const lastPollTime = (webhookData.lastPollTime as string) || new Date(0).toISOString();
		const lastScanIds = (webhookData.lastScanIds as string[]) || [];

		const returnData: INodeExecutionData[] = [];

		try {
			// Build query parameters
			const query: IDataObject = {
				limit: options.maxResults || 10,
				sort: '-createdAt',
			};

			if (projectId) {
				query['project-id'] = projectId;
			}

			// Filter by engine if specified
			const engineFilter = this.getNodeParameter('engineFilter', []) as string[];

			// Get recent scans
			const scansResponse = await checkmarxApiRequest.call(
				this as any,
				'GET',
				'/scans',
				{},
				query,
			) as IDataObject;

			const scanResults = (scansResponse.scans || scansResponse.results || scansResponse || []) as IDataObject[];

			for (const scan of scanResults) {
				const scanId = scan.id as string;
				const scanStatus = (scan.status as string || '').toLowerCase();
				const scanCreatedAt = scan.createdAt as string;

				// Skip if we've already processed this scan
				if (lastScanIds.includes(scanId)) {
					continue;
				}

				// Skip if scan was created before last poll
				if (new Date(scanCreatedAt) <= new Date(lastPollTime)) {
					continue;
				}

				// Apply engine filter
				if (engineFilter.length > 0) {
					const scanEngines = (scan.engines || []) as string[];
					const hasMatchingEngine = scanEngines.some((engine: string) =>
						engineFilter.includes(engine.toLowerCase()),
					);
					if (!hasMatchingEngine) {
						continue;
					}
				}

				let shouldTrigger = false;

				switch (event) {
					case 'scanCompleted':
						shouldTrigger = scanStatus === 'completed';
						break;

					case 'scanFailed':
						shouldTrigger = scanStatus === 'failed' || scanStatus === 'canceled';
						break;

					case 'anyScanEvent':
						shouldTrigger = ['completed', 'failed', 'canceled', 'running', 'queued'].includes(scanStatus);
						break;

					case 'highSeverityFound':
						if (scanStatus === 'completed') {
							const severityFilter = this.getNodeParameter('severityFilter', ['CRITICAL', 'HIGH']) as string[];
							// Get results summary
							try {
								const summary = await checkmarxApiRequest.call(
									this as any,
									'GET',
									`/results/summary`,
									{},
									{ 'scan-id': scanId },
								) as IDataObject;

								const severityCounts = (summary.severityCounters || summary.counters || {}) as IDataObject;
								const hasHighSeverity = severityFilter.some(
									(sev) => ((severityCounts[sev.toLowerCase()] as number) || 0) > 0,
								);
								shouldTrigger = hasHighSeverity;

								if (shouldTrigger) {
									scan.resultsSummary = summary;
								}
							} catch (error) {
								// If we can't get summary, skip this check
								shouldTrigger = false;
							}
						}
						break;

					case 'newVulnerability':
						if (scanStatus === 'completed') {
							const severityFilter = this.getNodeParameter('severityFilter', ['CRITICAL', 'HIGH']) as string[];
							// Get results with status NEW
							try {
								const resultsResponse = await checkmarxApiRequest.call(
									this as any,
									'GET',
									'/results',
									{},
									{
										'scan-id': scanId,
										status: 'NEW',
										limit: 1,
									},
								) as IDataObject;

								const newResults = (resultsResponse.results || resultsResponse || []) as IDataObject[];
								const hasNewVulnerabilities = newResults.some((result: IDataObject) =>
									severityFilter.includes((result.severity as string || '').toUpperCase()),
								);
								shouldTrigger = hasNewVulnerabilities;

								if (shouldTrigger) {
									scan.newVulnerabilityCount = (resultsResponse.totalCount as number) || newResults.length;
								}
							} catch (error) {
								shouldTrigger = false;
							}
						}
						break;

					case 'resultStateChanged':
						// Check audit trail for state changes
						try {
							const auditResponse = await checkmarxApiRequest.call(
								this as any,
								'GET',
								'/audit',
								{},
								{
									'resource-type': 'RESULT',
									action: 'UPDATE',
									'from-date': lastPollTime,
									limit: 10,
								},
							) as IDataObject;

							const events = (auditResponse.events || auditResponse.results || auditResponse || []) as IDataObject[];
							if (events.length > 0) {
								shouldTrigger = true;
								scan.stateChangeEvents = events;
							}
						} catch (error) {
							shouldTrigger = false;
						}
						break;
				}

				if (shouldTrigger) {
					// Optionally fetch additional details
					if (options.includeScanDetails) {
						try {
							const scanDetails = await checkmarxApiRequest.call(
								this as any,
								'GET',
								`/scans/${scanId}`,
							);
							Object.assign(scan, scanDetails);
						} catch (error) {
							// Continue without additional details
						}
					}

					if (options.includeResultsSummary && !scan.resultsSummary) {
						try {
							const summary = await checkmarxApiRequest.call(
								this as any,
								'GET',
								'/results/summary',
								{},
								{ 'scan-id': scanId },
							);
							scan.resultsSummary = summary;
						} catch (error) {
							// Continue without summary
						}
					}

					returnData.push({
						json: {
							event,
							timestamp: new Date().toISOString(),
							scan,
						},
					});
				}
			}

			// Update webhook data for next poll
			webhookData.lastPollTime = new Date().toISOString();
			webhookData.lastScanIds = scanResults.slice(0, 50).map((s: IDataObject) => s.id);

		} catch (error) {
			if (error instanceof NodeApiError) {
				throw error;
			}
			throw new NodeApiError(this.getNode(), error as JsonObject, {
				message: 'Failed to poll Checkmarx for events',
			});
		}

		if (returnData.length === 0) {
			return null;
		}

		return [returnData];
	}
}
