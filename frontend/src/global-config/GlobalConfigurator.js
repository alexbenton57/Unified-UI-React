import React, { Fragment, useState, useCallback } from "react";
import Accordion from "react-bootstrap/Accordion";

import BuildingBlockForm from "global-config/BuildingBlockForm";
import LayoutConfigurator from "./LayoutConfigurator";

import LineChartMultiInput from "BuildingBlocks/LineChartMultiInput";
import LineChartTwoInput from "BuildingBlocks/LineChartTwoInput";
import Checklist from "BuildingBlocks/Checklist";
import ProgressBar from "BuildingBlocks/ProgressBar";

import { v4 as uuid } from "uuid";
import { Formik, Field, Form } from "formik";
import stringify from "Utils/stringify";
import { FormLabel } from "Infrastructure/AutoField";
import { getFromLS, setToLS } from "Utils/localStorage";
import { useRef } from "react";
import slugify from "Utils/slugify";
import * as Icon from "react-bootstrap-icons";
import useLogOnChange from "Hooks/useLogOnChange";

const allBuildingBlocks = {
  "Progress Bar": ProgressBar,
  Checklist: Checklist,
  "Line Chart (2 Input)": LineChartTwoInput,
  "Line Chart (Multi Input)": LineChartMultiInput,
};

/* 
            <ol>
              <li>Add Support for loading and saving configs to local storage</li>
              <li>Hook up existing configs to initial values </li>
              <li>Get BB Preview working for layout config</li>
              <li>Get a page that can load and render configs</li>
            </ol>
*/

export default function GlobalConfigurator() {
  const [globalConfig, setGlobalConfig] = useState({});
  const [focussed, setFocussed] = useState("");

  useLogOnChange(focussed, "focussed");

  return (
    <Fragment>
      <div className="col-7">
        <div className="card card-two-third mb-3 ">
          <div className="card-header">Layout Preview</div>

          <div className="card-body">
            <LayoutConfigurator
              globalConfig={globalConfig}
              setGlobalConfig={setGlobalConfig}
              focussed={focussed}
              setFocussed={setFocussed}
            />
          </div>
        </div>
        <div className="card card-third">
          <div className="card-header">Global Configuration</div>
          <div className="card-body">
            <JSONPreview globalConfig={globalConfig} focussed={focussed} />
          </div>
        </div>
      </div>
      <div className="col-5">
        <div className="card card-full">
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
  return (
    <Fragment>
        <div>{"{"}</div>
      {Object.entries(globalConfig).map(([id, bbConfig]) => (
        <pre key={id} className={id === focussed ? "text-primary" :""}>
          {id}: {stringify(bbConfig)},
        </pre>
      ))}
      <div>{"}"}</div>
    </Fragment>
  );
}

function LocalStorageForm({ globalConfig, setGlobalConfig }) {
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
      setGlobalConfig(getFromLS(loadFieldRef.current.value));
    },
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
              <select className="form-select" ref={loadFieldRef}>
                <option selected>...</option>
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

const exampleGlobalConfig = {
  uuid: {
    ...{ configAsBefore: "" },
    id: "uuid",
    title: "bb",
    width: 4,
    height: 2,
  },
};

function BuildingBlockAccordion({ globalConfig, setGlobalConfig, focussed, setFocussed }) {
  const setBBConfig = useCallback(
    (newConf) => {
      setGlobalConfig((prev) => ({ ...prev, [newConf.id]: { ...prev[newConf.id], ...newConf } }));
    },
    [setGlobalConfig]
  );

  const removeBBConfig = useCallback(
    (id) => {
      const newConf = { ...globalConfig };
      delete newConf[id];
      console.log("removing", id, newConf);
      setGlobalConfig(newConf);
    },
    [setGlobalConfig, globalConfig]
  );

  const newBB = useCallback(() => {
    const bbID = uuid();
    setGlobalConfig((prev) => ({ ...prev, [bbID]: { id: bbID } }));
  }, [setGlobalConfig]);

  useLogOnChange(globalConfig, "globalConfig remove");

  return (
    <Accordion bsPrefix="accordion accordion-flush border-top" activeKey={focussed}>
      {Object.values(globalConfig).map((bbConfig) => (
        <AccordionElement
          key={bbConfig.id}
          bbID={bbConfig.id}
          setBBConfig={setBBConfig}
          bbConfig={bbConfig}
          removeBBConfig={removeBBConfig}
          setFocussed={setFocussed}
          focussed={focussed}
        />
      ))}

      <div className="accordion-item">
        <div className="accordion-header d-flex justify-content-end">
          <span className="text-primary my-1 px-3" role="button" onClick={newBB}>
            Add Building Block
          </span>
        </div>
      </div>
    </Accordion>
  );
}

function AccordionElement({ bbConfig, setBBConfig, removeBBConfig, bbID, setFocussed, focussed }) {
  console.log("render AccordionElement", bbConfig, setBBConfig, bbID);
  const [bbType, setBBType] = useState(
    bbConfig?.bbType in allBuildingBlocks ? bbConfig.bbType : null
  );

  const bbOptions = bbType && allBuildingBlocks[bbType].optionsClass.optionsList;

  const toggleFocussed = useCallback(() => {
    if (focussed === bbID) {
      setFocussed("");
    } else {
      setFocussed(bbID);
    }
  }, [focussed, setFocussed]);

  return (
    <Accordion.Item eventKey={bbConfig.id}>
      <Accordion.Button bsPrefix="accordion-button py-1">
        <div onClick={toggleFocussed} className="d-flex justify-content-start align-items-center">
          <div
            className="me-3 text-danger d-flex"
            role="button"
            onClick={() => removeBBConfig(bbID)}
          >
            <Icon.XLg className="align-self-center" />
          </div>
          {bbType ? (
            <div className="me-3 overflow-hidden text-nowrap">
              <span className="me-3">{bbType} </span>
              <span className="me-3">{bbConfig.title} </span>
              <span className="me-3 text-secondary pe-3">{bbConfig.id} </span>
            </div>
          ) : (
            <div className="me-auto pe-3 text-secondary">New Building Block</div>
          )}
        </div>
      </Accordion.Button>
      <Accordion.Body>
        {!bbType && <SetBBTypeForm setBBType={setBBType} />}
        {bbType && (
          <BuildingBlockForm
            bbID={bbID}
            bbType={bbType}
            options={bbOptions}
            setBBConfig={setBBConfig}
            existingConfig={bbConfig}
          />
        )}
      </Accordion.Body>
    </Accordion.Item>
  );
}

function SetBBTypeForm({ setBBType }) {
  return (
    <Formik
      initialValues={{ bbType: Object.keys(allBuildingBlocks)[0] }}
      onSubmit={(values) => {
        setBBType(values.bbType);
        console.log(values);
      }}
    >
      <Form className="col-12 d-flex justify-content-between">
        <div className="form-group mb-2 w-100 pe-3 mr-auto">
          <FormLabel htmlFor="bbType">Building Block Type</FormLabel>
          <Field id="bbType" name="bbType" as="select" className="form-select">
            {Object.keys(allBuildingBlocks).map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </Field>
        </div>
        <button type="submit" className="btn btn-primary mt-auto mb-2">
          Submit
        </button>
      </Form>
    </Formik>
  );
}
