// app/news/[slug]/page.tsx

import { getBySlug } from "@/lib/content.server";
import { notFound } from "next/navigation";
<<<<<<< HEAD
import { NewsView } from "./NewsView";
import type { Metadata } from "next";
import type { NewsItem } from "@/types/news";
=======
import { NewsView } from "./NewsView"; // ← WICHTIG: NewsView, nicht AnalyseView!
import type { Metadata } from "next";
>>>>>>> 1ad3d42fee7245012111a3a2033405f598854555

// Type-safe params
interface PageProps {
  params: {
    slug: string;
  };
}

/**
<<<<<<< HEAD
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
=======
 * Generate Metadata for SEO
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const item = await getBySlug("news", params.slug);

  if (!item) {
>>>>>>> 1ad3d42fee7245012111a3a2033405f598854555
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

<<<<<<< HEAD
  // Not found oder falscher Content-Typ
  if (!item || !isNewsItem(item)) {
    notFound();
  }

  // Nur veröffentlichte News anzeigen
=======
  // 404 if not found
  if (!item) {
    notFound();
  }

  // Only show published content (unless in preview mode)
>>>>>>> 1ad3d42fee7245012111a3a2033405f598854555
  if (item.status !== "published") {
    notFound();
  }

<<<<<<< HEAD
  return <NewsView item={item} />;
=======
  return <NewsView item={item} />; {/* ← WICHTIG: NewsView! */}
>>>>>>> 1ad3d42fee7245012111a3a2033405f598854555
}

/**
 * Optional: Generate Static Params for Static Generation
<<<<<<< HEAD
=======
 * Uncomment if you want to pre-generate all news pages
>>>>>>> 1ad3d42fee7245012111a3a2033405f598854555
 */
/*
export async function generateStaticParams() {
  const { listContent } = await import("@/lib/content.server");
  const items = await listContent("news");
<<<<<<< HEAD

=======
  
>>>>>>> 1ad3d42fee7245012111a3a2033405f598854555
  return items.map((item) => ({
    slug: item.slug,
  }));
}
<<<<<<< HEAD
*/
=======
*/
>>>>>>> 1ad3d42fee7245012111a3a2033405f598854555
