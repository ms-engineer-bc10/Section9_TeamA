// C:\Users\ki3ic\BC10\private\jikken\my-app\src\app\components\result.tsx
import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ResultProps {
  answers: {
    q1: string;
    q2: string;
    q3: string;
    q4: string;
  };
  onResetSearch: () => void;
  onEditSearch: () => void;
}

interface SearchResult {
  imageUrl: string;
  name: string;
  llmComment: string;
}

const Result: React.FC<ResultProps> = ({
  answers,
  onResetSearch,
  onEditSearch,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentResult, setCurrentResult] = useState<SearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const performSearch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // API呼び出しをシミュレート
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // モックデータ（実際のAPIレスポンスに置き換えてください）
      const mockResult: SearchResult = {
        imageUrl: '/placeholder-image.jpg', // publicフォルダ内の実際の画像ファイルへのパスに変更してください
        name: '551蓬莱 豚まん',
        llmComment:
          '大阪の名物として有名な551蓬莱の豚まんは、ジューシーで香り豊かな一品です。お土産として人気が高く、多くの人々に愛されています。',
      };
      setCurrentResult(mockResult);
    } catch (error) {
      console.error('検索エラー:', error);
      setError('検索中にエラーが発生しました。もう一度お試しください。');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    performSearch();
  }, [performSearch]);

  return (
    <div className='w-full max-w-lg mx-auto'>
      <AnimatePresence mode='wait'>
        {isLoading ? (
          <motion.div
            key='loading'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='bg-white shadow-lg rounded-lg p-8 flex flex-col items-center justify-center'
            style={{ minHeight: '400px' }}
          >
            <div className='animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-blue-500'></div>
            <p className='mt-4 text-xl font-semibold text-gray-700'>
              おみやげを探しています...
            </p>
          </motion.div>
        ) : error ? (
          <motion.div
            key='error'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='bg-white shadow-lg rounded-lg p-8 text-center'
            style={{ minHeight: '400px' }}
          >
            <p className='text-red-500 text-lg mb-4'>{error}</p>
            <button
              onClick={performSearch}
              className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300'
            >
              再試行
            </button>
          </motion.div>
        ) : currentResult ? (
          <motion.div
            key='result'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='bg-white shadow-lg rounded-lg overflow-hidden'
          >
            <div className='p-4'>
              <h2 className='text-2xl font-bold text-center mb-6'>
                あなたにピッタリなOMIYAGEはこれ！
              </h2>
              <div className='mb-6 relative h-64'>
                <Image
                  src={currentResult.imageUrl}
                  alt={currentResult.name}
                  layout='fill'
                  objectFit='cover'
                  className='rounded-lg'
                />
              </div>
              <h3 className='text-xl font-semibold mb-4'>
                {currentResult.name}
              </h3>
              <div className='flex space-x-4 mb-6'>
                <div className='flex-1 bg-gray-100 p-4 rounded-lg flex items-center justify-center'>
                  <MapPin className='w-8 h-8 text-blue-500 mr-2' />
                  <span className='text-lg'>地図</span>
                </div>
                <div className='flex-1 bg-gray-100 p-4 rounded-lg'>
                  <p className='text-lg font-semibold mb-2'>LLMコメント</p>
                  <p className='text-sm'>{currentResult.llmComment}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className='mt-8 text-center'>
        <button
          onClick={performSearch}
          className='bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-full transition duration-300 mr-4'
          aria-label='他のOMIYAGEを探す'
        >
          他のOMIYAGEも探してみよう
        </button>
        <button
          onClick={onEditSearch}
          className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full transition duration-300'
          aria-label='検索条件を変更する'
        >
          条件を変更する
        </button>
      </div>
    </div>
  );
};

export default Result;
