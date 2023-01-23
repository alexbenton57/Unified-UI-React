import React, { Fragment, Suspense, useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import LoadingSpinner from "BBDemos/Spinner";
import useMultiMessenger from "Hooks/useMultiMessenger";
import useMessenger from "Hooks/useMessenger";
import useLogOnChange from "Hooks/useLogOnChange";
import AutoFieldMulti, { sources } from "./AutoFieldMulti";
import DataSource from "Classes/DataSource";
import { options } from "BBDemos/Chartjs";
import { SEPARATOR } from "Infrastructure/AutoField";

// props = {child: BBFunc, config:{configObj from ConfigurableCard}}
// Purpose is to create promises for HTTP data

// https://www.developerway.com/posts/react-re-renders-guide
// https://www.developerway.com/posts/how-to-write-performant-react-code

export default function BuildingBlockWrapperMulti({ content, config }) {
  const [currentConfig, setCurrentConfig] = useState(config);
  console.log("Render - BB Wrapper Multi", config);

  useEffect(() => {
    setCurrentConfig(config)
  }, [setCurrentConfig, config])

  const refresh = useCallback(() => {

    setCurrentConfig((prev) => {
      let newConf = [...prev];
      newConf.forEach((option) => {
        if (option.multiple) {
          option.formValues.forEach((valueObj) => {

            Object.entries(valueObj).forEach(([_, value]) => {
              try {
                value.refresh();
              } catch (err) {}
            });
          });
        } else {
          try {
            option.source.refresh();
          } catch (err) {}
        }
      });

      return newConf
    });
  }, [setCurrentConfig]);





  return (

    <Fragment>
      <p role="button" className="text-primary" onClick={() => refresh()}>
        Refresh Data
      </p>
        <Suspense fallback={<LoadingSpinner />}>
        <DataFetcher Content={content} config={currentConfig} />
      </Suspense>    
    </Fragment> 


  );
}

function DataFetcher({ config, Content }) {
  console.log("render - DataFetcher", config);
  const wsConfig = useMemo(() => makeInitialWsConfig(config), [config]);
  const wsData = useMultiMessenger(wsConfig);
  const contentProps = getContentProps(config, wsData, wsConfig);
  console.log("New Props from dataFetcher:", contentProps, "From config:", config);
  return <Content {...contentProps} />;
}

function getAllDataSources(config, type = null) {
  var dataSources = [];
  dataSources.pushSource = (value) => {
    if (value instanceof DataSource) {
      console.log("Datasource", value);
      if (type) {
        if (value.type === type) {
          dataSources.push(value);
          console.log("Adding source");
        }
      } else {
        dataSources.push(value);
        console.log("Adding source");
      }
    }
  };

  config.map((option) => {
    if (option.multiple) {
      option.formValues.map((valueObj) => {
        Object.entries(valueObj).map(([_, value]) => {
          dataSources.pushSource(value);
        });
      });
    } else {
      dataSources.pushSource(option.source);
    }
  });

  return dataSources;
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
  console.log("WS Config", wsConfig);
  return wsConfig;
}

function getContentProps(contentConfig, wsData, wsConfig) {
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
      const propObjList = [];
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
}
