'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import Link from 'next/link';

ChartJS.register(ArcElement, Tooltip);

// 共通のスタイル定義
const contentWrapper = "min-h-screen bg-gray-100 p-4";
const contentInner = "max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 min-h-[calc(100vh-2rem)] flex flex-col";
const titleStyle = "text-4xl font-bold text-blue-600 mb-8 text-center";
const buttonStyle = "bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transition duration-300 transform hover:scale-105 text-lg";

// ChatGPTに送るプロンプトを生成する関数
const generatePrompt = (data: { labels: string[], datasets: { data: number[] }[] }) => {
  const totalSearches = data.datasets[0].data.reduce((a, b) => a + b, 0);
  const distribution = data.labels.map((label, i) => {
    const percentage = ((data.datasets[0].data[i] / totalSearches) * 100).toFixed(1);
    return `${label}: ${percentage}%`;
  }).join(', ');

  return `以下は、おみやげアプリで集計された価格帯の検索割合です。このデータから、ユーザーの予算傾向と商品展開についての詳細な分析と示唆を提供してください。制限は1000文字以内です。

データ: ${distribution}

分析ポイント：
1. 各価格帯の特徴と傾向
2. ユーザーの予算選好性
3. 販売戦略への示唆
4. 今後の展開に向けた推奨事項`;
};


const MonthlyStatusPage = () => {
  const chartRef = useRef<ChartJS<"doughnut", number[], string> | null>(null);
  const [legendItems, setLegendItems] = useState<{label: string, color: string}[]>([]);
  const [analysis, setAnalysis] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
    if (chartRef.current) {
      const legendItems = labels.map((label, index) => ({
        label,
        color: backgroundColors[index]
      }));
      setLegendItems(legendItems);
    }
    // コンポーネントマウント時にデータ解析を実行
    analyzeData();
  }, []);

  return (
    <div className={contentWrapper}>
      <div className={contentInner}>
        <h1 className={titleStyle}>Business PAGE</h1>
        
        <div className="flex-grow">
          <h2 className="text-2xl font-bold text-center mb-6">今売れている価格帯(月次状況)</h2>
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

export default MonthlyStatusPage;