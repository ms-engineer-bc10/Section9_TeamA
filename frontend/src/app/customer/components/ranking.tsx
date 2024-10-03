// src/app/client/components/ranking.tsx
import React from 'react';
import Image from 'next/image';

interface RankingItem {
  rank: number;
  image: string;
  storeName: string;
  productName: string;
  score: number;
}

const rankingData: RankingItem[] = [
  {
    rank: 1,
    image: '/images/yukimi-daifuku.jpg',
    storeName: '森永製菓',
    productName: '雪見だいふく',
    score: 95,
  },
  {
    rank: 2,
    image: '/images/cheese-cake.jpg',
    storeName: 'ニューヨークチーズケーキ',
    productName: 'チーズケーキ',
    score: 90,
  },
  {
    rank: 3,
    image: '/images/pan-yake.jpg',
    storeName: '近江屋製パン',
    productName: 'パン焼',
    score: 85,
  },
  // 4位から10位までのデータを追加
  {
    rank: 4,
    image: '/images/tokyo-banana.jpg',
    storeName: '東京ばな奈',
    productName: 'Tokyo Banana',
    score: 82,
  },
  {
    rank: 5,
    image: '/images/kitkat.jpg',
    storeName: 'ネスレ日本',
    productName: 'ご当地キットカット',
    score: 80,
  },
  {
    rank: 6,
    image: '/images/shiroi-koibito.jpg',
    storeName: '石屋製菓',
    productName: '白い恋人',
    score: 78,
  },
  {
    rank: 7,
    image: '/images/rokkatei-makarons.jpg',
    storeName: '六花亭',
    productName: 'マルセイバターサンド',
    score: 76,
  },
  {
    rank: 8,
    image: '/images/tokyo-rusk.jpg',
    storeName: 'グリコ',
    productName: '東京ラスク',
    score: 74,
  },
  {
    rank: 9,
    image: '/images/hiyoko.jpg',
    storeName: '吉野堂',
    productName: 'ひよ子',
    score: 72,
  },
  {
    rank: 10,
    image: '/images/umaibo.jpg',
    storeName: 'やおきん',
    productName: 'うまい棒',
    score: 70,
  },
];

const RankingPage: React.FC = () => {
  return (
    <div className='p-6'>
      <ul className='space-y-8'>
        {rankingData.map((item) => (
          <li key={item.rank} className='flex items-center'>
            <div className='flex-shrink-0 w-12 mr-4'>
              <div className='w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center'>
                <span className='text-2xl font-bold text-white'>
                  {item.rank}
                </span>
              </div>
            </div>
            <div className='flex-grow bg-gray-100 rounded-lg overflow-hidden shadow-md'>
              <div className='flex'>
                <div className='relative w-32 h-32 flex-shrink-0'>
                  <Image
                    src={item.image}
                    alt={item.productName}
                    layout='fill'
                    objectFit='cover'
                  />
                </div>
                <div className='flex-grow p-4'>
                  <div className='text-sm text-gray-600'>{item.storeName}</div>
                  <div className='text-lg font-semibold'>
                    {item.productName}
                  </div>
                  <div className='text-sm text-gray-600 mt-2'>
                    {item.score}点
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RankingPage;
