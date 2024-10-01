// src/app/components/q1.tsx (同様に Q2, Q3, Q4 も修正)
'use client';
import React from 'react';

const Q1 = ({ selectedOption, setSelectedOption }) => {
  const options = ['家族', '友人', '恋人', '職場', '自分'];

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
  };

  return (
    <div className='w-full max-w-lg bg-white shadow-md rounded-lg p-6'>
      <h1 className='text-xl font-semibold mb-4 text-center'>
        誰に渡すOMIYAGEですか？
      </h1>
      <div className='grid grid-cols-2 gap-4 mb-4'>
        {options.slice(0, 4).map((option) => (
          <button
            key={option}
            className={`py-2 px-4 text-lg rounded-md border transition-colors ${
              selectedOption === option
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
            onClick={() => handleOptionClick(option)}
          >
            {option}
          </button>
        ))}
        <button
          key='自分'
          className={`col-span-2 py-2 px-4 text-lg rounded-md border transition-colors ${
            selectedOption === '自分'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
          onClick={() => handleOptionClick('自分')}
        >
          自分
        </button>
      </div>
    </div>
  );
};

export default Q1;
