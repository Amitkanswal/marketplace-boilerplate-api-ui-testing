/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useState, useMemo, useEffect, useCallback, ReactNode } from "react";
import { useAppSdk } from "../../common/hooks/useAppSdk";
import { generateIsLoadingArray } from "../../common/utils/functions";
import EventTable from "./EventTable";
import StatusPill from "./StatusPill";
import { usePreRequests } from "../../common/hooks/usePreRequests";
import { useProcessEvent } from "../../common/hooks/useProcessEvent";
import { useProcessEntryEvent } from "../../common/hooks/useProcessEntryEvent";

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
  const ignoredMethods = ["Asset", "ContentType", "_connection", "_data", "search", "_currentBranch", "getVariantById", "getWorkflow", "getWorkflows"];
  //@ts-ignore
  const stack: Stack | undefined = appSDK?.stack;
  const entryLocation = appSDK?.location.SidebarWidget?.entry;

  const methodNames = useMemo(() => {
    const stackMethods = stack
      ? Object.getOwnPropertyNames(Object.getPrototypeOf(stack)).filter(
          (name) => typeof stack[name] === "function" && name !== "constructor" && !ignoredMethods.includes(name)
        )
      : [];

    const entryMethods = entryLocation
      ? Object.getOwnPropertyNames(Object.getPrototypeOf(entryLocation))
          //@ts-ignore
          .filter(
            (name) =>
              //@ts-ignore
              typeof entryLocation[name] === "function" && name !== "constructor" && !ignoredMethods.includes(name)
          )
      : [];
    return [...stackMethods, ...entryMethods];
  }, [stack, entryLocation]);

  const [index, setIndex] = useState(generateIsLoadingArray(methodNames.length));
  const preRequests = usePreRequests();
  const processEvent = useProcessEvent();
  const processEntryEvent = useProcessEntryEvent();

  const initialData = useMemo(() => {
    return methodNames.map((name) => ({
      eventName: name,
      status: <StatusPill status="in-progress" />,
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
    setIndex((prevIndex) =>
      prevIndex.map((item, idx) => {
        if (idx === id) {
          return "done";
        }
        return item;
      })
    );
  }, []);

  useEffect(() => {
    (async () => {
      const preRequestEvent = await preRequests;
      for (let idx = 0; idx < eventName.length; idx++) {
        const { eventName: currentEventName } = eventName[idx];

        // Skip UI callback events
        if (["onChange", "onSave", "onPublish", "onUnPublish"].includes(currentEventName)) {
          continue;
        }
        const isEntryMethod =
          entryLocation && typeof entryLocation[currentEventName as keyof typeof entryLocation] === "function";

        let eventObj;
        try {
          if (isEntryMethod) {
            eventObj = (await processEntryEvent(currentEventName)) as { eventName: string; status: ReactNode };
          } else {
            eventObj = (await processEvent(currentEventName, preRequestEvent)) as {
              eventName: string;
              status: ReactNode;
            };
          }

          if (index[idx] !== "done" && eventObj) {
            updateEventName(eventObj, idx);
          }
        } catch (error) {
          console.error(`💥 Error processing ${currentEventName}:`, error);
        }
      }
    })();
  }, [eventName, preRequests, processEvent, processEntryEvent, updateEventName, entryLocation, index]);

  const columns = useMemo(
    () => [
      {
        Header: "Event Name",
        accessor: "eventName",
        id: "eventName",
        cssClass: "uidCustomClass",
      },
      {
        Header: "Status",
        accessor: "status",
        id: "status",
        cssClass: "uidCustomClass",
      },
      {
        Header: 'Result',
        accessor: 'response',
        id: 'response',
        cssClass: 'uidCustomClass',
        Cell: ({ row }: any) => (
          <div style={{
            fontSize: '11px',
            fontFamily: 'monospace',
            maxWidth: '200px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {row.original.response ? JSON.stringify(row.original.response) : 'No result'}
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div>
      <EventTable data={eventName} columns={columns} />
    </div>
  );
};
