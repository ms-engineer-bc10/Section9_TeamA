'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const RankingPage = dynamic(() => import('../../components/ranking'), {
  loading: () => <p>Loading...</p>,
});

export default function ProceedPage() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4'>
      <div className='w-full max-w-2xl p-4 mb-8 border-4 border-blue-500 rounded-md text-center bg-white shadow-md'>
        <h1 className='text-2xl font-bold text-gray-800'>
          人気のお土産ランキング
        </h1>
      </div>
      <div className='w-full max-w-2xl bg-white rounded-lg shadow-md overflow-hidden'>
        <div className='h-[calc(100vh-240px)] overflow-y-auto'>
          <RankingPage />
        </div>
      </div>
    </div>
  );
}
