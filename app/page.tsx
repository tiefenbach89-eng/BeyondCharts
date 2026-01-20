import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  ArrowRight,
  TrendingUp,
  Target,
  Shield,
  LineChart,
  Newspaper,
  BarChart3,
  Users,
  Clock,
  ExternalLink,
  Sparkles,
  Zap,
  BookOpen,
  PieChart,
  TrendingDown,
  DollarSign,
  Award,
} from "lucide-react";
import { getStoredNews } from "@/lib/news-storage";

export const dynamic = "force-dynamic";
export const revalidate = 300; // Revalidate every 5 minutes

export default async function HomePage() {
  // Fetch Finnhub news from Supabase storage (with error handling)
  let finnhubNews: any[] = [];
  try {
    finnhubNews = await getStoredNews(6);
  } catch (error) {
    console.error('[Home Page] Error fetching news:', error);
    finnhubNews = [];
  }

  return (
    <div className="min-h-screen">

      {/* HERO SECTION - New Vision */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 border-b border-slate-200">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.05),transparent_50%)]" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
          <div className="absolute top-40 right-10 w-72 h-72 bg-violet-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-32">
          <div className="text-center max-w-4xl mx-auto">

            {/* Badge */}
            <div className="mb-8 inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-sm font-semibold text-blue-700">
              <Sparkles className="w-4 h-4" />
              Your Gateway to Smart Investing
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-tight text-slate-950 mb-8">
              Start Your
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-violet-600 to-blue-600 bg-clip-text text-transparent">
                Investing Journey
              </span>
            </h1>

            {/* Subheadline */}
            <p className="max-w-3xl mx-auto text-xl md:text-2xl leading-relaxed text-slate-600 mb-12">
              Learn. Track. Follow. Profit.
              <br />
              Wir machen den Einstieg in <span className="font-semibold text-slate-900">Aktien, ETFs und Crypto</span> einfach und transparent.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mb-16">
              <Link
                href="/portfolio"
                className="group inline-flex items-center gap-3 px-8 py-4 bg-slate-950 hover:bg-blue-600 text-white rounded-2xl font-bold text-sm transition-all shadow-xl hover:shadow-2xl hover:scale-105"
              >
                Unser Portfolio ansehen
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/signals"
                className="inline-flex items-center gap-3 px-8 py-4 bg-white hover:bg-slate-50 text-slate-900 rounded-2xl font-bold text-sm border-2 border-slate-200 transition-all hover:border-slate-300"
              >
                <Zap className="w-4 h-4" />
                Trading Signals
              </Link>
              <Link
                href="/learn"
                className="inline-flex items-center gap-3 px-8 py-4 bg-white hover:bg-slate-50 text-slate-900 rounded-2xl font-bold text-sm border-2 border-slate-200 transition-all hover:border-slate-300"
              >
                <BookOpen className="w-4 h-4" />
                Guides & Tutorials
              </Link>
            </div>

            {/* Feature Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
              {[
                { icon: <PieChart size={18} />, text: "Transparentes Portfolio" },
                { icon: <Zap size={18} />, text: "Handelssignale" },
                { icon: <BookOpen size={18} />, text: "Educational Content" },
                { icon: <Users size={18} />, text: "Community Sharing" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-slate-200/60 hover:shadow-md transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    {item.icon}
                  </div>
                  <span className="text-sm font-semibold text-slate-700">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* HOUSE PORTFOLIO PREVIEW SECTION */}
      <section className="max-w-7xl mx-auto px-4 py-20 border-b border-slate-100">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center shadow-lg">
                <PieChart className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-950">
                Unser Portfolio
              </h2>
            </div>
            <p className="text-lg text-slate-600 max-w-2xl">
              100% transparent. Wir zeigen, was wir selbst handeln – mit allen Positionen, Entry-Preisen und Performance.
            </p>
          </div>
          <Link
            href="/portfolio"
            className="group inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-blue-600 text-white rounded-xl font-semibold text-sm transition-all hover:shadow-lg"
          >
            Vollständiges Portfolio
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Portfolio Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Value */}
          <Card className="p-8 bg-gradient-to-br from-blue-50 to-white border-blue-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm font-semibold text-slate-500">Gesamtwert</span>
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-2">€ 125,430</div>
            <div className="text-sm text-slate-600">+€ 23,430 investiert</div>
          </Card>

          {/* Total Return */}
          <Card className="p-8 bg-gradient-to-br from-emerald-50 to-white border-emerald-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
              </div>
              <span className="text-sm font-semibold text-slate-500">Rendite</span>
            </div>
            <div className="text-3xl font-bold text-emerald-600 mb-2">+22.97%</div>
            <div className="text-sm text-slate-600">All-Time Return</div>
          </Card>

          {/* Holdings */}
          <Card className="p-8 bg-gradient-to-br from-violet-50 to-white border-violet-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-violet-600" />
              </div>
              <span className="text-sm font-semibold text-slate-500">Positionen</span>
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-2">18</div>
            <div className="text-sm text-slate-600">8 Aktien · 6 ETFs · 4 Crypto</div>
          </Card>
        </div>

        {/* Top Holdings Preview */}
        <Card className="p-8">
          <h3 className="text-xl font-bold text-slate-900 mb-6">Top Positionen</h3>
          <div className="space-y-4">
            {[
              { ticker: "AAPL", name: "Apple Inc.", allocation: 15.2, return: 28.5, value: 19080 },
              { ticker: "MSFT", name: "Microsoft Corp.", allocation: 12.8, return: 31.2, value: 16055 },
              { ticker: "VOO", name: "Vanguard S&P 500 ETF", allocation: 11.5, return: 18.3, value: 14425 },
              { ticker: "BTC", name: "Bitcoin", allocation: 10.2, return: 45.8, value: 12794 },
            ].map((holding, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                <div className="flex items-center gap-4 flex-1">
                  <div className="text-center">
                    <div className="text-sm font-bold text-slate-900">{holding.ticker}</div>
                    <div className="text-xs text-slate-500">{holding.allocation}%</div>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-slate-900">{holding.name}</div>
                    <div className="text-xs text-slate-500">€ {holding.value.toLocaleString()}</div>
                  </div>
                </div>
                <div className={`text-sm font-bold ${holding.return >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {holding.return >= 0 ? '+' : ''}{holding.return}%
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link
              href="/portfolio"
              className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              Alle 18 Positionen ansehen →
            </Link>
          </div>
        </Card>
      </section>

      {/* TRADING SIGNALS SECTION */}
      <section className="max-w-7xl mx-auto px-4 py-20 border-b border-slate-100">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center shadow-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-950">
                Trading Signals
              </h2>
            </div>
            <p className="text-lg text-slate-600 max-w-2xl">
              Unsere aktuellen Handelssignale – kostenlos für alle. Mit Performance-Tracking und Transparenz.
            </p>
          </div>
          <Link
            href="/signals"
            className="group inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-blue-600 text-white rounded-xl font-semibold text-sm transition-all hover:shadow-lg"
          >
            Alle Signals
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Signal Performance Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: "Win Rate", value: "73.5%", icon: <Award className="w-5 h-5" />, color: "emerald" },
            { label: "Total Signals", value: "147", icon: <Zap className="w-5 h-5" />, color: "blue" },
            { label: "Avg. Return", value: "+12.8%", icon: <TrendingUp className="w-5 h-5" />, color: "violet" },
            { label: "Active Signals", value: "8", icon: <Target className="w-5 h-5" />, color: "amber" },
          ].map((stat, i) => (
            <Card key={i} className="p-6 text-center">
              <div className={`w-10 h-10 rounded-xl bg-${stat.color}-100 flex items-center justify-center text-${stat.color}-600 mx-auto mb-3`}>
                {stat.icon}
              </div>
              <div className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</div>
              <div className="text-sm text-slate-600">{stat.label}</div>
            </Card>
          ))}
        </div>

        {/* Active Signals Preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              ticker: "NVDA",
              name: "NVIDIA Corporation",
              signal: "BUY",
              confidence: 8,
              target: 145.50,
              entry: 132.20,
              reason: "Strong Q4 earnings, AI chip demand remains robust",
              daysActive: 3,
            },
            {
              ticker: "TSLA",
              name: "Tesla Inc.",
              signal: "HOLD",
              confidence: 6,
              target: 245.00,
              entry: 238.50,
              reason: "Awaiting production data, consolidation phase",
              daysActive: 12,
            },
          ].map((signal, i) => (
            <Card key={i} className="p-6 hover:shadow-lg transition-all">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xl font-bold text-slate-900">{signal.ticker}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      signal.signal === 'BUY' ? 'bg-emerald-100 text-emerald-700' :
                      signal.signal === 'SELL' ? 'bg-red-100 text-red-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {signal.signal}
                    </span>
                  </div>
                  <div className="text-sm text-slate-600">{signal.name}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-500 mb-1">Confidence</div>
                  <div className="text-lg font-bold text-slate-900">{signal.confidence}/10</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4 p-4 bg-slate-50 rounded-xl">
                <div>
                  <div className="text-xs text-slate-500 mb-1">Entry</div>
                  <div className="text-sm font-bold text-slate-900">${signal.entry}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">Target</div>
                  <div className="text-sm font-bold text-emerald-600">${signal.target}</div>
                </div>
              </div>

              <p className="text-sm text-slate-600 mb-4">{signal.reason}</p>

              <div className="flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{signal.daysActive} days active</span>
                </div>
                <span>Updated today</span>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* FINNHUB NEWS SECTION */}
      {finnhubNews.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-20 border-b border-slate-100">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center shadow-lg">
                  <Newspaper className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-950">
                  Market News
                </h2>
              </div>
              <p className="text-lg text-slate-600 max-w-2xl">
                Aktuelle Finanznachrichten aus aller Welt – powered by Finnhub.
              </p>
            </div>
            <Link
              href="/news"
              className="group inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-blue-600 text-white rounded-xl font-semibold text-sm transition-all hover:shadow-lg"
            >
              Alle News
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* News Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {finnhubNews.map((item) => (
              <FinnhubNewsCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      {/* EDUCATIONAL CONTENT PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 py-20 border-b border-slate-100">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center shadow-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-950">
                Lerne Investieren
              </h2>
            </div>
            <p className="text-lg text-slate-600 max-w-2xl">
              Kostenlose Guides, Tutorials und Glossar – vom Anfänger zum fortgeschrittenen Investor.
            </p>
          </div>
          <Link
            href="/learn"
            className="group inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-blue-600 text-white rounded-xl font-semibold text-sm transition-all hover:shadow-lg"
          >
            Zur Learning Hub
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              category: "Getting Started",
              title: "Erste Schritte in Aktien & ETFs",
              description: "Alles was du wissen musst, um mit dem Investieren zu starten.",
              difficulty: "Beginner",
              readingTime: 8,
              gradient: "from-blue-600 to-cyan-600",
            },
            {
              category: "Technical Analysis",
              title: "Chart-Patterns verstehen",
              description: "Lerne die wichtigsten Chart-Muster und Trading-Indikatoren kennen.",
              difficulty: "Intermediate",
              readingTime: 12,
              gradient: "from-violet-600 to-purple-600",
            },
            {
              category: "Risk Management",
              title: "Portfolio-Diversifikation",
              description: "Wie du dein Risiko minimierst und langfristig erfolgreich investierst.",
              difficulty: "Intermediate",
              readingTime: 10,
              gradient: "from-emerald-600 to-teal-600",
            },
          ].map((guide, i) => (
            <Card key={i} className="p-6 hover:shadow-xl transition-all group cursor-pointer">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${guide.gradient} flex items-center justify-center text-white shadow-lg mb-4 group-hover:scale-110 transition-transform`}>
                <BookOpen className="w-6 h-6" />
              </div>

              <div className="mb-3">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{guide.category}</span>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                {guide.title}
              </h3>

              <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                {guide.description}
              </p>

              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="px-2 py-1 bg-slate-100 rounded-md font-medium">{guide.difficulty}</span>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{guide.readingTime} min</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* COMMUNITY SECTION */}
      <section className="max-w-7xl mx-auto px-4 py-20 border-b border-slate-100">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-600 to-rose-600 flex items-center justify-center shadow-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-950">
              Community Portfolios
            </h2>
          </div>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Folge den besten Investoren, teile dein Portfolio und lerne von der Community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { user: "MaxMustermann", return: 34.2, followers: 1243, holdings: 12 },
            { user: "InvestorAnna", return: 28.7, followers: 987, holdings: 18 },
            { user: "TechBull2024", return: 42.1, followers: 2156, holdings: 9 },
          ].map((profile, i) => (
            <Card key={i} className="p-6 hover:shadow-xl transition-all cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white font-bold">
                    {profile.user.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{profile.user}</div>
                    <div className="text-xs text-slate-500">{profile.followers} Followers</div>
                  </div>
                </div>
                <Button size="sm" variant="outline">Follow</Button>
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl">
                <div>
                  <div className="text-xs text-slate-500 mb-1">Return</div>
                  <div className="text-lg font-bold text-emerald-600">+{profile.return}%</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">Holdings</div>
                  <div className="text-lg font-bold text-slate-900">{profile.holdings}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            Alle Community Portfolios ansehen →
          </Link>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-12 md:p-16 text-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1),transparent_70%)]" />

          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Bereit zu starten?
            </h2>
            <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Erstelle dein kostenloses Konto und starte deine Investing-Journey noch heute.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/register"
                className="group inline-flex items-center gap-3 px-8 py-4 bg-white hover:bg-slate-50 text-slate-900 rounded-2xl font-bold text-sm transition-all shadow-xl hover:shadow-2xl hover:scale-105"
              >
                Kostenlos registrieren
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/learn"
                className="inline-flex items-center gap-3 px-8 py-4 bg-transparent hover:bg-white/10 text-white rounded-2xl font-bold text-sm border-2 border-white/20 transition-all"
              >
                Mehr erfahren
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

// Finnhub News Card Component (Server Component - no event handlers)
function FinnhubNewsCard({ item }: { item: any }) {
  const timeAgo = getTimeAgo(item.published_at);

  return (
    <a href={item.url} target="_blank" rel="noopener noreferrer">
      <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer h-full flex flex-col">
        {/* Image */}
        {item.image_url && (
          <div className="relative h-48 w-full overflow-hidden bg-slate-100">
            <img
              src={item.image_url}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        )}

        <div className="relative p-6 flex-1 flex flex-col">
          {/* Headline */}
          <h3 className="text-lg font-bold text-slate-900 mb-3 leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
            {item.title}
          </h3>

          {/* Description */}
          {item.description && (
            <p className="text-sm text-slate-600 mb-4 line-clamp-3 leading-relaxed flex-1">
              {item.description}
            </p>
          )}

          {/* Meta Info */}
          <div className="flex items-center justify-between text-xs text-slate-500 mt-auto">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{timeAgo}</span>
            </div>

            <div className="flex items-center gap-1 text-blue-600 font-semibold">
              <span>Read more</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Source Badge */}
          {item.source && (
            <div className="mt-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Newspaper className="w-3.5 h-3.5" />
                <span className="font-medium">{item.source}</span>
              </div>
            </div>
          )}
        </div>
      </Card>
    </a>
  );
}

// Helper: Time ago formatter
function getTimeAgo(publishedAt: string): string {
  const now = new Date();
  const published = new Date(publishedAt);
  const diffMs = now.getTime() - published.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return published.toLocaleDateString('de-DE', { day: '2-digit', month: 'short' });
}
