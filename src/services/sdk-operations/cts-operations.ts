import { SdkTestOperation } from '../../types/sdk-testing.types';

let lastSavedContentType: any = null;

export const ctsOperations: SdkTestOperation[] = [
  {
    id: 'cts-current-content-type',
    name: 'Get Current Content Type',
    description: 'Read current content type metadata from Content Type Sidebar',
    category: 'cts',
    testId: 'sdk-cts-current',
    resultTestId: 'sdk-cts-current-result',
    execute: async (sdk) => {
      const cts = sdk?.location?.ContentTypeSidebarWidget;
      if (cts?.getData) {
        const data = await cts.getData();
        return {
          uid: data?.uid,
          title: data?.title,
          description: data?.description,
        };
      }
    },
    formatResult: (result: unknown) => JSON.stringify(result, null, 2),
    validateResult: (result: any) => typeof result?.uid === 'string' && result.uid.length > 0,
  },
  {
    id: 'cts-on-save-register',
    name: 'Register onSave Callback',
    description: 'Subscribe to content type onSave event',
    category: 'cts',
    testId: 'sdk-cts-onsave',
    resultTestId: 'sdk-cts-onsave-result',
    execute: async (sdk) => {
      const cts: any = sdk?.location?.ContentTypeSidebarWidget;
      if (!cts || typeof cts.onSave !== 'function') {
        throw new Error('onSave not available on ContentTypeSidebarWidget');
      }
      cts.onSave((updatedCT: any) => {
        lastSavedContentType = updatedCT;
      });
      return { status: 'subscribed' };
    },
    formatResult: (result: any) => JSON.stringify(result, null, 2),
    validateResult: (result: any) => result?.status === 'subscribed',
  },
  {
    id: 'cts-on-save-last',
    name: 'Get Last onSave Payload',
    description: 'Show the latest content type data received via onSave',
    category: 'cts',
    testId: 'sdk-cts-onsave-last',
    resultTestId: 'sdk-cts-onsave-last-result',
    execute: async () => {
      return lastSavedContentType || { status: 'none' };
    },
    formatResult: (result: unknown) => JSON.stringify(result, null, 2),
    validateResult: () => true,
  },
];


