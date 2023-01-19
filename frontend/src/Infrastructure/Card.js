import React from "react";

export default function Card({ width, height, title, footer, children, header}) {
  let widthDict = {
    xss: "col-2",
    xs: "col-3",
    s: "col-4",
    m: "col-6",
    l: "col-8",
    xl: "col-9",
    xxl: "col-12",
  };

  let heightDict = {
    xxs: "card-sixth",
    xs: "card-quarter",
    s: "card-third",
    m: "card-half",
    l: "card-two-third",
    xl: "card-full",
  };

  return (
    <div className={"col " + widthDict[width]}>
      <div className={"card " + heightDict[height]} style={{ boxShadow: "-3px 3px 4px #EEE" }}>

        {header ? header: <div className="card-header">{title ? title : "A Building Block"}</div>}
        
        <div className="card-body">{children}</div>
        {footer && <div className="card-footer">A Card Footer</div>}
      </div>
    </div>
  );
}
