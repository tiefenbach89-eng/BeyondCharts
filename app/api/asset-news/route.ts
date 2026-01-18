// app/api/asset-news/route.ts
import { NextResponse } from 'next/server';
import { fetchAllNews } from '@/lib/unified-news';
import { getStoredNews, storeNews, shouldFetchFreshNews, cleanupOldNews } from '@/lib/news-storage';

export const dynamic = 'force-dynamic';
export const revalidate = 7200; // Revalidate every 2 hours

export async function GET() {
  try {
    // Clean up old news (runs on every request, but DB checks internally)
    const deletedCount = await cleanupOldNews();
    if (deletedCount > 0) {
      console.log(`[API] Cleaned up ${deletedCount} old news items`);
    }

    // Check if we need to fetch fresh news (2 hour threshold)
    const needsFreshNews = await shouldFetchFreshNews(2 * 60 * 60 * 1000);

    if (!needsFreshNews) {
      // Serve from Supabase storage
      const storedNews = await getStoredNews(50);

      if (storedNews.length > 0) {
        console.log(`[API] Serving ${storedNews.length} news items from storage`);

        return NextResponse.json({
          success: true,
          news: storedNews,
          meta: {
            found: storedNews.length,
            returned: storedNews.length,
            limit: storedNews.length,
            page: 1,
            cached: true,
            source: 'storage',
          },
          timestamp: new Date().toISOString()
        });
      }
    }

    // Fetch fresh news from Finnhub + translate
    console.log('[API] Fetching fresh news from Finnhub API + translating...');
    const newsData = await fetchAllNews(20);

    // Store in Supabase for future requests
    if (newsData.length > 0) {
      const stored = await storeNews(newsData);
      if (stored) {
        console.log(`[API] Stored ${newsData.length} news items in Supabase`);
      }
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
        source: 'api',
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
