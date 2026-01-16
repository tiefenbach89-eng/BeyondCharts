import { listContent } from "@/lib/content.server";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Search, Sparkles, TrendingUp, Calendar, ArrowRight } from "lucide-react";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const params = await searchParams;
  const q = (params.q ?? "").toLowerCase().trim();
  const allNews = await listContent("news", { includeDrafts: false });
  const allAnalyses = await listContent("analyses", { includeDrafts: false });

  // Better search: includes content and ticker
  const news = allNews.filter((n) =>
    q ? (n.title + n.summary + n.content + n.tags.join(" ") + (n.ticker || "")).toLowerCase().includes(q) : false
  );
  const analyses = allAnalyses.filter((a) =>
    q ? (a.title + a.summary + a.content + a.tags.join(" ") + (a.ticker || "")).toLowerCase().includes(q) : false
  );

  const totalResults = news.length + analyses.length;
  const hasResults = totalResults > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center shadow-lg">
              <Search className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Suchergebnisse</h1>
              <p className="text-sm text-slate-500 mt-1">
                {q ? (
                  <>
                    {totalResults} {totalResults === 1 ? 'Ergebnis' : 'Ergebnisse'} für <span className="font-semibold text-slate-700">&quot;{params.q}&quot;</span>
                  </>
                ) : (
                  'Gib einen Suchbegriff ein'
                )}
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          {q && hasResults && (
            <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-slate-700">{analyses.length} Analysen</span>
              </div>
              <div className="h-4 w-px bg-slate-200" />
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-emerald-600" />
                <span className="text-sm font-medium text-slate-700">{news.length} News</span>
              </div>
            </div>
          )}
        </div>

        {/* No Query State */}
        {!q && (
          <Card className="p-16 text-center border-2 border-dashed border-slate-300 bg-slate-50/50">
            <Search className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-600 mb-2">Starte deine Suche</h3>
            <p className="text-sm text-slate-500">
              Nutze die Suchleiste oben, um Analysen, News und Insights zu finden
            </p>
          </Card>
        )}

        {/* No Results State */}
        {q && !hasResults && (
          <Card className="p-16 text-center bg-white border border-slate-200 shadow-sm">
            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <Search className="h-10 w-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Keine Ergebnisse gefunden</h3>
            <p className="text-slate-600 max-w-md mx-auto">
              Für <span className="font-semibold">&quot;{params.q}&quot;</span> wurden keine Treffer gefunden.
              Versuche es mit anderen Begriffen.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              <span className="text-xs text-slate-500">Beliebte Themen:</span>
              {["Tech", "KI", "Finanzen", "Marktanalyse"].map(topic => (
                <Link 
                  key={topic}
                  href={`/suche?q=${topic}`}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-full text-xs font-medium text-slate-700 transition-colors"
                >
                  {topic}
                </Link>
              ))}
            </div>
          </Card>
        )}

        {/* Results Grid */}
        {q && hasResults && (
          <div className="grid gap-8 lg:grid-cols-2">
            
            {/* Analyses Section */}
            {analyses.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-xl border border-blue-200">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-bold text-blue-900">Analysen</span>
                    <Badge className="ml-2 bg-blue-600 text-white text-xs">{analyses.length}</Badge>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {analyses.slice(0, 10).map((a) => (
                    <Link
                      key={a.id}
                      href={`/analysen/${a.slug}`}
                      className="group block"
                    >
                      <Card className="p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-none bg-white">
                        <div className="flex gap-4">
                          {/* Thumbnail */}
                          {a.imageUrl && (
                            <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                              <img 
                                src={a.imageUrl} 
                                alt={a.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          
                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-3">
                              <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                                {a.title}
                              </h3>
                              <ArrowRight className="h-5 w-5 text-blue-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all flex-shrink-0" />
                            </div>
                            
                            <p className="text-sm text-slate-600 mt-2 line-clamp-2">
                              {a.summary}
                            </p>
                            
                            <div className="flex items-center gap-3 mt-3">
                              {a.isPremium && (
                                <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs">
                                  <Sparkles className="h-3 w-3 mr-1" />
                                  Premium
                                </Badge>
                              )}
                              {a.ticker && (
                                <Badge className="bg-blue-100 text-blue-700 text-xs font-bold">
                                  {a.ticker}
                                </Badge>
                              )}
                              {a.category && (
                                <span className="text-xs text-slate-500">{a.category}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  ))}
                  
                  {analyses.length > 10 && (
                    <p className="text-sm text-slate-500 text-center py-4">
                      + {analyses.length - 10} weitere Analysen
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* News Section */}
            {news.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-xl border border-emerald-200">
                    <Calendar className="h-4 w-4 text-emerald-600" />
                    <span className="text-sm font-bold text-emerald-900">News</span>
                    <Badge className="ml-2 bg-emerald-600 text-white text-xs">{news.length}</Badge>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {news.slice(0, 10).map((n) => (
                    <Link
                      key={n.id}
                      href={`/news/${n.slug}`}
                      className="group block"
                    >
                      <Card className="p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-none bg-white">
                        <div className="flex gap-4">
                          {/* Thumbnail */}
                          {n.imageUrl && (
                            <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                              <img 
                                src={n.imageUrl} 
                                alt={n.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          
                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-3">
                              <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-2">
                                {n.title}
                              </h3>
                              <ArrowRight className="h-5 w-5 text-emerald-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all flex-shrink-0" />
                            </div>
                            
                            <p className="text-sm text-slate-600 mt-2 line-clamp-2">
                              {n.summary}
                            </p>
                            
                            <div className="flex items-center gap-3 mt-3">
                              {n.isPremium && (
                                <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs">
                                  <Sparkles className="h-3 w-3 mr-1" />
                                  Premium
                                </Badge>
                              )}
                              {n.category && (
                                <span className="text-xs text-slate-500">{n.category}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  ))}
                  
                  {news.length > 10 && (
                    <p className="text-sm text-slate-500 text-center py-4">
                      + {news.length - 10} weitere News
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer Hint */}
        {q && hasResults && (
          <div className="mt-12 p-6 bg-blue-50 rounded-2xl border border-blue-200">
            <p className="text-sm text-blue-800">
              💡 <strong>Tipp:</strong> Die Suche durchsucht Titel, Summary, Content, Tags und Ticker. 
              Für bessere Ergebnisse später: Supabase Full-Text Search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}