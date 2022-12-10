import React, { Fragment, useEffect, useState } from 'react'
import { socketStatuses, useSocketContext } from '../websocket'
import * as Icon from 'react-bootstrap-icons'

export default function ConnectionSymbol(props) {

    const socketRef = useSocketContext();
    const [status, setStatus] = useState(socketStatuses.INITIALISING);

    useEffect(() => {
        async function doFunction() {
            while (!socketRef.current) { await new Promise(res => setTimeout(res, 100)) };
            setStatus(socketStatuses.CONNECTING);

            socketRef.current.addEventListener("close", setStatus(socketStatuses.DISCONNECTED));
            socketRef.current.addEventListener("open", setStatus(socketStatuses.CONNECTED));

        }
        doFunction().catch(console.error);
    }, [])

    function getDisplay(socketStatus) {
        var display = {}

        switch (socketStatus) {
            case socketStatuses.INITIALISING:
                display = {
                    color: "warning",
                    icon: Icon.Wifi1 
                }
                break;
            case socketStatuses.CONNECTED:
                display = {
                    color: "success",
                    icon: Icon.Wifi 
                }
                break;
            case socketStatuses.DISCONNECTED:
                display = {
                    color: "danger",
                    icon: Icon.WifiOff 
                }
                break;
            case socketStatuses.CONNECTING:
                display = {
                    color: "warning",
                    icon: Icon.Wifi2 
                }
                break;
            case socketStatuses.RECONNECTING:
                display = {
                    color: "warning",
                    icon: Icon.Wifi1 
                }
                break;
            default:
                display = {
                    color: "warning",
                    icon: Icon.Bug 
                }
                break;
        }


        return (
            <li className="nav-item">
                <div className={'nav-link text-' + display.color}>
                    <display.icon className="mx-2"/>
                    <span>{socketStatus.toString()}</span>
                </div>
            </li >
        )
    }

    return getDisplay(status);

}   
