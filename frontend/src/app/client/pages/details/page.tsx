'use client';

import React from 'react';
import Image from 'next/image';

interface ProductData {
  id: number;
  name: string;
  imageUrl: string;
  description: string;
}

const dummyData: ProductData = {
  id: 551,
  name: '蓬莱 豚まん',
  imageUrl: '/images/551-horai-buta-man.jpg',
  description:
    '大阪名物の豚まん。ジューシーな豚肉と野菜の具材が、ふっくらとした生地で包まれています。',
};

const ProductCard: React.FC = () => {
  return (
    <div className='w-full max-w-2xl mx-auto bg-white shadow-md rounded-lg overflow-hidden'>
      <h2 className='text-xl font-bold p-4 text-center border-b'>
        {dummyData.id} {dummyData.name}
      </h2>
      <div className='flex flex-col md:flex-row'>
        <div className='md:w-1/2 p-4'>
          <Image
            src={dummyData.imageUrl}
            alt={dummyData.name}
            width={300}
            height={300}
            layout='responsive'
            className='rounded-md'
          />
        </div>
        <div className='md:w-1/2 p-4'>
          <div className='bg-gray-100 p-4 rounded-md mb-4'>
            <h3 className='text-lg font-semibold mb-2 text-center'>
              〜商品情報〜
            </h3>
            <p className='text-sm text-gray-700'>{dummyData.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
