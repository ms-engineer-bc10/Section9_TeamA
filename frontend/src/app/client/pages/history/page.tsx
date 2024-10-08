'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import MenuBar from '@/app/client/components/menubar';

interface HistoryItem {
  id: string;
  date: string;
  answers: {
    location: string; //
    target: string; //
    genre: string; //
    budget: string; //
    quantity: string; //
  };
  image: string;
}

const mockHistoryItems: HistoryItem[] = [
  {
    id: '1',
    date: '10/1',
    answers: {
      location: '2〜5個',
      target: '東京',
      genre: '友人',
      budget: '和菓子',
      quantity: '¥1,000〜2,999',
    },
    image: '/api/placeholder/100/100',
  },
  // ... 他のモックデータ項目
];

const HistoryItem: React.FC<{ item: HistoryItem }> = ({ item }) => (
  <div className='border rounded-lg p-2'>
    <div className='grid grid-cols-6 gap-2 items-center'>
      <div className='row-span-3 flex items-center justify-center'>
        <div className='w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center'>
          <span className='text-lg font-semibold'>{item.date}</span>
        </div>
      </div>
      <div className='col-span-4 grid grid-cols-2 gap-1'>
        {Object.entries(item.answers).map(([key, value]) => (
          <div
            key={key}
            className='py-1 px-2 text-sm rounded-md bg-gray-200 text-gray-700 truncate'
          >
            {value}
          </div>
        ))}
      </div>
      <div className='row-span-3'>
        <Image
          src={item.image}
          alt='選択したアイテム'
          width={96}
          height={96}
          className='object-cover rounded-md mx-auto'
        />
      </div>
    </div>
  </div>
);

const Pagination: React.FC<{
  currentPage: number;
  totalPages: number;
  onPrevPage: () => void;
  onNextPage: () => void;
}> = ({ currentPage, totalPages, onPrevPage, onNextPage }) => (
  <div className='flex justify-between mt-4'>
    <button
      onClick={onPrevPage}
      disabled={currentPage === 1}
      className='py-2 px-4 text-sm rounded-md bg-gray-300 text-gray-700 hover:bg-gray-400 transition-colors disabled:opacity-50'
    >
      前へ
    </button>
    <span className='py-2 px-4 text-sm'>
      {currentPage} / {totalPages}
    </span>
    <button
      onClick={onNextPage}
      disabled={currentPage === totalPages}
      className='py-2 px-4 text-sm rounded-md bg-gray-300 text-gray-700 hover:bg-gray-400 transition-colors disabled:opacity-50'
    >
      次へ
    </button>
  </div>
);

const History: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = mockHistoryItems.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(mockHistoryItems.length / itemsPerPage);

  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <div className='flex flex-col items-center justify-start min-h-screen bg-gray-100 pb-24'>
      <div className='w-full max-w-4xl bg-white shadow-md rounded-lg p-6 my-8'>
        <h1 className='text-xl font-semibold mb-4 text-center'>検索履歴</h1>
        <div className='space-y-4 max-h-[60vh] overflow-y-auto'>
          {currentItems.map((item) => (
            <HistoryItem key={item.id} item={item} />
          ))}
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPrevPage={handlePrevPage}
          onNextPage={handleNextPage}
        />
      </div>
      <MenuBar />
    </div>
  );
};

export default History;
