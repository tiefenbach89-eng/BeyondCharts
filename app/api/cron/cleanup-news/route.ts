// app/api/cron/cleanup-news/route.ts
// Cron endpoint to clean up old news (can be called via Vercel Cron or manually)
import { NextResponse } from 'next/server';
import { cleanupOldNews, getNewsStats } from '@/lib/news-storage';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    // Verify authorization (Vercel Cron uses CRON_SECRET header)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get stats before cleanup
    const statsBefore = await getNewsStats();

    // Clean up old news (older than 14 days)
    const deletedCount = await cleanupOldNews();

    // Get stats after cleanup
    const statsAfter = await getNewsStats();

    console.log(`[Cron Cleanup] Deleted ${deletedCount} old news items`);

    return NextResponse.json({
      success: true,
      deleted: deletedCount,
      stats: {
        before: statsBefore,
        after: statsAfter,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[Cron Cleanup] Error:', error);

    return NextResponse.json({
      success: false,
      error: 'Failed to clean up old news',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
