import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-09-30.acacia', // 最新のAPIバージョンを指定
});

export async function POST(request: Request) {
    try {
      // Create Checkout Sessions from body params.
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
            price: 'price_1Q5pngF4pWfF667qymPFzDBI',
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${request.headers.get('origin')}/?success=true`,
        cancel_url: `${request.headers.get('origin')}/?canceled=true`,
      });

      // Instead of redirecting, we return the session URL
      return NextResponse.json({ url: session.url });
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: err.statusCode || 500 });
    }
  }