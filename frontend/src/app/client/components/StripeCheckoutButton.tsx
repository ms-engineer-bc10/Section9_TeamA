'use client';

import React, { useState } from 'react';

const StripeCheckoutButton: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

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
    <button onClick={handleCheckout} disabled={isLoading}>
      {isLoading ? 'Processing...' : 'Checkout with Stripe'}
    </button>
  );
};

export default StripeCheckoutButton;