import UiLocation from '@contentstack/app-sdk/dist/src/uiLocation';
import { ContentstackClient } from '@contentstack/management';

export type TestStatus = 'idle' | 'loading' | 'success' | 'error';
export type TestCategory = 'core' | 'cma' | 'frame' | 'crud' | 'api' | 'store' | 'metadata' | 'cts' | 'esb';

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
  category: TestCategory;
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

// Helper type for operation results
export interface OperationResultFormatters {
  json: (data: unknown) => string;
  string: (data: unknown) => string;
  count: (data: { count?: number; items?: unknown[] }) => string;
  status: (data: { status: string; [key: string]: unknown }) => string;
  error: (data: unknown) => string;
}
