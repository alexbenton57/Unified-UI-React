import React, { Fragment, useEffect, useState } from "react";
import BuildingBlockOptions from "Classes/BuildingBlockOptions";
import ProgressBar from "react-bootstrap/ProgressBar";

const exampleData = [{ id: "id", value: "value" }, ...["others"]];
const getNow = (t, bar) => {
  if (bar.value < t.value - t.width) {
    return 0;
  } else if (bar.value < t.value) {
    return t.value - bar.value;
  } else {
    return t.width;
  }
};
export default function ProgressBarArray({ data, min, thresholds, unit }) {
  const orderedThresholds = thresholds
    .map((t) => ({ ...t, value: parseFloat(t.value) }))
    .sort((a, b) => a.value > b.value)
    .map((t, i, tArr) => ({ ...t, width: i === 0 ? t.value - min : t.value - tArr[i - 1].value }));

  console.log("Ordered Thresholds", orderedThresholds);

  const getNow = (t, bar) => {
    if (bar.value <= t.value - t.width) {
      return 0;
    } else if (bar.value <= t.value) {
      return t.width - (t.value - bar.value);
    } else {
      return t.width;
    }
  };

  return (
    <table className="table">
      <thead>
        <th scope="col">Location</th>
        <th scope="col">Value</th>
        <th scope="col">Indicator</th>
      </thead>
      <tbody>
        {data.map((bar) => (
          <tr key={bar.id}>
            <td>{bar.id}</td>
            <td>
              {bar.value} {unit}
            </td>
            <td className="w-75">

              <ProgressBar>
                {orderedThresholds.map((t, i) => {
                  console.log("t,i", t, i);
                  return <ProgressBar variant={t.color} key={i} now={getNow(t, bar)} />;
                })}
              </ProgressBar>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

}

ProgressBarArray.options = Object.freeze([
  { name: "data", verbose: "Indicator Data", fieldType: "dataSource", required: true },
  { name: "min", verbose: "Minimum Value", fieldType: "input", defaultValue: 0 },
  { name: "unit", verbose: "Data Unit", fieldType: "input" },
  {
    name: "thresholds",
    verbose: "Thresholds",
    fieldType: "optionArray",
    options: [
      {
        name: "color",
        verbose: "Threshold Colour",
        defaultValue: "danger",
        fieldType: "choice",
        choices: ["danger", "success", "warning", "primary"],
      },
      { name: "value", verbose: "Threshold Max", fieldType: "input" },
    ],
  },
]);
//

ProgressBarArray.optionsClass = new BuildingBlockOptions(ProgressBarArray.options);
