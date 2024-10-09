'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MenuBar from '@/app/client/components/menubar';

interface LikedPhoto {
  id: string;
  imageUrl: string;
  likedAt: Date;
}

const LikesPage: React.FC = () => {
  const [likedPhotos, setLikedPhotos] = useState<LikedPhoto[]>([]);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const photosPerPage = 9;

  useEffect(() => {
    // ダミーデータの生成 (100枚の写真を想定)
    const mockData: LikedPhoto[] = Array.from({ length: 100 }, (_, i) => ({
      id: `${i + 1}`,
      imageUrl: `/api/placeholder/300/300?text=Photo ${i + 1}`,
      likedAt: new Date(2023, 4, i + 1), // 2023年5月1日から順に日付を設定
    }));
    setLikedPhotos(mockData);
  }, []);

  const sortedPhotos = [...likedPhotos].sort((a, b) => {
    if (sortOrder === 'newest') {
      return b.likedAt.getTime() - a.likedAt.getTime(); // 新しい順（降順）
    } else {
      return a.likedAt.getTime() - b.likedAt.getTime(); // 古い順（昇順）
    }
  });

  const indexOfLastPhoto = currentPage * photosPerPage;
  const indexOfFirstPhoto = indexOfLastPhoto - photosPerPage;
  const currentPhotos = sortedPhotos.slice(indexOfFirstPhoto, indexOfLastPhoto);

  const totalPages = Math.ceil(sortedPhotos.length / photosPerPage);

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleSortChange = (newOrder: 'newest' | 'oldest') => {
    setSortOrder(newOrder);
    setCurrentPage(1); // ソート順を変更したら最初のページに戻る
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100 pb-16'>
      <div className='w-full max-w-lg p-4 mb-8'>
        <div className='bg-white shadow-md rounded-lg p-6'>
          <h2 className='text-2xl font-bold mb-4 text-center'>
            いいねした写真
          </h2>
          <div className='mb-4 flex justify-end'>
            <select
              value={sortOrder}
              onChange={(e) =>
                handleSortChange(e.target.value as 'newest' | 'oldest')
              }
              className='border rounded p-2'
            >
              <option value='newest'>新しい順</option>
              <option value='oldest'>古い順</option>
            </select>
          </div>
          <div className='overflow-y-auto max-h-[calc(100vh-300px)]'>
            <div className='grid grid-cols-3 gap-4'>
              {currentPhotos.map((photo) => (
                <div key={photo.id} className='aspect-square relative'>
                  <Image
                    src={photo.imageUrl}
                    alt={`Liked photo ${photo.id}`}
                    layout='fill'
                    objectFit='cover'
                    className='rounded-lg'
                  />
                </div>
              ))}
            </div>
          </div>
          {totalPages > 1 && (
            <div className='mt-4 flex justify-between items-center'>
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className='bg-[#2F41B0] hover:bg-[#5A73D7] text-white font-bold py-2 px-4 rounded disabled:opacity-50'
              >
                <ChevronLeft />
              </button>
              <span className='text-[#2F41B0] font-bold'>
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className='bg-[#2F41B0] hover:bg-[#5A73D7] text-white font-bold py-2 px-4 rounded disabled:opacity-50'
              >
                <ChevronRight />
              </button>
            </div>
          )}
        </div>
      </div>
      <MenuBar />
    </div>
  );
};

export default LikesPage;
