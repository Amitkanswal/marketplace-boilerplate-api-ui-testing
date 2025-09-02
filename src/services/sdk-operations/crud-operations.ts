import { SdkTestOperation } from '../../types/sdk-testing.types';

// Store entry UID between operations
let createdEntryUid = '';
let createdAssetUid = '';

export const crudOperations: SdkTestOperation[] = [
  {
    id: 'create-entry',
    name: 'Create Entry',
    description: 'Create a new test entry via POST',
    category: 'crud',
    testId: 'sdk-post-create-entry',
    resultTestId: 'sdk-post-result',
    execute: async (sdk, context) => {
      if (!context?.cmsInstance || !context?.stackApiKey) {
        throw new Error('CMS instance or API key not available');
      }
      
      const stack = context.cmsInstance.stack({ api_key: context.stackApiKey });
      
      const entryData = {
        title: `Test Entry ${Date.now()}`,
        description: 'Created via SDK E2E test'
      };
      
      const response = await stack
        .contentType('test_content_type')
        .entry()
        .create({ entry: entryData });
      
      createdEntryUid = response.uid || response.entry?.uid || '';
      
      return {
        status: 'created',
        uid: createdEntryUid,
        title: entryData.title
      };
    },
    formatResult: (result: any) => JSON.stringify(result),
    validateResult: (result: any) => {
      return result?.status === 'created' && !!result?.uid;
    }
  },
  {
    id: 'fetch-entry',
    name: 'Fetch Entry',
    description: 'Retrieve entry by UID via GET',
    category: 'crud',
    testId: 'sdk-get-fetch-entry',
    resultTestId: 'sdk-get-fetch-result',
    requiresPreviousResult: 'create-entry',
    execute: async (sdk, context) => {
      if (!context?.cmsInstance || !context?.stackApiKey) {
        throw new Error('CMS instance or API key not available');
      }
      
      if (!createdEntryUid) {
        throw new Error('No entry to fetch. Create an entry first.');
      }
      
      const stack = context.cmsInstance.stack({ api_key: context.stackApiKey });
      
      const entry = await stack
        .contentType('test_content_type')
        .entry(createdEntryUid)
        .fetch();
      
      return {
        status: 'fetched',
        uid: entry.uid,
        title: entry.title || 'No title',
        created_at: entry.created_at
      };
    },
    formatResult: (result: any) => JSON.stringify(result, null, 2),
    validateResult: (result: any) => {
      return result?.status === 'fetched' && !!result?.uid;
    }
  },
  {
    id: 'delete-entry',
    name: 'Delete Entry',
    description: 'Remove entry via DELETE',
    category: 'crud',
    testId: 'sdk-delete-entry',
    resultTestId: 'sdk-delete-result',
    requiresPreviousResult: 'create-entry',
    execute: async (sdk, context) => {
      if (!context?.cmsInstance || !context?.stackApiKey) {
        throw new Error('CMS instance or API key not available');
      }
      
      if (!createdEntryUid) {
        throw new Error('No entry to delete. Create an entry first.');
      }
      
      const stack = context.cmsInstance.stack({ api_key: context.stackApiKey });
      
      const response = await stack
        .contentType('test_content_type')
        .entry(createdEntryUid)
        .delete();
      
      const deletedUid = createdEntryUid;
      createdEntryUid = ''; // Clear after deletion
      
      return {
        status: 'deleted',
        uid: deletedUid,
        notice: response.notice || 'Entry deleted successfully'
      };
    },
    formatResult: (result: any) => JSON.stringify(result),
    validateResult: (result: any) => {
      return result?.status === 'deleted';
    }
  },
];

// Helper to reset stored UIDs (useful for test cleanup)
export function resetCrudState() {
  createdEntryUid = '';
  createdAssetUid = '';
}
