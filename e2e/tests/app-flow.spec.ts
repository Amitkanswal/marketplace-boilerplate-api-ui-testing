import { test, expect} from '@playwright/test';
import { AssetPage } from '../pages/AssetPage';

import { createContentType, createEntry, createApp, updateApp, installApp, assetUpload, uninstallApp, deleteApp, deleteContentType, entryPageFlow, initializeEntry, getExtensionFieldUid, deleteAsset } from '../utils/helper';

const jsonFile = require('jsonfile');

let savedCredentials: any = {};
let authToken: string;

interface TestData {
  appId: string;
  contentTypeId: Object | any;
  installationId: string;
  authToken: string;
  entryTitle: string;
  environment: string;
  stackDetails: any;
  assetId: string;
}
const expectedOrgUID = process.env.ORG_ID;
let currentUrl: string;
//setting up the test data for entry page actions
test.beforeAll(async () => {
  const file = 'data.json';
  const token = jsonFile.readFileSync(file);
  authToken = token.authToken;
  try {
    if (authToken) {
      const appId: string = await createApp(authToken);
      await updateApp(authToken, appId);
      const uploadedAsset = await assetUpload(process.env.STACK_API_KEY, authToken);
      savedCredentials['assetId'] = uploadedAsset.data.asset.uid;
      const installationId: string = await installApp(authToken, appId, process.env.STACK_API_KEY);
      const extensionUid = await getExtensionFieldUid(authToken);
      const contentTypeResp = await createContentType(authToken, extensionUid);
      savedCredentials['contentTypeId'] = extensionUid ? contentTypeResp.content_type.uid : undefined;
      if (contentTypeResp.notice === 'Content Type created successfully.') {
        const entryResp = await createEntry(authToken, contentTypeResp.content_type.uid);
        savedCredentials['entryUid'] = entryResp.entry.uid;
        savedCredentials['entryTitle'] = entryResp.entry.title;
        savedCredentials['appId'] = appId;
        savedCredentials['installationId'] = installationId;
      }
    }
  } catch (error) {
    console.log(error);
    return error;
  }
  
});

test('Go To Full page location', async ({ page }) => {
  const entryPage = await initializeEntry(page);
  await entryPage.navigateToDashboard();
  await entryPage.clickFullPageApp();
  const frame = await entryPage.accessFrame();
  currentUrl = page.url();
});

test('Verify Create Stack Request when required permissions are added', async ({ page }) => {
 

  // Intercept and wait for the request
  const [request, response] = await Promise.all([
    page.waitForRequest(req =>
      req.url().includes('/stacks') && req.method() === 'POST'
    ),
    page.waitForResponse(res =>
    res.url().includes('/stacks') && res.request().method() === 'POST' && res.status() === 201
  ),
    page.goto(currentUrl), 
  ]);
  // ----- ✅ Step 1: Verify Request Payload -----
  const requestBody = request.postDataJSON();
  const requestStack = requestBody?.stack;
  const requestStackName = requestStack?.name;

  expect(requestStack).toBeDefined();
  expect(requestStack.description).toBe('My new test stack');
  expect(requestStack.master_locale).toBe('en-us');
  expect(requestStack.name).toMatch(/^New Stack [A-Z0-9]{5}$/);

  // ----- ✅ Step 2: Verify Response Payload -----
  const responseBody = await response.json();
  console.log('responseBody', responseBody);
  const responseStack = responseBody?.stack;

  expect(responseStack).toBeDefined();
  expect(responseStack.org_uid).toBe(expectedOrgUID);
  expect(responseStack.name).toBe(requestStackName); // match request and response names
});
test('Verify Get Organization Request when required permissions are missing', async ({ page }) => {

  // Intercept and wait for the request
  const [request, response] = await Promise.all([
    page.waitForRequest(req =>
      req.url().includes('/organizations') && req.method() === 'GET'
    ),
    page.waitForResponse(res =>
    res.url().includes('/organizations') && res.request().method() === 'GET' && res.status() === 403
  ),
    page.goto(currentUrl), 
  ]);

  // ----- ✅ Step 1: Verify Response Payload -----
  const responseBody = await response.json();
  console.log('responseBody', responseBody);
  const responseError = responseBody?.error_message
  expect(responseError).toBe('The provided access token has insufficient scopes');
});

//tearing down of test data
test.afterAll(async () => {
  const addParams: TestData = savedCredentials;
  if (addParams.installationId) await uninstallApp(authToken, addParams.installationId);
  await deleteApp(authToken, addParams.appId);
  if (addParams.contentTypeId) {
    await deleteContentType(authToken, addParams.contentTypeId);
    await deleteAsset(authToken, addParams?.assetId);
  } else {
    throw new Error('Content Type not created');
  }
});

