
import Checklist from "BuildingBlocks/Checklist";
import Chart from "BuildingBlocks/Chart";
import Gauge from "BuildingBlocks/Gauge";
import Log from "BuildingBlocks/Log";
import BooleanIndicator from "BuildingBlocks/BooleanIndicator";
import PostButton from "BuildingBlocks/PostButton";
import CategoryPostButton from "BuildingBlocks/CategoryPostButton";
import FormButton from "BuildingBlocks/FormButton";
import FormContainer from "BuildingBlocks/FormContainer";
import ProgressBarArray from "./ProgressBarArray";

const ALL_BUILDING_BLOCKS = {
  "Progress Bar Array": ProgressBarArray,
  "Form Button": FormButton,
  "Form Container": FormContainer,
  "Category Post Button": CategoryPostButton,
  "Boolean Indicator": BooleanIndicator,
  "POST Button": PostButton,
  "Log": Log,
  "Gauge": Gauge,
  "Composed Chart": Chart,
  "Checklist": Checklist,

};

export default ALL_BUILDING_BLOCKS;
