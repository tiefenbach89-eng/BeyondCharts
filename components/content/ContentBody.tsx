'use client';

import React from "react";
import ReactMarkdown from "react-markdown";

type Mode = "full" | "preview";

interface ContentBodyProps {
  content: string;
  mode?: Mode;
  previewChars?: number;
  className?: string;
}

/**
 * Hilfsfunktion zur Berechnung der Lesezeit (Words per Minute: 200)
 */
export function calculateReadingTime(text: string): number {
  if (!text) return 0;
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

/**
 * Hilfsfunktion zum Kürzen des Textes für die Vorschau-Ansicht
 */
function makePreviewText(input: string, maxChars: number): string {
  const raw = (input || "").trim();
  if (!raw) return "";
  if (raw.length <= maxChars) return raw;

  // Schneidet sauber an der letzten Wortgrenze vor dem Limit ab
  const slice = raw.slice(0, maxChars);
  const lastSpace = slice.lastIndexOf(" ");
  const safe = lastSpace > 80 ? slice.slice(0, lastSpace) : slice;

  return safe.trimEnd() + "…";
}

export function ContentBody({
  content,
  mode = "full",
  previewChars = 400,
  className = "",
}: ContentBodyProps) {
  
  // Falls Content fehlt, geben wir nichts aus
  if (!content) return null;

  // Falls Vorschaumodus aktiv ist, kürzen wir den Text vorher
  const displayText = mode === "preview" 
    ? makePreviewText(content, previewChars) 
    : content;

  return (
    <div className={`markdown-root ${className}`}>
      {/* ReactMarkdown wandelt Markdown-Syntax (##, -, ---) 
          in semantische HTML-Tags (h2, li, hr) um. 
          Das Styling erfolgt über die 'prose' Klassen in der jeweiligen View.
      */}
      <ReactMarkdown>
        {displayText}
      </ReactMarkdown>
    </div>
  );
}