import UiLocation from '@contentstack/app-sdk/dist/src/uiLocation';
import { ContentstackClient } from '@contentstack/management';

export type TestStatus = 'idle' | 'loading' | 'success' | 'error';
export type TestCategory = 'core' | 'cma' | 'frame' | 'crud' | 'api' | 'store' | 'metadata' | 'cts' | 'esb' | 'create-esb' | 'asb';

export interface SdkTestResult {
  status: TestStatus;
  data?: unknown;
  error?: string;
  timestamp?: number;
}

export interface SdkTestOperation {
  id: string;
  name: string;
  description: string;
  category?: TestCategory;
  testId: string;
  resultTestId: string;
  execute: (sdk: UiLocation, context?: SdkTestContext) => Promise<unknown>;
  validateResult?: (result: unknown) => boolean;
  formatResult?: (result: unknown) => string;
  requiresPreviousResult?: string; // ID of operation that must run first
}

export interface SdkTestContext {
  cmsInstance?: ContentstackClient | null; // CMS client instance
  previousResults?: Record<string, unknown>;
  stackApiKey?: string;
}

export interface SdkTestState {
  results: Record<string, SdkTestResult>;
  globalError: string | null;
  isExecuting: boolean;
  executionQueue: string[];
}

export interface SdkTestCategory {
  id: string;
  name: string;
  description: string;
  operations: SdkTestOperation[];
  condition?: (sdk: UiLocation) => boolean;
}

// Action types for reducer
export type SdkTestAction =
  | { type: 'START_OPERATION'; operationId: string }
  | { type: 'OPERATION_SUCCESS'; operationId: string; data: unknown }
  | { type: 'OPERATION_ERROR'; operationId: string; error: string }
  | { type: 'SET_GLOBAL_ERROR'; error: string | null }
  | { type: 'CLEAR_RESULTS' }
  | { type: 'QUEUE_OPERATIONS'; operationIds: string[] }
  | { type: 'CLEAR_QUEUE' };

// Content type operation results
export interface ContentTypeOperationResult {
  status: 'created' | 'exists' | 'deleted' | 'not found';
  uid: string;
  contentTypeUid?: string;
}

export interface EntryOperationResult {
  status: 'created' | 'fetched' | 'deleted' | 'updated';
  uid: string;
  title?: string;
  created_at?: string;
}

export interface MetadataOperationResult {
  status: 'created' | 'fetched' | 'updated' | 'deleted';
  uid: string;
  notice?: string;
}

export interface ApiErrorResponse {
  error_message?: string;
  error_code?: number;
  errors?: Record<string, string[]>;
}

export interface WorkerInfo {
  parallelIndex?: number;
}

export interface TestUids {
  contentTypeUid?: string;
  entryUid?: string;
  metadataUid?: string;
}

// Global window extensions for test UID access (iframe communication)
declare global {
  interface Window {
    e2eTestUIDs: TestUids;
    getTestUIDs(): TestUids;
    getTestContentTypeUid(): string;
    getTestEntryUid(): string;
    getTestMetadataUid(): string;
  }
}

// Helper function to extract content type UID - checks postMessage UIDs first, then context
export function getContentTypeUidFromContext(context: SdkTestContext | undefined, operationId: string): string {
  // First, try to get from postMessage UIDs (set by test via iframe communication)
  if (typeof window !== 'undefined' && window.getTestContentTypeUid) {
    const testUid = window.getTestContentTypeUid();
    if (testUid && testUid !== 'test_content_type') {
      return testUid;
    }
  }

  // Fallback to context-based extraction
  if (!context?.previousResults) {
    return 'test_content_type';
  }
  const createResult = context.previousResults[operationId] as ContentTypeOperationResult;
  return createResult?.contentTypeUid ?? createResult?.uid ?? 'test_content_type';
}

// Helper type for operation results
export interface OperationResultFormatters {
  json: (data: unknown) => string;
  string: (data: unknown) => string;
  count: (data: { count?: number; items?: unknown[] }) => string;
  status: (data: { status: string; [key: string]: unknown }) => string;
  error: (data: unknown) => string;
}
