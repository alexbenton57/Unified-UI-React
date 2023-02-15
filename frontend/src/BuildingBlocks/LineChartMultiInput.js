import BuildingBlockOptions from "Classes/BuildingBlockOptions";
import React, { Fragment, useEffect, useState } from "react";
import {
  LineChart as Chart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

export default function LineChartMultiInput({ data, refValue, refText }) {
  const labels = ["January", "February", "March", "April", "May", "June", "July"];

  function getData() {
    const range = [...Array(7).keys()];
    const newData = range.map((i) => {
      const propsData = {};
      data.forEach((obj) => (propsData[obj.name] = obj.data[i]));

      return { ...propsData, ["name"]: labels[i] };
    });
    return newData;
  }

  const colours = ["red", "green", "blue", "pink", "purple"];
  const margins = { top: 5, right: 5, left: 5, bottom: 5 };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <Chart width={500} height={300} data={getData()} margin={margins}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <ReferenceLine y={refValue} stroke="green" label={refText} />
        {data.map((obj, i) => (
          <Line
            name={obj.name}
            key={obj.name}
            type={obj.lineType}
            dataKey={obj.name}
            color={colours[i]}
          />
        ))}
      </Chart>
    </ResponsiveContainer>
  );
}
// Broadly 2 options for handling input data to a BB - input cleaning, or robustness to bad data
// Input cleaning/checking can be done globally
const typeChoices = ["basis", "linear", "natural", "monotone", "step"];

LineChartMultiInput.options = Object.freeze([
  // Multi option - [text datasource, text, and a choice]
  { name: "twoAxes", verbose: "Use Two Axes?", defaultValue: false, fieldType: "boolean" },
  {
    name: "data",
    verbose: "Chart Series",
    fieldType: "optionArray",
    options: [
      { name: "data", verbose: "Series Data", fieldType: "dataSource", required: true },
      { name: "name", verbose: "Series Name", initial: "Default Name", fieldType: "input" },
      { name: "lineType", verbose: "Line Type", fieldType: "choice", choices: typeChoices },
      {
        name: "useRightAxis",
        verbose: "Use Right Axis",
        defaultValue: false,
        fieldType: "boolean",
        enabledBy: "twoAxes",
      },
    ],
  },

  // Datasource option - number
  {
    name: "refValue",
    verbose: "Reference Line Value",
    defaultValue: 0,
    fieldType: "dataSource",
  },

  // Simple option - text
  {
    name: "refText",
    verbose: "Reference Line Text",
    initial: "Default Overall Name",
    fieldType: "input",
  },
]);

LineChartMultiInput.optionsClass = new BuildingBlockOptions(LineChartMultiInput.options);
/*
const egDataSourceConfig = {
      name: "dataSeries",
      dataType: "array", // specify inner type? eg. array-float
      name: "Temperature Over Time",
      initial: [0], // Maybe not required for an array - default to an empty array?
      fieldType: "dataSource",

      source: {
        type: "ws",
        link: "channel1",
      },
      value: null, // until later
    },

const forMultiChartMultiVar = [
    { ...someOtherOption },
    {
      name: "arrayOfData", // prop name
      verbose: "Chart DataSeries",
      fieldType: "optionArray",
  
      options: [
        { ...egDataSourceConfig, name: "dsLabel" },
        { ...egNameConfig, name: "name" },
      ],
  
      formValues: [
        {dsname: {fieldType: "ws", link: "channel"}, name:value}
      ]

      ],
    },
  ];

props[overallLabel] = [{dsname: [...data], name:"name1"}, etc}]
*/
