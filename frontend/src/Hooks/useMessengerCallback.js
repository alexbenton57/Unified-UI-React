import React, {useEffect} from "react";
import { useMessengerContext } from "Infrastructure/websocket";

// assign a callback to a particular messenger tag
// allows refresh of HTTP data with messenger event

export default function useMessengerCallback(tag, callback) {

  const messenger = useMessengerContext()
  useEffect(() => {
    messenger.addEventListener(tag, callback)

  }, [messenger, tag, callback])
}