/**
 * Input validation and sanitization utilities
 * Protects against XSS, SQL injection, and other attacks
 */

/**
 * Sanitize HTML content to prevent XSS attacks
 * This is a basic sanitizer - for production, consider using DOMPurify
 */
export function sanitizeHtml(html: string): string {
  if (!html) return "";

  // Remove script tags
  let sanitized = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");

  // Remove event handlers (onclick, onerror, etc.)
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, "");
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*[^\s>]*/gi, "");

  // Remove javascript: protocol
  sanitized = sanitized.replace(/javascript:/gi, "");

  // Remove data: protocol (can be used for XSS)
  sanitized = sanitized.replace(/data:text\/html/gi, "");

  return sanitized;
}

/**
 * Sanitize plain text input
 */
export function sanitizeText(text: string): string {
  if (!text) return "";

  return text
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

/**
 * Validate and sanitize URL
 */
export function sanitizeUrl(url: string): string | null {
  if (!url) return null;

  try {
    const parsed = new URL(url);

    // Only allow http and https protocols
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return null;
    }

    return parsed.toString();
  } catch {
    return null;
  }
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  if (!email) return false;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

/**
 * Validate ticker symbol (alphanumeric, 1-10 chars)
 */
export function isValidTicker(ticker: string): boolean {
  if (!ticker) return false;

  const tickerRegex = /^[A-Z0-9]{1,10}$/;
  return tickerRegex.test(ticker);
}

/**
 * Sanitize content for storage
 * Use this before saving user-generated content to database
 */
export function sanitizeContent(content: {
  title?: string;
  summary?: string;
  content?: string;
  ticker?: string;
  source?: string;
  sourceUrl?: string;
  tags?: string[];
  imageUrl?: string;
  snapshot?: any;
  analysis?: any;
  [key: string]: any; // Allow additional properties
}): typeof content {
  const sanitized = { ...content };

  if (sanitized.title) {
    sanitized.title = sanitizeText(sanitized.title).substring(0, 200);
  }

  if (sanitized.summary) {
    sanitized.summary = sanitizeText(sanitized.summary).substring(0, 500);
  }

  if (sanitized.content) {
    sanitized.content = sanitizeHtml(sanitized.content);
  }

  if (sanitized.ticker) {
    sanitized.ticker = sanitized.ticker.toUpperCase().replace(/[^A-Z0-9]/g, "").substring(0, 10);
  }

  if (sanitized.source) {
    sanitized.source = sanitizeText(sanitized.source).substring(0, 200);
  }

  if (sanitized.sourceUrl) {
    const cleanUrl = sanitizeUrl(sanitized.sourceUrl);
    sanitized.sourceUrl = cleanUrl || "";
  }

  if (sanitized.imageUrl) {
    const cleanUrl = sanitizeUrl(sanitized.imageUrl);
    sanitized.imageUrl = cleanUrl || "";
  }

  if (sanitized.tags && Array.isArray(sanitized.tags)) {
    sanitized.tags = sanitized.tags
      .map(tag => sanitizeText(tag).substring(0, 50))
      .filter(tag => tag.length > 0)
      .slice(0, 10);
  }

  return sanitized;
}

/**
 * Rate limiting helper
 * Simple in-memory rate limiter (for production, use Redis)
 */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(
  identifier: string,
  maxRequests: number = 10,
  windowMs: number = 60000 // 1 minute
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  if (!record || now > record.resetTime) {
    // New window
    const resetTime = now + windowMs;
    rateLimitMap.set(identifier, { count: 1, resetTime });
    return { allowed: true, remaining: maxRequests - 1, resetTime };
  }

  if (record.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetTime: record.resetTime };
  }

  record.count++;
  return { allowed: true, remaining: maxRequests - record.count, resetTime: record.resetTime };
}

// Clean up old rate limit records every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitMap.entries()) {
      if (now > record.resetTime) {
        rateLimitMap.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}
