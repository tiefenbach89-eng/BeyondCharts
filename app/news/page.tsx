import { listContent } from "@/lib/content.server";
import { NewsCard } from "@/components/news/NewsCard";
import { AssetNewsSection } from "@/components/news/AssetNewsSection";
import { fetchMarketauxNews } from "@/lib/marketaux";
import { getCachedNews, setCachedNews } from "@/lib/news-cache";
import {
  TrendingUp,
  Zap,
  Clock,
  Filter,
  Sparkles,
} from "lucide-react";

// Use ISR: Page is statically generated and revalidated every 30 minutes
export const revalidate = 1800; // 30 minutes (or on-demand)

export default async function NewsPage() {
  // Check cache first
  let assetNews = getCachedNews();

  // If no cache, fetch from API (only happens once every 30 min)
  if (!assetNews || assetNews.length === 0) {
    const newsData = await fetchMarketauxNews(undefined, 3, 'de');
    assetNews = newsData.data;

    // Cache for subsequent requests
    if (assetNews.length > 0) {
      setCachedNews(assetNews);
    }
  }

  // Fetch internal news
  const items = await listContent("news");

  const assetNewsData = {
    data: assetNews,
    meta: {
      found: assetNews.length,
      returned: assetNews.length,
      limit: assetNews.length,
      page: 1
    }
  };

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
            </p>

            {/* Quick Stats */}
            <div className="flex flex-wrap items-center gap-6 text-sm">
              <div className="flex items-center gap-2 text-slate-600">
                <Clock size={16} className="text-emerald-600" />
                <span className="font-medium">
                  {newsItems.length} aktuelle Meldungen
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Zap size={16} className="text-amber-600" />
                <span className="font-medium">
                  {featuredNews.length} Hoher Impact
                </span>
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
        {/* Asset News from Marketaux */}
        {assetNewsData.data.length > 0 && (
          <AssetNewsSection initialNews={assetNewsData.data} />
        )}

        {/* High Impact News */}
        {featuredNews.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-600 to-orange-600 flex items-center justify-center shadow-lg">
                <Zap size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-950">
                  Hoher Impact
                </h2>
                <p className="text-sm text-slate-500 font-medium">
                  Marktbewegende Entwicklungen
                </p>
              </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
              {featuredNews.map((n) => (
                <div key={n.id} className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-rose-600 to-orange-600 rounded-3xl opacity-20 group-hover:opacity-30 blur-xl transition-all" />
                  <div className="relative">
                    <NewsCard
                      title={n.title}
                      summary={n.summary}
                      href={`/news/${n.slug}`}
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

        {/* Regular News */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center shadow-lg">
                <TrendingUp size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-950">
                  News
                </h2>
                <p className="text-sm text-slate-500 font-medium">
                  Aktuelle Finanz- und Marktnews auf einen Blick.
                </p>
              </div>
            </div>

            <button className="hidden md:flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all text-sm font-semibold text-slate-700">
              <Filter size={16} />
              Filter
            </button>
          </div>

          <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
            {regularNews.map((n) => (
              <NewsCard
                key={n.id}
                title={n.title}
                summary={n.summary}
                href={`/news/${n.slug}`}
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
        {newsItems.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-slate-100 mb-6">
              <Sparkles size={32} className="text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">
              Keine News verfügbar
            </h3>
            <p className="text-slate-500 font-medium max-w-md mx-auto">
              Aktuell sind keine Nachrichten veröffentlicht. Schau später
              wieder vorbei.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}