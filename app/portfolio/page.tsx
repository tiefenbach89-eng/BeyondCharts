import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  PieChart,
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  Users,
  ArrowRight,
  Plus,
  Star,
  ExternalLink,
  Calendar,
  Target,
  Award,
} from "lucide-react";

export const metadata = {
  title: "Portfolio | Beyond Charts",
  description: "Track your investments, follow the house portfolio, and discover top community performers.",
};

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-slate-50">

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 border-b border-slate-200">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.05),transparent_50%)]" />

        <div className="relative max-w-7xl mx-auto px-4 py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center shadow-xl">
                  <PieChart className="w-7 h-7 text-white" />
                </div>
                <h1 className="text-5xl font-bold tracking-tight text-slate-950">
                  Portfolios
                </h1>
              </div>
              <p className="text-lg text-slate-600 max-w-2xl">
                Track your investments, follow our transparent house portfolio, and learn from top community performers.
              </p>
            </div>

            {/* Create Portfolio Button */}
            <Button className="hidden md:flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create Portfolio
            </Button>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 p-2 bg-white/60 backdrop-blur-sm rounded-2xl border border-slate-200 w-fit">
            <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold text-sm shadow-lg">
              House Portfolio
            </button>
            <button className="px-6 py-3 rounded-xl text-slate-600 hover:bg-white/80 font-semibold text-sm transition-all">
              My Portfolios
            </button>
            <button className="px-6 py-3 rounded-xl text-slate-600 hover:bg-white/80 font-semibold text-sm transition-all">
              Community
            </button>
          </div>
        </div>
      </section>

      {/* House Portfolio Content */}
      <section className="max-w-7xl mx-auto px-4 py-12">

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {/* Total Value */}
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-white border-blue-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Total Value</span>
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-1">€ 125,430</div>
            <div className="text-sm text-slate-600">Invested: € 102,000</div>
          </Card>

          {/* Total Return */}
          <Card className="p-6 bg-gradient-to-br from-emerald-50 to-white border-emerald-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
              </div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Total Return</span>
            </div>
            <div className="text-3xl font-bold text-emerald-600 mb-1">+22.97%</div>
            <div className="text-sm text-slate-600">+€ 23,430 Profit</div>
          </Card>

          {/* Holdings */}
          <Card className="p-6 bg-gradient-to-br from-violet-50 to-white border-violet-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-violet-600" />
              </div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Holdings</span>
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-1">18</div>
            <div className="text-sm text-slate-600">8 Stocks · 6 ETFs · 4 Crypto</div>
          </Card>

          {/* Best Performer */}
          <Card className="p-6 bg-gradient-to-br from-amber-50 to-white border-amber-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                <Award className="w-6 h-6 text-amber-600" />
              </div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Best Performer</span>
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-1">BTC</div>
            <div className="text-sm text-emerald-600 font-semibold">+45.8% Return</div>
          </Card>
        </div>

        {/* Performance Chart Placeholder */}
        <Card className="p-8 mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Portfolio Performance</h2>
          <div className="h-80 bg-gradient-to-br from-slate-50 to-white rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-sm font-semibold text-slate-500">
                Performance Chart Coming Soon
              </p>
              <p className="text-xs text-slate-400 mt-2">
                Interactive chart with daily/weekly/monthly/all-time views
              </p>
            </div>
          </div>
        </Card>

        {/* Holdings Table */}
        <Card className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">All Holdings</h2>
            <div className="flex gap-2">
              <button className="px-4 py-2 rounded-xl bg-blue-50 text-blue-600 text-sm font-semibold hover:bg-blue-100 transition-colors">
                All
              </button>
              <button className="px-4 py-2 rounded-xl text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors">
                Stocks
              </button>
              <button className="px-4 py-2 rounded-xl text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors">
                ETFs
              </button>
              <button className="px-4 py-2 rounded-xl text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors">
                Crypto
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-4 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Asset</th>
                  <th className="text-left py-4 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Type</th>
                  <th className="text-right py-4 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Quantity</th>
                  <th className="text-right py-4 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Entry Price</th>
                  <th className="text-right py-4 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Current Price</th>
                  <th className="text-right py-4 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Value</th>
                  <th className="text-right py-4 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">P&L</th>
                  <th className="text-right py-4 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Return</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { ticker: "AAPL", name: "Apple Inc.", type: "Stock", qty: 85, entry: 145.20, current: 186.55, value: 15857, pnl: 3514, return: 28.5 },
                  { ticker: "MSFT", name: "Microsoft Corp.", type: "Stock", qty: 42, entry: 310.50, current: 407.35, value: 17109, pnl: 4068, return: 31.2 },
                  { ticker: "VOO", name: "Vanguard S&P 500 ETF", type: "ETF", qty: 35, entry: 380.20, current: 449.85, value: 15745, pnl: 2437, return: 18.3 },
                  { ticker: "BTC", name: "Bitcoin", type: "Crypto", qty: 0.28, entry: 31250.00, current: 45580.00, value: 12762, pnl: 4012, return: 45.8 },
                  { ticker: "GOOGL", name: "Alphabet Inc.", type: "Stock", qty: 68, entry: 125.80, current: 147.25, value: 10013, pnl: 1459, return: 17.1 },
                  { ticker: "NVDA", name: "NVIDIA Corporation", type: "Stock", qty: 54, entry: 115.30, current: 132.20, value: 7139, pnl: 913, return: 14.7 },
                  { ticker: "VTI", name: "Vanguard Total Stock Market ETF", type: "ETF", qty: 28, entry: 220.15, current: 265.80, value: 7442, pnl: 1278, return: 20.7 },
                  { ticker: "TSLA", name: "Tesla Inc.", type: "Stock", qty: 24, entry: 245.00, current: 238.50, value: 5724, pnl: -156, return: -2.7 },
                  { ticker: "ETH", name: "Ethereum", type: "Crypto", qty: 3.2, current: 2580.00, entry: 2100.00, value: 8256, pnl: 1536, return: 22.9 },
                  { ticker: "AMZN", name: "Amazon.com Inc.", type: "Stock", qty: 38, entry: 138.20, current: 175.80, value: 6680, pnl: 1429, return: 27.2 },
                ].map((holding, i) => (
                  <tr key={i} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-bold text-slate-900">{holding.ticker}</div>
                        <div className="text-xs text-slate-500">{holding.name}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-md text-xs font-semibold ${
                        holding.type === 'Stock' ? 'bg-blue-100 text-blue-700' :
                        holding.type === 'ETF' ? 'bg-violet-100 text-violet-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {holding.type}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right font-semibold text-slate-900">{holding.qty}</td>
                    <td className="py-4 px-4 text-right text-slate-600">€ {holding.entry.toFixed(2)}</td>
                    <td className="py-4 px-4 text-right font-semibold text-slate-900">€ {holding.current.toFixed(2)}</td>
                    <td className="py-4 px-4 text-right font-bold text-slate-900">€ {holding.value.toLocaleString()}</td>
                    <td className={`py-4 px-4 text-right font-semibold ${holding.pnl >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {holding.pnl >= 0 ? '+' : ''}€ {holding.pnl.toLocaleString()}
                    </td>
                    <td className={`py-4 px-4 text-right font-bold ${holding.return >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      <div className="flex items-center justify-end gap-1">
                        {holding.return >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        <span>{holding.return >= 0 ? '+' : ''}{holding.return}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-slate-50 rounded-xl">
                <div className="text-xs font-semibold text-slate-500 mb-2">Portfolio Created</div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span className="font-semibold text-slate-900">March 15, 2023</span>
                </div>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl">
                <div className="text-xs font-semibold text-slate-500 mb-2">Last Updated</div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span className="font-semibold text-slate-900">Today, 14:23</span>
                </div>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl">
                <div className="text-xs font-semibold text-slate-500 mb-2">Followers</div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-slate-400" />
                  <span className="font-semibold text-slate-900">3,247 Followers</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Transparency Message */}
        <Card className="p-8 mt-8 bg-gradient-to-br from-blue-50 to-violet-50 border-blue-100">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">100% Transparenz</h3>
              <p className="text-slate-600 leading-relaxed mb-4">
                Dieses Portfolio ist zu 100% transparent und zeigt alle unsere echten Positionen, Entry-Preise und Performance.
                Wir glauben an vollständige Offenheit – keine versteckten Trades, keine Cherry-Picking von Gewinnern.
              </p>
              <p className="text-sm text-slate-500 italic">
                Hinweis: Dies ist keine Anlageberatung. Investitionen bergen Risiken. Bitte recherchiere selbst und konsultiere einen Finanzberater.
              </p>
            </div>
          </div>
        </Card>

      </section>
    </div>
  );
}
