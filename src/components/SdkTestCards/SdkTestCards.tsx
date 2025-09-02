import React from 'react';
import { Button, Heading } from '@contentstack/venus-components';
import { SdkTestOperation, SdkTestResult } from '../../types/sdk-testing.types';
import './SdkTestCards.css';

interface SdkTestCardsProps {
  operations: SdkTestOperation[];
  results: Record<string, SdkTestResult>;
  onExecute: (operation: SdkTestOperation) => void;
  getFormattedResult: (operationId: string, formatter?: (data: unknown) => string) => string;
  title?: string;
}

export const SdkTestCards: React.FC<SdkTestCardsProps> = ({
  operations,
  results,
  onExecute,
  getFormattedResult,
  title
}) => {
  const renderStatus = (result?: SdkTestResult) => {
    const isLoading = result?.status === 'loading';
    const isError = result?.status === 'error';
    const isSuccess = result?.status === 'success';

    if (isLoading) return (
      <div className="sdk-status loading">Loading...</div>
    );
    if (isError) return (
      <div className="sdk-status error">Error</div>
    );
    if (isSuccess) return (
      <div className="sdk-status success">Success</div>
    );
    return <div className="sdk-status idle">Idle</div>;
  };

  return (
    <div className="sdk-cards-container">
      {title && <h4>{title}</h4>}
      {operations.map((op) => {
        const result = results[op.id];
        const formatted = getFormattedResult(op.id, op.formatResult);
        const isLoading = result?.status === 'loading';

        return (
          <div key={op.id} className="sdk-card">
            <div className="sdk-card-title">{op.name}</div>
            {op.description && (
              <div className="sdk-card-desc">{op.description}</div>
            )}
            <div data-test-id={op.resultTestId} className="sdk-card-result">
              {!isLoading && formatted ? formatted : null}
            </div>
            <div className="sdk-card-footer">
              <div>{renderStatus(result)}</div>
              <Button
                buttonType="primary"
                size="small"
                onClick={() => onExecute(op)}
                disabled={isLoading}
                data-test-id={op.testId}
              >
                {isLoading ? 'Executing...' : 'Run'}
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};


