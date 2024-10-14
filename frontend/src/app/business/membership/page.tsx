'use client';

import React, { useState } from 'react';

export default function MembershipPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // 必要に応じてbodyにデータを追加
      });
      if (response.ok) {
        const { url } = await response.json();
        window.location.href = url;
      } else {
        const errorData = await response.json();
        console.error('Checkout failed:', errorData.error);
        // ユーザーにエラーを表示するロジックをここに追加
      }
    } catch (error) {
      console.error('Error:', error);
      // ユーザーにエラーを表示するロジックをここに追加
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="text-center max-w-2xl p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">有料会員登録</h1>
        <p className="text-lg text-gray-700 mb-6">
          ビジネス向け有料サービスの詳細情報と登録方法をご紹介します。
        </p>
        <div className="text-left mb-6">
          <h2 className="text-xl font-semibold text-blue-500 mb-2">サービス内容</h2>
          <ul className="list-disc list-inside text-gray-600">
            <li>リアルタイムの市場状況提供</li>
            <li>現在の商品の売れ行き分析</li>
            <li>オプション：商品開発支援</li>
            <li>オプション：プロモーション支援</li>
          </ul>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <h2 className="text-xl font-semibold text-blue-500 mb-2">料金プラン</h2>
          <p className="text-gray-600">お試し期間：2週間 無料</p>
          <p className="text-gray-600">月額料金：10,000円/月額</p>
        </div>
        <div className="flex justify-center">
          <button
            onClick={handleCheckout}
            disabled={isLoading}
            className="bg-blue-500 hover:bg-blue-600 text-white text-lg font-bold py-4 px-8 rounded-full shadow-lg transition duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                処理中...
              </span>
            ) : (
              '今すぐ登録'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}