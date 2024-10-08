'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import MenuBar from '@/app/client/components/menubar';

interface LikedPhoto {
  id: string;
  imageUrl: string;
  likedAt: Date;
}

const LikesPage: React.FC = () => {
  const [likedPhotos, setLikedPhotos] = useState<LikedPhoto[]>([]);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  useEffect(() => {
    // 仮の写真データを9枚用意
    const mockData: LikedPhoto[] = Array.from({ length: 9 }, (_, i) => ({
      id: `${i + 1}`,
      imageUrl: `/api/placeholder/300/300?text=Photo ${i + 1}`,
      likedAt: new Date(2023, 4, i + 1), // 2023年5月1日から順に日付を設定
    }));
    setLikedPhotos(mockData);
  }, []);

  const sortedPhotos = [...likedPhotos].sort((a, b) => {
    if (sortOrder === 'newest') {
      return b.likedAt.getTime() - a.likedAt.getTime();
    } else {
      return a.likedAt.getTime() - b.likedAt.getTime();
    }
  });

  return (
    <div className='flex flex-col min-h-screen bg-gray-100'>
      <div className='flex-grow container mx-auto px-4 py-8'>
        <div className='bg-white shadow-md rounded-lg p-6'>
          <h2 className='text-2xl font-bold mb-4 text-center'>
            いいねした写真
          </h2>
          <div className='mb-4 flex justify-end'>
            <select
              value={sortOrder}
              onChange={(e) =>
                setSortOrder(e.target.value as 'newest' | 'oldest')
              }
              className='border rounded p-2'
            >
              <option value='newest'>新しい順</option>
              <option value='oldest'>古い順</option>
            </select>
          </div>
          <div className='overflow-y-auto max-h-[calc(100vh-300px)]'>
            <div className='grid grid-cols-3 gap-4'>
              {sortedPhotos.map((photo) => (
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
        </div>
      </div>
      <MenuBar />
    </div>
  );
};

export default LikesPage;
