import { useCallback, useReducer, useMemo } from 'react';
import { client } from '@contentstack/management';
import { useAppSdk } from '../common/hooks/useAppSdk';
import { 
  SdkTestState, 
  SdkTestAction, 
  SdkTestOperation,
  SdkTestContext,
  SdkTestResult
} from '../types/sdk-testing.types';

const initialState: SdkTestState = {
  results: {},
  globalError: null,
  isExecuting: false,
  executionQueue: []
};

function sdkTestReducer(state: SdkTestState, action: SdkTestAction): SdkTestState {
  switch (action.type) {
    case 'START_OPERATION':
      return {
        ...state,
        isExecuting: true,
        results: {
          ...state.results,
          [action.operationId]: {
            status: 'loading',
            timestamp: Date.now()
          }
        }
      };
    
    case 'OPERATION_SUCCESS':
      return {
        ...state,
        isExecuting: false,
        results: {
          ...state.results,
          [action.operationId]: {
            status: 'success',
            data: action.data,
            timestamp: Date.now()
          }
        }
      };
    
    case 'OPERATION_ERROR':
      return {
        ...state,
        isExecuting: false,
        results: {
          ...state.results,
          [action.operationId]: {
            status: 'error',
            error: action.error,
            timestamp: Date.now()
          }
        }
      };
    
    case 'SET_GLOBAL_ERROR':
      return {
        ...state,
        globalError: action.error
      };
    
    case 'CLEAR_RESULTS':
      return {
        ...state,
        results: {},
        globalError: null
      };
    
    case 'QUEUE_OPERATIONS':
      return {
        ...state,
        executionQueue: action.operationIds
      };
    
    case 'CLEAR_QUEUE':
      return {
        ...state,
        executionQueue: []
      };
    
    default:
      return state;
  }
}

export function useSdkTesting() {
  const appSdk = useAppSdk();
  const [state, dispatch] = useReducer(sdkTestReducer, initialState);
  
  // Memoize CMS instance
  const cmsInstance = useMemo(() => {
    if (!appSdk) return null;
    
    return client({
      adapter: appSdk.createAdapter(),
      baseURL: `${appSdk.endpoints?.CMA}/v3`,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  }, [appSdk]);
  
  // Create context for operations
  const context = useMemo<SdkTestContext>(() => ({
    cmsInstance,
    stackApiKey: appSdk?.ids?.apiKey,
    previousResults: Object.entries(state.results).reduce((acc, [id, result]) => {
      if (result.status === 'success' && result.data) {
        acc[id] = result.data;
      }
      return acc;
    }, {} as Record<string, unknown>)
  }), [cmsInstance, appSdk, state.results]);
  
  // Execute a single operation
  const executeOperation = useCallback(async (operation: SdkTestOperation) => {
    if (!appSdk) {
      dispatch({ 
        type: 'SET_GLOBAL_ERROR', 
        error: 'SDK not initialized' 
      });
      return;
    }
    
    // Check if required previous operation has been executed
    if (operation.requiresPreviousResult) {
      const previousResult = state.results[operation.requiresPreviousResult];
      if (!previousResult || previousResult.status !== 'success') {
        dispatch({ 
          type: 'OPERATION_ERROR', 
          operationId: operation.id,
          error: `Required operation "${operation.requiresPreviousResult}" must be executed first`
        });
        return;
      }
    }
    
    dispatch({ type: 'START_OPERATION', operationId: operation.id });
    dispatch({ type: 'SET_GLOBAL_ERROR', error: null });
    
    try {
      const result = await operation.execute(appSdk, context);
      
      // Validate result if validator is provided
      if (operation.validateResult && !operation.validateResult(result)) {
        throw new Error('Result validation failed');
      }
      
      dispatch({ 
        type: 'OPERATION_SUCCESS', 
        operationId: operation.id, 
        data: result 
      });
    } catch (error: any) {
      const errorMessage = error?.data?.error_message || error?.message || 'Unknown error occurred';
      dispatch({ 
        type: 'OPERATION_ERROR', 
        operationId: operation.id, 
        error: errorMessage 
      });
    }
  }, [appSdk, context, state.results]);
  
  // Execute multiple operations in sequence
  const executeOperations = useCallback(async (operations: SdkTestOperation[]) => {
    dispatch({ type: 'QUEUE_OPERATIONS', operationIds: operations.map(op => op.id) });
    
    for (const operation of operations) {
      await executeOperation(operation);
    }
    
    dispatch({ type: 'CLEAR_QUEUE' });
  }, [executeOperation]);
  
  // Get formatted result for an operation
  const getFormattedResult = useCallback((
    operationId: string, 
    formatter?: (data: unknown) => string
  ): string => {
    const result = state.results[operationId];
    if (!result) return '';
    
    switch (result.status) {
      case 'loading':
        return 'Loading...';
      case 'error':
        return `Error: ${result.error}`;
      case 'success':
        return formatter && result.data !== undefined
          ? formatter(result.data)
          : String(result.data || '');
      default:
        return '';
    }
  }, [state.results]);
  
  // Clear all results
  const clearResults = useCallback(() => {
    dispatch({ type: 'CLEAR_RESULTS' });
  }, []);
  
  // Get result by operation ID
  const getResult = useCallback((operationId: string): SdkTestResult | undefined => {
    return state.results[operationId];
  }, [state.results]);
  
  return {
    state,
    executeOperation,
    executeOperations,
    getFormattedResult,
    clearResults,
    getResult,
    isReady: !!appSdk,
    context
  };
}
