// lib/finnhub.ts
// Finnhub API integration for stock news
// Free tier: 60 API calls/minute, 30 calls/second

const FINNHUB_API_BASE = 'https://finnhub.io/api/v1';
const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY || '';

export interface FinnhubNewsItem {
  id: number;
  headline: string;
  summary: string;
  source: string;
  url: string;
  image: string;
  datetime: number; // Unix timestamp
  category: string;
  related: string; // Ticker symbol
}

/**
 * Fetch company news from Finnhub
 * @param symbol Stock symbol (e.g., 'AAPL')
 * @param from Start date (YYYY-MM-DD)
 * @param to End date (YYYY-MM-DD)
 */
export async function fetchFinnhubCompanyNews(
  symbol: string,
  from?: string,
  to?: string
): Promise<FinnhubNewsItem[]> {
  if (!FINNHUB_API_KEY) {
    console.warn('FINNHUB_API_KEY not configured');
    return [];
  }

  // Default: last 7 days
  if (!from || !to) {
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    to = today.toISOString().split('T')[0];
    from = weekAgo.toISOString().split('T')[0];
  }

  try {
    const url = `${FINNHUB_API_BASE}/company-news?symbol=${symbol}&from=${from}&to=${to}&token=${FINNHUB_API_KEY}`;

    const response = await fetch(url, {
      next: { revalidate: 1800 } // Cache for 30 minutes
    });

    if (!response.ok) {
      throw new Error(`Finnhub API error: ${response.status}`);
    }

    const data = await response.json();
    return data as FinnhubNewsItem[];
  } catch (error) {
    console.error('Error fetching Finnhub company news:', error);
    return [];
  }
}

/**
 * Fetch market news from Finnhub
 * @param category News category ('general', 'forex', 'crypto', 'merger')
 */
export async function fetchFinnhubMarketNews(
  category: string = 'general'
): Promise<FinnhubNewsItem[]> {
  if (!FINNHUB_API_KEY) {
    console.warn('FINNHUB_API_KEY not configured');
    return [];
  }

  try {
    const url = `${FINNHUB_API_BASE}/news?category=${category}&token=${FINNHUB_API_KEY}`;

    const response = await fetch(url, {
      next: { revalidate: 1800 } // Cache for 30 minutes
    });

    if (!response.ok) {
      throw new Error(`Finnhub API error: ${response.status}`);
    }

    const data = await response.json();
    return data as FinnhubNewsItem[];
  } catch (error) {
    console.error('Error fetching Finnhub market news:', error);
    return [];
  }
}

/**
 * Fetch news for multiple symbols
 */
export async function fetchFinnhubMultiSymbolNews(
  symbols: string[],
  limit: number = 10
): Promise<FinnhubNewsItem[]> {
  if (!FINNHUB_API_KEY) {
    console.warn('FINNHUB_API_KEY not configured');
    return [];
  }

  const today = new Date();
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

  const to = today.toISOString().split('T')[0];
  const from = weekAgo.toISOString().split('T')[0];

  try {
    // Fetch news for each symbol (up to 5 to avoid rate limits)
    const newsPromises = symbols.slice(0, 5).map(symbol =>
      fetchFinnhubCompanyNews(symbol, from, to)
    );

    const newsArrays = await Promise.all(newsPromises);
    const allNews = newsArrays.flat();

    // Remove duplicates based on headline
    const uniqueNews = Array.from(
      new Map(allNews.map(item => [item.headline, item])).values()
    );

    // Sort by date (newest first)
    uniqueNews.sort((a, b) => b.datetime - a.datetime);

    return uniqueNews.slice(0, limit);
  } catch (error) {
    console.error('Error fetching multi-symbol news:', error);
    return [];
  }
}

/**
 * Popular symbols for German/US markets
 */
export const POPULAR_SYMBOLS = [
  // US Tech
  'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 'NVDA', 'TSLA',
  // German (US-listed ADRs)
  'SAP', 'SIEGY', // Siemens
  // Indices
  'SPY', 'QQQ'
];
