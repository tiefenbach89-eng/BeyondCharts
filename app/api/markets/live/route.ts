// app/api/markets/live/route.ts
// ✅ Live-Marktdaten: Yahoo Finance (Indizes) + Finnhub (Bitcoin)
// ✅ Next.js 16 / App Router / Vercel-safe
// ✅ Optimized with caching to reduce API calls and improve performance

import { NextResponse } from 'next/server';

/**
 * Diese Route MUSS dynamisch sein:
 * - externe Live-APIs
 * - no-store Fetch
 * - Realtime-Daten
 */
export const dynamic = 'force-dynamic';

/**
 * Node.js Runtime ist erforderlich:
 * - Yahoo Finance blockt Edge
 * - Finnhub ist nicht Edge-stabil
 */
export const runtime = 'nodejs';

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY || '';

// In-memory cache for market data (30 seconds TTL)
let marketDataCache: { data: any; timestamp: number } | null = null;
const CACHE_TTL = 30 * 1000; // 30 seconds
const FETCH_TIMEOUT = 5000; // 5 seconds timeout for each request

// Helper function to fetch with timeout
async function fetchWithTimeout(url: string, options: RequestInit = {}, timeout = FETCH_TIMEOUT) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

export async function GET() {
  try {
    // Check cache first
    const now = Date.now();
    if (marketDataCache && now - marketDataCache.timestamp < CACHE_TTL) {
      return NextResponse.json(marketDataCache.data, {
        headers: {
          'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
          'X-Cache': 'HIT',
        },
      });
    }

    // Indizes (Yahoo Finance)
    const indices = [
      { symbol: '^GSPC', name: 'S&P 500', region: 'US' },
      { symbol: '^DJI', name: 'Dow Jones', region: 'US' },
      { symbol: '^IXIC', name: 'Nasdaq', region: 'US' },
      { symbol: '^GDAXI', name: 'DAX', region: 'DE' },
      { symbol: '^FTSE', name: 'FTSE 100', region: 'UK' },
    ];

    const indexPromises = indices.map(async ({ symbol, name, region }) => {
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=1d&interval=1m`;

      const response = await fetchWithTimeout(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0',
        },
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error(`Yahoo Finance error for ${symbol}`);
      }

      const data = await response.json();
      const meta = data?.chart?.result?.[0]?.meta;

      if (!meta) {
        throw new Error(`Invalid Yahoo response for ${symbol}`);
      }

      const currentPrice = meta.regularMarketPrice;
      const previousClose = meta.chartPreviousClose;
      const change = currentPrice - previousClose;
      const changePercent = (change / previousClose) * 100;

      return {
        symbol: symbol.replace('^', ''),
        name,
        region,
        price: currentPrice.toFixed(2),
        change: change.toFixed(2),
        changePercent: changePercent.toFixed(2),
        high: meta.regularMarketDayHigh?.toFixed(2) ?? '0.00',
        low: meta.regularMarketDayLow?.toFixed(2) ?? '0.00',
        open: meta.regularMarketOpen?.toFixed(2) ?? currentPrice.toFixed(2),
        timestamp: meta.regularMarketTime ?? Date.now(),
      };
    });

    // Bitcoin (Finnhub)
    const btcPromise = (async () => {
      const url = `https://finnhub.io/api/v1/quote?symbol=BINANCE:BTCUSDT&token=${FINNHUB_API_KEY}`;

      const response = await fetchWithTimeout(url, { cache: 'no-store' });
      if (!response.ok) {
        throw new Error('Finnhub error');
      }

      const data = await response.json();

      const currentPrice = data.c || 0;
      const previousClose = data.pc || 0;
      const change = currentPrice - previousClose;
      const changePercent =
        previousClose !== 0 ? (change / previousClose) * 100 : 0;

      return {
        symbol: 'BTC',
        name: 'Bitcoin',
        region: 'CRYPTO',
        price: currentPrice.toFixed(2),
        change: change.toFixed(2),
        changePercent: changePercent.toFixed(2),
        high: (data.h || 0).toFixed(2),
        low: (data.l || 0).toFixed(2),
        open: (data.o || 0).toFixed(2),
        timestamp: data.t || Date.now(),
      };
    })();

    // 🔒 Robust: niemals kompletter Ausfall
    const indexResults = await Promise.allSettled(indexPromises);

    const indexData = indexResults.map((res, i) => {
      if (res.status === 'fulfilled') return res.value;

      return {
        symbol: indices[i].symbol.replace('^', ''),
        name: indices[i].name,
        region: indices[i].region,
        price: '0.00',
        change: '0.00',
        changePercent: '0.00',
        high: '0.00',
        low: '0.00',
        open: '0.00',
        timestamp: Date.now(),
      };
    });

    const btcData = await btcPromise;

    const responseData = [...indexData, btcData];

    // Update cache
    marketDataCache = {
      data: responseData,
      timestamp: now,
    };

    return NextResponse.json(responseData, {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
        'X-Cache': 'MISS',
      },
    });
  } catch (error) {
    console.error('Market API error:', error);

    return NextResponse.json(
      { error: 'Failed to fetch market data' },
      { status: 500 }
    );
  }
}
