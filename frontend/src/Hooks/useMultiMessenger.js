import React, { createContext, useContext, useState, useEffect, useRef, Fragment } from 'react';
import { v4 as uuid } from 'uuid';
import { useMessengerContext } from 'Infrastructure/websocket';



export default function useMultiMessenger(wsConfig) {

    const [wsData, setWsData] = useState(wsConfig);
    const messenger = useMessengerContext();
    const [listeners, setListeners] = useState([]);
    
    useEffect(() => {
        async function doSocket() {

            while (!messenger) { await new Promise(res => setTimeout(res, 100)); };
            // should potentially add something here so values are remembered 
            // or change useMessenger such that it immediatly requests the latest value

            for (const listener of listeners) {
                messenger.removeEventListener(listener.tag, listener);
                console.log("Removing Listener", listener);
            }
            setListeners([])

            for (const label of Object.keys(wsConfig)) {
                const tag = wsConfig[label]["tag"]

                const newListener = (msg) => {
                    if (typeof msg !== "undefined" && msg !== null) {
                        setWsData(wsd => ({ ...wsd, [label]: { tag: tag, value: msg.detail } }))
                    }
                }
                newListener.tag = tag;
                newListener.id = uuid();

                messenger.addEventListener(newListener.tag, newListener);
                setListeners((list) => [...list, newListener]);
                console.log("Adding Listener", newListener);

                messenger.request_value(tag)
            }

        }

        doSocket().catch(console.error);

        return (() => {
            if (messenger) {
                for (const listener of listeners) {
                    messenger.removeEventListener(listener.tag, listener);
                    console.log("Removing Listener", listener);
                }
            }
        })


    }, [wsConfig, setWsData]);

    return wsData;

}


/*
function makeMultiListener(label, tag, target, setValues) {

    function newListener(msg) {

    }

    // Values to make websocket inspection easier
    newListener.tag = tag;
    newListener.id = uuid();
    newListener.target = target;

    return newListener;
}

export function useMultiMessenger(subscribedTags, defaultState = null) {

    // subscribedTags = { label: socketTag }
    // defaultState the same for all
    console.log("subscribedTags", subscribedTags)

    const [values, setValues] = useState(Object.keys(subscribedTags).reduce((obj, label) => ({ ...obj, [label]: defaultState }), {}));
    const [listeners, setListeners] = useState([]);
    const messenger = useMessengerContext();

    useEffect(() => {

        async function doSocket() {

            console.log("useMultiMessenger Values", values)
            console.log("DoSocket()")
            while (!messenger) { await new Promise(res => setTimeout(res, 100)); };

            for (const listener of listeners) {
                messenger.removeEventListener(listener.tag, listener);
                console.log("Removing Listener", listener);

            };
            await new Promise(res => setTimeout(res, 1000));

            for (const [label, tag] of Object.entries(subscribedTags)) {

                const newListener = makeMultiListener(label, tag, messenger, setValues);
                messenger.addEventListener(newListener.tag, newListener);
                console.log("Adding Listener", newListener);

                setListeners(prev => [...prev, newListener]);
            }
        }

        doSocket().catch(console.error);

        //}, [subscribedTags]);
    }, [subscribedTags]); // Literally no idea what's going on here
    // Need to memoize subscribedTags

    return values;

}
*/
