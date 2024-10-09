// C:\Users\ki3ic\BC10\private\jikken\my-app\src\app\components\quantity.tsx
'use client';
import React from 'react';

interface QuantityProps {
  onNext: (selectedOption: string) => void;
  selectedOption: string | null;
  setSelectedOption: (option: string) => void;
}

const Quantity: React.FC<QuantityProps> = ({
  onNext,
  selectedOption,
  setSelectedOption,
}) => {
  const options = ['1個', '2〜5個', '6〜10個', '11〜15個', '16個以上'];

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    onNext(option);
  };

  return (
    <div className='w-full max-w-lg bg-white shadow-md rounded-lg p-6'>
      <h1 className='text-xl font-semibold mb-4 text-center'>個数は？</h1>
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

export default Quantity;
