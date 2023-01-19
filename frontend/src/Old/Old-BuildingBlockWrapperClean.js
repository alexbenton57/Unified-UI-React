import React, { Suspense, useEffect, useState, useMemo } from "react";
import axios from "axios";
import LoadingSpinner from "BBDemos/Spinner";
import { sources } from "Infrastructure/ConfigurableCard";
import useMessenger from "Hooks/useMessenger";
import useLogOnChange from "Hooks/useLogOnChange";

// props = {child: BBFunc, config:{configObj from ConfigurableCard}}
// Purpose is to create promises for HTTP data

// https://www.developerway.com/posts/react-re-renders-guide
// https://www.developerway.com/posts/how-to-write-performant-react-code

export default function BuildingBlockWrapper({ content, config }) {
  console.log("render - Building Block Wrapper");
  const memoConfig = useMemo(() => addPromises(config), [config]);
  const memoContent = useMemo(() => content, [content]);

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <DataFetcherMemoized content={memoContent} config={memoConfig} />
    </Suspense>
  );
}

function addPromises(conf) {
  const config = structuredClone(conf);

  for (let option of config) {
    if (option.dataSource) {
      if (option.source.type === sources.HTTP) {
        option.source["promise"] = wrapAxiosPromise(option.source.link);
      }
    }
  }

  return config;
}

export function wrapAxiosPromise(url) {
  const promise = () =>
    axios
      .get(url)
      .then((res) => res.data.results)
      .catch((err) => console.log(err));

  let status = "pending";
  let result;
  let suspend = promise().then(
    (res) => {
      status = "success";
      result = res;
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

// Make this a stateless function
// Something needs to be memoized somewhere

function getFirstTagFromConfig(config) {
  for (let option of config) {
    if (option.dataSource) {
      if (option.source.type === sources.WS) {
        return option.source.link;
      }
    }
  }

  return null;
}

function DataFetcher(props) {
  console.log("render - DataFetcher");
  useLogOnChange(props.config, "Props passed to props.content");

  const passedConfig = props.config;
  const subscribedTag = getFirstTagFromConfig(passedConfig);
  const arrayValue = useMessenger(subscribedTag, 0);
  const contentProps = getContentProps(passedConfig, "from Main Body", arrayValue);

  console.log("change - NEW PROPS", contentProps);

  return <props.content {...contentProps} />;
}

const DataFetcherMemoized = React.memo(DataFetcher);

function getSocketTags(config) {
  const tagObj = {};

  for (let option of config) {
    if (option.dataSource) {
      if (option.source.type === sources.WS) {
        console.log("Get Socket Tags", option);
        console.log(option.label, option.source.link);
        //dataKey: wsChannel
        tagObj[option.label] = option.source.link;
      }
    }
  }

  console.log("tagObj", tagObj);
  return tagObj;
}

const getContentProps = (conf, msg = "", arrayValue) => {
  console.log("called - getProps(conf) in DataFetcher", msg, conf);
  const config = [...conf];

  for (let option of config) {
    if (option.dataSource) {
      switch (option.source.type) {
        case sources.HTTP:
          option["value"] = option.source.promise.read();
          break;
        case sources.WS:
          option["value"] = arrayValue;
          break;
        case sources.CONSTANT:
          option["value"] = option.source.link;
          break;
      }
    } else if (!("value" in option) && option.default) {
      option.value = option.default;
    }
  }

  const newProps = config.reduce((obj, option) => ({ ...obj, [option.label]: option.value }), {});

  return newProps;
};
