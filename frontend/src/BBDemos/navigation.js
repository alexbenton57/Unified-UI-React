import React, { Fragment } from 'react'
import ConnectionSymbol from 'Infrastructure/ConnectionSymbol';

function NavBar() {
  return (
    <div id="navbar" className="row bg-dark h-100 w-100 m-0" >
      <h5 className="text-light my-2 px-3">Shoestring Unified UI - Building Blocks Demo</h5>
    </div>
  );
}

function SideBar(props) {

  return (
    <div className="d-flex flex-column bg-dark text-light h-100" >
      <ul className="nav nav-pills flex-column mb-1 align-items-start">
        {props.pages.map((page) => { return <SideBarNavItem key={page.title} page={page} setPage={props.setPage}/> })}
        <hr/>
        <ConnectionSymbol className="mt-auto" />
      </ul>
    </div>
  );
}

function SideBarNavItem(props) {

  return (
    <Fragment>
      <li className="nav-item">
        <button onClick={() => {console.log("Page Change", props.page.id); props.setPage(props.page.id)}} className="nav-link text-white">
          <props.page.icon className="mx-2" />
          <span>{props.page.title}</span>
        </button>
      </li>
    </Fragment>

  );
}


export { NavBar, SideBar, SideBarNavItem }