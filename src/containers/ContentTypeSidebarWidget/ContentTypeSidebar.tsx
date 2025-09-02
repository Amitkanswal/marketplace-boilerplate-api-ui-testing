import React from 'react';
import { useAppSdk } from '../../common/hooks/useAppSdk';
import { useSdkTesting } from '../../hooks/useSdkTesting';
import { SdkTestCards } from '../../components/SdkTestCards/SdkTestCards';
import { SDK_TEST_CATEGORIES } from '../../services/sdk-operations';

const ContentTypeSidebarExtension: React.FC = () => {
  const appSdk = useAppSdk();
  const { state, executeOperation, getFormattedResult, isReady } = useSdkTesting();

  return (
    <div style={{ padding: 12, maxWidth: 420 }}>
      <h2 data-test-id="ct-sidebar-title" style={{ margin: 0 }}>Content Type Sidebar App</h2>
      <div style={{ marginTop: 8, fontSize: 12, color: '#555' }}>
        <div>App UID: {appSdk?.appUID || '-'}</div>
        <div>Installation UID: {appSdk?.installationUID || '-'}</div>
        <div>Location UID: {appSdk?.locationUID || '-'}</div>
      </div>

      {/* Reuse existing operations: show Core and Store groups only */}
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
            title={SDK_TEST_CATEGORIES.CTS.name}
            operations={SDK_TEST_CATEGORIES.CTS.operations}
            results={state.results}
            onExecute={executeOperation}
            getFormattedResult={getFormattedResult}
          />
          <SdkTestCards
            title={SDK_TEST_CATEGORIES.STORE.name}
            operations={SDK_TEST_CATEGORIES.STORE.operations}
            results={state.results}
            onExecute={executeOperation}
            getFormattedResult={getFormattedResult}
          />
        </div>
      )}
    </div>
  );
};

export default ContentTypeSidebarExtension;


