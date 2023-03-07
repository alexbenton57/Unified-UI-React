import React from "react";
import ErrorBoundary from "Infrastructure/ErrorBoundary";

// now replace with react-grid-layout
export default function Card({ width, height, title, children, header, body, footer }) {
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
        {header ? header : <div className="card-header">{title ? title : "A Building Block"}</div>}

        {body ? (
          body
        ) : (
          <div className="card-body">
            <ErrorBoundary fallback={<p>Error in rendering card contents</p>}>
              {children}
            </ErrorBoundary>
          </div>
        )}

        {footer && <div className="card-footer">A Card Footer</div>}
      </div>
    </div>
  );
}
