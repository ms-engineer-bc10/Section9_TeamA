// C:\Users\ki3ic\BC10\private\jikken\my-app\src\app\client\components\q2.tsx
'use client';
import React from 'react';

const Q2 = ({ onNext, selectedOption, setSelectedOption }) => {
  const options = ['食べ物', 'モノ'];

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
  };

  return (
    <div className='w-full max-w-lg bg-white shadow-md rounded-lg p-6'>
      <h1 className='text-xl font-semibold mb-4 text-center'>
        希望のOMIYAGEジャンルは？
      </h1>
      <div className='grid grid-cols-2 gap-4 mb-4'>
        {options.map((option) => (
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
      </div>
    </div>
  );
};

export default Q2;
