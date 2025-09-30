import { SdkTestOperation } from '../../types/sdk-testing.types';

// Store entry UID between API operations
let apiCreatedEntryUid = '';

export const apiOperations: SdkTestOperation[] = [
  {
    id: 'sdk-api-list-cts',
    name: 'List Content Types',
    description: 'GET /v3/content_types?limit=1',
    category: 'api',
    testId: 'sdk-api-list-cts',
    resultTestId: 'sdk-api-list-cts-result',
    execute: async (sdk) => {
      const res = await sdk.api(`${sdk.endpoints?.CMA}/v3/content_types?limit=1`, {
        method: 'GET',
      });
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err?.error_message || 'Failed to list content types');
      }
      const json = await res.json() as Record<"content_types", unknown[]>;
      return { count: json?.content_types?.length || 0 };
    },
    formatResult: (result: any) => JSON.stringify(result),
    validateResult: (result: any) => result?.count === 1,
  },

  {
    id: 'sdk-api-404',
    name: 'GET 404 (does_not_exist)',
    description: 'GET /v3/does_not_exist should 404 with error body',
    category: 'api',
    testId: 'sdk-api-404',
    resultTestId: 'sdk-api-404-result',
    execute: async (sdk) => {
      const res = await sdk.api(`${sdk.endpoints.CMA}/v3/does_not_exist`, {
        method: 'GET',
      });
      if (!res.ok) {
        if (res.status === 404)
        throw new Error('Expected, got ' + res.status);
      }
      return { status: 'ok' };
    },
    formatResult: (result: any) => JSON.stringify(result),
    validateResult: (result: any) => result?.status === 'ok',
  },

  {  
    id: 'create-test-content-type-api',
    name: 'Create Test Content Type',
    description: 'Create content type "test_content_type" if it does not exist',
    category: 'api',
    testId: 'sdk-api-create-content-type',
    resultTestId: 'sdk-api-create-ct-result',
    execute: async (sdk, context) => {
      if (!context?.stackApiKey) throw new Error('API key not available');
      // If content type exists, report exists
      const getRes = await sdk.api(`${sdk.endpoints.CMA}/v3/content_types/test_content_type`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      });
      if (getRes.ok) {
        return { status: 'exists' };
      }
      if (getRes.status && getRes.status !== 422) {
        const err = await getRes.json().catch(() => ({}));
        throw new Error(err?.error_message || 'Failed to check content type');
      }

      const res: any = await sdk.api(`${sdk.endpoints.CMA}/v3/content_types`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content_type: {
            title: 'Test Content Type',
            uid: 'test_content_type',
            schema: [
              { display_name: 'Title', uid: 'title', data_type: 'text', field_metadata: { _default: true }, mandatory: true, multiple: false, unique: false },
              { display_name: 'Description', uid: 'description', data_type: 'text', field_metadata: { _default: true }, multiple: false, unique: false }
            ],
            options: { is_page: false, singleton: false, title: 'Test Content Type', sub_title: ['Test Content Type Description'] }
          }
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error_message || 'Failed to create content type');
      }
      return { status: 'created' };
    },
    formatResult: (result: any) => JSON.stringify(result),
    validateResult: (result: any) => !!result && (result.status === 'created' || result.status === 'exists'),
  },

  {
    id: 'delete-test-content-type-api',
    name: 'Delete Test Content Type',
    description: 'Delete content type "test_content_type" if it exists',
    category: 'api',
    testId: 'sdk-api-delete-content-type',
    resultTestId: 'sdk-api-delete-ct-result',
    execute: async (sdk) => {
      // If not exists, return not_found
      const getRes: any = await sdk.api(`${sdk.endpoints.CMA}/v3/content_types/test_content_type`, {
        method: 'GET',
      });
      if (!getRes.ok && getRes.status === 422) {
        const err = await getRes.json()
        throw new Error(err?.error_message || 'Failed to check content type');
      }

      const res: any = await sdk.api(`${sdk.endpoints.CMA}/v3/content_types/test_content_type`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err?.error_message || 'Failed to delete content type');
      }
      const json = await res.json()
      return { status: 'deleted', notice: json?.notice };
    },
    formatResult: (result: any) => JSON.stringify(result),
    validateResult: (result: any) => !!result && (result.status === 'deleted' || result.status === 'not_found'),
  },

  {
    id: 'sdk-api-entry-create',
    name: 'Create Entry (sdk.api)',
    description: 'POST entry in test_content_type',
    category: 'api',
    testId: 'sdk-api-entry-create',
    resultTestId: 'sdk-api-entry-create-result',
    execute: async (sdk) => {
      const body = {
        entry: {
          title: `Test Entry ${Date.now()}`,
          description: 'Created via sdk.api()',
        },
      };
      const res: any = await sdk.api(`${sdk.endpoints.CMA}/v3/content_types/test_content_type/entries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error_message || 'Failed to create entry');
      }
      const json = await res.json();
      const uid = json?.entry?.uid || json?.uid || '';
      apiCreatedEntryUid = uid;
      return { status: 'created', uid };
    },
    formatResult: (result: any) => JSON.stringify(result),
    validateResult: (result: any) => !!result?.uid,
  },

  {
    id: 'sdk-api-entry-get',
    name: 'Get Entry (sdk.api)',
    description: 'GET entry by UID',
    category: 'api',
    testId: 'sdk-api-entry-get',
    resultTestId: 'sdk-api-entry-get-result',
    requiresPreviousResult: 'sdk-api-entry-create',
    execute: async (sdk) => {
      if (!apiCreatedEntryUid) throw new Error('No entry UID. Create entry first.');
      const res: any = await sdk.api(`${sdk.endpoints.CMA}/v3/content_types/test_content_type/entries/${apiCreatedEntryUid}`, {
        method: 'GET',
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error_message || 'Failed to fetch entry');
      }
      const jsonGet = await res.json();
      return {
        status: 'fetched',
        uid: jsonGet?.entry?.uid || jsonGet?.uid,
        title: jsonGet?.entry?.title || jsonGet?.title,
      };
    },
    formatResult: (result: any) => JSON.stringify(result, null, 2),
    validateResult: (result: any) => result?.status === 'fetched' && !!result?.uid,
  },

  {
    id: 'sdk-api-entry-delete',
    name: 'Delete Entry (sdk.api)',
    description: 'DELETE entry by UID',
    category: 'api',
    testId: 'sdk-api-entry-delete',
    resultTestId: 'sdk-api-entry-delete-result',
    requiresPreviousResult: 'sdk-api-entry-create',
    execute: async (sdk) => {
      if (!apiCreatedEntryUid) throw new Error('No entry UID. Create entry first.');
      const uidToDelete = apiCreatedEntryUid;
      const res: any = await sdk.api(`${sdk.endpoints.CMA}/v3/content_types/test_content_type/entries/${uidToDelete}`, {
        method: 'DELETE',
      });
      if (!(res.ok || res.status === 204)) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error_message || 'Failed to delete entry');
      }
      apiCreatedEntryUid = '';
      return { status: 'deleted', uid: uidToDelete };
    },
    formatResult: (result: any) => JSON.stringify(result),
    validateResult: (result: any) => result?.status === 'deleted',
  },
];