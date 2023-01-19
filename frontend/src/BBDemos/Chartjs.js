import React, { Fragment, useState, useEffect } from 'react';
import axiosWrapper from './HTTP';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import { Line } from 'react-chartjs-2';
import faker from 'faker';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Chart.js Line Chart',
    },
  },
};

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

export const staticData = (httpData) => {
  return ({
    labels,
    datasets: [
      {
        label: 'HTTP Dataset',
        data: httpData.map((datum) => datum.value),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Random Dataset',
        data: labels.map(() => faker.datatype.number({ min: 0, max: 100 })),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  })
};

export default function ChartDemo() {

  const [data, setData] = useState(null);


  useEffect(() => {
    axiosWrapper("get", "http://localhost:8000/datums/?name=datum1&history=7")
      .then((result) => {
        setData(result);

      });
  }, []);

  if (!data) {
    return <p>Loading data...</p>
  } else {
    return (
      <Fragment>
        <Line options={options} data={staticData(data)} />
      </Fragment>
    )
  }

}
