import React, { useEffect } from "react";
import { Formik, Form } from "formik";
import AutoField from "Configuration/AutoField";
import getInitialValues from "Utils/getInitialValues";

export default function BuildingBlockForm({ bbID, bbType, options, setBBConfig, existingConfig }) {
  const initialValues = getInitialValues(options, existingConfig);
  initialValues.id = bbID;
  initialValues.bbType = bbType;

  console.log("Building Block Options", initialValues.title, options, initialValues);

  return (
    <Formik initialValues={initialValues} onSubmit={(values) => setBBConfig(values)}>
      <Form className="row gy-2">
        {options.map((option) => (
          <AutoField key={option.name} option={option} />
        ))}
        <div className="col-12">
          <button type="submit" className="btn btn-primary my-3">
            Submit
          </button>
        </div>
      </Form>
    </Formik>
  );
}

