/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable no-prototype-builtins */
import { useCallback } from 'react';
import UiLocation from '@contentstack/app-sdk/dist/src/uiLocation';
import { useAppSdk } from './useAppSdk';
import StatusPill from '../../components/Table/StatusPill';
import Stack from '@contentstack/app-sdk/dist/src/stack';
import Entry from '@contentstack/app-sdk/dist/src/entry';

const locationMapper = new Map<string, string>([
  ["WIDGET", "SidebarWidget"],
  ["FIELD", "CustomField"],
  ["FIELD_MODIFIER_LOCATION", "FieldModifierLocation"],
  ["DASHBOARD","DashboardWidget"],
  ["FULL_PAGE_LOCATION", "FullPage"],
  ["ASSET_SIDEBAR_WIDGET", "AssetSidebarWidget"],
]);

const useProcessEvent = () => {
  const appSDK = useAppSdk();
  const locationName = appSDK?.getCurrentLocation();
  const locationKey = locationMapper.get(locationName || '')
  //@ts-ignore
  const stack = locationKey === "AssetSidebarWidget" ? appSDK?.stack as Stack: appSDK?.location[locationKey]?.stack as Stack;

  return useCallback(async (eventName: string, preRequestEvent: { [key: string]: unknown }) => {
    const eventObj: { eventName: string, status: JSX.Element, response: unknown } = {
      eventName,
      status: <StatusPill status="in-progress" />,
      response: null
    };
    
    if ( !stack) {
      eventObj.status = <StatusPill status="failed" />;
      return eventObj;
    }
    
    if (eventName === "AllStacks" || preRequestEvent.hasOwnProperty(`${eventName}s`)) {
      const requiredData = preRequestEvent[`${eventName}s`];
      if (!requiredData) {
        eventObj.status = <StatusPill status="skip" />;
        eventObj.response = requiredData;
      } else {
        const result = eventName === "AllStacks"
          ? //@ts-ignore
           (await stack.getAllStacks(preRequestEvent["AllStacks"]))[0]
          : //@ts-ignore
           await stack[eventName](preRequestEvent[`${eventName}s`]);
        console.info(locationName, "-", eventName, ":", result);
        eventObj.status = <StatusPill status={result ? 'done' : 'failed'} />;
        eventObj.response = result;
      }
    }
     else {
      // @ts-ignore
      const result = await stack[eventName]();
      console.info(locationName, " -", eventName, ":", result);
      eventObj.status = <StatusPill status={result ? 'done' : 'failed'} />;
      eventObj.response = result;
    }
    return eventObj;
  }, [locationName, locationKey, stack]);
};

export { useProcessEvent };