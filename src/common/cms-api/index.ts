import UiLocation from "@contentstack/app-sdk/dist/src/uiLocation";
import { ContentstackClient } from '@contentstack/management';

const ContentstackAPI = {
  fetchAllStacks: (client: ContentstackClient, apiSdk:UiLocation) => {
    return client.stack().query().find();
  },
  fetchStackById: (client: ContentstackClient, appSdk:UiLocation) => {
    return client.stack({ api_key: appSdk.ids.apiKey }).fetch();
  },
};

export default ContentstackAPI;