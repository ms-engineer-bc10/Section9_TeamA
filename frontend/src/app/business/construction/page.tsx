'use client';

import React from 'react';
import Link from 'next/link';

export default function ConstructionPage() {
  const buttonStyle = "bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transition duration-300 transform hover:scale-105 text-lg";

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            工事中
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            このページは現在準備中です。しばらくお待ちください。
          </p>
        </div>
        <div className="mt-8 flex justify-center">
          <Link href="/business/dashboard">
            <button className={buttonStyle}>
              ダッシュボードに戻る
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}