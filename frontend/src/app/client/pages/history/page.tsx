'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Trash2 } from 'lucide-react';
import MenuBar from '@/app/client/components/menubar';

interface HistoryItem {
  id: string;
  date: string;
  answers: {
    location: string;
    target: string;
    genre: string;
    budget: string;
    quantity: string;
  };
  image: string;
}

const mockHistoryItems: HistoryItem[] = [
  {
    id: '1',
    date: '10/1',
    answers: {
      location: '現在地',
      target: '友人',
      genre: '食べ物',
      budget: '1,000～1,999',
      quantity: '5個以内',
    },
    image: '/api/placeholder/100/100',
  },
  {
    id: '2',
    date: '10/2',
    answers: {
      location: '東京',
      target: '家族',
      genre: 'お土産',
      budget: '2,000～4,999',
      quantity: '10個以内',
    },
    image: '/api/placeholder/100/100',
  },
  {
    id: '3',
    date: '10/3',
    answers: {
      location: '大阪',
      target: '同僚',
      genre: '雑貨',
      budget: '5,000～9,999',
      quantity: '3個以内',
    },
    image: '/api/placeholder/100/100',
  },
  {
    id: '4',
    date: '10/4',
    answers: {
      location: '京都',
      target: '恋人',
      genre: 'アクセサリー',
      budget: '10,000～19,999',
      quantity: '1個',
    },
    image: '/api/placeholder/100/100',
  },
  {
    id: '5',
    date: '10/5',
    answers: {
      location: '北海道',
      target: '先生',
      genre: 'スイーツ',
      budget: '1,000～1,999',
      quantity: '6個以内',
    },
    image: '/api/placeholder/100/100',
  },
  {
    id: '6',
    date: '10/6',
    answers: {
      location: '沖縄',
      target: '自分用',
      genre: 'ファッション',
      budget: '20,000以上',
      quantity: '2個以内',
    },
    image: '/api/placeholder/100/100',
  },
];

const HistoryItem: React.FC<{
  item: HistoryItem;
  onDelete: (id: string) => void;
}> = ({ item, onDelete }) => (
  <div className='border rounded-lg p-2'>
    <div className='grid grid-cols-7 gap-1 items-center'>
      <div className='row-span-3 flex items-center justify-center'>
        <div className='w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center'>
          <span className='text-sm font-bold'>{item.date}</span>
        </div>
      </div>
      <div className='col-span-4 grid grid-cols-2 gap-1'>
        {Object.entries(item.answers).map(([key, value], index) => (
          <div
            key={key}
            className={`py-1 px-1 text-xs rounded-md bg-gray-200 text-gray-700 truncate font-semibold ${
              index === 4 ? 'col-span-1' : ''
            }`}
          >
            {value}
          </div>
        ))}
        <button
          onClick={() => onDelete(item.id)}
          className='py-1 px-1 text-xs rounded-md bg-red-500 text-white font-semibold flex items-center justify-center hover:bg-red-600 transition-colors'
        >
          <Trash2 size={14} className='mr-1' /> 削除
        </button>
      </div>
      <div className='col-span-2 row-span-3 border-2 border-gray-300 rounded-md overflow-hidden'>
        {' '}
        {/* overflow-hidden を追加 */}
        <div
          className='relative w-full h-full'
          style={{ aspectRatio: '1 / 1' }}
        >
          {' '}
          {/* アスペクト比を1:1に固定 */}
          <Image
            src={item.image}
            alt='選択したアイテム'
            layout='fill'
            objectFit='cover'
            className='rounded-md'
          />
        </div>
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
      className='py-2 px-4 text-xs rounded-md bg-gray-300 text-gray-700 hover:bg-gray-400 transition-colors disabled:opacity-50 font-semibold'
    >
      前へ
    </button>
    <span className='py-2 px-4 text-xs font-semibold'>
      {currentPage} / {totalPages}
    </span>
    <button
      onClick={onNextPage}
      disabled={currentPage === totalPages}
      className='py-2 px-4 text-xs rounded-md bg-gray-300 text-gray-700 hover:bg-gray-400 transition-colors disabled:opacity-50 font-semibold'
    >
      次へ
    </button>
  </div>
);

const History: React.FC = () => {
  const [historyItems, setHistoryItems] = useState(mockHistoryItems);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = historyItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(historyItems.length / itemsPerPage);

  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const handleDelete = (id: string) => {
    setHistoryItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100 pb-16'>
      <div className='w-full max-w-lg p-4 mb-8 border-4 border-[#2F41B0] rounded-md text-center bg-white shadow-md'>
        <h1 className='text-lg font-bold text-gray-700'>検索履歴</h1>
      </div>
      <div className='w-full max-w-lg bg-white shadow-md rounded-lg p-4'>
        <div className='space-y-3 max-h-[60vh] overflow-y-auto'>
          {currentItems.map((item) => (
            <HistoryItem key={item.id} item={item} onDelete={handleDelete} />
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
