import React, { Fragment, useEffect, useState } from 'react'
import * as Icon from 'react-bootstrap-icons';
import ConnectionSymbol from './ConnectionSymbol';

function NavBar() {
    return (
      <div id="navbar" className="row bg-dark h-100 w-100 m-0" >
          <h5 className="text-light my-2 px-3">Shoestring Unified UI - Building Blocks Demo</h5>
      </div>
    );
  }
  
  function SideBar() {
  
    let items = [1, 2, 3]
  
    return (
      <div className="d-flex flex-column bg-dark text-light h-100">
        <ul className="nav nav-pills flex-column mb-1 align-items-start">
          {items.map((item) => <SideBarNavItem key={item} href='#' icon={Icon.Pencil} friendly='Nav Title' hr={false} />)}
          <ConnectionSymbol className="mt-auto"/>
        </ul>
      </div>
    );
  }
  
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
  

export {NavBar, SideBar,SideBarNavItem}