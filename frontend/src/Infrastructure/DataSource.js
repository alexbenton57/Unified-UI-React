import axios from "axios";
import { sources } from "./AutoField";

export default class DataSource {
  constructor(type, link, label, initial) {
    this.type = type;
    this.link = link;
    this.label = label;
    this.initial = initial;

    if (this.type === sources.HTTP) {
      this.axiosPromise = this.wrapAxiosPromise(this.link);
    };
  }

  processResult(res) {
    if (Array.isArray(res)) {
      try {
        return res.map((r) => r.value);
      } catch (error) {
        return res;
      }
    }
    return res;
  }

  wrapAxiosPromise(url) {
    const promise = () =>
      axios
        .get(url)
        .then((res) => res.data.results)
        .catch((err) => console.log(err));

    let status = "pending";
    let result;
    let suspend = promise().then(
      (res) => {
        status = "success";
        result = this.processResult(res);
      },
      (err) => {
        status = "error";
        result = err;
      }
    );
    return {
      read() {
        if (status === "pending") {
          throw suspend;
        } else if (status === "error") {
          throw result;
        } else if (status === "success") {
          console.log("Axios Promise Wrapper HTTP Result", result);
          return result;
        }
      },
    };
  }
}
