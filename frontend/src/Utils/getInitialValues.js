import { WEBSOCKET_CHANNELS, DATA_SOURCES } from "CONSTANTS";
import stringify from "./stringify";

const defaultDataSourceLinks = {
  [DATA_SOURCES.CONSTANT]: "",
  [DATA_SOURCES.HTTP]: "http://",
  [DATA_SOURCES.WS]: WEBSOCKET_CHANNELS[0],
};

// for getting initial values for forms
// should be ex
export default function getInitialValues(options, existingConfig) {
    let initialValues = {};
  
    options
      .filter((o) => !o.omittedFromForm)
      .map((option) => {
        initialValues[option.name] = getInitialValue(option, existingConfig?.[option.name]);
      });
  
    return initialValues;
  }
  
  function getInitialValue(option, prev) {
  
    console.log("getInitialValue", option, prev)
    const getValue = (fieldTypeDefault) => {
      if (prev !== undefined) {
        return prev;
      } else if (option.defaultValue !== undefined) {
        return option.defaultValue;
      } else {
        return fieldTypeDefault;
      }
    };
  
    switch (option.fieldType) {
      case "optionArray":
        return prev?.map((innerExistingConfig) =>
          getInitialValues(option.options, innerExistingConfig)
        ) || [];
  
      case "dataSource":
        const type = prev?.type || DATA_SOURCES.CONSTANT;
        const link = prev?.link || defaultDataSourceLinks[type];
        //console.log("DataSource initial value", option, prev, "=>",  { type: type, link: link })
        return { type: type, link: link };
  
      case "choice":
        return getValue(option.choices?.[0] || "");
  
      case "boolean":
        return getValue(false);

      case "integer":
        return parseInt(getValue(0));
      case "json":
        return stringify(getValue([]));
  
      default:
        console.log("warning - getInitialValues not configured for an option of type ", option.fieldType )
        return getValue("");
    }
  }