import React, { createContext, useContext, useState, useEffect, useRef, Fragment } from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { v4 as uuid } from "uuid";
import useMessenger from "Hooks/useMessenger";

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
  UPDATEMESSAGETAG: "Status Update for Connection Symbol",
};

class Messenger extends EventTarget {
  constructor() {
    super();
    this.id = Math.round(Math.random() * 100000);
  }

  emit(tag, data) {
    const newEvent =
      data !== undefined ? new CustomEvent(tag, { detail: data }) : new CustomEvent(tag);
    this.dispatchEvent(newEvent);
  }
}

export function MessengerHandler({ children }) {
  // get the context value which will set the notification data

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
  async function updateStatus(socketStatus) {
    while (!messenger) {
      await new Promise((res) => setTimeout(res, 100));
    }
    setStatus(socketStatus);
    console.log("Websocket Status", socketStatus);
    messenger.emit(socketStatuses.UPDATEMESSAGETAG, socketStatus);
  }

  function initialiseNewSocket() {
    const socket = new W3CWebSocket("ws://127.0.0.1:8000/ws/global");
    socket.id = Math.round(Math.random() * 10000000000);
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
      }
    };
    
    window.addEventListener("onbeforeunload", () => socket.close("Window Closed"))
    return socket;
  }

  async function waitAndReconnect(seconds) {
    await new Promise((res) => setTimeout(res, seconds * 1000));
    updateStatus(socketStatuses.RECONNECTING);
  }

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
      initial:
        break;
    }
  }, [status]);

  return null;
  
}

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
