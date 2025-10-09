import { SdkTestOperation } from "../../types/sdk-testing.types";

export const globalFullPageOperations: SdkTestOperation[] = [
  {
    id: 'sdk-gfp-get-current-org',
    name: 'Get Current Organization',
    description: 'Retrieve current organization details',
    testId: 'sdk-gfp-get-current-org',
    resultTestId: 'sdk-gfp-get-current-org-result',
    execute: async (sdk) => {
      const currentOrg = sdk.location.GlobalFullPageLocation?.currentOrganization;
      if (!currentOrg) {
        throw new Error('Current organization not available');
      }
      
      return {
        status: 'success',
        message: 'Current organization retrieved successfully',
        organization: {
          name: currentOrg.name,
          uid: currentOrg.uid
        }
      };
    },
    formatResult: (result) => JSON.stringify(result, null, 2),
    validateResult: (result) => {
      const typedResult = result as { status?: string; organization?: { name?: string; uid?: string } };
      return typedResult?.status === 'success' && 
             !!typedResult?.organization?.name && 
             !!typedResult?.organization?.uid;
    }
  },
  {
    id: 'sdk-gfp-get-org-name',
    name: 'Get Organization Name',
    description: 'Get the name of current organization',
    testId: 'sdk-gfp-get-org-name',
    resultTestId: 'sdk-gfp-get-org-name-result',
    execute: async (sdk) => {
      const currentOrg = sdk.location.GlobalFullPageLocation?.currentOrganization;
      if (!currentOrg) {
        throw new Error('Current organization not available');
      }
      
      return {
        status: 'success',
        name: currentOrg.name
      };
    },
    formatResult: (result) => JSON.stringify(result, null, 2),
    validateResult: (result) => {
      const typedResult = result as { status?: string; name?: string };
      return typedResult?.status === 'success' && !!typedResult?.name;
    }
  },
  {
    id: 'sdk-gfp-get-org-uid',
    name: 'Get Organization UID',
    description: 'Get the UID of current organization',
    testId: 'sdk-gfp-get-org-uid',
    resultTestId: 'sdk-gfp-get-org-uid-result',
    execute: async (sdk) => {
      const currentOrg = sdk.location.GlobalFullPageLocation?.currentOrganization;
      if (!currentOrg) {
        throw new Error('Current organization not available');
      }
      
      return {
        status: 'success',
        uid: currentOrg.uid
      };
    },
    formatResult: (result) => JSON.stringify(result, null, 2),
    validateResult: (result) => {
      const typedResult = result as { status?: string; uid?: string };
      return typedResult?.status === 'success' && !!typedResult?.uid;
    }
  }
];

