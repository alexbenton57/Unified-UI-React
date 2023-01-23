import React, { Fragment, useState } from "react";


import AutoFieldMulti, {
  SEPARATOR,
} from "./AutoFieldMulti";


function FormLabel({htmlFor, children}) {
    return (
      <label className="px-2" htmlFor={htmlFor}>{children}</label>
    )
  }
  
  
export default function AccordionMultiField({ option, multiValues, setMultiValues }) {
    const n = multiValues[option.label]; // Number of items in list
    const range = [...Array(n).keys()];
    const [activeIndex, setActiveIndex] = useState(0);
    
    const remove = () => {
      console.log("setMultivalues", n);
      setActiveIndex(n > 0 ? n - 2 : n - 1); // Index of active item
      setMultiValues((obj) => ({ ...obj, [option.label]: n > 0 ? n - 1 : n }));
    };
    const add = () => {
      setActiveIndex(n); // Index of active item
      setMultiValues((obj) => ({ ...obj, [option.label]: n + 1 }));
    };
  
    return (
      <Fragment>

        
        <div className="col-12 accordion" id={"accordion_" + option.label}>
  
        <FormLabel htmlFor={"accordion_" + option.label}>{option.verbose}</FormLabel>
          {range.map((i) => {
            const id = option.label + "_" + String(i);
            return (
              <div className="accordion-item" key={id}>
                <div className="accordion-header" id={"header_" + id}>
                  <button
                    className={
                      "accordion-button btn-sm py-1" + (i !== activeIndex ? " collapsed" : "")
                    }
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={"#collapse_" + id}
                    aria-expanded="true"
                    aria-controls="collapseOne"
                  >
                    {option.verbose} #{String(i)}
                  </button>
                  <div
                    id={"collapse_" + id}
                    className={"accordion-collapse collapse" + (i === activeIndex ? " show" : "")}
                    aria-labelledby={"header_" + id}
                    data-bs-parent={"#accordion_" + option.label}
                  >
                    <div className="accordion-body">
                      <InnerMultiField option={option} i={i} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
  
          <div className="accordion-item">
            <div className="accordion-header d-flex justify-content-end">
              <span className="text-danger my-1 px-3" role="button" onClick={remove}>
                Remove last {option.verbose}
              </span>
              <span className="text-primary my-1 px-3" role="button" onClick={add}>
                Add {option.verbose}
              </span>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
  
  function InnerMultiField({ option, i }) {
    function getLabel(inneroption) {
      return option.label + SEPARATOR + String(i) + SEPARATOR + inneroption.label;
    }
  
    return (
      <Fragment>
        {option.options.map((inneroption) => (
          <AutoFieldMulti
            key={getLabel(inneroption)}
            option={{ ...inneroption, label: getLabel(inneroption) }}
          />
        ))}
      </Fragment>
    );
  }