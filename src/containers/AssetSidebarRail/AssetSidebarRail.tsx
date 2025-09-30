import React, { useEffect } from "react";
import { useSdkTesting } from "../../hooks/useSdkTesting";
import { SDK_TEST_CATEGORIES } from "../../services/sdk-operations";
import { SdkTestCards } from "../../components/SdkTestCards/SdkTestCards";
import { registerCallbacks } from "../../services/sdk-operations/asb-operations";
import UiLocation from "@contentstack/app-sdk/dist/src/uiLocation";
import { useAppSdk } from "../../common/hooks/useAppSdk";

export default function AssetSidebarRail() {
    const { state, executeOperation, getFormattedResult } = useSdkTesting();
    const appSdk = useAppSdk();

    useEffect(() => {
        registerCallbacks(appSdk as UiLocation);
    }, [appSdk]);

  return <div>
    <h2 data-test-id="asb-asset-sidebar-rail-title" style={{ margin: 0 }}>Asset Sidebar Rail App</h2>
    <div style={{ marginTop: 8, fontSize: 12, color: '#555' }}>
        <div>App UID: {appSdk?.appUID || '-'}</div>
        <div>Installation UID: {appSdk?.installationUID || '-'}</div>
        <div>Location UID: {appSdk?.locationUID || '-'}</div>
    </div>
    <SdkTestCards
        title={SDK_TEST_CATEGORIES.CORE.name}
        operations={SDK_TEST_CATEGORIES.CORE.operations}
        results={state.results}
        onExecute={executeOperation}
        getFormattedResult={getFormattedResult}
    />
    <SdkTestCards
        title={SDK_TEST_CATEGORIES.ASB.name}
        operations={SDK_TEST_CATEGORIES.ASB.operations}
        results={state.results}
        onExecute={executeOperation}
        getFormattedResult={getFormattedResult}
    />
  </div>;
}