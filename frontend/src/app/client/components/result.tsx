import React, { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FavoriteIconAnim } from '@/app/client/components/ui/heart';

// Answers型の定義
interface Answers {
  q1: string;
  q2: string;
  q3: string;
  q4: string;
}

interface ResultProps {
  answers: Answers;  // Answers型のanswersをResultPropsに追加
  onResetSearch: () => void;
  onEditSearch: () => void;
}

interface SearchResult {
  imageUrl: string;
  name: string;
  llmComment: string;
}

const Result: React.FC<ResultProps> = ({ answers, onResetSearch, onEditSearch }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchCount, setSearchCount] = useState(1);
  const [currentResult, setCurrentResult] = useState<SearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  const performSearch = useCallback(async () => {
    if (searchCount >= 7) {
      setError('検索条件を変更してください');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // バックエンド処理のシミュレーション
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // モックデータ（実際のAPIレスポンスに置き換えてください）
      const mockResult: SearchResult = {
        imageUrl: '/placeholder-image.jpg',
        name: `551蓬莱 豚まん (検索回数: ${searchCount + 1})`,
        llmComment: `大阪の名物として有名な551蓬莱の豚まんは、ジューシーで香り豊かな一品です。お土産として人気が高く、多くの人々に愛されています。(検索回数: ${
          searchCount + 1
        })`,
      };

      setCurrentResult(mockResult);
      setSearchCount((prevCount) => prevCount + 1);
      setIsFavorite(false); // 新しい結果が表示されたらお気に入り状態をリセット
    } catch (error) {
      console.error('検索エラー:', error);
      setError('検索中にエラーが発生しました。もう一度お試しください。');
    } finally {
      setIsLoading(false);
    }
  }, [searchCount]);

  useEffect(() => {
    performSearch();
  }, [performSearch]);

  const handleSearchClick = () => {
    if (searchCount < 7) {
      performSearch();
    }
  };

  const handleFavoriteClick = () => {
    setIsFavorite(!isFavorite);
  };

  if (isLoading) {
    return (
      <div className='w-full max-w-lg mx-auto'>
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
      </div>
    );
  }

  return (
    <div className='w-full max-w-lg mx-auto'>
      <AnimatePresence mode='wait'>
        {currentResult && (
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
              <div className='flex justify-between items-center mb-4'>
                <h3 className='text-xl font-semibold'>{currentResult.name}</h3>
                <FavoriteIconAnim
                  isFavorite={isFavorite}
                  onClick={handleFavoriteClick}
                />
              </div>
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
        )}
      </AnimatePresence>

      <div className='mt-8 text-center'>
        <button
          onClick={handleSearchClick}
          className='bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-full transition duration-300 mr-4'
          aria-label='他のOMIYAGEを探す'
          disabled={searchCount >= 7}
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

      {searchCount >= 7 && (
        <p className='mt-4 text-red-500 text-center'>
          検索条件を変更してください
        </p>
      )}

      <div className='mt-4'>
        <h4 className='text-xl font-semibold'>選択した回答:</h4>
        <p>Q1: {answers.q1}</p>
        <p>Q2: {answers.q2}</p>
        <p>Q3: {answers.q3}</p>
        <p>Q4: {answers.q4}</p>
      </div>
    </div>
  );
};

export default Result;
