'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import MenuBar from '@/app/client/components/menubar';
import { nationalFamilyRanking, osakaFamilyRanking } from '@/app/client/data/mockData';

interface RankingItem {
  id: number;
  imageUrl: string;
  shopName: string;
  productName: string;
  likes: number;
}

const prefectures = [
  '全国',
  '北海道',
  '青森県',
  '岩手県',
  '宮城県',
  '秋田県',
  '山形県',
  '福島県',
  '茨城県',
  '栃木県',
  '群馬県',
  '埼玉県',
  '千葉県',
  '東京都',
  '神奈川県',
  '新潟県',
  '富山県',
  '石川県',
  '福井県',
  '山梨県',
  '長野県',
  '岐阜県',
  '静岡県',
  '愛知県',
  '三重県',
  '滋賀県',
  '京都府',
  '大阪府',
  '兵庫県',
  '奈良県',
  '和歌山県',
  '鳥取県',
  '島根県',
  '岡山県',
  '広島県',
  '山口県',
  '徳島県',
  '香川県',
  '愛媛県',
  '高知県',
  '福岡県',
  '佐賀県',
  '長崎県',
  '熊本県',
  '大分県',
  '宮崎県',
  '鹿児島県',
  '沖縄県',
];

const targets = ['家族', '友人', '恋人', '職場', '自分'];

const Ranking: React.FC = () => {
  const [selectedPrefecture, setSelectedPrefecture] = useState('全国');
  const [selectedTarget, setSelectedTarget] = useState('家族');

  // 都道府県と贈り先に応じたランキングデータを取得
  const getRankingData = () => {
    if (selectedPrefecture === '大阪府' && selectedTarget === '家族') {
      return osakaFamilyRanking;
    } else {
      return nationalFamilyRanking;
    }
  };

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
          width={80}
          height={80}
          className='rounded-md object-cover'
        />
      </div>
      <div className='flex-grow min-w-0 pl-2'>
        <h3 className='font-semibold text-lg truncate'>{item.productName}</h3>
        <p className='text-sm text-gray-600 truncate'>{item.shopName}</p>
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
          <div className='mb-4 space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                都道府県
              </label>
              <select
                value={selectedPrefecture}
                onChange={(e) => setSelectedPrefecture(e.target.value)}
                className='w-full p-2 border border-gray-300 rounded-md'
              >
                {prefectures.map((prefecture) => (
                  <option key={prefecture} value={prefecture}>
                    {prefecture}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                贈り先
              </label>
              <select
                value={selectedTarget}
                onChange={(e) => setSelectedTarget(e.target.value)}
                className='w-full p-2 border border-gray-300 rounded-md'
              >
                {targets.map((target) => (
                  <option key={target} value={target}>
                    {target}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className='overflow-y-auto md:overflow-visible max-h-[calc(100vh-300px)] md:max-h-none'>
            <div className='md:grid md:grid-cols-2 md:gap-4 space-y-4 md:space-y-0'>
              <div className='space-y-4'>
                {getRankingData().slice(0, 5).map((item, index) => (
                  <RankingItem key={item.id} item={item} index={index} />
                ))}
              </div>
              <div className='space-y-4'>
                {getRankingData().slice(5, 10).map((item, index) => (
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
