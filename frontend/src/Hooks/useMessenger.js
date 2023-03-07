import React, { createContext, useContext, useState, useEffect, useRef, Fragment } from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { v4 as uuid } from "uuid";
import useLogOnChange from "./useLogOnChange";
import { useMessengerContext } from "../Infrastructure/websocket";

function getListener(tag, target, setValue) {
  function newListener(msg) {
    if (typeof msg !== "undefined" && msg !== null) {
      setValue(msg.detail);
    }
  }

  // Values to make websocket inspection easier
  newListener.tag = tag;
  newListener.id = uuid();
  newListener.target = target;
  return newListener;
}


 // This custom hook allows a component to listen to the global Messenger object
 // it returns a stateful value containing the latest value received for a particular message tag
 // Ideally there would be some way to listen to all messages (ie without passing subscribedTag)

export default function useMessenger(subscribedTag, defaultState = null) {
 
  console.log("useMessenger() Called");
  const [value, setValue] = useState(defaultState);
  const messengerObject = useMessengerContext();
  const [listeners, setListeners] = useState([]);

  useEffect(() => {
    console.log("useMessenger() effect activated");

    async function doSocket() {

      // wait for messenger. This shouldn't strictly be necessary though
      while (!messengerObject) {
        await new Promise((res) => setTimeout(res, 100));
      }

      for (const listener of listeners) {
        messengerObject.removeEventListener(listener.tag, listener);
        console.log("Removing Listener", listener);
      }

      if (subscribedTag) {
        const newListener = getListener(subscribedTag, messengerObject, setValue);
        messengerObject.addEventListener(newListener.tag, newListener);
        setListeners((list) => [...list, newListener]);
        console.log("Adding Listener", newListener);
      }
    }

    doSocket().catch(console.error);

    return () => {
      if (messengerObject) {
        for (const listener of listeners) {
          messengerObject.removeEventListener(listener.tag, listener);
          console.log("Removing Listener", listener);
        }
      }
    };
  }, [subscribedTag]);

  useLogOnChange(subscribedTag, "subscribedTag");

  return value;
}
