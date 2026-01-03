// app/api/price/[ticker]/route.ts
// Simple price endpoint for portfolio refresh

import { NextResponse } from 'next/server';

export const runtime = "nodejs";


const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY || '';

export async function GET(
  request: Request,
  { params }: { params: { ticker: string } }
) {
  try {
    const ticker = params.ticker;
    
    // Finnhub Quote
    const url = `https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${FINNHUB_API_KEY}`;
    const response = await fetch(url, { cache: 'no-store' });
    
    if (!response.ok) {
      throw new Error('Failed to fetch price');
    }
    
    const data = await response.json();
    
    return NextResponse.json({
      ticker,
      price: data.c || 0,
      change: (data.c - data.pc) || 0,
      changePercent: data.pc !== 0 ? ((data.c - data.pc) / data.pc) * 100 : 0,
    });
    
  } catch (error) {
    console.error('Price fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch price' },
      { status: 500 }
    );
  }
}
