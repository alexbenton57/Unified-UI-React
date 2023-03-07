import React, { Fragment, useState, useCallback, useRef } from "react";
import * as Icon from "react-bootstrap-icons";
import * as Yup from "yup";
import { Formik, Field, Form } from "formik";
import { v4 as uuid } from "uuid";
import BuildingBlockOptions from "Classes/BuildingBlockOptions";
const axios = require('axios').default;

function getInitialVals(items) {
  const vals = items.reduce((obj, item) => ({ ...obj, [item.id]: { ...item } }), {});
  console.log("Initial Vals", vals);
  return vals;
}

export default function Checklist({ checklist, baseurl }) {

  const [showCompleted, setShowCompleted] = useState(true);
  const [showDeleted, setShowDeleted] = useState(false);
  const [currentChecklist, setCurrentChecklist] = useState(() => getInitialVals(checklist.items));

  const filtered = Object.values(currentChecklist).filter((obj) => !obj.deleted || showDeleted);
  const notCompleted = filtered.filter((i) => !i.complete);
  const completed = showCompleted ? filtered.filter((i) => i.complete) : [];

  const addNewItem = useCallback(
    (text) => {
      const newId = uuid();
      const newItem = { id: newId, complete: false, deleted: false, text: text };
      setCurrentChecklist((prev) => ({ ...prev, [newId]: newItem }));
    },[setCurrentChecklist]
  );

  const updateList = useCallback(() => {

    axios.put(baseurl, Object.values(currentChecklist))
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  } )

  return (
    <Fragment>
      <div className="row px-3">
        <div className="col-12 mb-3 d-flex justify-content-between">
          <span>{checklist.name}</span>
          <span className="d-flex justify-content-start">
            <span role="button" onClick={updateList} className="mx-3">Post Items</span>
            <span
              className="form-check form-switch me-3"
              onClick={() => setShowCompleted((b) => !b)}
            >
              <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                id="toggleShowCompleted"
                defaultChecked={showCompleted}
              />
              <label className="form-check-label" htmlFor="toggleShowCompleted">
                Show Completed
              </label>
            </span>
            <span className="form-check form-switch" onClick={() => setShowDeleted((b) => !b)}>
              <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                id="toggleShowDeleted"
                defaultChecked={showDeleted}
              />
              <label className="form-check-label" htmlFor="toggleShowDeleted">
                Show Deleted
              </label>
            </span>
          </span>
        </div>

        <AddNewTaskItem addNewItem={addNewItem} />

        {notCompleted.map((item) => (
          <ChecklistItem key={item.id} setCurrentChecklist={setCurrentChecklist} {...item} />
        ))}

        {completed.length !== 0 && (
          <CompletedDropdown items={completed} setCurrentChecklist={setCurrentChecklist} />
        )}
      </div>
    </Fragment>
  );
}

function CompletedDropdown({ items, setCurrentChecklist }) {
  return (
    <Fragment>
      <div
        className="col-12 text-decoration-none"
        role="button"
        data-bs-toggle="collapse"
        href="#collapseCompleted"
      >
        Completed <strong>{items.length}</strong>
      </div>
      <div className="col-12 p-0 m-0">
        <div className="row">
          <div className="collapse" id="collapseCompleted">
            {items.map((item) => (
              <ChecklistItem key={item.id} setCurrentChecklist={setCurrentChecklist} {...item} />
            ))}
          </div>
        </div>
      </div>
    </Fragment>
  );
}

function AddNewTaskItem({ addNewItem }) {
  const [accepting, setAccepting] = useState(false);

  const schema = Yup.object().shape({
    task_text: Yup.string().required("Required"),
  });

  return (
    <div className="col-12 rounded border bg-light card-shadow my-2 p-1 px-2">
      <div className="d-flex align-items-center justify-content-start">
        <span role="button" className="py-2 px-2 mr-3 my-0 d-flex align-items-center" disabled>
          <Icon.Square />
        </span>

        <Formik
          initialValues={{ task_text: "" }}
          onSubmit={(values, { resetForm }) => {
            addNewItem(values.task_text);
            console.log(values);
            resetForm();
          }}
          validationSchema={schema}
        >
          <Form>
            <Field
              name="task_text"
              id="task_text"
              className="me-auto"
              placeholder="Add new task"
            />
          </Form>
        </Formik>
      </div>
    </div>
  );
}

function ChecklistItem({ id, text, complete, deleted, setCurrentChecklist }) {
  const buttonClass = "py-2 px-2 mr-3 my-0 d-flex align-items-center ";

  return (
    <div id={id} className="col-12 rounded border bg-light card-shadow my-2 p-1 px-2">
      <div className="d-flex align-items-center justify-content-between">
        <span
          role="button"
          className={buttonClass + (deleted ? "text-secondary disabled" : "text-primary")}
          onClick={() =>
            setCurrentChecklist((prev) => ({ ...prev, [id]: { ...prev[id], complete: !complete } }))
          }
        >
          {complete ? <Icon.CheckSquareFill /> : <Icon.Square />}
        </span>
        <span className={"me-auto " + (deleted ? " text-decoration-line-through": undefined)}> {text}</span>

        <div
          role="button"
          className={buttonClass + (!deleted ? "text-danger" : "text-success")}
          onClick={() =>
            setCurrentChecklist((prev) => ({ ...prev, [id]: { ...prev[id], deleted: !deleted } }))
          }
        >
          {!deleted ? <Icon.XLg /> : <Icon.ArrowClockwise />}
        </div>
      </div>
    </div>
  );
}

Checklist.options = [
  { name: "checklist", verbose: "Checklist Data", fieldType: "dataSource", required:true },
  {
    name: "baseurl",
    verbose: "Base URL",
    defaultValue: "http://localhost:8000/checklist/dev_todo/",
    fieldType: "input",
  },
];

Checklist.optionsClass = new BuildingBlockOptions(Checklist.options)