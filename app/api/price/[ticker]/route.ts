// app/api/price/[ticker]/route.ts
// Live-Preis-Endpoint für Portfolio-Refresh
// Next.js 16 / App Router / Vercel-safe

import { NextResponse } from 'next/server';

/**
 * Diese Route MUSS dynamisch sein:
 * - externe Live-API (Finnhub)
 * - no-store Fetch
 * - ticker als URL-Param
 */
export const dynamic = 'force-dynamic';

/**
 * Node.js Runtime ist erforderlich:
 * - Finnhub ist nicht Edge-stabil
 */
export const runtime = 'nodejs';

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY || '';

export async function GET(
  _request: Request,
  { params }: { params: { ticker: string } }
) {
  try {
    const ticker = params.ticker;

    if (!ticker) {
      return NextResponse.json(
        { error: 'Missing ticker' },
        { status: 400 }
      );
    }

    const url = `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(
      ticker
    )}&token=${FINNHUB_API_KEY}`;

    const response = await fetch(url, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Finnhub error for ${ticker}`);
    }

    const data = await response.json();

    const currentPrice = typeof data.c === 'number' ? data.c : 0;
    const previousClose = typeof data.pc === 'number' ? data.pc : 0;
    const change = currentPrice - previousClose;
    const changePercent =
      previousClose > 0 ? (change / previousClose) * 100 : 0;

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
  } catch (error) {
    console.error('Price fetch error:', error);

    return NextResponse.json(
      { error: 'Failed to fetch price' },
      { status: 500 }
    );
  }
}
