import React, { useCallback, useEffect } from "react";
import { Formik, Form, Field, FieldArray } from "formik";

import AutoField from "Configuration/AutoField";

import getInitialValues from "Utils/getInitialValues";

export default function GenericForm({ options, handleSubmit }) {
  const initialValues = getInitialValues(options);

  console.log("Generic Form Options", initialValues?.title, options, initialValues);

  return (
    <Formik initialValues={initialValues} onSubmit={(values) => handleSubmit(values)}>
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

/*

        */
