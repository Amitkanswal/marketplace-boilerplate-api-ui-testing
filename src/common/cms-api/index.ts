import { ContentstackClient } from '@contentstack/management';
import UiLocation from "@contentstack/app-sdk/dist/src/uiLocation";

const ContentstackAPI = {
  //----------------Organization----------------
  fetchOrgDetails: (client: ContentstackClient, appSdk: UiLocation) => {
    return client.organization().fetchAll();
  },

  //----------------Stack----------------
  createStack: async (client: ContentstackClient, appSdk: UiLocation) => {
    const randomSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
    const stackName = `New Stack ${randomSuffix}`;
    const newStack = {
      stack: {
        name: stackName,
        description: 'My new test stack',
        master_locale: 'en-us',
      },
    };
    const createdStack = await client.stack().create(newStack, { organization_uid: appSdk.ids.orgUID });
    return createdStack;
  },

/*  updateStack: async (client: ContentstackClient, appSdk: UiLocation) => {
    const randomSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
    const stackName = `Stack ${randomSuffix}`;
    const newStack = {
      stack: {
        name: stackName,
        description: 'My test stack',
        master_locale: 'en-us',
      },
    };
    const stackInstance = await client.stack({ api_key: appSdk.ids.apiKey }).fetch();
    const updatedStack = await stackInstance.update(newStack);
    return updatedStack;
  },

  deleteStack: async (client: ContentstackClient, appSdk: UiLocation) => {
    const stackInstance = await client.stack({ api_key: appSdk.ids.apiKey }).fetch();
    return stackInstance.delete();
  }, */
};
export default ContentstackAPI;