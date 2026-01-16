// lib/slugGenerator.ts

/**
 * Generates a URL-friendly slug from a title
 * - Converts to lowercase
 * - Replaces spaces with hyphens
 * - Removes special characters
 * - Handles German umlauts
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    // Replace German umlauts
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    // Replace spaces with hyphens
    .replace(/\s+/g, '-')
    // Remove all non-alphanumeric characters except hyphens
    .replace(/[^a-z0-9-]/g, '')
    // Remove multiple consecutive hyphens
    .replace(/-+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '');
}


/**
 * Auto-generates slug as user types
 */
export function autoSlug(title: string): string {
  if (!title || title.trim() === '') {
    return '';
  }
  return generateSlug(title);
}

// Examples:
// "Nvidia: KI-Boom trifft auf" → "nvidia-ki-boom-trifft-auf"
// "Apple Q3 Earnings 2024" → "apple-q3-earnings-2024"
// "Über die Zukunft" → "ueber-die-zukunft"
