/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { Checkmarx } from '../../nodes/Checkmarx/Checkmarx.node';

describe('Checkmarx Node', () => {
  let checkmarxNode: Checkmarx;

  beforeEach(() => {
    checkmarxNode = new Checkmarx();
  });

  describe('Node Description', () => {
    it('should have correct display name', () => {
      expect(checkmarxNode.description.displayName).toBe('Checkmarx');
    });

    it('should have correct node name', () => {
      expect(checkmarxNode.description.name).toBe('checkmarx');
    });

    it('should have correct group', () => {
      expect(checkmarxNode.description.group).toContain('transform');
    });

    it('should have version 1', () => {
      expect(checkmarxNode.description.version).toBe(1);
    });

    it('should have icon defined', () => {
      expect(checkmarxNode.description.icon).toBe('file:checkmarx.svg');
    });

    it('should require checkmarxOneApi credentials', () => {
      const credentials = checkmarxNode.description.credentials;
      expect(credentials).toBeDefined();
      expect(credentials?.length).toBeGreaterThan(0);
      expect(credentials?.[0].name).toBe('checkmarxOneApi');
      expect(credentials?.[0].required).toBe(true);
    });

    it('should have main input and output', () => {
      expect(checkmarxNode.description.inputs).toContain('main');
      expect(checkmarxNode.description.outputs).toContain('main');
    });
  });

  describe('Resources', () => {
    it('should have 12 resources defined', () => {
      const resourceProperty = checkmarxNode.description.properties.find(
        (p) => p.name === 'resource',
      );
      expect(resourceProperty).toBeDefined();
      expect(resourceProperty?.type).toBe('options');
      expect(resourceProperty?.options?.length).toBe(12);
    });

    it('should include all required resources', () => {
      const resourceProperty = checkmarxNode.description.properties.find(
        (p) => p.name === 'resource',
      );
      const resourceNames = resourceProperty?.options?.map((o: any) => o.value);

      expect(resourceNames).toContain('project');
      expect(resourceNames).toContain('application');
      expect(resourceNames).toContain('scan');
      expect(resourceNames).toContain('result');
      expect(resourceNames).toContain('group');
      expect(resourceNames).toContain('query');
      expect(resourceNames).toContain('report');
      expect(resourceNames).toContain('preset');
      expect(resourceNames).toContain('auditTrail');
      expect(resourceNames).toContain('upload');
      expect(resourceNames).toContain('predicate');
      expect(resourceNames).toContain('configuration');
    });
  });

  describe('Operations', () => {
    const getOperations = (resource: string) => {
      const operationProperty = checkmarxNode.description.properties.find(
        (p) =>
          p.name === 'operation' &&
          p.displayOptions?.show?.resource?.includes(resource),
      );
      return operationProperty?.options?.map((o: any) => o.value) || [];
    };

    it('should have project operations', () => {
      const operations = getOperations('project');
      expect(operations).toContain('getAll');
      expect(operations).toContain('get');
      expect(operations).toContain('create');
      expect(operations).toContain('update');
      expect(operations).toContain('delete');
    });

    it('should have scan operations', () => {
      const operations = getOperations('scan');
      expect(operations).toContain('getAll');
      expect(operations).toContain('get');
      expect(operations).toContain('create');
      expect(operations).toContain('cancel');
      expect(operations).toContain('delete');
    });

    it('should have result operations', () => {
      const operations = getOperations('result');
      expect(operations).toContain('getAll');
      expect(operations).toContain('get');
      expect(operations).toContain('getByScan');
      expect(operations).toContain('updateState');
    });

    it('should have report operations', () => {
      const operations = getOperations('report');
      expect(operations).toContain('create');
      expect(operations).toContain('get');
      expect(operations).toContain('getStatus');
      expect(operations).toContain('download');
    });
  });

  describe('Load Options Methods', () => {
    it('should have methods defined', () => {
      expect(checkmarxNode.methods).toBeDefined();
      expect(checkmarxNode.methods?.loadOptions).toBeDefined();
    });

    it('should have getProjects method', () => {
      expect(checkmarxNode.methods?.loadOptions?.getProjects).toBeDefined();
    });

    it('should have getApplications method', () => {
      expect(checkmarxNode.methods?.loadOptions?.getApplications).toBeDefined();
    });

    it('should have getGroups method', () => {
      expect(checkmarxNode.methods?.loadOptions?.getGroups).toBeDefined();
    });

    it('should have getPresets method', () => {
      expect(checkmarxNode.methods?.loadOptions?.getPresets).toBeDefined();
    });
  });
});
