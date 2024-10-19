'use client';

import React from 'react';
import { Line } from 'react-chartjs-2';
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
import Link from 'next/link';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const YearlyTrendPage = () => {
  const labels = ['2019', '2020', '2021', '2022', '2023'];

  const generateTrendData = (start: number, end: number, trend: 'up' | 'down') => {
    return labels.map((_, index) => {
      const progress = index / (labels.length - 1);
      if (trend === 'up') {
        return Math.round(start + (end - start) * Math.pow(progress, 0.5));
      } else {
        return Math.round(start + (end - start) * (1 - Math.pow(1 - progress, 0.5)));
      }
    });
  };

  const data = {
    labels,
    datasets: [
      {
        label: '～1,999円',
        data: generateTrendData(1000, 3000, 'up'),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: '～3,999円',
        data: generateTrendData(1200, 2800, 'up'),
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      },
      {
        label: '～5,999円',
        data: generateTrendData(1500, 2500, 'down'),
        borderColor: 'rgb(255, 206, 86)',
        backgroundColor: 'rgba(255, 206, 86, 0.5)',
      },
      {
        label: '～7,999円',
        data: generateTrendData(1800, 2200, 'down'),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
      {
        label: '～9,999円',
        data: generateTrendData(2000, 1500, 'down'),
        borderColor: 'rgb(153, 102, 255)',
        backgroundColor: 'rgba(153, 102, 255, 0.5)',
      },
      {
        label: '10,000円～',
        data: generateTrendData(3000, 1000, 'down'),
        borderColor: 'rgb(255, 159, 64)',
        backgroundColor: 'rgba(255, 159, 64, 0.5)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'おみやげ価格帯の年次推移',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: '販売数量',
        },
      },
    },
  };

  const buttonStyle = "bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transition duration-300 transform hover:scale-105 text-lg";

  return (
    <div className="container mx-auto py-8">
      <div className="w-full max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-bold text-center mb-6">おみやげ価格帯の年次推移</h1>
        <div className="bg-white shadow rounded-lg p-6">
          <Line options={options} data={data} />
        </div>
        <div className="mt-6 flex justify-center">
          <Link href="/business/dashboard" className={buttonStyle}>
            ダッシュボードにもどる
          </Link>
        </div>
      </div>
    </div>
  );
};

export default YearlyTrendPage;