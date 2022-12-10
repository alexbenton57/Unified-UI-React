import React, { Fragment, useEffect, useState } from 'react'
import { subscribeToSocketWithTag, listenToSocketWithTag } from '../websocket'


export const ConfigurableComponent = (props) => {



    const value = subscribeToSocketWithTag("100", 0)
    const [redEnd, setRedEnd] = useState(15);
    const [yellowEnd, setYellowEnd] = useState(50);


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
                    redW: redEnd, yellowW: yellowEnd-redEnd, greenW: value-yellowEnd,
                    redV: true, yellowV: true, greenV: true
                };
                break;

        }
           


        return (
            <div className="progress">
                <div className="progress-bar bg-danger" role="progressbar" style={{ width: `${config.redW}%`, visibility: config.redV ? 'visible':'hidden' }} aria-valuenow={config.redW.toString()} aria-valuemin="0" aria-valuemax="100"></div>
                <div className="progress-bar bg-warning" role="progressbar" style={{ width: `${config.yellowW}%`, visibility: config.yellowV? 'visible':'hidden' }} aria-valuenow={config.yellowW.toString()} aria-valuemin="0" aria-valuemax="100"></div>
                <div className={"progress-bar bg-"+greenColor} role="progressbar" style={{ width: `${config.greenW}%`, visibility: config.yellowV? 'visible':'hidden' }} aria-valuenow={config.greenW.toString()} aria-valuemin="0" aria-valuemax="100"></div>
            </div>
        )
    }


    return (
        <Fragment>
            <p>This component receives appearance parameters from the JSON input above. </p>
            {progressBar(value, props.redEnd, props.yellowEnd, props.greenColor)}
            <p>Lots of error checking needs to be addd to this! Invalid JSON will break the component.</p>
            <p>The template json from the above should be able to be extracted from the code of thecomponent itself to keep things DRY. The ability to auto generate a form would be useful too (this will have to be done anyway to create a proper user input building block.)</p>
            <p>Want to be able to extract a menu of options for a configuration tool. We want this menu to be defined in a single place - in the component itself makes sense (or maybe as a seperate const in the component's file) </p>

        </Fragment>
    )
}

ConfigurableComponent.options = {
    title: "Title is a card-level property",
    footer: "Also card-level",
    orientation: { options: ["Vertical", "Horizontal"] }, // options field indicates form should have a choice
    dataSource: { options: ["Channel 1", "channel 2"] },
}
