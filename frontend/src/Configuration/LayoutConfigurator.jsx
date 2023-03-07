import React, { Fragment, useState, useCallback, useLayoutEffect } from "react";
import GridLayout from "react-grid-layout";

import { useRef } from "react";
import * as Icon from "react-bootstrap-icons";
import { useEffect } from "react";
import useElementSize from "Hooks/useElementSize";

export function getInitialLayout(config) {
  const defaultLayout = {};
  if (config) {
    console.log("getting layout", config);
    return Object.values(config).map((bbConfig) => {
      const gridLayout = bbConfig.gridLayout
        ? { ...bbConfig.gridLayout, i: bbConfig.id }
        : { i: bbConfig.id, x: 0, y: 0, w: 2, h: 2 };
      console.log("gridLayout", gridLayout);
      return gridLayout;
    });
  }
}

export default function LayoutConfigurator({
  globalConfig,
  setGlobalConfig,
  focussed,
  setFocussed,
}) {
  const [layout, setLayout] = useState(getInitialLayout(globalConfig));

  useEffect(() => {
    console.log("setting save layout with effect", globalConfig)
    setLayout(getInitialLayout(globalConfig));
  }, [globalConfig, setLayout]);

  const layoutContainerRef = useRef(null);

  const [rows, setRows] = useState(8);
  const { width, height } = useElementSize(layoutContainerRef);


  // there is a bug here that saveLayout is called unnecessarily
  // this causes the layout to reset to 1x1 tiles when a new config is loaded
  // all component renders and rerenders on loading a page config should be traced in detail to find the cause
  const saveLayout = useCallback(
    (newLayout) => {
      // a bodge to prevent some layout resets
      if (layout.length !== 0) {
        
      console.log("save layout", newLayout, layout)
      setGlobalConfig((prev) => {
        var newConf = {};
        newLayout.map((BB) => {
          // copy x, y, w, h from a BB layout object (omit id)
          const bbLayoutObj = (({ x, y, w, h }) => ({ x, y, w, h }))(BB);
          // change only the gridlayout property of the global BB config
          newConf[BB.i] = { ...prev[BB.i], gridLayout: { ...bbLayoutObj } };
        });
        return newConf;
      });
    }},
    [setGlobalConfig, layout]
  );

  // Ideally would only toggleFocussed() if grid item is clicked and not dragged/resized
  const toggleFocussed = useCallback(
    (bbID) => {
      if (focussed === bbID) {
        setFocussed("");
      } else {
        setFocussed(bbID);
      }
    },
    [focussed, setFocussed]
  );

  return (
    <Fragment>
      <div className="card-header d-flex justify-content-between">
        <span>Layout Preview</span>
        <span className="m-0">
          <span>Rows</span>
          <span className="ms-2">
            <Icon.DashLg role="button" onClick={() => setRows((p) => p - 1)} />
          </span>
          <span className="mx-2">{rows}</span>
          <span>
            <Icon.PlusLg role="button" onClick={() => setRows((p) => p + 1)} />
          </span>
        </span>
      </div>

      <div className="card-body">
        <div className="h-100 w-100" ref={layoutContainerRef}>
          <GridLayout
            className="p-0 h-100 layout overflow-hidden"
            cols={12}
            width={width}
            layout={layout}
            margin={[10, 10]}
            rowHeight={(height - (rows + 1) * 10) / rows}
            maxRows={rows}
            isBounded={true}
            onLayoutChange={(newLayout) => saveLayout(newLayout)}
          >
            {Object.values(globalConfig).map((bbConfig) => (
              <div
                key={bbConfig.id}
                className={`border rounded d-flex flex-column align-items-center justify-content-center overflow-hidden card-shadow p-2 ${
                  bbConfig.id === focussed ? "bg-secondary text-white" : "bg-light"
                }`}
                onClick={(e) => toggleFocussed(bbConfig.id)}
              >
                <h5 className="mb-1" >{bbConfig.title}</h5>
                <p className={bbConfig.id === focussed ? "text-light" : "text-secondary"}>{bbConfig.bbType}</p>
              </div>
            ))}
          </GridLayout>
        </div>
      </div>
    </Fragment>
  );
}
