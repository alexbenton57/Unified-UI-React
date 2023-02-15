import React, { Fragment, useCallback, useEffect, useState } from "react";
import { Formik, Form } from "formik";

import AutoFieldMulti, {
  sources,
  SEPARATOR,
  websocketChannels,
} from "./AutoFieldMulti";

import useLogOnChange from "Hooks/useLogOnChange";
import BuildingBlockWrapperMulti from "./BuildingBlockWrapperMulti";
import { string } from "yup";
import DataSource from "Classes/DataSource";

import AccordionMultiField from "multivar/AccordionMultiField";

export default function ConfiguratorForm({ content, setConfig }) {
    console.log("render - ConfiguratorForm");
  
    // multiValues = {"overallLabel1": n, "overallLabel2": m}
    const [multiValues, setMultiValues] = useState(() => {
      const initial = {};
      content.options.map((option) => {
        if (option.fieldType === "optionArray") {
          initial[option.label] = 1;
        }
      });
      return initial;
    });
  
    // multiState = {overallLabel1: num, overallLabel2: num}
    const initialValues = getFormInitialValues(content.options, multiValues);
    console.log("initialValues", initialValues);
    return (
      <Formik
        initialValues={initialValues}
        onSubmit={(values) => {
          console.log(values);
          handleMultiSubmit(values, multiValues, content, setConfig);
        }}
      >
        <Form className="row gy-3">
          {content.options.map((option) => {
            if (option.fieldType === "optionArray") {
              return (
                <AccordionMultiField
                  key={option.label}
                  option={option}
                  multiValues={multiValues}
                  setMultiValues={setMultiValues}
                />
              );
            } else {
              return <AutoFieldMulti key={option.label} option={option} />;
            }
          })}
  
          <div className="col-12">
            <button type="submit" className="btn btn-primary my-3">
              Submit
            </button>
          </div>
        </Form>
      </Formik>
    );
  }

  
function getFormInitialValues(options, multiValues) {
    let initialValues = {};
  
    options.map((option) => {
      if (option.fieldType === "optionArray") {
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
  
  function addInitialValue(initialValues, option, prefix = "") {
    if (option.fieldType === "dataSource") {
      initialValues[prefix + option.label + SEPARATOR + sources.CONSTANT] = "";
      initialValues[prefix + option.label + SEPARATOR + sources.HTTP] =
        "http://localhost:8000/datums/?name=datum1&history=7";
      initialValues[prefix + option.label + SEPARATOR + sources.WS] = websocketChannels[0];
      initialValues[prefix + option.label + SEPARATOR + sources.SOURCE] = sources.CONSTANT;
    } else {
      initialValues[prefix + option.label] = "";
    }
  
    return initialValues;
  }

  function handleMultiSubmit(values, multiValues, content, setContentConfig) {
    console.log("Form submitted - handleSubmit(values) triggered:", values);
  
    var newConfig = [];
  
    content.options.map((option) => {
      if (option.fieldType === "optionArray") {
  
        const range = [...Array(multiValues[option.label]).keys()];
        console.log("Range", range, )
  
        const formValues = range.map((i) => {
          const formValue = {};
          option.options.map((innerOption) => {
            if (innerOption.dataSource) {
              const prefix = option.label + SEPARATOR + String(i) + SEPARATOR + innerOption.label;
              const sourceType = values[prefix + SEPARATOR + sources.SOURCE];
              const sourceLink = values[prefix + SEPARATOR + sourceType];
              formValue[innerOption.label] = new DataSource(sourceType, sourceLink, prefix, innerOption.initial);
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
        if (option.fieldType === "dataSource") {
          const sourceType = values[option.label + SEPARATOR + sources.SOURCE];
          const sourceLink = values[option.label + SEPARATOR + sourceType];
          newConfig.push({ ...option, source: new DataSource(sourceType, sourceLink, option.label, option.initial) });
        } else {
          newConfig.push({ ...option, value: values[option.label] });
        }
      }
    });
  
    setContentConfig(newConfig);
  }