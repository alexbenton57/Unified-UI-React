const reservedLabels = ["title", "gridLayout", "id", "bbType"];

export default class BuildingBlockOptions {
  constructor(optionsList) {
    var defaultOptions = [
      new Option({ label: "title", verbose: "Panel Title", type: "text", required: true }),
      new Option({ label: "gridLayout", verbose: "Grid Layout", type: "layout", required: true, omittedFromForm: true }),
      new Option({ label: "id", verbose: "Panel ID", type: "uuid", required: true, omittedFromForm: true }),
      new Option({ label: "bbType", verbose: "Building Block Type", type: "text", required: true, omittedFromForm: true }),
    ];

    this.optionsList = defaultOptions;
    this.optionsList.push(...optionsList.map((opt) => new Option(opt)));

    //this.prototype.map = (callback) => this.configList.map(option => callback(option))
    //this.forEach = (callback) => this.configList.forEach(option => callback(option))
  }

  map(callback) {
    return this.optionsList.map((option) => callback(option));
  }

  forEach(callback) {
    return this.optionsList.forEach((option) => callback(option));
  }

  verifyConfig() {
    // if any label in reservedLabels, throw error - prevent class creation
    // check labels are unique
    // check types are correct - and that initial values match up
    // check multiple/datasource are formed correctly
  }

  makePropTypes() {
    // convert object to PropTypes so can be set in BB definition
  }
}

const possibleFields = [
  "label",
  "verbose",
  "type",
  "initial",
  "dataSource",
  "multiple",
  "required",
  "formValues",
  "value",
  "source",
  "options",
  "choices", 
  "omittedFromForm",
];

const requiredFields = ["label", "verbose", "type"];

class Option {
  constructor(optionObj) {
    this.verifyObj(optionObj);

    possibleFields.forEach((key) => {
      if (optionObj[key]) {
        if (key === "options") {
          console.log("option obj")
          const options = optionObj.options.map(opt => new Option(opt))
          this.options = options

        } else {
        this[key] = optionObj[key]}
      } else {
        this[key] = undefined;
      }
    });
  }

  verifyObj(option) {
    Object.keys(option).forEach((key) => {
      if (!possibleFields.includes(key)) {throw new Error(`${key} is not a valid property for a building block option. Valid options are [${possibleFields}]`)}
    })

    
    // Make sure required fields are there
  }
}
