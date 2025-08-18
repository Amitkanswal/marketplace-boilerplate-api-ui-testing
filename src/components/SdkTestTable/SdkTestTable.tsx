import React from 'react';
import { SdkTestOperation, SdkTestResult } from '../../types/sdk-testing.types';
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
  return (
    <div className={`sdk-test-table-container ${className}`}>
      {title && <h3 className="sdk-test-table-title">{title}</h3>}
      <table className="sdk-test-table">
        <thead>
          <tr>
            <th>Test</th>
            <th>Action</th>
            <th>Result</th>
          </tr>
        </thead>
        <tbody>
          {operations.map(operation => (
            <SdkTestRow
              key={operation.id}
              operation={operation}
              result={results[operation.id]}
              onExecute={() => onExecute(operation)}
              formattedResult={getFormattedResult(operation.id, operation.formatResult)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

interface SdkTestRowProps {
  operation: SdkTestOperation;
  result?: SdkTestResult;
  onExecute: () => void;
  formattedResult: string;
}

const SdkTestRow: React.FC<SdkTestRowProps> = ({
  operation,
  result,
  onExecute,
  formattedResult
}) => {
  const isLoading = result?.status === 'loading';
  const hasError = result?.status === 'error';
  const isSuccess = result?.status === 'success';
  
  return (
    <tr className="sdk-test-row">
      <td className="sdk-test-cell sdk-test-cell--name">
        <div className="sdk-test-name">{operation.name}</div>
        {operation.description && (
          <div className="sdk-test-description">{operation.description}</div>
        )}
      </td>
      <td className="sdk-test-cell sdk-test-cell--action">
        <button
          data-test-id={operation.testId}
          onClick={onExecute}
          disabled={isLoading}
          className={`sdk-test-button ${isLoading ? 'sdk-test-button--loading' : ''}`}
        >
          {isLoading ? 'Executing...' : operation.name}
        </button>
      </td>
      <td className="sdk-test-cell sdk-test-cell--result">
        <div 
          data-test-id={operation.resultTestId}
          className={`sdk-test-result ${
            hasError ? 'sdk-test-result--error' : 
            isSuccess ? 'sdk-test-result--success' : ''
          }`}
        >
          {operation.formatResult && formattedResult.includes('{') ? (
            <pre className="sdk-test-result-json">{formattedResult}</pre>
          ) : (
            <span className="sdk-test-result-text">{formattedResult}</span>
          )}
        </div>
      </td>
    </tr>
  );
};
