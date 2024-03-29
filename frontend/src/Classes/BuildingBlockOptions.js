export default class BuildingBlockOptions {
  constructor(optionsList) {

    var defaultOptions = [
      new Option({ name: "title", verbose: "Panel Title", fieldType: "input", required: true }),
      new Option({ name: "gridLayout", verbose: "Grid Layout", fieldType: "layout", required: true, omittedFromForm: true }),
      new Option({ name: "id", verbose: "Panel ID", fieldType: "input", required: true, omittedFromForm: true }),
      new Option({ name: "bbType", verbose: "Building Block Type", fieldType: "input", required: true, omittedFromForm: true }),
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
    // if any name in reservednames, throw error - prevent class creation
    // check names are unique
    // check types are correct - and that initial values match up
    // check optionArray/datasource are formed correctly
    // make sure if field is enabled by another, that other form exists
  }

  makePropTypes() {
    // convert object to PropTypes so can be set in BB definition
  }
}


const possibleFormOptions = {
  //implemented


  // not implemented
  formGroup: "group verbose name", // groupings in display
  displayedAs: {choice : ['pills', 'dropdown'], boolean: ["radio", "..."]},
  placeholder: "string(placeholder text)",
}

const possibleFieldTypes = [

  //implemented
  "input",
  "choice",
  "datasource",
  "optionArray",
  "boolean",
  "json",

  // not implemented
  "threshold", // number and colour - for indicators etc
  "colour", 

] 

const possibleFields = [

  // implemented
  "name", //unique identifier for field 
  "verbose", // change to friendly name?
  "fieldType", // choice(["input", "choice", "datasource", "optionArray" ]) + ["radio", "slider", "colour", "threshold"]  
  "defaultValue",   
  "choices", 
  "options",


  "required", // required to have a value in form - or required that data is present before loading

  "omittedFromForm", // maybe a formOptions: {...options} property would be better
  "enabledBy", // show when expression evaluates to true i.e. <name> if bool or <name == "choice"> if choice field
                  // searches for nearest parent

  "displayedAs", // {choice : ['pills', 'dropdown'], boolean: ["radio", "..."]},


  // not implemented

  "formOptions", // {omittedFromForm: <bool>, formGroup: "group verbose name"}
  "dataType", // unsure on how to implement this one - or if we need it - meant to be a data validation property for the form
  
];

const reservedNames = ["title", "gridLayout", "id", "bbType"];
const requiredFields = ["name", "fieldType"];

class Option {
  constructor(optionObj) {
    this.verifyObj(optionObj);

    possibleFields.forEach((key) => {
      if (optionObj[key] !== undefined) {
        if (key === "options") {
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
    // Make sure option name is not reserved (might need to do this in the Options class)
  }
}
