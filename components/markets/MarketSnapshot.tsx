import { Card } from "@/components/ui/Card";

const items = [
  { label: "DAX", value: "17.9k", delta: "+0.7%" },
  { label: "S&P 500", value: "5.1k", delta: "+0.4%" },
  { label: "EURUSD", value: "1.10", delta: "-0.2%" },
  { label: "10Y Bund", value: "2.35%", delta: "+3bp" },
];

export function MarketSnapshot() {
  return (
    <Card className="p-4 md:p-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold">Market Snapshot</div>
          <div className="mt-1 text-sm ff-muted">Schnelle Orientierung. Demo-Daten lokal.</div>
        </div>
        <div className="text-xs ff-muted">Realtime: Phase 2</div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        {items.map((i) => (
          <div key={i.label} className="rounded-2xl border border-[rgb(var(--border))] bg-white p-3">
            <div className="text-xs ff-muted">{i.label}</div>
            <div className="mt-1 text-sm font-semibold">{i.value}</div>
            <div className="mt-1 text-xs ff-muted">{i.delta}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}
