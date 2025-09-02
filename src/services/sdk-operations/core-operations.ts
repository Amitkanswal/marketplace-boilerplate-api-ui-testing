import { SdkTestOperation } from '../../types/sdk-testing.types';

export const coreSdkOperations: SdkTestOperation[] = [
  {
    id: 'get-config',
    name: 'Get Config',
    description: 'Retrieve application configuration',
    category: 'core',
    testId: 'sdk-get-config',
    resultTestId: 'sdk-config-json',
    execute: async (sdk) => {
      const config = await sdk.getConfig();
      return config || {};
    },
    formatResult: (result) => JSON.stringify(result, null, 2),
    validateResult: (result) => result !== null && typeof result === 'object'
  },
  {
    id: 'get-location',
    name: 'Get Location',
    description: 'Get current UI location',
    category: 'core',
    testId: 'sdk-get-location',
    resultTestId: 'sdk-location',
    execute: async (sdk) => sdk.getCurrentLocation(),
    formatResult: (result) => String(result || ''),
    validateResult: (result) => typeof result === 'string' && result.length > 0
  },
  {
    id: 'get-region',
    name: 'Get Region',
    description: 'Get current deployment region',
    category: 'core',
    testId: 'sdk-get-region',
    resultTestId: 'sdk-region',
    execute: async (sdk) => sdk.getCurrentRegion(),
    formatResult: (result) => String(result || ''),
    validateResult: (result) => {
      const validRegions = ['NA', 'EU', 'AZURE_NA', 'AZURE_EU', 'UNKNOWN'];
      return validRegions.includes(String(result));
    }
  },
  {
    id: 'get-version',
    name: 'Get App Version',
    description: 'Get application version',
    category: 'core',
    testId: 'sdk-get-version',
    resultTestId: 'sdk-version',
    execute: async (sdk) => {
      const version = await sdk.getAppVersion();
      return version == null ? 'null' : version;
    },
    formatResult: (result) => String(result),
    validateResult: (result) => {
      if (result === 'null') return true;
      const versionPattern = /^\d+(\.\d+)*$/;
      return versionPattern.test(String(result));
    }
  },
  {
    id: 'get-ids',
    name: 'Get IDs',
    description: 'Get organization and stack identifiers',
    category: 'core',
    testId: 'sdk-get-ids',
    resultTestId: 'sdk-ids',
    execute: async (sdk) => ({
      orgUid: sdk.ids?.orgUID || '',
      apiKey: sdk.ids?.apiKey || ''
    }),
    formatResult: (result: any) => {
      return `Org UID: ${result.orgUid}\nAPI Key: ${result.apiKey}`;
    },
    validateResult: (result: any) => {
      return result.orgUid && result.apiKey && 
             result.orgUid.length > 0 && result.apiKey.length > 0;
    }
  },
  {
    id: 'get-endpoints',
    name: 'Get Endpoints',
    description: 'Get API endpoint URLs',
    category: 'core',
    testId: 'sdk-get-endpoints',
    resultTestId: 'sdk-endpoints',
    execute: async (sdk) => ({
      cma: sdk.endpoints?.CMA || '',
      // Add other endpoints as needed
    }),
    formatResult: (result: any) => `CMA: ${result.cma}`,
    validateResult: (result: any) => {
      return result.cma && result.cma.includes('http');
    }
  }
];
