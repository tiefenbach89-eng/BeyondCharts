// app/api/assets/route.ts
// ✅ FINNHUB API mit korrekten TradingView Symbolen

import { NextResponse } from 'next/server';

export const runtime = "nodejs";


const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY || '';

// TradingView Symbol Mapping
const TV_SYMBOL_MAP: { [key: string]: string } = {
  // US Aktien
  'MSFT': 'NASDAQ:MSFT',
  'AAPL': 'NASDAQ:AAPL',
  'NVDA': 'NASDAQ:NVDA',
  'GOOGL': 'NASDAQ:GOOGL',
  'META': 'NASDAQ:META',
  'TSLA': 'NASDAQ:TSLA',
  'AMZN': 'NASDAQ:AMZN',
  
  // Deutsche Aktien
  'SAP': 'XETR:SAP',
  'SIE': 'XETR:SIE',
  'VOW3': 'XETR:VOW3',
  'AIR': 'XETR:AIR',
  
  // ETFs
  'SPY': 'AMEX:SPY',
  'QQQ': 'NASDAQ:QQQ',
  'VWCE': 'XETR:VWCE',
  'EUNL': 'XETR:EUNL',
  'IUSN': 'XETR:IUSN',
};

// Asset-Universe - OHNE .DE Suffix!
const ASSETS = [
  // US Tech Stocks
  { ticker: 'MSFT', name: 'Microsoft Corp', type: 'Aktie', sector: 'Technology', region: 'US', currency: 'USD' },
  { ticker: 'AAPL', name: 'Apple Inc', type: 'Aktie', sector: 'Technology', region: 'US', currency: 'USD' },
  { ticker: 'NVDA', name: 'NVIDIA Corp', type: 'Aktie', sector: 'Semiconductors', region: 'US', currency: 'USD' },
  { ticker: 'GOOGL', name: 'Alphabet (Google)', type: 'Aktie', sector: 'Technology', region: 'US', currency: 'USD' },
  { ticker: 'META', name: 'Meta (Facebook)', type: 'Aktie', sector: 'Technology', region: 'US', currency: 'USD' },
  { ticker: 'TSLA', name: 'Tesla Inc', type: 'Aktie', sector: 'Automotive', region: 'US', currency: 'USD' },
  { ticker: 'AMZN', name: 'Amazon.com Inc', type: 'Aktie', sector: 'E-Commerce', region: 'US', currency: 'USD' },
  
  // Deutsche Aktien
  { ticker: 'SAP', name: 'SAP SE', type: 'Aktie', sector: 'Software', region: 'DE', currency: 'EUR' },
  { ticker: 'SIE', name: 'Siemens AG', type: 'Aktie', sector: 'Industrials', region: 'DE', currency: 'EUR' },
  { ticker: 'VOW3', name: 'Volkswagen AG', type: 'Aktie', sector: 'Automotive', region: 'DE', currency: 'EUR' },
  { ticker: 'AIR', name: 'Airbus SE', type: 'Aktie', sector: 'Aerospace', region: 'DE', currency: 'EUR' },
  
  // ETFs
  { ticker: 'SPY', name: 'SPDR S&P 500 ETF', type: 'ETF', sector: 'US Large Cap', region: 'US', currency: 'USD' },
  { ticker: 'QQQ', name: 'Invesco QQQ (Nasdaq)', type: 'ETF', sector: 'US Tech', region: 'US', currency: 'USD' },
  { ticker: 'VWCE', name: 'Vanguard FTSE All-World', type: 'ETF', sector: 'Global Equity', region: 'EU', currency: 'EUR' },
  { ticker: 'EUNL', name: 'iShares MSCI World', type: 'ETF', sector: 'Global Equity', region: 'EU', currency: 'EUR' },
  { ticker: 'IUSN', name: 'iShares MSCI World Small Cap', type: 'ETF', sector: 'Global Small Cap', region: 'EU', currency: 'EUR' },
];

// EUR/USD Exchange Rate
async function getEURUSD() {
  try {
    const url = `https://finnhub.io/api/v1/quote?symbol=EUR/USD&token=${FINNHUB_API_KEY}`;
    const response = await fetch(url, { cache: 'no-store' });
    const data = await response.json();
    return data.c || 1.08;
  } catch (error) {
    console.error('Error fetching EUR/USD:', error);
    return 1.08; // Fallback
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'Aktie', 'ETF', etc.
    
    // Hole EUR/USD für Währungsumrechnung
    const eurUsd = await getEURUSD();
    
    // Filtere Assets wenn type angegeben
    const filteredAssets = type && type !== 'Alle' 
      ? ASSETS.filter(a => a.type === type)
      : ASSETS;
    
    // Hole Live-Daten von Finnhub für alle Assets
    const promises = filteredAssets.map(async (asset) => {
      try {
        // Für deutsche Aktien: Nutze .DE suffix für Finnhub
        const finnhubSymbol = asset.region === 'DE' ? `${asset.ticker}.DE` : asset.ticker;
        const url = `https://finnhub.io/api/v1/quote?symbol=${finnhubSymbol}&token=${FINNHUB_API_KEY}`;
        
        const response = await fetch(url, { cache: 'no-store' });
        
        if (!response.ok) {
          throw new Error(`Finnhub error for ${asset.ticker}`);
        }
        
        const data = await response.json();
        
        const currentPrice = data.c || 0;
        const previousClose = data.pc || 0;
        const change = currentPrice - previousClose;
        const changePercent = previousClose !== 0 ? (change / previousClose) * 100 : 0;
        
        // Rechne Preis in beide Währungen
        const priceUSD = asset.currency === 'EUR' ? currentPrice * eurUsd : currentPrice;
        const priceEUR = asset.currency === 'USD' ? currentPrice / eurUsd : currentPrice;
        
        return {
          ...asset,
          price: currentPrice,
          priceUSD: priceUSD,
          priceEUR: priceEUR,
          change: change,
          changePercent: changePercent,
          high: data.h || currentPrice,
          low: data.l || currentPrice,
          volume: data.v || 0,
          marketCap: 0, // Nicht in quote endpoint
          timestamp: data.t || Date.now(),
          tvSymbol: TV_SYMBOL_MAP[asset.ticker] || `NASDAQ:${asset.ticker}`, // TradingView Symbol
        };
      } catch (error) {
        console.error(`Error fetching ${asset.ticker}:`, error);
        return {
          ...asset,
          price: 0,
          priceUSD: 0,
          priceEUR: 0,
          change: 0,
          changePercent: 0,
          high: 0,
          low: 0,
          volume: 0,
          marketCap: 0,
          timestamp: Date.now(),
          tvSymbol: TV_SYMBOL_MAP[asset.ticker] || `NASDAQ:${asset.ticker}`,
          error: true,
        };
      }
    });
    
    const assetsData = await Promise.all(promises);
    
    return NextResponse.json({
      assets: assetsData,
      eurUsd: eurUsd,
      timestamp: new Date().toISOString(),
    }, {
      headers: {
        'Cache-Control': 'no-store',
      },
    });
    
  } catch (error) {
    console.error('Error fetching assets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch assets' },
      { status: 500 }
    );
  }
}
