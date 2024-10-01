// C:\Users\ki3ic\BC10\private\jikken\my-app\src\app\components\confirm.tsx
'use client';
import React from 'react';

interface ConfirmProps {
  answers: {
    q1: string;
    q2: string;
    q3: string;
    q4: string;
  };
  onSearch: () => void;
}

const Confirm: React.FC<ConfirmProps> = ({ answers, onSearch }) => {
  return (
    <div className='w-full max-w-lg bg-white shadow-md rounded-lg p-6'>
      <h1 className='text-xl font-semibold mb-4 text-center'>
        あなたの条件は下記です
      </h1>
      <div className='grid grid-cols-2 gap-4 mb-6'>
        {Object.values(answers).map((value, index) => (
          <div
            key={index}
            className='py-2 px-4 text-lg rounded-md bg-gray-200 text-gray-700 text-center'
          >
            {value}
          </div>
        ))}
      </div>
      <p className='text-center mb-6 text-lg font-semibold'>入力完了！</p>
      <div className='flex justify-center'>
        <button
          onClick={onSearch}
          className='py-3 px-6 text-lg rounded-md bg-yellow-500 text-white hover:bg-yellow-600 transition-colors'
        >
          探す
        </button>
      </div>
    </div>
  );
};

export default Confirm;
