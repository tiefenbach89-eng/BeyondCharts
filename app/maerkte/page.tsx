import { Badge } from "@/components/ui/Badge";
import { MarketSnapshot } from "@/components/markets/MarketSnapshot";
import { Card } from "@/components/ui/Card";
import { MarketCalendar } from "@/components/markets/MarketCalendar";
import { Calendar } from "lucide-react";

export default function MarketsPage() {
  return (
    <div className="ff-container py-8 md:py-16 px-4 space-y-12">
      {/* Header */}
      <header className="space-y-4">
        <Badge
          variant="outline"
          className="text-blue-600 border-blue-200 uppercase tracking-widest text-[10px]"
        >
          Live Context
        </Badge>

        <h1 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight">
          Markt-Übersicht
        </h1>

        <p className="max-w-2xl text-slate-500 text-base md:text-lg">
          Die wichtigsten Indizes, Makro-Daten und Unternehmensereignisse auf einen Blick.
        </p>
      </header>

      {/* Content */}
      <div className="space-y-8">
        {/* Market Snapshot */}
        <div className="rounded-[2rem] bg-slate-950 p-1 shadow-2xl overflow-hidden">
          <div className="overflow-x-auto pb-2">
            <div className="min-w-[800px] md:min-w-full">
              <MarketSnapshot />
            </div>
          </div>
        </div>

        {/* Market Calendar */}
        <Card className="p-6 md:p-10 bg-white border border-slate-200 rounded-[2rem] shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-slate-600" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Markt-Kalender
              </h3>
              <p className="text-sm text-slate-500">
                Makro-Events, Zinsentscheide, Konjunkturdaten & Earnings in Echtzeit
              </p>
            </div>
          </div>

          <MarketCalendar />
        </Card>
      </div>
    </div>
  );
}
