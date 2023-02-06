import React, { Fragment, useCallback, useEffect, useState } from "react";
import { Formik, Form, Field, FieldArray } from "formik";
import { v4 as uuid } from "uuid";

import AutoField, {
  sources,
  SEPARATOR,
  websocketChannels,
  FormLabel,
} from "global-config/AutoField";

import Accordion from "react-bootstrap/Accordion";

import DataSource from "Classes/DataSource";

import stringify from "Utils/stringify";

// Modified from multivar/ConfiguratorForm

// input vars: options - derived from BB Definition
//             existing/initial values - derived

function addInitialValue(initialValues, option, prefix = "") {
  if (option.dataSource) {
    initialValues[prefix + option.label] = { type: sources.CONSTANT, link: "" };
  } else {
    initialValues[prefix + option.label] = "";
  }

  return initialValues;
}

function getInitialValues(options, existingConfig, bbID, bbType) {
  let initialValues = {};
  console.log(
    "option",
    options,
    options.filter((o) => !o.omittedFromForm)
  );
  options
    .filter((o) => !o.omittedFromForm)
    .map((option) => {
      const label = option.label;
      if (option.multiple) {
        if (existingConfig?.[label]?.length > 0) {
          initialValues[option.label] = existingConfig[label].map((innerConfigObj) => {
            var initialInnerValues = {};
            option.options.map((innerOption) => {
              initialInnerValues = {
                ...initialInnerValues,
                ...makeInitialValue(innerOption, innerConfigObj[innerOption.label]),
              };
            });

            return initialInnerValues;
          });
        } else {
          initialValues[label] = [];
        }
      } else {
        initialValues = { ...initialValues, ...makeInitialValue(option, existingConfig[label]) };
      }
    });

  initialValues.id = bbID;
  initialValues.bbType = bbType;

  return initialValues;
}

const defaultValues = {
  [sources.CONSTANT]: "",
  [sources.HTTP]: "http://localhost:8000/datums/?name=datum1&history=7",
  [sources.WS]: websocketChannels[0],
};

function makeInitialValue(option, prev) {
  var newObj = {};

  if (option.dataSource) {
    const type = prev?.type || sources.CONSTANT;
    const link = prev?.link || defaultValues[type];
    newObj[option.label] = { type: type, link: link };
  } else if (option.type === "choice") {
    newObj[option.label] = prev || option.choices?.[0] || "";
  } else {
    newObj[option.label] = prev || "";
  }
  return newObj;
}

function dataSourceFromForm(option, values) {
  const sourceType = values[option.label + SEPARATOR + sources.SOURCE];
  const sourceLink = values[option.label + SEPARATOR + sourceType];
  return { type: sourceType, link: sourceLink };
  //return new DataSource(sourceType, sourceLink, option.label, option.initial);
}

export default function BuildingBlockForm({ bbID, bbType, options, setBBConfig, existingConfig }) {
  const initialValues = getInitialValues(options, existingConfig, bbID, bbType);
  console.log("Building Block Options", options, bbID, initialValues);

  return (
    <Formik initialValues={initialValues} onSubmit={(values) => setBBConfig(values)}>
      {({ values, errors, touched, handleReset }) => (
        <Form className="row gy-3">
          {console.log("values", values)}
          {options.map((option) => {
            if (!option.omittedFromForm) {
              if (option.multiple) {
                return (
                  <FieldArray name={option.label} key={option.label}>
                    {(arrayHelpers) => (
                      <AccordionField option={option} arrayHelpers={arrayHelpers} />
                    )}
                  </FieldArray>
                );
              } else {
                return <AutoField key={option.label} option={option} />;
              }
            }
          })}
          <div className="col-12">
            <button type="submit" className="btn btn-primary my-3">
              Submit
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

function AccordionField({ option, arrayHelpers }) {
  const id = uuid();
  const innerOptionValues = arrayHelpers.form.values[option.label] || [];

  let blankValues = {};
  option.options.map((innerOpt) => {
    blankValues = addInitialValue(blankValues, innerOpt);
  });

  console.log("AccordionField", option, arrayHelpers, innerOptionValues);
  return (
    <Fragment>
      <div className="col-12">
        <FormLabel htmlFor={id}>{option.verbose}</FormLabel>
        <Accordion bsPrefix="accordion accordion-flush border rounded px-0">
          {innerOptionValues.map((_, i) => (
            <Accordion.Item key={i} eventKey={i} bsPrefix={"accordion-item rounded-top"}>
              <Accordion.Button bsPrefix="accordion-button py-1">
                {option.verbose + " " + String(i + 1)}
              </Accordion.Button>

              <Accordion.Body>
                {option.options.map((innerOption, j) => (
                  <AutoField key={j} option={innerOption} prefix={`${option.label}.${i}.`} />
                ))}
              </Accordion.Body>
            </Accordion.Item>
          ))}

          <Accordion.Item eventKey={-1}>
            <Accordion.Button bsPrefix="accordion-button py-1">Form Values</Accordion.Button>
            <Accordion.Body>
              <pre>{stringify(innerOptionValues)}</pre>
            </Accordion.Body>
          </Accordion.Item>

          <div className="accordion-item rounded-bottom">
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

function getFormInitialValues(options, multiValues) {
  let initialValues = {};

  options.map((option) => {
    if (option.multiple) {
      const range = [...Array(multiValues[option.label]).keys()];

      range.map((i) => {
        const prefix = option.label + SEPARATOR + String(i) + SEPARATOR;
        option.options.map((innerOpt) => {
          initialValues = addInitialValue(initialValues, innerOpt, prefix);
        });
      });
    } else {
      initialValues = addInitialValue(initialValues, option);
    }
  });

  return initialValues;
}

function handleMultiSubmit(values, multiValues, content, setContentConfig) {
  console.log("Form submitted - handleSubmit(values) triggered:", values);

  var newConfig = [];

  content.options.map((option) => {
    if (option.multiple) {
      const range = [...Array(multiValues[option.label]).keys()];
      console.log("Range", range);

      const formValues = range.map((i) => {
        const formValue = {};
        option.options.map((innerOption) => {
          if (innerOption.dataSource) {
            const prefix = option.label + SEPARATOR + String(i) + SEPARATOR + innerOption.label;
            const sourceType = values[prefix + SEPARATOR + sources.SOURCE];
            const sourceLink = values[prefix + SEPARATOR + sourceType];
            formValue[innerOption.label] = new DataSource(
              sourceType,
              sourceLink,
              prefix,
              innerOption.initial
            );
          } else {
            formValue[innerOption.label] =
              values[option.label + SEPARATOR + String(i) + SEPARATOR + innerOption.label];
          }
        });
        console.log("formValue", formValue);
        return formValue;
      });
      newConfig.push({ ...option, formValues: formValues });
    } else {
      if (option.dataSource) {
        const sourceType = values[option.label + SEPARATOR + sources.SOURCE];
        const sourceLink = values[option.label + SEPARATOR + sourceType];
        newConfig.push({
          ...option,
          source: new DataSource(sourceType, sourceLink, option.label, option.initial),
        });
      } else {
        newConfig.push({ ...option, value: values[option.label] });
      }
    }
  });

  setContentConfig(newConfig);
}
