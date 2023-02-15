import BuildingBlockOptions from "Classes/BuildingBlockOptions";
import React, { Fragment, useRef } from "react";


import { useFormContainerContext } from "RenderStack/PageRenderer";

export default function FormContainer({id}) {
    console.log("useFormContainerContext()", useFormContainerContext())
    const {formData} = useFormContainerContext()
    const {Component, props} = formData?.[id] || {Component: undefined, props:undefined}
    console.log("Component, props", Component, props)
    if (Component) {
        return <Component {...props} />
    }

}

FormContainer.options = []
FormContainer.optionsClass = new BuildingBlockOptions(FormContainer.options);