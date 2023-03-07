import { v4 as uuid } from "uuid";

// a custom event target implementation for forwarding websocket messages
export default class Messenger extends EventTarget {
    constructor() {
      super();
      this.id = uuid()
    }
  
    emit(tag, data) {
      const newEvent =
        data !== undefined ? new CustomEvent(tag, { detail: data }) : new CustomEvent(tag);
  
      this.dispatchEvent(newEvent);
    }
  
    request_value(tag) {
      const newEvent = new CustomEvent(REQUEST_EVENT_TAG, { detail: tag });
      this.dispatchEvent(newEvent);
    }
  }
  