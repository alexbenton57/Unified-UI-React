import LineChartMultiInput from "BuildingBlocks/LineChartMultiInput";
import LineChartTwoInput from "BuildingBlocks/LineChartTwoInput";
import Checklist from "BuildingBlocks/Checklist";
import ProgressBar from "BuildingBlocks/ProgressBar";
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
  "Progress Bar": ProgressBar,
  "Checklist": Checklist,
  "Line Chart (2 Input)": LineChartTwoInput,
  "Line Chart (Multi Input)": LineChartMultiInput,
};

export default ALL_BUILDING_BLOCKS;
