import { SdkTestOperation } from '../../types/sdk-testing.types';

export const cmaOperations: SdkTestOperation[] = [
  {
    id: 'create-test-content-type',
    name: 'Create Test Content Type',
    description: 'Create content type "test_content_type" if it does not exist',
    category: 'cma',
    testId: 'sdk-cma-create-content-type',
    resultTestId: 'sdk-cma-ct-result',
    execute: async (sdk, context) => {
      if (!context?.cmsInstance || !context?.stackApiKey) {
        throw new Error('CMS instance or API key not available');
      }
      const stack = context.cmsInstance.stack({ api_key: context.stackApiKey });
      try {
        const ct = await stack
          .contentType()
          .create({
            content_type: {
              title: 'Test Content Type',
              uid: 'test_content_type',
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
                title: 'Test Content Type',
                sub_title: ['Test Content Type Description'],
              },
            },
          });
        return { status: 'created', uid: ct?.uid || 'test_content_type' };
      } catch (error: any) {
        // If already exists, treat as success
        const msg = (error?.data?.error_message || '').toString().toLowerCase();
        if (msg.includes('already') || msg.includes('exists') || msg.includes('duplicate')) {
          return { status: 'exists', uid: 'test_content_type' };
        }
        throw error;
      }
    },
    formatResult: (result: any) => JSON.stringify(result),
    validateResult: (result: any) => !!result && (result.status === 'created' || result.status === 'exists'),
  },
  {
    id: 'delete-test-content-type',
    name: 'Delete Test Content Type',
    description: 'Delete content type "test_content_type" if it exists',
    category: 'cma',
    testId: 'sdk-cma-delete-content-type',
    resultTestId: 'sdk-cma-delete-result',
    execute: async (sdk, context) => {
      if (!context?.cmsInstance || !context?.stackApiKey) {
        throw new Error('CMS instance or API key not available');
      }
      const stack = context.cmsInstance.stack({ api_key: context.stackApiKey });
      try {
        await stack.contentType('test_content_type').delete();
        return { status: 'deleted', uid: 'test_content_type' };
      } catch (error: any) {
        // If doesn't exist, treat as success (already deleted)
        const msg = (error?.data?.error_message || '').toString().toLowerCase();
        if (msg.includes('not found') || msg.includes('does not exist') || msg.includes('not exist')) {
          return { status: 'not found', uid: 'test_content_type' };
        }
        throw error;
      }
    },
    formatResult: (result: any) => JSON.stringify(result),
    validateResult: (result: any) => !!result && (result.status === 'deleted' || result.status === 'not found'),
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
    formatResult: (result: any) => JSON.stringify(result),
    validateResult: (result: any) => {
      return result && typeof result.count === 'number' && result.count >= 0;
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
