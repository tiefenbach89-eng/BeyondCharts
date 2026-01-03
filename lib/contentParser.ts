// lib/contentParser.ts

import type { ParsedContent, ContentSection } from '@/types/analyse';

/**
 * Detects if content is HTML or Markdown
 */
export function isHtmlContent(content: string): boolean {
  if (!content) return false;
  
  // Check for common HTML tags
  const htmlTags = /<(h[1-6]|p|div|strong|em|ul|ol|li|br|img|a|blockquote|hr)[^>]*>/i;
  return htmlTags.test(content);
}

/**
 * Berechnet die Lesezeit basierend auf Wortanzahl
 * @param content - Der zu analysierende Text
 * @returns Geschätzte Lesezeit in Minuten
 */
export function calculateReadingTime(content: string): number {
  if (!content) return 0;
  
  // Strip HTML tags for word count
  const textOnly = content.replace(/<[^>]*>/g, ' ');
  
  const wordsPerMinute = 200;
  const wordCount = textOnly.trim().split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  
  return Math.max(1, minutes); // Minimum 1 Minute
}

/**
 * Parsed strukturierten Content mit ## Headers
 * @param content - Raw content string
 * @returns Strukturierte Sections mit Titeln und Paragraphen
 */
export function parseStructuredContent(content: string): ParsedContent {
  if (!content) {
    return { sections: [] };
  }
  
  // Split by ## headers (but keep the ##)
  const parts = content.split(/(?=##\s)/g).filter(Boolean);
  
  const sections: ContentSection[] = parts.map(part => {
    const lines = part.trim().split('\n');
    const titleLine = lines[0];
    
    // Extract title and remove ##
    const title = titleLine.replace(/^##\s*/, '').trim();
    
    // Join remaining lines as body
    const body = lines.slice(1).join('\n').trim();
    
    // Split into paragraphs (by double newline)
    const paragraphs = body
      .split(/\n\n+/)
      .map(p => p.trim())
      .filter(Boolean);
    
    return { title, paragraphs };
  });
  
  return { sections };
}

/**
 * Formatiert ein Datum für die Anzeige
 * @param dateString - ISO date string oder ähnliches
 * @returns Formatiertes Datum (YYYY-MM-DD)
 */
export function formatDate(dateString?: string): string {
  if (!dateString) return "Recent";
  
  try {
    return dateString.slice(0, 10);
  } catch {
    return "Recent";
  }
}

/**
 * Prüft ob ein Paragraph eine Liste enthält
 */
export function isList(paragraph: string): boolean {
  return !!(
    paragraph.match(/^[\s]*[-•]\s/m) || 
    paragraph.match(/^[\s]*\d+\.\s/m)
  );
}

/**
 * Extrahiert List Items aus einem Paragraph
 */
export function extractListItems(paragraph: string): string[] {
  return paragraph
    .split(/\n/)
    .filter(line => {
      const trimmed = line.trim();
      return trimmed.startsWith('-') || 
             trimmed.startsWith('•') ||
             trimmed.match(/^\d+\./);
    })
    .map(item => {
      // Remove list markers
      return item
        .replace(/^[\s]*[-•]\s/, '')
        .replace(/^\d+\.\s/, '')
        .trim();
    });
}

/**
 * Prüft ob ein Paragraph ein Highlight ist (enthält ---)
 */
export function isHighlight(paragraph: string): boolean {
  return paragraph.includes('---');
}

/**
 * Entfernt Highlight-Marker aus Text
 */
export function removeHighlightMarkers(text: string): string {
  return text.replace(/---/g, '').trim();
}