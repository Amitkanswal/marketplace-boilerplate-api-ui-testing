/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useState, useMemo, useEffect, ReactNode } from 'react';
import { useAppSdk } from '../../common/hooks/useAppSdk';
import EventTable from './EventTable';
import StatusPill from './StatusPill';
import ContentstackAPI from '../../common/cms-api';

type Stack = {
  [key: string]: (...args: never[]) => unknown;
};

type EventData = {
  name: string;
  status: number;
  statusText: string;
  id: number;
};

type TestTableComponentProps = {
  initEventData: EventData[];
};

export const TestTableComponent: React.FC<TestTableComponentProps> = ({ initEventData = [] }) => {
  const appSDK = useAppSdk();
  //@ts-ignore
  const stack: Stack | undefined = appSDK?.stack;

  const methodNames = useMemo(() => Object.keys(ContentstackAPI), []);

  const initialData = useMemo(() => {
    return methodNames.map(name => ({
      eventName: name,
      status: <StatusPill status="in-progress" />
    }));
  }, [methodNames]);

  const [eventData, setEventData] = useState(initialData);

  useEffect(() => {
    const responseCollection = initEventData.map(({ id, statusText, name }) => ({
      id,
      status: <StatusPill status={statusText === "ok" ? "done" : "failed"} />,
      eventName: name
    }));

    const updatedData = initialData.map(({ eventName, status }) => {
      const targetedEvent = responseCollection.find(event => event.eventName === eventName);
      return targetedEvent || { eventName, status };
    });

    setEventData(updatedData);
  }, [initEventData, initialData]);

  const columns = useMemo(() => [
    {
      Header: 'Event Name',
      accessor: 'eventName',
      id: 'eventName',
      cssClass: 'uidCustomClass',
    },
    {
      Header: 'Status',
      accessor: 'status',
      id: 'status',
      cssClass: 'uidCustomClass',
    }
  ], []);

  return (
    <div>
      <EventTable data={eventData} columns={columns} />
    </div>
  );
};