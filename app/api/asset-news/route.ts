// app/api/asset-news/route.ts
import { NextResponse } from 'next/server';
import { fetchAllNews } from '@/lib/unified-news';
import { getCachedNews, setCachedNews, getCacheAge } from '@/lib/news-cache';

export const dynamic = 'force-dynamic';
export const revalidate = 1800; // Revalidate every 30 minutes

export async function GET() {
  try {
    // Try to get cached news first
    const cachedNews = getCachedNews();

    if (cachedNews && cachedNews.length > 0) {
      const cacheAge = getCacheAge();
      console.log(`[API] Serving ${cachedNews.length} cached news items (age: ${cacheAge ? Math.round(cacheAge / 1000) : 0}s)`);

      return NextResponse.json({
        success: true,
        news: cachedNews,
        meta: {
          found: cachedNews.length,
          returned: cachedNews.length,
          limit: cachedNews.length,
          page: 1,
          cached: true,
          cacheAge: cacheAge,
        },
        timestamp: new Date().toISOString()
      });
    }

    // No cache or expired - fetch from Finnhub
    console.log('[API] Cache miss - fetching from Finnhub API');
    const newsData = await fetchAllNews(20); // Fetch 20 news items

    // Cache the results
    if (newsData.length > 0) {
      setCachedNews(newsData as any); // Type cast for cache compatibility
    }

    return NextResponse.json({
      success: true,
      news: newsData,
      meta: {
        found: newsData.length,
        returned: newsData.length,
        limit: newsData.length,
        page: 1,
        cached: false,
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in asset-news API:', error);

    return NextResponse.json({
      success: false,
      error: 'Failed to fetch asset news',
      news: [],
      meta: { found: 0, returned: 0, limit: 0, page: 1, cached: false }
    }, { status: 500 });
  }
}
