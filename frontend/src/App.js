import React, { Fragment, useState } from "react";
import * as Icon from "react-bootstrap-icons";
import ReactModal from "react-modal";

import { NavBar, SideBar } from "Infrastructure/navigation";
import { MessengerHandler, SocketLogger } from "./Infrastructure/websocket";

import Card from "Infrastructure/Card";
import Chart from "BuildingBlocks/Chart";

import "./Styles/App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle";
import "./Styles/Shoestring.css";
import "/node_modules/react-grid-layout/css/styles.css";
import "/node_modules/react-resizable/css/styles.css";

import ConfigLoader from "RenderStack/PageRenderer";
import GlobalConfigurator from "Configuration/GlobalConfigurator";

import DEMO_CONFIGS from "DEMO_CONFIGS";
import { PageRenderer } from "RenderStack/PageRenderer";

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
  const configPages = [
    { id: "page1", page: Page1 , Icon: Icon.ChatRight, title: "MultiChart" },
    { id: "page7", page: Page7, Icon: Icon.Globe, title: "Global Configuration" },
    { id: "page8", page: Page8, Icon: Icon.ColumnsGap, title: "Render Page" },
  ];

  const demoPages = Object.entries(DEMO_CONFIGS).map(([label, config]) => ({
    id: label,
    page: PageRenderer,
    pageConfig: config.config,
    Icon: Icon[config.icon],
    title: config.name,
  }));

  const pages = [...configPages, "hr", ...demoPages];

  const [currentPage, setCurrentPage] = useState(() => {
    const currentPage = window.localStorage.getItem("current-page");
    if (currentPage) {
      return currentPage;
    } else {
      return pages[0]["id"];
    }
  });

  const pageToDisplay = pages.find((item) => item.id === currentPage);

  function setPage(page) {
    window.localStorage.setItem("current-page", page);
    setCurrentPage(page);
  }

  function getPage(id) {
    var result = pages.find((item) => item.id === id);
    return result.page;
  }

  return (
    <div style={{ scrollX: "hidden" }}>
      <div id="navBarContainer">
        <NavBar />
      </div>
      <div id="sideBarContainer">
        <SideBar pages={pages} setPage={setPage} />
      </div>

      <div className="container-fluid p-0" id="mainWindowContainer">
        <pageToDisplay.page pageConfig={pageToDisplay?.pageConfig} />
        <div id="modalWindow" className="h-100 w-100 " style={{ position: "absolute" }}></div>
      </div>
    </div>
  );
}

//<div className="row g-3 py-3 mx-3"></div>

function Page7() {
  // Aim is to have a single JSON file here which records the config for all BBs
  // Eventually would want to read and save these on a backend, but for now, use Local Storage
  // Initial wrapper for global config:
  //    - View JSON Config as it is made
  //    - Add Building Blocks (assign UUID to each)
  //    - Pull forms from those building block instances
  //    - Save configs in local storage {configKey: {bbID1: {bbConfig}, bbID2: {bbConfig}}}

  return (
    <div className="row g-3 py-3 mx-3">
      <GlobalConfigurator />
    </div>
  );
}

function Page1() {
  return (
    <div className="row g-3 py-3 mx-3">
      {" "}
      <Card width="xxl" height="xl">
        <Chart />
      </Card>
    </div>
  );
}

function Page8() {
  return <ConfigLoader />;
}

export default App;
