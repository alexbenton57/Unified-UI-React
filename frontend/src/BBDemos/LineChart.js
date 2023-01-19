import React, { Fragment, useEffect, useState } from 'react';
import { LineChart as Chart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import faker from 'faker';

export default function LineChart(props) {

    console.log("render - LineChart")

    return (
        <Fragment>
            <p>Linechart Dummy</p>
            <p>{JSON.stringify(props)}</p>
        </Fragment>
    )


    /*
    const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

    function getData(fetchedData) {

        const arrLength = 0
        try {arrLength = Array.length(fetchedData)} catch(error) { }

        const randomData = labels.map(() => faker.datatype.number({ min: 0, max: 100 }));
        const range = [...Array(arrLength).keys()];
        const newData = range.map((i) => { return { "name": labels[i], "HTTP": fetchedData[i].value, "Random": randomData[i] } })
        return newData
    }


    return (

        <ResponsiveContainer width="100%" height="100%">
            <LineChart
                width={500}
                height={300}
                data={getData(props.data)}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend className={"text-" + props.dataColour}/>
                <Line names={props.seriesName} type="monotone" dataKey="HTTP" stroke="#8884d8" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="Random" stroke="#82ca9d" />
            </LineChart>

        </ResponsiveContainer >
    )
    */

}
// Broadly 2 options for handling input data to a BB - input cleaning, or robustness to bad data 
// Input cleaning/checking can be done globally

LineChart.options = Object.freeze([
    // labels alphanumeric only
    { label: "dataSeries", verbose: "Series 1 Data", initial: [], type: "array", dataSource: true },
    { label: "dataColour", verbose: "Data Colour", initial: "danger", type: "choice", choices: ["danger", "success", "warning"] },
    { label: "seriesName", verbose: "Series 1 Name", initial: "HTTP Data", type: "text" },

   
    //{ label: "multiSeries", verbose: "Multi Series Data", type: "float", initial: 0, dataSource: true, multiple: true },

])
