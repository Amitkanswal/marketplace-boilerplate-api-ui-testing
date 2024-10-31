import { ContentstackClient } from '@contentstack/management';
import UiLocation from "@contentstack/app-sdk/dist/src/uiLocation";

import { singlepageCT, multiPageCT, schema } from './mock/content-type';
import { createGlobalField } from './mock/globalfield';


const label = {
  name: 'First label',
  content_types: [singlepageCT.content_type.uid]
}

let labelUID = ''
let deleteLabelUID = ''

const ContentstackAPI = {
  //----------------Organization----------------
  fetchOrgDetails: (client: ContentstackClient, appSdk: UiLocation) => {
    return client.organization().fetchAll();
  },

  //----------------Stack----------------
  createStack: async (client: ContentstackClient, appSdk: UiLocation) => {
    const newStack = {
      stack: {
        name: 'My New Stack',
        description: 'My new test stack',
        master_locale: 'en-us',
      },
    };
    return client.stack().create(newStack, { organization_uid: appSdk.ids.orgUID });
  },

  fetchStackById: (client: ContentstackClient, appSdk: UiLocation) => {
    return client.stack({ api_key: appSdk.ids.apiKey }).fetch();
  },

  fetchAllStacks: (client: ContentstackClient, appSdk: UiLocation) => {
    return client.stack().query().find();
  },

  //----------------Content Type----------------
  createSinglePageContentType: (client: ContentstackClient, appSdk: UiLocation) => {
    return client.stack({ api_key: appSdk.ids.apiKey }).contentType().create({ content_type: singlepageCT.content_type });
  },

  createMultiPageContentType: (client: ContentstackClient, appSdk: UiLocation) => {
    return client.stack({ api_key: appSdk.ids.apiKey }).contentType().create({ content_type: multiPageCT.content_type });
  },

  fetchContentType: (client: ContentstackClient, appSdk: UiLocation) => {
    return client.stack({ api_key: appSdk.ids.apiKey }).contentType(multiPageCT.content_type.uid).fetch();
  },

  fetchAllContentTypes: (client: ContentstackClient, appSdk: UiLocation) => {
    return client.stack({ api_key: appSdk.ids.apiKey }).contentType().query().find();
  },

  queryContentTypeTitle: (client: ContentstackClient, appSdk: UiLocation) => {
    return client.stack({ api_key: appSdk.ids.apiKey }).contentType(multiPageCT.content_type.title).fetch();
  },

  //----------------Locale----------------
  fetchLocale: (client: ContentstackClient, appSdk: UiLocation) => {
    return client.stack({ api_key: appSdk.ids.apiKey }).locale().query().find();
  },

  //----------------Global Fields----------------
  createGlobalField: (client: ContentstackClient, appSdk: UiLocation) => {
    return client.stack({ api_key: appSdk.ids.apiKey }).globalField().create(createGlobalField);
  },

  fetchGlobalField: (client: ContentstackClient, appSdk: UiLocation) => {
    return client.stack({ api_key: appSdk.ids.apiKey }).globalField(createGlobalField.global_field.uid).fetch();
  },

  updateGlobalField: async (client: ContentstackClient, appSdk: UiLocation) => {
    const globalField = await client.stack({ api_key: appSdk.ids.apiKey }).globalField(createGlobalField.global_field.uid).fetch();
    globalField.title = "Updated Global Field";
    return globalField.update();
  },
/*
  // importGlobalField: (client: ContentstackClient, appSdk: UiLocation) => {
    // return client.stack({ api_key: appSdk.ids.apiKey }).import({
      // global_field: path.join(__dirname, './mock/globalfield.json'),
    // });
  }, */

  fetchAllGlobalFields: (client: ContentstackClient, appSdk: UiLocation) => {
    return client.stack({ api_key: appSdk.ids.apiKey }).globalField().query().find();
  },

  //----------------Label----------------
  createLabel: async(client: ContentstackClient, appSdk: UiLocation) => {
    const createLabel = client.stack({ api_key: appSdk.ids.apiKey }).label().create({ label });
    labelUID = (await createLabel).uid;
    return createLabel;
  },

  createLabelWithParent: async(client: ContentstackClient, appSdk: UiLocation) => {
    const label = {
      name: 'With Parent label',
      parent: [labelUID],
      content_types: [singlepageCT.content_type.uid]
    }
    const parentLabel = client.stack({ api_key: appSdk.ids.apiKey }).label().create({ label });
    deleteLabelUID = (await parentLabel).uid;
    return parentLabel;
  },

  fetchLabelByUid: (client: ContentstackClient, appSdk: UiLocation) => {
    return client.stack({ api_key: appSdk.ids.apiKey }).label(labelUID).fetch();
  },

  fetchAllLabels: (client: ContentstackClient, appSdk: UiLocation) => {
    return client.stack({ api_key: appSdk.ids.apiKey }).label().query().find();
  },

  queryLabelByName: (client: ContentstackClient, appSdk: UiLocation) => {
    return client.stack({ api_key: appSdk.ids.apiKey }).label().query({ query: { name: label.name } }).find();
  },

  updateLabel: async (client: ContentstackClient, appSdk: UiLocation) => {
    const label = await client.stack({ api_key: appSdk.ids.apiKey }).label(labelUID).fetch();
    label.name = "Updated Label";
    return label.update();
  },

  deleteLabel: (client: ContentstackClient, appSdk: UiLocation) => {
    return client.stack({ api_key: appSdk.ids.apiKey }).label(deleteLabelUID).delete();
  },

  //----------------Workflow----------------

};

export default ContentstackAPI;