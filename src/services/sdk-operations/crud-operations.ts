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
    id: 'update-entry',
    name: 'Update Entry',
    description: 'Update existing entry via PUT',
    category: 'crud',
    testId: 'sdk-put-update-entry',
    resultTestId: 'sdk-put-result',
    requiresPreviousResult: 'create-entry',
    execute: async (sdk, context) => {
      if (!context?.cmsInstance || !context?.stackApiKey) {
        throw new Error('CMS instance or API key not available');
      }
      
      if (!createdEntryUid) {
        throw new Error('No entry to update. Create an entry first.');
      }
      
      const stack = context.cmsInstance.stack({ api_key: context.stackApiKey });
      
      const updateData = {
        title: `Updated Entry ${Date.now()}`,
        description: 'Updated via SDK E2E test'
      };
      
      const response = await stack
        .contentType('test_content_type')
        .entry(createdEntryUid)
        .update({ entry: updateData });
      
      return {
        status: 'updated',
        uid: response.uid || response.entry?.uid,
        title: updateData.title
      };
    },
    formatResult: (result: any) => JSON.stringify(result),
    validateResult: (result: any) => {
      return result?.status === 'updated' && !!result?.uid;
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
    id: 'publish-entry',
    name: 'Publish Entry',
    description: 'Publish entry via PATCH',
    category: 'crud',
    testId: 'sdk-patch-publish-entry',
    resultTestId: 'sdk-patch-result',
    requiresPreviousResult: 'create-entry',
    execute: async (sdk, context) => {
      if (!context?.cmsInstance || !context?.stackApiKey) {
        throw new Error('CMS instance or API key not available');
      }
      
      if (!createdEntryUid) {
        throw new Error('No entry to publish. Create an entry first.');
      }
      
      const stack = context.cmsInstance.stack({ api_key: context.stackApiKey });
      
      const response = await stack
        .contentType('test_content_type')
        .entry(createdEntryUid)
        .publish({
          publishDetails: {
            environments: ['development'],
            locales: ['en-us']
          }
        });
      
      return {
        status: 'published',
        uid: createdEntryUid,
        notice: response.notice || 'Entry published successfully'
      };
    },
    formatResult: (result: any) => JSON.stringify(result),
    validateResult: (result: any) => {
      return result?.status === 'published';
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
  {
    id: 'create-asset',
    name: 'Create Asset',
    description: 'Upload a test asset via POST',
    category: 'crud',
    testId: 'sdk-post-create-asset',
    resultTestId: 'sdk-post-asset-result',
    execute: async (sdk, context) => {
      if (!context?.cmsInstance || !context?.stackApiKey) {
        throw new Error('CMS instance or API key not available');
      }
      
      const stack = context.cmsInstance.stack({ api_key: context.stackApiKey });
      
      // Create a simple text file asset
      const assetData = {
        upload: 'data:text/plain;base64,VGhpcyBpcyBhIHRlc3QgZmlsZSBmcm9tIFNESyBFMkU=', // "This is a test file from SDK E2E"
        title: `Test Asset ${Date.now()}`,
        description: 'Created via SDK E2E test'
      };
      
      const response = await stack.asset().create(assetData);
      createdAssetUid = response.uid;
      
      return {
        status: 'asset_created',
        uid: response.uid,
        title: assetData.title,
        filename: response.filename || 'test.txt'
      };
    },
    formatResult: (result: any) => JSON.stringify(result),
    validateResult: (result: any) => {
      return result?.status === 'asset_created' && !!result?.uid;
    }
  }
];

// Helper to reset stored UIDs (useful for test cleanup)
export function resetCrudState() {
  createdEntryUid = '';
  createdAssetUid = '';
}
