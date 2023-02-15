import React, {useEffect} from "react";
import { useMessengerContext } from "Infrastructure/websocket";

export default function useMessengerCallback(tag, callback) {
  // allow refresh of HTTP data with messenger event
  const messenger = useMessengerContext()
  useEffect(() => {
    messenger.addEventListener(tag, callback)

  }, [messenger, tag, callback])
}