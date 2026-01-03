// app/news/[slug]/page.tsx

import { getBySlug } from "@/lib/content.server";
import { notFound } from "next/navigation";
import { NewsView } from "./NewsView";
import type { Metadata } from "next";
import type { NewsItem } from "@/types/news";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

/* -------------------------------------------------------------------------- */
/* Type Guard                                                                 */
/* -------------------------------------------------------------------------- */

function isNewsItem(item: unknown): item is NewsItem {
  return (
    typeof item === "object" &&
    item !== null &&
    "source" in item &&
    "sourceType" in item &&
    "impact" in item
  );
}

/* -------------------------------------------------------------------------- */
/* Metadata                                                                   */
/* -------------------------------------------------------------------------- */

export async function generateMetadata(
  { params }: PageProps
): Promise<Metadata> {
  const { slug } = await params;

  const item = await getBySlug("news", slug);

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

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

export default async function NewsDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const item = await getBySlug("news", slug);

  if (!item || !isNewsItem(item)) {
    notFound();
  }

  if (item.status !== "published") {
    notFound();
  }

  return <NewsView item={item} />;
}

/* -------------------------------------------------------------------------- */
/* Optional Static Params (intentionally disabled)                             */
/* -------------------------------------------------------------------------- */
/*
export async function generateStaticParams() {
  const { listContent } = await import("@/lib/content.server");
  const items = await listContent("news");

  return items.map((item) => ({
    slug: item.slug,
  }));
}
*/
