import React,{ useMemo } from 'react';
import { useAppSdk } from './useAppSdk';
import StatusPill from '../../components/Table/StatusPill';

const useExtensionEvents = () => {
  const appSDK = useAppSdk();
  return useMemo(() => {
    
    return ["onChange", "onSave", "onPublish", "onUnPublish"].map((name)=>{
      return {
        eventName:name,
        status: <StatusPill status="in-progress" />
      }
    })
  }, [appSDK]);
};

export {useExtensionEvents};