import axios from "axios";
import { sources } from "../Infrastructure/AutoField";
import { v4 as uuid } from "uuid";

export default class DataSource {
  constructor(type, link, label, initial) {
    console.log("Initialising");
    this.type = type;
    this.link = link;
    this.label = label;
    this.initial = initial;
    this.refresh();
  }

  refresh() {
    if (this.type === sources.HTTP) {
      this.promiseUUID = uuid();      
      this.axiosPromise = this.wrapAxiosPromise(this.link);

      console.log("Refreshing HTTP Promise", this);
    }
  }

  processResult(res) {

      try {
        return res.results.map((r) => r.value);
      } catch (error) {
        console.log("Process Result Error", error)
        return res;
      }

    return res;
  }

  wrapAxiosPromise(url) {
    const process = this.processResult;
    const outerThis = this

    const promise = () =>
      axios
        .get(url)
        .then((res) => res)
        .catch((err) => err);

    let status = "pending";
    let result;

    let suspend = promise()
      .then((res) => {
        console.log("HTTP Result", res);

        switch (res.status) {
          case 200:
            status = "success";
            result = res;
            break;
          default:
            status = "error";
            result = res;
            break;
        }
      })
      .catch((err) => {
        console.log("HTTP Error Caught", err);
        status = "error";
        result = err;
      });
    return {
      read() {
        if (status === "pending") {
          throw suspend;
        } else if (status === "error") {
          console.log("HTTP Error", result);
          throw result;
        } else if (status === "success") {
          console.log("Axios Promise Wrapper HTTP Result", result, outerThis.promiseUUID);
          return process(result.data);
        }
      },
    };
  }
}
