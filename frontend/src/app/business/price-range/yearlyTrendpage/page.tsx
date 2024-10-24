'use client';

import React, { useState, useEffect } from 'react';
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
  ChartOptions,
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

// 共通のスタイル定義
const contentWrapper = "min-h-screen bg-gray-100 p-4";
const contentInner = "max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 min-h-[calc(100vh-2rem)] flex flex-col";
const titleStyle = "text-4xl font-bold text-blue-600 mb-8 text-center";
const buttonStyle = "bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transition duration-300 transform hover:scale-105 text-lg";

// ChatGPTに送るプロンプトを生成する関数
const generatePrompt = (data: {
  labels: string[],
  datasets: {
    label: string;
    data: number[];
  }[];
}) => {
  // 各価格帯の成長率を計算
  const priceRangeAnalysis = data.datasets.map(dataset => {
    const firstValue = dataset.data[0];
    const lastValue = dataset.data[dataset.data.length - 1];
    const growthRate = ((lastValue - firstValue) / firstValue * 100).toFixed(1);
    const trend = lastValue > firstValue ? '上昇' : '下降';
    return `${dataset.label}: ${trend} (${growthRate}%)`;
  }).join('\n');

  // 年ごとの総件数を計算
  const yearlyTotals = data.labels.map((year, index) => {
    const total = data.datasets.reduce((sum, dataset) => sum + dataset.data[index], 0);
    return `${year}年: ${total}件`;
  }).join(', ');

  // 直近1年の変化率を計算
  const lastYearChange = data.datasets.map(dataset => {
    const lastYear = dataset.data[dataset.data.length - 1];
    const previousYear = dataset.data[dataset.data.length - 2];
    const changeRate = ((lastYear - previousYear) / previousYear * 100).toFixed(1);
    return `${dataset.label}: ${changeRate}%`;
  }).join(', ');

  return `以下は、おみやげアプリにおける価格帯別の年次販売件数推移データです。1000文字以内で詳細な分析を提供してください。

価格帯別トレンド:
${priceRangeAnalysis}

年間総件数推移: ${yearlyTotals}

直近1年の変化率:
${lastYearChange}

分析ポイント：
1. 長期的な価格帯の変化傾向とその要因
2. 消費者の予算選好の変化と社会経済的背景
3. 各価格帯における成功要因と課題
4. 競争環境の変化と市場ポジショニング
5. 今後のマーケティング戦略への具体的な示唆`;
};

const YearlyTrendPage = () => {
  const [analysis, setAnalysis] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

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

  const options: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: '販売件数',
        },
      },
    },
    animation: {
      duration: 1000,
      easing: 'linear',
    },
  };

  // データを分析してChatGPTの結果を取得する関数
  const analyzeData = async () => {
    setIsLoading(true);
    try {
      const prompt = generatePrompt(data);
      console.log('Sending prompt:', prompt);  // デバッグログ

      const response = await fetch('/api/business/analyze-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        console.error('API response not ok:', response.status);  // デバッグログ
        throw new Error('API request failed');
      }

      const result = await response.json();
      setAnalysis(result.analysis);
    } catch (error) {
      console.error('Analysis failed:', error);  // デバッグログ
      setAnalysis('データの解析中にエラーが発生しました。');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    analyzeData();
  }, []);

  return (
    <div className={contentWrapper}>
      <div className={contentInner}>
        <h1 className={titleStyle}>Business PAGE</h1>
        
        <div className="flex-grow">
          <h2 className="text-2xl font-bold text-center mb-6">おみやげ価格帯の年次推移</h2>
          <div className="bg-white shadow rounded-lg p-6">
            <Line options={options} data={data} />

          {/* ChatGPT分析結果表示セクション */}
          <div className="mt-6 p-6 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">AI分析レポート</h3>
              {isLoading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                </div>
              ) : (
                <div className="whitespace-pre-wrap break-words min-h-[200px] max-h-[600px] overflow-y-auto">
                  <p className="text-gray-700 leading-relaxed">{analysis}</p>
                </div>
              )}
            </div>
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

export default YearlyTrendPage;