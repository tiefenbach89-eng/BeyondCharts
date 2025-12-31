// app/news/[slug]/page.tsx

import { getBySlug } from "@/lib/content.server";
import { notFound } from "next/navigation";
import { NewsView } from "./NewsView"; // ← WICHTIG: NewsView, nicht AnalyseView!
import type { Metadata } from "next";

// Type-safe params
interface PageProps {
  params: {
    slug: string;
  };
}

/**
 * Generate Metadata for SEO
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const item = await getBySlug("news", params.slug);

  if (!item) {
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

  // 404 if not found
  if (!item) {
    notFound();
  }

  // Only show published content (unless in preview mode)
  if (item.status !== "published") {
    notFound();
  }

  return <NewsView item={item} />; {/* ← WICHTIG: NewsView! */}
}

/**
 * Optional: Generate Static Params for Static Generation
 * Uncomment if you want to pre-generate all news pages
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