import { SdkTestOperation } from '../../types/sdk-testing.types';

const TEST_KEY = 'e2e_store_key';
const TEST_VALUE = 'e2e_store_value';

export const storeOperations: SdkTestOperation[] = [
  {
    id: 'sdk-store-set',
    name: 'Store: set(key, value)',
    description: 'Set a key/value in SDK store',
    category: 'store',
    testId: 'sdk-store-set',
    resultTestId: 'sdk-store-set-result',
    execute: async (sdk) => {
      await sdk.store.set(TEST_KEY, TEST_VALUE);
      return { status: 'ok', key: TEST_KEY, value: TEST_VALUE };
    },
    formatResult: (result: unknown) => JSON.stringify(result),
    validateResult: (result: any) => result?.status === 'ok'
  },
  {
    id: 'sdk-store-get',
    name: 'Store: get(key)',
    description: 'Get a value by key from SDK store',
    category: 'store',
    testId: 'sdk-store-get',
    resultTestId: 'sdk-store-get-result',
    requiresPreviousResult: 'sdk-store-set',
    execute: async (sdk) => {
      const value = await sdk.store.get(TEST_KEY);
      return { key: TEST_KEY, value };
    },
    formatResult: (result: unknown) => JSON.stringify(result),
    validateResult: (result: any) => result?.value === TEST_VALUE
  },
  {
    id: 'sdk-store-get-all',
    name: 'Store: getAll()',
    description: 'Get all keys/values from SDK store',
    category: 'store',
    testId: 'sdk-store-get-all',
    resultTestId: 'sdk-store-get-all-result',
    requiresPreviousResult: 'sdk-store-set',
    execute: async (sdk) => {
      const all = await sdk.store.getAll();
      return { hasKey: Object.prototype.hasOwnProperty.call(all || {}, TEST_KEY), data: all };
    },
    formatResult: (result: unknown) => JSON.stringify(result),
    validateResult: (result: any) => result?.hasKey === true
  },
  {
    id: 'sdk-store-remove',
    name: 'Store: remove(key)',
    description: 'Remove a key from SDK store',
    category: 'store',
    testId: 'sdk-store-remove',
    resultTestId: 'sdk-store-remove-result',
    requiresPreviousResult: 'sdk-store-set',
    execute: async (sdk) => {
      await sdk.store.remove(TEST_KEY);
      return { status: 'ok', key: TEST_KEY };
    },
    formatResult: (result: unknown) => JSON.stringify(result),
    validateResult: (result: any) => result?.status === 'ok'
  },
  {
    id: 'sdk-store-clear',
    name: 'Store: clear()',
    description: 'Clear the entire SDK store',
    category: 'store',
    testId: 'sdk-store-clear',
    resultTestId: 'sdk-store-clear-result',
    requiresPreviousResult: 'sdk-store-set',
    execute: async (sdk) => {
      await sdk.store.clear();
      return { status: 'ok' };
    },
    formatResult: (result: unknown) => JSON.stringify(result),
    validateResult: (result: any) => result?.status === 'ok'
  },
  {
    id: 'sdk-store-get-missing',
    name: 'Store: get(nonexistent)',
    description: 'Get a missing key should return empty/undefined',
    category: 'store',
    testId: 'sdk-store-get-missing',
    resultTestId: 'sdk-store-get-missing-result',
    execute: async (sdk) => {
        try {

            const value = await sdk.store.get('missing_key_e2e');
            console.log('Store get missing value:', value);
            return { value: value ?? null };
        } catch (error) {
            console.log('Store get missing error:', error);
            return { value: null };
        }
    },
    formatResult: (result: unknown) => JSON.stringify(result),
    validateResult: (result: any) => result?.value === null
  }
];


