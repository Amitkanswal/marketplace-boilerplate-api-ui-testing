/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { InfiniteScrollTable } from '@contentstack/venus-components';

type EventTableProps = {
  data: any[];
  columns: any[];
};

const EventTable: React.FC<EventTableProps> = ({ data, columns }) => {
  return (
    <InfiniteScrollTable
      data={data}
      canRefresh={false}
      hideTablePanel={false}
      loading={false}
      fetchTableData={() => {
        //
      }}
      uniqueKey={"eventName"}
      totalCounts={data.length}
      columns={columns}
      tableHeight={450}
      equalWidthColumns={true}
      rowPerPageOptions={[10, 30, 50]}
      canSearch={false}
      v2Features={{ pagination: true, tableRowAction: false }}
      actionListClass="version-table--action-list"
    />
  );
};

export default EventTable;