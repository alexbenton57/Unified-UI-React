import BuildingBlockOptions from "Classes/BuildingBlockOptions";
import React, { Fragment, useCallback, useEffect, useState } from "react";
const axios = require("axios").default;
import { useMessengerContext } from "Infrastructure/websocket";
// 10 minutes to make Log BB
// 10 minutes to set up Django model

export default function PostButton({ postURL, postData, bbsToRefresh }) {
  const messenger = useMessengerContext();
  const post = () => {
    axios
      .put(postURL, JSON.parse(postData))
      .then(function (response) {
        console.log("Start Machine", response);
      })
      .catch(function (error) {
        console.log("Start Machine Error", error);
      })
      .finally(() => {
            if (bbsToRefresh?.length > 0) {
      console.log("Refreshing");
      bbsToRefresh.forEach((bb) => messenger.emit(`refresh-${bb.bbID}`));
    }
      })


  };

  return (
    <Fragment>
      <div
        role="button"
        className="h-100 w-100 d-flex align-items-center justify-content-center bg-success text-white"
        onClick={post}
      >
        <h3 className="text-decoration-underline">Start Machine</h3>
      </div>
    </Fragment>
  );
}

PostButton.options = Object.freeze([
  { name: "postURL", verbose: "REST Endpoint URL", fieldType: "input", required: true },
  { name: "postData", verbose: "POST Data", fieldType: "input", required: true },
  {
    name: "bbsToRefresh",
    verbose: "Building Blocks to Refresh on Submit",
    fieldType: "optionArray",
    required: true,
    options: [{ name: "bbID", verbose: "Building Block ID", fieldType: "input" }],
  },
]);

PostButton.optionsClass = new BuildingBlockOptions(PostButton.options);
PostButton.displayStyle = "alone";
