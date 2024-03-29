import React, { Fragment } from "react";
import ConnectionSymbol from "Infrastructure/ConnectionSymbol";

function NavBar() {
  return (
    <div id="navbar" className="row bg-dark h-100 w-100 m-0">
      <h5 className="text-light my-2 px-3">Shoestring Unified UI - Building Blocks Demo</h5>
    </div>
  );
}

function SideBar({ pages, setPage }) {
  return (
    <div className="d-flex flex-column bg-dark text-light h-100">
      <ul className="nav nav-pills flex-column mb-1 align-items-start">
        
        {pages.map((page) => {
          if (page.id) {
            return (
              <SideBarNavItem
                key={page.id}
                setPage={setPage}
                id={page.id}
                Icon={page.Icon}
                title={page.title}
              />
            );
          } else {
            return <hr />;
          }
        })}
        <hr />
        <ConnectionSymbol className="mt-auto" />
      </ul>
    </div>
  );
}

function SideBarNavItem({ id, Icon, title, setPage }) {

  return (
    <Fragment>
      <li className="nav-item">
        <button
          onClick={() => {
            console.log("Page Change", id);
            setPage(id);
          }}
          className="nav-link text-white"
        >
          <Icon className="mx-2" />
          <span>{title}</span>
        </button>
      </li>
    </Fragment>
  );
}

export { NavBar, SideBar, SideBarNavItem };
