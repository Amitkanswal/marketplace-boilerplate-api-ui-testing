import appSdk from '@contentstack/app-sdk'; // Adjust import based on your setup
import { HTTPMethods } from '@contentstack/app-sdk/dist/src/types/common.types';
import UiLocation from '@contentstack/app-sdk/dist/src/uiLocation';
import { client, ContentstackClient } from '@contentstack/management';

type AdapterConfig = {
  method: HTTPMethods;
  url: string;
  baseURL?: string;
  headers?: Record<string, string>;
  data: any;
  [key: string]: any;
};

describe('app-sdk API Proxy Tests', () => {
  let sdkInstance: UiLocation;
  let clientInstance: ContentstackClient;

  beforeEach(async () => {
    // Initialize the app-sdk with actual configuration
    sdkInstance = await appSdk.init();

    clientInstance = client({
      adapter: sdkInstance.createAdapter as any,
    });
  });

  it('should proxy an API call to the parent UI using appSdk', async () => {
    const requestOptions = { method: 'GET' as HTTPMethods };
    const response = await clientInstance.stack({api_key: sdkInstance.ids.apiKey});

  });

  it('should handle errors from appSdk properly', async () => {
    const requestOptions = { method: 'POST' as HTTPMethods };

    try {
      await sdkInstance.api('/error-endpoint', requestOptions);
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).toBe('Network Error');
      }
    }

    // Ensure the api method was called even in error scenarios
    expect(sdkInstance.api).toHaveBeenCalledWith('/error-endpoint', requestOptions);
  });
});