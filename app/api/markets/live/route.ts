// app/api/markets/live/route.ts
// ✅ HYBRID: Yahoo Finance für Indizes + Finnhub für Bitcoin

import { NextResponse } from 'next/server';

export const runtime = "nodejs";


const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY || '';

export async function GET() {
  try {
    // Index-Symbole für Yahoo Finance
    const indices = [
      { symbol: '^GSPC', name: 'S&P 500', region: 'US' },
      { symbol: '^DJI', name: 'Dow Jones', region: 'US' },
      { symbol: '^IXIC', name: 'Nasdaq', region: 'US' },
      { symbol: '^GDAXI', name: 'DAX', region: 'DE' },
      { symbol: '^FTSE', name: 'FTSE 100', region: 'UK' },
    ];

    // ✅ Hole Index-Daten von Yahoo Finance (kostenlos, keine API Key nötig)
    const indexPromises = indices.map(async ({ symbol, name, region }) => {
      try {
        // Yahoo Finance API Endpoint (public)
        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=1d&interval=1m`;
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0',
          },
          cache: 'no-store',
        });
        
        if (!response.ok) {
          throw new Error(`Yahoo Finance error for ${symbol}`);
        }
        
        const data = await response.json();
        const quote = data.chart.result[0].meta;
        
        const currentPrice = quote.regularMarketPrice;
        const previousClose = quote.chartPreviousClose;
        const change = currentPrice - previousClose;
        const changePercent = (change / previousClose) * 100;
        
        return {
          symbol: symbol.replace('^', ''),
          name,
          region,
          price: currentPrice.toFixed(2),
          change: change.toFixed(2),
          changePercent: changePercent.toFixed(2),
          high: quote.regularMarketDayHigh.toFixed(2),
          low: quote.regularMarketDayLow.toFixed(2),
          open: quote.regularMarketOpen?.toFixed(2) || currentPrice.toFixed(2),
          timestamp: quote.regularMarketTime,
        };
      } catch (error) {
        console.error(`Error fetching ${symbol}:`, error);
        return {
          symbol: symbol.replace('^', ''),
          name,
          region,
          price: '0.00',
          change: '0.00',
          changePercent: '0.00',
          high: '0.00',
          low: '0.00',
          open: '0.00',
          timestamp: Date.now(),
        };
      }
    });

    // ✅ Hole Bitcoin von Finnhub
    const btcPromise = async () => {
      try {
        const url = `https://finnhub.io/api/v1/quote?symbol=BINANCE:BTCUSDT&token=${FINNHUB_API_KEY}`;
        const response = await fetch(url, { cache: 'no-store' });
        const data = await response.json();
        
        const currentPrice = data.c || 0;
        const previousClose = data.pc || 0;
        const change = currentPrice - previousClose;
        const changePercent = previousClose !== 0 ? (change / previousClose) * 100 : 0;
        
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
      } catch (error) {
        console.error('Error fetching Bitcoin:', error);
        return {
          symbol: 'BTC',
          name: 'Bitcoin',
          region: 'CRYPTO',
          price: '0.00',
          change: '0.00',
          changePercent: '0.00',
          high: '0.00',
          low: '0.00',
          open: '0.00',
          timestamp: Date.now(),
        };
      }
    };

    const [indexData, btcData] = await Promise.all([
      Promise.all(indexPromises),
      btcPromise(),
    ]);

    const marketData = [...indexData, btcData];

    return NextResponse.json(marketData, {
      headers: {
        'Cache-Control': 'no-store',
      },
    });

  } catch (error) {
    console.error('Error fetching market data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch market data' },
      { status: 500 }
    );
  }
}
