import React from "react";
import "../index.css";
import "./EntrySidebar.css";
import { useAppSdk } from "../../common/hooks/useAppSdk";
import { SDK_TEST_CATEGORIES } from "../../services/sdk-operations";
import { SdkTestCards } from "../../components/SdkTestCards/SdkTestCards";
import { useSdkTesting } from "../../hooks/useSdkTesting";

const EntrySidebarExtension = () => {
  const appSdk = useAppSdk();
  const { state, executeOperation, getFormattedResult, isReady } = useSdkTesting();
  return (
    <div style={{ padding: 12, maxWidth: 420 }}>
    <h2 data-test-id="esb-sidebar-rail-title" style={{ margin: 0 }}>Entry Sidebar Rail App</h2>
      <div style={{ marginTop: 8, fontSize: 12, color: '#555' }}>
        <div>App UID: {appSdk?.appUID || '-'}</div>
        <div>Installation UID: {appSdk?.installationUID || '-'}</div>
        <div>Location UID: {appSdk?.locationUID || '-'}</div>
      </div>
      {isReady && (
          <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <SdkTestCards
          title={SDK_TEST_CATEGORIES.CORE.name}
          operations={SDK_TEST_CATEGORIES.CORE.operations}
          results={state.results}
          onExecute={executeOperation}
          getFormattedResult={getFormattedResult}
        />
        <SdkTestCards
          title={SDK_TEST_CATEGORIES.CREATE_ESB.name}
          operations={SDK_TEST_CATEGORIES.CREATE_ESB.operations}
          results={state.results}
          onExecute={executeOperation}
          getFormattedResult={getFormattedResult}
        />
        </div>
      )}
    </div>
  );
};

export default EntrySidebarExtension;
