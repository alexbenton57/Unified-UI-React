import React, { Fragment, useEffect, useState } from 'react'
import useMessenger from '../Hooks/useMessenger';
export function LargeNumber(props) {

    return (
        <Fragment>
            <div className="text-center">42%</div>
        </Fragment>
    )

}

export const SocketEnabledIndicator = () => {

    const [subscribedTag, setSubscribedTag] = useState("channel1");

    const value = useMessenger(subscribedTag);

    const handleChange = (e) => {
        setSubscribedTag(e.target.value, -1);
    };

    const doubleValue = (e) => {
        return (2 * e)
    };

    return (
        <Fragment>
            <div>Subscribed to tag: </div>
            <input type="text" value={subscribedTag} onChange={handleChange} />
            <div>Received Value: {value}</div>
            <div>Doubled: {doubleValue(value)}</div>


        </Fragment>
    );

};



export const ConfigurableIndicator = (props) => {

    const options = {
        title: "Title is a card-level property",
        footer: "Also card-level",
        orientation: { options: ["Vertical", "Horizontal"] }, // options field indicates form should have a choice
        dataSource: { options: ["Channel 1", "channel 2"] }
    };

    const value = useMessenger("channel1", 0)
    const [redEnd, setRedEnd] = useState(15);
    const [yellowEnd, setYellowEnd] = useState(50);


    function progressBar(value, redEnd, yellowEnd) {

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
                <div className="progress-bar bg-success" role="progressbar" style={{ width: `${config.greenW}%`, visibility: config.yellowV? 'visible':'hidden' }} aria-valuenow={config.greenW.toString()} aria-valuemin="0" aria-valuemax="100"></div>
            </div>
        )
    }


    return (
        <Fragment>
            <div>Red End:</div>
            <input type="text" value={redEnd} onChange={(e) => setRedEnd(e.target.value)} />
            <div>Yellow End:</div>
            <input type="text" value={yellowEnd} onChange={(e) => setYellowEnd(e.target.value)} />
            {progressBar(value, redEnd, yellowEnd)}
            <p>Aim is to create a component with values that can be configured from props. Eg a progress bar with the </p>
            <p>Want to be able to extract a menu of options for a configuration tool. We want this menu to be defined in a single place - in the component itself makes sense (or maybe as a seperate const in the component's file) </p>
            
        </Fragment>
    )
}

ConfigurableIndicator.options = {
    redEnd: "float",
    yellowEnd: "float",
    greenColour: {options: ["danger", "success", "warning"]},
    title: "string"
}
