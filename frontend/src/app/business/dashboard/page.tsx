'use client';

import React from 'react';
import Link from 'next/link';

// 共通のスタイル定義
const contentWrapper = "min-h-screen bg-gray-100 p-4";
const contentInner = "max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 min-h-[calc(100vh-2rem)] flex flex-col";
const titleStyle = "text-4xl font-bold text-blue-600 mb-8 text-center";
const buttonStyle = "bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transition duration-300 transform hover:scale-105 text-lg";

export default function BusinessDashboard() {
  return (
    <div className={contentWrapper}>
      <div className={contentInner}>
        <h1 className={titleStyle}>Business PAGE</h1>
        
        <div className="flex-grow">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">ダッシュボード</h2>
          
          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 ">利用可能なサービス</h3>
            </div>
            <div className="border-t border-gray-200">
              <div className="px-4 py-5 sm:p-6">
                <h4 className="text-lg leading-6 font-bold text-gray-900 mb-2">＜市場分析＞</h4>
                <p className="text-lg leading-6 text-gray-700 mb-6">リアルタイムの市場状況を分析し、レポートを提供します。</p>
                <div className="flex flex-col space-y-6">
                  <div>
                    <span className="text-lg leading-6 font-medium text-gray-900">１．今売れている価格帯</span>
                    <div className="flex flex-wrap gap-4 justify-end mt-2">
                      <Link href="/business/price-range/monthly-status">
                        <button className={buttonStyle}>月次状況</button>
                      </Link>
                      <Link href="/business/price-range/monthlyTrendpage">
                        <button className={buttonStyle}>月次推移</button>
                      </Link>
                      <Link href="/business/price-range/yearlyTrendpage">
                        <button className={buttonStyle}>年次推移</button>
                      </Link>
                    </div>
                  </div>
                  <div>
                    <span className="text-lg leading-6 font-medium text-gray-900">２．購入されているエリア</span>
                    <div className="flex flex-wrap gap-4 justify-end mt-2">
                      <Link href="/business/construction">
                        <button className={buttonStyle}>月次状況</button>
                      </Link>
                      <Link href="/business/construction">
                        <button className={buttonStyle}>月次推移</button>
                      </Link>
                      <Link href="/business/construction">
                        <button className={buttonStyle}>年次推移</button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-auto">
          <div className="flex justify-center">
            <Link href="/business/service" className={buttonStyle}>
              会員トップページに戻る
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}