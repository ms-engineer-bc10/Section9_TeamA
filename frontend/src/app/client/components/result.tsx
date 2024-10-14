import React, { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FavoriteIconAnim } from '@/app/client/components/ui/heart';
import MapComponent from './map';

interface ResultProps {
  answers: {
    location: string;
    target: string;
    genre: string;
    budget: string;
    quantity: string;
  };
  searchResults: any;
  onResetSearch: () => void;
  onEditSearch: () => void;
}

interface SearchResult {
  imageUrl: string;
  name: string;
  llmComment: string;
}

const MAX_SEARCH_COUNT = 5;

const Result: React.FC<ResultProps> = ({
  answers,
  searchResults,
  onResetSearch,
  onEditSearch,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchCount, setSearchCount] = useState(1);
  const [currentResult, setCurrentResult] = useState<SearchResult | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [places, setPlaces] = useState([]);

  const updateSearchResult = useCallback(() => {
    console.log(searchResults);
    console.log(searchResults.おすすめ商品一覧);

    if (searchResults && searchResults.おすすめ商品一覧.length > 0) {
      const aiSelectedProduct = searchResults.おすすめ商品一覧.find(
        (item: any) => item.商品名 === searchResults['AIが選ぶおすすめ商品']
      );

      if (aiSelectedProduct) {
        setCurrentResult({
          imageUrl: aiSelectedProduct.画像URL || '/placeholder-image.jpg',
          name: aiSelectedProduct.商品名,
          llmComment:
            searchResults.AIおすすめポイント || aiSelectedProduct.説明,
        });
      } else {
        const result = searchResults.おすすめ商品一覧[0];
        setCurrentResult({
          imageUrl:
            result.画像URL.replace('image_size=76', 'image_size=300') ||
            '/placeholder-image.jpg',
          name: result.商品名,
          llmComment: searchResults.AIおすすめポイント || result.説明,
        });
      }

      const stores = searchResults.近隣店舗.map((store: any) => ({
        name: store.name,
        location: {
          lat: store.location.lat,
          lng: store.location.lng,
        },
      }));
      setPlaces(stores);
    }
  }, [searchResults]);

  useEffect(() => {
    updateSearchResult();
  }, [updateSearchResult]);

  const handleSearchClick = () => {
    if (searchCount < MAX_SEARCH_COUNT) {
      setSearchCount((prevCount) => prevCount + 1);
      setIsFavorite(false);
      updateSearchResult();
    }
  };

  const handleFavoriteClick = () => {
    setIsFavorite((prev) => !prev);
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
              <div className='mb-6 relative h-64 flex justify-center'>
                <Image
                  src={currentResult.imageUrl}
                  alt={currentResult.name}
                  width={300} // 指定サイズ300x300
                  height={300} // 指定サイズ300x300
                  style={{ objectFit: 'cover', display: 'block' }}
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
              <div
                className='flex space-x-4 mb-6'
                style={{ alignItems: 'stretch' }}
              >
                <div className='flex-1 bg-gray-100 p-4 rounded-lg'>
                  <div className='h-full w-full'>
                    <MapComponent places={places} />
                  </div>
                </div>
                <div className='flex-1 bg-gray-100 p-4 rounded-lg'>
                  <p className='text-lg font-semibold mb-2'>
                    AIのおすすめポイント
                  </p>
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
          disabled={searchCount >= MAX_SEARCH_COUNT}
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

      <p className='mt-4 text-left font-bold text-gray-600'>
        検索回数: {searchCount} / {MAX_SEARCH_COUNT}
      </p>

      {searchCount >= MAX_SEARCH_COUNT && (
        <p className='mt-4 text-red-500 text-center'>
          検索条件を変更してください
        </p>
      )}
    </div>
  );
};

export default Result;
