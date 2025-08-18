import React from 'react';
import { SdkTestTable } from '../../components/SdkTestTable/SdkTestTable';
import { useSdkTesting } from '../../hooks/useSdkTesting';
import { useAppSdk } from '../../common/hooks/useAppSdk';
import { SDK_TEST_CATEGORIES } from '../../services/sdk-operations';
import "../index.css";
import "./FullPage.css";

const FullPageExtension: React.FC = () => {
  const appSdk = useAppSdk();
  const { state, executeOperation, getFormattedResult, isReady } = useSdkTesting();

  if (!isReady) {
    return (
      <div className="layout-container">
        <div className="ui-location">
          <div className="ui-container">
            <p>Initializing SDK...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="layout-container">
      <div className="ui-location">
        <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>SDK Testing Playground</h1>
        
        {state.globalError && (
          <div 
            className="error-banner" 
            data-test-id="sdk-error"
            style={{
              padding: '12px',
              marginBottom: '16px',
              backgroundColor: '#ffebee',
              color: '#c62828',
              borderRadius: '4px',
              border: '1px solid #ef5350'
            }}
          >
            {state.globalError}
          </div>
        )}

        <div style={{ marginTop: 16, width: '100%' }}>
          {/* Core SDK Methods */}
          <SdkTestTable
            title={SDK_TEST_CATEGORIES.CORE.name}
            operations={SDK_TEST_CATEGORIES.CORE.operations}
            results={state.results}
            onExecute={executeOperation}
            getFormattedResult={getFormattedResult}
          />

          {/* CMA Operations */}
          <SdkTestTable
            title={SDK_TEST_CATEGORIES.CMA.name}
            operations={SDK_TEST_CATEGORIES.CMA.operations}
            results={state.results}
            onExecute={executeOperation}
            getFormattedResult={getFormattedResult}
          />

          {/* Frame Operations - Only show if available */}
          {appSdk && SDK_TEST_CATEGORIES.FRAME.condition?.(appSdk) && (
            <SdkTestTable
              title={SDK_TEST_CATEGORIES.FRAME.name}
              operations={SDK_TEST_CATEGORIES.FRAME.operations}
              results={state.results}
              onExecute={executeOperation}
              getFormattedResult={getFormattedResult}
            />
          )}

          {/* CRUD Operations */}
          <SdkTestTable
            title={SDK_TEST_CATEGORIES.CRUD.name}
            operations={SDK_TEST_CATEGORIES.CRUD.operations}
            results={state.results}
            onExecute={executeOperation}
            getFormattedResult={getFormattedResult}
          />
        </div>
      </div>
    </div>
  );
};

export default FullPageExtension;
