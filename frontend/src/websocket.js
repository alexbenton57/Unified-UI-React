import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { w3cwebsocket as W3CWebSocket } from "websocket";

//create a context
const socketDataContext = createContext({});
export default socketDataContext;

const socketContext = createContext({});

export const SocketHandler = ({children}) => {
    //get the context value which will set the notification data

    const webSocketRef = useRef(null);

	useEffect(() => {
		webSocketRef.current = new W3CWebSocket('ws://127.0.0.1:8000/ws/global');

		webSocketRef.current.onopen = () => {
            console.log("Global WebSocket Connection Opened");
        }
		webSocketRef.current.onclose = () => console.log("Global Websocket Connection Closed");

		return () => webSocketRef.current.close();

	}, []);

    useEffect(() => {
		webSocketRef.current.onmessage = (message) => {
			//console.log("Global Websocket Received", message.data);
		};
	}, []);

    return (
        <socketContext.Provider value={webSocketRef}>
            {children}
        </socketContext.Provider>
    )
}

export const useSocketContext = () => {
    const socket = useContext(socketContext);
    return socket;
}

export const subscribeToSocketWithTag = (subscribedTag, x=null) => {

    // a useEffect Wrapper
    const [value, setValue] = useState(x);
    const socketRef = useSocketContext();

    useEffect(() => {

        async function doSocket() {
            while (!socketRef.current) {await new Promise(res => setTimeout(res, 100))};
            socketRef.current.addEventListener("message", (message) => {
                
                // need to put above event listener function in a state variable so it can be removed later
                const data = JSON.parse(message.data);
                if (data.tag === subscribedTag) {
                    setValue(data.value)
                }
            });
        }

        doSocket().catch(console.error);      

    }, [subscribedTag]);

    return value;
}


/*
//Source - https://stackoverflow.com/questions/72372760/use-context-to-share-content-after-socket-connection-in-react
// Another blog - https://thenable.io/building-a-use-socket-hook-in-react
//create a provider of that context that will provide values
//which can be used by all the children conponents
export const SocketDataProvider = ({children}) => {
    const {socketData, setSocketData} = useState(null);
    return (
        <socketDataContext.Provider value={{ socketData, setSocketData }}>
            <SocketHandler>
                {children}
            </SocketHandler>
        </socketDataContext.Provider>
    )
}

//create a helper custom hook to used by other components who
//wish to use the context values
export function useSocketDataContext() {

    const { socketData, setSocketData } = useContext(socketDataContext);
    return { socketData, setSocketData };
}
*/


