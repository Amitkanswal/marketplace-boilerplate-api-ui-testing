import { SdkTestOperation } from "../../types/sdk-testing.types";

export const dashboardOperations: SdkTestOperation[] = [
  {
    id: 'sdk-dw-frame',
    name: 'Frame Layout Awareness',
    description: 'Test frame rendering and layout awareness',
    testId: 'sdk-dw-frame',
    resultTestId: 'sdk-dw-frame-result',
    execute: async (sdk) => {
      const frame = sdk.location.DashboardWidget?.frame;
      if (!frame) {
        throw new Error('Frame not available');
      }
      
      // Enable resizing
      await frame.enableResizing();
      
      // Update height to test frame operations
      const testHeight = 500;
      await frame.updateHeight(testHeight);
      
      return {
        status: 'success',
        message: 'Frame operations executed successfully',
        resizingEnabled: true,
        heightSet: testHeight
      };
    },
    formatResult: (result) => JSON.stringify(result, null, 2),
    validateResult: (result) => {
      const typedResult = result as { status?: string; resizingEnabled?: boolean };
      return typedResult?.status === 'success' && typedResult?.resizingEnabled === true;
    }
  },
  {
    id: 'sdk-dw-stack',
    name: 'Stack Access',
    description: 'Access stack helper and retrieve stack data',
    testId: 'sdk-dw-stack',
    resultTestId: 'sdk-dw-stack-result',
    execute: async (sdk) => {
      const stack = sdk.location.DashboardWidget?.stack;
      if (!stack) {
        throw new Error('Stack not available');
      }
      
      // Get stack data
      const stackData = await stack.getData();
      
      return {
        status: 'success',
        message: 'Stack helper accessed successfully',
        hasStack: true,
        stackData: {
          name: stackData?.name,
          api_key: stackData?.api_key,
          uid: stackData?.uid
        }
      };
    },
    formatResult: (result) => JSON.stringify(result, null, 2),
    validateResult: (result) => {
      const typedResult = result as { status?: string; hasStack?: boolean; stackData?: unknown };
      return typedResult?.status === 'success' && 
             typedResult?.hasStack === true && 
             !!typedResult?.stackData;
    }
  },
  {
    id: 'sdk-dw-get-content-types',
    name: 'Get Content Types',
    description: 'Retrieve all content types from the stack',
    testId: 'sdk-dw-get-content-types',
    resultTestId: 'sdk-dw-get-content-types-result',
    execute: async (sdk) => {
      const stack = sdk.location.DashboardWidget?.stack;
      if (!stack) {
        throw new Error('Stack not available');
      }
      
      const contentTypes = await stack.getContentTypes();
      
      return {
        status: 'success',
        message: 'Content types retrieved successfully',
        count: contentTypes?.content_types?.length || 0,
        contentTypes: contentTypes?.content_types?.slice(0, 3).map((ct: any) => ({
          uid: ct.uid,
          title: ct.title
        })) || []
      };
    },
    formatResult: (result) => JSON.stringify(result, null, 2),
    validateResult: (result) => {
      const typedResult = result as { status?: string; count?: number };
      return typedResult?.status === 'success' && typeof typedResult?.count === 'number';
    }
  },
  {
    id: 'sdk-dw-get-environments',
    name: 'Get Environments',
    description: 'Retrieve all environments from the stack',
    testId: 'sdk-dw-get-environments',
    resultTestId: 'sdk-dw-get-environments-result',
    execute: async (sdk) => {
      const stack = sdk.location.DashboardWidget?.stack;
      if (!stack) {
        throw new Error('Stack not available');
      }
      
      const environments = await stack.getEnvironments();
      
      return {
        status: 'success',
        message: 'Environments retrieved successfully',
        count: environments?.environments?.length || 0,
        environments: environments?.environments?.map((env: any) => ({
          name: env.name,
          uid: env.uid
        })) || []
      };
    },
    formatResult: (result) => JSON.stringify(result, null, 2),
    validateResult: (result) => {
      const typedResult = result as { status?: string; count?: number };
      return typedResult?.status === 'success' && typeof typedResult?.count === 'number';
    }
  },
  {
    id: 'sdk-dw-get-locales',
    name: 'Get Locales',
    description: 'Retrieve all locales from the stack',
    testId: 'sdk-dw-get-locales',
    resultTestId: 'sdk-dw-get-locales-result',
    execute: async (sdk) => {
      const stack = sdk.location.DashboardWidget?.stack;
      if (!stack) {
        throw new Error('Stack not available');
      }
      
      const locales = await stack.getLocales();
      
      return {
        status: 'success',
        message: 'Locales retrieved successfully',
        count: locales?.locales?.length || 0,
        locales: locales?.locales?.map((locale: any) => ({
          name: locale.name,
          code: locale.code
        })) || []
      };
    },
    formatResult: (result) => JSON.stringify(result, null, 2),
    validateResult: (result) => {
      const typedResult = result as { status?: string; count?: number };
      return typedResult?.status === 'success' && typeof typedResult?.count === 'number';
    }
  },
  {
    id: 'sdk-dw-get-current-branch',
    name: 'Get Current Branch',
    description: 'Retrieve current branch details',
    testId: 'sdk-dw-get-current-branch',
    resultTestId: 'sdk-dw-get-current-branch-result',
    execute: async (sdk) => {
      const stack = sdk.location.DashboardWidget?.stack;
      if (!stack) {
        throw new Error('Stack not available');
      }
      
      const branch = await stack.getCurrentBranch();
      
      return {
        status: 'success',
        message: 'Current branch retrieved successfully',
        branch: {
          uid: branch?.uid,
          source: branch?.source,
          alias: branch?.alias
        }
      };
    },
    formatResult: (result) => JSON.stringify(result, null, 2),
    validateResult: (result) => {
      const typedResult = result as { status?: string; branch?: unknown };
      return typedResult?.status === 'success' && !!typedResult?.branch;
    }
  }
];