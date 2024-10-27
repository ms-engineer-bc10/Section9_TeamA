import React from 'react';

const Loading: React.FC = () => {
  return (
    <div className='flex flex-col justify-center items-center min-h-[calc(100vh-220px)]'>
      {/* スピナー */}
      <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mb-4'></div>
      {/* テキスト */}
      <p className='text-lg font-semibold'>
        あなたにピッタリのOMIYAGEを考えています
      </p>
      <p className='text-lg font-semibold'>loading...</p>
    </div>
  );
};

export default Loading;
