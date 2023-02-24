import BuildingBlockOptions from "Classes/BuildingBlockOptions";
import React, { Fragment, useEffect, useState } from "react";

function tryDate(date) {
  try {
    const d = new Date(date)
    return d.toLocaleString()
  } catch (error) {
    return date
  }
}


export default function Log({ logData }) {
  return (
    <Fragment>
      <table
        id="log"
        className="table table-sm my-0 middle-border"
        style={{ borderCollapse: "collapse", borderStyle: "hidden" }}
      >
        <tbody>

          {logData.log.map((datum) => {
            return (
              <tr key={datum.id} style={{ borderBottom: "0.5px solid #BBB" }}>
                {Object.entries(datum).map(([key, value]) => (
                  <td key={key}>{value}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </Fragment>
  );
}

Log.options = Object.freeze([
  { name: "logData", verbose: "Log Data", fieldType: "dataSource", required: true },
]);

Log.optionsClass = new BuildingBlockOptions(Log.options);
