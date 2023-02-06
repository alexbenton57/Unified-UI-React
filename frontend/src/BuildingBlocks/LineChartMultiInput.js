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
      data.forEach((obj) => (propsData[obj.key] = obj.data[i]));

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
            key={obj.key}
            type={obj.lineType}
            dataKey={obj.key}
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
  {
    label: "data",
    verbose: "Chart Series",
    multiple: true,
    options: [
      { label: "data", verbose: "Series Data", initial: [], type: "array", dataSource: true },
      { label: "name", verbose: "Series Name", initial: "Default Name", type: "text" },
      {
        label: "lineType",
        verbose: "Line Type",
        initial: "monotone",
        type: "choice",
        choices: typeChoices,
      },
    ],
  },

  // Datasource option - number
  {
    label: "refValue",
    verbose: "Reference Line Value",
    initial: 0,
    type: "number",
    dataSource: true,
  },

  // Simple option - text
  {
    label: "refText",
    verbose: "Reference Line Text",
    initial: "Default Overall Name",
    type: "text",
  },
]);

LineChartMultiInput.optionsClass = new BuildingBlockOptions(LineChartMultiInput.options);
/*
const egDataSourceConfig = {
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

const forMultiChartMultiVar = [
    { ...someOtherOption },
    {
      label: "arrayOfData", // prop name
      verbose: "Chart DataSeries",
      multiple: true,
  
      options: [
        { ...egDataSourceConfig, label: "dsLabel" },
        { ...egNameConfig, label: "name" },
      ],
  
      formValues: [
        {dsLabel: {type: "ws", link: "channel"}, name:value}
      ]

      ],
    },
  ];

props[overallLabel] = [{dsLabel: [...data], name:"name1"}, etc}]
*/
