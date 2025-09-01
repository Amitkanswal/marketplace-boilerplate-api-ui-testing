import { SdkTestOperation } from '../../types/sdk-testing.types';

export const esbOperations: SdkTestOperation[] = [
  {
    id: 'esb-entry-read',
    name: 'Get Entry Data',
    description: 'Read current entry data from Entry Sidebar',
    category: 'esb',
    testId: 'sdk-esb-entry',
    resultTestId: 'sdk-esb-entry-result',
    execute: async (sdk) => {
      const entry = (sdk as any)?.location?.SidebarWidget?.entry;
      if (!entry || typeof entry.getData !== 'function') {
        throw new Error('Entry object or getData() not available at SidebarWidget');
      }
      const data = await entry.getData();
      // Return a compact subset to display in UI
      return {
        uid: data?.uid,
        title: data?.title,
      };
    },
    formatResult: (result: unknown) => JSON.stringify(result, null, 2),
    validateResult: (result: any) => typeof result?.uid === 'string' && result.uid.length > 0,
  },
];



