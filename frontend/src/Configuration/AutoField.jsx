import React, { Fragment, useState, useRef, useEffect, useCallback } from "react";
import { Formik, Field, useField, Form, useFormikContext, FieldArray } from "formik";
import { v4 as uuid } from "uuid";
import Accordion from "react-bootstrap/Accordion";
import stringify from "Utils/stringify";
import getInitialValues from "Utils/getInitialValues";
import { WEBSOCKET_CHANNELS, DATA_SOURCES } from "CONSTANTS";
import * as Icon from "react-bootstrap-icons";

export default function AutoField({ option }) {
  console.log("AutoField with props:", option);
  const { values } = useFormikContext();

  const isEnabled = (option) => {
    if (option.enabledBy === undefined) {
      return true;
    } else if (option.enabledBy in values) {
      const enablerValue = values[option.enabledBy];
      if ([true, false].includes(enablerValue)) {
        return enablerValue;
      } else {
        throw new Error(
          `Enabling option (${enablingOption.name}) for field '${option.name}' must have fieldType='boolean'`
        );
      }
    } else {
      throw new Error("enabledBy propery not a member of options");
    }
  };

  // next -
  // make multi chart
  // make indicator
  // choice field - have initial value come through on submit

  // done - get conditional options to work
  // done - refactor options so type indicates multiple, datasource etc

  if (!option.omittedFromForm && isEnabled(option)) {
    switch (option.fieldType) {
      case "optionArray":
        return (
          <FieldArray name={option.name} key={option.name}>
            {(arrayHelpers) => <OptionSetAccordion option={option} arrayHelpers={arrayHelpers} />}
          </FieldArray>
        );
      case "dataSource":
        return <DataSourceField {...option} />;
      case "input":
        return <TextField {...option} />;
      case "choice":
        return <ChoiceField {...option} />;
      case "boolean":
        return <BooleanField {...option} />;
      case "json":
        return <JSONField {...option} />;
      case "integer":
        return <IntegerField {...option} />;
      default:
        console.log("no field configured", option);
        return <p>No field configured for type "{option.fieldType}"</p>;
    }
  }
}

export function FormLabel({ htmlFor, children }) {
  return (
    <label className="px-2 mb-1" style={{ fontSize: "0.9em" }} htmlFor={htmlFor}>
      {children}
    </label>
  );
}

const defaultValues = {
  [DATA_SOURCES.CONSTANT]: "",
  [DATA_SOURCES.HTTP]: "http://localhost:8000/datums/?name=datum1&history=7",
  [DATA_SOURCES.WS]: WEBSOCKET_CHANNELS[0],
};

// makes an object to store the last 'link' value for each datasource type
function getLastValues(currentValue) {
  var lastValues = {};

  Object.entries(defaultValues).forEach(([k, v]) => {
    lastValues[k] = currentValue.type === k ? currentValue.link : v;
  });

  return lastValues;
}

function IntegerField(option) {
  // Formik's useField helps us imperatively set the value for this field
  // instead of using the name of a field only
  const [field, meta, helpers] = useField(option.name);
  const [value, setValue] = [field.value, helpers.setValue];
  console.log("Integer Field", value)

  return (
    <div className="col-12" id={option.name}>
      <FormLabel htmlFor={option.name}>{option.verbose}</FormLabel>

      <div className="input-group input-group-sm">
        <input
          type="text"
          className="form-control"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <span className="input-group-text" role="button" onClick={() => setValue(parseFloat(value) + 1)}>
          <Icon.PlusLg />
        </span>
        <span className="input-group-text" role="button" onClick={() => setValue(parseFloat(value) -1 )}>
          <Icon.DashLg />
        </span>
      </div>
    </div>
  );
}

function DataSourceField(option) {
  // Formik's useField helps us imperatively set the value for this field
  // instead of using the name of a field only
  const [field, meta, helpers] = useField(option.name);
  const [value, setValue] = [field.value, helpers.setValue];

  const [lastValues, setLastValues] = useState(getLastValues(value));

  // method to set form value
  const setFormValue = (type) => {
    const currentValue = { type: type, link: lastValues[type] };
    setValue(currentValue, false);
  };

  // setValue when lastValues is changed
  useEffect(() => setFormValue(value.type), [lastValues]);

  return (
    <div className="col-12">
      <FormLabel htmlFor="input-group">{[option.verbose]}</FormLabel>
      <div id="input-group" className="row p-0 g-3">
        <div className="col-md-4">
          <div className="input-group input-group-sm">
            <div className="input-group-text">Source</div>
            <select
              value={value.type}
              onChange={(e) => setFormValue(e.target.value)}
              id="sourceSwitch"
              className="form-select col-2"
            >
              <option value={DATA_SOURCES.CONSTANT}>Constant</option>
              <option value={DATA_SOURCES.HTTP}>HTTP Request</option>
              <option value={DATA_SOURCES.WS}>Websocket Channel</option>
            </select>
          </div>
        </div>

        <div className="col-md-8">
          <div className="input-group input-group-sm">
            <div className="input-group-text">
              {
                {
                  [DATA_SOURCES.CONSTANT]: "Value",
                  [DATA_SOURCES.HTTP]: "URL",
                  [DATA_SOURCES.WS]: "Channel",
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
  const inputProps = {
    value: lastValues[source],
    onChange: (e) => setLastValues((prev) => ({ ...prev, [source]: e.target.value })),
  };

  switch (source) {
    // names for input fields must be unique
    // Should likely just make these controlled...
    case DATA_SOURCES.CONSTANT:
      return (
        <input {...inputProps} placeholder="Constant" className="form-control form-control-sm" />
      );
    case DATA_SOURCES.HTTP:
      return <input {...inputProps} placeholder="URL" className="form-control form-control-sm" />;
    case DATA_SOURCES.WS:
      return (
        <select {...inputProps} className="form-select form-select-sm">
          {WEBSOCKET_CHANNELS.map((choice) => (
            <option key={choice} value={choice}>
              {choice}
            </option>
          ))}
        </select>
      );
    default:
      return (
        <input
          type="text"
          placeholder="default - should never see this"
          className="form-control form-control-sm"
        />
      );
  }
}

function TextField(option) {
  return (
    <div className="col-12">
      <FormLabel htmlFor={option.name}>{option.verbose}</FormLabel>
      <Field
        id={option.name}
        name={option.name}
        placeholder={option.initial}
        className="form-control form-control-sm"
      />
    </div>
  );
}

function JSONField(option) {
  const [field, meta, helpers] = useField(option.name);
  const [value, setValue] = [field.value, helpers.setValue];

  const [currentVal, setCurrentVal] = useState(value);

  const checkIsValid = useCallback((val) => {
    try {
      const jsonVal = JSON.parse(val);
      return true
    } catch (error) {
      return false;
    }
  })

  useEffect(() => {
    if (checkIsValid(currentVal)) {setValue(JSON.parse(currentVal))}
  }, [currentVal])

  return (
    <div className="col-12">
      <FormLabel htmlFor={option.name} className="d-flex justify-content-between">
        <span>{option.verbose}</span>
        {checkIsValid(currentVal) ? (
          <span className="text-success">Valid JSON</span>
        ) : (
          <span className="text-danger">Invalid JSON</span>
        )}
      </FormLabel>
      <textarea
        id={option.name}
        placeholder={option.initial}
        className="form-control form-control-sm text-monospace"
        onChange={(e) => setCurrentVal(e.target.value)}
        value={currentVal}
      ></textarea>
    </div>
  );
}

function ChoiceField(option) {
  return (
    <div className="col-12">
      <FormLabel htmlFor={option.name}>{option.verbose}</FormLabel>
      {option?.displayedAs === "pills" ? (
        <PillsField {...option} />
      ) : (
        <Field
          id={option.name}
          name={option.name}
          as="select"
          className="form-select form-select-sm"
        >
          {option.choices.map((choice) => (
            <option key={choice} value={choice}>
              {choice}
            </option>
          ))}
        </Field>
      )}
    </div>
  );
}

function PillsField(option) {
  const [field, meta, helpers] = useField(option.name);
  const [value, setValue] = [field.value, helpers.setValue];

  return (
    <ul className="nav nav-pills nav-justified col-12">
      {option.choices.map((choice, i) => (
        <li key={choice} className={`nav-item ${i === 0 ? "" : "ms-3"}`}>
          <a
            className={"nav-link py-1" + (choice === value ? " active" : " border border-primary")}
            onClick={() => setValue(choice)}
          >
            {choice}
          </a>
        </li>
      ))}
    </ul>
  );
}

function BooleanField(option) {
  const [field, meta, helpers] = useField(option.name);
  const [value, setValue] = [field.value, helpers.setValue];
  const toBool = (val) => {
    if (val === "true") {
      return true;
    } else if (val === "false") {
      return false;
    } else {
      return val;
    }
  };

  return (
    <div className="col-12 d-flex align-items-center">
      <FormLabel htmlFor={option.name}>{option.verbose}</FormLabel>
      <span className="form-switch mx-2">
        <input
          name={option.name}
          checked={value}
          onChange={() => {}}
          onClick={(e) => {
            console.log("onChange", e.target, e.target.value, value);
            setValue(!toBool(value));
          }}
          className="form-check-input"
          type="checkbox"
          role="switch"
          id={option.name}
        />
      </span>
    </div>
  );
}

function OptionSetAccordion({ option, arrayHelpers }) {
  const id = uuid();

  const nameArray = option.name.split(".");
  const innerOptionValues =
    nameArray.reduce((prev, namePart) => prev[namePart], arrayHelpers.form.values) || [];
  const blankValues = getInitialValues(option.options);

  console.log("AccordionField", option, arrayHelpers, blankValues, innerOptionValues);
  return (
    <Fragment>
      <div className="col-12">
        <FormLabel htmlFor={id}>{option.verbose}</FormLabel>
        <Accordion bsPrefix="accordion accordion-flush border rounded px-0 card-shadow">
          {innerOptionValues.map((_, i) => (
            <OptionSetAccordionItem option={option} i={i} />
          ))}

          <div
            className={
              "accordion-item rounded-bottom " + innerOptionValues.length === 0
                ? " rounded-top"
                : undefined
            }
          >
            <div className="accordion-header d-flex justify-content-end">
              <span
                className="text-primary py-1 px-3"
                role="button"
                onClick={() => arrayHelpers.push(blankValues)}
              >
                Add Option Set
              </span>
            </div>
          </div>
        </Accordion>
      </div>
    </Fragment>
  );
}

function OptionSetAccordionItem({ option, i }) {
  if (option.options.length > 1) {
    return (
      <Accordion.Item eventKey={i} bsPrefix={"accordion-item rounded-top"}>
        <Accordion.Button bsPrefix={"accordion-button py-1 rounded-top"}>
          {option.verbose + " " + String(i + 1)}
        </Accordion.Button>

        <Accordion.Body>
          {option.options.map((innerOption, j) => {
            const name = [option.name, i, innerOption.name].join(".");
            return <AutoField key={name} option={{ ...innerOption, name: name }} />;
          })}
        </Accordion.Body>
      </Accordion.Item>
    );
  } else if (option.options.length === 1) {
    const name = [option.name, i, option.options[0].name].join(".");
    return (
      <div className={"accordion-item " + i === 0 ? "rounded-top" : undefined}>
        <div className="accordion-header mx-3 my-1">
          <div>
            <AutoField key={name} option={{ ...option.options[0], name: name }} />
          </div>
        </div>
      </div>
    );
  }
}
