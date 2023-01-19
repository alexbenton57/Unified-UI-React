import React, { Fragment, useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axiosWrapper, { useHTTP } from './HTTP.js';
import faker from 'faker';

export function RechartDemoSuspense(props) {

	const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

	function getData(fetchedData) {
		const randomData = labels.map(() => faker.datatype.number({ min: 0, max: 100 }));
		const range = [...Array(7).keys()];
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
				<Legend />
				<Line type="monotone" dataKey="HTTP" stroke="#8884d8" activeDot={{ r: 8 }} />
				<Line type="monotone" dataKey="Random" stroke="#82ca9d" />
			</LineChart>

		</ResponsiveContainer >
	);

}

export function RechartDemoUseHTTP(props) {

	const [data, loading] = useHTTP("http://localhost:8000/datums/?name=datum1&history=7");
	const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];


	function getData() {
		const randomData = labels.map(() => faker.datatype.number({ min: 0, max: 100 }));
		const range = [...Array(7).keys()];
		const newData = range.map((i) => { return { "name": labels[i], "HTTP": data[i].value, "Random": randomData[i] } })
		return newData
	}

	if (loading) {
		return <p>Loading data...</p>
	} else {
		return (
			<ResponsiveContainer width="100%" height="100%">
				<LineChart
					width={500}
					height={300}
					data={getData()}
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
					<Legend />
					<Line type="monotone" dataKey="HTTP" stroke="#8884d8" activeDot={{ r: 8 }} />
					<Line type="monotone" dataKey="Random" stroke="#82ca9d" />
				</LineChart>
			</ResponsiveContainer >
		);
	}
}

export default function RechartDemo(props) {

	const [data, setData] = useState(null);
	const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
	const randomData = labels.map(() => faker.datatype.number({ min: 0, max: 100 }));

	useEffect(() => {
		axiosWrapper("get", "http://localhost:8000/datums/?name=datum1&history=7")
			.then((result) => {
				setData(result);

			});
	}, []);



	function getData() {
		const range = [...Array(7).keys()];
		const newData = range.map(i => { return { "name": labels[i], "HTTP": data[i].value, "Random": randomData[i] } })
		console.log(newData)
		return newData
	}

	if (!data) {
		return <p>Loading data...</p>
	} else {
		return (
			<ResponsiveContainer width="100%" height="100%">
				<LineChart
					width={500}
					height={300}
					data={getData()}
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
					<Legend />
					<Line type="monotone" dataKey="HTTP" stroke="#8884d8" activeDot={{ r: 8 }} />
					<Line type="monotone" dataKey="Random" stroke="#82ca9d" />
				</LineChart>
			</ResponsiveContainer >
		);
	}



}