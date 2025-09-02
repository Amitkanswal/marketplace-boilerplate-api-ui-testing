import { SdkTestOperation } from '../../types/sdk-testing.types';

export const frameOperations: SdkTestOperation[] = [
  {
    id: 'disable-auto-resizing',
    name: 'Disable Auto Resizing',
    description: 'Disable automatic frame resizing',
    category: 'frame',
    testId: 'sdk-frame-disable-autosize',
    resultTestId: 'sdk-frame-autosize-result',
    execute: async (sdk) => {
      const location = sdk.getCurrentLocation();
      const locationInstance = (sdk as any).location?.[location];
      
      if (!locationInstance?.frame?.disableAutoResizing) {
        throw new Error('Frame operations not available in this context');
      }
      
      await locationInstance.frame.disableAutoResizing();
      return { status: 'disabled' };
    },
    formatResult: () => 'Auto-resizing disabled'
  },
  {
    id: 'update-height-450',
    name: 'Update Height (450)',
    description: 'Set frame height to 450px',
    category: 'frame',
    testId: 'sdk-frame-height-450',
    resultTestId: 'sdk-frame-size',
    execute: async (sdk) => {
      const location = sdk.getCurrentLocation();
      const locationInstance = (sdk as any).location?.[location];
      
      if (!locationInstance?.frame?.updateHeight) {
        throw new Error('Frame operations not available in this context');
      }
      
      await locationInstance.frame.updateHeight(450);
      
      // Wait for resize and get new dimensions
      await new Promise(resolve => setTimeout(resolve, 200));
      
      if (typeof window !== 'undefined') {
        return {
          width: window.innerWidth,
          height: window.innerHeight
        };
      }
      
      return { status: 'updated', height: 450 };
    },
    formatResult: (result: any) => {
      if (result.width && result.height) {
        return `${result.width}x${result.height}`;
      }
      return 'Height updated to 450px';
    }
  },
  {
    id: 'update-dimension',
    name: 'Update Dimension (520x380)',
    description: 'Set frame dimensions to 520x380',
    category: 'frame',
    testId: 'sdk-frame-dimension',
    resultTestId: 'sdk-frame-size',
    execute: async (sdk) => {
      const location = sdk.getCurrentLocation();
      const locationInstance = (sdk as any).location?.[location];
      
      if (!locationInstance?.frame?.updateDimension) {
        throw new Error('Frame operations not available in this context');
      }
      
      await locationInstance.frame.updateDimension({ width: 520, height: 380 });
      
      // Wait for resize and get new dimensions
      await new Promise(resolve => setTimeout(resolve, 200));
      
      if (typeof window !== 'undefined') {
        return {
          width: window.innerWidth,
          height: window.innerHeight
        };
      }
      
      return { status: 'updated', width: 520, height: 380 };
    },
    formatResult: (result: any) => {
      if (result.width && result.height) {
        return `${result.width}x${result.height}`;
      }
      return 'Dimensions updated to 520x380';
    }
  }
];

// Helper to check if frame operations are available
export function canUseFrameOperations(sdk: any): boolean {
  const location = sdk.getCurrentLocation();
  const locationInstance = sdk.location?.[location];
  return !!(locationInstance?.frame?.updateHeight);
}
