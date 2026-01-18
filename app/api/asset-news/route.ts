// app/api/asset-news/route.ts
import { NextResponse } from 'next/server';
import { fetchMarketauxNews, POPULAR_STOCK_SYMBOLS, EUROPEAN_COUNTRIES } from '@/lib/marketaux';

export const dynamic = 'force-dynamic';
export const revalidate = 300; // Revalidate every 5 minutes

export async function GET() {
  try {
    // Fetch news for popular assets from Marketaux
    const newsData = await fetchMarketauxNews(
      POPULAR_STOCK_SYMBOLS,
      20,
      'de' // German news
    );

    return NextResponse.json({
      success: true,
      news: newsData.data,
      meta: newsData.meta,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in asset-news API:', error);

    return NextResponse.json({
      success: false,
      error: 'Failed to fetch asset news',
      news: [],
      meta: { found: 0, returned: 0, limit: 0, page: 1 }
    }, { status: 500 });
  }
}
