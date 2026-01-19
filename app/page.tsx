import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Zap,
  Shield,
  Target,
  Sparkles,
  LineChart,
  Newspaper,
  BarChart3,
  Users,
  Clock,
  ExternalLink,
} from "lucide-react";
import { PremiumIcon } from "@/components/PremiumIcon";
import { AnalysesGrid } from "@/components/home/AnalysesGrid";
import { getStoredNews } from "@/lib/news-storage";
import { listContent } from "@/lib/content.server";

export const dynamic = "force-dynamic";
export const revalidate = 300; // Revalidate every 5 minutes

export default async function HomePage() {
  const allAnalyses = await listContent("analyses");
  const featuredAnalysis = allAnalyses.find((a: any) => a.isPremium) || allAnalyses[0];

  // Fetch Finnhub news from Supabase storage (with error handling)
  let finnhubNews: any[] = [];
  try {
    finnhubNews = await getStoredNews(12);
  } catch (error) {
    console.error('[Home Page] Error fetching news:', error);
  }

  return (
    <div className="min-h-screen">

      {/* HERO SECTION - Full Width Background */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 border-b border-slate-200">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.05),transparent_50%)]" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
          <div className="absolute top-40 right-10 w-72 h-72 bg-violet-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-32">
          <div className="grid gap-16 lg:grid-cols-12 lg:items-center">

            {/* Left Content */}
            <div className="lg:col-span-7 order-2 lg:order-1">
              {/* Main Headline */}
              <div className="mb-6">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-sm font-semibold text-blue-700 mb-6">
                  <Sparkles className="w-4 h-4" />
                  Finanzanalysen für Investoren
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight text-slate-950 mb-8">
                Hinter die Fassade
                <br />
                <span className="bg-gradient-to-r from-blue-600 via-violet-600 to-blue-600 bg-clip-text text-transparent">
                  der Märkte blicken
                </span>
              </h1>

              {/* Subheadline */}
              <p className="max-w-2xl text-xl md:text-2xl leading-relaxed text-slate-600 mb-12">
                Wir greifen Marktbewegungen und Schlagzeilen auf und setzen sie in
                Relation zu <span className="font-semibold text-slate-900">Geschäftsmodellen</span>, <span className="font-semibold text-slate-900">Wettbewerb</span> und langfristigen Strukturen.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 mb-16">
                <Link
                  href="/analysen"
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-slate-950 hover:bg-blue-600 text-white rounded-2xl font-bold text-sm transition-all shadow-xl hover:shadow-2xl hover:scale-105"
                >
                  Analysen entdecken
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/portfolio"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-white hover:bg-slate-50 text-slate-900 rounded-2xl font-bold text-sm border-2 border-slate-200 transition-all hover:border-slate-300"
                >
                  Unser Portfolio
                </Link>
              </div>

              {/* Feature Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: <Target size={18} />, text: "Deep-Dive Sektor-Analysen" },
                  { icon: <TrendingUp size={18} />, text: "Fokus auf Cashflow & Burggraben" },
                  { icon: <Shield size={18} />, text: "Nachhaltiger Vermögensaufbau" },
                  { icon: <LineChart size={18} />, text: "Echtes Depot mit Real-Time Signalen" },
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

            {/* Right - Featured Analysis Card */}
            <div className="lg:col-span-5 order-1 lg:order-2">
              {featuredAnalysis ? (
                <div className="relative group">
                  {/* Animated Glow Effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-violet-600 to-blue-600 rounded-[40px] opacity-20 group-hover:opacity-40 blur-2xl transition-all duration-500" />

                  {/* Card Wrapper with proper clipping */}
                  <div className="relative overflow-hidden rounded-[40px]">
                    <Card className="relative border-none shadow-2xl text-white transform hover:scale-[1.02] transition-all duration-500 overflow-hidden min-h-[420px]">

                      {/* Full Background Image */}
                      {featuredAnalysis.imageUrl ? (
                        <div className="absolute inset-0">
                          <img
                            src={featuredAnalysis.imageUrl}
                            alt={featuredAnalysis.title}
                            className="w-full h-full object-cover"
                          />
                          {/* Dark gradient overlay for text readability */}
                          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-slate-900/70 to-slate-900/95" />
                        </div>
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
                      )}

                      {/* Premium Badge - Top Right */}
                      <div className="absolute top-6 right-6 z-10">
                        {featuredAnalysis.isPremium && <PremiumIcon />}
                      </div>

                      {/* Content Overlay */}
                      <div className="relative z-10 p-8 md:p-10 h-full flex flex-col justify-end pb-12">

                        {/* Top Row: ANALYSE Badge */}
                        <div className="flex items-center justify-between mb-8">
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 rounded-full">
                            <Sparkles className="h-3.5 w-3.5 text-blue-400" />
                            <span className="text-xs font-bold text-blue-300 uppercase tracking-wide">
                              Analyse
                            </span>
                          </div>
                        </div>

                        {/* Title */}
                        <h2 className="text-xl md:text-2xl font-bold leading-tight text-white mb-5 line-clamp-2 break-words">
                          {featuredAnalysis.title}
                        </h2>

                        {/* Summary */}
                        {featuredAnalysis.summary && (
                          <p className="text-sm text-slate-300 leading-relaxed mb-5 line-clamp-3">
                            {featuredAnalysis.summary}
                          </p>
                        )}

                        {/* Meta Footer */}
                        {(featuredAnalysis.category || featuredAnalysis.content) && (
                          <div className="flex items-center gap-2 mb-6 text-xs text-slate-400">
                            {featuredAnalysis.category && (
                              <>
                                <span className="font-medium">{featuredAnalysis.category}</span>
                                <span>•</span>
                              </>
                            )}
                            {featuredAnalysis.content && (
                              <span>{Math.max(1, Math.ceil(featuredAnalysis.content.split(/\s+/).length / 200))} min</span>
                            )}
                          </div>
                        )}

                        {/* CTA Button */}
                      <Link
                        href={`/analysen/${featuredAnalysis.slug}`}
                        className="group/btn relative flex items-center justify-between w-full px-5 py-3.5 rounded-xl overflow-hidden transition-all hover:scale-[1.02]"
                      >
                        {/* Gradient background */}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-violet-600 opacity-90 group-hover/btn:opacity-100 transition-opacity" />

                        {/* Hover shimmer */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />

                        <span className="relative text-sm font-bold text-white">Analyse öffnen</span>
                        <ArrowRight className="relative h-4 w-4 text-white group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </Card>
                </div>
              </div>
              ) : (
                <div className="p-12 bg-white/60 backdrop-blur-sm border-2 border-dashed border-slate-300 rounded-[40px] text-center">
                  <TrendingUp className="h-12 w-12 text-slate-300 mb-4 mx-auto" />
                  <p className="text-sm text-slate-500 font-medium">
                    Analysen werden vorbereitet...
                  </p>
                </div>
              )}
            </div>
          </div>
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
                  Latest News
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
            {finnhubNews.slice(0, 6).map((item) => (
              <FinnhubNewsCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      {/* HOW IT WORKS SECTION */}
      <section className="max-w-7xl mx-auto px-4 py-20 border-b border-slate-100">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-950 mb-4">
            Wie es funktioniert
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Drei einfache Schritte zu besseren Investmententscheidungen
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              step: "01",
              title: "Analysen lesen",
              description: "Tiefgehende Analysen zu Unternehmen, Branchen und Markttrends – fundiert recherchiert und verständlich aufbereitet.",
              icon: <BarChart3 className="w-8 h-8" />,
              gradient: "from-blue-600 to-cyan-600",
            },
            {
              step: "02",
              title: "Verstehen & Lernen",
              description: "Komplexe Zusammenhänge einfach erklärt. Verstehe Geschäftsmodelle, Wettbewerb und langfristige Trends.",
              icon: <Target className="w-8 h-8" />,
              gradient: "from-violet-600 to-purple-600",
            },
            {
              step: "03",
              title: "Informiert investieren",
              description: "Triff fundierte Entscheidungen basierend auf Daten, Fakten und professioneller Analyse.",
              icon: <TrendingUp className="w-8 h-8" />,
              gradient: "from-emerald-600 to-teal-600",
            },
          ].map((item, i) => (
            <div key={i} className="relative group">
              {/* Glow effect */}
              <div className={`absolute -inset-0.5 bg-gradient-to-r ${item.gradient} rounded-3xl opacity-0 group-hover:opacity-20 blur transition-all duration-300`} />

              <div className="relative bg-white p-8 rounded-3xl border border-slate-200 hover:shadow-xl transition-all h-full">
                {/* Step Number */}
                <div className="text-6xl font-bold text-slate-100 mb-4">
                  {item.step}
                </div>

                {/* Icon */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white shadow-lg mb-6 group-hover:scale-110 transition-transform`}>
                  {item.icon}
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ANALYSES SECTION */}
      <section className="max-w-7xl mx-auto px-4 py-20 border-b border-slate-100">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-950 mb-4">
              Analysen
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl">
              Fundierte Analysen für ein tieferes Unternehmensverständnis.
            </p>
          </div>
          <Link
            href="/analysen"
            className="group inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-blue-600 text-white rounded-xl font-semibold text-sm transition-all hover:shadow-lg"
          >
            Alle Analysen
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <AnalysesGrid analyses={allAnalyses} />
      </section>

      {/* STATS SECTION */}
      <section className="max-w-7xl mx-auto px-4 py-20 border-b border-slate-100">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              value: "500+",
              label: "Analysen",
              gradient: "from-blue-600 to-cyan-600",
              icon: (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              )
            },
            {
              value: "12K+",
              label: "Leser",
              gradient: "from-violet-600 to-purple-600",
              icon: <Users className="h-6 w-6" />
            },
            {
              value: "95%",
              label: "Erfolgsquote",
              gradient: "from-emerald-600 to-teal-600",
              icon: <CheckCircle2 className="h-6 w-6" />
            },
            {
              value: "24/7",
              label: "Updates",
              gradient: "from-amber-600 to-orange-600",
              icon: <Zap className="h-6 w-6" />
            },
          ].map((stat, i) => (
            <div key={i} className="group relative">
              {/* Glow effect */}
              <div className={`absolute -inset-0.5 bg-gradient-to-r ${stat.gradient} rounded-3xl opacity-0 group-hover:opacity-20 blur transition-opacity`} />

              {/* Card */}
              <div className="relative p-8 bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg transition-all">
                {/* Icon */}
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-4 text-white shadow-lg group-hover:scale-110 transition-transform`}>
                  {stat.icon}
                </div>

                {/* Value */}
                <div className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">
                  {stat.value}
                </div>

                {/* Label */}
                <div className="text-sm font-medium text-slate-600">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-y border-slate-700">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.1),transparent_50%)]" />

        <div className="relative max-w-7xl mx-auto px-4 py-20 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6">
              Bereit für tiefere Einblicke?
            </h2>
            <p className="text-xl text-slate-300 mb-10 font-light">
              Erhalte Zugang zu exklusiven Analysen und professionellen Markteinschätzungen.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/analysen"
                className="inline-flex items-center gap-3 px-8 py-4 bg-white text-slate-900 rounded-2xl font-bold text-sm hover:bg-blue-50 transition-all shadow-xl hover:shadow-2xl hover:scale-105"
              >
                Jetzt starten
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/portfolio"
                className="inline-flex items-center gap-3 px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-bold text-sm border border-white/20 transition-all"
              >
                Mehr erfahren
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* DISCLAIMER */}
      <section className="max-w-7xl mx-auto px-4 py-12 text-center">
        <div className="max-w-4xl mx-auto p-8 bg-slate-50 rounded-3xl border border-slate-200">
          <p className="text-xs leading-relaxed text-slate-500">
            <span className="font-bold text-slate-700 uppercase tracking-wide">Risikohinweis:</span>{" "}
            Keine Anlageberatung im Sinne des WpHG. Alle Inhalte dienen ausschließlich der Information und stellen keine Aufforderung zum Kauf oder Verkauf von Wertpapieren dar. Investitionen in Wertpapiere sind mit Risiken verbunden und können zum Totalverlust des eingesetzten Kapitals führen. Vergangene Wertentwicklungen sind kein Indikator für zukünftige Erträge. Bitte beachte unsere vollständigen{" "}
            <Link href="/haftungsausschluss" className="underline hover:text-blue-600 font-semibold">
              Haftungsausschlüsse
            </Link>.
          </p>
        </div>
      </section>
    </div>
  );
}

// Finnhub News Card Component
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
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
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

// Helper function to format time ago
function getTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Gerade eben';
  if (diffMins < 60) return `vor ${diffMins} Min.`;
  if (diffHours < 24) return `vor ${diffHours} Std.`;
  if (diffDays < 7) return `vor ${diffDays} Tag${diffDays > 1 ? 'en' : ''}`;

  return date.toLocaleDateString('de-DE', {
    day: 'numeric',
    month: 'short',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  });
}
