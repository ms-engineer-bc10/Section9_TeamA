'use client';

import React, { useState, useEffect } from 'react';
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

// ChatGPTに送るプロンプトを生成する関数
const generatePrompt = (data: {
  labels: string[],
  datasets: {
    label: string;
    data: number[];
  }[];
}) => {
  // 各月の合計を計算
  const monthlyTotals = data.labels.map((_, monthIndex) => {
    return data.datasets.reduce((sum, dataset) => sum + dataset.data[monthIndex], 0);
  });

  // 価格帯ごとの成長率を計算
  const priceRangeGrowth = data.datasets.map(dataset => {
    const firstValue = dataset.data[0];
    const lastValue = dataset.data[dataset.data.length - 1];
    const growthRate = ((lastValue - firstValue) / firstValue * 100).toFixed(1);
    return `${dataset.label}: ${growthRate}%`;
  }).join(', ');

  // 月次の総検索数の推移
  const monthlyTrendData = data.labels.map((month, index) => 
    `${month}月: ${monthlyTotals[index]}件`
  ).join(', ');

  return `以下は、おみやげアプリにおける価格帯別の月次検索数推移データです。1000文字以内で詳細な分析を提供してください。

価格帯ごとの成長率: ${priceRangeGrowth}
月次検索数推移: ${monthlyTrendData}

分析ポイント：
1. 全体的な検索トレンドとその要因
2. 価格帯ごとの特徴的な変化とその背景
3. 季節性や特定イベントの影響
4. マーケティング戦略への示唆
5. 今後の展開に向けた具体的な推奨事項`;
};

const MonthlyTrendPage = () => {
  const [analysis, setAnalysis] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
          <h2 className="text-2xl font-bold text-center mb-6">おみやげ価格帯の月次推移</h2>
          <div className="bg-white shadow rounded-lg p-6">
            <Bar options={options} data={data} />
            
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

export default MonthlyTrendPage;