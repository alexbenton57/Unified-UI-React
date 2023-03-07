import React, { createContext, useContext, useState, useEffect, useRef, Fragment } from "react";
import { v4 as uuid } from "uuid";
import { useMessengerContext } from "Infrastructure/websocket";

// an expannded version of useMessenger, add support for setting multiple values
// a slightly convoluted implementation because the number of React hooks called cannot change between renders.

// wsConfig = {dataSourceID: {tag: "wsTag", value:"defaultValue"}}
export default function useMultiMessenger(wsConfig) {

  // wsData = {dataSourceID: {tag: "wsTag", value:"latest value"}}
  const [wsData, setWsData] = useState(wsConfig);
  const messenger = useMessengerContext();
  const [listeners, setListeners] = useState([]);

  useEffect(() => {
    async function doSocket() {
      while (!messenger) {
        await new Promise((res) => setTimeout(res, 100));
      }
      // should potentially add something here so values are remembered
      // or change useMessenger such that it immediatly requests the latest value

      // make sure there aren't unecessary listeners being added
      for (const listener of listeners) {
        messenger.removeEventListener(listener.tag, listener);
        console.log("Removing Listener", listener);
      }
      setListeners([]);

      // add listeners for each ws datasource
      for (const label of Object.keys(wsConfig)) {
        const tag = wsConfig[label]["tag"];

        const newListener = (msg) => {
          if (typeof msg !== "undefined" && msg !== null) {
            setWsData((wsd) => ({ ...wsd, [label]: { tag: tag, value: msg.detail } }));
          }
        };
        newListener.tag = tag;
        newListener.id = uuid();

        messenger.addEventListener(newListener.tag, newListener);
        setListeners((list) => [...list, newListener]);
        console.log("Adding Listener", newListener);

        // ask messenger to send out latest value
        messenger.request_value(tag);
      }
    }

    // run the above async function
    doSocket().catch(console.error);

    return () => {
      if (messenger) {
        for (const listener of listeners) {
          messenger.removeEventListener(listener.tag, listener);
          console.log("Removing Listener", listener);
        }
      }
    };
  }, [wsConfig, setWsData]);

  return wsData;
}

