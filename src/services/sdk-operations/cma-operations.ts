import { 
  SdkTestOperation, 
  ContentTypeOperationResult, 
  ApiErrorResponse, 
  WorkerInfo, 
  getContentTypeUidFromContext 
} from '../../types/sdk-testing.types';

export const cmaOperations: SdkTestOperation[] = [
  {
    id: 'create-test-content-type',
    name: 'Create Test Content Type',
    description: 'Create content type with dynamic UID to prevent race conditions',
    category: 'cma',
    testId: 'sdk-cma-create-content-type',
    resultTestId: 'sdk-cma-ct-result',
    execute: async (sdk, context) => {
      if (!context?.cmsInstance || !context?.stackApiKey) {
        throw new Error('CMS instance or API key not available');
      }
      
      // Generate unique content type UID to prevent race conditions in parallel tests
      const timestamp = Date.now();
      const workerInfo = (globalThis as any).__playwright_worker_info as WorkerInfo | undefined;
      const workerIndex = workerInfo?.parallelIndex ?? Math.floor(Math.random() * 1000);
      const contentTypeUid = `test_content_type_w${workerIndex}_t${timestamp}`;
      const contentTypeTitle = `Test Content Type (Worker ${workerIndex})`;
      
      const stack = context.cmsInstance.stack({ api_key: context.stackApiKey });
      try {
        const ct = await stack
          .contentType()
          .create({
            content_type: {
              title: contentTypeTitle,
              uid: contentTypeUid,
              schema: [
                {
                  display_name: 'Title',
                  uid: 'title',
                  data_type: 'text',
                  field_metadata: { _default: true },
                  mandatory: true,
                  multiple: false,
                  unique: false,
                },
                {
                  display_name: 'Description',
                  uid: 'description',
                  data_type: 'text',
                  field_metadata: { _default: true },
                  multiple: false,
                  unique: false,
                },
              ],
              options: {
                is_page: false,
                singleton: false,
                title: contentTypeTitle,
                sub_title: ['Test Content Type Description'],
              },
            },
          });
        return { status: 'created', uid: ct?.uid ?? contentTypeUid, contentTypeUid };
      } catch (error: unknown) {
        const apiError = (error as { data?: ApiErrorResponse })?.data ?? {};
        const errorCode = apiError.error_code;
        const errors = apiError.errors;
        // Handle error code 115: validation errors with "not unique" messages
        if (errorCode === 115 || 
            (errors && Object.values(errors).some((err: string[]) => 
              Array.isArray(err) && err.some(e => e.toLowerCase().includes('not unique'))
            ))) {
          return { status: 'exists', uid: contentTypeUid, contentTypeUid };
        }
        
        throw error;
      }
    },
    formatResult: (result: unknown) => JSON.stringify(result),
    validateResult: (result: unknown): result is ContentTypeOperationResult => {
      const ctResult = result as ContentTypeOperationResult;
      return !!(ctResult && (ctResult.status === 'created' || ctResult.status === 'exists'));
    },
  },
  {
    id: 'delete-test-content-type',
    name: 'Delete Test Content Type',
    description: 'Delete content type using UID from context',
    category: 'cma',
    testId: 'sdk-cma-delete-content-type',
    resultTestId: 'sdk-cma-delete-result',
    execute: async (sdk, context) => {
      if (!context?.cmsInstance || !context?.stackApiKey) {
        throw new Error('CMS instance or API key not available');
      }
      
      const contentTypeUid = getContentTypeUidFromContext(context, 'create-test-content-type');
      
      const stack = context.cmsInstance.stack({ api_key: context.stackApiKey });
      try {
        await stack.contentType(contentTypeUid).delete();
        return { status: 'deleted', uid: contentTypeUid };
      } catch (error: unknown) {
        const apiError = (error as { data?: ApiErrorResponse })?.data ?? {};
        const msg = (apiError.error_message ?? '').toString().toLowerCase();
        if (msg.includes('not found') || msg.includes('does not exist') || msg.includes('not exist')) {
          return { status: 'not found', uid: contentTypeUid };
        }
        throw error;
      }
    },
    formatResult: (result: unknown) => JSON.stringify(result),
    validateResult: (result: unknown): result is ContentTypeOperationResult => {
      const ctResult = result as ContentTypeOperationResult;
      return !!(ctResult && (ctResult.status === 'deleted' || ctResult.status === 'not found'));
    },
  },
  {
    id: 'list-content-types',
    name: 'List Content Types',
    description: 'Retrieve all content types in the stack',
    category: 'cma',
    testId: 'sdk-cma-list-content-types',
    resultTestId: 'sdk-cma-result',
    execute: async (sdk, context) => {
      if (!context?.cmsInstance || !context?.stackApiKey) {
        throw new Error('CMS instance or API key not available');
      }
      
      const stack = context.cmsInstance.stack({ api_key: context.stackApiKey });
      const response = await stack.contentType().query().find();
      const items = response?.items || [];
      
      return { count: items.length };
    },
    formatResult: (result: unknown) => JSON.stringify(result),
    validateResult: (result: any) => {
      return result && typeof result.count === 'number' && result.count >= 0;
    }
  },
  {
    id: 'list-content-types-with-count',
    name: 'List Content Types with Include Count',
    description: 'Retrieve content types with include_count parameter to verify count field in response',
    category: 'cma',
    testId: 'sdk-cma-list-content-types-with-count',
    resultTestId: 'sdk-cma-count-result',
    execute: async (sdk, context) => {
      if (!context?.cmsInstance || !context?.stackApiKey) {
        throw new Error('CMS instance or API key not available');
      }
      
      const stack = context.cmsInstance.stack({ api_key: context.stackApiKey });
      const response = await stack.contentType().query({include_count: true}).find();
      const items = response?.items || [];
      const count = response?.count;
      
      return { 
        itemsCount: items.length,
        totalCount: count,
        hasCountField: typeof count === 'number'
      };
    },
    formatResult: (result: unknown) => JSON.stringify(result),
    validateResult: (result: any) => {
      return result && 
             typeof result.itemsCount === 'number' && 
             typeof result.totalCount === 'number' &&
             result.hasCountField === true &&
             result.totalCount >= result.itemsCount;
    }
  },
  {
    id: 'fetch-nonexistent-entry',
    name: 'Fetch Non-existent Entry',
    description: 'Test error handling by fetching a non-existent entry',
    category: 'cma',
    testId: 'sdk-cma-get-nonexistent-entry',
    resultTestId: 'sdk-cma-error-result',
    execute: async (sdk, context) => {
      if (!context?.cmsInstance || !context?.stackApiKey) {
        throw new Error('CMS instance or API key not available');
      }
      
      try {
        const stack = context.cmsInstance.stack({ api_key: context.stackApiKey });
        await stack.contentType('non_existent_ct').entry('non_existent_entry').fetch();
        throw new Error('Expected error was not thrown');
      } catch (error: any) {
        // This is expected - we want to test error handling
        if (error?.data?.error) {
          return error.data.error;
        }
        throw error;
      }
    },
    formatResult: (error: any) => {
      if (typeof error === 'string') return error;
      return JSON.stringify(error);
    },
    validateResult: (result: any) => {
      const errorStr = typeof result === 'string' ? result : JSON.stringify(result);
      return /error|not found|does not exist/i.test(errorStr);
    }
  }
];
