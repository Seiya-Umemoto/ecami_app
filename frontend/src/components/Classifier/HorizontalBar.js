import React from 'react';
import { Bar } from 'react-chartjs-2';

const data = {
  labels: ['effectA', 'effectB', 'effectC', 'effectD', 'effectE', 'effectF'],
  datasets: [
    {
      label: 'Accuracy(%)',
      data: [92, 75, 72, 63, 62, 57],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
      ],
      borderWidth: 1,
    },
  ],
};

const options = {
  indexAxis: 'y',
  // Elements options apply to all of the options unless overridden in a dataset
  // In this case, we are setting the border of each horizontal bar to be 2px wide
  elements: {
    bar: {
      borderWidth: 2,
    },
  },
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom',
    },
    title: {
      display: true,
      text: 'Sequence classified as:',
    },
  },
};

const HorizontalBarChart = (props) => (
  <>
    <div className='header'>
      <h1 className='title'>Classified as: {props.classified}</h1>
      <p>Gamma: {props.gamma}</p>
      <div className='links'>
        <a
          className='btn btn-gh'
          href='https://github.com/reactchartjs/react-chartjs-2/blob/master/example/src/charts/HorizontalBar.js'
        >
        </a>
      </div>
    </div>
    <Bar data={data} options={options} />
  </>
);

export default HorizontalBarChart;