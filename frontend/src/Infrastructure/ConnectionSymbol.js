import React, { Fragment, useEffect, useState } from "react";
import { socketStatuses } from "Infrastructure/websocket";
import * as Icon from "react-bootstrap-icons";
import useMessenger from "Hooks/useMessenger";

export default function ConnectionSymbol(props) {
  const status = useMessenger(socketStatuses.STATUS_UPDATE_MESSAGE_TAG, socketStatuses.INITIALISING);

  function getDisplay(socketStatus) {
    var display = {};

    switch (socketStatus) {
      case socketStatuses.INITIALISING:
        display = {
          color: "warning",
          icon: Icon.Wifi1,
        };
        break;
      case socketStatuses.CONNECTED:
        display = {
          color: "success",
          icon: Icon.Wifi,
        };
        break;
      case socketStatuses.DISCONNECTED:
        display = {
          color: "danger",
          icon: Icon.WifiOff,
        };
        break;
      case socketStatuses.CONNECTING:
        display = {
          color: "warning",
          icon: Icon.Wifi2,
        };
        break;
      case socketStatuses.RECONNECTING:
        display = {
          color: "warning",
          icon: Icon.Wifi1,
        };
        break;
      initial:
        display = {
          color: "warning",
          icon: Icon.Bug,
        };
        break;
    }

    return (
      <li className="nav-item">
        <div className={"nav-link text-" + display.color}>
          <display.icon className="mx-2" />
          <span>{socketStatus.toString()}</span>
        </div>
      </li>
    );
  }

  return getDisplay(status);
}
