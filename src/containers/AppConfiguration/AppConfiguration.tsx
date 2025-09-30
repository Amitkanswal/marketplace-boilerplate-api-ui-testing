import React from "react";
import { useAppSdk } from "../../common/hooks/useAppSdk";
import { SdkTestCards } from "../../components/SdkTestCards/SdkTestCards";
import { SDK_TEST_CATEGORIES } from "../../services/sdk-operations";
import { useSdkTesting } from "../../hooks/useSdkTesting";

const AppConfigurationExtension: React.FC = () => {

  const appSdk = useAppSdk();
  const { state, executeOperation, getFormattedResult } = useSdkTesting();

  return (
    <div style={{ padding: 12 }}>
      <h2 data-test-id="app-config-title" style={{ margin: 0 }}>App Configuration</h2>
      <div data-test-id="app-config-description" style={{ marginTop: 8, fontSize: 12, color: '#555' }}>
        <div>App UID: {appSdk?.appUID || '-'}</div>
        <div>Installation UID: {appSdk?.installationUID || '-'}</div>
      </div>

      <SdkTestCards
        title={SDK_TEST_CATEGORIES.APP_CONFIG.name}
        operations={SDK_TEST_CATEGORIES.APP_CONFIG.operations}
        results={state.results}
        onExecute={executeOperation}
        getFormattedResult={getFormattedResult}
      />
    </div>
  );
};

export default AppConfigurationExtension;
