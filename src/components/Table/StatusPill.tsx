import React from 'react';
import { Icon, Pills } from '@contentstack/venus-components';

type StatusPillProps = {
  status: 'in-progress'| 'waiting' | 'skip' | 'done' | 'failed';
};

const StatusPill: React.FC<StatusPillProps> = ({ status }) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'in-progress':
        return <Icon icon='Status' version='v2' />;
        case 'waiting':
          return <Icon icon='Status' version='v2'  stroke='yellow'/>;
      case 'skip':
        return <Icon icon='WarningBoldNew' version='v2' />;
      case 'done':
        return <Icon icon='CheckCircle' version='v2' />;
      case 'failed':
        return <Icon icon='CloseBorder' version='v2' />;
      default:
        return null;
    }
  };

  return (
    <Pills
      items={[
        {
          id: 1,
          leadingIcon: getStatusIcon(),
          text: status,
        },
      ]}
      variant="chip"
      background="#F7F9FC"
      stroke={'#DDE3EE'}
      shouldHaveBorder={false}
    />
  );
};

export default StatusPill;