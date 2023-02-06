import React, { Fragment, useState, useRef, useEffect, useCallback } from "react";
import { Formik, Field, useField, Form } from "formik";

export const websocketChannels = ["100", "channel1", "channel2", "random_array"];
export const sources = { HTTP: "http", CONSTANT: "constant", WS: "ws", SOURCE: "source" };
export const SEPARATOR = "?";

export default function AutoField(props) {

  // next -
  // make multi chart
  // make indicator
  // get conditional options to work
  // refactor options so type indicates multiple, datasource etc
  // choice field - have initial value come through on submit

  let option = { ...props.option };
  if (props.prefix) {
    console.log("AutoField Option with prefix", props.option, props.prefix);
    option = { ...option, label: `${props.prefix}${option.label}` };
  }

  if (option.dataSource) {
    return <DataSourceField {...option} />;
  }

  switch (props.option.type) {
    case "float":
      return <FloatField {...option} />;
    case "text":
      return <TextField {...option} />;
    case "choice":
      return <ChoiceField {...option} />;
    default:
      return <p>No field configured for type "{option.type}"</p>;
  }
}

function FloatField(props) {
  return (
    <div className="col-12">
      <FormLabel htmlFor={props.label}>{props.verbose}</FormLabel>
      <Field
        id={props.label}
        name={props.label}
        placeholder={props.initial}
        className="form-control"
      />
    </div>
  );
}
export function FormLabel({ htmlFor, children }) {
  return (
    <label className="px-2 mb-1" htmlFor={htmlFor}>
      {children}
    </label>
  );
}

function getInitialSource(label, fieldValues) {
  const split = label.split(".");
  if (split.length > 1) {
    // split is ["overall label", "index", "inner label"]
    var value = fieldValues[split[0]][parseInt(split[1])][split[2] + SEPARATOR + sources.SOURCE];
  } else {
    var value = fieldValues[split[0] + SEPARATOR + sources.SOURCE];
  }

  return value;
}

const defaultValues = {
  [sources.CONSTANT]: "",
  [sources.HTTP]: "http://localhost:8000/datums/?name=datum1&history=7",
  [sources.WS]: websocketChannels[0],
};
function getLastValues({ initialType, initialSource }) {
  var lastValues = {};
  Object.entries(defaultValues).map(([k, v]) => {
    lastValues[k] = initialType === k ? initialSource : v;
  });
  return lastValues;
}

function DataSourceField(props) {
  const [field, meta, helpers] = useField(props.label);
  const {value} = meta
  const {setValue} = helpers
  const [lastValues, setLastValues] = useState(getLastValues(value));
 
  const handleSourceChange = type => {
    const currentValue = { type: type, link: lastValues[type] }
    console.log("{ type: value, link: lastValues[value] }", currentValue, "label", props.label )
    setValue(currentValue, false)
  }

  useEffect(() => handleSourceChange(value.type), [lastValues])

  return (
    
    <div className="col-12">
      {console.log("current value", value, props.label)}
      <FormLabel htmlFor="input-group">{[props.verbose]}</FormLabel>
      <div id="input-group" className="row p-0 g-3">
        <div className="col-md-4">
          <div className="input-group">
            <div className="input-group-text">Source</div>
            <select
              value={value.type}
              onChange={(e) => handleSourceChange(e.target.value)}
              id="sourceSwitch"
              className="form-select col-2"
            >
              <option value={sources.CONSTANT}>Constant</option>
              <option value={sources.HTTP}>HTTP Request</option>
              <option value={sources.WS}>Websocket Channel</option>
            </select>
          </div>
        </div>

        <div className="col-md-8">
          <div className="input-group">
            <div className="input-group-text">
              {
                {
                  [sources.CONSTANT]: "Value",
                  [sources.HTTP]: "URL",
                  [sources.WS]: "Channel",
                }[value.type]
              }
            </div>
            <DataSourceLinkField
              source={value.type}
              lastValues={lastValues}
              setLastValues={setLastValues}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function DataSourceLinkField({ source, lastValues, setLastValues }) {
  console.log(" source, lastValues, setLastValues ", source, lastValues, setLastValues);
  const props = {
    value: lastValues[source],
    onChange: (e) => setLastValues((prev) => ({ ...prev, [source]: e.target.value })),
  };

  switch (source) {
    // names for input fields must be unique
    // Should likely just make these controlled...
    case sources.CONSTANT:
      return <input {...props} placeholder="Constant" className="form-control" />;
    case sources.HTTP:
      return <input {...props} placeholder="URL" className="form-control" />;
    case sources.WS:
      return (
        <select {...props} className="form-select">
          {websocketChannels.map((choice) => (
            <option key={choice} value={choice}>
              {choice}
            </option>
          ))}
        </select>
      );
    default:
      return (
        <input type="text" placeholder="default - should never see this" className="form-control" />
      );
  }
}

function TextField(props) {
  return (
    <div className="col-12">
      <FormLabel htmlFor={props.label}>{props.verbose}</FormLabel>
      <Field
        id={props.label}
        name={props.label}
        placeholder={props.initial}
        className="form-control"
      />
    </div>
  );
}

function ChoiceField(props) {
  const [field, meta, helpers] = useField(props.label);
  console.log("field, meta, helpers (choice field)", field, meta, helpers)
  return (
    <div className="col-12">
      <FormLabel htmlFor={props.label}>{props.verbose}</FormLabel>
      <Field id={props.label} name={props.label} as="select" className="form-select" >
        {props.choices.map((choice) => (
          <option key={choice} value={choice}>
            {choice}
          </option>
        ))}
      </Field>
    </div>
  );
}
