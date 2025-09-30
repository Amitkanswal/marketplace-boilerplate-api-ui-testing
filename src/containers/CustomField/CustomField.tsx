import React, { useEffect, useState } from "react";
import { useAppSdk } from "../../common/hooks/useAppSdk";
import "../index.css";
import "./CustomField.css";
import { SdkTestTable } from "../../components/SdkTestTable";
import { SDK_TEST_CATEGORIES } from "../../services/sdk-operations";
import { useSdkTesting } from "../../hooks/useSdkTesting";
import UiLocation from "@contentstack/app-sdk/dist/src/uiLocation";
import { registerCallbacks } from "../../services/sdk-operations/cf-operations";

const CustomFieldExtension = () => {
  const appSdk = useAppSdk();

  const { state, executeOperation, getFormattedResult } = useSdkTesting();

  useEffect(() => {
    registerCallbacks(appSdk as UiLocation);
  }, [appSdk]);

  return (
    <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 16 }}>
      <h2 data-test-id="asb-asset-sidebar-title" style={{ margin: 0 }}>
        Custom Field App
      </h2>
      <div style={{ marginTop: 8, fontSize: 12, color: "#555" }}>
        <div>App UID: {appSdk?.appUID || "-"}</div>
        <div>Installation UID: {appSdk?.installationUID || "-"}</div>
        <div>Location UID: {appSdk?.locationUID || "-"}</div>
      </div>
      <SdkTestTable
        title={SDK_TEST_CATEGORIES.CORE.name}
        operations={SDK_TEST_CATEGORIES.CORE.operations}
        results={state.results}
        onExecute={executeOperation}
        getFormattedResult={getFormattedResult}
      />
      <SdkTestTable
        title={SDK_TEST_CATEGORIES.CF.name}
        operations={SDK_TEST_CATEGORIES.CF.operations}
        results={state.results}
        onExecute={executeOperation}
        getFormattedResult={getFormattedResult}
      />
    </div>
  );
};
export default CustomFieldExtension;
