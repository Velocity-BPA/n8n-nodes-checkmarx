/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

export interface IDataObject {
  [key: string]: any;
}

export interface INodeExecutionData {
  json: IDataObject;
  binary?: IBinaryKeyData;
  pairedItem?: IPairedItemData | IPairedItemData[];
}

export interface IBinaryKeyData {
  [key: string]: IBinaryData;
}

export interface IBinaryData {
  data: string;
  mimeType: string;
  fileName?: string;
  fileSize?: number;
}

export interface IPairedItemData {
  item: number;
  input?: number;
}

export interface INodePropertyOptions {
  name: string;
  value: string | number | boolean;
  description?: string;
}

export interface INodeProperties {
  displayName: string;
  name: string;
  type: string;
  default: any;
  description?: string;
  required?: boolean;
  options?: INodePropertyOptions[];
  displayOptions?: {
    show?: { [key: string]: any[] };
    hide?: { [key: string]: any[] };
  };
  typeOptions?: IDataObject;
  placeholder?: string;
}

export interface INodeTypeDescription {
  displayName: string;
  name: string;
  icon?: string;
  group: string[];
  version: number;
  subtitle?: string;
  description: string;
  defaults: { name: string };
  inputs: string[];
  outputs: string[];
  credentials?: Array<{ name: string; required?: boolean }>;
  properties: INodeProperties[];
  polling?: boolean;
}

export interface INodeType {
  description: INodeTypeDescription;
}

export interface ICredentialType {
  name: string;
  displayName: string;
  properties: INodeProperties[];
}

export class NodeApiError extends Error {
  constructor(_node: any, error: any, options?: any) {
    super(error?.message || options?.message || 'API Error');
    this.name = 'NodeApiError';
  }
}

export class NodeOperationError extends Error {
  constructor(_node: any, message: string, _options?: any) {
    super(message);
    this.name = 'NodeOperationError';
  }
}

// Mock function types
export interface IExecuteFunctions {
  getNodeParameter: (name: string, itemIndex?: number, fallback?: any) => any;
  getCredentials: (type: string) => Promise<IDataObject>;
  helpers: {
    request: (options: any) => Promise<any>;
    requestWithAuthentication: (credentialType: string, options: any) => Promise<any>;
    returnJsonArray: (data: any[]) => INodeExecutionData[];
  };
  getNode: () => any;
  getInputData: () => INodeExecutionData[];
  continueOnFail: () => boolean;
}

export interface ILoadOptionsFunctions {
  getNodeParameter: (name: string, itemIndex?: number, fallback?: any) => any;
  getCredentials: (type: string) => Promise<IDataObject>;
  helpers: {
    request: (options: any) => Promise<any>;
  };
  getNode: () => any;
}

export interface IPollFunctions {
  getNodeParameter: (name: string, fallback?: any) => any;
  getCredentials: (type: string) => Promise<IDataObject>;
  getWorkflowStaticData: (type: string) => IDataObject;
  helpers: {
    request: (options: any) => Promise<any>;
  };
  getNode: () => any;
}

export interface ICredentialTestFunctions {
  getCredentials: (type: string) => Promise<IDataObject>;
  helpers: {
    request: (options: any) => Promise<any>;
  };
}

// Export mock helpers
export const createMockExecuteFunctions = (
  params: IDataObject = {},
  credentials: IDataObject = {},
): Partial<IExecuteFunctions> => ({
  getNodeParameter: jest.fn((name: string, _itemIndex?: number, fallback?: any) => {
    return params[name] !== undefined ? params[name] : fallback;
  }),
  getCredentials: jest.fn().mockResolvedValue(credentials),
  helpers: {
    request: jest.fn(),
    requestWithAuthentication: jest.fn(),
    returnJsonArray: jest.fn((data: any[]) => data.map((item) => ({ json: item }))),
  },
  getNode: jest.fn().mockReturnValue({ name: 'Checkmarx' }),
  getInputData: jest.fn().mockReturnValue([{ json: {} }]),
  continueOnFail: jest.fn().mockReturnValue(false),
});

export const createMockLoadOptionsFunctions = (
  params: IDataObject = {},
  credentials: IDataObject = {},
): Partial<ILoadOptionsFunctions> => ({
  getNodeParameter: jest.fn((name: string, _itemIndex?: number, fallback?: any) => {
    return params[name] !== undefined ? params[name] : fallback;
  }),
  getCredentials: jest.fn().mockResolvedValue(credentials),
  helpers: {
    request: jest.fn(),
  },
  getNode: jest.fn().mockReturnValue({ name: 'Checkmarx' }),
});
