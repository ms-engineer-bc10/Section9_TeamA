import React from 'react';
import Image from 'next/image';

export default function LandingPage() {
  const buttonStyle = "bg-yellow-500 hover:bg-yellow-400 text-white font-bold py-3 px-6 rounded-full shadow-lg transition duration-300 transform hover:scale-105 text-lg";
  const businessButtonStyle = "bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transition duration-300 transform hover:scale-105 text-lg";

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        {/* 上部セクション */}
        <h1 className="text-2xl font-bold text-yellow-500 mb-6">MIYAGURU</h1>
        
        <div className="flex flex-col md:flex-row gap-6 mb-24">
          <div className="flex-1">
            <div className="w-full h-64 bg-blue-200 rounded-lg overflow-hidden">
              <Image
                src="/images/lp_top_picture.jpg"
                alt="女性の写真"
                width={400}
                height={256}
                layout="responsive"
                objectFit="cover"
              />
            </div>
          </div>
          
          <div className="flex-1 flex flex-col justify-center">
            <p className="text-lg">
              あなたにぴったりのおみやげが見つかるアプリ
            </p>
            <h2 className="text-2xl font-bold mb-4">おみやげ、再発見！</h2>
            <h3 className="text-6xl font-bold text-yellow-500 mb-10">MIYAGURU</h3>
            
            <div className="flex flex-col items-center">
              <p className="text-lg">
                ＊登録は無料＊
              </p>
              <button className={buttonStyle}>
                はじめる
              </button>
            </div>
          </div>
        </div>

        {/* 真ん中セクション */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <div className="flex-1">
              <Image
                src="/images/horai551.jpg"
                alt="蓬莱の豚まん551"
                width={300}
                height={200}
                layout="responsive"
                className="rounded-lg"
              />
            </div>
            <div className="flex-1">
              <Image
                src="/images/rokkatei_butter_sand.jpg"
                alt="六花亭レーズンサンド"
                width={300}
                height={200}
                layout="responsive"
                className="rounded-lg"
              />
            </div>
            <div className="flex-1">
              <Image
                src="/images/otabe.jpg"
                alt="おたべ"
                width={300}
                height={200}
                layout="responsive"
                className="rounded-lg"
              />
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <Image
                src="/images/purple_sweet_potato_tart.jpg"
                alt="紫いもタルト"
                width={300}
                height={200}
                layout="responsive"
                className="rounded-lg"
              />
            </div>
            <div className="flex-1">
              <Image
                src="/images/tokyo_banana.jpg"
                alt="東京ばなな"
                width={300}
                height={200}
                layout="responsive"
                className="rounded-lg"
              />
            </div>
            <div className="flex-1">
              <Image
                src="/images/dunda.jpg"
                alt="ずんだもち"
                width={300}
                height={200}
                layout="responsive"
                className="rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* 最下部セクション */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">＜サービス案内＞</h2>
          <h3 className="text-xl font-bold mb-2 text-yellow-500">MIYAGURU for You</h3>
          <ul className="list-disc pl-5 mb-8">
            <li>旅行に行く前でも、行った先でも、簡単・シンプルにぴったりのおみやげが探せる。</li>
            <li>簡単な登録で、何回でも無料で使える。</li>
            <li>検索はシンプルな5ステップ。</li>
            <li>同じ条件で、5種類のおみやげを確認できます。</li>
            <li>おみやげ人気ランキングも見れる。</li>
            <li>お気に入りのおみやげは、閲覧履歴で確認！</li>
          </ul>
          <p className="font-bold mb-10">まずは、使ってみてください！！</p>

          <div className="mb-8">
            <h3 className="text-xl font-bold mb-2 text-blue-500">MIYAGURU for Business</h3>
            <ul className="list-disc pl-5">
              <li>商品開発、マーケティング分析に役立つ情報を提供！</li>
              <li>おみやげ市場の多角的解析</li>
              <li>個人ではなかなか手に入らない情報を、リアルタイムで確認できます。</li>
              <li>オプション：商品開発提案や販売戦略の立案、ブランディング支援も致します。</li>
            </ul>
          </div>

          <div className="text-right">
            <button className={businessButtonStyle}>
              BusinessPAGEはこちら
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}