import { listContent } from "@/lib/content.server";
import { NewsCard } from "@/components/news/NewsCard";
<<<<<<< HEAD
import {
  TrendingUp,
  Zap,
  Clock,
  Filter,
  Sparkles,
=======
import { Badge } from "@/components/ui/Badge";
import { 
  TrendingUp, 
  Zap, 
  Clock, 
  Filter,
  Sparkles 
>>>>>>> 1ad3d42fee7245012111a3a2033405f598854555
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function NewsPage() {
  const items = await listContent("news");
<<<<<<< HEAD

  // Type assertion - we know these properties exist on news items
  const newsItems = items.map((item) => {
    const newsItem = item as any; // Bypass strict typing
    return {
      ...item,
      impact: newsItem.impact as string | undefined,
      source: newsItem.source as string | undefined,
      image: newsItem.image as string | undefined,
      sourceType: newsItem.sourceType as string | undefined,
    };
  });

  // Sortierung nach Impact (safe access)
  const featuredNews = newsItems
    .filter((n) => n.impact === "High")
    .slice(0, 3);

  const regularNews = newsItems.filter(
    (n) => !n.impact || n.impact !== "High"
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/20">
=======
  
  // Sortiere nach Impact und Datum
  const featuredNews = items.filter((n) => n.impact === "High").slice(0, 3);
  const regularNews = items.filter((n) => n.impact !== "High");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/20">
      
>>>>>>> 1ad3d42fee7245012111a3a2033405f598854555
      {/* Hero Header */}
      <div className="border-b border-slate-200 bg-white/50 backdrop-blur-sm">
        <div className="ff-container px-4 py-16 md:py-24">
          <div className="max-w-4xl">
            {/* Badges */}
            <div className="flex items-center gap-3 mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-emerald-200 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                  Live Feed
                </span>
              </div>
<<<<<<< HEAD
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight text-slate-950 mb-8">
              Markt News
            </h1>

            <p className="text-xl md:text-2xl text-slate-600 leading-relaxed max-w-3xl mb-10">
              Kurz, klar und relevant — mit{" "}
              <span className="font-semibold text-slate-900">Kontext</span>,{" "}
              <span className="font-semibold text-slate-900">
                Katalysatoren
              </span>{" "}
              und{" "}
              <span className="font-semibold text-slate-900">
                Watchpoints
              </span>
              .
=======
              <Badge tone="neutral" className="px-4 py-2">Breaking News</Badge>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight text-slate-950 mb-8">
              Market News
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-slate-600 leading-relaxed max-w-3xl mb-10">
              Kurz, klar und relevant — mit <span className="font-semibold text-slate-900">Kontext</span>, <span className="font-semibold text-slate-900">Katalysatoren</span> und <span className="font-semibold text-slate-900">Watchpoints</span>.
>>>>>>> 1ad3d42fee7245012111a3a2033405f598854555
            </p>

            {/* Quick Stats */}
            <div className="flex flex-wrap items-center gap-6 text-sm">
              <div className="flex items-center gap-2 text-slate-600">
                <Clock size={16} className="text-emerald-600" />
<<<<<<< HEAD
                <span className="font-medium">
                  {newsItems.length} aktuelle Meldungen
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Zap size={16} className="text-amber-600" />
                <span className="font-medium">
                  {featuredNews.length} Hoher Impact
                </span>
=======
                <span className="font-medium">{items.length} aktuelle Meldungen</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Zap size={16} className="text-amber-600" />
                <span className="font-medium">{featuredNews.length} High Impact</span>
>>>>>>> 1ad3d42fee7245012111a3a2033405f598854555
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <TrendingUp size={16} className="text-blue-600" />
                <span className="font-medium">Heute aktualisiert</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="ff-container px-4 py-16 space-y-16">
<<<<<<< HEAD
        {/* High Impact News */}
=======
        
        {/* High Impact News Section */}
>>>>>>> 1ad3d42fee7245012111a3a2033405f598854555
        {featuredNews.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-600 to-orange-600 flex items-center justify-center shadow-lg">
                <Zap size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-950">
<<<<<<< HEAD
                  Hoher Impact
=======
                  High Impact News
>>>>>>> 1ad3d42fee7245012111a3a2033405f598854555
                </h2>
                <p className="text-sm text-slate-500 font-medium">
                  Marktbewegende Entwicklungen
                </p>
              </div>
            </div>

<<<<<<< HEAD
            <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
              {featuredNews.map((n) => (
                <div key={n.id} className="relative group">
=======
            {/* Featured Grid - Größere Cards */}
            <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
              {featuredNews.map((n) => (
                <div key={n.id} className="relative group">
                  {/* Glow Effect für High Impact */}
>>>>>>> 1ad3d42fee7245012111a3a2033405f598854555
                  <div className="absolute -inset-1 bg-gradient-to-r from-rose-600 to-orange-600 rounded-3xl opacity-20 group-hover:opacity-30 blur-xl transition-all" />
                  <div className="relative">
                    <NewsCard
                      title={n.title}
                      summary={n.summary}
<<<<<<< HEAD
                      href={`/news/${n.slug}`}
=======
                      href={n.slug ? `/news/${n.slug}` : "/news"}
>>>>>>> 1ad3d42fee7245012111a3a2033405f598854555
                      category={n.category}
                      source={n.source || "BeyondCharts"}
                      publishedAt={n.publishedAt || n.createdAt}
                      isPremium={n.isPremium}
                      tags={n.tags}
                      image={n.image}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

<<<<<<< HEAD
        {/* Regular News */}
=======
        {/* Regular News Section */}
>>>>>>> 1ad3d42fee7245012111a3a2033405f598854555
        <section>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center shadow-lg">
                <TrendingUp size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-950">
<<<<<<< HEAD
                  News
                </h2>
                <p className="text-sm text-slate-500 font-medium">
                  Aktuelle Finanz- und Marktnews auf einen Blick.
=======
                  Alle Nachrichten
                </h2>
                <p className="text-sm text-slate-500 font-medium">
                  Aktuelle Updates & Insights
>>>>>>> 1ad3d42fee7245012111a3a2033405f598854555
                </p>
              </div>
            </div>

<<<<<<< HEAD
=======
            {/* Filter Button (Optional) */}
>>>>>>> 1ad3d42fee7245012111a3a2033405f598854555
            <button className="hidden md:flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all text-sm font-semibold text-slate-700">
              <Filter size={16} />
              Filter
            </button>
          </div>

<<<<<<< HEAD
=======
          {/* News Grid */}
>>>>>>> 1ad3d42fee7245012111a3a2033405f598854555
          <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
            {regularNews.map((n) => (
              <NewsCard
                key={n.id}
                title={n.title}
                summary={n.summary}
<<<<<<< HEAD
                href={`/news/${n.slug}`}
=======
                href={n.slug ? `/news/${n.slug}` : "/news"}
>>>>>>> 1ad3d42fee7245012111a3a2033405f598854555
                category={n.category}
                source={n.source || "BeyondCharts"}
                publishedAt={n.publishedAt || n.createdAt}
                isPremium={n.isPremium}
                tags={n.tags}
                image={n.image}
              />
            ))}
          </div>
        </section>

        {/* Empty State */}
<<<<<<< HEAD
        {newsItems.length === 0 && (
=======
        {items.length === 0 && (
>>>>>>> 1ad3d42fee7245012111a3a2033405f598854555
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-slate-100 mb-6">
              <Sparkles size={32} className="text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">
              Keine News verfügbar
            </h3>
            <p className="text-slate-500 font-medium max-w-md mx-auto">
<<<<<<< HEAD
              Aktuell sind keine Nachrichten veröffentlicht. Schau später
              wieder vorbei.
            </p>
          </div>
        )}
=======
              Aktuell sind keine Nachrichten veröffentlicht. Schau später wieder vorbei!
            </p>
          </div>
        )}

        {/* Newsletter CTA (Optional) */}
        <section className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-900 rounded-3xl border border-emerald-800">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.15),transparent_50%)]" />
          
          <div className="relative p-12 md:p-16 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6">
              <Sparkles size={14} className="text-emerald-400" />
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                Stay Updated
              </span>
            </div>

            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Verpasse keine wichtigen News
            </h2>
            <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
              Erhalte Breaking News und Market Updates direkt in dein Postfach.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="deine@email.com"
                className="flex-1 px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder:text-emerald-300/60 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
              <button className="px-8 py-4 bg-white hover:bg-emerald-50 text-emerald-900 rounded-2xl font-bold text-sm transition-all shadow-xl hover:shadow-2xl hover:scale-105">
                Abonnieren
              </button>
            </div>

            <p className="text-xs text-emerald-300/80 mt-4">
              Kostenlos. Jederzeit abbestellbar.
            </p>
          </div>
        </section>
>>>>>>> 1ad3d42fee7245012111a3a2033405f598854555
      </div>
    </div>
  );
}