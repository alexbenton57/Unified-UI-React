import useElementSize from "Hooks/useElementSize";
import React, { Fragment, useState, useCallback, useRef, createContext, useContext } from "react";
import { getFromLS, setToLS } from "Utils/localStorage";
import stringify from "Utils/stringify";
import GridLayout from "react-grid-layout";
import BuildingBlockWrapper from "RenderStack/BuildingBlockWrapper";
import { getInitialLayout } from "Configuration/LayoutConfigurator";

const formContainerContext = createContext();

export const useFormContainerContext = () => {
  const formContainer = useContext(formContainerContext);
  return formContainer;
};

// load from local storage and view a page config
export default function ConfigLoader() {
  const [pageConfig, setPageConfig] = useState();

  if (!pageConfig) {
    return <ConfigLoaderForm setPageConfig={setPageConfig} />;
  } else {
    return <PageRenderer pageConfig={pageConfig} />;
  }
}

export function PageRenderer({ pageConfig }) {
  console.log("render - Page grid layout");
  const layoutContainerRef = useRef();
  const { width, height } = useElementSize(layoutContainerRef);
  const layout = getInitialLayout(pageConfig) || {};
  const rows = 8;
  const [formData, setFormData] = useState({});

  return (
    <formContainerContext.Provider value={{ formData, setFormData }}>
      <div className="h-100 w-100" ref={layoutContainerRef}>
        <GridLayout
          className="p-0 h-100 layout"
          cols={12}
          layout={layout}
          width={width}
          height={height}
          margin={[10, 10]}
          rowHeight={(height - (rows + 1) * 10) / rows}
          maxRows={rows}
          isBounded={true}
          isDraggable={false}
          isResizable={false}
          isDroppable={false}
        >
          {Object.values(pageConfig).map((bbConfig) => (
            <div key={bbConfig.id}>
              <BuildingBlockWrapper config={bbConfig} />
            </div>
          ))}
        </GridLayout>
      </div>
      <div className="m-3">
        <h3>Page Config</h3>
        <pre>{stringify(pageConfig)}</pre>
      </div>
    </formContainerContext.Provider>
  );
}


function ConfigLoaderForm({ setPageConfig }) {
  const configKeys = getFromLS("all-config-keys");
  const loadFieldRef = useRef();
  const load = useCallback(
    (e) => {
      if (loadFieldRef.current.value !== "defaultOption") {
        setPageConfig(getFromLS(loadFieldRef.current.value));
      }
    },
    [setPageConfig]
  );
  return (
    <div className="row gy-3 px-3 my-3">
      <div className="input-group col-6">
        <select className="form-select" ref={loadFieldRef} defaultValue="defaultOption">
          <option value="defaultOption">...</option>
          {configKeys.map((key) => (
            <option value={key} key={key}>
              {key}
            </option>
          ))}
        </select>{" "}
        <button type="button btn-outline" className="btn btn-outline-primary" onClick={load}>
          Load
        </button>
      </div>
    </div>
  );
}

//
