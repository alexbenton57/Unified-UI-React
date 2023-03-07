import { DATA_SOURCES } from "CONSTANTS";
import ALL_BUILDING_BLOCKS from "BuildingBlocks/ALL_BUILDING_BLOCKS";
import DataSource from "./DataSource";
import stringify from "Utils/stringify";

export default class BuildingBlockConfig {
  constructor(config) {
    console.log("render - new BuildingBlockConfig", config.title)
    this.content = ALL_BUILDING_BLOCKS[config.bbType];
    this.options = this.content.optionsClass;
    this.config = generateConfigWithDataSources(config, this.options);
    this.wsConfig = generateWebsocketConfig(this.config, this.options);
    
    // also want to run a function to validate the input config against the options
  }
}

// get {...{label: {tag: wsTag, value: defaultValue}}}
// label: "outerLabel.i.innerLabel[.j.innerInnerLabel]"

export function checkNameInConfig(name, config) {
    if (!(name in config)) {
        console.log("config", config);
        throw `${name} not in config: ${stringify(config)}`;
      }
}

// recursively loop through options object 
// returns {dataSourceUUID: {tag: "channel1", value: "someValue"}, ...}
function generateWebsocketConfig(config, options) {
  var wsConfig = {};

  options.forEach((option) => {
    const name = option.name;
    checkNameInConfig(name, config)

    const wsConfigItem = getWsConfigValue(option, config[name]);
    wsConfig = { ...wsConfig, ...wsConfigItem };
  });

  return wsConfig;
}

function getWsConfigValue(option, configValue) {
  switch (option.fieldType) {
    case "optionArray":
      var innerWsConfig = {};
      configValue.forEach((innerConfig, i) => {
        innerWsConfig = {
          ...innerWsConfig,
          ...generateWebsocketConfig(innerConfig, option.options),
        };
      });
      return innerWsConfig;

    case "dataSource":
      if (!(configValue instanceof DataSource)) {
        throw `configValue ${stringify(configValue)} should have type 'DataSource`;
      }
      if (configValue.type === DATA_SOURCES.WS) {
        const wsObj = {
          [configValue.dataSourceID]: { tag: configValue.link, value: option?.defaultValue },
        }
        //console.log("making wsValue", wsObj[configValue.dataSourceID], option)
        return wsObj;
      }
      break;
    default:
      break;
  }
}

// loop through config object, convert all form values which represent data sources
// ... into formal DataSource class instances
function generateConfigWithDataSources(config, options) {
  const newConfig = {};

  options.forEach((option) => {
    const name = option.name;
    checkNameInConfig(name, config)

    newConfig[option.name] = getConfigValue(option, config[name]);
  });
  return newConfig;
}

function getConfigValue(option, configValue) {
  switch (option.fieldType) {
    case "optionArray":
      return configValue.map((innerConfig) =>
        generateConfigWithDataSources(innerConfig, option.options)
      );

    case "dataSource":
      if (!("type" in configValue) && !("link" in configValue))
        throw `form value '${configValue}' for option'${option.name}' does not contain 'link' and 'type' properties`;
      return new DataSource(configValue.type, configValue.link, option.name);

    default:
      return configValue;
  }
}
