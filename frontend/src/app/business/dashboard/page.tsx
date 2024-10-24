'use client';

import React, { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

// 共通のスタイル定義
const contentWrapper = "min-h-screen bg-gray-100 p-4";
const contentInner = "max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 min-h-[calc(100vh-2rem)] flex flex-col";
const titleStyle = "text-4xl font-bold text-blue-600 mb-8 text-center";
const buttonStyle = "bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transition duration-300 transform hover:scale-105 text-lg";

export default function BusinessDashboard() {
  // 状態管理
  const [advice, setAdvice] = useState('');
  const [userQuery, setUserQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // API呼び出しの基本URL設定
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

  // APIの接続テスト
  useEffect(() => {
    const testApiConnection = async () => {
      try {
        const testUrl = `${API_BASE_URL}/api/test`;
        console.log('Testing API connection:', testUrl);
        
        const response = await fetch(testUrl);
        const data = await response.json();
        
        console.log('API Test Response:', {
          status: response.status,
          data: data
        });
      } catch (error) {
        console.error('API Test Error:', error);
      }
    };

    testApiConnection();
  }, [API_BASE_URL]);

  // テキストエリアの変更ハンドラ
  const handleQueryChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserQuery(e.target.value);
  }, []);

  // AI相談処理関数
  const handleAIConsultation = async () => {
    if (!userQuery.trim()) {
      alert('相談内容を入力してください。');
      return;
    }
    
    setIsLoading(true);
    setAdvice(''); // 既存の回答をクリア

    // API_BASE_URLのデバッグ出力
    console.log('Environment check:', {
      API_BASE_URL,
      NODE_ENV: process.env.NODE_ENV,
    });

    try {
      // リクエストの詳細をログ出力
      const requestUrl = `${API_BASE_URL}/api/get-ai-advice`;
      const requestBody = {
        query: userQuery,
        context: "商品開発、販売戦略、販売方針についてアドバイスをお願いします。"
      };

      console.log('Request details:', {
        url: requestUrl,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: requestBody
      });

      const response = await fetch(requestUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      // レスポンスの詳細をログ出力
      console.log('Response details:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
      });

      if (!response.ok) {
        // エラーレスポンスの詳細を取得して表示
        const errorText = await response.text();
        console.error('Error response:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText,
          headers: Object.fromEntries(response.headers.entries())
        });
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }

      if (!response.body) {
        console.error('Response body is null');
        throw new Error('Response body is null');
      }

      // ストリーミングレスポンスの処理
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      console.log('Starting stream reading...');

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          console.log('Stream reading completed');
          break;
        }
        
        const text = decoder.decode(value);
        console.log('Received chunk:', text.substring(0, 100) + '...'); // 最初の100文字だけ表示
        setAdvice(prev => prev + text);
      }
    } catch (error: unknown) {
      // エラーの詳細な情報を出力
      console.error('AI相談エラーの詳細:', {
        error,
        message: error instanceof Error ? error.message : '不明なエラー',
        stack: error instanceof Error ? error.stack : undefined
      });
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : '不明なエラーが発生しました';
        
      setAdvice(`申し訳ありません。エラーが発生しました: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={contentWrapper}>
      <div className={contentInner}>
        <h1 className={titleStyle}>Business PAGE</h1>
        
        <div className="flex-grow">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">ダッシュボード</h2>
          
          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">利用可能なサービス</h3>
            </div>
            <div className="border-t border-gray-200">
              <div className="px-4 py-5 sm:p-6">
                {/* 市場分析セクション */}
                <h4 className="text-lg leading-6 font-bold text-gray-900 mb-2">＜市場分析＞</h4>
                <p className="text-lg leading-6 text-gray-700 mb-6">リアルタイムの市場状況を分析し、レポートを提供します。</p>
                
                <div className="flex flex-col space-y-6">
                  {/* 価格帯分析セクション */}
                  <div>
                    <span className="text-lg leading-6 font-medium text-gray-900">１．今売れている価格帯</span>
                    <div className="flex flex-wrap gap-4 justify-end mt-2">
                      <Link href="/business/price-range/monthly-status">
                        <Button className={buttonStyle}>月次状況</Button>
                      </Link>
                      <Link href="/business/price-range/monthlyTrendpage">
                        <Button className={buttonStyle}>月次推移</Button>
                      </Link>
                      <Link href="/business/price-range/yearlyTrendpage">
                        <Button className={buttonStyle}>年次推移</Button>
                      </Link>
                    </div>
                  </div>

                  {/* エリア分析セクション */}
                  <div>
                    <span className="text-lg leading-6 font-medium text-gray-900">２．購入されているエリア</span>
                    <div className="flex flex-wrap gap-4 justify-end mt-2">
                      <Link href="/business/construction">
                        <Button className={buttonStyle}>月次状況</Button>
                      </Link>
                      <Link href="/business/construction">
                        <Button className={buttonStyle}>月次推移</Button>
                      </Link>
                      <Link href="/business/construction">
                        <Button className={buttonStyle}>年次推移</Button>
                      </Link>
                    </div>
                  </div>
                  
                  {/* AIアドバイスセクション */}
                  <div className="mt-8">
                    <h4 className="text-lg leading-6 font-bold text-gray-900 mb-4">３．個別AIアドバイス</h4>
                    <div className="flex flex-col space-y-4">
                      <div className="flex gap-4">
                        <Textarea
                          className="flex-grow"
                          placeholder="商品開発や販売戦略についての相談内容を入力してください"
                          value={userQuery}
                          onChange={handleQueryChange}
                          rows={4}
                          disabled={isLoading}
                        />
                        <Button
                          className="w-32 h-12 self-end"
                          onClick={handleAIConsultation}
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <span className="flex items-center">
                              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              処理中...
                            </span>
                          ) : 'AIに相談する'}
                        </Button>
                      </div>
                      
                      {/* AIアドバイス表示エリア */}
                      {advice && (
                        <Card className="mt-4">
                          <CardContent className="pt-6">
                            <h5 className="font-bold mb-2">AIからのアドバイス：</h5>
                            <p className="whitespace-pre-wrap">{advice}</p>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* フッターボタン */}
        <div className="mt-auto">
          <div className="flex justify-center">
            <Link href="/business/service">
              <Button className={buttonStyle}>
                会員トップページに戻る
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}