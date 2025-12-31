import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import Link from "next/link";

export default function AssetDetail({ params }: { params: { ticker: string } }) {
  const t = params.ticker;

  return (
    <div className="ff-container py-6 md:py-10">
      <div className="flex flex-wrap items-center gap-2">
        <Badge>Asset</Badge>
        <Badge tone="neutral">{t}</Badge>
      </div>

      <h1 className="mt-3 text-2xl font-semibold md:text-4xl">{t}</h1>
      <p className="mt-2 text-sm ff-muted">
        MVP Platzhalter. Phase 2: Kennzahlen, Chart, News-Cluster, Makro-Treiber, Alerts.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-12">
        <div className="md:col-span-8 grid gap-4">
          <Card className="p-4 md:p-5">
            <div className="text-sm font-semibold">News zu {t}</div>
            <p className="mt-2 text-sm ff-muted">Im MVP verlinken wir auf den News-Feed und nutzen Tags.</p>
            <Link className="mt-3 inline-flex text-sm font-medium hover:underline" href="/news">
              Zum News-Feed
            </Link>
          </Card>
          <Card className="p-4 md:p-5">
            <div className="text-sm font-semibold">Key Facts</div>
            <div className="mt-2 grid grid-cols-2 gap-3 md:grid-cols-4">
              {["Price", "1D", "YTD", "Vol"].map((k) => (
                <div key={k} className="rounded-2xl border border-[rgb(var(--border))] bg-white p-3">
                  <div className="text-xs ff-muted">{k}</div>
                  <div className="mt-1 text-sm font-semibold">—</div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="md:col-span-4">
          <Card className="p-4 md:p-5">
            <div className="text-sm font-semibold">Watchlist</div>
            <p className="mt-2 text-sm ff-muted">Speichere Assets und bekomme später Alerts (Premium).</p>
            <Link className="mt-3 inline-flex text-sm font-medium hover:underline" href="/watchlist">
              Watchlist öffnen
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
