import React, { Fragment, useState, useCallback, useLayoutEffect } from "react";
import GridLayout from "react-grid-layout";

import { useRef } from "react";
import * as Icon from "react-bootstrap-icons";
import { useEffect } from "react";
import useElementSize from "Hooks/useElementSize";

function getInitialLayout(config) {
  const defaultLayout = {};
  return Object.values(config).map((bbConfig) =>
    bbConfig.gridLayout
      ? { ...bbConfig.gridLayout, i: bbConfig.id }
      : { i: bbConfig.id, x: 0, y: 0, w: 2, h: 2 }
  );
}



export default function LayoutConfigurator({
  globalConfig,
  setGlobalConfig,
  focussed,
  setFocussed,
}) {
  const [layout, setLayout] = useState(getInitialLayout(globalConfig));

  useEffect(() => {
    setLayout(getInitialLayout(globalConfig));
  }, [globalConfig, setLayout]);

  const layoutContainerRef = useRef(null);

  const [rows, setRows] = useState(8);
  const {width, height} = useElementSize(layoutContainerRef)



  const saveLayout = useCallback((layout) => {
    setGlobalConfig((prev) => {
      var newConf = {};
      layout.map((BB) => {
        const bbLayoutObj = (({ x, y, w, h }) => ({ x, y, w, h }))(BB);

        newConf[BB.i] = { ...prev[BB.i], gridLayout: { ...bbLayoutObj } };
      });
      return newConf;
    });
  });

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
            onLayoutChange={(layout) => saveLayout(layout)}
          >
            {Object.values(globalConfig).map((bbConfig) => (
              <div
                key={bbConfig.id}
                className={`border rounded overflow-hidden p-2 ${
                  bbConfig.id === focussed ? "bg-light card-shadow" : ""
                }`}
                onClick={(e) => toggleFocussed(bbConfig.id)}
              >
                <p>{bbConfig.title}</p>
              </div>
            ))}
          </GridLayout>
        </div>
      </div>
    </Fragment>
  );
}
