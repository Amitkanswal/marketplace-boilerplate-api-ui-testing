import UiLocation from "@contentstack/app-sdk/dist/src/uiLocation";
import { ContentstackClient } from '@contentstack/management';
import { singlepageCT, multiPageCT, schema } from './mock/content-type'

const ContentstackAPI = {

  //----------------Organization----------------

  fetchOrgDetails: (client: ContentstackClient, appSdk: UiLocation) => {
    return client.organization().fetchAll();
  },
  //----------------Stack----------------
  createStack: async (client: ContentstackClient, appSdk: UiLocation) => {
    return client.stack().create({ name: 'New Stack', description: 'This is a new stack', master_locale: 'en-us' });
  },

  fetchStackById: (client: ContentstackClient, appSdk: UiLocation) => {
    return client.stack({ api_key: appSdk.ids.apiKey }).fetch();
  },
  fetchAllStacks: (client: ContentstackClient, appSdk: UiLocation) => {
    return client.stack().query().find();
  },
  //----------------Content Type----------------

  CreateSinglePageContentType: (client: ContentstackClient, appSdk: UiLocation) => {
    return client.stack({ api_key: appSdk.ids.apiKey }).contentType().create({ content_type: singlepageCT.content_type });
  },
  CreateMultiPageContentType: (client: ContentstackClient, appSdk: UiLocation) => {
    return client.stack({ api_key: appSdk.ids.apiKey }).contentType().create({ content_type: multiPageCT.content_type });
  },

  fetchContentType: (client: ContentstackClient, appSdk: UiLocation) => {
    return client.stack({ api_key: appSdk.ids.apiKey }).contentType(multiPageCT.content_type.uid).fetch();
  },

  fetchAllContentType: (client: ContentstackClient, appSdk: UiLocation) => {
    return client.stack({ api_key: appSdk.ids.apiKey }).contentType().query().find();
  },

  queryContentTypeTitle: (client: ContentstackClient, appSdk: UiLocation) => {
    return client.stack({ api_key: appSdk.ids.apiKey }).contentType(multiPageCT.content_type.title).fetch();
  },
  //----------------Entries----------------
  
  //----------------locale----------------
  fetchLocale: (client: ContentstackClient, appSdk: UiLocation) => {
    client.stack({ api_key: appSdk.ids.apiKey }).locale().query().find();
  },
};

export default ContentstackAPI;