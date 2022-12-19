import React, { Fragment, useEffect, useState, useRef } from 'react'
import * as Icon from 'react-bootstrap-icons';
import ReactModal from 'react-modal';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';

function getPropValues(options) {
    console.log("getPropValues", options)
    const defaultProps = {};
    for (let optionObject of options) {
        defaultProps[optionObject.label] = optionObject.default;
    };
    return (defaultProps);
}


function FloatField(props) {
    return (
        <div className="form-group mb-2">
            <label htmlFor={props.label}>{props.verbose}</label>
            <Field id={props.label} name={props.label} placeholder={props.default} className="form-control" />
        </div>
    )
}

function ChoiceField(props) {
    return (
        <div className="form-group mb-2">
            <label htmlFor={props.label}>{props.verbose}</label>
            <Field id={props.label} name={props.label} as="select" className="form-select">

                {props.choices.map((choice) =>
                    <option key={choice} value={choice}>{choice}</option>
                )}

            </Field>
        </div>

    )
}

function AutoField(props) {
    switch (props.option.type) {
        case ("float"): return (<FloatField label={props.option.label} verbose={props.option.verbose} default={props.option.default} />)
        case ("choice"): return (<ChoiceField label={props.option.label} verbose={props.option.verbose} choices={props.option.choices} />)
    }
}

const widthDict = {
    "xss": "col-2",
    "xs": "col-3",
    "s": "col-4",
    "m": "col-6",
    "l": "col-8",
    "xl": "col-9",
    "xxl": "col-12",
};

const heightDict = {
    "xxs": "card-sixth",
    "xs": "card-quarter",
    "s": "card-third",
    "m": "card-half",
    "l": "card-two-third",
    "xl": "card-full",
};

// Get modal showing above -> simple form with options -> use to set options state of card -> pass options as props
export function ConfigurableCard(props) {

    const [contentConfig, setContentConfig] = React.useState(props.content.options)
    const [modalIsOpen, setIsOpen] = React.useState(false);
    function openModal() { setIsOpen(true); };
    function closeModal() { setIsOpen(false); };

    return (

        <Fragment>

            <div className={"col " + widthDict[props.width]}>
                <div className={"card " + heightDict[props.height]} style={{ boxShadow: "-3px 3px 4px #EEE" }}>
                    <div className="card-header d-flex justify-content-between">
                        <span>{props.title ? props.title : "A Building Block"}</span>
                        <button onClick={openModal} className="btn btn-sm p-0"><Icon.Pencil /></button>
                    </div>

                    <div className="card-body">
                        <p>Props: {JSON.stringify(getPropValues(contentConfig))}</p>
                        {React.cloneElement(<props.content />, getPropValues(contentConfig))}
                    </div>

                    {props.footer && <div className="card-footer">{props.footer}</div>}
                </div>
            </div>


            <ReactModal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                parentSelector={() => document.getElementById('root')}
                className="container container-s my-5"

            >
                <div className="card align-self-center">
                    <div className="card-header">Modal Title</div>
                    <div className="card-body">
                        <p>Next Step - Get that automatic form working</p>
                        <p>Default Options:</p>
                        <p>{JSON.stringify(props.content.options)}</p>

                        <Formik
                            initialValues={getPropValues(contentConfig)}
                            onSubmit={(values) => {
                                closeModal();
                                setContentConfig((config) => {
                                    var newConfig = [];
                                    for (let configObject of config) {
                                        newConfig.push({ ...configObject, default: values[configObject.label] })
                                    }
                                    return newConfig
                                })
                            }}
                        >
                            <Form>
                                {contentConfig.map((option) => <AutoField key={option.label} option={option} />)}
                                <button type="submit" className="btn btn-primary my-3">Submit</button>
                                <button className="btn btn-danger mx-2" onClick={closeModal}>Cancel</button>
                            </Form>
                        </Formik>
                    </div>
                </div>

            </ReactModal>
        </Fragment>
    );
}