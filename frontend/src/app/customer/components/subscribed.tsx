import React from 'react';
import Image from 'next/image';

// ダミーデータ
const dummySubscribedData = [
  {
    id: 1,
    name: '東京ばなな',
    imageUrl: 'https://placehold.co/200x200?text=東京ばなな',
    description: '東京の定番お土産',
  },
  {
    id: 2,
    name: '白い恋人',
    imageUrl: 'https://placehold.co/200x200?text=白い恋人',
    description: '北海道の人気お菓子',
  },
  {
    id: 3,
    name: 'うまい棒',
    imageUrl: 'https://placehold.co/200x200?text=うまい棒',
    description: '懐かしの駄菓子',
  },
];

const SubscribedItem = ({ item }) => {
  return (
    <div className='flex items-center space-x-4 mb-4 p-4 bg-white rounded-lg shadow'>
      <div className='relative w-24 h-24 flex-shrink-0'>
        <Image
          src={item.imageUrl}
          alt={item.name}
          fill
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          style={{ objectFit: 'cover' }}
          className='rounded-lg'
        />
      </div>
      <div className='flex-grow'>
        <h3 className='text-lg font-semibold'>{item.name}</h3>
        <p className='text-gray-600'>{item.description}</p>
      </div>
      <button className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300'>
        解除
      </button>
    </div>
  );
};

const SubscribedList = ({ items }) => {
  return (
    <div className='space-y-4'>
      {items.map((item) => (
        <SubscribedItem key={item.id} item={item} />
      ))}
    </div>
  );
};

const SubscribePage = () => {
  // 将来的にはここでバックエンドからデータを取得する
  const subscribedItems = dummySubscribedData;

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold mb-6'>お気に入りのお土産</h1>
      <SubscribedList items={subscribedItems} />
    </div>
  );
};

export default SubscribePage;
