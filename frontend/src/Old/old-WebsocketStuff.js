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
export const listenToMessengerOld = (subscribedTag, defaultState = null) => {

    // Also want some way to listen to all messages (ie without passing subscribedTag)
    const [value, setValue] = useState(defaultState);
    const messengerObject = useMessengerContext();
    const [listener, setListener] = useState(null);



    useEffect(() => {

        async function doSocket() {

            while (!messengerObject) { await new Promise(res => setTimeout(res, 100)) };
            console.log("Messenger found", messengerObject)
            if (listener !== null) {
                messengerObject.removeEventListener(subscribedTag, listener)
            };

            function myListener(msg) {
                if (typeof msg !== "undefined" & msg !== null) {
                    {
                        setValue(msg.detail)
                    }
                }
            }

            messengerObject.addEventListener(subscribedTag, myListener);
            setListener(() => myListener);

        }

        doSocket().catch(console.error);

    }, [subscribedTag]);

    return value;
}
export function CustomMessengerOld(props) {

    const messenger = new EventTarget();
    messenger.emit = (tag, data) => messenger.dispatchEvent(new CustomEvent(tag, { detail: data }))

    const [messages, setMessages] = useState([])

    messenger.addEventListener("button", (data) => setMessages((msgs) => [...msgs, [data.detail, data.timeStamp]]));




    return (
        <Fragment>
            <button className='btn btn-primary' onClick={() => messenger.emit("button", "button pressed")}>Send Message</button>
            {messages.map(msg => <p>{JSON.stringify(msg)}</p>)}
        </Fragment>

    )

}

export { ConnectionSymbol }

export const ocketWithTag = (subscribedTag, defaultState = null) => {

    // a useEffect Wrapper
    const [value, setValue] = useState(defaultState);
    const socketRef = useSocketContext();
    const [listener, setListener] = useState(null);


    useEffect(() => {

        async function doSocket() {
            while (!socketRef.current) { await new Promise(res => setTimeout(res, 100)) };

            if (listener !== null) {
                socketRef.current.removeEventListener("message", listener)
            };

            function myListener(msg) {
                if (typeof msg !== "undefined" & msg !== null) {
                    const data = JSON.parse(msg.data);
                    if (data.tag === subscribedTag) {
                        setValue(data.value)
                    }
                }
            }

            socketRef.current.addEventListener("message", myListener);
            setListener(() => myListener);

        }

        doSocket().catch(console.error);

    }, [subscribedTag]);

    return value;
}


export function CustomMessengerOld(props) {

    const messenger = new EventTarget();
    messenger.emit = (tag, data) => messenger.dispatchEvent(new CustomEvent(tag, { detail: data }))

    const [messages, setMessages] = useState([])

    messenger.addEventListener("button", (data) => setMessages((msgs) => [...msgs, [data.detail, data.timeStamp]]));




    return (
        <Fragment>
            <button className='btn btn-primary' onClick={() => messenger.emit("button", "button pressed")}>Send Message</button>
            {messages.map(msg => <p>{JSON.stringify(msg)}</p>)}
        </Fragment>

    )

}

export function CustomMessenger(props) {


    class Messenger extends EventTarget {
        emit(tag, data) {
            //console.log("Messenger Emission", tag, data);
            const newEvent = data ? new CustomEvent(tag, { detail: data }) : new CustomEvent(tag);
            this.dispatchEvent(newEvent);
        };
        id = Math.round(Math.random() * 10000000000);
    }
    const messenger = new Messenger();

    const [messages, setMessages] = useState([])

    messenger.addEventListener("button", (data) => setMessages((msgs) => [...msgs, [data.detail, data.timeStamp]]));

    return (
        <Fragment>
            <button className='btn btn-primary' onClick={() => messenger.emit("button", "button pressed")}>Send Message</button>
            {messages.map(msg => <p>{JSON.stringify(msg)}</p>)}
        </Fragment>

    )

}

export function MessageEmitter(props) {

    const messenger = useMessengerContext();




    function emit(tag) {
        messenger.dispatchEvent(new CustomEvent(tag, { detail: tag + "Clicked" }));
    }


    return (
        <div className='container-fluid'>
            <button className='btn btn-primary' onClick={() => emit("Button 1")}>Button 1</button>
            <button className='btn btn-primary' onClick={() => emit("Button 2")}>Button 2</button>
        </div >
    )

}

export function MessageReceiver(props) {

    const [tag, setTag] = useState("Button 1");
    const [messages, setMessages] = useState([])
    const latestMessage = listenToMessenger("Button 1");

    useEffect(() => {
        setMessages((msgs) => [...msgs, latestMessage])
    }, [latestMessage])

    return (
        <Fragment>
            {messages.map(msg => <p key={Math.random()}>{JSON.stringify(msg)}</p>)}
        </Fragment>

    )



}