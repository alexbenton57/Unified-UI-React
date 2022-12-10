import React, { Component } from 'react';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import * as Icon from 'react-bootstrap-icons';

class ConnectionSymbol extends Component {
    state = {
        status: null,
        room: 'indicator',
        value: 0,
    };

    client = new W3CWebSocket('ws://127.0.0.1:8000/ws/' + this.state.room); //gets room_name from the state and connects to the backend server ;
    // https://www.kianmusser.com/articles/react-where-put-websocket/
    
    componentDidMount() {

        this.client.onopen = () => {
            console.log("WebSocket Client Connected");
            this.setState({ status: true });
        };

        this.client.onmessage = (message) => {
            const data = JSON.parse(message.data);
            console.log("Received: ", data)
            if (data.tag === "abc") {
                this.setState({ value: data.value })
            }
        };

        this.client.onclose = () => {
            console.log("Websocket Disconnect");
            this.setState({ status: false });
        };

    }

    iconSwitch(state) {

        const height = 32;

        switch (state) {
            case true: return <Icon.Wifi className="text-success" height={height} />;
            case false: return <Icon.WifiOff className='text-danger' height={height} />;
            default: return <Icon.Wifi1 className='text-warning' height={height} />;
        }
    }


    render() {
        return (
            <div>
                <p>{this.iconSwitch(this.state.status)}</p>
                <p>{this.state.value}</p>
            </div>
        )
    }

}

export { ConnectionSymbol }