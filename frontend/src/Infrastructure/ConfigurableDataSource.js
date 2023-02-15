import React, { Fragment, useCallback, useEffect, useState } from "react";
import { Formik, Form } from "formik";


import useLogOnChange from "Hooks/useLogOnChange";
import BuildingBlockWrapperMulti from "./BuildingBlockWrapperMulti";
import { string } from "yup";
import DataSource from "Classes/DataSource";

export default function DataSourceComponent(props) {
  useLogOnChange(props.config, "(render) Config passed to DataSourceComponent()");
  console.log("render - DataSourceComponent");

  return <BuildingBlockWrapperMulti content={props.content} config={props.config} />;
}

export function addDefaultSourceValuesMulti(conf) {
  const config = structuredClone(conf);

  for (let option of config) {
    if (option.dataSource && !("source" in option)) {
      option.source = {
        type: "constant",
        link: {
          text: "",
          choice: [],
          array: [],
          float: 0,
          object: {},
        }[option.type],
      };
    }
  }

  return config;
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
      fieldType: "dataSource",
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
      fieldType: "dataSource",

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
      fieldType: "dataSource",
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
