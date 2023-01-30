import React, { Fragment, useEffect, useState } from 'react'
import useMessenger from 'Hooks/useMessenger';
import BuildingBlockOptions from "Classes/BuildingBlockOptions";

export default function ProgressBar(props) {

    const value = useMessenger(props.socketChannel, 0)

    function progressBar(value, redEnd, yellowEnd, greenColor) {

        const sector = value < redEnd ? "red" : (value < yellowEnd ? "yellow" : "green");
        var config = {}
        switch (sector) {
            case "red":
                config = {
                    redW: value, yellowW: 0, greenW: 0,
                    redV: true, yellowV: false, greenV: false
                };
                break;
            case "yellow":
                config = {
                    redW: redEnd, yellowW: value - redEnd, greenW: 0,
                    redV: true, yellowV: true, greenV: false
                };
                break;
            case "green":
                config = {
                    redW: redEnd, yellowW: yellowEnd - redEnd, greenW: value - yellowEnd,
                    redV: true, yellowV: true, greenV: true
                };
                break;
            default: 
                throw new Error("Expected red, yellow, or green")

        }



        return (
            <div className="progress">
                <div className="progress-bar bg-danger" role="progressbar" style={{ width: `${config.redW}%`, visibility: config.redV ? 'visible' : 'hidden' }} aria-valuenow={config.redW.toString()} aria-valuemin="0" aria-valuemax="100"></div>
                <div className="progress-bar bg-warning" role="progressbar" style={{ width: `${config.yellowW}%`, visibility: config.yellowV ? 'visible' : 'hidden' }} aria-valuenow={config.yellowW.toString()} aria-valuemin="0" aria-valuemax="100"></div>
                <div className={"progress-bar bg-" + greenColor} role="progressbar" style={{ width: `${config.greenW}%`, visibility: config.yellowV ? 'visible' : 'hidden' }} aria-valuenow={config.greenW.toString()} aria-valuemin="0" aria-valuemax="100"></div>
            </div>
        )
    }


    return (
        <Fragment>
            {console.log("render = ConfigurableComponent", props)}

            {progressBar(value, props.redEnd, props.yellowEnd, props.greenColor)}
            <p>Progress Bar Value: {value}</p>
        </Fragment>
    )
}

ProgressBar.options = Object.freeze([
    { label: "redEnd", verbose: "Red End Boundary", initial: 10, type: "float" },
    { label: "yellowEnd", verbose: "Yellow End Boundary", initial: 50, type: "float" },
    { label: "greenColor", verbose: "End Zone Colour", initial: "danger", type: "choice", choices: ["danger", "success", "warning"] },
    { label: "socketChannel", verbose: "Web Socket Channel", initial: "100", type: "choice", choices: ["100", "channel1", "channel2"] },
])
// 

ProgressBar.optionsClass = new BuildingBlockOptions(ProgressBar.options)