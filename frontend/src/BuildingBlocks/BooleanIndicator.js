import BuildingBlockOptions from "Classes/BuildingBlockOptions";
import React, { Fragment, useEffect, useState } from "react";
import stringify from "Utils/stringify";

// 10 minutes to make Log BB
// 10 minutes to set up Django model

export default function BooleanIndicator({ indicatorValue, indicatorText }) {
    const className = indicatorValue.status ? "bg-success text-white" : "bg-danger text-white"

  return (
    <Fragment>
        <div className={"h-100 w-100 d-flex align-items-center justify-content-center "+ className}>
            <h3 >{indicatorText}</h3>
        </div>
    </Fragment>
  );
}

BooleanIndicator.options = Object.freeze([
  { name: "indicatorValue", verbose: "Indicator Value", fieldType: "dataSource", required: true },
  { name: "indicatorText", verbose: "Indicator Text", fieldType: "input", required: true },  
]);

BooleanIndicator.optionsClass = new BuildingBlockOptions(BooleanIndicator.options);
BooleanIndicator.displayStyle = "headerless"
