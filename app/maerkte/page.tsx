import { Badge } from "@/components/ui/Badge";
import { MarketSnapshot } from "@/components/markets/MarketSnapshot";
import { Card } from "@/components/ui/Card";
import { MarketCalendar } from "@/components/markets/MarketCalendar";
import { 
  Calendar, 
  TrendingUp, 
  Activity,
  Globe,
  BarChart3,
  Zap
} from "lucide-react";

export default function MarketsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
        
        {/* Header */}
        <header className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center shadow-lg">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
                Markt-Übersicht
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Live-Daten · Indizes · Events · Kalender
              </p>
            </div>
          </div>

          <p className="max-w-3xl text-lg md:text-xl text-slate-600 leading-relaxed">
            Die wichtigsten Indizes, Makro-Daten und Unternehmensereignisse 
            auf einen Blick – in Echtzeit.
          </p>
        </header>

        {/* Quick Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-blue-600" />
              </div>
              <span className="text-xs font-semibold text-slate-600">Indizes</span>
            </div>
            <div className="text-2xl font-bold text-slate-900">Live</div>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                <Globe className="h-4 w-4 text-emerald-600" />
              </div>
              <span className="text-xs font-semibold text-slate-600">Global</span>
            </div>
            <div className="text-2xl font-bold text-slate-900">24/7</div>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center">
                <BarChart3 className="h-4 w-4 text-violet-600" />
              </div>
              <span className="text-xs font-semibold text-slate-600">Märkte</span>
            </div>
            <div className="text-2xl font-bold text-slate-900">10+</div>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                <Zap className="h-4 w-4 text-amber-600" />
              </div>
              <span className="text-xs font-semibold text-slate-600">Updates</span>
            </div>
            <div className="text-2xl font-bold text-slate-900">Real</div>
          </div>
        </div>

        {/* Market Snapshot */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Live Indizes</h2>
                <p className="text-sm text-slate-500">Echtzeit-Kurse der wichtigsten Märkte</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold text-emerald-700">Live</span>
            </div>
          </div>

          <div className="relative group">
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 rounded-[32px] opacity-20 group-hover:opacity-30 blur-xl transition-all" />
            
            {/* Snapshot Container */}
            <div className="relative rounded-[32px] bg-slate-950 p-1 shadow-2xl overflow-hidden">
              <div className="overflow-x-auto pb-2">
                <div className="min-w-[800px] md:min-w-full">
                  <MarketSnapshot />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Market Calendar */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Markt-Kalender</h2>
              <p className="text-sm text-slate-500">
                Makro-Events, Zinsentscheide, Konjunkturdaten & Earnings
              </p>
            </div>
          </div>

          <Card className="p-8 bg-white border-none shadow-sm rounded-3xl">
            <MarketCalendar />
          </Card>
        </div>

        {/* Info Cards Row */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center mb-4 shadow-lg">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Echtzeit-Kurse
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Verfolge die wichtigsten Indizes weltweit in Echtzeit mit Live-Updates.
            </p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-violet-50 to-purple-50 border-violet-200 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-violet-600 flex items-center justify-center mb-4 shadow-lg">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Event-Kalender
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Verpasse keine wichtigen Makro-Events, Earnings oder Zinsentscheide mehr.
            </p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center mb-4 shadow-lg">
              <Globe className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Globale Märkte
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Von US über Europa bis Asien – alle wichtigen Märkte an einem Ort.
            </p>
          </Card>
        </div>

      </div>
    </div>
  );
}