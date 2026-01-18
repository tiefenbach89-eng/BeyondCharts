// lib/deepl.ts
// DeepL API integration for translating news content
// Free tier: 500,000 characters/month

const DEEPL_API_KEY = process.env.DEEPL_API_KEY || '';
const DEEPL_API_BASE = 'https://api-free.deepl.com/v2';

export interface DeepLTranslationResponse {
  translations: Array<{
    detected_source_language: string;
    text: string;
  }>;
}

/**
 * Translate text from English to German using DeepL
 * @param text Text to translate (or array of texts)
 * @param sourceLang Source language (default: 'EN')
 * @param targetLang Target language (default: 'DE')
 */
export async function translateText(
  text: string | string[],
  sourceLang: string = 'EN',
  targetLang: string = 'DE'
): Promise<string[]> {
  if (!DEEPL_API_KEY) {
    console.warn('DEEPL_API_KEY not configured - returning original text');
    return Array.isArray(text) ? text : [text];
  }

  const textsToTranslate = Array.isArray(text) ? text : [text];

  // Filter out empty strings
  const validTexts = textsToTranslate.filter(t => t && t.trim().length > 0);

  if (validTexts.length === 0) {
    return textsToTranslate;
  }

  try {
    const params = new URLSearchParams();
    validTexts.forEach(t => params.append('text', t));
    params.append('source_lang', sourceLang);
    params.append('target_lang', targetLang);

    const response = await fetch(`${DEEPL_API_BASE}/translate`, {
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${DEEPL_API_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`DeepL API error: ${response.status} - ${errorText}`);
      return textsToTranslate; // Return original on error
    }

    const data: DeepLTranslationResponse = await response.json();
    const translations = data.translations.map(t => t.text);

    // Log translation usage
    const charCount = validTexts.reduce((sum, t) => sum + t.length, 0);
    console.log(`[DeepL] Translated ${validTexts.length} texts (${charCount} characters)`);

    return translations;
  } catch (error) {
    console.error('Error translating with DeepL:', error);
    return textsToTranslate; // Return original on error
  }
}

/**
 * Translate news item fields (title and description)
 */
export async function translateNewsItem(
  title: string,
  description: string
): Promise<{ title: string; description: string }> {
  try {
    const textsToTranslate = [title, description].filter(t => t && t.trim());

    if (textsToTranslate.length === 0) {
      return { title, description };
    }

    const translations = await translateText(textsToTranslate);

    return {
      title: translations[0] || title,
      description: translations[1] || description,
    };
  } catch (error) {
    console.error('Error translating news item:', error);
    return { title, description };
  }
}

/**
 * Batch translate multiple news items
 * More efficient than translating one by one
 */
export async function translateNewsItems(
  items: Array<{ title: string; description: string }>
): Promise<Array<{ title: string; description: string }>> {
  if (!DEEPL_API_KEY) {
    console.warn('DEEPL_API_KEY not configured - returning original items');
    return items;
  }

  try {
    // Collect all texts to translate
    const allTexts: string[] = [];
    items.forEach(item => {
      allTexts.push(item.title);
      allTexts.push(item.description);
    });

    // Translate all at once (more efficient)
    const translations = await translateText(allTexts);

    // Map translations back to items
    const translatedItems = items.map((_, idx) => ({
      title: translations[idx * 2] || items[idx].title,
      description: translations[idx * 2 + 1] || items[idx].description,
    }));

    return translatedItems;
  } catch (error) {
    console.error('Error batch translating news items:', error);
    return items;
  }
}

/**
 * Check DeepL API usage (optional - requires auth key)
 */
export async function checkUsage(): Promise<{
  character_count: number;
  character_limit: number;
} | null> {
  if (!DEEPL_API_KEY) {
    return null;
  }

  try {
    const response = await fetch(`${DEEPL_API_BASE}/usage`, {
      headers: {
        'Authorization': `DeepL-Auth-Key ${DEEPL_API_KEY}`,
      },
    });

    if (!response.ok) {
      console.error(`DeepL usage check failed: ${response.status}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Error checking DeepL usage:', error);
    return null;
  }
}
