import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface LikedPhoto {
  id: string;
  imageUrl: string;
  likedAt: Date;
}

const Subscribed: React.FC = () => {
  const [likedPhotos, setLikedPhotos] = useState<LikedPhoto[]>([]);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  useEffect(() => {
    // TODO: API からいいねした写真を取得する
    // この例では仮のデータを使用しています
    const mockData: LikedPhoto[] = Array.from({ length: 20 }, (_, i) => ({
      id: `${i + 1}`,
      imageUrl: `/api/placeholder/400/400`,
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
    <div className='bg-white shadow-md rounded-lg p-6 h-full flex flex-col'>
      <h2 className='text-2xl font-bold mb-4'>いいねした写真</h2>
      <div className='mb-4'>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
          className='border rounded p-2'
        >
          <option value='newest'>新しい順</option>
          <option value='oldest'>古い順</option>
        </select>
      </div>
      <div
        className='overflow-y-auto flex-grow'
        style={{ maxHeight: 'calc(100vh - 200px)' }}
      >
        <div className='grid grid-cols-3 gap-4'>
          {sortedPhotos.map((photo) => (
            <div key={photo.id} className='aspect-square relative'>
              <Image
                src={photo.imageUrl}
                alt='Liked photo'
                layout='fill'
                objectFit='cover'
                className='rounded-lg'
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Subscribed;
