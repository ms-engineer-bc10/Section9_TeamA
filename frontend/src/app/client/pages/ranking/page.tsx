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
      {
        id: 7,
        imageUrl: '/images/product7.jpg',
        shopName: '萩の月',
        productName: '萩の月',
        likes: 80,
      },
      {
        id: 8,
        imageUrl: '/images/product8.jpg',
        shopName: '鳩サブレー',
        productName: '鳩サブレー',
        likes: 75,
      },
      {
        id: 9,
        imageUrl: '/images/product9.jpg',
        shopName: 'ルタオ',
        productName: 'ドゥーブルフロマージュ',
        likes: 70,
      },
      {
        id: 10,
        imageUrl: '/images/product10.jpg',
        shopName: 'じゃがポックル',
        productName: 'じゃがポックル',
        likes: 65,
      },
    ];
    setRankingData(mockData);
  }, []);

  const getRankColor = (index: number) => {
    switch (index) {
      case 0:
        return 'bg-yellow-400';
      case 1:
        return 'bg-gray-300';
      case 2:
        return 'bg-orange-300';
      default:
        return 'bg-blue-200';
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
        )} w-10 h-10 flex items-center justify-center rounded-full mr-6 flex-shrink-0`}
      >
        <span className='text-base font-bold'>{index + 1}</span>
      </div>
      <div className='relative w-20 h-20 mr-6 flex-shrink-0'>
        <Image
          src={item.imageUrl}
          alt={item.productName}
          layout='fill'
          objectFit='cover'
          className='rounded-md'
        />
      </div>
      <div className='flex-grow min-w-0 pl-2'>
        <h3 className='font-semibold text-lg truncate'>{item.shopName}</h3>
        <p className='text-sm text-gray-600 truncate'>{item.productName}</p>
      </div>
      <div className='flex items-center flex-shrink-0 ml-4'>
        <Heart className='w-5 h-5 text-red-500 mr-2' />
        <span className='font-semibold text-lg'>{item.likes}</span>
      </div>
    </div>
  );

  return (
    <div className='flex flex-col min-h-screen bg-gray-100'>
      <div className='flex-grow container mx-auto px-4 py-8'>
        <div className='bg-white shadow-md rounded-lg p-6 max-w-4xl mx-auto'>
          <h2 className='text-2xl font-bold mb-4 text-center'>
            人気のお土産ランキング
          </h2>
          <div className='overflow-y-auto md:overflow-visible max-h-[calc(100vh-300px)] md:max-h-none'>
            <div className='md:grid md:grid-cols-2 md:gap-4 space-y-4 md:space-y-0'>
              <div className='space-y-4'>
                {rankingData.slice(0, 5).map((item, index) => (
                  <RankingItem key={item.id} item={item} index={index} />
                ))}
              </div>
              <div className='space-y-4'>
                {rankingData.slice(5, 10).map((item, index) => (
                  <RankingItem key={item.id} item={item} index={index + 5} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <MenuBar />
    </div>
  );
};

export default Ranking;
