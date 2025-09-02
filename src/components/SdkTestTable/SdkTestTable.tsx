import React from 'react';
import { SdkTestOperation, SdkTestResult } from '../../types/sdk-testing.types';
import { Button, Icon, Heading } from '@contentstack/venus-components';
import './SdkTestTable.css';

interface SdkTestTableProps {
  operations: SdkTestOperation[];
  results: Record<string, SdkTestResult>;
  onExecute: (operation: SdkTestOperation) => void;
  getFormattedResult: (operationId: string, formatter?: (data: unknown) => string) => string;
  title?: string;
  className?: string;
}

export const SdkTestTable: React.FC<SdkTestTableProps> = ({
  operations,
  results,
  onExecute,
  getFormattedResult,
  title,
  className = ''
}) => {
  const renderStatusPill = (result?: SdkTestResult) => {
    const hasError = result?.status === 'error';
    const isSuccess = result?.status === 'success';
    const isLoading = result?.status === 'loading';

    if (isLoading) {
      return (
        <div className='loading-pill'>
          <Icon icon='CheckCircle' />
          <span>Loading...</span>
        </div>
        
      );
    }

    if (hasError) {
      return (
        <div className='error-pill'>
          <span>Error</span>
        </div>
      );

    }

    if (isSuccess) {
      return (
        <div className='success-pill'>
          <span>Success</span>
        </div>
      );
    }

    return (
      <div>
        
      </div>
    );
  };

  return (
    <div className={`sdk-test-table-container ${className}`}>
      {title && <h3>{title}</h3>}
      <table className="venus-enhanced-table">
        <thead>
          <tr>
            <th>Test</th>
            <th>Action</th>
            <th>Status</th>
            <th>Result</th>
          </tr>
        </thead>
        <tbody>
          {operations.map(operation => {
            const result = results[operation.id];
            const formattedResult = getFormattedResult(operation.id, operation.formatResult);
            const isLoading = result?.status === 'loading';

            return (
              <tr key={operation.id} className="venus-table-row">
                <td className="venus-table-cell">
                  <div className="sdk-test-name-cell">
                    <div className="sdk-test-name">{operation.name}</div>
                    {operation.description && (
                      <div className="sdk-test-description">{operation.description}</div>
                    )}
                  </div>
                </td>
                
                <td className="venus-table-cell">
                  <Button
                    buttonType="primary"
                    size="small"
                    onClick={() => onExecute(operation)}
                    disabled={isLoading}
                    data-test-id={operation.testId}
                  >
                    {isLoading ? 'Executing...' : operation.name}
                  </Button>
                </td>
                
                <td className="venus-table-cell venus-table-cell--status">
                  {renderStatusPill(result)}
                </td>
                
                <td className="venus-table-cell">
                  <div 
                    data-test-id={operation.resultTestId}
                    className="sdk-test-result-content"
                  >
                    {!isLoading && formattedResult && (
                      <>
                        {operation.formatResult && formattedResult.includes('{') ? (
                          <pre className="sdk-test-result-json">{formattedResult}</pre>
                        ) : (
                          <span className="sdk-test-result-text">{formattedResult}</span>
                        )}
                      </>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

// Component now uses HTML table structure with Venus components (Button, Icon, Pills, Heading)
