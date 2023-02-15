import React, { Fragment } from "react";
import stringify from "Utils/stringify";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorStack: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error: error };
  }

  componentDidCatch(error, errorInfo) {
    let stack = errorInfo.componentStack
      ? errorInfo.componentStack
          .split("\n")
          .filter((v) => v && v !== "div")
          .map((v) => v.split("@"))
      : "";

    this.setState({ errorStack: stack });
    console.log("Error Boundary Caught", error, stringify(errorInfo));
  }

  render() {
    if (this.state.hasError) {
      return (
        <Fragment>
          <p>
            <span>Error Caught</span>
            <span
              className="text-primary text-underline my-1 px-3"
              role="button"
              onClick={() => this.setState({ hasError: false })}
            >
              Try Again
            </span>
          </p>
          <pre>{stringify(this.state.error)}</pre>
          <p>Error Stack:</p>
          <pre>{stringify(this.state.errorStack)}</pre>
        </Fragment>
      );
    }
    return this.props.children;
  }
}
