import BuildingBlockOptions from "Classes/BuildingBlockOptions";
import React, { Fragment, useRef } from "react";

import GenericForm from "Infrastructure/GenericForm";
import stringify from "Utils/stringify";
import { useFormContainerContext } from "RenderStack/PageRenderer";

const formOptionsDemo = [

  {
    "name": "barcode",
    "verbose": "Barcode",
    "fieldType": "input"
  },
  {
    "name": "name",
    "verbose": "Item Name",
    "fieldType": "input"
  },
  {
    "name": "description",
    "verbose": "Item Description",
    "fieldType": "input"
  },
  {
    "name": "qty",
    "verbose": "Number of Cuts",
    "fieldType": "integer"
  },
  {
    "name": "unit",
    "verbose": "Units",
    "fieldType": "choice",
    "defaultValue": "parts",
    "diplayedAs": "pills",
    "choices": ["parts", "metres", "kg"]
  }
];

export default function FormButton({ formAs, containerTarget, formOptions, buttonText, buttonColor }) {
  const { setFormData } = useFormContainerContext();
  const formData = {
    Component: GenericForm,
    props: { options: formOptions, handleSubmit: values => alert(stringify(values))} ,
  };

  return (
    <div
      role="button"
      className={`h-100 w-100 d-flex align-items-center justify-content-center btn btn-${buttonColor || "primary"}`}
      onClick={() => setFormData((prev) => ({ ...prev, [containerTarget]: formData }))}
    >
      <h4 >{buttonText}</h4>
    </div>
  );
}

FormButton.options = [
  {
    name: "formAs",
    verbose: "Display Form In",
    defaultValue: "Modal",
    fieldType: "choice",
    displayedAs: "pills",
    choices: ["Form Container", "Modal"],
  },
  { name: "buttonText", verbose: "Button Text", fieldType: "input" },
  {
    name: "buttonColor",
    verbose: "Button Colour",
    defaultValue: "primary",
    fieldType: "choice",
    choices: ["primary", "secondary", "success", "warning", "danger"],
  },
  { name: "containerTarget", verbose: "Form Container ID", fieldType: "input" },
  { name: "formOptions", verbose: "Form Configuration", fieldType: "json" },
];
FormButton.optionsClass = new BuildingBlockOptions(FormButton.options);
FormButton.displayStyle = "alone";
