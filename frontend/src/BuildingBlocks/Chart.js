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
          const SeriesType = { bar: Bar, line: Line, area: Area }[seriesStyle]
          const color = ['blue', 'red', 'green', 'purple', 'orange'][i]

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
