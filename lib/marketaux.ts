// lib/marketaux.ts
// Marketaux API integration for popular asset news
// Free tier: No credit card required, generous limits

const MARKETAUX_API_BASE = 'https://api.marketaux.com/v1';
const MARKETAUX_API_TOKEN = process.env.MARKETAUX_API_TOKEN || '';

export interface MarketauxEntity {
  symbol: string;
  name: string;
  exchange: string | null;
  exchange_long: string | null;
  country: string;
  type: string;
  industry: string;
  match_score: number;
  sentiment_score: number;
  highlights: Array<{
    highlight: string;
    sentiment: number;
  }>;
}

export interface MarketauxNewsItem {
  uuid: string;
  title: string;
  description: string;
  snippet: string;
  url: string;
  image_url: string;
  published_at: string;
  source: string;
  entities: MarketauxEntity[];
  similar?: string[];
}

export interface MarketauxNewsResponse {
  meta: {
    found: number;
    returned: number;
    limit: number;
    page: number;
  };
  data: MarketauxNewsItem[];
}

/**
 * Fetch news from Marketaux API
 * @param symbols Optional array of ticker symbols (e.g., ['AAPL', 'MSFT'])
 * @param limit Number of news items to fetch (default: 10)
 * @param language Language code ('de' or 'en')
 * @param countries Optional array of country codes (e.g., ['us', 'de'])
 */
export async function fetchMarketauxNews(
  symbols?: string[],
  limit: number = 10,
  language: 'en' | 'de' = 'de',
  countries?: string[]
): Promise<MarketauxNewsResponse> {
  if (!MARKETAUX_API_TOKEN) {
    console.warn('MARKETAUX_API_TOKEN not configured');
    return {
      meta: { found: 0, returned: 0, limit: 0, page: 1 },
      data: []
    };
  }

  try {
    const params = new URLSearchParams({
      api_token: MARKETAUX_API_TOKEN,
      limit: limit.toString(),
      language: language,
      filter_entities: 'true', // Only return news with identified entities
    });

    // Add symbols if provided
    if (symbols && symbols.length > 0) {
      params.append('symbols', symbols.join(','));
    }

    // Add countries if provided
    if (countries && countries.length > 0) {
      params.append('countries', countries.join(','));
    }

    const url = `${MARKETAUX_API_BASE}/news/all?${params.toString()}`;

    const response = await fetch(url, {
      next: { revalidate: 300 } // Cache for 5 minutes
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(`Marketaux API error: ${response.status} - ${errorData?.error?.message || 'Unknown error'}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching Marketaux news:', error);
    return {
      meta: { found: 0, returned: 0, limit: 0, page: 1 },
      data: []
    };
  }
}

/**
 * Fetch trending entities from Marketaux
 */
export async function fetchTrendingEntities(): Promise<MarketauxEntity[]> {
  if (!MARKETAUX_API_TOKEN) {
    console.warn('MARKETAUX_API_TOKEN not configured');
    return [];
  }

  try {
    const params = new URLSearchParams({
      api_token: MARKETAUX_API_TOKEN,
    });

    const url = `${MARKETAUX_API_BASE}/entity/trending/aggregation?${params.toString()}`;

    const response = await fetch(url, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(`Marketaux API error: ${response.status}`);
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching trending entities:', error);
    return [];
  }
}

/**
 * Popular stock ticker symbols for default news feed
 * Using ticker symbols instead of ISINs for Marketaux
 */
export const POPULAR_STOCK_SYMBOLS = [
  // US Tech Giants
  'AAPL',   // Apple
  'MSFT',   // Microsoft
  'TSLA',   // Tesla
  'AMZN',   // Amazon
  'GOOGL',  // Alphabet (Google)
  'META',   // Meta (Facebook)
  'NVDA',   // NVIDIA

  // German DAX Companies
  'SAP',    // SAP
  'SIE.DE', // Siemens
  'VOW3.DE', // Volkswagen
  'DTE.DE', // Deutsche Telekom
  'DBK.DE', // Deutsche Bank
  'ALV.DE', // Allianz
  'BAS.DE', // BASF
  'BMW.DE', // BMW
];

/**
 * Country codes for German/European markets
 */
export const EUROPEAN_COUNTRIES = ['de', 'fr', 'gb', 'nl', 'ch', 'at'];
