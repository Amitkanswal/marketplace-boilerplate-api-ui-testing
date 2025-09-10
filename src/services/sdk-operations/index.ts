import { SdkTestOperation, SdkTestCategory } from '../../types/sdk-testing.types';
import { coreSdkOperations } from './core-operations';
import { cmaOperations } from './cma-operations';
import { frameOperations, canUseFrameOperations } from './frame-operations';
import { crudOperations } from './crud-operations';
import { apiOperations } from './api-operations';
import { storeOperations } from './store-operations';
import { metadataOperations } from './metadata-operations';
import { ctsOperations } from './cts-operations';
import { esbOperations } from './esb-operations';
import { createEsbOperations } from './create-esb-operations';

/**
 * Get all SDK test operations
 */
export function getAllOperations(): SdkTestOperation[] {
  return [
    ...coreSdkOperations,
    ...cmaOperations,
    ...frameOperations,
    ...crudOperations,
    ...apiOperations,
    ...storeOperations,
    ...metadataOperations
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
    name: 'CRUD Operations using Adapter',
    description: 'Create, Read, Update, Delete operations for entries and assets',
    operations: crudOperations
  },
  API: {
    id: 'api',
    name: 'CRUD Operations using API',
    description: 'API operations',
    operations: apiOperations
  },
  STORE: {
    id: 'store',
    name: 'Store Operations',
    description: 'SDK persistent store operations',
    operations: storeOperations
  },
  METADATA: {
    id: 'metadata',
    name: 'Metadata Operations',
    description: 'Create, retrieve, list, update, and delete metadata',
    operations: metadataOperations
  },
  CTS: {
    id: 'cts',
    name: 'CTS Operations',
    description: 'CTS operations',
    operations: ctsOperations
  },
  ESB: {
    id: 'esb',
    name: 'ESB Operations',
    description: 'ESB operations',
    operations: esbOperations
  },
  CREATE_ESB: {
    id: 'create-esb',
    name: 'Create ESB Operations',
    description: 'Create ESB operations',
    operations: createEsbOperations
  }
};

/**
 * Result formatters for common patterns
 */
export const resultFormatters = {
  json: (data: unknown) => JSON.stringify(data, null, 2),
  string: (data: unknown) => String(data ?? ''),
  count: (data: unknown) => {
    const countData = data as { count?: number };
    return `Count: ${countData?.count ?? 0}`;
  },
  status: (data: unknown) => {
    const statusData = data as { status?: string };
    return `Status: ${statusData?.status ?? 'unknown'}`;
  },
  error: (data: unknown) => {
    const errorData = data as { error?: string; message?: string };
    return `Error: ${errorData?.error ?? errorData?.message ?? 'Unknown error'}`;
  }
};
