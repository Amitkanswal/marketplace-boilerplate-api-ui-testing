import { useMemo } from 'react';
import { useAppSdk } from './useAppSdk';

const usePreRequests = () => {
  const appSDK = useAppSdk();
  const stack = appSDK?.stack;
  return useMemo(async () => {
    return {
      "getAllStacks": stack?._data?.org_uid,
      "getContentTypes": (await stack?.getContentTypes())?.content_types[0]?.uid,
      "getEnvironments": (await stack?.getEnvironments())?.environments[0]?.name,
      "getGlobalFields": (await stack?.getGlobalFields())?.global_fields[0]?.uid,
      "getLocales": (await stack?.getLocales())?.locales[0].code,
      "getWorkflows": (await stack?.getWorkflows())?.workflows[0]?.uid
    }
  }, [appSDK]);
};

export {usePreRequests};