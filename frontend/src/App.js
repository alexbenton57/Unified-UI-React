import React, { Fragment, useState } from "react";
import * as Icon from "react-bootstrap-icons";
import ReactModal from "react-modal";

import Table from "./BBDemos/Table";
import { FloorPlan } from "./BBDemos/FloorPlan";
import { NavBar, SideBar } from "./BBDemos/navigation";
import { Basic } from "./BBDemos/UserInputs";
import { MessengerHandler, SocketLogger } from "./Infrastructure/websocket";
import { SocketEnabledIndicator, ConfigurableIndicator } from "./BBDemos/indicators";
import { ConfigurableComponent } from "./BBDemos/ConfigurableComponent";
import ConfigurableCard from "./Infrastructure/ConfigurableCard";
import Card from "Infrastructure/Card";



import ChartDemo from "./BBDemos/Chartjs";
import RechartDemo, { RechartDemoUseHTTP } from "./BBDemos/Recharts";
import SuspenseFetch from "./BBDemos/suspense";
import LineChart from "./BBDemos/LineChart";
import LineChartTwoInput from "./BuildingBlocks/LineChartTwoInput";

import "./Styles/App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle";
import "./Styles/Shoestring.css";

import {
  ConfiguratorForm as ConfiguratorFormSingle,
  DataSourceComponent as DataSourceComponentSingle,
  addDefaultSourceValues
} from "./Infrastructure/ConfigurableDataSource";

import LineChartMultiInput from "multivar/LineChartMultiInput";
import ConfiguratorForm from "multivar/ConfiguratorForm";
import DataSourceComponent from "multivar/ConfigurableDataSource";

import { ConfiguratorFormMulti, DataSourceComponentMulti } from "multivar/ConfigurableDataSource";

ReactModal.setAppElement(document.getElementById("root"));

function App() {
  //return (<AppContent />);
  return (
    <MessengerHandler>
      <AppContent />
    </MessengerHandler>
  );
}

function AppContent(props) {
  const pages = [
    { id: "page1", page: Page1, icon: Icon.Plug, title: "WebSocket" },
    { id: "page2", page: Page2, icon: Icon.Globe, title: "HTTP" },
    { id: "page3", page: Page3, icon: Icon.Building, title: "Factory Floor" },
    { id: "page4", page: Page4, icon: Icon.PencilSquare, title: "Configuration" },
    { id: "page5", page: Page5, icon: Icon.PlugFill, title: "Data Source Config" },
    { id: "page6", page: Page6, icon: Icon.Plugin, title: "Multi Data Config" },
  ];

  const [currentPage, setCurrentPage] = useState(() => {
    const currentPage = window.localStorage.getItem("current-page");
    if (currentPage) {
      return currentPage;
    } else {
      return pages[0]["id"];
    }
  });

  function setPage(page) {
    window.localStorage.setItem("current-page", page);
    setCurrentPage(page);
  }

  function getPage(id) {
    var result = pages.find((item) => item.id === id);
    return <result.page />;
  }

  return (
    <div style={{ scrollX: "hidden" }}>
      <div id="navBarContainer">
        <NavBar />
      </div>
      <div id="sideBarContainer">
        <SideBar pages={pages} setPage={setPage} />
      </div>
      <div id="modalWindow">
        <div className="container-fluid p-0" id="mainWindowContainer">
          <div className="row g-3 py-3 mx-3">{getPage(currentPage)}</div>
        </div>
      </div>
    </div>
  );
}

function Page1() {
  const [indicatorSettings, setIndicatorSettings] = useState(
    JSON.parse('{"redEnd":20,"yellowEnd":60,"greenColor":"danger"}')
  );

  return (
    <Fragment>
      <Card hide={true} width="xxl" height="xs" title="JSON Input for Configurable Indicator">
        <div className="row px-3">
          <input
            className="col-12"
            type="text"
            value={JSON.stringify(indicatorSettings)}
            onChange={(e) => setIndicatorSettings(JSON.parse(e.target.value))}
          />
        </div>
        <p>
          Next is tidy upnew messenger code, refactor code base for messenger, then implement
          reconnection to websocket + do connection symbol.
        </p>
        <a href="https://betterprogramming.pub/how-to-create-your-own-event-emitter-in-javascript-fbd5db2447c4">
          Medium Article
        </a>
      </Card>

      <Card hide={true} width="s" height="m" title="Configurable Indicator">
        <p>This component receives appearance parameters from the JSON input above. </p>
        {React.cloneElement(<ConfigurableComponent />, {
          redEnd: indicatorSettings.redEnd,
          yellowEnd: indicatorSettings.yellowEnd,
          greenColor: indicatorSettings.greenColor,
          socketChannel: "channel1",
        })}
        <p>
          Lots of error checking needs to be addd to this! Invalid JSON will break the component.
        </p>
        <p>
          The template json from the above should be able to be extracted from the code of
          thecomponent itself to keep things DRY. The ability to auto generate a form would be
          useful too (this will have to be done anyway to create a proper user input building
          block.)
        </p>
        <p>
          Want to be able to extract a menu of options for a configuration tool. We want this menu
          to be defined in a single place - in the component itself makes sense (or maybe as a
          seperate const in the component's file)
        </p>
      </Card>

      <ConfigurableCard
        width="s"
        height="m"
        title="Configurable Card"
        content={ConfigurableComponent}
      ></ConfigurableCard>

      <Card hide={true} width="s" height="m" title="Websocket Logger">
        <SocketLogger />
      </Card>
      <Card hide={true} width="s" height="m" title="Subscribing to a WebSocket Message Tag">
        <SocketEnabledIndicator />
        <p className="text-sm">
          Note - The websocket system definitely needs checking - there are are a lot of subtleties
          I'm sure I'm missing
        </p>
      </Card>
      <Card width="s" height="s" title="Note">
        Next I want to reconfigure Component to have a settings icon which can pull out a list of
        parameters from a building block and feed them into an autoformatted form. <hr /> Also check
        out KendoReact for UI components.
      </Card>
      <Card hide={true} width="s" height="s" title="Indicator configurable through a form">
        <ConfigurableIndicator /> <p></p>
      </Card>

      <Card width="s" height="s" title="Pulling options object from a component">
        <p>Configurable Indicator Options:</p>
        <p>{JSON.stringify(ConfigurableComponent.options)}</p>
        <p>
          Next step is to dynamically create a form from these, possibly using a helper function on
          the options object, eg orientation: addChoice(...), redEnd: addFloat(). Form input
          verification and formatting can go off that.
        </p>
      </Card>
    </Fragment>
  );
}

function Page2() {
  return (
    <Fragment>
      <Card width="m" height="m" title="Rechart Demo Use HTTP">
        <RechartDemoUseHTTP />
      </Card>
      <Card width="m" height="m" title="Users table">
        <Table url="http://127.0.0.1:8000/customusers/" />
      </Card>
      <Card width="m" height="m" title="Form to create new users">
        <Basic />
      </Card>
      <Card width="m" height="m" title="What To Do">
        <p>
          - Create a useHTTP hook including HTTP endpoint, update frequency, and required history
        </p>
        <p>
          - Alter useMessenger so that the most recent value can be obtained immediately on refresh
        </p>
        <p>
          <span className="font-weight-bold">
            - Possibly wrap all data fetching into one hook/component.
          </span>
          Suspense is now in use - can access a HTTP request using just a prop. But need to also let
          that prop be a useMessenger() thing or just a constant. Need to have this in the main
          configurable card option.
        </p>
        <p>
          - Also need to alter suspense stuff such that data can refresh automatically - possibly do
          this in the component wrapper thingy
        </p>
        <p>
          - Alter configurable card form to include a data source section - const v websocket v HTTP
        </p>
        <p>
          - Create a checklist component so I don't have bloody notes everywhere - possibly useful
          anyways
        </p>
      </Card>
      <Card width="m" height="m" title="ChartJS Demo">
        <ChartDemo />
      </Card>
      <Card width="m" height="m" title="Rechart Demo">
        <RechartDemo />
      </Card>
      <Card width="m" height="m" title="Rechart Demo with Suspense">
        <SuspenseFetch />
      </Card>
    </Fragment>
  );
}

function Page3() {
  return (
    <Fragment>
      <Card width="xxl" height="l" title="Randomised Factory Floor">
        <FloorPlan />
      </Card>
    </Fragment>
  );
}

function Page4() {
  return (
    <Fragment>
      <ConfigurableCard
        width="m"
        height="xl"
        title="Configurable Card"
        content={ConfigurableComponent}
      ></ConfigurableCard>
    </Fragment>
  );
}

//<ConfigurableCard2 width="m" height="xl" title="Line Chart Configurator" content={LineChart} contentConfig={contentConfig} setContentConfig={setContentConfig}></ConfigurableCard2>

function Page5() {
  console.log("render - Page5");
  const content = LineChartTwoInput;
  const [contentConfig, setContentConfig] = useState(addDefaultSourceValues(content.options));

  return (
    <Fragment>
      <Card width="m" height="xl" title="Line Chart Configurator">
        <ConfiguratorFormSingle content={content} config={contentConfig} setConfig={setContentConfig} />
      </Card>
      <Card width="m" height="xl" title="Data Source Component">
        <DataSourceComponentSingle content={content} config={contentConfig} />
      </Card>

      <Card width="m" height="xl" title="Config from form">
        <span>{JSON.stringify(contentConfig, null, 2)}</span>
      </Card>
      <Card width="m" height="xl" title="Default Options">
        <span>{JSON.stringify(content.options, null, 2)}</span>
      </Card>
    </Fragment>
  );
}

function Page6() {
  console.log("render - Page6");
  const content = LineChartMultiInput
  const [contentConfig, setContentConfig] = useState(addDefaultSourceValues(content.options));

  return (
    <Fragment>
      <Card width="m" height="xl" title="Line Chart Configurator">
        <ConfiguratorForm content={content} setConfig={setContentConfig} />
      </Card>
      <Card width="m" height="xl" title="Data Source Component">
        <DataSourceComponent content={content} config={contentConfig} />
      </Card>

      <Card width="m" height="xl" title="Config from form">
        <pre>{JSON.stringify(contentConfig, null, 2)}</pre>
      </Card>
      <Card width="m" height="xl" title="LineChartMultiInput.options">
        <pre>{JSON.stringify(content.options, null, 2)}</pre>
      </Card>
    </Fragment>
  );
}

export default App;
