import axios from "axios";
import { DATA_SOURCES } from "CONSTANTS";
import { v4 as uuid } from "uuid";

export default class DataSource {
  constructor(type, link, label) {
    console.log("render - new Datasource", label)
    this.type = type;
    this.link = link;
    this.label = label;
    this.name = label;
    this.dataSourceID = uuid()
    this.refresh();
  }

  refresh() {
    if (this.type === DATA_SOURCES.HTTP) {
      console.log("Refreshing Datasource", this.dataSourceID)
      this.promiseUUID = uuid();      
      this.axiosPromise = this.wrapAxiosPromise(this.link);

      //console.log("Making/Refreshing HTTP Promise", this);
    }
  }


  // this function is a bit of a bodge
  // need to formalise method for getting from raw HTTP data to ata in correct props format.
  processResult(res) {

      try {
        console.log("Processing Result", res)
        return res.results.map((r) => r.value);
      } catch (error) {
        console.log("HTTP result not an array, returning raw result", error, res)
        return res;
      }
  }


  // this function wraps the axios get function to prevent a BB's render until HTTP data is present.
  
  wrapAxiosPromise(url) {
    console.log("Wrapping Axios Promise Datasource")
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
        console.log("HTTP Result", res, res.request?.status);

        switch (res.request?.status) {
          case 200:
            status = "success";
            result = res;
            break;
          case 0:
            status = "error";
            result = res;
            console.log("Caught error with case 0", res)
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
          // suspend rendering
          throw suspend;
        } else if (status === "error") {
          console.log("HTTP Error", result);
          return {status:status, result:result};
        } else if (status === "success") {
          console.log("Axios Promise Wrapper HTTP Result", result, outerThis.promiseUUID);
          return {status:status, result:process(result.data)};
        }
      },
    };
  }
}
