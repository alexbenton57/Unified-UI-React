import React, { useCallback, useEffect } from "react";
import { Formik, Form } from "formik";

import AutoField, { sources, SEPARATOR, websocketChannels } from "./AutoField";

import Card from "./Card";
import useLogOnChange from "Hooks/useLogOnChange";
import BuildingBlockWrapper from "Infrastructure/BuildingBlockWrapper";
import DataSource from "./DataSource";

function getFormInitialValues(opts) {
  const initialValues = {};

  for (let option of opts) {
    if (option.dataSource) {
      initialValues[option.label + SEPARATOR + sources.CONSTANT] = "";
      initialValues[option.label + SEPARATOR + sources.HTTP] =
        "http://localhost:8000/datums/?name=datum1&history=7";
      initialValues[option.label + SEPARATOR + sources.WS] = websocketChannels[0];
      initialValues[option.label + SEPARATOR + sources.SOURCE] = sources.CONSTANT;
    } else {
      initialValues[option.label] = option.default;
    }
  }

  return initialValues;
}

export function DataSourceComponent(props) {
  useLogOnChange(props.config, "(render) Config passed to DataSourceComponent()");
  console.log("render - DataSourceComponent");

  return (
      <BuildingBlockWrapper content={props.content} config={props.config} />
  );
}

export function addDefaultSourceValues(conf) {
  const config = structuredClone(conf);

  for (let option of config) {
    if (option.multiple) {
      option.formValues = []
    } else if (option.dataSource && !("source" in option)) {
      const link = {
          text: "",
          choice: [],
          array: [],
          float: 0,
          object: {},
        }[option.type]
      option.source = new DataSource(sources.CONSTANT, link, option.label, link)

    }
  }

  return config;
}

function handleSubmit(values, contentConfig, setContentConfig) {
  console.log("Form submitted - handleSubmit(values) triggered:", values);

  var newConfig = [];

  for (let option of contentConfig) {
    if (option.dataSource) {
      const sourceType = values[option.label + SEPARATOR + sources.SOURCE];
      const sourceLink = values[option.label + SEPARATOR + sourceType];
      newConfig.push({
        ...option,
        source: {
          type: sourceType,
          link: sourceLink,
        },
      });
    } else {
      newConfig.push({ ...option, value: values[option.label] });
    }
  }

  setContentConfig(newConfig);
}

export function ConfiguratorForm(props) {
  console.log("render - ConfiguratorForm");
  const initialValues = getFormInitialValues(props.config);

  return (
    
      <Formik
        initialValues={initialValues}
        onSubmit={(values) => handleSubmit(values, props.config, props.setConfig)}
      >
        <Form className="row gy-3">
          {props.config.map((option) => (
            <AutoField key={option.label} option={option} />
          ))}
          <div className="col-12">
            <button type="submit" className="btn btn-primary my-3">
              Submit
            </button>
          </div>
        </Form>
      </Formik>

  );
}

/*
const dataFormatNote = () => {
  const forIndicator = [
    {
      label: "redEnd",
      verbose: "Red End Boundary",
      initial: 10,
      type: "float",
      value: 10, // Added later
    },

    {
      // Set in component.options
      label: "indicatorValue",
      type: "float", // could also have text, float, choice, object, array
      name: "Temperature Indicator Value",
      dataSource: true,
      initial: 0,

      // Added By Code
      source: {
        type: "constant",
        link: 3.141,
      },
      value: null, // until set by component wrapper
    },
  ];

  const forSingleChart = [
    { label: "redEnd", verbose: "Red End Boundary", initial: 10, type: "float" },
    {
      label: "dataSeries",
      type: "array", // specify inner type? eg. array-float
      name: "Temperature Over Time",
      initial: [0], // Maybe not required for an array - default to an empty array?
      dataSource: true,

      source: {
        type: "ws",
        link: "channel1",
      },
      value: null, // until later
    },
  ];

  // idea is to pass object of label:[...data] pairs (or label:{..data} or label:data)
  const forMultiChart-SingleVar = [
    {
      label: "arrayOfArrays", // prop name
      verbose: "Chart Data",
      dataSource: true,
      type: "array", // could also have text, float, choice, object, array
      multiple: true,
      initial: [null], // same value for all

      // Data attribute attribute set automatically
      // Data accessed through this property - slightly different from singleChart
      data: [
        {
          // Set by user
          source: { type: "http", link: "http://eg.url" },
          verbose: "Form-set name",

          // Set automatically?
          label: "uniqueID",

          value: [null], // until later
        },
      ],
    },
  ];
};


const forMultiChartMultiVar = [
  { ...someOtherOption },
  {
    label: "arrayOfData", // prop name
    verbose: "Chart DataSeries",
    multiple: true,

    options: [
      { ...egDataSourceConfig, label: "value" },
      { ...egNameConfig, label: "name" },
      { ...egLineTypeConfig, label: "linetype" },
    ],

    // Would then provide data as follows:

    values: [
      { value: "nums", name: "name1", linetype: "monotone" },
      { value: "nums", name: "name2", linetype: "monotone" },
    ],
  },
];
*/
