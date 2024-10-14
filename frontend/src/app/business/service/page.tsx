'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ErrorBoundary } from 'react-error-boundary';
import { FallbackProps } from 'react-error-boundary';

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
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-xl font-semibold text-gray-700">支払いを確認中...</p>
        </div>
      </div>
    );
  }

  if (paymentStatus === 'error') {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-center bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">エラーが発生しました</h1>
          <p className="text-gray-700">{errorMessage}</p>
          <Link href="/business" className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
            ビジネストップページに戻る
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-2xl">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">ビジネス向けおみやげアプリへようこそ！</h1>
        <p className="text-xl text-green-600 mb-6">支払いが正常に完了しました。</p>
        <Link href="/business/dashboard" className="bg-blue-500 hover:bg-blue-600 text-white text-lg font-bold py-4 px-8 rounded-full shadow-lg transition duration-300 transform hover:scale-105">
          ビジネスダッシュボードへ進む
        </Link>
      </div>
    </div>
  );
}

function ErrorFallback({error, resetErrorBoundary}:FallbackProps) {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="text-center bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-red-600 mb-4">エラーが発生しました</h1>
        <p className="text-gray-700">{error.message}</p>
        <button onClick={resetErrorBoundary} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
          再試行
        </button>
      </div>
    </div>
  );
}

export default function BusinessServicePage() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<div>Loading...</div>}>
        <BusinessServiceContent />
      </Suspense>
    </ErrorBoundary>
  );
}