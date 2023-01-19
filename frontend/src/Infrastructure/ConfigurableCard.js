import React, { Fragment, useState } from "react";
import * as Icon from "react-bootstrap-icons";
import ReactModal from "react-modal";
import { Formik, Field, Form } from "formik";
import Card from "./Card";
import AutoField from "./AutoField";

function getPropValues(options) {
  const defaultProps = {};

  for (let optionObject of options) {
    defaultProps[optionObject.label] = optionObject.initial;
  }

  return defaultProps;
}

export default function ConfigurableCard(props) {
  const [contentConfig, setContentConfig] = React.useState(props.content.options);

  const [modalIsOpen, setIsOpen] = React.useState(false);
  function openModal() {
    setIsOpen(true);
  }
  function closeModal() {
    setIsOpen(false);
  }

  return (
    <Fragment>
      <Card
        width={props.width}
        height={props.height}
        title={props.title}
        footer={props.footer}
        header={
          <div className="card-header d-flex justify-content-between">
            <span>{props.title ? props.title : "A Building Block"}</span>
            <button onClick={openModal} className="btn btn-sm p-0">
              <Icon.Pencil />
            </button>
          </div>
        }
      >
        <p>Props: {JSON.stringify(getPropValues(contentConfig))}</p>
        {React.cloneElement(<props.content />, getPropValues(contentConfig))}
      </Card>

      <ConfigModal
        isOpen={modalIsOpen}
        closeModal={closeModal}
        defaultOptions={props.content.options}
        initialValues={{ ...getPropValues(contentConfig) }}
        config={contentConfig}
        setConfig={setContentConfig}
      />
    </Fragment>
  );
}

function ConfigModal(props) {
  return (
    <ReactModal
      isOpen={props.isOpen}
      onRequestClose={props.closeModal}
      parentSelector={() => document.getElementById("root")}
      className="container container-s my-5"
    >
      <div className="card align-self-center">
        <div className="card-header">Modal Title</div>
        <div className="card-body">
          <p>Default Options:</p>
          <p>{JSON.stringify(props.defaultOptions)}</p>

          <Formik
            initialValues={props.initialValues}
            onSubmit={(values) => {
              props.closeModal();
              console.log(values);
              props.setConfig((prev) => {
                var newConfig = [];
                for (let configObject of prev) {
                  newConfig.push({ ...configObject, initial: values[configObject.label] });
                }
                return newConfig;
              });
            }}
          >
            <Form>
              {props.config.map((option) => (
                <AutoField key={option.label} option={option} />
              ))}
              <button type="submit" className="btn btn-primary my-3">
                Submit
              </button>
              <button type="button" className="btn btn-danger mx-2" onClick={props.closeModal}>
                Cancel
              </button>
            </Form>
          </Formik>
        </div>
      </div>
    </ReactModal>
  );
}
