'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import MenuBar from '@/app/client/components/menubar';

interface RankingItem {
  id: number;
  imageUrl: string;
  shopName: string;
  productName: string;
  likes: number;
}

const Ranking: React.FC = () => {
  const [rankingData, setRankingData] = useState<RankingItem[]>([]);

  useEffect(() => {
    // TODO: APIからランキングデータを取得する
    const mockData: RankingItem[] = [
      {
        id: 1,
        imageUrl: '/images/product1.jpg',
        shopName: '551蓬莱',
        productName: '豚まん',
        likes: 120,
      },
      {
        id: 2,
        imageUrl: '/images/product2.jpg',
        shopName: 'ニューヨークチーズケーキ',
        productName: 'チーズケーキ',
        likes: 110,
      },
      {
        id: 3,
        imageUrl: '/images/product3.jpg',
        shopName: '松江銘菓',
        productName: '川棚',
        likes: 100,
      },
      {
        id: 4,
        imageUrl: '/images/product4.jpg',
        shopName: 'Tokyo Banana',
        productName: 'Tokyo Banana',
        likes: 95,
      },
      {
        id: 5,
        imageUrl: '/images/product5.jpg',
        shopName: 'ご当地キットカット',
        productName: 'ご当地キットカット',
        likes: 90,
      },
      {
        id: 6,
        imageUrl: '/images/product6.jpg',
        shopName: '白い恋人',
        productName: '白い恋人',
        likes: 85,
      },
      // ... 他のアイテムを追加
    ];
    setRankingData(mockData);
  }, []);

  const getRankColor = (index: number) => {
    switch (index) {
      case 0:
        return 'bg-yellow-400 text-yellow-800';
      case 1:
        return 'bg-gray-300 text-gray-800';
      case 2:
        return 'bg-orange-300 text-orange-800';
      default:
        return 'bg-blue-200 text-blue-800';
    }
  };

  const RankingItem = ({
    item,
    index,
  }: {
    item: RankingItem;
    index: number;
  }) => (
    <div
      className={`flex items-center p-4 rounded-lg ${
        index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
      }`}
    >
      <div
        className={`${getRankColor(
          index
        )} w-10 h-10 flex items-center justify-center rounded-full mr-4`}
      >
        <span className='text-xl font-bold'>{index + 1}</span>
      </div>
      <div className='relative w-20 h-20 mr-4'>
        <Image
          src={item.imageUrl}
          alt={item.productName}
          layout='fill'
          objectFit='cover'
          className='rounded-md'
        />
      </div>
      <div className='flex-grow'>
        <h3 className='font-semibold'>{item.shopName}</h3>
        <p className='text-sm text-gray-600'>{item.productName}</p>
      </div>
      <div className='flex items-center'>
        <Heart className='w-5 h-5 text-red-500 mr-1' />
        <span className='font-semibold'>{item.likes}</span>
      </div>
    </div>
  );

  return (
    <div className='flex flex-col min-h-screen bg-gray-100'>
      <div className='flex-grow container mx-auto px-4 py-8'>
        <div className='bg-white shadow-md rounded-lg p-6'>
          <h2 className='text-2xl font-bold mb-4 text-center'>
            人気のお土産ランキング
          </h2>

          <div className='overflow-y-auto max-h-[calc(100vh-300px)] space-y-4'>
            {rankingData.map((item, index) => (
              <RankingItem key={item.id} item={item} index={index} />
            ))}
          </div>
        </div>
      </div>
      <MenuBar />
    </div>
  );
};

export default Ranking;
