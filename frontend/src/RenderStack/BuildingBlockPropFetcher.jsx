import React, { Fragment, Suspense, useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import LoadingSpinner from "Infrastructure/Spinner";
import useMultiMessenger from "Hooks/useMultiMessenger";
import useMessenger from "Hooks/useMessenger";
import useLogOnChange from "Hooks/useLogOnChange";
//import AutoField, { DATA_SOURCES } from "global-config/AutoField";
import DataSource from "Classes/DataSource";
import { DATA_SOURCES } from "CONSTANTS";
import stringify from "Utils/stringify";
import BuildingBlockConfig, { checkNameInConfig } from "Classes/BuildingBlockConfig";

// config is of type BuildingBlockConfig
export default function BuildingBlockPropFetcher({ config, setWrapperErrors }) {
  const [errors, setErrors] = useState([]);

  console.log("render - BuildingBlockPropFetcher", config.config.title, errors);

  const memoisedConfig = useMemo(() => config, [config]);
  const wsData = useMultiMessenger(memoisedConfig.wsConfig);

  // memoise to prevent re-rendering of BB while errors are updated
  const contentProps = useMemo(() => {
    if (errors.length !== 0) {
      setErrors((_) => []);
    }
    const addError = (error) => setErrors((prev) => [...prev, error]);
    return generateProps(config.options, config.config, wsData, addError);
  }, [config.options, config.config, wsData, setErrors]);

  // prevents update of parent component during render
  useEffect(() => {
    console.log("render - setting wrapper errors");
    setWrapperErrors(errors), [errors];
  });

  return (
    <MemoisedBuildingBlock
      contentProps={contentProps}
      Content={config.content}
      config={memoisedConfig}
    />
  );
}

function BuildingBlock({ contentProps, Content, config }) {
  console.log("render - building block", config.config.title, contentProps);
  const missingProps = getMissingProps(config.options, contentProps);

  if (!missingProps) {
    return <Content {...contentProps} />;
  } else {
    return (
      <Fragment>
        <div className="h-100 w-100 mb-4">
          <LoadingSpinner />
        </div>
        <h3>Error - Render Failed</h3>
        <h5>Not all required props are present</h5>
        <pre>{stringify({ "Missing Props": missingProps })}</pre>
        <h5>Current Props</h5>
        <pre>{stringify(contentProps)}</pre>
      </Fragment>
    );
  }
}

const MemoisedBuildingBlock = React.memo(BuildingBlock);

function generateProps(options, config, wsData, addError) {
  var newProps = {};

  options.forEach((option) => {
    const name = option.name;

    checkNameInConfig(name, config);
    const prop = getProp(option, config[name], wsData, addError);
    newProps = { ...newProps, ...prop };
  });

  return newProps;
}

function getProp(option, configValue, wsData, addError) {
  switch (option.fieldType) {
    case "optionArray":
      // recurse to get inner values
      const configArray = configValue.map((innerConfig) =>
        generateProps(option.options, innerConfig, wsData, addError)
      );
      return { [option.name]: configArray };

    case "dataSource":
      // get websocket or http value from a datasource
      if (configValue instanceof DataSource) {
        const value = sourceToValue(configValue, wsData, addError);
        return { [option.name]: value };
      } else {
        console.log(configValue, option);
        throw `configValue ${stringify(configValue)} should have type 'DataSource`;
      }

    default:
      return { [option.name]: configValue };
  }
}

function sourceToValue(source, wsData, addError) {
  switch (source.type) {
    case DATA_SOURCES.HTTP:
      const result = source.axiosPromise.read();
      console.log("reading promise", result);
      switch (result.status) {
        case "success":
          return result.result;
        case "pending":
          break;
        case "error":
          console.log("addError", result.result.message);
          addError(result.result.message);
          break;
      }
    case DATA_SOURCES.WS:
      const value = wsData[source.dataSourceID]?.value;
      if (value === undefined || value === null) {
        addError("Websocket Data Missing");
        break;
      } else {
        return value;
      }

    case DATA_SOURCES.CONSTANT:
      return source.link;
  }
}

function getMissingProps(options, props) {
  const missingProps = options.map((option) => {
    if (!(option.name in props)) {
      return option.verbose;
    } else if (props[option.name] === undefined && option.required) {
      // this isn't quite right - should only return name if field is enabled AND not defined
      return option.verbose;
    } else if (option.fieldType === "optionArray") {
      const innerMissingProps = props[option.name]
        .map((innerConfig) => getMissingProps(option.options, innerConfig))
        .filter((e) => e);
      if (innerMissingProps.length > 0) {
        return { [option.verbose]: innerMissingProps };
      }
    }
  });

  if (missingProps.filter((e) => e).length === 0) {
    return null;
  } else {
    return missingProps.filter((e) => e);
  }
}
