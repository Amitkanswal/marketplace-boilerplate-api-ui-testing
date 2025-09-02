import React, { useEffect, useState } from "react";
import { useAppConfig } from "../../common/hooks/useAppConfig";
import { useAppSdk } from '../../common/hooks/useAppSdk';
import { TestTableComponent } from '../../components/Table';
import { useExtensionEvents } from '../../common/hooks/useExtensionEvents';
import StatusPill from '../../components/Table/StatusPill';
import "../index.css";
import "./CustomField.css";

const CustomFieldExtension = () => {
  const appSDK = useAppSdk();

  const customFieldEvent = useExtensionEvents();
  const [localState, setLocalState] = useState(customFieldEvent);

  useEffect(() => {
    
    appSDK?.location.CustomField?.entry.onChange((data) => {
      console.log("CustomField onChange", data);
      setLocalState((prev) => {
        return prev.map((item) => {
          if (item.eventName === 'onChange') {
            return { ...item, status: <StatusPill status="done" /> }
          }
          return item
        })
      })
    });

    appSDK?.location.CustomField?.entry.onSave((data) => {
      console.log("CustomField onSave", data);
  
      setLocalState((prev) => {
        return prev.map((item) => {
          if (item.eventName === 'onSave') {
            return { ...item, status: <StatusPill status="done" /> }
          }
          return item
        })
      })
    });

    appSDK?.location.CustomField?.entry.onPublish((data) => {
      console.log("CustomField onPublish", data);
      setLocalState((prev) => {
        return prev.map((item) => {
          if (item.eventName === 'onPublish') {
            return { ...item, status: <StatusPill status="done" /> }
          }
          return item
        })
      })
    });

    appSDK?.location.CustomField?.entry.onUnPublish((data) => {
      console.log("CustomField onUnPublish", data);
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
          <TestTableComponent initEventData={customFieldEvent} updatedEventData={localState}/>
        </div>
      </div>
    </div>
  );
};

export default CustomFieldExtension;