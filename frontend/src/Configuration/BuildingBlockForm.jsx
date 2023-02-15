import React, { useCallback, useEffect } from "react";
import { Formik, Form, Field, FieldArray } from "formik";
import AutoField from "Configuration/AutoField";
import { WEBSOCKET_CHANNELS, DATA_SOURCES } from "CONSTANTS";
import getInitialValues from "Utils/getInitialValues";


export default function BuildingBlockForm({ bbID, bbType, options, setBBConfig, existingConfig }) {
  const initialValues = getInitialValues(options, existingConfig);
  initialValues.id = bbID;
  initialValues.bbType = bbType;


  console.log("Building Block Options", initialValues.title, options, initialValues);

  return (
    <Formik initialValues={initialValues} onSubmit={(values) => setBBConfig(values)}>
      {({ values, errors, touched, handleReset }) => (
        <BuildingBlockFormInner {...{ options, values, setBBConfig }} />
      )}
    </Formik>
  );
}


const defaultDataSourceLinks = {
  [DATA_SOURCES.CONSTANT]: "",
  [DATA_SOURCES.HTTP]: "http://",
  [DATA_SOURCES.WS]: WEBSOCKET_CHANNELS[0],
};



function BuildingBlockFormInner({ options, values, setBBConfig, bbConfig }) {
  console.log("BuildingBlockFormInner({ options, values })", options, values);

  return (
    <Form className="row gy-2">
      {options.map((option) => (
        <AutoField key={option.name} option={option} />
      ))}
      <div className="col-12">
        <button type="submit" className="btn btn-primary my-3">
          Submit
        </button>
      </div>
    </Form>
  );
}

/*
function getFormInitialValues(options, multiValues) {
  let initialValues = {};

  options.map((option) => {
    if (option.fieldType === "optionArray") {
      const range = [...Array(multiValues[option.name]).keys()];

      range.map((i) => {
        const prefix = option.name + SEPARATOR + String(i) + SEPARATOR;
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
    if (option.fieldType === "optionArray") {
      const range = [...Array(multiValues[option.name]).keys()];
      console.log("Range", range);

      const formValues = range.map((i) => {
        const formValue = {};
        option.options.map((innerOption) => {
          if (innerOption.dataSource) {
            const prefix = option.name + SEPARATOR + String(i) + SEPARATOR + innerOption.name;
            const sourceType = values[prefix + SEPARATOR + DATA_SOURCES.SOURCE];
            const sourceLink = values[prefix + SEPARATOR + sourceType];
            formValue[innerOption.name] = new DataSource(
              sourceType,
              sourceLink,
              prefix,
              innerOption.initial
            );
          } else {
            formValue[innerOption.name] =
              values[option.name + SEPARATOR + String(i) + SEPARATOR + innerOption.name];
          }
        });
        console.log("formValue", formValue);
        return formValue;
      });
      newConfig.push({ ...option, formValues: formValues });
    } else {
      if (option.fieldType === "dataSource") {
        const sourceType = values[option.name + SEPARATOR + DATA_SOURCES.SOURCE];
        const sourceLink = values[option.name + SEPARATOR + sourceType];
        newConfig.push({
          ...option,
          source: new DataSource(sourceType, sourceLink, option.name, option.initial),
        });
      } else {
        newConfig.push({ ...option, value: values[option.name] });
      }
    }
  });


  setContentConfig(newConfig);
}
*/
