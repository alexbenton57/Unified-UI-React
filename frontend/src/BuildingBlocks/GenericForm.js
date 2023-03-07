import BuildingBlockOptions from "Classes/BuildingBlockOptions";
import React, { useCallback, useEffect } from "react";
import { Formik, Form, Field, FieldArray } from "formik";
import AutoField from "Configuration/AutoField";
import getInitialValues from "Utils/getInitialValues";
import stringify from "Utils/stringify";


// a generic form wrapping up AutoField
// works either as a building block or can be triggered by a form button
// options configured in the exact same way as a BuildingBlockOptions object
export default function GenericForm({ options, handleSubmit = null }) {
  const initialValues = getInitialValues(options);
  handleSubmit = handleSubmit || ((values) => {alert(stringify(values))})
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

GenericForm.options = [
  { name: "formOptions", verbose: "Form Configuration", fieldType: "json" },
];
GenericForm.optionsClass = new BuildingBlockOptions(GenericForm.options);
GenericForm.displayStyle = "alone";
