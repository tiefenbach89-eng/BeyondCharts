import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Search } from "lucide-react";

const assets = [
  { type: "Aktie", name: "Microsoft", ticker: "MSFT", color: "blue" },
  { type: "Aktie", name: "Apple", ticker: "AAPL", color: "slate" },
  { type: "Aktie", name: "NVIDIA", ticker: "NVDA", color: "emerald" },
  { type: "ETF", name: "iShares MSCI World", ticker: "EUNL", color: "blue" },
  { type: "Index", name: "DAX", ticker: "DAX", color: "slate" },
  { type: "FX", name: "EURUSD", ticker: "EURUSD", color: "blue" },
];

export default function AssetsPage() {
  return (
    <div className="ff-container py-8 md:py-16 px-4 space-y-10">
      <header className="space-y-4">
        <Badge tone="neutral" className="uppercase tracking-widest text-[10px]">Asset Verzeichnis</Badge>
        <h1 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight">Assets</h1>
        <p className="max-w-2xl text-slate-500 text-base md:text-lg">
          Alle Unternehmen und Instrumente im Überblick.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {assets.map((a) => (
          <Link key={a.ticker} href={`/assets/${a.ticker}`} className="group">
            <Card className="p-6 md:p-8 flex items-center justify-between transition-all hover:border-blue-200 hover:shadow-lg hover:shadow-slate-100">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-slate-50 flex items-center justify-center font-bold text-slate-900 border border-slate-100 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  {a.ticker.substring(0, 2)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">{a.type}</span>
                    <Badge variant="outline" className="text-[9px] py-0 px-1.5 h-4 border-slate-200">{a.ticker}</Badge>
                  </div>
                  <div className="text-lg font-bold text-slate-900 mt-0.5">{a.name}</div>
                </div>
              </div>
              <Search className="h-4 w-4 text-slate-200 group-hover:text-blue-500 transition-colors" />
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}