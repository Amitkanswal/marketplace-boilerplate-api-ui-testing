import React from "react";
import { useAppSdk } from "../../common/hooks/useAppSdk";
import { SdkTestCards } from "../../components/SdkTestCards/SdkTestCards";
import { SDK_TEST_CATEGORIES } from "../../services/sdk-operations";
import { useSdkTesting } from "../../hooks/useSdkTesting";

const StackDashboardExtension: React.FC = () => {
  const appSdk = useAppSdk();
  const { state, executeOperation, getFormattedResult } = useSdkTesting();

  return (
    <div style={{ padding: 12 }}>
      <h2 data-test-id="dashboard-title" style={{ margin: 0 }}>Dashboard Widget</h2>
      <div data-test-id="dashboard-description" style={{ marginTop: 8, fontSize: 12, color: '#555' }}>
        <div>App UID: {appSdk?.appUID || '-'}</div>
        <div>Installation UID: {appSdk?.installationUID || '-'}</div>
        <div>Location UID: {appSdk?.locationUID || '-'}</div>
      </div>

      <SdkTestCards
        title={SDK_TEST_CATEGORIES.DASHBOARD.name}
        operations={SDK_TEST_CATEGORIES.DASHBOARD.operations}
        results={state.results}
        onExecute={executeOperation}
        getFormattedResult={getFormattedResult}
      />
    </div>
  );
};

export default StackDashboardExtension;