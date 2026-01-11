/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { validateUuid, parseTags, formatTags } from '../../nodes/Checkmarx/GenericFunctions';

describe('GenericFunctions', () => {
  describe('validateUuid', () => {
    it('should not throw for valid UUIDs', () => {
      expect(() => validateUuid('550e8400-e29b-41d4-a716-446655440000', 'testField')).not.toThrow();
      expect(() => validateUuid('6ba7b810-9dad-11d1-80b4-00c04fd430c8', 'testField')).not.toThrow();
      expect(() => validateUuid('f47ac10b-58cc-4372-a567-0e02b2c3d479', 'testField')).not.toThrow();
    });

    it('should throw for invalid UUIDs', () => {
      expect(() => validateUuid('not-a-uuid', 'testField')).toThrow('testField must be a valid UUID');
      expect(() => validateUuid('550e8400-e29b-41d4-a716', 'testField')).toThrow();
      expect(() => validateUuid('', 'testField')).toThrow();
      expect(() => validateUuid('550e8400e29b41d4a716446655440000', 'testField')).toThrow();
    });

    it('should handle case-insensitive UUIDs', () => {
      expect(() => validateUuid('550E8400-E29B-41D4-A716-446655440000', 'testField')).not.toThrow();
      expect(() => validateUuid('550e8400-E29B-41d4-A716-446655440000', 'testField')).not.toThrow();
    });
  });

  describe('parseTags', () => {
    it('should parse comma-separated tags into object', () => {
      const result = parseTags('key1=value1,key2=value2');
      expect(result).toEqual({
        key1: 'value1',
        key2: 'value2',
      });
    });

    it('should handle single tag', () => {
      const result = parseTags('key=value');
      expect(result).toEqual({ key: 'value' });
    });

    it('should handle empty string', () => {
      const result = parseTags('');
      expect(result).toEqual({});
    });

    it('should trim whitespace', () => {
      const result = parseTags('  key1 = value1 , key2 = value2  ');
      expect(result).toEqual({
        key1: 'value1',
        key2: 'value2',
      });
    });

    it('should handle tags without values', () => {
      const result = parseTags('key1=value1,key2,key3=value3');
      expect(result).toEqual({
        key1: 'value1',
        key2: '',
        key3: 'value3',
      });
    });
  });

  describe('formatTags', () => {
    it('should format object to comma-separated string', () => {
      const result = formatTags({ key1: 'value1', key2: 'value2' });
      expect(result).toBe('key1=value1, key2=value2');
    });

    it('should handle single tag', () => {
      const result = formatTags({ key: 'value' });
      expect(result).toBe('key=value');
    });

    it('should handle empty object', () => {
      const result = formatTags({});
      expect(result).toBe('');
    });

    it('should handle empty values', () => {
      const result = formatTags({ key1: 'value1', key2: '' });
      expect(result).toBe('key1=value1, key2=');
    });
  });
});

describe('Region URL Mapping', () => {
  const regionUrls: { [key: string]: string } = {
    US: 'https://ast.checkmarx.net',
    US2: 'https://us.ast.checkmarx.net',
    EU: 'https://eu.ast.checkmarx.net',
    EU2: 'https://eu-2.ast.checkmarx.net',
    DEU: 'https://deu.ast.checkmarx.net',
    ANZ: 'https://anz.ast.checkmarx.net',
    India: 'https://ind.ast.checkmarx.net',
  };

  const iamUrls: { [key: string]: string } = {
    US: 'https://iam.checkmarx.net',
    US2: 'https://us.iam.checkmarx.net',
    EU: 'https://eu.iam.checkmarx.net',
    EU2: 'https://eu-2.iam.checkmarx.net',
    DEU: 'https://deu.iam.checkmarx.net',
    ANZ: 'https://anz.iam.checkmarx.net',
    India: 'https://ind.iam.checkmarx.net',
  };

  it('should have all region API URLs defined', () => {
    expect(Object.keys(regionUrls)).toHaveLength(7);
    expect(regionUrls.US).toBeDefined();
    expect(regionUrls.EU).toBeDefined();
    expect(regionUrls.India).toBeDefined();
  });

  it('should have all region IAM URLs defined', () => {
    expect(Object.keys(iamUrls)).toHaveLength(7);
    expect(iamUrls.US).toBeDefined();
    expect(iamUrls.EU).toBeDefined();
    expect(iamUrls.India).toBeDefined();
  });

  it('should have correct URL format for all regions', () => {
    Object.values(regionUrls).forEach((url) => {
      expect(url).toMatch(/^https:\/\/.+\.checkmarx\.net$/);
    });
  });
});
