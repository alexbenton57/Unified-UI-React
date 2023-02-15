import GaugeChart from "react-gauge-chart";
import BuildingBlockOptions from "Classes/BuildingBlockOptions";
import React, { Fragment, useEffect, useState } from "react";

export default function Gauge({ pointerValue, min, areas, unit }) {
  const { colors, arcsLength, value } = getAreas(min, areas, pointerValue);

  return (
    <Fragment>
      <GaugeChart
        id="gauge-chart1"
        nrOfLevels={420}
        arcsLength={arcsLength}
        colors={colors}
        percent={value}
        arcPadding={0.02}
        animate={false}
        formatTextValue={() => String(((String(pointerValue) || "") + (unit || "")) || "") }
        needleBaseColor="#555555"
        needleColor="#555555"
        textColor="#000000"
      />
    </Fragment>
    
  );
}

const getAreas = (min, areas, pointerValue) => {
  var arcs = areas.map((area) => ({ ...area, value: parseFloat(area.value) }));
  arcs = arcs.sort((a, b) => b.value < a.value);
  const max = Math.max(...arcs.map((a) => a.value));
  const arcsLength = arcs.map((arc, i) => arc.value - (arcs[i - 1]?.value || min));
  const colors = arcs.map((arc) => arc.color);
  const value = (pointerValue - parseFloat(min)) / (max - min);
  console.log("getAreas", arcs, areas, parseFloat(min), max, arcsLength, colors, value);
  return { colors, arcsLength, value };
};

Gauge.options = Object.freeze([
  {
    name: "pointerValue",
    verbose: "Indicator Value",
    required: true,
    fieldType: "dataSource",
  },
  { name: "min", verbose: "Minimum Value", fieldType: "input", defaultValue: 0 },
  { name: "unit", verbose: "Indicator Unit", fieldType: "input"},
  {
    name: "areas",
    verbose: "Indicator Areas",
    fieldType: "optionArray",
    options: [
      { name: "color", verbose: "Area Colour", fieldType: "input" },
      { name: "value", verbose: "Area Max Value", fieldType: "input" },
    ],
  },
]);

Gauge.optionsClass = new BuildingBlockOptions(Gauge.options);
