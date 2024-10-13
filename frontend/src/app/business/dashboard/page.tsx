'use client';

import React from 'react';
import Link from 'next/link';

export default function BusinessDashboard() {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">ビジネスダッシュボード</h1>
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg leading-6 font-medium text-gray-900">利用可能なサービス</h2>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">市場分析</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  リアルタイムの市場状況を分析し、レポートを提供します。
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">売上レポート</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  商品の売れ行きを詳細に分析したレポートを生成します。
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">商品開発支援</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  市場トレンドに基づいた新商品の開発アイデアを提案します。
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">プロモーション戦略</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  効果的なプロモーション戦略を提案し、実施をサポートします。
                </dd>
              </div>
            </dl>
          </div>
        </div>
        <div className="mt-8">
        <div className="flex justify-center">
          <Link href="/business/service" className="bg-blue-500 hover:bg-blue-600 text-white text-lg font-bold py-4 px-8 rounded-full shadow-lg transition duration-300 transform hover:scale-105">
            ← 会員トップページに戻る
          </Link>
        </div>
        </div>
      </div>
    </div>
  );
}