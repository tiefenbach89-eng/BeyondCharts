import { listContent } from "@/lib/content.server";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import { Card } from "@/components/ui/Card";

export const dynamic = "force-dynamic";

export default async function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const q = (searchParams.q ?? "").toLowerCase().trim();
  const allNews = await listContent("news");
  const allAnalyses = await listContent("analyses");

  const news = allNews.filter((n) =>
    q ? (n.title + n.summary + n.tags.join(" ")).toLowerCase().includes(q) : false
  );
  const analyses = allAnalyses.filter((a) =>
    q ? (a.title + a.summary + a.tags.join(" ")).toLowerCase().includes(q) : false
  );

  return (
    <div className="ff-container py-6 md:py-10">
      <div className="flex items-center gap-2">
        <Badge>Suche</Badge>
        <Badge tone="neutral">{q ? `„${searchParams.q}”` : "—"}</Badge>
      </div>
      <h1 className="mt-3 text-2xl font-semibold md:text-3xl">Ergebnisse</h1>
      <p className="mt-1 text-sm ff-muted">Volltext (MVP): einfacher lokaler Match. Supabase FTS später.</p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Card className="p-4 md:p-5">
          <div className="text-sm font-semibold">News</div>
          <div className="mt-3 grid gap-2">
            {news.slice(0, 10).map((n) => (
              <Link
                key={n.id}
                href={`/news/${n.slug}`}
                className="rounded-xl border border-[rgb(var(--border))] bg-white p-3 hover:bg-[rgb(var(--chip))] transition"
              >
                <div className="text-sm font-medium">{n.title}</div>
                <div className="mt-1 text-xs ff-muted">{n.isPremium ? "Premium" : "Free"} · {n.category}</div>
              </Link>
            ))}
            {news.length === 0 && <div className="text-sm ff-muted">Keine News gefunden.</div>}
          </div>
        </Card>

        <Card className="p-4 md:p-5">
          <div className="text-sm font-semibold">Analysen</div>
          <div className="mt-3 grid gap-2">
            {analyses.slice(0, 10).map((a) => (
              <Link
                key={a.id}
                href={`/analysen/${a.slug}`}
                className="rounded-xl border border-[rgb(var(--border))] bg-white p-3 hover:bg-[rgb(var(--chip))] transition"
              >
                <div className="text-sm font-medium">{a.title}</div>
                <div className="mt-1 text-xs ff-muted">{a.isPremium ? "Premium" : "Free"} · {a.category}</div>
              </Link>
            ))}
            {analyses.length === 0 && <div className="text-sm ff-muted">Keine Analysen gefunden.</div>}
          </div>
        </Card>
      </div>
    </div>
  );
}
