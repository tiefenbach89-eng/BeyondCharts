// app/api/price/[ticker]/route.ts
// ✅ Simple price endpoint – Next.js 16 / Vercel safe

import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY || '';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ ticker: string }> }
) {
  try {
    const { ticker: rawTicker } = await context.params;

    if (!rawTicker) {
      return NextResponse.json(
        { error: 'Missing ticker' },
        { status: 400 }
      );
    }

    const ticker = rawTicker.replace('.DE', '');

    /* ------------------------------------------------------------ */
    /* Finnhub Quote                                                 */
    /* ------------------------------------------------------------ */

    const response = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(
        ticker
      )}&token=${FINNHUB_API_KEY}`,
      { cache: 'no-store' }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch price');
    }

    const data = await response.json();

    const currentPrice = typeof data.c === 'number' ? data.c : 0;
    const previousClose = typeof data.pc === 'number' ? data.pc : 0;
    const change = currentPrice - previousClose;
    const changePercent =
      previousClose !== 0 ? (change / previousClose) * 100 : 0;

    return NextResponse.json(
      {
        ticker,
        price: currentPrice,
        change,
        changePercent,
        timestamp: data.t || Date.now(),
      },
      {
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    );
  } catch (error: any) {
    console.error('❌ Price API error:', error);

    return NextResponse.json(
      { error: error.message || 'Failed to fetch price' },
      { status: 500 }
    );
  }
}
