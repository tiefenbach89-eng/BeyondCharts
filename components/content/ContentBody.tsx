'use client';

import React from "react";
import ReactMarkdown from "react-markdown";
import { isHtmlContent } from "@/lib/contentParser";

type Mode = "full" | "preview";

interface ContentBodyProps {
  content: string;
  mode?: Mode;
  previewChars?: number;
  className?: string;
}

/**
 * Hilfsfunktion zum Kürzen des Textes für die Vorschau-Ansicht
 * Works with both HTML and plain text
 */
function makePreviewText(input: string, maxChars: number): string {
  const raw = (input || "").trim();
  if (!raw) return "";
  
  // Strip HTML tags for preview
  const textOnly = raw.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  
  if (textOnly.length <= maxChars) return textOnly;

  // Schneidet sauber an der letzten Wortgrenze vor dem Limit ab
  const slice = textOnly.slice(0, maxChars);
  const lastSpace = slice.lastIndexOf(" ");
  const safe = lastSpace > 80 ? slice.slice(0, lastSpace) : slice;

  return safe.trimEnd() + "…";
}

/**
 * ContentBody - Smart component that handles both HTML and Markdown
 * 
 * - New articles (Tiptap): HTML → renders with dangerouslySetInnerHTML
 * - Old articles: Markdown → renders with ReactMarkdown
 * - Auto-detects format based on content
 */
export function ContentBody({
  content,
  mode = "full",
  previewChars = 400,
  className = "",
}: ContentBodyProps) {
  
  // Falls Content fehlt, geben wir nichts aus
  if (!content) return null;

  const isHtml = isHtmlContent(content);

  // Preview mode: strip to text only
  if (mode === "preview") {
    const previewText = makePreviewText(content, previewChars);
    return (
      <div className={`text-slate-600 leading-relaxed ${className}`}>
        {previewText}
      </div>
    );
  }

  // Full mode: render based on format
  if (isHtml) {
    // Modern HTML content (from Tiptap)
    return (
      <div 
        className={`prose prose-slate max-w-none ${className}`}
        dangerouslySetInnerHTML={{ __html: content }} 
      />
    );
  } else {
    // Legacy Markdown content
    return (
      <div className={`markdown-root prose prose-slate max-w-none ${className}`}>
        <ReactMarkdown>
          {content}
        </ReactMarkdown>
      </div>
    );
  }
}