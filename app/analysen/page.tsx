import Link from "next/link";
import Image from "next/image";
import { listContent } from "@/lib/content.server";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { 
  ArrowRight, 
  Clock, 
  Target, 
  TrendingUp, 
  Sparkles,
  BarChart3,
  Filter
} from "lucide-react";
import { PremiumIcon } from "@/components/PremiumIcon";

export const dynamic = "force-dynamic";

export default async function AnalysenPage() {
  const items = await listContent("analyses");
  
  // Sortiere: Premium zuerst, dann nach Datum
  const premiumItems = items.filter((a) => a.isPremium);
  const regularItems = items.filter((a) => !a.isPremium);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      
      {/* Hero Header */}
      <div className="border-b border-slate-200 bg-white/50 backdrop-blur-sm">
        <div className="ff-container px-4 py-16 md:py-24">
          <div className="max-w-4xl">
            {/* Badges */}
            <div className="flex items-center gap-3 mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-blue-200 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-violet-500 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
                  Deep Research
                </span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight text-slate-950 mb-8">
              Analysen
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-slate-600 leading-relaxed max-w-3xl mb-10">
              Unternehmensmodelle <span className="font-semibold text-slate-900">verstehen</span> und Risiken <span className="font-semibold text-slate-900">objektiv</span> bewerten.
            </p>

            {/* Quick Stats */}
            <div className="flex flex-wrap items-center gap-6 text-sm">
              <div className="flex items-center gap-2 text-slate-600">
                <BarChart3 size={16} className="text-blue-600" />
                <span className="font-medium">{items.length} Analysen verfügbar</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Sparkles size={16} className="text-violet-600" />
                <span className="font-medium">{premiumItems.length} Premium Deep Dives</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Target size={16} className="text-emerald-600" />
                <span className="font-medium">Institutional Grade</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="ff-container px-4 py-16 space-y-16">
        
        {/* Premium Analyses Section */}
        {premiumItems.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center shadow-lg">
                <Sparkles size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-950">
                  Premium Deep Dives
                </h2>
                <p className="text-sm text-slate-500 font-medium">
                  Exklusive Analysen auf institutionellem Research-Niveau
                </p>
              </div>
            </div>

            {/* Premium Grid - Highlighted */}
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {premiumItems.map((a) => (
                <div key={a.id} className="relative group">
                  {/* Glow Effect für Premium */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-violet-600 to-blue-600 rounded-3xl opacity-20 group-hover:opacity-30 blur-xl transition-all" />
                  <Link
                    href={a.slug ? `/analysen/${a.slug}` : "/analysen"}
                    className="block h-full"
                  >
                    <Card className="relative h-full p-0 flex flex-col transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border-none ring-1 ring-blue-200 bg-white overflow-hidden">
                      
                      {/* IMAGE SECTION */}
                      <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900">
                        {a.imageUrl ? (
                          <Image
                            src={a.imageUrl}
                            alt={a.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-900 via-violet-900 to-slate-900">
                            <div className="text-center">
                              <Target size={32} className="text-white/20 mb-2 mx-auto" />
                              <span className="text-xs font-bold text-white/30 uppercase tracking-widest">
                                Premium Research
                              </span>
                            </div>
                          </div>
                        )}
                        
                        <div className="absolute right-3 top-3 z-10 drop-shadow-lg">
                          <PremiumIcon />
                        </div>
                      </div>

                      {/* CONTENT SECTION */}
                      <div className="flex flex-col flex-grow p-6 md:p-8">
                        <h3 className="text-xl font-bold leading-tight text-slate-950 group-hover:text-blue-600 transition-colors duration-300">
                          {a.title}
                        </h3>

                        <p className="mt-4 text-sm leading-relaxed text-slate-600 line-clamp-3 flex-grow">
                          {a.summary}
                        </p>

                        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                          <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                            <Clock className="h-3 w-3" />
                            {(a.publishedAt || a.createdAt).slice(0, 10)}
                          </div>
                          
                          <ArrowRight className="h-5 w-5 text-blue-600 transition-all duration-300 translate-x-[-4px] opacity-0 group-hover:opacity-100 group-hover:translate-x-0" />
                        </div>
                      </div>
                    </Card>
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Regular Analyses Section */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-700 flex items-center justify-center shadow-lg">
                <TrendingUp size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-950">
                  {premiumItems.length > 0 ? "Weitere Analysen" : "Alle Analysen"}
                </h2>
                <p className="text-sm text-slate-500 font-medium">
                  Fundierte Unternehmenseinschätzungen
                </p>
              </div>
            </div>

            {/* Filter Button (Optional) */}
            <button className="hidden md:flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all text-sm font-semibold text-slate-700">
              <Filter size={16} />
              Filter
            </button>
          </div>

          {/* Regular Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {regularItems.map((a) => (
              <Link
                key={a.id}
                href={a.slug ? `/analysen/${a.slug}` : "/analysen"}
                className="group block h-full"
              >
                <Card className="relative h-full p-0 flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-none ring-1 ring-slate-200 bg-white overflow-hidden">
                  
                  {/* IMAGE SECTION */}
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900">
                    {a.imageUrl ? (
                      <Image
                        src={a.imageUrl}
                        alt={a.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
                        <span className="text-xs font-bold text-white/10 uppercase tracking-widest">
                          Beyond Charts Insights
                        </span>
                      </div>
                    )}
                  </div>

                  {/* CONTENT SECTION */}
                  <div className="flex flex-col flex-grow p-6 md:p-8">
                    <h3 className="text-xl font-bold leading-tight text-slate-950 group-hover:text-blue-600 transition-colors duration-300">
                      {a.title}
                    </h3>

                    <p className="mt-4 text-sm leading-relaxed text-slate-500 line-clamp-3 flex-grow">
                      {a.summary}
                    </p>

                    <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                        <Clock className="h-3 w-3" />
                        {(a.publishedAt || a.createdAt).slice(0, 10)}
                      </div>
                      
                      <ArrowRight className="h-4 w-4 text-blue-600 transition-all duration-300 translate-x-[-4px] opacity-0 group-hover:opacity-100 group-hover:translate-x-0" />
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Empty State */}
        {items.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-slate-100 mb-6">
              <Target size={32} className="text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">
              Keine Analysen verfügbar
            </h3>
            <p className="text-slate-500 font-medium max-w-md mx-auto">
              Aktuell sind keine Analysen veröffentlicht. Wir arbeiten an neuen Deep Dives!
            </p>
          </div>
        )}

        {/* CTA Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl border border-slate-700">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.1),transparent_50%)]" />
          
          <div className="relative p-12 md:p-16 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6">
              <Sparkles size={14} className="text-blue-400" />
              <span className="text-xs font-bold text-blue-300 uppercase tracking-wider">
                Premium Zugang
              </span>
            </div>

            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Tiefere Einblicke benötigt?
            </h2>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Erhalte Zugang zu exklusiven Premium-Analysen mit detaillierten Finanzmodellen und Szenarien.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-white hover:bg-blue-50 text-slate-900 rounded-2xl font-bold text-sm transition-all shadow-xl hover:shadow-2xl hover:scale-105 flex items-center justify-center gap-2">
                Premium entdecken
                <ArrowRight size={18} />
              </button>
              <button className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-bold text-sm border border-white/20 transition-all">
                Mehr erfahren
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}