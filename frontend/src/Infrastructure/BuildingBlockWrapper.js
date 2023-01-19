import React, { Suspense, useEffect, useState, useMemo } from "react";
import axios from "axios";
import LoadingSpinner from "BBDemos/Spinner";
import { sources } from "./AutoField";
import useMultiMessenger from "Hooks/useMultiMessenger";
import useMessenger from "Hooks/useMessenger";
import useLogOnChange from "Hooks/useLogOnChange";

// props = {child: BBFunc, config:{configObj from ConfigurableCard}}
// Purpose is to create promises for HTTP data

// https://www.developerway.com/posts/react-re-renders-guide
// https://www.developerway.com/posts/how-to-write-performant-react-code

export default function BuildingBlockWrapper({ content, config }) {

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <DataFetcher Content={content} config={addPromises(config)} />
    </Suspense>
  );
}

function DataFetcher({ config, Content }) {

  console.log("render - DataFetcher", config)

  const wsConfig = useMemo(() => makeInitialWsConfig(config), [config])
  const wsData = useMultiMessenger(wsConfig);
  const contentProps = getContentProps(config, wsData, wsConfig);

  return <Content {...contentProps} />;
}

function addPromises(conf) {
  const config = structuredClone(conf);

  config.map((option) => {
    if (option.dataSource) {
      if (option.source.type === sources.HTTP) {
        option.source["promise"] = wrapAxiosPromise(option.source.link);
      }
    }
  })

  return config;
}

export function wrapAxiosPromise(url) {
  const promise = () =>
    axios
      .get(url)
      .then((res) => res.data.results)
      .catch((err) => console.log(err));

  const process = (res) => {
    if (Array.isArray(res)) {
      try {
        return res.map((r) => r.value);
      } catch (error) {
        return res;
      }
    }
    return res;
  };

  let status = "pending";
  let result;
  let suspend = promise().then(
    (res) => {
      status = "success";
      result = process(res);
    },
    (err) => {
      status = "error";
      result = err;
    }
  );
  return {
    read() {
      if (status === "pending") {
        throw suspend;
      } else if (status === "error") {
        throw result;
      } else if (status === "success") {
        console.log("Axios Promise Wrapper HTTP Result", result);
        return result;
      }
    },
  };
}

function makeInitialWsConfig(config) {

  const wsConfig = {};

  config.map(option => {
    if (option.dataSource) {
      if (option.source.type === sources.WS) {
        wsConfig[option.label] = { tag: option.source.link, value: option.initial };
      }
    }
  })

  console.log("makeInitialWsConfig", wsConfig)
  return wsConfig;
}

const getContentProps = (contentConfig, wsData, wsConfig) => {

  function getWsVal(label) {
    return wsData[label] ? wsData[label].value : wsConfig[label].value;
  }

  const newProps = {};

  contentConfig.map(option => {
    if (option.dataSource) {
      switch (option.source.type) {
        case sources.HTTP:
          newProps[option.label] = option.source.promise.read();
          break;
        case sources.WS:
          newProps[option.label] = getWsVal(option.label);
          break;
        case sources.CONSTANT:
          newProps[option.label] = option.source.link;
          break;
      }
    } else if (option.value) {
      newProps[option.label] = option.value;
    } else {
      newProps[option.label] = option.default;
    }
  })

  return newProps;
};
