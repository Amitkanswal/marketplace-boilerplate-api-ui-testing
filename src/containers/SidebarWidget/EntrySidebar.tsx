import React, { useCallback, useState } from "react";
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

const EntrySidebarExtension = () => {
  const appConfig = useAppConfig();
  const appSDK = useAppSdk();

  const customFieldEvent = useExtensionEvents();
  const [localState, setLocalState] = useState(customFieldEvent);

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

export default EntrySidebarExtension;
