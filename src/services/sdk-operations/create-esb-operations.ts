import { SdkTestOperation } from "../../types/sdk-testing.types";

export const createEsbOperations: SdkTestOperation[] = [
  {
    id: 'sdk-esb-get-draft-data',
    name: 'Get Draft Data',
    description: 'Get draft data from the ESB',
    category: 'create-esb',
    testId: 'sdk-esb-get-draft-data',
    resultTestId: 'sdk-esb-get-draft-data-result',
    execute: async (sdk) => {
      const entry = await sdk.location.SidebarWidget?.entry.getDraftData();
      return entry;
    },
    formatResult: (result) => JSON.stringify(result),
    validateResult: (result) => result !== null && typeof result === 'object'
  }
]