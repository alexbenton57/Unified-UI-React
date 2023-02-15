import BuildingBlockOptions from "Classes/BuildingBlockOptions";
import React, { Fragment, useEffect, useState } from "react";
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Bar,
  Area,
  ReferenceLine,
} from "recharts";




export default function Chart({ useTwoAxes, xKey, series }) {
  console.log("render - chart", series);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart>
        <XAxis dataKey={xKey} type="number" unit="seconds"/>
        <YAxis yAxisId="left" orientation="left" unit={series.find(v => v.seriesAxis === "left")?.seriesUnit}/>
        {useTwoAxes && <YAxis yAxisId="right" orientation="right" unit={series.find(v => v.seriesAxis === "right")?.seriesUnit}/>}
        <CartesianGrid />
        <Tooltip />
        <Legend />

        {series.map((s, i) => {
            
          const { seriesName, seriesData, seriesYKey, seriesUnit, seriesStyle, seriesAxis } = s;
          const SeriesType = { bar: Bar, line: Line, area: Area }[seriesStyle];

          const color = ['blue', 'red', 'green', 'purple', 'orange'][i]
          const dot = { stroke: color, strokeWidth: 2 }
          const label = { fill: color, fontSize: 20 }

          return (
            <SeriesType
              data={seriesData.data}
              dataKey={seriesYKey}
              unit={seriesUnit}
              yAxisId={seriesAxis}
              name={seriesName}
              key={seriesName}
              stroke={color}
              fill={color}

            />
          );
        })}
      </ComposedChart>
    </ResponsiveContainer>
  );
}

function Series({ seriesName, seriesData, seriesYKey, seriesUnit, seriesStyle, seriesAxis }) {
  const SeriesType = { bar: Bar, line: Line, area: Area }[seriesStyle];
  console.log(
    "render - Series",
    seriesName,
    seriesData,
    seriesYKey,
    seriesUnit,
    seriesStyle,
    seriesAxis
  );
  return (
    <Line
      data={seriesData.data}
      dataKey={seriesYKey}
      unit={seriesUnit}
      yAxisId={seriesAxis}
      name={seriesName}
    />
  );
}

Chart.options = Object.freeze([
  { name: "useTwoAxes", verbose: "Use Two Axes?", defaultValue: false, fieldType: "boolean" },
  { name: "xKey", verbose: "X Data Key", fieldType: "input", required: true },
  {
    name: "series",
    verbose: "Chart Series",
    fieldType: "optionArray",
    options: [
      { name: "seriesName", verbose: "Series Name", fieldType: "input", required: true },
      { name: "seriesData", verbose: "Series Data", fieldType: "dataSource", required: true },
      { name: "seriesYKey", verbose: "Y Data Key", fieldType: "input", required: true },
      { name: "seriesUnit", verbose: "Data Unit", fieldType: "input" },
      {
        name: "seriesStyle",
        verbose: "Style",
        fieldType: "choice",
        defaultValue: "line",
        choices: ["line", "bar", "area"],
      },
      {
        name: "seriesAxis",
        verbose: "Axis",
        enabledBy: "useTwoAxes",
        defaultValue: "left",
        fieldType: "choice",
        choices: ["left", "right"],
      },
    ],
  },
]);

Chart.optionsClass = new BuildingBlockOptions(Chart.options);

/*
required options
- multiaxis vs single axis
    - need to subscribe data series to an axis in multiaxis case
    - to combine into one chart
- time/number series vs categorical
    - data as {xpos: x, yVal: y}
- line vs area vs bar 
    - for each option

- for a data series
    - dataKey
    - verbose/friendly name
    - styles? - colour, line style etc
    - bar vs line vs area
    - which axis? (made available by a toggle for double axis )

modifications to form generation
- allow value of one field to trigger the appearance of another?
    - need to change initial values dynamically for this
    - give a radio field a label, then on required options give a toggleVisible:'toggle label' key
        - how to distinguish between a global toggle and a local one?
- some concept of a form group
    - non-required options in a collapsed container?
    - as an accordion? - BBs maybe represented as tabs instead? Allows for a tab for saving and loading things...
- nested multi options?
    - need recursive functions for submit and initial values etc
- eliminate datasource wrangling with useField()? - would tidy things up somewhat
- possibly refactor 'label' to 'name'

*/
