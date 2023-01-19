import React, { Fragment, Suspense, useEffect, useState, useMemo } from "react";
import axios from "axios";
import LoadingSpinner from "BBDemos/Spinner";
import useMultiMessenger from "Hooks/useMultiMessenger";
import useMessenger from "Hooks/useMessenger";
import useLogOnChange from "Hooks/useLogOnChange";
import AutoFieldMulti, { sources } from "./AutoFieldMulti";
import DataSource from "Infrastructure/DataSource";
import { options } from "BBDemos/Chartjs";
import { SEPARATOR } from "Infrastructure/AutoField";

// props = {child: BBFunc, config:{configObj from ConfigurableCard}}
// Purpose is to create promises for HTTP data

// https://www.developerway.com/posts/react-re-renders-guide
// https://www.developerway.com/posts/how-to-write-performant-react-code

export default function BuildingBlockWrapperMulti({ content, config }) {
  return (

      <Suspense fallback={<LoadingSpinner />}>
        <DataFetcher Content={content} config={config} />
      </Suspense>

  );
}

function DataFetcher({ config, Content }) {
  const wsConfig = useMemo(() => makeInitialWsConfig(config), [config]);
  const wsData = useMultiMessenger(wsConfig);
  const contentProps = getContentProps(config, wsData, wsConfig);

  return <Content {...contentProps} />;
}

function makeInitialWsConfig(config) {
  const wsConfig = {};

  config.map((option) => {
    if (option.multiple) {
      option.formValues.map((valueObj) => {
        Object.entries(valueObj).map(([_, value]) => {
          if (value instanceof DataSource) {
            if (value.type === sources.WS) {
              wsConfig[value.label] = { tag: value.link, value: value.initial };
            }
          }
        });
      });
    } else if (option.dataSource) {
      if (option.source.type === sources.WS) {
        wsConfig[option.label] = { tag: option.source.link, value: option.initial };
      }
    }
  });

  return wsConfig;
}

const getContentProps = (contentConfig, wsData, wsConfig) => {
  function getWsVal(label) {
    return wsData[label] ? wsData[label].value : wsConfig[label].value;
  }

  function sourceToValue(source) {
    switch (source.type) {
      case sources.HTTP:
        return source.axiosPromise.read();
      case sources.WS:
        return getWsVal(source.label);
      case sources.CONSTANT:
        return source.link;
    }
  }

  const newProps = {};

  contentConfig.map((option) => {
    if (option.multiple) {

      const propObjList = []
      option.formValues.forEach((valueObj, index) => {
        const innerPropObj = { key: option.label + SEPARATOR + String(index) };

        Object.entries(valueObj).map(([label, value]) => {

          if (value instanceof DataSource) {
            innerPropObj[label] = sourceToValue(value);
          } else if (value) {
            innerPropObj[label] = value;
          } else {
            const defaultVal =
              (option.options.find((obj) => obj.label === label) || {}).initial || "None Found";
            innerPropObj[label] = defaultVal;
          }
        });

        propObjList.push(innerPropObj);
      });
      newProps[option.label] = propObjList;
      
    } else if (option.dataSource) {
      newProps[option.label] = sourceToValue(option.source);
    } else if (option.value) {
      newProps[option.label] = option.value;
    } else {
      newProps[option.label] = option.initial;
    }

  });

  return newProps;
};
