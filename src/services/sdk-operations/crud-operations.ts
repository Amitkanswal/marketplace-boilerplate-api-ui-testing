import { 
  SdkTestOperation, 
  EntryOperationResult, 
  getContentTypeUidFromContext 
} from '../../types/sdk-testing.types';

// Store entry UID between operations
let createdEntryUid = '';

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
      
      const contentTypeUid = getContentTypeUidFromContext(context, 'create-test-content-type');
      
      const response = await stack
        .contentType(contentTypeUid)
        .entry()
        .create({ entry: entryData });
      
      createdEntryUid = response.uid ?? response.entry?.uid ?? '';
      
      return {
        status: 'created',
        uid: createdEntryUid,
        title: entryData.title
      };
    },
    formatResult: (result: unknown) => JSON.stringify(result),
    validateResult: (result: unknown): result is EntryOperationResult => {
      const entryResult = result as EntryOperationResult;
      return entryResult?.status === 'created' && !!entryResult?.uid;
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
      
      const contentTypeUid = getContentTypeUidFromContext(context, 'create-test-content-type');
      
      const entry = await stack
        .contentType(contentTypeUid)
        .entry(createdEntryUid)
        .fetch();
      
      return {
        status: 'fetched',
        uid: entry.uid,
        title: entry.title ?? 'No title',
        created_at: entry.created_at
      };
    },
    formatResult: (result: unknown) => JSON.stringify(result, null, 2),
    validateResult: (result: unknown): result is EntryOperationResult => {
      const entryResult = result as EntryOperationResult;
      return entryResult?.status === 'fetched' && !!entryResult?.uid;
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
      
      const contentTypeUid = getContentTypeUidFromContext(context, 'create-test-content-type');
      
      const response = await stack
        .contentType(contentTypeUid)
        .entry(createdEntryUid)
        .delete();
      
      const deletedUid = createdEntryUid;
      createdEntryUid = ''; // Clear after deletion
      
      return {
        status: 'deleted',
        uid: deletedUid,
        notice: response.notice ?? 'Entry deleted successfully'
      };
    },
    formatResult: (result: unknown) => JSON.stringify(result),
    validateResult: (result: unknown): result is EntryOperationResult => {
      const entryResult = result as EntryOperationResult;
      return entryResult?.status === 'deleted';
    }
  },
];

export function resetCrudState() {
  createdEntryUid = '';
}
