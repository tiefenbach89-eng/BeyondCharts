// app/analysen/[slug]/page.tsx

import { getBySlug } from "@/lib/content.server";
import { notFound } from "next/navigation";
import { AnalyseView } from "./AnalyseView";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

export default async function AnalyseDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const item = await getBySlug("analyses", slug);

  if (!item) {
    notFound();
  }

  return <AnalyseView item={item} />;
}
