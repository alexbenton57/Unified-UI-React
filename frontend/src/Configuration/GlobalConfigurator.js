import React, { Fragment, useState, useCallback, useEffect } from "react";

import stringify from "Utils/stringify";

import LayoutConfigurator from "Configuration/LayoutConfigurator";
import LocalStorageForm from "Configuration/LocalStorageForm";
import BuildingBlockAccordion from "./BuildingBlockAccordion";




export default function GlobalConfigurator() {
  // Top level component for page config configuration
  const [globalConfig, setGlobalConfig] = useState({});
  const [focussed, setFocussed] = useState("");

  return (
    <Fragment>
      <div className="col-7">
        <div className="card card-two-third mb-3 card-shadow">

            <LayoutConfigurator
              globalConfig={globalConfig}
              setGlobalConfig={setGlobalConfig}
              focussed={focussed}
              setFocussed={setFocussed}
            />

        </div>
        <div className="card card-third card-shadow">
          <div className="card-header">Global Configuration</div>
          <div className="card-body" style={{overflowY: "scroll"}}>
            <JSONPreview globalConfig={globalConfig} focussed={focussed} />
          </div>
        </div>
      </div>
      <div className="col-5">
        <div className="card card-full card-shadow">
          <div className="card-header">Configurator Form</div>
          <div className="card-body p-0">
            <LocalStorageForm globalConfig={globalConfig} setGlobalConfig={setGlobalConfig} />
            <BuildingBlockAccordion
              globalConfig={globalConfig}
              setGlobalConfig={setGlobalConfig}
              focussed={focussed}
              setFocussed={setFocussed}
            />
          </div>
        </div>
      </div>
    </Fragment>
  );
}

function JSONPreview({ globalConfig, focussed }) {

    /*
  useEffect(() => {
    const element = document.getElementById("preview-" + focussed)
    element?.scrollIntoView()
  , [focussed]})
    */
  return (
    <Fragment>
        <div>{"{"}</div>
      {Object.entries(globalConfig).map(([id, bbConfig]) => (
        <pre key={id} id={"preview-" + id} className={id === focussed ? "text-primary" :""}>
          {id}: {stringify(bbConfig)},
        </pre>
      ))}
      <div>{"}"}</div>
    </Fragment>
  );
}