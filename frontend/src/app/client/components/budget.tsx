// C:\Users\ki3ic\BC10\private\jikken\my-app\src\app\components\budget.tsx
'use client';
import React from 'react';

// Propsの型を定義
interface BudgetProps {
  selectedOption: string;
  setSelectedOption: (option: string) => void;
}

const Budget: React.FC<BudgetProps> = ({
  selectedOption,
  setSelectedOption,
}) => {
  const options = [
    '¥0〜1,999',
    '¥2,000〜3,999',
    '¥4,000〜5,999',
    '¥6,000〜7,999',
    '¥8,000〜9,999',
    '¥10,000〜',
  ];

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
  };

  return (
    <div className='w-full max-w-lg bg-white shadow-md rounded-lg p-6'>
      <h1 className='text-xl font-semibold mb-4 text-center'>
        予算はいくらでしょうか？
      </h1>
      <div className='grid grid-cols-2 gap-4 mb-4'>
        {options.map((option) => (
          <button
            key={option}
            className={`py-2 px-4 text-lg rounded-md border transition-colors ${
              selectedOption === option
                ? 'bg-[#2F41B0] text-white'
                : 'bg-gray-200 hover:bg-[#5A73D7]'
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

export default Budget;
