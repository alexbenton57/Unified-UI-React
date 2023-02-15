import BuildingBlockOptions from "Classes/BuildingBlockOptions";
import React, { Fragment, useEffect, useState } from "react";

// 10 minutes to make Log BB
// 10 minutes to set up Django model

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
