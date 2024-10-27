'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ErrorBoundary } from 'react-error-boundary';
import { FallbackProps } from 'react-error-boundary';

// 共通のスタイル定義
const contentWrapper = "min-h-screen bg-gray-100 p-4";
const contentInner = "max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 h-[calc(100vh-2rem)] flex flex-col";
const titleStyle = "text-4xl font-bold text-blue-600 mb-4 text-center";
const buttonStyle = "bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transition duration-300 transform hover:scale-105 text-lg";

function BusinessServiceContent() {
  const [paymentStatus, setPaymentStatus] = React.useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const searchParams = useSearchParams();

  React.useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (sessionId) {
      verifyPayment(sessionId);
    } else {
      setPaymentStatus('error');
      setErrorMessage('セッションIDが見つかりません。');
    }
  }, [searchParams]);

  const verifyPayment = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/business/verify-payment?session_id=${sessionId}`);
      const data = await response.json();
      if (data.success) {
        setPaymentStatus('success');
      } else {
        setPaymentStatus('error');
        setErrorMessage(data.message || '支払いの確認中にエラーが発生しました。');
      }
    } catch (error) {
      setPaymentStatus('error');
      setErrorMessage('サーバーとの通信中にエラーが発生しました。');
    }
  };

  if (paymentStatus === 'loading') {
    return (
      <div className={contentWrapper}>
        <div className={contentInner}>
          <h1 className={titleStyle}>Business PAGE</h1>
          <div className="flex-grow flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-xl font-semibold text-gray-700">支払いを確認中...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (paymentStatus === 'error') {
    return (
      <div className={contentWrapper}>
        <div className={contentInner}>
          <h1 className={titleStyle}>Business PAGE</h1>
          <div className="flex-grow flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-red-600 mb-4">エラーが発生しました</h2>
              <p className="text-gray-700 mb-4">{errorMessage}</p>
              <Link href="/business" className={buttonStyle}>
                ビジネストップページに戻る
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={contentWrapper}>
      <div className={contentInner}>
        <h1 className={titleStyle}>Business PAGE</h1>
        <div className="flex-grow flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold text-blue-600 mb-8">おみやげアプリ、BusinessPAGEへようこそ！</h2>
          <p className="text-xl text-green-600 mb-12">支払いが正常に完了しました。</p>
          <Link href="/business/dashboard" className={buttonStyle}>
            ダッシュボードへ進む
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorFallback({error, resetErrorBoundary}: FallbackProps) {
  return (
    <div className={contentWrapper}>
      <div className={contentInner}>
        <h1 className={titleStyle}>Business PAGE</h1>
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">エラーが発生しました</h2>
            <p className="text-gray-700 mb-4">{error.message}</p>
            <button onClick={resetErrorBoundary} className={buttonStyle}>
              再試行
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BusinessServicePage() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={
        <div className={contentWrapper}>
          <div className={contentInner}>
            <h1 className={titleStyle}>Business PAGE</h1>
            <div className="flex-grow flex items-center justify-center">
              <p className="text-xl font-semibold text-gray-700">Loading...</p>
            </div>
          </div>
        </div>
      }>
        <BusinessServiceContent />
      </Suspense>
    </ErrorBoundary>
  );
}