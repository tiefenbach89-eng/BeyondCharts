// lib/elbstream.ts
// Elbstream API integration for popular asset news

const ELBSTREAM_API_BASE = 'https://api.elbstream.com';
const ELBSTREAM_API_KEY = process.env.ELBSTREAM_API_KEY || '';

export interface ElbstreamNewsItem {
  id: string;
  headline: string;
  summary: string;
  url: string;
  source: string;
  published_at: string;
  created_at: string;
  assets: {
    isin: string;
    name: string;
    symbol?: string;
  }[];
}

export interface ElbstreamNewsGroup {
  id: string;
  created_at: string;
  items: ElbstreamNewsItem[];
}

export interface ElbstreamNewsResponse {
  data: ElbstreamNewsGroup[];
  nextCursor: {
    id: string;
    created_at: string;
  } | null;
}

export interface MostDiscussedAsset {
  isin: string;
  name: string;
  symbol?: string;
  mentions: number;
}

/**
 * Fetch news feed from Elbstream API
 * @param lang Language preference ('en' or 'de')
 * @param limit Number of news groups to fetch
 * @param isins Optional array of ISINs to filter by
 */
export async function fetchElbstreamNews(
  lang: 'en' | 'de' = 'de',
  limit: number = 10,
  isins?: string[]
): Promise<ElbstreamNewsResponse> {
  if (!ELBSTREAM_API_KEY) {
    console.warn('ELBSTREAM_API_KEY not configured');
    return { data: [], nextCursor: null };
  }

  try {
    const response = await fetch(`${ELBSTREAM_API_BASE}/news`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ELBSTREAM_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        lang,
        limit,
        ...(isins && isins.length > 0 && { isins }),
        cursor: {
          created_at: new Date().toISOString()
        }
      }),
      next: { revalidate: 300 } // Cache for 5 minutes
    });

    if (!response.ok) {
      throw new Error(`Elbstream API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching Elbstream news:', error);
    return { data: [], nextCursor: null };
  }
}

/**
 * Fetch most discussed assets from the last 8 hours
 */
export async function fetchMostDiscussedAssets(): Promise<MostDiscussedAsset[]> {
  if (!ELBSTREAM_API_KEY) {
    console.warn('ELBSTREAM_API_KEY not configured');
    return [];
  }

  try {
    const response = await fetch(`${ELBSTREAM_API_BASE}/news/most_discussed`, {
      headers: {
        'Authorization': `Bearer ${ELBSTREAM_API_KEY}`,
      },
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(`Elbstream API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching most discussed assets:', error);
    return [];
  }
}

/**
 * Get logo URL for an asset by ISIN
 * @param isin ISIN code of the asset
 * @param format Image format (png, svg, jpg, webp)
 * @param size Image size in pixels
 */
export function getAssetLogoUrl(
  isin: string,
  format: 'png' | 'svg' | 'jpg' | 'webp' = 'svg',
  size?: number
): string {
  const params = new URLSearchParams();
  if (format !== 'svg') params.append('format', format);
  if (size) params.append('size', size.toString());

  const queryString = params.toString();
  return `${ELBSTREAM_API_BASE}/logos/isin/${isin}${queryString ? `?${queryString}` : ''}`;
}

/**
 * Popular German/European asset ISINs for default news feed
 */
export const POPULAR_ASSET_ISINS = [
  'US0378331005', // Apple
  'US5949181045', // Microsoft
  'US88160R1014', // Tesla
  'US0231351067', // Amazon
  'US02079K3059', // Alphabet (Google)
  'DE0005140008', // Deutsche Bank
  'DE000BASF111', // BASF
  'DE0007164600', // SAP
  'DE0005557508', // Deutsche Telekom
  'DE0008469008', // Allianz
  'NL0000009538', // Airbus
  'DE000CBK1001', // Commerzbank
  'DE0005810055', // Deutsche Börse
];
