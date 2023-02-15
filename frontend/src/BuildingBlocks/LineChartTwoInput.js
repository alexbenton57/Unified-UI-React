import React, { Fragment, useEffect, useState } from 'react';
import { LineChart as Chart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import BuildingBlockOptions from "Classes/BuildingBlockOptions";
export default function LineChartTwoInput({ dataSeries1, dataSeries2, lineType, seriesName1, seriesName2, twoDataSeries }) {

    console.log("render - LineChart", lineType)

    const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

    function getData() {

        const range = [...Array(7).keys()];
        const newData = range.map((i) => { return { ["name"]: labels[i], "Series1": dataSeries1[i], "Series2": dataSeries2[i] } })
        return newData
    }

    function tryValue(series, index) {
        return series[index] ? series[index] : undefined
    }
    return (

        <ResponsiveContainer width="100%" height="100%">
            <Chart
                width={500}
                height={300}
                data={getData()}
                margin={{
                    top: 5,
                    right: 30,
                    left: 5,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line name={seriesName1} type={lineType} dataKey="Series1" stroke="#8884d8" activeDot={{ r: 8 }} />
                {twoDataSeries && <Line name={seriesName2} type={lineType} dataKey="Series2" stroke="#82ca9d" />}
            </Chart>

        </ResponsiveContainer >
    )

}
// Broadly 2 options for handling input data to a BB - input cleaning, or robustness to bad data 
// Input cleaning/checking can be done globally

LineChartTwoInput.options = Object.freeze([
    // labels alphanumeric only
    { name: "twoDataSeries", verbose: "Two Data Series", defaultValue: true, fieldType: "boolean"},
    { name: "dataSeries1", verbose: "Series 1 Data",   fieldType: "dataSource", required:true },
    { name: "seriesName1", verbose: "Series 1 Name", defaultValue: "Series 1", fieldType: "input" },
    { name: "dataSeries2", verbose: "Series 2 Data", enabledBy:"twoDataSeries", fieldType: "dataSource", required: true },
    { name: "seriesName2", verbose: "Series 2 Name", enabledBy:"twoDataSeries", defaultValue: "Series 2", fieldType: "input" },
    { name: "lineType", verbose: "Line Type", initial: "basis", fieldType: "choice", choices: ['basis', 'linear', 'linearClosed', 'natural', 'monotone', 'step'] },


])

LineChartTwoInput.optionsClass = new BuildingBlockOptions(LineChartTwoInput.options)