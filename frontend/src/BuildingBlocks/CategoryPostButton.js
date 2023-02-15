import BuildingBlockOptions from "Classes/BuildingBlockOptions";
import React, { Fragment, useRef } from "react";
import slugify from "Utils/slugify";
import ReactModal from "react-modal";
import stringify from "Utils/stringify";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

import { useMessengerContext } from "Infrastructure/websocket";

const axios = require("axios").default;
// 10 minutes to make Log BB
// 10 minutes to set up Django model

export default function CategoryPostButton({ postURL, categories, bbsToRefresh }) {
  const [modalIsOpen, setIsOpen] = React.useState(false);

  function openModal() {
    setIsOpen(true);
  }
  function closeModal() {
    setIsOpen(false);
  }

  const messenger = useMessengerContext();
  const post = (text) => {
    axios
      .put(postURL, { status: false, machine: "machine1", text })
      .then(function (response) {
        console.log("Stop Machine", response);
      })
      .catch(function (error) {
        console.log("Stop Machine Error", error);
      })
      .finally(() => {
        if (bbsToRefresh?.length > 0) {
          console.log("Refreshing");
          bbsToRefresh.forEach((bb) => messenger.emit(`refresh-${bb.bbID}`));
        }
      });

    closeModal();
  };

  
  return (
    <Fragment>
      <div
        role="button"
        className="h-100 w-100 d-flex align-items-center justify-content-center bg-danger text-white"
        onClick={setIsOpen}
      >
        <h3 className="text-decoration-underline">Stop Machine</h3>
      </div>
      <CategoryFormModal {...{ categories, post, modalIsOpen: modalIsOpen, closeModal }} />
    </Fragment>
  );
}

function CategoryFormModal({ categories, post, modalIsOpen, closeModal }) {
  return (
    <ReactModal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      parentSelector={() => document.getElementById("modalWindow")}
      className="container container-s my-5"
    >
      <div className="card align-self-center">
        <div className="card-header">Select Category</div>
        <div className="card-body px-0">
          <Tabs
            defaultActiveKey={slugify(categories[0].categoryName)}
            id="uncontrolled-tab-example"
            className="mb-3 px-3"
          >
            {categories.map((category, i) => (
              <Tab
                className="mx-3"
                eventKey={slugify(category.categoryName)}
                title={category.categoryName}
              >
                <div className="row gy-3">
                  {category.categoryEntries.map((entry) => (
                    <div className="col-6">
                      <div
                        className="btn btn-primary w-100"
                        role="button"
                        onClick={() => post(`${category.categoryName}: ${entry.categoryEntry}`)}
                      >
                        <h5>{entry.categoryEntry}</h5>
                      </div>
                    </div>
                  ))}
                  {category.otherEnabled && <OtherField {...{ category, post }} />}
                  <div className="col-6"></div>
                </div>

                <pre>{stringify(category)}</pre>
              </Tab>
            ))}
          </Tabs>
        </div>
      </div>
    </ReactModal>
  );
}

function OtherField({ category, post }) {
  const fieldRef = useRef();

  return (
    <div className="col-6">
      <div className="input-group">
        <input ref={fieldRef} type="text" className="form-control" placeholder="Other" />
        <button
          className="btn btn-primary d-flex align-items-center"
          type="button"
          onClick={() => post(`${category.categoryName}: ${fieldRef.current.value}`)}
        >
          <h5>Submit</h5>
        </button>
      </div>
    </div>
  );
}

CategoryPostButton.options = Object.freeze([
  { name: "postURL", verbose: "REST Endpoint URL", fieldType: "input", required: true },
  {
    name: "bbsToRefresh",
    verbose: "Building Blocks to Refresh on Submit",
    fieldType: "optionArray",
    required: true,
    options: [{ name: "bbID", verbose: "Building Block ID", fieldType: "input" }],
  },
  {
    name: "categories",
    verbose: "Text Categories",
    fieldType: "optionArray",
    required: true,
    options: [
      { name: "categoryName", verbose: "Category Name", fieldType: "input", required: true },
      {
        name: "otherEnabled",
        verbose: "Enable 'other' field",
        fieldType: "boolean",
        defaultValue: false,
      },

      {
        name: "categoryEntries",
        verbose: "Entries",
        fieldType: "optionArray",
        required: true,
        options: [{ name: "categoryEntry", verbose: "Entry", fieldType: "input" }],
      },
    ],
  },
]);

CategoryPostButton.optionsClass = new BuildingBlockOptions(CategoryPostButton.options);
CategoryPostButton.displayStyle = "alone";
