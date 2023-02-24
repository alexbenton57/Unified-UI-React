import React, { Fragment, useState, useCallback, useEffect } from "react";
import Accordion from "react-bootstrap/Accordion";

import BuildingBlockForm from "Configuration/BuildingBlockForm";



import { v4 as uuid } from "uuid";
import { Formik, Field, Form } from "formik";
import { FormLabel } from "Configuration/AutoField";

import * as Icon from "react-bootstrap-icons";
import useLogOnChange from "Hooks/useLogOnChange";

import ALL_BUILDING_BLOCKS from "BuildingBlocks/ALL_BUILDING_BLOCKS";



export default function BuildingBlockAccordion({ globalConfig, setGlobalConfig, focussed, setFocussed }) {

    const newBB = useCallback(() => {
        const bbID = uuid();
        console.log("BB accordion adding BB", bbID)
        setGlobalConfig((prev) => ({ ...prev, [bbID]: { id: bbID } }));
        setFocussed(bbID)
      }, [setGlobalConfig, setFocussed]);
  
    return (
      <Accordion bsPrefix="accordion accordion-flush border-top" activeKey={focussed}>
        {Object.values(globalConfig).map((bbConfig) => (
          <BuildingBlockAccordionItem
            key={bbConfig.id}
            bbID={bbConfig.id}
            setGlobalConfig={setGlobalConfig}
            bbConfig={bbConfig}
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
  
  function BuildingBlockAccordionItem({ bbConfig, setGlobalConfig, bbID, setFocussed, focussed }) {

    const [bbType, setBBType] = useState(
      bbConfig?.bbType in ALL_BUILDING_BLOCKS ? bbConfig.bbType : null
    );
  
    const bbOptions = bbType && ALL_BUILDING_BLOCKS[bbType].optionsClass.optionsList;

    const setBBConfig = useCallback(
        (newConf) => {
          console.log("BB Accordion setting config", newConf);
          setGlobalConfig((prev) => ({ ...prev, [newConf.id]: { ...prev[newConf.id], ...newConf } }));
        },
        [setGlobalConfig]
      );
    
      const removeBBConfig = useCallback(
        (id) => {
          setGlobalConfig(prev => {
              const newConfig = { ...prev };
              delete newConfig[id]; 
              return newConfig
          })
        },
        [setGlobalConfig]
      );
      
    const toggleFocussed = useCallback(() => {
      if (focussed === bbID) {
        setFocussed("");
      } else {
        setFocussed(bbID);
      }
    }, [focussed, setFocussed]);

    const duplicateBB = useCallback(() => {
        const newID = uuid()

        setGlobalConfig(prev => ({...prev, [newID]: {...bbConfig, id:newID,  }}))
        
    }, [setGlobalConfig,bbConfig])
  
    return (
      <Accordion.Item eventKey={bbConfig.id}>
        <Accordion.Button bsPrefix="accordion-button py-1">
          <div onClick={toggleFocussed} className="d-flex justify-content-start align-items-center overflow-hidden">
            <span
              className="me-3 text-danger"
              role="button"
              onClick={() => removeBBConfig(bbID)}
            >
              <Icon.XLg className="align-self-center" />
            </span>
            <span
              className="me-3 "
              role="button"
              onClick={() => duplicateBB()}
            >
              <Icon.Clipboard className="align-self-center" />
            </span>
            {bbType ? (
              <span className="me-3 overflow-hidden text-nowrap">
                <span className="me-3 fst-italic">{bbType} </span>                <span className="me-3">{bbConfig.title} </span>


                <span className="me-3 text-secondary pe-3">{bbConfig.id} </span>
              </span>
            ) : (
              <span className="me-auto pe-3 text-secondary">New Building Block</span>
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
  