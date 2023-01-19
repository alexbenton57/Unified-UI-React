import React, { useEffect, useState } from 'react';

const axios = require('axios').default;

/* Usage:
  useEffect(() => {
    axiosWrapper("get", "http://localhost:8000/datums/?name=datum1&history=7")
      .then((result) => { setData(result) });
  }, []);
 */
export default async function axiosWrapper(method, url, data = null) {

	if (method.toUpperCase() === "GET") {

		const res = await axios.get(url)
			.catch(function (error) {
				console.log(error);
			});
		if (res) {
			console.log("Async Result", res.data.results);
			return res.data.results;
		}


	} else if (method.toUpperCase() === "POST") {

		console.log("Posting:");
		console.log(data);
		const res = await axios.post(url, data)
			.then(function (response) {
				console.log(response);
			})
			.catch(function (error) {
				console.log(error);
			});


	};

}

//const [data, loading] = useHTTP("http://localhost:8000/datums/?name=datum1&history=7");
export function useHTTP(url, interval) {

	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {

		async function getData() {
			const res = await axios.get(url)
				.then(result =>{ setData(result.data.results); setLoading(false); console.log("useHTTP Data", result)})
				.catch(err => console.log("useHTTP Error", err));
		}

		getData()
	}, [])

	return ([data, loading]);

}
