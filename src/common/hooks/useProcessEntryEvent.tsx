/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react/react-in-jsx-scope */
import { useCallback } from "react";
import { useAppSdk } from "./useAppSdk";
import StatusPill from "../../components/Table/StatusPill";
import Entry from "@contentstack/app-sdk/dist/src/entry";

const locationMapper = new Map<string, string>([
  ["WIDGET", "SidebarWidget"],
  ["FIELD", "CustomField"],
  ["FIELD_MODIFIER_LOCATION", "FieldModifierLocation"],
  ["DASHBOARD", "DashboardWidget"],
  ["FULL_PAGE_LOCATION", "FullPage"],
  ["ASSET_SIDEBAR_WIDGET", "AssetSidebarWidget"],
]);

const useProcessEntryEvent = () => {
  const appSDK = useAppSdk();
  const locationName = appSDK?.getCurrentLocation();
  const locationKey = locationMapper.get(locationName || "");
  //@ts-ignore
  const entry = appSDK?.location[locationKey]?.entry as Entry;

  return useCallback(
    async (eventName: string) => {
      const eventObj: { eventName: string; status: JSX.Element; response: unknown } = {
        eventName,
        status: <StatusPill status="in-progress" />,
        response: null,
      };

      if (!entry) {
        eventObj.status = <StatusPill status="failed" />;
        return eventObj;
      }

      try {
        // Check if the method exists on the entry object
        const methodExists = typeof entry[eventName as keyof Entry] === "function";

        if (methodExists) {
          //@ts-ignore
          const result = await entry[eventName]();
          // Mark as done if execution succeeds (regardless of return value)
          eventObj.status = <StatusPill status="done" />;
          eventObj.response = result;
        } else {
          eventObj.status = <StatusPill status="failed" />;
        }
      } catch (error) {
        eventObj.status = <StatusPill status="failed" />;
        eventObj.response = error;
      }
      return eventObj;
    },
    [locationName, locationKey, entry]
  );
};

export { useProcessEntryEvent };
