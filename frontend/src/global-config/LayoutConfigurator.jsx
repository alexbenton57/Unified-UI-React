import React, { Fragment, useState, useCallback } from "react";
import GridLayout from "react-grid-layout";

import Accordion from "react-bootstrap/Accordion";
import ConfiguratorForm from "multivar/ConfiguratorForm";
import BuildingBlockForm from "global-config/BuildingBlockForm";

import LineChartMultiInput from "BuildingBlocks/LineChartMultiInput";
import LineChartTwoInput from "BuildingBlocks/LineChartTwoInput";
import Checklist from "BuildingBlocks/Checklist";
import ProgressBar from "BuildingBlocks/ProgressBar";

import { v4 as uuid } from "uuid";
import { Formik, Field, Form } from "formik";
import stringify from "Utils/stringify";
import { FormLabel } from "Infrastructure/AutoField";
import { getFromLS, setToLS } from "Utils/localStorage";
import { useRef } from "react";
import slugify from "Utils/slugify";
import * as Icon from "react-bootstrap-icons";
import useLogOnChange from "Hooks/useLogOnChange";
import { useEffect } from "react";

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

  const toggleFocussed = useCallback(() => {
    if (focussed === bbID) {
      setFocussed("");
    } else {
      setFocussed(bbID);
    }
  }, [focussed, setFocussed]);

  return (
    <GridLayout
      className="layout border overflow-auto"
      cols={12}
      width={800}
      layout={layout}
      rowHeight={800 / 12}
      maxRows={8}
      onLayoutChange={(layout) => saveLayout(layout)}
    >
      {Object.values(globalConfig).map((bbConfig) => (
        <div
          key={bbConfig.id}
          className={`border rounded overflow-hidden p-2 ${
            bbConfig.id === focussed ? "bg-light card-shadow" : ""
          }`}
          onClick={(e) => {
            console.log("onClick", e);
            if (focussed === bbConfig.id) {
              setFocussed("");
            } else {
              setFocussed(bbConfig.id);
            }
          }}
        >
          <p>{bbConfig.title}</p>
        </div>
      ))}
    </GridLayout>
  );
}
