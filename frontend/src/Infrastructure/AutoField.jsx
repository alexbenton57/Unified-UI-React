import React, { Fragment, useState, useRef, useEffect, useCallback } from "react";
import * as Icon from "react-bootstrap-icons";
import ReactModal from "react-modal";
import { Formik, Field, useField, Form } from "formik";

export const websocketChannels = ["100", "channel1", "channel2", "random_array"];
export const sources = { HTTP: "http", CONSTANT: "constant", WS: "ws", SOURCE: "source" };
export const SEPARATOR = "?";

export default function AutoField(props) {

  let option = {...props.option}
  if(props.prefix) {
    console.log("AutoField Option", props.option, props.prefix)
    option = {...option, label:`${props.prefix}${option.label}`}
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
      return <p>No field configured for type "{option.type}"</p>
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

function DataSourceLinkField({ label, source }) {
  console.log("getSourceHTML()", source);
  switch (source) {
    // names for input fields must be unique
    // Should likely just make these controlled...
    case sources.CONSTANT:
      return (
        <Field
          name={label + SEPARATOR + sources.CONSTANT}
          placeholder="Constant"
          className="form-control"
        />
      );
    case sources.HTTP:
      return (
        <Field name={label + SEPARATOR + sources.HTTP} placeholder="URL" className="form-control" />
      );
    case sources.WS:
      return (
        <Field as="select" name={label + SEPARATOR + sources.WS} className="form-select">
          {websocketChannels.map((choice) => (
            <option key={choice} value={choice}>
              {choice}
            </option>
          ))}
        </Field>
      );
    default:
      return (
        <input type="text" placeholder="default - should never see this" className="form-control" />
      );
  }
}


function getInitialSource(label, fieldValues) {
  const split = label.split(".")
  if (split.length > 1) {
    // split is ["overall label", "index", "inner label"]
    var value = fieldValues[split[0]][parseInt(split[1])][split[2] + SEPARATOR + sources.SOURCE]

    } else {
      var value = fieldValues[split[0] + SEPARATOR + sources.SOURCE]

    }

  return value

}


function DataSourceField(props) {
  const [field, meta, helpers] = useField(props.label);
  const [source, setSource] = useState(getInitialSource(props.label, field.value));

  const handleValueChange = useCallback((e) => {

    setSource(e.target.value);
  }, [setSource])


  //    {getSourceHTML(source)}
  //{source == "constant" && <Field id="urlInput" name={props.label} placeholder="Constant" className="form-control col-8" />}
  return (
    <div className="col-12">
      <FormLabel htmlFor="input-group">{[props.verbose]}</FormLabel>
      <div id="input-group" className="row p-0 g-3">
        <div className="col-md-4">
          <div className="input-group">
            <div className="input-group-text">Source</div>
            <Field

              as="select"
              name={props.label + SEPARATOR + sources.SOURCE}
              id="sourceSwitch"
              className="form-select col-2"
              onClick={handleValueChange}

            >
              <option value={sources.CONSTANT}>Constant</option>
              <option value={sources.HTTP}>HTTP Request</option>
              <option value={sources.WS}>Websocket Channel</option>
            </Field>
          </div>
        </div>

        <div className="col-md-8">
          <div className="input-group">
            <div className="input-group-text">
              {{ constant: "Value", http: "URL", ws: "Channel" }[source]}
            </div>
            <DataSourceLinkField label={props.label} source={source} />
          </div>
        </div>
      </div>
    </div>
  );
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
  return (
    <div className="col-12">
      <FormLabel htmlFor={props.label}>{props.verbose}</FormLabel>
      <Field id={props.label} name={props.label} as="select" className="form-select">
        {props.choices.map((choice) => (
          <option key={choice} value={choice}>
            {choice}
          </option>
        ))}
      </Field>
    </div>
  );
}
