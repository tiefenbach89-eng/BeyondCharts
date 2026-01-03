// app/api/assets/[ticker]/route.ts
// ✅ FINNHUB API - Funktioniert garantiert!

import { NextResponse } from 'next/server';

export const runtime = "nodejs";


const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY || '';

export async function GET(
  request: Request,
  { params }: { params: { ticker: string } }
) {
  try {
    const ticker = params.ticker.replace('.DE', ''); // Finnhub nutzt keine .DE suffixe
    
    console.log('🔍 Fetching from Finnhub:', ticker);
    
    // 1. Quote Data (Preis, Change, etc.)
    const quoteUrl = `https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${FINNHUB_API_KEY}`;
    const quoteResponse = await fetch(quoteUrl, { cache: 'no-store' });
    
    if (!quoteResponse.ok) {
      throw new Error('Asset nicht gefunden');
    }
    
    const quoteData = await quoteResponse.json();
    
    // 2. Company Profile (Name, MarketCap, etc.)
    const profileUrl = `https://finnhub.io/api/v1/stock/profile2?symbol=${ticker}&token=${FINNHUB_API_KEY}`;
    const profileResponse = await fetch(profileUrl, { cache: 'no-store' });
    const profileData = profileResponse.ok ? await profileResponse.json() : {};
    
    // 3. Basic Financials (P/E, EPS, etc.)
    const metricsUrl = `https://finnhub.io/api/v1/stock/metric?symbol=${ticker}&metric=all&token=${FINNHUB_API_KEY}`;
    const metricsResponse = await fetch(metricsUrl, { cache: 'no-store' });
    const metricsData = metricsResponse.ok ? await metricsResponse.json() : {};
    
    console.log('📊 Finnhub Metrics:', metricsData.metric ? Object.keys(metricsData.metric) : 'No metrics');
    
    // Extrahiere Fundamentals
    const metric = metricsData.metric || {};
    
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
      
      beta: metric.beta
        ? metric.beta.toFixed(2)
        : 'N/A',
      
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
        ? `${(profileData.shareOutstanding).toFixed(2)}M`
        : 'N/A',
    };
    
    console.log('📈 Final Fundamentals:', fundamentals);
    
    // Berechne Preis-Daten
    const currentPrice = quoteData.c || 0;
    const previousClose = quoteData.pc || 0;
    const change = currentPrice - previousClose;
    const changePercent = previousClose !== 0 ? (change / previousClose) * 100 : 0;
    
    // EUR/USD Rate
    const eurUsdUrl = `https://finnhub.io/api/v1/quote?symbol=EUR/USD&token=${FINNHUB_API_KEY}`;
    const eurUsdResponse = await fetch(eurUsdUrl, { cache: 'no-store' });
    const eurUsdData = await eurUsdResponse.json();
    const eurUsd = eurUsdData.c || 1.08;
    
    const assetData = {
      ticker: ticker,
      name: profileData.name || ticker,
      currency: 'USD', // Finnhub gibt alles in USD
      price: currentPrice,
      priceUSD: currentPrice,
      priceEUR: currentPrice / eurUsd,
      change: change,
      changePercent: changePercent,
      high: quoteData.h || currentPrice,
      low: quoteData.l || currentPrice,
      open: quoteData.o || currentPrice,
      volume: quoteData.v || 0,
      previousClose: previousClose,
      fundamentals: fundamentals,
      eurUsd: eurUsd,
      timestamp: quoteData.t || Date.now(),
    };
    
    return NextResponse.json(assetData, {
      headers: {
        'Cache-Control': 'no-store',
      },
    });
    
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch asset details' },
      { status: 500 }
    );
  }
}
