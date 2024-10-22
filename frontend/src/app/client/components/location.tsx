'use client';

import React, { useState, useEffect } from 'react';

interface LocationProps {
  selectedOption: string;
  setSelectedOption: (option: string) => void;
  onLocationChange: (location: string, locationType: string) => void;
}

const Location: React.FC<LocationProps> = ({
  selectedOption,
  setSelectedOption,
  onLocationChange,
}) => {
  const [showPrefectureSelect, setShowPrefectureSelect] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
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
    setShowPrefectureSelect(
      selectedOption !== '現在地' && selectedOption !== ''
    );
  }, [selectedOption]);

  const handleOptionClick = (option: string) => {
    //console.log('handleoptionclick');
    if (option === '現在地から提案') {
      // console.log(option);

      setSelectedOption('現在地');

      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const location = `${latitude},${longitude}`;
            onLocationChange(location, 'current');
            setLocationError(null);
          },
          (error) => {
            console.error('Error retrieving location', error);
            setLocationError('位置情報を取得できませんでした。');
          }
        );
      } else {
        setLocationError('このブラウザは位置情報取得に対応していません。');
      }
    } else {
      setShowPrefectureSelect(true);
      if (selectedOption === '現在地') {
        setSelectedOption(''); // リセット
      }
    }
  };

  const handlePrefectureChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selected = event.target.value;
    setSelectedOption(selected);
    onLocationChange(selected, 'prefecture');
  };

  return (
    <div className='w-full max-w-lg bg-white shadow-md rounded-lg p-6'>
      <h1 className='text-xl font-semibold mb-4 text-center'>
        OMIYAGEを買いたい場所は？
      </h1>
      <div className='grid grid-cols-2 gap-4 mb-4'>
        {options.map((option) => (
          <button
            key={option}
            className={`py-2 px-4 text-lg rounded-md border transition-colors ${
              (option === '現在地から提案' && selectedOption === '現在地') ||
              (option === '場所を指定して提案' &&
                selectedOption !== '現在地' &&
                selectedOption !== '')
                ? 'bg-[#2F41B0] text-white'
                : 'bg-gray-200 hover:bg-[#5A73D7]'
            }`}
            onClick={() => handleOptionClick(option)}
          >
            {option}
          </button>
        ))}
      </div>
      {locationError && (
        <div className='text-red-500 mb-4'>{locationError}</div>
      )}
      {showPrefectureSelect && (
        <select
          onChange={handlePrefectureChange}
          className='w-full mt-4 p-2 border rounded-md'
          value={selectedOption}
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

export default Location;
