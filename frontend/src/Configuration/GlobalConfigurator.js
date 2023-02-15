import React, { Fragment, useState, useCallback, useEffect } from "react";
import Accordion from "react-bootstrap/Accordion";

import BuildingBlockForm from "Configuration/BuildingBlockForm";
import LayoutConfigurator from "Configuration/LayoutConfigurator";
import LocalStorageForm from "Configuration/LocalStorageForm";


import { v4 as uuid } from "uuid";
import { Formik, Field, Form } from "formik";
import stringify from "Utils/stringify";
import { FormLabel } from "Old/AutoField";

import * as Icon from "react-bootstrap-icons";
import useLogOnChange from "Hooks/useLogOnChange";

import ALL_BUILDING_BLOCKS from "BuildingBlocks/ALL_BUILDING_BLOCKS";


export default function GlobalConfigurator() {
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

function BuildingBlockAccordion({ globalConfig, setGlobalConfig, focussed, setFocussed }) {
  const setBBConfig = useCallback(
    (newConf) => {
      console.log("BB Accordion setting config", newConf);
      setGlobalConfig((prev) => ({ ...prev, [newConf.id]: { ...prev[newConf.id], ...newConf } }));
    },
    [setGlobalConfig]
  );

  const removeBBConfig = useCallback(
    (id) => {
      const newConf = { ...globalConfig };
      delete newConf[id];
      console.log("BB accordion removing BB", id, newConf);
      setGlobalConfig(newConf);
    },
    [setGlobalConfig, globalConfig]
  );

  const newBB = useCallback(() => {
    const bbID = uuid();
    console.log("BB accordion adding BB", bbID)
    setGlobalConfig((prev) => ({ ...prev, [bbID]: { id: bbID } }));
    setFocussed(bbID)
  }, [setGlobalConfig, setFocussed]);

  useLogOnChange(globalConfig, "globalConfig remove");

  return (
    <Accordion bsPrefix="accordion accordion-flush border-top" activeKey={focussed}>
      {Object.values(globalConfig).map((bbConfig) => (
        <BuildingBlockAccordionElement
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

function BuildingBlockAccordionElement({ bbConfig, setBBConfig, removeBBConfig, bbID, setFocussed, focussed }) {
  console.log("render AccordionElement", bbConfig, setBBConfig, bbID);
  const [bbType, setBBType] = useState(
    bbConfig?.bbType in ALL_BUILDING_BLOCKS ? bbConfig.bbType : null
  );

  const bbOptions = bbType && ALL_BUILDING_BLOCKS[bbType].optionsClass.optionsList;

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
      initialValues={{ bbType: Object.keys(ALL_BUILDING_BLOCKS)[0] }}
      onSubmit={(values) => {
        setBBType(values.bbType);
        console.log(values);
      }}
    >
      <Form className="col-12 d-flex justify-content-between">
        <div className="form-group mb-2 w-100 pe-3 mr-auto">
          <FormLabel htmlFor="bbType">Building Block Type</FormLabel>
          <Field id="bbType" name="bbType" as="select" className="form-select">
            {Object.keys(ALL_BUILDING_BLOCKS).map((key) => (
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
