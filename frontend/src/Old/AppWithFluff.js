import React, { Fragment, useEffect, useState } from 'react'

import Table from './BBs/Table.js';
import { FloorPlan } from './BBs/FloorPlan';
import { MyForm, Basic } from './BBs/UserInputs'
import AxiosWrapper from './BBs/HTTP.js';
import { LargeNumber } from './BBs/indicators.js';

import * as Icon from 'react-bootstrap-icons';
import GeneratedContent from './generator'
import DataTable from 'react-data-table-component';


import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import './Shoestring.css';

String.prototype.toProperCase = function () {
  return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

const axios = require('axios').default;


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

function NavBar() {
  return (
    <div id="navbar" className="row" >
      <div className="navbar navbar-dark sticky-top bg-dark p-0 shadow">
        <h5 className="text-light my-2 px-3">Shoestring Unified UI - Building Blocks Demo</h5>
      </div>
    </div>
  );
}

function SideBar() {

  let items = [1, 2, 3]

  return (
    <div className="d-flex flex-column bg-dark text-light min-vh-100">
      <ul className="nav nav-pills flex-column mb-1 align-items-start">
        {items.map((item) => <SideBarNavItem key={item} href='#' icon={Icon.Pencil} friendly='Nav Title' hr={false} />)}
      </ul>
    </div>
  );
}


function HttpGet() {

  var data = ""

  axios.get('http://127.0.0.1:8000/users/')
    .then(function (response) {
      const data = response.data;
      console.log("Response:");
      console.log(response.data);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });

  return (
    <p>{data}</p>
  );
}


function Table2(props) {

  const [data, setData] = useState(null);
  useEffect(() => { getData() }, []);

  function getData() {
    axios.get('http://127.0.0.1:8000/customusers/')
      .then(function (response) {
        const dataGot = response.data.results;
        setData(dataGot);
        console.log("Response:");
        console.log(response);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  }

  function jsonDataToColumns(data) {
    const columnHeaders = Object.keys(data[0]);
    const columns = columnHeaders.map((header) => ({name: header.toUpperCase(), selector: row => row[header]}));

    return columns;
  }
  
  
  if (data) {
    console.log(data);
    const columns = jsonDataToColumns(data);
    console.log(JSON.stringify(columns));
    return (
      <DataTable
        columns = {jsonDataToColumns(data)}
        data = {data}
      />
    )
  };
}



function MyComponent() {

  const columns = [
    {
        name: 'Title',
        selector: row => row.title,
    },
    {
        name: 'Year',
        selector: row => row.year,
    },
  ];
  
  const data = [
    {
        id: 1,
        title: 'Beetlejuice',
        year: '1988',
    },
    {
        id: 2,
        title: 'Ghostbusters',
        year: '1984',
    },
  ]
  
  return (
      <DataTable
          columns={columns}
          data={data}
      />
  );
};


function SideBarNavItem(props) {

  return (
    <Fragment>
      <li className="nav-item">
        <a href={props.href} className="nav-link text-white">
          <props.icon className="mx-2" />
          <span>{props.friendly}</span>
        </a>
      </li>
      {props.hr === true && <hr />}
    </Fragment>

  );
}

function Cards() {
  return (
    <Fragment>
      <Card width="m" height="l" ><FloorPlan /></Card>
      <Card width="s" height="l" > <MyComponent/>  </Card>
      <Card width="xxs" height="l"> <LargeNumber/> </Card>
      <Card width="xxl" height="m"> <Table url='http://127.0.0.1:8000/customusers/'/> </Card>
      <Card width="xxl" height="s" content={null}> Next Step is get form to submit with axios, use Django rest framework to do CRUD operations then display data in a table. Need to get the datatable component working properly. Not far off I don't think <p>https://react-data-table-component.netlify.app/?path=/docs/getting-started-examples--page</p></Card>
      <Card width="xxl" height="xl" content="Basic" />
    </Fragment>
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



export default App;
export { Card }
