import React from 'react';
import { Icon } from '@contentstack/venus-components';

type StatusPillProps = {
  status: 'in-progress'| 'waiting' | 'skip' | 'done' | 'failed';
};

const StatusPill: React.FC<StatusPillProps> = ({ status }) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'in-progress':
        return <Icon icon='Status' />;
        case 'waiting':
          return <Icon icon='Status'  stroke='yellow'/>;
      case 'skip':
        return <Icon icon='WarningBoldNew' />;
      case 'done':
        return <Icon icon='CheckCircle' />;
      case 'failed':
        return <Icon icon='CloseBorder' />;
      default:
        return null;
    }
  };

  return (
    <div>
      {getStatusIcon()}
      <span>{status}</span>
    </div>
  );
};

export default StatusPill;