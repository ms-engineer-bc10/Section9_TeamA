'use client';

import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import Link from 'next/link';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// 共通のスタイル定義
const contentWrapper = "min-h-screen bg-gray-100 p-4";
const contentInner = "max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 min-h-[calc(100vh-2rem)] flex flex-col";
const titleStyle = "text-4xl font-bold text-blue-600 mb-8 text-center";
const buttonStyle = "bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transition duration-300 transform hover:scale-105 text-lg";

const MonthlyTrendPage = () => {
  const labels = ['2310', '2311', '2312', '2401', '2402', '2403', '2404', '2405', '2406', '2407', '2408', '2409'];
  
  const generateMockData = (start: number, end: number) => {
    return labels.map((_, index) => Math.floor(start + (end - start) * (index / (labels.length - 1))));
  };

  const data = {
    labels,
    datasets: [
      {
        label: '～1,999円',
        data: generateMockData(100, 200),
        backgroundColor: 'rgba(255, 99, 132, 0.8)',
      },
      {
        label: '～3,999円',
        data: generateMockData(150, 250),
        backgroundColor: 'rgba(54, 162, 235, 0.8)',
      },
      {
        label: '～5,999円',
        data: generateMockData(200, 300),
        backgroundColor: 'rgba(255, 206, 86, 0.8)',
      },
      {
        label: '～7,999円',
        data: generateMockData(250, 350),
        backgroundColor: 'rgba(75, 192, 192, 0.8)',
      },
      {
        label: '～9,999円',
        data: generateMockData(300, 400),
        backgroundColor: 'rgba(153, 102, 255, 0.8)',
      },
      {
        label: '10,000円～',
        data: generateMockData(350, 450),
        backgroundColor: 'rgba(255, 159, 64, 0.8)',
      },
    ],
  };

  const options = {
    plugins: {
      title: {
        display: true,
        text: 'おみやげ価格帯の月次推移',
      },
    },
    responsive: true,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };

  return (
    <div className={contentWrapper}>
      <div className={contentInner}>
        <h1 className={titleStyle}>Business PAGE</h1>
        
        <div className="flex-grow">
          <h2 className="text-2xl font-bold text-center mb-6">おみやげ価格帯の月次推移</h2>
          <div className="bg-white shadow rounded-lg p-6">
            <Bar options={options} data={data} />
          </div>
        </div>
        
        <div className="mt-auto pt-6">
          <div className="flex justify-center">
            <Link href="/business/dashboard" className={buttonStyle}>
              ダッシュボードにもどる
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyTrendPage;