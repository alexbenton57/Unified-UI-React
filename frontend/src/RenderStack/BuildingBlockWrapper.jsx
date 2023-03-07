import React, { Suspense, useState, useMemo, useCallback, useEffect } from "react";
import LoadingSpinner from "Infrastructure/Spinner";
import BuildingBlockConfig from "Classes/BuildingBlockConfig";
import BuildingBlockPropFetcher from "./BuildingBlockPropFetcher";
import ErrorBoundary from "Infrastructure/ErrorBoundary";
import { ArrowClockwise, InfoCircle } from "react-bootstrap-icons";
import stringify from "Utils/stringify";
import ALL_BUILDING_BLOCKS from "BuildingBlocks/ALL_BUILDING_BLOCKS";
import useMessengerCallback from "Hooks/useMessengerCallback";
import HoverTooltip from "Infrastructure/HoverTooltip";

// https://www.developerway.com/posts/react-re-renders-guide
// https://www.developerway.com/posts/how-to-write-performant-react-code

const MemoizedBuildingBlockPropFetcher = React.memo(BuildingBlockPropFetcher);

export default function BuildingBlockWrapper({ config }) {
  const [errors, setErrors] = useState([]);
  console.log("render - BuildingBlockWrapper", config.title, "errors:", errors, config);
  const [resetErrors, setResetErrors] = useState(0);
  const [currentConfig, setCurrentConfig] = useState(() => new BuildingBlockConfig(config));

  const newConfigClass = useCallback(() => {
    console.log("Refreshing", config, resetErrors);
    setErrors([]);
    setCurrentConfig(new BuildingBlockConfig(config));
  }, [setCurrentConfig, setResetErrors]);

  const setWrapperErrors = useMemo(() => setErrors, [setErrors]);
  const memoizedConfig = useMemo(() => currentConfig, [currentConfig]);

  // refresh data when requested (by another BB)
  useMessengerCallback(`refresh-${config.id}`, () => {
    newConfigClass();
  });

  const children = (
    <Suspense fallback={<LoadingSpinner />}>
      <ErrorBoundary fallback={<p>Error in rendering card contents</p>}>
        <MemoizedBuildingBlockPropFetcher
          config={memoizedConfig}
          setWrapperErrors={setWrapperErrors}
        />
      </ErrorBoundary>
    </Suspense>
  );

  // return building block based on display style 
  // (this could be added as a regular building block option in the same way as 'title')
  switch (ALL_BUILDING_BLOCKS[config.bbType].displayStyle) {
    case "headerless":
      return (
        <div className="d-flex border rounded justify-content-between align-items-stretch h-100 card-shadow">
          <div className="overflow-auto rounded-start flex-fill me-auto">{children}</div>
          <div className="d-flex flex-column align-items-center rounded-end px-1 bg-light">
            <span className="mb-2">
              <ErrorDropdown errors={errors} />
            </span>

            <span className="mb-2" role="button" onClick={newConfigClass}>
              <ArrowClockwise />
            </span>
            <span className="mb-2">
              <ConfigDropdown config={config} />
            </span>
          </div>
        </div>
      );
    case "alone":
      return <div className="border rounded overflow-auto h-100 w-100">{children}</div>;
    default:
      return (
        <div className="card h-100 card-shadow">
          <div className="card-header d-flex justify-content-between">
            <span>{config.title}</span>
            <span className="text-secondary fs-6">
              <ErrorDropdown errors={errors} />
              <span className="mx-3" role="button" onClick={newConfigClass}>
                <ArrowClockwise />
              </span>
              <ConfigDropdown config={config} />
            </span>
          </div>
          <div className="card-body">{children}</div>
        </div>
      );
  }
}

// displays data fetching errors
function ErrorDropdown({ errors }) {
  if (errors.length > 0)
    return (
      <span className="btn-group">
        <span
          className="text-danger dropdown-toggle d-flex align-items-center"
          role="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          Errors
        </span>
        <ul
          className="dropdown-menu dropdown-menu-end"
          style={{ zIndex: 1000000, position: "relative" }}
        >
          {errors.map((error, i) => (
            <li key={i}>
              <span className="dropdown-item-text">{stringify(error)}</span>
            </li>
          ))}
        </ul>
      </span>
    );
}

function ConfigDropdown({ config }) {
  return (
    <HoverTooltip toShow={<pre>{stringify(config)}</pre>}>
      <InfoCircle />
    </HoverTooltip>
  );
}