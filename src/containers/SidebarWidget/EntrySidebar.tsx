import React, { useCallback, useState, useEffect } from "react";
import localeTexts from "../../common/locales/en-us/index";
import parse from "html-react-parser";
import { useAppConfig } from "../../common/hooks/useAppConfig";
import "../index.css";
import "./EntrySidebar.css";
import Icon from "../../assets/Entry-Sidebar-Logo.svg";
import ReadOnly from "../../assets/lock.svg";
import JsonView from "../../assets/JsonView.svg";
import ConfigModal from "../../components/ConfigModal/ConfigModal";
import { useAppSdk } from "../../common/hooks/useAppSdk";
import { useExtensionEvents } from "../../common/hooks/useExtensionEvents";
import { TestTableComponent } from "../../components/Table";
import StatusPill from "../../components/Table/StatusPill";

const EntrySidebarExtension = () => {
  const appConfig = useAppConfig();
  const appSDK = useAppSdk();

  const customFieldEvent = useExtensionEvents();
  const [localState, setLocalState] = useState(customFieldEvent);

  useEffect(() => {
    appSDK?.location.SidebarWidget?.entry.onChange((data) => {
      console.log("SidebarWidget onChange", data);
      setLocalState((prev) => {
        return prev.map((item) => {
          if (item.eventName === 'onChange') {
            return { ...item, status: <StatusPill status="done" /> }
          }
          return item
        })
      })
    });

    appSDK?.location.SidebarWidget?.entry.onSave((data) => {
      console.log("SidebarWidget onSave", data);

      setLocalState((prev) => {
        return prev.map((item) => {
          if (item.eventName === 'onSave') {
            return { ...item, status: <StatusPill status="done" /> }
          }
          return item
        })
      })
    });

    appSDK?.location.SidebarWidget?.entry.onPublish((data) => {
      console.log("SidebarWidget onPublish", data);
      setLocalState((prev) => {
        return prev.map((item) => {
          if (item.eventName === 'onPublish') {
            return { ...item, status: <StatusPill status="done" /> }
          }
          return item
        })
      })
    });

    appSDK?.location.SidebarWidget?.entry.onUnPublish((data) => {
      console.log("SidebarWidget onUnPublish", data);
      setLocalState((prev) => {
        return prev.map((item) => {
          if (item.eventName === 'onUnPublish') {
            return { ...item, status: <StatusPill status="done" /> }
          }
          return item
        })
      })
    });

  }, [])

  return (
    <div className="layout-container">
      <div className="ui-location-wrapper">
        <div className="ui-location">
          <TestTableComponent initEventData={customFieldEvent} updatedEventData={localState} />
        </div>
      </div>
    </div>
  );
};

export default EntrySidebarExtension;
