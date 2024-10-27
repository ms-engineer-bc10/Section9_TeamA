import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function BusinessPage() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="text-center max-w-2xl">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">Business PAGE</h1>
        <p className="text-xl text-gray-700">ビジネス向けサービスへようこそ</p>
        <p className="text-xl text-gray-700 mb-6">~ リアルな情報を提供 ~</p>
        <div className="flex flex-col items-center space-y-6 mb-16">
          <div className="w-[267px] h-[133px] relative">
            <Image
              src="/images/buble.jpg"
              alt="ビジネス分析イメージ1"
              layout="fill"
              objectFit="cover"
              className="rounded-lg shadow-md"
            />
          </div>
          <div className="w-[267px] h-[133px] relative">
            <Image
              src="/images/line_graph.jpg"
              alt="ビジネス分析イメージ2"
              layout="fill"
              objectFit="cover"
              className="rounded-lg shadow-md"
            />
          </div>
        </div>
        <div className="text-left space-y-4 mb-12"> {/* mb-8 から mb-12 に変更してボタンとの間隔を広げる */}
          <p className="text-lg text-gray-800">
            いま、どんなおみやげが売れているのか？<br />
            商品開発、マーケティングに役立つ情報を提供！
          </p>
          <p className="text-sm text-gray-600">
            ご使用にはご登録が必要です。
          </p>
        </div>
        <div className="flex justify-center"> {/* ボタンを中央揃えにするためのコンテナ */}
          <Link href="/business/membership" passHref>
            <button className="bg-blue-500 hover:bg-blue-600 text-white text-lg font-bold py-4 px-8 rounded-full shadow-lg transition duration-300 transform hover:scale-105">
              詳しくはこちら
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}