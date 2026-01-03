// app/news/[slug]/page.tsx

import { getBySlug } from "@/lib/content.server";
import { notFound } from "next/navigation";
import { NewsView } from "./NewsView";
import type { Metadata } from "next";
import type { NewsItem } from "@/types/news";

// Type-safe params
interface PageProps {
  params: {
    slug: string;
  };
}

/**
 * Type Guard: stellt sicher, dass es wirklich ein NewsItem ist
 */
function isNewsItem(item: unknown): item is NewsItem {
  return (
    typeof item === "object" &&
    item !== null &&
    "source" in item &&
    "sourceType" in item &&
    "impact" in item
  );
}

/**
 * Generate Metadata for SEO
 */
export async function generateMetadata(
  { params }: PageProps
): Promise<Metadata> {
  const item = await getBySlug("news", params.slug);

  if (!item || !isNewsItem(item)) {
    return {
      title: "News nicht gefunden",
    };
  }

  return {
    title: `${item.title} — Beyond Charts News`,
    description: item.summary,
    openGraph: {
      title: item.title,
      description: item.summary,
      images: item.imageUrl ? [item.imageUrl] : [],
      type: "article",
      publishedTime: item.publishedAt,
    },
    twitter: {
      card: "summary_large_image",
      title: item.title,
      description: item.summary,
      images: item.imageUrl ? [item.imageUrl] : [],
    },
  };
}

/**
 * Main Page Component
 */
export default async function NewsDetailPage({ params }: PageProps) {
  const item = await getBySlug("news", params.slug);

  // Not found oder falscher Content-Typ
  if (!item || !isNewsItem(item)) {
    notFound();
  }

  // Nur veröffentlichte News anzeigen
  if (item.status !== "published") {
    notFound();
  }

  return <NewsView item={item} />;
}

/**
 * Optional: Generate Static Params for Static Generation
 */
/*
export async function generateStaticParams() {
  const { listContent } = await import("@/lib/content.server");
  const items = await listContent("news");
  return items.map((item) => ({
    slug: item.slug,
  }));
}
*/
