import React, { useMemo, useState, useEffect, useCallback } from 'react';
import ContentstackAPI from '../../common/cms-api';
import { client } from '@contentstack/management';
import { useAppSdk } from '../../common/hooks/useAppSdk';
import { useAppLocation } from '../../common/hooks/useAppLocation';
import "../index.css";
import "./FullPage.css";

const FullPageExtension: React.FC = () => {
  const [config, setConfig] = useState<Record<string, unknown> | null>(null);
  const [currentLocation, setCurrentLocation] = useState<string>('');
  const [currentRegion, setCurrentRegion] = useState<string>('');
  const [appVersion, setAppVersion] = useState<string>('');
  const [sdkError, setSdkError] = useState<string>('');
  const [orgUid, setOrgUid] = useState<string>('');
  const [apiKey, setApiKey] = useState<string>('');
  const [cmaEndpoint, setCmaEndpoint] = useState<string>('');
  const [frameSize, setFrameSize] = useState<string>('');
  const [cmaResult, setCmaResult] = useState<string>('');
  const [cmaErrorResult, setCmaErrorResult] = useState<string>('');
  const [postResult, setPostResult] = useState<string>('');
  const [putResult, setPutResult] = useState<string>('');
  const [deleteResult, setDeleteResult] = useState<string>('');
  const [createdEntryUid, setCreatedEntryUid] = useState<string>('');
  const appSdk = useAppSdk();
  const { locationName } = useAppLocation();
  const canResizeFrame = useMemo(() => {
    const anySdk: any = appSdk as any;
    return !!(anySdk?.location?.[locationName]?.frame?.updateHeight);
  }, [appSdk, locationName]);

  // Memoize cmsInstance to prevent it from changing on every render
  const cmsInstance = useMemo(() => {
    return client({
      adapter: appSdk?.createAdapter(),
      baseURL:appSdk?.endpoints.CMA+"/v3",
      headers:{
        "Content-Type":"application/json",
      }
    });
  }, [appSdk]);

  // Fetch data using useCallback to ensure the function is stable
  const fetchData = useCallback(async () => {
    if (!appSdk) {
      return [];
    }

    const responses = await Promise.all(
      (Object.keys(ContentstackAPI) as Array<keyof typeof ContentstackAPI>).map(async (key, idx) => {
        try {
          await ContentstackAPI[key](cmsInstance, appSdk);
          return {
            name: key,
            id: idx,
            status: 200,
            statusText: "ok",
            error: "",
          };
        } catch (error) {
          return {
            name: key,
            id: idx,
            status: 500,
            statusText: "error",
            error: (error as Error).message || "Unknown error",
          };
        }
      })
    );
    console.log("responses", responses);
    
    return responses;
  }, [appSdk, cmsInstance]);

  useEffect(() => {
    // fetchData().then(setResponseCollection);
  }, [fetchData]);

  return (
    <div className="layout-container">
      <div className="ui-location">
        {/* <TestTableComponent initEventData={responseCollection} /> */}
        {/* SDK CTA playground - table view */}
        <div style={{ marginTop: 16 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: 8 }}>Test</th>
                <th style={{ textAlign: 'left', padding: 8 }}>Action</th>
                <th style={{ textAlign: 'left', padding: 8 }}>Result</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: 8 }}>Get Config</td>
                <td style={{ padding: 8 }}>
                  <button
                    data-test-id="sdk-get-config"
                    onClick={async () => {
                      setSdkError('');
                      try {
                        const cfg = await appSdk?.getConfig?.();
                        setConfig((cfg as unknown as Record<string, unknown>) || null);
                      } catch (e) {
                        setSdkError((e as Error).message);
                      }
                    }}
                  >
                    Get Config
                  </button>
                </td>
                <td style={{ padding: 8 }}>
                  <pre data-test-id="sdk-config-json" style={{ whiteSpace: 'pre-wrap', margin: 0 }}>
                    {config ? JSON.stringify(config, null, 2) : ''}
                  </pre>
                </td>
              </tr>

              <tr>
                <td style={{ padding: 8 }}>Get Location</td>
                <td style={{ padding: 8 }}>
                  <button
                    data-test-id="sdk-get-location"
                    onClick={() => {
                      setSdkError('');
                      try {
                        const loc = appSdk?.getCurrentLocation?.();
                        setCurrentLocation(String(loc || ''));
                      } catch (e) {
                        setSdkError((e as Error).message);
                      }
                    }}
                  >
                    Get Location
                  </button>
                </td>
                <td style={{ padding: 8 }}>
                  <span data-test-id="sdk-location">{currentLocation}</span>
                </td>
              </tr>

              <tr>
                <td style={{ padding: 8 }}>Get Region</td>
                <td style={{ padding: 8 }}>
                  <button
                    data-test-id="sdk-get-region"
                    onClick={() => {
                      setSdkError('');
                      try {
                        const region = appSdk?.getCurrentRegion?.();
                        setCurrentRegion(String(region || ''));
                      } catch (e) {
                        setSdkError((e as Error).message);
                      }
                    }}
                  >
                    Get Region
                  </button>
                </td>
                <td style={{ padding: 8 }}>
                  <span data-test-id="sdk-region">{currentRegion}</span>
                </td>
              </tr>

              <tr>
                <td style={{ padding: 8 }}>Get App Version</td>
                <td style={{ padding: 8 }}>
                  <button
                    data-test-id="sdk-get-version"
                    onClick={async () => {
                      setSdkError('');
                      try {
                        const version = await appSdk?.getAppVersion?.();
                        setAppVersion(version == null ? 'null' : String(version));
                      } catch (e) {
                        setSdkError((e as Error).message);
                      }
                    }}
                  >
                    Get Version
                  </button>
                </td>
                <td style={{ padding: 8 }}>
                  <span data-test-id="sdk-version">{appVersion}</span>
                </td>
              </tr>

              <tr>
                <td style={{ padding: 8 }}>Get IDs</td>
                <td style={{ padding: 8 }}>
                  <button
                    data-test-id="sdk-get-ids"
                    onClick={() => {
                      setSdkError('');
                      try {
                        const ids = appSdk?.ids;
                        setOrgUid(String(ids?.orgUID ?? ''));
                        setApiKey(String(ids?.apiKey ?? ''));
                      } catch (e) {
                        setSdkError((e as Error).message);
                      }
                    }}
                  >
                    Get IDs
                  </button>
                </td>
                <td style={{ padding: 8 }}>
                  <div><strong>Org UID:</strong> <span data-test-id="sdk-org-uid">{orgUid}</span></div>
                  <div><strong>API Key:</strong> <span data-test-id="sdk-api-key">{apiKey}</span></div>
                </td>
              </tr>

              <tr>
                <td style={{ padding: 8 }}>Get Endpoints</td>
                <td style={{ padding: 8 }}>
                  <button
                    data-test-id="sdk-get-endpoints"
                    onClick={() => {
                      setSdkError('');
                      try {
                        const endpoints = appSdk?.endpoints;
                        setCmaEndpoint(String(endpoints?.CMA ?? ''));
                      } catch (e) {
                        setSdkError((e as Error).message);
                      }
                    }}
                  >
                    Get Endpoints
                  </button>
                </td>
                <td style={{ padding: 8 }}>
                  <span data-test-id="sdk-endpoints-cma">{cmaEndpoint}</span>
                </td>
              </tr>

              {canResizeFrame && (
              <tr>
                <td style={{ padding: 8 }}>Disable Auto Resizing</td>
                <td style={{ padding: 8 }}>
                  <button
                    data-test-id="sdk-frame-disable-autosize"
                    onClick={async () => {
                      setSdkError('');
                      try {
                        // @ts-ignore
                        const locInst = appSdk?.location?.[locationName];
                        await locInst?.frame?.disableAutoResizing?.();
                      } catch (e) {
                        setSdkError((e as Error).message);
                      }
                    }}
                  >
                    Disable
                  </button>
                </td>
                <td style={{ padding: 8 }}>-</td>
              </tr>
              )}

              {canResizeFrame && (
              <tr>
                <td style={{ padding: 8 }}>Update Height (450)</td>
                <td style={{ padding: 8 }}>
                  <button
                    data-test-id="sdk-frame-height-450"
                    onClick={async () => {
                      setSdkError('');
                      try {
                        // @ts-ignore
                        const locInst = appSdk?.location?.[locationName];
                        await locInst?.frame?.updateHeight?.(450);
                        setTimeout(() => {
                          setFrameSize(`${window.innerWidth}x${window.innerHeight}`);
                        }, 200);
                      } catch (e) {
                        setSdkError((e as Error).message);
                      }
                    }}
                  >
                    Set Height 450
                  </button>
                </td>
                <td style={{ padding: 8 }}>
                  <span data-test-id="sdk-frame-size">{frameSize}</span>
                </td>
              </tr>
              )}

              {canResizeFrame && (
              <tr>
                <td style={{ padding: 8 }}>Update Dimension (520x380)</td>
                <td style={{ padding: 8 }}>
                  <button
                    data-test-id="sdk-frame-dimension"
                    onClick={async () => {
                      setSdkError('');
                      try {
                        // @ts-ignore
                        const locInst = appSdk?.location?.[locationName];
                        await locInst?.frame?.updateDimension?.({ height: 380, width: 520 });
                        setTimeout(() => {
                          setFrameSize(`${window.innerWidth}x${window.innerHeight}`);
                        }, 200);
                      } catch (e) {
                        setSdkError((e as Error).message);
                      }
                    }}
                  >
                    Set 520x380
                  </button>
                </td>
                <td style={{ padding: 8 }}>
                  <span data-test-id="sdk-frame-size">{frameSize}</span>
                </td>
              </tr>
              )}

              <tr>
                <td style={{ padding: 8 }}>CMA: Fetch Non-existent Entry (Error Case)</td>
                <td style={{ padding: 8 }}>
                  <button
                    data-test-id="sdk-cma-get-nonexistent-entry"
                    onClick={async () => {
                      setSdkError('');
                      setCmaErrorResult('');
                      try {
                        const key = String((appSdk?.ids?.apiKey) || '');
                        if (!key) throw new Error('Missing API key');
                        const stack = cmsInstance.stack({ api_key: key });
                        // Try to fetch a non-existent entry to trigger error
                        await stack.contentType('non_existent_ct').entry('non_existent_entry').fetch();
                      } catch (e: any) {
                        setCmaErrorResult(JSON.stringify(e.data.error));
                      }
                    }}
                  >
                    Get Non-existent Entry
                  </button>
                </td>
                <td style={{ padding: 8 }}>
                  <span data-test-id="sdk-cma-error-result">{cmaErrorResult}</span>
                </td>
              </tr>

              <tr>
                <td style={{ padding: 8 }}>CMA: List Content Types</td>
                <td style={{ padding: 8 }}>
                  <button
                    data-test-id="sdk-cma-list-content-types"
                    onClick={async () => {
                      setSdkError('');
                      setCmaResult('');
                      try {
                        const key = String((appSdk?.ids?.apiKey) || '');
                        if (!key) throw new Error('Missing API key');
                        const stack = cmsInstance.stack({ api_key: key });
                        const list = await (stack.contentType().query().find?.());
                        const json = list?.items;
                        setCmaResult(JSON.stringify({ count: (json?.length || 0) }));
                      } catch (e) {
                        setSdkError((e as Error).message);
                      }
                    }}
                  >
                    List Content Types
                  </button>
                </td>
                <td style={{ padding: 8 }}>
                  <span data-test-id="sdk-cma-result">{cmaResult}</span>
                </td>
              </tr>

              <tr>
                <td style={{ padding: 8 }}>POST: Create Entry</td>
                <td style={{ padding: 8 }}>
                  <button
                    data-test-id="sdk-post-create-entry"
                    onClick={async () => {
                      setSdkError('');
                      setPostResult('');
                      try {
                        const key = String((appSdk?.ids?.apiKey) || '');
                        if (!key) throw new Error('Missing API key');
                        const stack = cmsInstance.stack({ api_key: key });
                        
                        // Create an entry in an existing content type (assuming 'test_ct' exists)
                        const entryData = {
                          title: `Test Entry ${Date.now()}`,
                          description: 'Created via SDK E2E test'
                        };
                        
                        const createdEntry = await stack
                          .contentType('test_content_type')
                          .entry()
                          .create({ entry: entryData });
                          
                        setCreatedEntryUid(createdEntry.uid || createdEntry.entry?.uid || '');
                        setPostResult(JSON.stringify({ 
                          status: 'created', 
                          uid: createdEntry.uid || createdEntry.entry?.uid,
                          title: entryData.title 
                        }));
                      } catch (e) {
                        setSdkError((e as Error).message);
                        setPostResult('Creation failed');
                      }
                    }}
                  >
                    Create Entry
                  </button>
                </td>
                <td style={{ padding: 8 }}>
                  <span data-test-id="sdk-post-result">{postResult}</span>
                </td>
              </tr>

              <tr>
                <td style={{ padding: 8 }}>PUT: Update Entry</td>
                <td style={{ padding: 8 }}>
                  <button
                    data-test-id="sdk-put-update-entry"
                    onClick={async () => {
                      setSdkError('');
                      setPutResult('');
                      try {
                        const key = String((appSdk?.ids?.apiKey) || '');
                        if (!key) throw new Error('Missing API key');
                        
                        if (!createdEntryUid) {
                          throw new Error('No entry to update. Create an entry first.');
                        }
                        
                        const stack = cmsInstance.stack({ api_key: key });
                        
                        const updateData = {
                          title: `Updated Entry ${Date.now()}`,
                          description: 'Updated via SDK E2E test'
                        };
                        
                        const updatedEntry = await stack
                          .contentType('test_content_type')
                          .entry(createdEntryUid)
                          .update({ entry: updateData });
                          
                        setPutResult(JSON.stringify({ 
                          status: 'updated', 
                          uid: updatedEntry.uid || updatedEntry.entry?.uid,
                          title: updateData.title 
                        }));
                      } catch (e) {
                        setSdkError((e as Error).message);
                        setPutResult('Update failed');
                      }
                    }}
                  >
                    Update Entry
                  </button>
                </td>
                <td style={{ padding: 8 }}>
                  <span data-test-id="sdk-put-result">{putResult}</span>
                </td>
              </tr>

              <tr>
                <td style={{ padding: 8 }}>DELETE: Remove Entry</td>
                <td style={{ padding: 8 }}>
                  <button
                    data-test-id="sdk-delete-entry"
                    onClick={async () => {
                      setSdkError('');
                      setDeleteResult('');
                      try {
                        const key = String((appSdk?.ids?.apiKey) || '');
                        if (!key) throw new Error('Missing API key');
                        
                        if (!createdEntryUid) {
                          throw new Error('No entry to delete. Create an entry first.');
                        }
                        
                        const stack = cmsInstance.stack({ api_key: key });
                        
                        const deleteResponse = await stack
                          .contentType('test_content_type')
                          .entry(createdEntryUid)
                          .delete();
                          
                        setDeleteResult(JSON.stringify({ 
                          status: 'deleted', 
                          uid: createdEntryUid,
                          notice: deleteResponse.notice || 'Entry deleted successfully'
                        }));
                        setCreatedEntryUid(''); // Clear the UID after deletion
                      } catch (e) {
                        setSdkError((e as Error).message);
                        setDeleteResult('Delete failed');
                      }
                    }}
                  >
                    Delete Entry
                  </button>
                </td>
                <td style={{ padding: 8 }}>
                  <span data-test-id="sdk-delete-result">{deleteResult}</span>
                </td>
              </tr>

              <tr>
                <td style={{ padding: 8 }}>PATCH: Publish Entry</td>
                <td style={{ padding: 8 }}>
                  <button
                    data-test-id="sdk-patch-publish-entry"
                    onClick={async () => {
                      setSdkError('');
                      setPostResult(''); // Reuse postResult for this operation
                      try {
                        const key = String((appSdk?.ids?.apiKey) || '');
                        if (!key) throw new Error('Missing API key');
                        
                        if (!createdEntryUid) {
                          throw new Error('No entry to publish. Create an entry first.');
                        }
                        
                        const stack = cmsInstance.stack({ api_key: key });
                        
                        // Use publish with required publish details
                        const publishResponse = await stack
                          .contentType('test_content_type')
                          .entry(createdEntryUid)
                          .publish({ 
                            publishDetails: {
                              environments: ['development'],
                              locales: ['en-us']
                            }
                          });
                          
                        setPostResult(JSON.stringify({ 
                          status: 'published', 
                          uid: createdEntryUid,
                          notice: publishResponse.notice || 'Entry published successfully'
                        }));
                      } catch (e) {
                        setSdkError((e as Error).message);
                        setPostResult('Publish failed');
                      }
                    }}
                  >
                    Publish Entry
                  </button>
                </td>
                <td style={{ padding: 8 }}>
                  <span data-test-id="sdk-patch-result">{postResult}</span>
                </td>
              </tr>

              <tr>
                <td style={{ padding: 8 }}>GET: Fetch Entry by UID</td>
                <td style={{ padding: 8 }}>
                  <button
                    data-test-id="sdk-get-fetch-entry"
                    onClick={async () => {
                      setSdkError('');
                      setCmaResult(''); // Reuse cmaResult for this operation
                      try {
                        const key = String((appSdk?.ids?.apiKey) || '');
                        if (!key) throw new Error('Missing API key');
                        
                        if (!createdEntryUid) {
                          throw new Error('No entry to fetch. Create an entry first.');
                        }
                        
                        const stack = cmsInstance.stack({ api_key: key });
                        
                        const fetchedEntry = await stack
                          .contentType('test_content_type')
                          .entry(createdEntryUid)
                          .fetch();
                          
                        setCmaResult(JSON.stringify({ 
                          status: 'fetched', 
                          uid: fetchedEntry.uid,
                          title: fetchedEntry.title || 'No title',
                          created_at: fetchedEntry.created_at
                        }));
                      } catch (e) {
                        setSdkError((e as Error).message);
                        setCmaResult('Fetch failed');
                      }
                    }}
                  >
                    Fetch Entry
                  </button>
                </td>
                <td style={{ padding: 8 }}>
                  <span data-test-id="sdk-get-fetch-result">{cmaResult}</span>
                </td>
              </tr>

              <tr>
                <td style={{ padding: 8 }}>POST: Create Asset</td>
                <td style={{ padding: 8 }}>
                  <button
                    data-test-id="sdk-post-create-asset"
                    onClick={async () => {
                      setSdkError('');
                      setPostResult('');
                      try {
                        const key = String((appSdk?.ids?.apiKey) || '');
                        if (!key) throw new Error('Missing API key');
                        const stack = cmsInstance.stack({ api_key: key });
                        
                        // Create a simple text file asset
                        const assetData = {
                          upload: 'data:text/plain;base64,VGhpcyBpcyBhIHRlc3QgZmlsZSBmcm9tIFNESyBFMkU=', // "This is a test file from SDK E2E"
                          title: `Test Asset ${Date.now()}`,
                          description: 'Created via SDK E2E test'
                        };
                        
                        const createdAsset = await stack.asset().create(assetData);
                        
                        setPostResult(JSON.stringify({ 
                          status: 'asset_created', 
                          uid: createdAsset.uid,
                          title: assetData.title,
                          filename: createdAsset.filename
                        }));
                      } catch (e) {
                        setSdkError((e as Error).message);
                        setPostResult('Asset creation failed');
                      }
                    }}
                  >
                    Create Asset
                  </button>
                </td>
                <td style={{ padding: 8 }}>
                  <span data-test-id="sdk-post-asset-result">{postResult}</span>
                </td>
              </tr>

              {sdkError ? (
                <tr>
                  <td style={{ padding: 8 }}>Error</td>
                  <td style={{ padding: 8 }}>-</td>
                  <td style={{ padding: 8, color: 'red' }} data-test-id="sdk-error">{sdkError}</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FullPageExtension;