import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  Zap,
  TrendingUp,
  TrendingDown,
  Target,
  Award,
  Clock,
  BarChart3,
  CheckCircle2,
  XCircle,
  MinusCircle,
  Calendar,
  DollarSign,
} from "lucide-react";

export const metadata = {
  title: "Trading Signals | Beyond Charts",
  description: "Real-time trading signals with transparent performance tracking. 73.5% win rate, +12.8% average return.",
};

export default function SignalsPage() {
  return (
    <div className="min-h-screen bg-slate-50">

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-amber-50/30 to-slate-50 border-b border-slate-200">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,146,60,0.05),transparent_50%)]" />

        <div className="relative max-w-7xl mx-auto px-4 py-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center shadow-xl">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-5xl font-bold tracking-tight text-slate-950">
              Trading Signals
            </h1>
          </div>
          <p className="text-lg text-slate-600 max-w-3xl mb-8">
            Unsere manuellen Trading-Signale – kostenlos für alle. Mit vollständiger Performance-Transparenz und Tracking.
          </p>

          {/* Performance Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Win Rate", value: "73.5%", icon: <Award className="w-5 h-5" />, color: "emerald" },
              { label: "Total Signals", value: "147", icon: <Zap className="w-5 h-5" />, color: "blue" },
              { label: "Avg. Return", value: "+12.8%", icon: <TrendingUp className="w-5 h-5" />, color: "violet" },
              { label: "Active Now", value: "8", icon: <Target className="w-5 h-5" />, color: "amber" },
            ].map((stat, i) => (
              <Card key={i} className="p-6 bg-white/80 backdrop-blur-sm">
                <div className={`w-10 h-10 rounded-xl bg-${stat.color}-100 flex items-center justify-center text-${stat.color}-600 mb-3`}>
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</div>
                <div className="text-sm text-slate-600">{stat.label}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 py-12">

        {/* Tab Navigation */}
        <div className="flex gap-2 p-2 bg-white rounded-2xl border border-slate-200 w-fit mb-8">
          <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold text-sm shadow-lg">
            Active Signals
          </button>
          <button className="px-6 py-3 rounded-xl text-slate-600 hover:bg-slate-50 font-semibold text-sm transition-all">
            Performance History
          </button>
          <button className="px-6 py-3 rounded-xl text-slate-600 hover:bg-slate-50 font-semibold text-sm transition-all">
            Statistics
          </button>
        </div>

        {/* Active Signals */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {[
            {
              ticker: "NVDA",
              name: "NVIDIA Corporation",
              signal: "BUY",
              confidence: 8,
              target: 145.50,
              stopLoss: 120.00,
              entry: 132.20,
              current: 134.85,
              reason: "Strong Q4 earnings beat expectations. AI chip demand remains robust with major cloud providers expanding orders. Technical breakout above $130 resistance.",
              daysActive: 3,
              tags: ["Earnings", "AI", "Tech"],
            },
            {
              ticker: "TSLA",
              name: "Tesla Inc.",
              signal: "HOLD",
              confidence: 6,
              target: 245.00,
              stopLoss: 220.00,
              entry: 238.50,
              current: 241.20,
              reason: "Awaiting Q1 production data. Stock in consolidation phase. Maintaining position until clarity on delivery numbers and margin trends.",
              daysActive: 12,
              tags: ["EV", "Tech"],
            },
            {
              ticker: "AAPL",
              name: "Apple Inc.",
              signal: "BUY",
              confidence: 7,
              target: 195.00,
              stopLoss: 180.00,
              entry: 186.50,
              current: 188.30,
              reason: "iPhone 16 pre-orders exceeding expectations. Services revenue growth accelerating. Technical bounce from 50-day MA support.",
              daysActive: 5,
              tags: ["Consumer Tech", "Dividend"],
            },
            {
              ticker: "MSFT",
              name: "Microsoft Corporation",
              signal: "HOLD",
              confidence: 7,
              target: 425.00,
              stopLoss: 395.00,
              entry: 407.35,
              current: 410.50,
              reason: "Azure cloud growth solid. Copilot AI adoption progressing well. Holding through minor consolidation phase before next leg up.",
              daysActive: 8,
              tags: ["Cloud", "AI", "Enterprise"],
            },
            {
              ticker: "AMD",
              name: "Advanced Micro Devices",
              signal: "BUY",
              confidence: 9,
              target: 165.00,
              stopLoss: 135.00,
              entry: 142.80,
              current: 145.20,
              reason: "MI300 AI chip gaining market share. Server CPU momentum strong. Undervalued vs NVDA with similar growth trajectory.",
              daysActive: 2,
              tags: ["AI", "Semiconductors"],
            },
            {
              ticker: "GOOGL",
              name: "Alphabet Inc.",
              signal: "BUY",
              confidence: 8,
              target: 160.00,
              stopLoss: 140.00,
              entry: 147.25,
              current: 149.80,
              reason: "Gemini AI rollout progressing. Search ad revenue stabilizing. Cloud business showing strong growth. Attractive valuation.",
              daysActive: 6,
              tags: ["AI", "Cloud", "Advertising"],
            },
            {
              ticker: "BTC",
              name: "Bitcoin",
              signal: "HOLD",
              confidence: 6,
              target: 50000,
              stopLoss: 40000,
              entry: 45580,
              current: 46200,
              reason: "Consolidating after recent rally. ETF inflows remain positive. Waiting for breakout confirmation above $48k resistance.",
              daysActive: 15,
              tags: ["Crypto", "Store of Value"],
            },
            {
              ticker: "META",
              name: "Meta Platforms",
              signal: "BUY",
              confidence: 7,
              target: 520.00,
              stopLoss: 465.00,
              entry: 485.00,
              current: 492.30,
              reason: "Reality Labs losses narrowing. Core ad business strong. AI-driven engagement improvements driving revenue growth.",
              daysActive: 4,
              tags: ["Social Media", "AI", "VR"],
            },
          ].map((signal, i) => (
            <Card key={i} className="p-6 hover:shadow-xl transition-all">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl font-bold text-slate-900">{signal.ticker}</span>
                    <Badge
                      tone={signal.signal === 'BUY' ? 'success' : signal.signal === 'SELL' ? 'error' : 'warning'}
                      className="font-bold"
                    >
                      {signal.signal}
                    </Badge>
                  </div>
                  <div className="text-sm text-slate-600 mb-3">{signal.name}</div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {signal.tags.map((tag, j) => (
                      <span key={j} className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Confidence */}
                <div className="text-right flex-shrink-0 ml-4">
                  <div className="text-xs text-slate-500 mb-1">Confidence</div>
                  <div className="text-2xl font-bold text-slate-900">{signal.confidence}/10</div>
                </div>
              </div>

              {/* Price Levels */}
              <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-slate-50 rounded-xl">
                <div>
                  <div className="text-xs text-slate-500 mb-1">Entry</div>
                  <div className="text-sm font-bold text-slate-900">${signal.entry.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">Current</div>
                  <div className={`text-sm font-bold ${signal.current > signal.entry ? 'text-emerald-600' : 'text-red-600'}`}>
                    ${signal.current.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">Target</div>
                  <div className="text-sm font-bold text-emerald-600">${signal.target.toLocaleString()}</div>
                </div>
              </div>

              {/* Profit Calculator */}
              <div className="mb-4 p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-600">Current P&L</span>
                  <span className={`text-lg font-bold ${signal.current > signal.entry ? 'text-emerald-600' : 'text-red-600'}`}>
                    {signal.current > signal.entry ? '+' : ''}{(((signal.current - signal.entry) / signal.entry) * 100).toFixed(2)}%
                  </span>
                </div>
              </div>

              {/* Reason */}
              <p className="text-sm text-slate-600 mb-4 leading-relaxed">{signal.reason}</p>

              {/* Stop Loss */}
              <div className="mb-4 p-3 bg-red-50 rounded-xl border border-red-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-red-600">Stop Loss</span>
                  <span className="text-sm font-bold text-red-700">${signal.stopLoss.toLocaleString()}</span>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between text-xs text-slate-500 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{signal.daysActive} days active</span>
                </div>
                <span>Updated today</span>
              </div>
            </Card>
          ))}
        </div>

        {/* Performance History Section */}
        <Card className="p-8 mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Recent Closed Signals</h2>

          <div className="space-y-4">
            {[
              { ticker: "AMZN", signal: "BUY", entry: 138.20, exit: 175.80, return: 27.2, outcome: "win", daysHeld: 42, closedDate: "2026-01-15" },
              { ticker: "NFLX", signal: "BUY", entry: 425.00, exit: 510.30, return: 20.1, outcome: "win", daysHeld: 28, closedDate: "2026-01-12" },
              { ticker: "SHOP", signal: "SELL", entry: 78.50, exit: 72.20, return: 8.0, outcome: "win", daysHeld: 18, closedDate: "2026-01-08" },
              { ticker: "UBER", signal: "BUY", entry: 62.30, exit: 59.80, return: -4.0, outcome: "loss", daysHeld: 15, closedDate: "2026-01-05" },
              { ticker: "DIS", signal: "BUY", entry: 95.20, exit: 108.50, return: 14.0, outcome: "win", daysHeld: 35, closedDate: "2025-12-28" },
            ].map((signal, i) => (
              <div key={i} className="flex items-center gap-6 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                {/* Icon */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  signal.outcome === 'win' ? 'bg-emerald-100' :
                  signal.outcome === 'loss' ? 'bg-red-100' :
                  'bg-slate-200'
                }`}>
                  {signal.outcome === 'win' ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> :
                   signal.outcome === 'loss' ? <XCircle className="w-5 h-5 text-red-600" /> :
                   <MinusCircle className="w-5 h-5 text-slate-500" />}
                </div>

                {/* Ticker & Signal */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-slate-900">{signal.ticker}</span>
                    <Badge tone={signal.signal === 'BUY' ? 'success' : 'error'} size="sm">
                      {signal.signal}
                    </Badge>
                  </div>
                  <div className="text-xs text-slate-500">
                    Closed: {signal.closedDate} · Held {signal.daysHeld} days
                  </div>
                </div>

                {/* Prices */}
                <div className="text-right">
                  <div className="text-sm text-slate-600">
                    ${signal.entry.toFixed(2)} → ${signal.exit.toFixed(2)}
                  </div>
                </div>

                {/* Return */}
                <div className={`text-right min-w-[100px] text-lg font-bold ${
                  signal.outcome === 'win' ? 'text-emerald-600' : 'text-red-600'
                }`}>
                  {signal.return >= 0 ? '+' : ''}{signal.return.toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Performance Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Win Rate Chart Placeholder */}
          <Card className="p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Win Rate by Month</h3>
            <div className="h-48 bg-gradient-to-br from-slate-50 to-white rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-500">Chart Coming Soon</p>
              </div>
            </div>
          </Card>

          {/* Average Return */}
          <Card className="p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Avg. Return by Asset</h3>
            <div className="h-48 bg-gradient-to-br from-slate-50 to-white rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center">
              <div className="text-center">
                <TrendingUp className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-500">Chart Coming Soon</p>
              </div>
            </div>
          </Card>

          {/* Cumulative Returns */}
          <Card className="p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Cumulative Returns</h3>
            <div className="h-48 bg-gradient-to-br from-slate-50 to-white rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center">
              <div className="text-center">
                <DollarSign className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-500">Chart Coming Soon</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Disclaimer */}
        <Card className="p-8 mt-8 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-100">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
              <Zap className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Wichtiger Hinweis</h3>
              <p className="text-slate-600 leading-relaxed mb-4">
                Diese Trading-Signale sind unsere persönlichen Einschätzungen und stellen keine Anlageberatung dar.
                Alle Investitionen bergen Risiken. Vergangene Performance ist keine Garantie für zukünftige Ergebnisse.
              </p>
              <p className="text-sm text-slate-500 italic">
                Bitte recherchiere selbst, diversifiziere dein Portfolio und investiere nur Geld, dessen Verlust du verkraften kannst.
                Bei Unsicherheit konsultiere einen zugelassenen Finanzberater.
              </p>
            </div>
          </div>
        </Card>

      </section>
    </div>
  );
}
