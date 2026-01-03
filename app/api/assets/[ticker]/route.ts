// app/api/assets/[ticker]/route.ts
// ✅ Finnhub Asset Endpoint – Next.js 16 / Vercel safe

import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

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

    // Finnhub nutzt keine .DE Suffixe
    const ticker = rawTicker.replace('.DE', '');

    console.log('🔍 Fetching asset from Finnhub:', ticker);

    /* ------------------------------------------------------------------ */
    /* Quote                                                              */
    /* ------------------------------------------------------------------ */

    const quoteResponse = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(
        ticker
      )}&token=${FINNHUB_API_KEY}`,
      { cache: 'no-store' }
    );

    if (!quoteResponse.ok) {
      throw new Error('Asset nicht gefunden');
    }

    const quoteData = await quoteResponse.json();

    /* ------------------------------------------------------------------ */
    /* Company Profile                                                     */
    /* ------------------------------------------------------------------ */

    const profileResponse = await fetch(
      `https://finnhub.io/api/v1/stock/profile2?symbol=${encodeURIComponent(
        ticker
      )}&token=${FINNHUB_API_KEY}`,
      { cache: 'no-store' }
    );

    const profileData = profileResponse.ok
      ? await profileResponse.json()
      : {};

    /* ------------------------------------------------------------------ */
    /* Financial Metrics                                                   */
    /* ------------------------------------------------------------------ */

    const metricsResponse = await fetch(
      `https://finnhub.io/api/v1/stock/metric?symbol=${encodeURIComponent(
        ticker
      )}&metric=all&token=${FINNHUB_API_KEY}`,
      { cache: 'no-store' }
    );

    const metricsData = metricsResponse.ok
      ? await metricsResponse.json()
      : {};

    const metric = metricsData.metric || {};

    /* ------------------------------------------------------------------ */
    /* Fundamentals                                                       */
    /* ------------------------------------------------------------------ */

    const fundamentals = {
      marketCap: profileData.marketCapitalization
        ? `${(profileData.marketCapitalization / 1000).toFixed(2)}B $`
        : metric.marketCapitalization
        ? `${(metric.marketCapitalization / 1000).toFixed(2)}B $`
        : 'N/A',

      pe: metric.peNormalizedAnnual
        ? metric.peNormalizedAnnual.toFixed(2)
        : metric.peBasicExclExtraTTM
        ? metric.peBasicExclExtraTTM.toFixed(2)
        : 'N/A',

      eps: metric.epsExclExtraItemsAnnual
        ? `${metric.epsExclExtraItemsAnnual.toFixed(2)} $`
        : metric.epsBasicExclExtraItemsTTM
        ? `${metric.epsBasicExclExtraItemsTTM.toFixed(2)} $`
        : 'N/A',

      dividend: metric.dividendYieldIndicatedAnnual
        ? `${metric.dividendYieldIndicatedAnnual.toFixed(2)}%`
        : metric.dividendYieldTTM
        ? `${metric.dividendYieldTTM.toFixed(2)}%`
        : 'N/A',

      beta: metric.beta ? metric.beta.toFixed(2) : 'N/A',

      week52High: metric['52WeekHigh']
        ? metric['52WeekHigh'].toFixed(2)
        : 'N/A',

      week52Low: metric['52WeekLow']
        ? metric['52WeekLow'].toFixed(2)
        : 'N/A',

      avgVolume: metric.avgVol10Day
        ? `${(metric.avgVol10Day / 1e6).toFixed(2)}M`
        : 'N/A',

      shares: profileData.shareOutstanding
        ? `${profileData.shareOutstanding.toFixed(2)}M`
        : 'N/A',
    };

    /* ------------------------------------------------------------------ */
    /* Prices                                                             */
    /* ------------------------------------------------------------------ */

    const currentPrice = typeof quoteData.c === 'number' ? quoteData.c : 0;
    const previousClose = typeof quoteData.pc === 'number' ? quoteData.pc : 0;
    const change = currentPrice - previousClose;
    const changePercent =
      previousClose > 0 ? (change / previousClose) * 100 : 0;

    /* ------------------------------------------------------------------ */
    /* EUR / USD                                                          */
    /* ------------------------------------------------------------------ */

    const eurUsdResponse = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=EUR/USD&token=${FINNHUB_API_KEY}`,
      { cache: 'no-store' }
    );

    const eurUsdData = eurUsdResponse.ok
      ? await eurUsdResponse.json()
      : {};

    const eurUsd =
      typeof eurUsdData.c === 'number' ? eurUsdData.c : 1.08;

    /* ------------------------------------------------------------------ */
    /* Final Payload                                                      */
    /* ------------------------------------------------------------------ */

    return NextResponse.json(
      {
        ticker,
        name: profileData.name || ticker,
        currency: 'USD',
        price: currentPrice,
        priceUSD: currentPrice,
        priceEUR: currentPrice / eurUsd,
        change,
        changePercent,
        high: quoteData.h || currentPrice,
        low: quoteData.l || currentPrice,
        open: quoteData.o || currentPrice,
        volume: quoteData.v || 0,
        previousClose,
        fundamentals,
        eurUsd,
        timestamp: quoteData.t || Date.now(),
      },
      {
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    );
  } catch (error: any) {
    console.error('❌ Asset API Error:', error);

    return NextResponse.json(
      { error: error.message || 'Failed to fetch asset details' },
      { status: 500 }
    );
  }
}
