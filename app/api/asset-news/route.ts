// app/api/asset-news/route.ts
import { NextResponse } from 'next/server';
import { fetchElbstreamNews, POPULAR_ASSET_ISINS } from '@/lib/elbstream';

export const dynamic = 'force-dynamic';
export const revalidate = 300; // Revalidate every 5 minutes

export async function GET() {
  try {
    // Fetch news for popular assets
    const newsData = await fetchElbstreamNews('de', 10, POPULAR_ASSET_ISINS);

    return NextResponse.json({
      success: true,
      news: newsData.data,
      nextCursor: newsData.nextCursor,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in asset-news API:', error);

    return NextResponse.json({
      success: false,
      error: 'Failed to fetch asset news',
      news: []
    }, { status: 500 });
  }
}
