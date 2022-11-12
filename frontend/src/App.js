import React, { Fragment, useEffect, useState } from 'react'

import Table, {TestTable} from './BBs/Table.js';
import { FloorPlan } from './BBs/FloorPlan';
import { MyForm, Basic } from './BBs/UserInputs'
import { LargeNumber } from './BBs/indicators.js';
import { NavBar, SideBar} from './BBs/navigation.js';
import { ConnectionSymbol } from './BBs/WebSocket.js';


import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import './Shoestring.css';

function Card(props) {

  let widthDict = {
    "xss": "col-2",
    "xs": "col-3",
    "s": "col-4",
    "m": "col-6",
    "l": "col-8",
    "xl": "col-9",
    "xxl": "col-12",
  };

  let heightDict = {
    "xxs": "card-sixth",
    "xs": "card-quarter",
    "s": "card-third",
    "m": "card-half",
    "l": "card-two-third",
    "xl": "card-full",
  };

  return (
    <div className={"col " + widthDict[props.width]}>
      <div className={"card " + heightDict[props.height]}>
        <div className="card-header">A Building Block</div>
        <div className="card-body">
          {props.content && <BuildingBlock bbname={props.content} />}
          {props.directContent && props.directContent}
          {props.children}
        </div>
        <div className="card-footer">A Card Footer</div>
      </div>
    </div>
  );
}

function BuildingBlock(props) {

  const BBDict = {
    "FloorPlan": FloorPlan,
    "Form": MyForm,
    "Basic": Basic,
  };

  let BBObj = BBDict[props.bbname];

  return (
    <BBObj />
  );
}


function App() {
  return (
    <div className="container-fluid fixed-top">
      <NavBar />
      <div className="row">
        <div className="col col-3 col-xl-2 px-0">
          <SideBar />
        </div>
        <div className="col p-0" id="MainContentWindow">
          <div className="stfixed px-0 py-4">
            <div className="row g-3 m-3">
              <Cards />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Cards() {
  return (
    <Fragment>
      <Card width="m" height="l" ><FloorPlan /></Card>
      <Card width="xxs" height="l" > <TestTable/>  </Card>
      <Card width="xxs" height="l" > <ConnectionSymbol/>  </Card>
      <Card width="xxs" height="l"> <LargeNumber/> </Card>
      <Card width="xxl" height="m"> <Table url='http://127.0.0.1:8000/customusers/'/> </Card>
      <Card width="xxl" height="s" content={null}> Next Step is get form to submit with axios, use Django rest framework to do CRUD operations then display data in a table. Need to get the datatable component working properly. Not far off I don't think <p>https://react-data-table-component.netlify.app/?path=/docs/getting-started-examples--page</p></Card>
      <Card width="xxl" height="xl" content="Basic" />
    </Fragment>
  );
}



export default App;
export { Card }
