import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { TestTableComponent } from '../../components/Table';
import ContentstackAPI from '../../common/cms-api';
import { client } from '@contentstack/management';
import { useAppSdk } from '../../common/hooks/useAppSdk';
import { AxiosAdapter } from 'axios';
import "../index.css";
import "./FullPage.css";

type ResponseItem = {
  name: string;
  id: number;
  status: number;
  statusText: string;
  error: string;
};

const FullPageExtension: React.FC = () => {
  const [responseCollection, setResponseCollection] = useState<ResponseItem[]>([]);
  const appSdk = useAppSdk();

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
    fetchData().then(setResponseCollection);
  }, [fetchData]);

  return (
    <div className="layout-container">
      <div className="ui-location">
        <TestTableComponent initEventData={responseCollection} />
      </div>
    </div>
  );
};

export default FullPageExtension;