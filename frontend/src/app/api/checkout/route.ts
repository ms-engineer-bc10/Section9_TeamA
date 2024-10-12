import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// 環境変数が設定されていない場合のエラーを防ぐ
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  throw new Error('STRIPE_SECRET_KEY is not set in the environment variables');
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2024-09-30.acacia', // 2024年10月13日現在の最新APIバージョン
});

export async function POST(request: Request) {
  try {
    // リクエストからoriginを取得
    const origin = request.headers.get('origin') || 'http://localhost:3000';

    // Checkout Sessionを作成
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: 'price_1Q5pngF4pWfF667qymPFzDBI', // この価格IDが正しいことを確認してください
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/canceled`,
    });

    // セッションURLをJSONレスポンスとして返す
    return NextResponse.json({ url: session.url });
  } catch (err) {
    if (err instanceof Error) {
      console.error('Stripe error:', err);
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
}
