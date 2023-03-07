import React, { createContext, useContext, useState, useEffect, useRef, Fragment } from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { v4 as uuid } from "uuid";
import useMessenger from "Hooks/useMessenger";
import Messenger from "Classes/Messenger";

const messengerContext = createContext({});
export const useMessengerContext = () => {
  const messenger = useContext(messengerContext);
  return messenger;
};

export const socketStatuses = {
  INITIALISING: "Inititalising",
  CONNECTING: "Connecting",
  CONNECTED: "Connected",
  DISCONNECTED: "Disconnected",
  RECONNECTING: "Reconnecting",
  STATUS_UPDATE_MESSAGE_TAG: "Status Update for Connection Symbol",
};
const REQUEST_EVENT_TAG = "REQUEST_VALUE";


export function MessengerHandler({ children }) {

  // retain messenger through rerenders
  // however, this approach means that the body of other components is run before the messenger is intitialised
  // ... meaning that components need to wait for a valid messenger
  // could useMemo() be another way to do this?
  const [messenger, setMessenger] = useState(() => getMessenger());

  console.log("render - messenger Handler");

  function getMessenger() {
    const newMessenger = new Messenger();
    console.log("Messenger Object Created", newMessenger);
    return newMessenger;
  }

  return (
    <Fragment>
      <SocketHandler messenger={messenger} />
      <messengerContext.Provider value={messenger}>{children}</messengerContext.Provider>
    </Fragment>
  );
}

function SocketHandler({ messenger }) {
  const webSocketRef = useRef(null);
  const [status, setStatus] = useState(socketStatuses.INITIALISING);
  const [latestValues, setLatestValues] = useState({});

  // send out status updates for the connection symbol
  async function updateStatus(socketStatus) {
    while (!messenger) {
      await new Promise((res) => setTimeout(res, 100));
    }
    setStatus(socketStatus);
    console.log("Websocket Status", socketStatus);
    messenger.emit(socketStatuses.STATUS_UPDATE_MESSAGE_TAG, socketStatus);
  }

  function initialiseNewSocket() {
    const socket = new W3CWebSocket("ws://127.0.0.1:8000/ws/global");
    socket.id = uuid()
    console.log("Global Websocket Object Initialised", socket.id);

    socket.onopen = () => {
      console.log("Global WebSocket Connection Opened", socket.id);
      updateStatus(socketStatuses.CONNECTED);
    };

    socket.onclose = () => {
      console.log("Global Websocket Connection Closed", socket.id);
      updateStatus(socketStatuses.DISCONNECTED);
    };

    socket.onmessage = (message) => {
      if (typeof message !== "undefined" && message !== null) {
        const data = JSON.parse(message.data);
        messenger.emit(data.tag, data.value);
        setLatestValues((lv) => ({ ...lv, [data.tag]: [data.value] }));
      }
    };

    window.addEventListener("onbeforeunload", () => socket.close("Window Closed"));
    return socket;
  }

  async function waitAndReconnect(seconds) {
    await new Promise((res) => setTimeout(res, seconds * 1000));
    updateStatus(socketStatuses.RECONNECTING);
  }

  // this is the effect that actually runs websocket connection logic
  useEffect(() => {
    switch (status) {
      case socketStatuses.INITIALISING:
        updateStatus(socketStatuses.CONNECTING);
        break;
      case socketStatuses.CONNECTING:
        webSocketRef.current = initialiseNewSocket();
        break;
      case socketStatuses.RECONNECTING:
        webSocketRef.current = initialiseNewSocket();
        break;
      case socketStatuses.DISCONNECTED:
        waitAndReconnect(5);
        break;
      default: break;
    }
  }, [status]);

  const [updateListener, setUpdateListener] = useState(null);

  /*
   adds update listener to the messenger 
   i.e. when a ws dataSource is initiated, it will request the most recent value, 
   and this listener will provide it.

   This stops the datasource fromhaving to wait for new data to arrive
  */

  useEffect(() => {
    async function addUpdateListener() {
      while (!messenger) {
        await new Promise((res) => setTimeout(res, 100));
      }

      if (updateListener) {
        messenger.removeEventListener(REQUEST_EVENT_TAG, updateListener);
      }

      const newListener = (msg) => {
        if (latestValues[msg?.detail]) {
          messenger.emit(msg.detail, latestValues[msg.detail]);
          console.log("Request Value Emitted", msg.detail, latestValues[msg.detail]);
        }
      };

      setUpdateListener(newListener);
      messenger.addEventListener(REQUEST_EVENT_TAG, newListener);
    }

    addUpdateListener();

    return () => {
      messenger.removeEventListener(REQUEST_EVENT_TAG, updateListener);
    };
  }, [messenger, latestValues]);

  return null;
}

// a component to log the last 5 messages on channel '100'
// (a debugging component)
export function SocketLogger() {
  const [logs, setLogs] = useState([]);
  const lastLog = useMessenger("100");
  useEffect(() => {
    if (lastLog) {
      setLogs((x) => [...x, { log: lastLog, uuid: uuid() }].slice(-5));
    }
  }, [lastLog]);

  return (
    <Fragment>
      <p>Logging all WS messages on channel '100'</p>
      {logs.reverse().map((log, i) => (
        <p key={log.uuid}>{log.log}</p>
      ))}
    </Fragment>
  );
}
