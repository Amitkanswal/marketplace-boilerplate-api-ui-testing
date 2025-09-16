import { SdkTestOperation } from '../../types/sdk-testing.types';
import UiLocation from '@contentstack/app-sdk/dist/src/uiLocation';

let lastSavedAssetData: any = null;
let lastChangedAssetData: any = null;

export const registerCallbacks = (sdk: UiLocation) => {
  sdk.location?.AssetSidebarWidget?.onSave((updatedAsset: any) => {
    lastSavedAssetData = updatedAsset;
  });
  sdk?.location?.AssetSidebarWidget?.onChange((updatedAsset: any) => {
    console.log('updatedAsset', updatedAsset);
    lastChangedAssetData = updatedAsset;
  });
};

export const asbOperations: SdkTestOperation[] = [
  {
    id: 'asb-asset-read',
    name: 'Get Asset Data',
    description: 'Read current asset data from Asset Sidebar',
    category: 'asb',
    testId: 'sdk-asb-asset',
    resultTestId: 'sdk-asb-asset-result',
    execute: async (sdk) => {
      const asset = sdk?.location?.AssetSidebarWidget?.currentAsset;
      if (!asset) {
        throw new Error('Asset object or getData() not available at SidebarWidget');
      }
      
      return asset;
    },
    formatResult: (result: unknown) => JSON.stringify(result, null, 2),
    validateResult: (result: any) => typeof result?.uid === 'string' && result.uid.length > 0,
  },
  {
    id: 'asb-asset-update',
    name: 'Update Asset',
    description: 'Update current asset description in Asset Sidebar',
    category: 'asb',
    testId: 'sdk-asb-asset-update',
    resultTestId: 'sdk-asb-asset-update-result',
    execute: async (sdk) => {
      const asset = sdk?.location?.AssetSidebarWidget?.currentAsset;
      if (!asset) {
        throw new Error('Asset object not available at AssetSidebarWidget');
      }
      
      const currentData = asset;
      const updatedData = {
        ...currentData,
        description: `Updated via SDK at ${new Date().toISOString()}`
      };
      
      if (typeof sdk?.location?.AssetSidebarWidget?.setData === 'function') {
          await sdk.location.AssetSidebarWidget.setData(updatedData);
        return { status: 'success', message: 'Asset updated successfully', assetData: updatedData };
      } else {
        throw new Error('Asset setData() method not available');
      }
    },
    formatResult: (result: unknown) => JSON.stringify(result, null, 2),
    validateResult: (result: any) => result?.status === 'success',
  },
  {
    id: 'asb-asset-last-saved',
    name: 'Get Last Saved Asset Data',
    description: 'Get the last saved asset data',
    category: 'asb',
    testId: 'sdk-asb-asset-last-saved',
    resultTestId: 'sdk-asb-asset-last-saved-result',
    execute: async () => {
      return lastSavedAssetData;
    },
    formatResult: (result: unknown) => JSON.stringify(result, null, 2),
    validateResult: (result: any) => typeof result?.uid === 'string' && result.uid.length > 0,
  },
  {
    id: 'asb-asset-last-changed',
    name: 'Get Last Changed Asset Data',
    description: 'Get the last changed asset data',
    category: 'asb',
    testId: 'sdk-asb-asset-last-changed',
    resultTestId: 'sdk-asb-asset-last-changed-result',
    execute: async () => {
      return lastChangedAssetData;
    },
    formatResult: (result: unknown) => JSON.stringify(result, null, 2),
    validateResult: (result: any) => typeof result?.uid === 'string' && result.uid.length > 0,
  },
];
