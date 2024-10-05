'use client';
import React, { useState, useEffect } from 'react';

interface Q5Props {
  selectedOption: string;
  setSelectedOption: (option: string) => void;
}

const Q5: React.FC<Q5Props> = ({ selectedOption, setSelectedOption }) => {
  const [showPrefectureSelect, setShowPrefectureSelect] = useState(false);
  const [localSelectedOption, setLocalSelectedOption] =
    useState(selectedOption);
  const options = ['現在地から提案', '場所を指定して提案'];
  const prefectures = [
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

  useEffect(() => {
    setShowPrefectureSelect(localSelectedOption === '場所を指定して提案');
  }, [localSelectedOption]);

  const handleOptionClick = (option: string) => {
    if (option === '現在地から提案') {
      setSelectedOption('現在地');
      setLocalSelectedOption('現在地から提案');
    } else {
      setLocalSelectedOption(option);
      setShowPrefectureSelect(true);
      setSelectedOption(''); // リセット
    }
  };

  const handlePrefectureChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selected = event.target.value;
    if (selected) {
      setSelectedOption(selected);
    }
  };

  return (
    <div className='w-full max-w-lg bg-white shadow-md rounded-lg p-6'>
      <h1 className='text-xl font-semibold mb-4 text-center'>
        OMIVALを使いたい場所は？
      </h1>
      <div className='grid grid-cols-2 gap-4 mb-4'>
        {options.map((option) => (
          <button
            key={option}
            className={`py-2 px-4 text-lg rounded-md border transition-colors ${
              (option === '現在地から提案' &&
                localSelectedOption === '現在地から提案') ||
              (option === '場所を指定して提案' &&
                prefectures.includes(selectedOption))
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
            onClick={() => handleOptionClick(option)}
          >
            {option}
          </button>
        ))}
      </div>
      {showPrefectureSelect && (
        <select
          onChange={handlePrefectureChange}
          className='w-full mt-4 p-2 border rounded-md'
          value={prefectures.includes(selectedOption) ? selectedOption : ''}
        >
          <option value=''>都道府県を選択</option>
          {prefectures.map((prefecture) => (
            <option key={prefecture} value={prefecture}>
              {prefecture}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default Q5;
