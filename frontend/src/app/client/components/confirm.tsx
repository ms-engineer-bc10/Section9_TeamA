'use client';
import React from 'react';

interface ConfirmProps {
  answers: {
    location: string;
    target: string;
    genre: string;
    budget: string;
    quantity: string;
    location_type?: string;
  };
  onSearch: () => void;
}

const Confirm: React.FC<ConfirmProps> = ({ answers, onSearch }) => {
  const answerLabels: { [key: string]: string } = {
    location: '場所',
    target: '対象',
    genre: 'ジャンル',
    budget: '予算',
    quantity: '数量',
  };

  const displayLocation = (location: string) => {
    // 緯度・経度の場合「現在地」と表示
    if (/^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/.test(location)) {
      return '現在地';
    }
    // 都道府県が選ばれている場合はそのまま表示
    return location;
  };

  const filledAnswers = Object.entries(answers).filter(
    ([key, value]) => value !== '' && key !== 'location_type'
  );

  return (
    <div className='w-full max-w-lg bg-white shadow-md rounded-lg p-6'>
      <h1 className='text-xl font-semibold mb-4 text-center'>
        あなたの条件は下記です
      </h1>
      <div className='grid grid-cols-2 gap-4 mb-6'>
        {filledAnswers.map(([key, value]) => (
          <div
            key={key}
            className='py-2 px-4 text-lg rounded-md bg-gray-200 text-gray-700'
          >
            <div className='font-semibold'>{answerLabels[key]}</div>
            <div>{key === 'location' ? displayLocation(value) : value}</div>
          </div>
        ))}
      </div>
      {filledAnswers.length > 0 ? (
        <p className='text-center mb-6 text-lg font-semibold'>入力完了！</p>
      ) : (
        <p className='text-center mb-6 text-lg font-semibold text-red-500'>
          条件を入力してください
        </p>
      )}
      <div className='flex justify-center'>
        <button
          onClick={onSearch}
          className='py-3 px-6 text-lg rounded-md bg-yellow-500 text-white hover:bg-yellow-600 transition-colors'
          disabled={filledAnswers.length === 0}
        >
          探す
        </button>
      </div>
    </div>
  );
};

export default Confirm;
