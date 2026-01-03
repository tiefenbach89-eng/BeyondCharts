import { getBySlug } from "@/lib/content.server"; // Importiert als getBySlug
import { notFound } from "next/navigation";
import { AnalyseView } from "./AnalyseView";

export default async function AnalyseDetailPage({ params }: { params: { slug: string } }) {
  // Hier muss jetzt auch getBySlug stehen
  const item = await getBySlug("analyses", params.slug);

  if (!item) {
    notFound();
  }

  return <AnalyseView item={item} />;
}