import React from "react";
import { useAppSdk } from "../../common/hooks/useAppSdk";
import { SdkTestCards } from "../../components/SdkTestCards/SdkTestCards";
import { useSdkTesting } from "../../hooks/useSdkTesting";
import { SDK_TEST_CATEGORIES } from "../../services/sdk-operations";

const EntrySidebarExtension: React.FC = () => {
  const appSdk = useAppSdk();
  const { state, executeOperation, getFormattedResult } = useSdkTesting();

  return (
    <div style={{ padding: 12, maxWidth: 420, display: "flex", flexDirection: "column", gap: 16 }}>
      <h2 data-test-id="esb-sidebar-title" style={{ margin: 0 }}>
        Entry Sidebar App
      </h2>
      <div style={{ marginTop: 8, fontSize: 12, color: "#555" }}>
        <div>App UID: {appSdk?.appUID || "-"}</div>
        <div>Installation UID: {appSdk?.installationUID || "-"}</div>
        <div>Location UID: {appSdk?.locationUID || "-"}</div>
      </div>
      <SdkTestCards
            title={SDK_TEST_CATEGORIES.CORE.name}
            operations={SDK_TEST_CATEGORIES.CORE.operations}
            results={state.results}
            onExecute={executeOperation}
            getFormattedResult={getFormattedResult}
          />
      <SdkTestCards
        title={SDK_TEST_CATEGORIES.ESB.name}
        operations={SDK_TEST_CATEGORIES.ESB.operations}
        results={state.results}
        onExecute={executeOperation}
        getFormattedResult={getFormattedResult}
      />
    </div>
  );
};

export default EntrySidebarExtension;
