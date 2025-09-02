import { SdkTestOperation } from '../../types/sdk-testing.types';

let createdMetadataUid = '';

const TEST_CONTENT_TYPE_UID = 'test_content_type';

async function getOrCreateEntryUid(sdk: any, context: any): Promise<string> {
  // Try previous results from CRUD and API create-entry ops
  const prevCrud = context?.previousResults?.['create-entry'] as { uid?: string } | undefined;
  const prevApi = context?.previousResults?.['sdk-api-entry-create'] as { uid?: string } | undefined;
  const uidFromPrev = prevCrud?.uid || prevApi?.uid;
  if (uidFromPrev) return uidFromPrev;

  // Fallback: create an entry in test_content_type
  const entryData = { title: `Meta Entry ${Date.now()}`, description: 'Auto-created for metadata tests' };
  if (context?.cmsInstance && context?.stackApiKey) {
    const stack = context.cmsInstance.stack({ api_key: context.stackApiKey });
    const response = await stack
      .contentType(TEST_CONTENT_TYPE_UID)
      .entry()
      .create({ entry: entryData });
    return response?.uid || response?.entry?.uid || '';
  }

  // As last resort, try sdk.api
  const res: any = await sdk.api(`${sdk.endpoints.CMA}/v3/content_types/${TEST_CONTENT_TYPE_UID}/entries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ entry: entryData })
  });
  const json = await res.json().catch(() => ({}));
  return json?.entry?.uid || '';
}

export const metadataOperations: SdkTestOperation[] = [
  {
    id: 'sdk-meta-create',
    name: 'Metadata: create',
    description: 'Create metadata for the previously created entry',
    category: 'metadata',
    testId: 'sdk-meta-create',
    resultTestId: 'sdk-meta-create-result',
    execute: async (sdk, context) => {
      const entryUid = await getOrCreateEntryUid(sdk, context);
      if (!entryUid) throw new Error('No entry UID available.');

      const res = await sdk.metadata.createMetaData({
        entity_uid: entryUid,
        _content_type_uid: TEST_CONTENT_TYPE_UID,
        type: 'entry',
        extension_uid: sdk.ids.locationUID,
        tag: 'e2e-test'
      });
      createdMetadataUid = res?.metadata?.uid || '';
      return { status: 'created', uid: createdMetadataUid };
    },
    formatResult: (r: unknown) => JSON.stringify(r),
    validateResult: (r: any) => r?.status === 'created' && !!r?.uid
  },
  {
    id: 'sdk-meta-get',
    name: 'Metadata: get',
    description: 'Retrieve metadata by UID',
    category: 'metadata',
    testId: 'sdk-meta-get',
    resultTestId: 'sdk-meta-get-result',
    requiresPreviousResult: 'sdk-meta-create',
    execute: async (sdk) => {
      if (!createdMetadataUid) throw new Error('No metadata UID. Create metadata first.');
      const res = await sdk.metadata.retrieveMetaData({ uid: createdMetadataUid });
      return { status: 'fetched', uid: res?.metadata?.uid };
    },
    formatResult: (r: unknown) => JSON.stringify(r),
    validateResult: (r: any) => r?.status === 'fetched' && r?.uid === createdMetadataUid
  },
  {
    id: 'sdk-meta-list',
    name: 'Metadata: list',
    description: 'List metadata',
    category: 'metadata',
    testId: 'sdk-meta-list',
    resultTestId: 'sdk-meta-list-result',
    requiresPreviousResult: 'sdk-meta-create',
    execute: async (sdk) => {
      const res = await sdk.metadata.retrieveAllMetaData();
      const items = res?.metadata || [];
      return { count: Array.isArray(items) ? items.length : 0 };
    },
    formatResult: (r: unknown) => JSON.stringify(r),
    validateResult: (r: any) => typeof r?.count === 'number'
  },
  {
    id: 'sdk-meta-update',
    name: 'Metadata: update',
    description: 'Update metadata',
    category: 'metadata',
    testId: 'sdk-meta-update',
    resultTestId: 'sdk-meta-update-result',
    requiresPreviousResult: 'sdk-meta-create',
    execute: async (sdk) => {
      if (!createdMetadataUid) throw new Error('No metadata UID. Create metadata first.');
      const res = await sdk.metadata.updateMetaData({
        uid: createdMetadataUid,
        tag: 'e2e-updated'
      });
      return { status: 'updated', uid: res?.metadata?.uid };
    },
    formatResult: (r: unknown) => JSON.stringify(r),
    validateResult: (r: any) => r?.status === 'updated' && r?.uid === createdMetadataUid
  },
  {
    id: 'sdk-meta-delete',
    name: 'Metadata: delete',
    description: 'Delete metadata',
    category: 'metadata',
    testId: 'sdk-meta-delete',
    resultTestId: 'sdk-meta-delete-result',
    requiresPreviousResult: 'sdk-meta-create',
    execute: async (sdk) => {
      if (!createdMetadataUid) throw new Error('No metadata UID. Create metadata first.');
      const res = await sdk.metadata.deleteMetaData({ uid: createdMetadataUid });
      const uid = createdMetadataUid;
      createdMetadataUid = '';
      return { status: 'deleted', uid, notice: res?.notice };
    },
    formatResult: (r: unknown) => JSON.stringify(r),
    validateResult: (r: any) => r?.status === 'deleted'
  },
  {
    id: 'sdk-meta-get-unknown',
    name: 'Metadata: get unknown',
    description: 'Should error for unknown UID',
    category: 'metadata',
    testId: 'sdk-meta-get-unknown',
    resultTestId: 'sdk-meta-get-unknown-result',
    execute: async (sdk) => {
      // Let error propagate so UI shows error pill
      await sdk.metadata.retrieveMetaData({ uid: 'unknown_metadata_uid_e2e' });
      return { status: 'ok_unexpected' };
    },
    formatResult: (r: unknown) => JSON.stringify(r)
  }
];


