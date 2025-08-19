/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useState, useMemo, useEffect, useCallback, ReactNode } from 'react';
import { useAppSdk } from '../../common/hooks/useAppSdk';
import { generateIsLoadingArray } from '../../common/utils/functions';
import EventTable from './EventTable';
import StatusPill from './StatusPill';
import {usePreRequests} from '../../common/hooks/usePreRequests';
import {useProcessEvent} from '../../common/hooks/useProcessEvent';

type Stack = {
  [key: string]: (...args: never[]) => unknown;
};

type TestTableComponentProps = {
  initEventData: {
    eventName: string;
    status: ReactNode;
  }[] | [];
  updatedEventData?: {
    eventName: string;
    status: ReactNode;
  }[] | [];
};


export const TestTableComponent: React.FC <TestTableComponentProps> = ({initEventData = [], updatedEventData=[]}) => {
  const appSDK = useAppSdk();
  const ignoredMethods = ['Asset', 'ContentType', '_connection', '_data', 'search', "_currentBranch"];
  //@ts-ignore
  const stack: Stack | undefined = appSDK?.stack;

  const methodNames = useMemo(() => {
    return stack
      ? Object.getOwnPropertyNames(Object.getPrototypeOf(stack))
          .filter(name => typeof stack[name] === 'function' && name !== 'constructor' && !ignoredMethods.includes(name))
      : [];
  }, [stack]);

  const [index, setIndex] = useState(generateIsLoadingArray(methodNames.length));
  const preRequests = usePreRequests();
  const processEvent = useProcessEvent();
  const initialData = useMemo(() => {
    return methodNames.map(name => ({
      eventName: name,
      status: <StatusPill status="in-progress" />
    }));
  }, [methodNames]);
  
  const [eventName, setEventName] = useState([...initialData, ...initEventData]);

  useEffect(() => {
    eventName.forEach((eventObj, idx) => {
     const findElement = updatedEventData?.find((element) => element.eventName === eventObj.eventName);
     if (eventObj.status?.toLocaleString === findElement?.status?.toLocaleString) {
        updateEventName(findElement, idx);
     }
    });
  }, [updatedEventData]);

  const updateEventName = useCallback((eventObj: any, id: number) => {
    setEventName((eventList) => {
      return eventList.map((name) => {
        if (name.eventName === eventObj.eventName) {
          return eventObj;
        } else {
          return name;
        }
      });
    });
    setIndex((prevIndex) => prevIndex.map((item, idx) => {
      if (idx === id) {
        return 'done';
      }
      return item;
    }));
  }, []);

  useEffect(() => {
    (async () => {
      const preRequestEvent = await preRequests;
      eventName.forEach(async ({ eventName }, idx) => {
        // these events should be coming from UI locations as they need CBs
        if (["onChange", "onSave", "onPublish", "onUnPublish"].includes(eventName)) {
          return;
          
        }
        const eventObj = await processEvent(eventName, preRequestEvent) as {eventName: string, status: ReactNode};
        if (index[idx] !== 'done' && eventObj) {
          updateEventName(eventObj, idx);
        }
      });
    })();
  }, [eventName, preRequests, processEvent, updateEventName]);

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
      <EventTable data={eventName} columns={columns} />
    </div>
  );
};