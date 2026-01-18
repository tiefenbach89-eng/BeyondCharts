// lib/news-cache.ts
// Server-side in-memory cache for news
// Prevents excessive API calls

import type { UnifiedNewsItem } from './unified-news';

interface CacheEntry {
  data: UnifiedNewsItem[];
  timestamp: number;
}

// In-memory cache (will reset on server restart, but that's fine)
let newsCache: CacheEntry | null = null;

// Cache duration: 30 minutes (1800000 ms)
const CACHE_DURATION = 30 * 60 * 1000;

export function getCachedNews(): UnifiedNewsItem[] | null {
  if (!newsCache) return null;

  const now = Date.now();
  const age = now - newsCache.timestamp;

  // Return cached data if still fresh
  if (age < CACHE_DURATION) {
    console.log(`[News Cache] Returning cached news (age: ${Math.round(age / 1000)}s)`);
    return newsCache.data;
  }

  // Cache expired
  console.log('[News Cache] Cache expired');
  return null;
}

export function setCachedNews(data: UnifiedNewsItem[]): void {
  newsCache = {
    data,
    timestamp: Date.now(),
  };
  console.log(`[News Cache] Cached ${data.length} news items`);
}

export function getCacheAge(): number | null {
  if (!newsCache) return null;
  return Date.now() - newsCache.timestamp;
}

export function clearCache(): void {
  newsCache = null;
  console.log('[News Cache] Cache cleared');
}
