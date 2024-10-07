import React, { useState } from 'react';

interface HistoryItem {
  id: string;
  date: string;
  answers: {
    q5: string; // 個数
    q1: string; // 現在地
    q2: string; // 誰と
    q3: string; // 食べ物
    q4: string; // 金額
  };
  image: string;
}

const History: React.FC = () => {
  // モックデータ
  const mockHistoryItems: HistoryItem[] = [
    {
      id: '1',
      date: '10/1',
      answers: {
        q5: '2〜5個',
        q1: '東京',
        q2: '友人',
        q3: '和菓子',
        q4: '¥1,000〜2,999',
      },
      image: '/api/placeholder/100/100',
    },
    {
      id: '2',
      date: '10/3',
      answers: {
        q5: '1個',
        q1: '大阪',
        q2: '家族',
        q3: 'スイーツ',
        q4: '¥3,000〜4,999',
      },
      image: '/api/placeholder/100/100',
    },
    {
      id: '3',
      date: '10/5',
      answers: {
        q5: '6個以上',
        q1: '京都',
        q2: '同僚',
        q3: '工芸品',
        q4: '¥5,000〜9,999',
      },
      image: '/api/placeholder/100/100',
    },
    {
      id: '4',
      date: '10/7',
      answers: {
        q5: '2〜5個',
        q1: '北海道',
        q2: '恋人',
        q3: '海産物',
        q4: '¥10,000以上',
      },
      image: '/api/placeholder/100/100',
    },
    {
      id: '5',
      date: '10/9',
      answers: {
        q5: '1個',
        q1: '沖縄',
        q2: '一人',
        q3: '酒類',
        q4: '¥4,000〜5,999',
      },
      image: '/api/placeholder/100/100',
    },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // ページネーション用の関数
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = mockHistoryItems.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(mockHistoryItems.length / itemsPerPage);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  // 将来的なバックエンド連携用のコード（コメントアウト）
  /*
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchHistoryItems(currentPage);
  }, [currentPage]);

  const fetchHistoryItems = async (page: number) => {
    try {
      const response = await axios.get(`/api/history?page=${page}&limit=${itemsPerPage}`);
      setHistoryItems(response.data.items);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching history items:', error);
    }
  };
  */

  return (
    <div className='w-full max-w-4xl bg-white shadow-md rounded-lg p-6'>
      <h1 className='text-xl font-semibold mb-4 text-center'>検索履歴</h1>
      <div className='space-y-4 max-h-[60vh] overflow-y-auto'>
        {currentItems.map((item) => (
          <div key={item.id} className='border rounded-lg p-2'>
            <div className='grid grid-cols-6 gap-2 items-center'>
              <div className='row-span-3 flex items-center justify-center'>
                <div className='w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center'>
                  <span className='text-lg font-semibold'>{item.date}</span>
                </div>
              </div>
              <div className='col-span-4 grid grid-cols-2 gap-1'>
                <div className='py-1 px-2 text-sm rounded-md bg-gray-200 text-gray-700 truncate'>
                  {item.answers.q5}
                </div>
                <div className='py-1 px-2 text-sm rounded-md bg-gray-200 text-gray-700 truncate'>
                  {item.answers.q1}
                </div>
              </div>
              <div className='row-span-3'>
                <img
                  src={item.image}
                  alt='選択したアイテム'
                  className='w-24 h-24 object-cover rounded-md mx-auto'
                />
              </div>
              <div className='col-span-4 grid grid-cols-2 gap-1'>
                <div className='py-1 px-2 text-sm rounded-md bg-gray-200 text-gray-700 truncate'>
                  {item.answers.q2}
                </div>
                <div className='py-1 px-2 text-sm rounded-md bg-gray-200 text-gray-700 truncate'>
                  {item.answers.q3}
                </div>
              </div>
              <div className='col-span-4'>
                <div className='py-1 px-2 text-sm rounded-md bg-gray-200 text-gray-700 truncate'>
                  {item.answers.q4}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className='flex justify-between mt-4'>
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className='py-2 px-4 text-sm rounded-md bg-gray-300 text-gray-700 hover:bg-gray-400 transition-colors disabled:opacity-50'
        >
          前へ
        </button>
        <span className='py-2 px-4 text-sm'>
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className='py-2 px-4 text-sm rounded-md bg-gray-300 text-gray-700 hover:bg-gray-400 transition-colors disabled:opacity-50'
        >
          次へ
        </button>
      </div>
    </div>
  );
};

export default History;
