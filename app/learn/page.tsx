import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  BookOpen,
  Video,
  Book,
  Clock,
  TrendingUp,
  Target,
  Shield,
  Search,
  Star,
  Play,
  FileText,
  Award,
} from "lucide-react";

export const metadata = {
  title: "Learn Investing | Beyond Charts",
  description: "Free guides, tutorials, and glossary to help you become a better investor. From beginner to advanced.",
};

export default function LearnPage() {
  return (
    <div className="min-h-screen bg-slate-50">

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-violet-50/30 to-slate-50 border-b border-slate-200">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.05),transparent_50%)]" />

        <div className="relative max-w-7xl mx-auto px-4 py-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center shadow-xl">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-5xl font-bold tracking-tight text-slate-950">
              Learn Investing
            </h1>
          </div>
          <p className="text-lg text-slate-600 max-w-3xl mb-8">
            Kostenlose Guides, Video-Tutorials und Glossar – vom Anfänger zum fortgeschrittenen Investor. Lerne in deinem eigenen Tempo.
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Guides", value: "42", icon: <FileText className="w-5 h-5" /> },
              { label: "Videos", value: "28", icon: <Video className="w-5 h-5" /> },
              { label: "Glossary Terms", value: "150+", icon: <Book className="w-5 h-5" /> },
              { label: "Avg. Time", value: "10 min", icon: <Clock className="w-5 h-5" /> },
            ].map((stat, i) => (
              <Card key={i} className="p-6 bg-white/80 backdrop-blur-sm">
                <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center text-violet-600 mb-3">
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
          <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold text-sm shadow-lg">
            Guides
          </button>
          <button className="px-6 py-3 rounded-xl text-slate-600 hover:bg-slate-50 font-semibold text-sm transition-all">
            Videos
          </button>
          <button className="px-6 py-3 rounded-xl text-slate-600 hover:bg-slate-50 font-semibold text-sm transition-all">
            Glossary
          </button>
        </div>

        {/* Search Bar */}
        <Card className="p-6 mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search guides, videos, or glossary terms..."
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
          </div>
        </Card>

        {/* Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "Getting Started", count: 12, color: "blue", icon: <Target /> },
              { name: "Technical Analysis", count: 8, color: "violet", icon: <TrendingUp /> },
              { name: "Fundamental Analysis", count: 10, color: "emerald", icon: <FileText /> },
              { name: "Risk Management", count: 7, color: "amber", icon: <Shield /> },
              { name: "Portfolio Strategy", count: 6, color: "pink", icon: <Award /> },
              { name: "Trading Psychology", count: 5, color: "cyan", icon: <Book /> },
              { name: "Market Analysis", count: 9, color: "rose", icon: <TrendingUp /> },
              { name: "Crypto Basics", count: 4, color: "orange", icon: <BookOpen /> },
            ].map((category, i) => (
              <Card key={i} className={`p-6 hover:shadow-xl transition-all cursor-pointer group bg-gradient-to-br from-${category.color}-50 to-white border-${category.color}-100`}>
                <div className={`w-12 h-12 rounded-xl bg-${category.color}-100 flex items-center justify-center text-${category.color}-600 mb-4 group-hover:scale-110 transition-transform`}>
                  {category.icon}
                </div>
                <h3 className="font-bold text-slate-900 mb-1">{category.name}</h3>
                <p className="text-sm text-slate-600">{category.count} guides</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Featured Guides */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Featured Guides</h2>
            <Badge tone="success">
              <Star className="w-3 h-3 mr-1" />
              Popular
            </Badge>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Erste Schritte in Aktien & ETFs",
                category: "Getting Started",
                difficulty: "Beginner",
                readingTime: 8,
                views: 12453,
                description: "Alles was du wissen musst, um mit dem Investieren zu starten. Von der Depot-Eröffnung bis zum ersten Trade.",
                gradient: "from-blue-600 to-cyan-600",
              },
              {
                title: "Chart-Patterns verstehen",
                category: "Technical Analysis",
                difficulty: "Intermediate",
                readingTime: 12,
                views: 8932,
                description: "Lerne die wichtigsten Chart-Muster und Trading-Indikatoren kennen. Mit praktischen Beispielen.",
                gradient: "from-violet-600 to-purple-600",
              },
              {
                title: "Portfolio-Diversifikation",
                category: "Risk Management",
                difficulty: "Intermediate",
                readingTime: 10,
                views: 9821,
                description: "Wie du dein Risiko minimierst und langfristig erfolgreich investierst. Asset-Allocation Strategien.",
                gradient: "from-emerald-600 to-teal-600",
              },
              {
                title: "Value Investing Grundlagen",
                category: "Fundamental Analysis",
                difficulty: "Intermediate",
                readingTime: 15,
                views: 7654,
                description: "Warren Buffetts Investment-Philosophie verstehen. Wie du unterbewertete Qualitäts-Aktien findest.",
                gradient: "from-amber-600 to-orange-600",
              },
              {
                title: "ETFs vs. Einzelaktien",
                category: "Portfolio Strategy",
                difficulty: "Beginner",
                readingTime: 7,
                views: 11234,
                description: "Vor- und Nachteile von ETFs und Einzelaktien. Welche Strategie passt zu dir?",
                gradient: "from-pink-600 to-rose-600",
              },
              {
                title: "Kryptowährungen für Einsteiger",
                category: "Crypto Basics",
                difficulty: "Beginner",
                readingTime: 9,
                views: 10567,
                description: "Bitcoin, Ethereum & Co. verstehen. Blockchain-Technologie und Investment-Chancen erklärt.",
                gradient: "from-orange-600 to-red-600",
              },
            ].map((guide, i) => (
              <Card key={i} className="p-6 hover:shadow-xl transition-all group cursor-pointer">
                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${guide.gradient} flex items-center justify-center text-white shadow-lg mb-4 group-hover:scale-110 transition-transform`}>
                  <BookOpen className="w-7 h-7" />
                </div>

                {/* Category */}
                <div className="mb-3">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{guide.category}</span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-violet-600 transition-colors leading-tight">
                  {guide.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                  {guide.description}
                </p>

                {/* Meta */}
                <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                  <Badge tone="default" size="sm">{guide.difficulty}</Badge>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{guide.readingTime} min</span>
                    </div>
                    <span>{guide.views.toLocaleString()} views</span>
                  </div>
                </div>

                {/* Progress Bar (Mock) */}
                <div className="pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                    <span>Your Progress</span>
                    <span>0%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-violet-600 to-purple-600 w-0" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Video Tutorials */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Video Tutorials</h2>
            <Badge>
              <Video className="w-3 h-3 mr-1" />
              28 Videos
            </Badge>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: "Portfolio aufbauen - Schritt für Schritt",
                category: "Getting Started",
                duration: "12:45",
                views: 15234,
                thumbnail: "gradient-to-br from-blue-600 to-cyan-600",
              },
              {
                title: "Trading-Indikatoren richtig nutzen",
                category: "Technical Analysis",
                duration: "18:30",
                views: 11890,
                thumbnail: "gradient-to-br from-violet-600 to-purple-600",
              },
              {
                title: "Finanzkennzahlen verstehen (P/E, KGV, etc.)",
                category: "Fundamental Analysis",
                duration: "15:20",
                views: 9876,
                thumbnail: "gradient-to-br from-emerald-600 to-teal-600",
              },
              {
                title: "Stop-Loss richtig setzen",
                category: "Risk Management",
                duration: "10:15",
                views: 13567,
                thumbnail: "gradient-to-br from-amber-600 to-orange-600",
              },
            ].map((video, i) => (
              <Card key={i} className="overflow-hidden hover:shadow-xl transition-all group cursor-pointer">
                {/* Thumbnail */}
                <div className={`relative h-48 bg-gradient-to-br ${video.thumbnail} flex items-center justify-center`}>
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                  <div className="relative w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-7 h-7 text-slate-900 ml-1" />
                  </div>
                  {/* Duration Badge */}
                  <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/80 backdrop-blur-sm rounded-lg text-xs font-semibold text-white">
                    {video.duration}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="mb-2">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{video.category}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-violet-600 transition-colors">
                    {video.title}
                  </h3>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span>{video.views.toLocaleString()} views</span>
                    <span>•</span>
                    <span>HD Quality</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Glossary Preview */}
        <Card className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Glossary</h2>
            <Badge>
              <Book className="w-3 h-3 mr-1" />
              150+ Terms
            </Badge>
          </div>

          <p className="text-slate-600 mb-6">
            Schnell nachschlagen: Alle wichtigen Finanz-Begriffe verständlich erklärt.
          </p>

          {/* Popular Terms */}
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                term: "P/E Ratio (KGV)",
                definition: "Das Kurs-Gewinn-Verhältnis zeigt, wie viel Anleger bereit sind, für jeden Euro Gewinn zu bezahlen. Ein niedriges KGV kann auf Unterbewertung hindeuten.",
                category: "Fundamental Analysis",
              },
              {
                term: "Diversifikation",
                definition: "Streuung des Kapitals über verschiedene Anlagen, um Risiken zu minimieren. Nicht alle Eier in einen Korb legen.",
                category: "Risk Management",
              },
              {
                term: "ETF (Exchange Traded Fund)",
                definition: "Börsengehandelter Fonds, der einen Index (z.B. S&P 500) nachbildet. Günstig, transparent und breit diversifiziert.",
                category: "Investment Products",
              },
              {
                term: "Dividende",
                definition: "Gewinnausschüttung eines Unternehmens an seine Aktionäre. Wird meist jährlich oder quartalsweise ausgezahlt.",
                category: "Stocks",
              },
              {
                term: "Volatilität",
                definition: "Schwankungsbreite eines Wertpapiers. Hohe Volatilität bedeutet starke Kursschwankungen und höheres Risiko.",
                category: "Risk Management",
              },
              {
                term: "Bull Market / Bear Market",
                definition: "Bullenmarkt = steigende Kurse über längeren Zeitraum. Bärenmarkt = fallende Kurse, meist 20%+ vom Hoch.",
                category: "Market Dynamics",
              },
            ].map((item, i) => (
              <div key={i} className="p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-slate-900">{item.term}</h3>
                  <span className="text-xs text-slate-500 bg-white px-2 py-1 rounded-md">{item.category}</span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{item.definition}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <button className="text-sm font-semibold text-violet-600 hover:text-violet-700 transition-colors">
              View all 150+ terms →
            </button>
          </div>
        </Card>

        {/* Learning Path */}
        <Card className="p-8 mt-12 bg-gradient-to-br from-violet-50 to-purple-50 border-violet-100">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-6 h-6 text-violet-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Empfohlener Lernpfad</h3>
              <p className="text-slate-600 leading-relaxed mb-4">
                Neu beim Investieren? Folge unserem strukturierten Lernpfad vom absoluten Anfänger zum selbstbewussten Investor.
                Jeder Schritt baut auf dem vorherigen auf.
              </p>
              <button className="px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-semibold text-sm transition-all shadow-lg hover:shadow-xl">
                Lernpfad starten
              </button>
            </div>
          </div>
        </Card>

      </section>
    </div>
  );
}
