'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Trash2 } from 'lucide-react';
import MenuBar from '@/app/client/components/menubar';

import { useRouter } from 'next/navigation';
import { auth } from '@/firebase';

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
  product: {
    name: string;
    price: string;
    image: string;
  };
}

const History: React.FC = () => {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/history');
        const data = await response.json();
        const sortedData = data.sort((a: HistoryItem, b: HistoryItem) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
        setHistoryItems(data);
      } catch (error) {
        console.error('履歴データの取得中にエラーが発生しました:', error);
      }
    };

    fetchHistory();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = historyItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(historyItems.length / itemsPerPage);

  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  //ここにdocker立ち上げのためのコード記載
  const onDelete = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/history/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setHistoryItems((prevItems) =>
          prevItems.filter((item) => item.id !== id)
        );
      } else {
        console.error('削除に失敗しました');
      }
    } catch (error) {
      console.error('削除処理中にエラーが発生しました:', error);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100 pb-16'>
      <div className='w-full max-w-lg p-4 mb-8 border-4 border-[#2F41B0] rounded-md text-center bg-white shadow-md'>
        <h1 className='text-lg font-bold text-gray-700'>検索履歴</h1>
      </div>
      <div className='w-full max-w-lg bg-white shadow-md rounded-lg p-4'>
        <div className='space-y-3 max-h-[60vh] overflow-y-auto'>
          {currentItems.map((item) => (
            <div key={item.id} className='border rounded-lg p-2'>
              <div className='grid grid-cols-7 gap-1 items-center'>
                <div className='row-span-3 flex items-center justify-start pl-2'>
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
                  <div
                    className='relative w-full h-full'
                    style={{ aspectRatio: '1 / 1' }}
                  >
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      layout='fill'
                      objectFit='cover'
                      className='rounded-md'
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className='flex justify-between mt-4'>
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className='py-2 px-4 text-xs rounded-md bg-gray-300 text-gray-700 hover:bg-gray-400 transition-colors disabled:opacity-50 font-semibold'
          >
            前へ
          </button>
          <span className='py-2 px-4 text-xs font-semibold'>
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className='py-2 px-4 text-xs rounded-md bg-gray-300 text-gray-700 hover:bg-gray-400 transition-colors disabled:opacity-50 font-semibold'
          >
            次へ
          </button>
        </div>
      </div>
      <MenuBar />
    </div>
  );
};

export default History;
