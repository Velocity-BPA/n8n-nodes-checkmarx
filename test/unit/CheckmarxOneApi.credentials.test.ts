/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { CheckmarxOneApi } from '../../credentials/CheckmarxOneApi.credentials';

describe('CheckmarxOneApi Credentials', () => {
  let credentials: CheckmarxOneApi;

  beforeEach(() => {
    credentials = new CheckmarxOneApi();
  });

  describe('Credential Definition', () => {
    it('should have correct name', () => {
      expect(credentials.name).toBe('checkmarxOneApi');
    });

    it('should have correct display name', () => {
      expect(credentials.displayName).toBe('Checkmarx One API');
    });

    it('should have properties defined', () => {
      expect(credentials.properties).toBeDefined();
      expect(Array.isArray(credentials.properties)).toBe(true);
    });
  });

  describe('Required Properties', () => {
    it('should have apiKey property', () => {
      const apiKeyProp = credentials.properties.find((p) => p.name === 'apiKey');
      expect(apiKeyProp).toBeDefined();
      expect(apiKeyProp?.type).toBe('string');
      expect(apiKeyProp?.required).toBe(true);
    });

    it('should have tenantName property', () => {
      const tenantProp = credentials.properties.find((p) => p.name === 'tenantName');
      expect(tenantProp).toBeDefined();
      expect(tenantProp?.type).toBe('string');
      expect(tenantProp?.required).toBe(true);
    });

    it('should have region property', () => {
      const regionProp = credentials.properties.find((p) => p.name === 'region');
      expect(regionProp).toBeDefined();
      expect(regionProp?.type).toBe('options');
      expect(regionProp?.required).toBe(true);
    });
  });

  describe('Region Options', () => {
    it('should have all 7 regions available', () => {
      const regionProp = credentials.properties.find((p) => p.name === 'region');
      expect(regionProp?.options?.length).toBe(7);
    });

    it('should include US region', () => {
      const regionProp = credentials.properties.find((p) => p.name === 'region');
      const usRegion = regionProp?.options?.find((o: any) => o.value === 'US');
      expect(usRegion).toBeDefined();
    });

    it('should include EU region', () => {
      const regionProp = credentials.properties.find((p) => p.name === 'region');
      const euRegion = regionProp?.options?.find((o: any) => o.value === 'EU');
      expect(euRegion).toBeDefined();
    });

    it('should include all required regions', () => {
      const regionProp = credentials.properties.find((p) => p.name === 'region');
      const regionValues = regionProp?.options?.map((o: any) => o.value);

      expect(regionValues).toContain('US');
      expect(regionValues).toContain('US2');
      expect(regionValues).toContain('EU');
      expect(regionValues).toContain('EU2');
      expect(regionValues).toContain('DEU');
      expect(regionValues).toContain('ANZ');
      expect(regionValues).toContain('India');
    });
  });

  describe('Optional Properties', () => {
    it('should have iamUrl property', () => {
      const iamUrlProp = credentials.properties.find((p) => p.name === 'iamUrl');
      expect(iamUrlProp).toBeDefined();
      expect(iamUrlProp?.type).toBe('string');
      expect(iamUrlProp?.required).toBeFalsy();
    });
  });

  describe('Authentication', () => {
    it('should have test method defined', () => {
      expect(credentials.test).toBeDefined();
    });
  });
});
