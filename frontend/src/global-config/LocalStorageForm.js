import React, { Fragment, useState, useCallback } from "react";

import { getFromLS, setToLS } from "Utils/localStorage";
import { useRef } from "react";
import slugify from "Utils/slugify";


export default function LocalStorageForm({ globalConfig, setGlobalConfig }) {
    const ALLCONFIGKEYS = "all-config-keys";
    const [configKeys, setConfigKeys] = useState(
      getFromLS(ALLCONFIGKEYS) ? getFromLS(ALLCONFIGKEYS) : []
    );
    const saveFieldRef = useRef();
    const loadFieldRef = useRef();
    
    const save = useCallback(
      (e) => {
        const newKey = slugify(saveFieldRef.current.value);
        console.log("setToLS", newKey, globalConfig);
        setToLS(newKey, globalConfig);
  
        const newConfigKeys = [...configKeys, newKey].filter((value, index, self) => {
          // Only unique values
          return self.indexOf(value) === index;
        });
  
        setConfigKeys(newConfigKeys);
        setToLS(ALLCONFIGKEYS, newConfigKeys);
      },
      [setConfigKeys, globalConfig, saveFieldRef]
    );
  
    const load = useCallback(
      (e) => {
        if (loadFieldRef.current.value !== "defaultOption"){
        setGlobalConfig(getFromLS(loadFieldRef.current.value));
      }},
      [setGlobalConfig]
    );
  
    return (
      <Fragment>
        <div className="col-12">
          <div className="row p-3 g-3">
            <div className="col-md-6">
              <div className="input-group">
                <div className="input-group-text">Name</div>
                <input
                  ref={saveFieldRef}
                  type="text"
                  className="form-control"
                  placeholder="Configuration Name"
                />
                <button type="button" className="btn btn-primary" onClick={save}>
                  Save
                </button>
              </div>
            </div>
            <div className="col-md-6">
              <div className="input-group">
                <select className="form-select" ref={loadFieldRef} defaultValue="defaultOption">
                  <option value="defaultOption">...</option>
                  {configKeys.map((key) => (
                    <option value={key} key={key}>
                      {key}
                    </option>
                  ))}
                </select>{" "}
                <button type="button btn-outline" className="btn btn-outline-primary" onClick={load}>
                  Load
                </button>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }