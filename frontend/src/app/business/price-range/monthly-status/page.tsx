'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import Link from 'next/link';

ChartJS.register(ArcElement, Tooltip);

const MonthlyStatusPage = () => {
  const chartRef = useRef<ChartJS<"doughnut", number[], string> | null>(null);
  const [legendItems, setLegendItems] = useState<{label: string, color: string}[]>([]);

  const labels = ['～1,999円', '～3,999円', '～5,999円', '～7,999円', '～9,999円', '10,000円～'];
  const backgroundColors = [
    'rgba(255, 99, 132, 0.8)',
    'rgba(54, 162, 235, 0.8)',
    'rgba(255, 206, 86, 0.8)',
    'rgba(75, 192, 192, 0.8)',
    'rgba(153, 102, 255, 0.8)',
    'rgba(255, 159, 64, 0.8)'
  ];

  const data = {
    labels: labels,
    datasets: [{
      data: [20, 25, 30, 15, 7, 3],
      backgroundColor: backgroundColors,
      borderColor: backgroundColors.map(color => color.replace('0.8', '1')),
      borderWidth: 1
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: '月間おみやげ価格帯分布'
      }
    },
    cutout: '40%'
  };

  useEffect(() => {
    if (chartRef.current) {
      const legendItems = labels.map((label, index) => ({
        label,
        color: backgroundColors[index]
      }));
      setLegendItems(legendItems);
    }
  }, []);

  const buttonStyle = "bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transition duration-300 transform hover:scale-105 text-lg";

  return (
    <div className="container mx-auto py-8">
      <div className="w-full max-w-3xl mx-auto p-4">
        <h1 className="text-2xl font-bold text-center mb-6">今売れている価格帯(月次状況)</h1>
        <div className="bg-white shadow rounded-lg p-6">
          <div style={{ width: '100%', height: '300px' }}>
            <Doughnut data={data} options={options} ref={chartRef} />
          </div>
          <div className="mt-4 flex flex-col items-center">
            {[0, 1].map((row) => (
              <div key={row} className="flex justify-center w-full mb-2">
                {legendItems.slice(row * 3, (row + 1) * 3).map((item, index) => (
                  <div key={index} className="flex items-center mx-2">
                    <span 
                      className="w-3 h-3 inline-block mr-1" 
                      style={{ backgroundColor: item.color }}
                    ></span>
                    <span className="text-xs">{item.label}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
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

export default MonthlyStatusPage;