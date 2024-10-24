// C:\bc10\section9_teamA\frontend\src\app\api\business\analyze-data\route.ts

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/business/analyze-chart`, {
    const response = await fetch(`http://localhost:3000/api/business/analyze-chart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      console.error('API request failed:', await response.text());  // デバッグ用ログ追加
      throw new Error(`Backend API request failed: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json({ analysis: data.analysis });

  } catch (error) {
    console.error('Analysis failed:', error);  // デバッグ用ログ追加
    return NextResponse.json(
      { analysis: 'データの解析中にエラーが発生しました。' },
      { status: 500 }
    );
  }
}