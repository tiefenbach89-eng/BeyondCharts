// lib/unified-news.ts
// Unified news interface - converts Finnhub to a common format

import { fetchFinnhubMarketNews, fetchFinnhubMultiSymbolNews, POPULAR_SYMBOLS, type FinnhubNewsItem } from './finnhub';
import { translateNewsItems } from './deepl';

export interface UnifiedNewsItem {
  id: string;
  title: string;
  description: string;
  snippet: string;
  url: string;
  image_url: string;
  published_at: string;
  source: string;
  category: string;
  related_symbols: string[];
}

/**
 * Convert Finnhub news to unified format
 */
function convertFinnhubToUnified(item: FinnhubNewsItem): UnifiedNewsItem {
  return {
    id: item.id.toString(),
    title: item.headline,
    description: item.summary,
    snippet: item.summary, // Finnhub only has summary, no separate snippet
    url: item.url,
    image_url: item.image,
    published_at: new Date(item.datetime * 1000).toISOString(),
    source: item.source,
    category: item.category,
    related_symbols: item.related ? [item.related] : [],
  };
}

/**
 * Fetch all news from Finnhub and translate to German
 * Combines market news + multi-symbol news
 */
export async function fetchAllNews(limit: number = 20): Promise<UnifiedNewsItem[]> {
  try {
    // Fetch both general market news and symbol-specific news in parallel
    const [marketNews, symbolNews] = await Promise.all([
      fetchFinnhubMarketNews('general'),
      fetchFinnhubMultiSymbolNews(POPULAR_SYMBOLS, 15)
    ]);

    // Combine and convert to unified format
    const allNews = [...marketNews, ...symbolNews];

    // Remove duplicates based on headline
    const uniqueNews = Array.from(
      new Map(allNews.map(item => [item.headline, item])).values()
    );

    // Sort by date (newest first)
    uniqueNews.sort((a, b) => b.datetime - a.datetime);

    // Convert to unified format
    const unifiedNews = uniqueNews
      .slice(0, limit)
      .map(convertFinnhubToUnified);

    // Translate titles and descriptions to German
    console.log('[Unified News] Translating news to German...');
    const newsToTranslate = unifiedNews.map(item => ({
      title: item.title,
      description: item.description,
    }));

    const translations = await translateNewsItems(newsToTranslate);

    // Apply translations
    const translatedNews = unifiedNews.map((item, idx) => ({
      ...item,
      title: translations[idx].title,
      description: translations[idx].description,
      snippet: translations[idx].description, // Use translated description as snippet too
    }));

    console.log(`[Unified News] Translated ${translatedNews.length} news items`);

    return translatedNews;
  } catch (error) {
    console.error('Error fetching unified news:', error);
    return [];
  }
}

/**
 * Group news by time period
 */
export function groupNewsByTime(news: UnifiedNewsItem[]) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

  const groups = {
    heute: [] as UnifiedNewsItem[],
    gestern: [] as UnifiedNewsItem[],
    älter: [] as UnifiedNewsItem[],
  };

  news.forEach(item => {
    const publishedDate = new Date(item.published_at);

    if (publishedDate >= today) {
      groups.heute.push(item);
    } else if (publishedDate >= yesterday) {
      groups.gestern.push(item);
    } else {
      groups.älter.push(item);
    }
  });

  return groups;
}
