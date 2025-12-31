import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { listContent } from "@/lib/content.server";
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
} from "lucide-react";
import { HomeTopStories } from "@/components/home/HomeTopStories";
import { PremiumIcon } from "@/components/PremiumIcon";
import { AnalysesGrid } from "@/components/home/AnalysesGrid";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const allNews = await listContent("news");
  const allAnalyses = await listContent("analyses");
  const featuredAnalysis = allAnalyses.find((a: any) => a.isPremium) || allAnalyses[0];

  return (
    <div className="min-h-screen">
      
      {/* HERO SECTION - Full Width Background */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 border-b border-slate-200">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.05),transparent_50%)]" />
        
        <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-32">
          <div className="grid gap-16 lg:grid-cols-12 lg:items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 order-2 lg:order-1">
              {/* Main Headline */}
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
                    <Card className="relative border-none bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 shadow-2xl text-white transform hover:scale-[1.02] transition-all duration-500">
                      
                      {/* Image Header - Upper Third */}
                      {featuredAnalysis.imageUrl && (
                        <div className="relative h-44 md:h-52 -mx-8 -mt-8 md:-mx-10 md:-mt-10">
                          <img
                            src={featuredAnalysis.imageUrl}
                            alt={featuredAnalysis.title}
                            className="w-full h-full object-cover"
                          />
                          {/* Smooth gradient fade - eliminates hard cut */}
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/40 to-slate-900" />
                          
                          {/* Badges on Image */}
                          <div className="absolute top-4 right-4 flex items-center gap-2">
                            {featuredAnalysis.ticker && (
                              <div className="px-3 py-1.5 bg-slate-900/90 backdrop-blur-sm border border-white/20 rounded-lg shadow-lg">
                                <span className="text-xs font-bold text-white">
                                  {featuredAnalysis.ticker}
                                </span>
                              </div>
                            )}
                            {featuredAnalysis.isPremium && <PremiumIcon />}
                          </div>
                        </div>
                      )}

                    <div className="p-8 md:p-10">
                      {/* Top Bar - "ANALYSE" Badge */}
                      <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 border border-blue-400/30 rounded-full">
                          <Sparkles className="h-3.5 w-3.5 text-blue-400" />
                          <span className="text-xs font-bold text-blue-300 uppercase tracking-wide">
                            Analyse
                          </span>
                        </div>
                        
                        {/* Show ticker/premium only if no image */}
                        {!featuredAnalysis.imageUrl && (
                          <div className="flex items-center gap-2">
                            {featuredAnalysis.ticker && (
                              <div className="px-3 py-1.5 bg-white/10 border border-white/20 rounded-lg">
                                <span className="text-xs font-bold text-white">
                                  {featuredAnalysis.ticker}
                                </span>
                              </div>
                            )}
                            {featuredAnalysis.isPremium && <PremiumIcon />}
                          </div>
                        )}
                      </div>

                      {/* Title */}
                      <h2 className="text-xl md:text-2xl font-bold leading-tight text-white mb-5 line-clamp-2 break-words">
                        {featuredAnalysis.title}
                      </h2>

                      {/* Summary (instead of thesis) */}
                      {featuredAnalysis.summary && (
                        <p className="text-sm text-slate-300 leading-relaxed mb-5 line-clamp-3">
                          {featuredAnalysis.summary}
                        </p>
                      )}

                      {/* Meta Footer */}
                      {(featuredAnalysis.category || featuredAnalysis.content) && (
                        <div className="flex items-center gap-2 mb-5 text-xs text-slate-400">
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
                </div> {/* End of overflow wrapper */}
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

      {/* STATS SECTION */}
      <section className="max-w-7xl mx-auto px-4 py-20">
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
              icon: (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              )
            },
            { 
              value: "95%", 
              label: "Erfolgsquote",
              gradient: "from-emerald-600 to-teal-600",
              icon: (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )
            },
            { 
              value: "24/7", 
              label: "Updates",
              gradient: "from-amber-600 to-orange-600",
              icon: (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              )
            },
          ].map((stat, i) => (
            <div key={i} className="group relative">
              {/* Subtle glow effect */}
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

      {/* NEWS SECTION */}
      <section className="max-w-7xl mx-auto px-4 px-4 py-20 border-b border-slate-100">
        <HomeTopStories allNews={allNews} />
      </section>

      {/* ANALYSES SECTION */}
      <section className="max-w-7xl mx-auto px-4 px-4 py-20 border-b border-slate-100">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full mb-4">
              <Zap size={14} className="text-blue-600" />
              <span className="text-xs font-semibold text-blue-700 uppercase tracking-wide">
                Deep Dives
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-950 mb-4">
              Aktuelle Analysen
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl">
              Unternehmen verstehen, statt nur den Kurs zu raten.
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
      <section className="max-w-7xl mx-auto px-4 px-4 py-12 text-center">
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