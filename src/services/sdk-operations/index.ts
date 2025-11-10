import { SdkTestCategory } from '../../types/sdk-testing.types';
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
import { asbOperations } from './asb-operations';
import { cfOperations } from './cf-operations';
import { appConfigOperations } from './app-config-operations';
import { fieldModifierOperations } from './field-modifier-operations';
import { dashboardOperations } from './dashboard-operations';
import { globalFullPageOperations } from './global-full-page-operations';


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
  },
  ASB: {
    id: 'asb',
    name: 'ASB Operations',
    description: 'Asset Sidebar operations',
    operations: asbOperations
  },
  CF: {
    id: 'cf',
    name: 'CF Operations',
    description: 'Custom Field operations',
    operations: cfOperations
  },
  APP_CONFIG: {
    id: 'app-config',
    name: 'App Config Operations',
    description: 'App Config operations',
    operations: appConfigOperations
  },
  FIELD_MODIFIER: {
    id: 'field-modifier',
    name: 'Field Modifier Operations',
    description: 'Field Modifier location operations',
    operations: fieldModifierOperations
  },
  DASHBOARD: {
    id: 'dashboard',
    name: 'Dashboard Operations',
    description: 'Dashboard operations',
    operations: dashboardOperations
  },
  GLOBAL_FULL_PAGE: {
    id: 'global-full-page',
    name: 'Global Full Page Operations',
    description: 'Cross-stack global full page operations',
    operations: globalFullPageOperations
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
