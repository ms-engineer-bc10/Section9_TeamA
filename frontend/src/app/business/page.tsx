// 'use client';

// import React, { useState } from 'react';
// import Image from 'next/image';
// import Link from 'next/link';

// export default function BusinessPage() {
//   const [isLoading, setIsLoading] = useState(false);

//   const yellowButtonStyle = "bg-yellow-500 hover:bg-yellow-400 text-white font-bold py-3 px-6 rounded-full shadow-lg transition duration-300 transform hover:scale-105 text-lg disabled:opacity-50 disabled:cursor-not-allowed";
//   const blueButtonStyle = "bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transition duration-300 transform hover:scale-105 text-lg";

//   const handleCheckout = async () => {
//     setIsLoading(true);
//     try {
//       const response = await fetch('/api/checkout', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         // 必要に応じてbodyにデータを追加
//       });
//       if (response.ok) {
//         const { url } = await response.json();
//         window.location.href = url;
//       } else {
//         const errorData = await response.json();
//         console.error('Checkout failed:', errorData.error);
//         // ユーザーにエラーを表示するロジックをここに追加
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       // ユーザーにエラーを表示するロジックをここに追加
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
//       <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full">
//         <div className="text-center">
//           <h1 className="text-4xl font-bold text-blue-600 mb-4">Business PAGE</h1>
//           <p className="text-xl text-gray-700 mb-3">ビジネス向けサービスへようこそ</p>
//           <p className="text-xl text-gray-700 mb-6">~ 有料会員ページ ~</p>
//           <div className="flex flex-col items-center space-y-6 mb-8">
//             <div className="w-[267px] h-[133px] relative">
//               <Image
//                 src="/images/buble.jpg"
//                 alt="ビジネス分析イメージ1"
//                 layout="fill"
//                 objectFit="cover"
//                 className="rounded-lg shadow-md"
//               />
//             </div>
//           </div>
//           <div className="space-y-4 mb-8">
//             <p className="text-lg text-gray-800">
//               今どんな商品が、どのように売れているのか、<br />
//               リアルタイムの市場状況を提供します。
//             </p>
//             <p className="text-lg text-gray-800">
//               オプション：商品開発、プロモーション支援など
//             </p>
//             <p className="text-sm text-gray-600 mt-4">
//               ご使用の際は登録が必要です。<br />
//               まずは、お試しから
//             </p>
//             <div className="mt-6 pt-4 border-t">
//               <h3 className="text-lg font-semibold mb-2">＜料金プラン＞</h3>
//               <p className="text-md">
//                 お試し期間： 2週間 無料<br />
//                 月額料金 ： 10,000円/月額
//               </p>
//             </div>
//           </div>
//           <div className="flex justify-center mt-6 space-x-4">
//             <button
//               onClick={handleCheckout}
//               disabled={isLoading}
//               className={yellowButtonStyle}
//             >
//               {isLoading ? (
//                 <span className="flex items-center justify-center">
//                   <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                   </svg>
//                   処理中...
//                 </span>
//               ) : (
//                 '詳しくはこちら'
//               )}
//             </button>
//             <Link href="/login" passHref>
//               <button className={blueButtonStyle}>
//                 ログイン
//               </button>
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function BusinessPage() {
  const [isLoading, setIsLoading] = useState(false);

  const yellowButtonStyle = "bg-yellow-500 hover:bg-yellow-400 text-white font-bold py-3 px-6 rounded-full shadow-lg transition duration-300 transform hover:scale-105 text-lg disabled:opacity-50 disabled:cursor-not-allowed";
  const blueButtonStyle = "bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transition duration-300 transform hover:scale-105 text-lg";

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // 必要に応じてbodyにデータを追加
      });
      if (response.ok) {
        const { url } = await response.json();
        window.location.href = url;
      } else {
        const errorData = await response.json();
        console.error('Checkout failed:', errorData.error);
        // ユーザーにエラーを表示するロジックをここに追加
      }
    } catch (error) {
      console.error('Error:', error);
      // ユーザーにエラーを表示するロジックをここに追加
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-blue-600 mb-4">Business PAGE</h1>
          <p className="text-xl text-gray-700 mb-3">ビジネス向けサービスへようこそ</p>
          <p className="text-xl text-gray-700 mb-6">~ 有料会員ページ ~</p>
          <div className="flex flex-col items-center space-y-6 mb-8">
            <div className="w-[267px] h-[133px] relative">
              <Image
                src="/images/buble.jpg"
                alt="ビジネス分析イメージ1"
                layout="fill"
                objectFit="cover"
                className="rounded-lg shadow-md"
              />
            </div>
          </div>
          <div className="space-y-4 mb-8">
            <p className="text-lg text-gray-800">
              今どんな商品が、どのように売れているのか、<br />
              リアルタイムの市場状況を提供します。
            </p>
            <p className="text-lg text-gray-800">
              オプション：商品開発、プロモーション支援など
            </p>
            <p className="text-sm text-gray-600 mt-4">
              ご使用の際は登録が必要です。<br />
              まずは、お試しから
            </p>
            <div className="mt-6 pt-4 border-t">
              <h3 className="text-lg font-semibold mb-2">＜料金プラン＞</h3>
              <p className="text-md">
                お試し期間： 2週間 無料<br />
                月額料金 ： 10,000円/月額
              </p>
            </div>
          </div>
          <div className="flex justify-center mt-6 space-x-4">
            <button
              onClick={handleCheckout}
              disabled={isLoading}
              className={yellowButtonStyle}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  処理中...
                </span>
              ) : (
                '詳しくはこちら'
              )}
            </button>
            <Link href="/login" passHref>
              <button className={blueButtonStyle}>
                ログイン
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}