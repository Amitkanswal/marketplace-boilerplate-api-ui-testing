import { SdkTestOperation, SdkTestCategory } from '../../types/sdk-testing.types';
import { coreSdkOperations } from './core-operations';
import { cmaOperations } from './cma-operations';
import { frameOperations, canUseFrameOperations } from './frame-operations';
import { crudOperations } from './crud-operations';

/**
 * Get all SDK test operations
 */
export function getAllOperations(): SdkTestOperation[] {
  return [
    ...coreSdkOperations,
    ...cmaOperations,
    ...frameOperations,
    ...crudOperations
  ];
}

/**
 * Get operations by category
 */
export function getOperationsByCategory(category: string): SdkTestOperation[] {
  return getAllOperations().filter(op => op.category === category);
}

/**
 * Get operation by ID
 */
export function getOperationById(id: string): SdkTestOperation | undefined {
  return getAllOperations().find(op => op.id === id);
}

/**
 * SDK test categories configuration
 */
export const SDK_TEST_CATEGORIES: Record<string, SdkTestCategory> = {
  CORE: {
    id: 'core',
    name: 'Core SDK Methods',
    description: 'Basic SDK functionality including configuration, location, and identifiers',
    operations: coreSdkOperations
  },
  CMA: {
    id: 'cma',
    name: 'CMA Operations',
    description: 'Content Management API operations',
    operations: cmaOperations
  },
  FRAME: {
    id: 'frame',
    name: 'Frame Operations',
    description: 'Frame resizing and dimension controls',
    operations: frameOperations,
    condition: (sdk) => canUseFrameOperations(sdk)
  },
  CRUD: {
    id: 'crud',
    name: 'CRUD Operations',
    description: 'Create, Read, Update, Delete operations for entries and assets',
    operations: crudOperations
  }
};

/**
 * Result formatters for common patterns
 */
export const resultFormatters = {
  json: (data: unknown) => JSON.stringify(data, null, 2),
  string: (data: unknown) => String(data || ''),
  count: (data: any) => `Count: ${data?.count || 0}`,
  status: (data: any) => `Status: ${data?.status || 'unknown'}`,
  error: (data: any) => `Error: ${data?.error || data?.message || 'Unknown error'}`
};
