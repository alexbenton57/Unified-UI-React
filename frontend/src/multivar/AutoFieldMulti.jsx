import React, { Fragment, useState } from "react";
import * as Icon from "react-bootstrap-icons";
import ReactModal from "react-modal";
import { Formik, Field, Form } from "formik";
import { options } from "BBDemos/Chartjs";

export const websocketChannels = ["100", "channel1", "channel2", "random_array"];
export const sources = { HTTP: "http", CONSTANT: "constant", WS: "ws", SOURCE: "source" };
export const SEPARATOR = "?";
export const MULTISEPERATOR = "#";

export default function AutoFieldMulti({ option }) {
  console.log("AutoFieldMulti", option);
  if (option.dataSource) {
    return <DataSourceField {...option} />;
  } else {
    switch (option.type) {
      case "float":
        return <FloatField {...option} />;
      case "text":
        return <TextField {...option} />;
      case "choice":
        return <ChoiceField {...option} />;
      default:
        return <p>Missing Field for option of type: {option.type}</p>;
    }
  }
}

function FloatField({ label, verbose, initial }) {
  return (
    <div className="col-12">
      <label htmlFor={label}>{verbose}</label>
      <Field id={label} name={label} placeholder={initial} className="form-control" />
    </div>
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
      default: return (
        <input type="text" placeholder="default - should never see this" className="form-control" />
      );
  }
}

function DataSourceField({ label, verbose }) {
  const [source, setSource] = useState(sources.CONSTANT);
  console.log("source", source);

  //    {getSourceHTML(source)}
  //{source == "constant" && <Field id="urlInput" name={label} placeholder="Constant" className="form-control col-8" />}
  return (
    <div className="col-12">
      <label htmlFor="input-group">{[verbose]}</label>
      <div id="input-group" className="row p-0 g-3">
        <div className="col-md-4">
          <div className="input-group">
            <div className="input-group-text">Source</div>
            <Field
              as="select"
              name={label + SEPARATOR + sources.SOURCE}
              id="sourceSwitch"
              className="form-select col-2"
              onClick={(e) => {
                console.log("onClick");
                setSource(e.target.value);
              }}
            >
              <option value="constant">Constant</option>
              <option value="http">HTTP Request</option>
              <option value="ws">Websocket Channel</option>
            </Field>
          </div>
        </div>

        <div className="col-md-8">
          <div className="input-group">
            <div className="input-group-text">
              {{ constant: "Value", http: "URL", ws: "Channel" }[source]}
            </div>
            <DataSourceLinkField label={label} source={source} />
          </div>
        </div>
      </div>
    </div>
  );
}

function TextField({ label, verbose, initial }) {
  return (
    <div className="col-12">
      <label htmlFor={label}>{verbose}</label>
      <Field id={label} name={label} placeholder={initial} className="form-control" />
    </div>
  );
}

function ChoiceField({ label, verbose, choices }) {
  return (
    <div className="col-12">
      <label htmlFor={label}>{verbose}</label>
      <Field id={label} name={label} as="select" className="form-select">
        {choices.map((choice) => (
          <option key={choice} value={choice}>
            {choice}
          </option>
        ))}
      </Field>
    </div>
  );
}
