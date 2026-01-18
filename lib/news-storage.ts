// lib/news-storage.ts
// Persistent news storage in Supabase
// Stores news for 14 days, auto-deletes old entries

import { createClient } from '@supabase/supabase-js';
import type { UnifiedNewsItem } from './unified-news';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Use service role key for server-side operations
const supabase = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

export interface StoredNewsItem extends UnifiedNewsItem {
  stored_at: string; // When it was stored in DB
  fetched_at: string; // When it was originally fetched from API
}

/**
 * Initialize news storage (create table if needed)
 * This should be called on app startup
 */
export async function initNewsStorage() {
  if (!supabase) {
    console.warn('[News Storage] Supabase not configured');
    return false;
  }

  // Table will be created via migration
  console.log('[News Storage] Storage initialized');
  return true;
}

/**
 * Store news items in Supabase
 * Upserts based on news ID (no duplicates)
 */
export async function storeNews(news: UnifiedNewsItem[]): Promise<boolean> {
  if (!supabase) {
    console.warn('[News Storage] Supabase not configured');
    return false;
  }

  if (news.length === 0) {
    return true;
  }

  try {
    const now = new Date().toISOString();

    const newsToStore = news.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      snippet: item.snippet,
      url: item.url,
      image_url: item.image_url,
      published_at: item.published_at,
      source: item.source,
      category: item.category,
      related_symbols: item.related_symbols,
      stored_at: now,
      fetched_at: now,
    }));

    const { error } = await supabase
      .from('news_items')
      .upsert(newsToStore, {
        onConflict: 'id',
        ignoreDuplicates: false, // Update existing items
      });

    if (error) {
      console.error('[News Storage] Error storing news:', error);
      return false;
    }

    console.log(`[News Storage] Stored ${news.length} news items`);
    return true;
  } catch (error) {
    console.error('[News Storage] Error storing news:', error);
    return false;
  }
}

/**
 * Fetch news from Supabase storage
 * Returns news that are less than 14 days old
 */
export async function getStoredNews(limit: number = 50): Promise<UnifiedNewsItem[]> {
  if (!supabase) {
    console.warn('[News Storage] Supabase not configured');
    return [];
  }

  try {
    // Calculate cutoff date (14 days ago)
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

    const { data, error } = await supabase
      .from('news_items')
      .select('*')
      .gte('published_at', fourteenDaysAgo.toISOString())
      .order('published_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('[News Storage] Error fetching news:', error);
      return [];
    }

    if (!data || data.length === 0) {
      console.log('[News Storage] No stored news found');
      return [];
    }

    console.log(`[News Storage] Fetched ${data.length} stored news items`);

    // Convert to UnifiedNewsItem format
    return data.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      snippet: item.snippet,
      url: item.url,
      image_url: item.image_url,
      published_at: item.published_at,
      source: item.source,
      category: item.category,
      related_symbols: item.related_symbols || [],
    }));
  } catch (error) {
    console.error('[News Storage] Error fetching news:', error);
    return [];
  }
}

/**
 * Delete news older than 14 days
 * Should be called periodically (e.g., daily cron job)
 */
export async function cleanupOldNews(): Promise<number> {
  if (!supabase) {
    console.warn('[News Storage] Supabase not configured');
    return 0;
  }

  try {
    // Calculate cutoff date (14 days ago)
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

    const { data, error } = await supabase
      .from('news_items')
      .delete()
      .lt('published_at', fourteenDaysAgo.toISOString())
      .select();

    if (error) {
      console.error('[News Storage] Error cleaning up old news:', error);
      return 0;
    }

    const deletedCount = data?.length || 0;

    if (deletedCount > 0) {
      console.log(`[News Storage] Deleted ${deletedCount} old news items`);
    }

    return deletedCount;
  } catch (error) {
    console.error('[News Storage] Error cleaning up old news:', error);
    return 0;
  }
}

/**
 * Get the age of the newest news item in storage
 * Returns null if no news found
 */
export async function getNewestNewsAge(): Promise<number | null> {
  if (!supabase) {
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('news_items')
      .select('stored_at')
      .order('stored_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !data) {
      return null;
    }

    const storedAt = new Date(data.stored_at);
    const now = new Date();
    return now.getTime() - storedAt.getTime();
  } catch (error) {
    return null;
  }
}

/**
 * Check if we need to fetch fresh news
 * Returns true if storage is empty or news are older than threshold
 */
export async function shouldFetchFreshNews(maxAgeMs: number = 2 * 60 * 60 * 1000): Promise<boolean> {
  const age = await getNewestNewsAge();

  if (age === null) {
    console.log('[News Storage] No stored news found - should fetch fresh');
    return true;
  }

  const shouldFetch = age > maxAgeMs;

  if (shouldFetch) {
    console.log(`[News Storage] News are ${Math.round(age / 1000 / 60)} minutes old - should fetch fresh`);
  } else {
    console.log(`[News Storage] News are ${Math.round(age / 1000 / 60)} minutes old - using stored`);
  }

  return shouldFetch;
}

/**
 * Get news count statistics
 */
export async function getNewsStats(): Promise<{
  total: number;
  last24h: number;
  last7d: number;
  last14d: number;
} | null> {
  if (!supabase) {
    return null;
  }

  try {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const [total, last24h, last7d, last14d] = await Promise.all([
      supabase.from('news_items').select('id', { count: 'exact', head: true }),
      supabase.from('news_items').select('id', { count: 'exact', head: true }).gte('published_at', oneDayAgo.toISOString()),
      supabase.from('news_items').select('id', { count: 'exact', head: true }).gte('published_at', sevenDaysAgo.toISOString()),
      supabase.from('news_items').select('id', { count: 'exact', head: true }).gte('published_at', fourteenDaysAgo.toISOString()),
    ]);

    return {
      total: total.count || 0,
      last24h: last24h.count || 0,
      last7d: last7d.count || 0,
      last14d: last14d.count || 0,
    };
  } catch (error) {
    console.error('[News Storage] Error getting stats:', error);
    return null;
  }
}
