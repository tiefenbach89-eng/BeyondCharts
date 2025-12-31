import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { 
  Search, 
  TrendingUp, 
  Building2,
  Briefcase,
  Globe,
  DollarSign,
  ArrowRight,
  Filter
} from "lucide-react";

const assets = [
  { type: "Aktie", name: "Microsoft", ticker: "MSFT", sector: "Technology", color: "from-blue-600 to-cyan-600", icon: Building2 },
  { type: "Aktie", name: "Apple", ticker: "AAPL", sector: "Technology", color: "from-slate-700 to-slate-900", icon: Building2 },
  { type: "Aktie", name: "NVIDIA", ticker: "NVDA", sector: "Semiconductors", color: "from-emerald-600 to-teal-600", icon: Building2 },
  { type: "ETF", name: "iShares MSCI World", ticker: "EUNL", sector: "Global Equity", color: "from-violet-600 to-purple-600", icon: Globe },
  { type: "Index", name: "DAX", ticker: "DAX", sector: "German Equity", color: "from-amber-600 to-orange-600", icon: TrendingUp },
  { type: "FX", name: "EUR/USD", ticker: "EURUSD", sector: "Currency", color: "from-blue-600 to-indigo-600", icon: DollarSign },
  { type: "Aktie", name: "Tesla", ticker: "TSLA", sector: "Automotive", color: "from-red-600 to-rose-600", icon: Building2 },
  { type: "Aktie", name: "Amazon", ticker: "AMZN", sector: "E-Commerce", color: "from-orange-600 to-amber-600", icon: Building2 },
  { type: "ETF", name: "SPDR S&P 500", ticker: "SPY", sector: "US Equity", color: "from-blue-600 to-cyan-600", icon: Globe },
];

const categories = [
  { label: "Alle", count: assets.length, color: "slate" },
  { label: "Aktien", count: assets.filter(a => a.type === "Aktie").length, color: "blue" },
  { label: "ETFs", count: assets.filter(a => a.type === "ETF").length, color: "violet" },
  { label: "Indizes", count: assets.filter(a => a.type === "Index").length, color: "amber" },
  { label: "FX", count: assets.filter(a => a.type === "FX").length, color: "emerald" },
];

export default function AssetsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30">
      <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
        
        {/* Header */}
        <header className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center shadow-lg">
              <Briefcase className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
                Asset Universe
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Aktien · ETFs · Indizes · Währungen
              </p>
            </div>
          </div>

          <p className="max-w-3xl text-lg md:text-xl text-slate-600 leading-relaxed">
            Entdecke und analysiere Unternehmen, Fonds und Instrumente aus unserem 
            kuratierten Investment-Universe.
          </p>
        </header>

        {/* Search Bar */}
        <div className="relative max-w-2xl">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Suche nach Ticker, Unternehmen oder Sektor..."
            className="w-full pl-14 pr-6 py-4 bg-white border-2 border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100 transition-all shadow-sm"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
            <Filter className="h-4 w-4" />
            <span>Filter:</span>
          </div>
          {categories.map((cat) => (
            <button
              key={cat.label}
              className="group px-4 py-2 bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-violet-300 rounded-xl transition-all flex items-center gap-2 shadow-sm hover:shadow-md"
            >
              <span className="text-sm font-semibold text-slate-700 group-hover:text-violet-700">
                {cat.label}
              </span>
              <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full group-hover:bg-violet-100 group-hover:text-violet-700">
                {cat.count}
              </span>
            </button>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-3xl font-bold text-slate-900 mb-1">{assets.length}</div>
            <div className="text-sm text-slate-600">Assets Total</div>
          </div>
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-3xl font-bold text-blue-600 mb-1">
              {assets.filter(a => a.type === "Aktie").length}
            </div>
            <div className="text-sm text-slate-600">Aktien</div>
          </div>
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-3xl font-bold text-violet-600 mb-1">
              {assets.filter(a => a.type === "ETF").length}
            </div>
            <div className="text-sm text-slate-600">ETFs</div>
          </div>
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-3xl font-bold text-emerald-600 mb-1">
              {assets.filter(a => a.type === "Index" || a.type === "FX").length}
            </div>
            <div className="text-sm text-slate-600">Andere</div>
          </div>
        </div>

        {/* Assets Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Alle Assets</h2>
            <span className="text-sm text-slate-500">{assets.length} Ergebnisse</span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {assets.map((asset) => {
              const Icon = asset.icon;
              return (
                <Link key={asset.ticker} href={`/assets/${asset.ticker}`}>
                  <Card className="group relative overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    {/* Gradient Accent Bar */}
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${asset.color}`} />
                    
                    <div className="p-6">
                      {/* Header Row */}
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${asset.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                          <Icon className="h-7 w-7 text-white" />
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge className="bg-slate-100 text-slate-700 text-[10px] px-2 py-1 border-none">
                            {asset.type}
                          </Badge>
                          <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-violet-600 group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="space-y-3">
                        {/* Ticker */}
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-slate-900">
                            {asset.ticker}
                          </span>
                        </div>

                        {/* Name */}
                        <h3 className="text-base font-semibold text-slate-900 line-clamp-1">
                          {asset.name}
                        </h3>

                        {/* Sector */}
                        <div className="flex items-center gap-2 text-xs text-slate-600">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                          <span>{asset.sector}</span>
                        </div>
                      </div>

                      {/* Hover Action */}
                      <div className="mt-4 pt-4 border-t border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex items-center gap-2 text-sm font-semibold text-violet-600">
                          <Search className="h-4 w-4" />
                          <span>Details ansehen</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center mb-4 shadow-lg">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Kuratierte Auswahl
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Alle Assets wurden von unserem Research-Team sorgfältig ausgewählt und analysiert.
            </p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-violet-50 to-purple-50 border-violet-200 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-violet-600 flex items-center justify-center mb-4 shadow-lg">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Live-Daten
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Echtzeit-Kurse und aktuelle Fundamentaldaten für fundierte Entscheidungen.
            </p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center mb-4 shadow-lg">
              <Briefcase className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Deep Dives
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Detaillierte Analysen zu Geschäftsmodellen, Wettbewerb und langfristigen Trends.
            </p>
          </Card>
        </div>

      </div>
    </div>
  );
}