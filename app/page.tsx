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
        
        <div className="relative ff-container px-4 py-20 md:py-32">
          <div className="grid gap-16 lg:grid-cols-12 lg:items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 order-2 lg:order-1">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-xl rounded-full border border-slate-200 shadow-sm mb-8">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-violet-500 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Institutional-Grade Research
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold tracking-[-0.04em] leading-[1.05] text-slate-950 mb-8">
                Hinter die Fassade
                <br />
                <span className="bg-gradient-to-r from-blue-600 via-violet-600 to-blue-600 bg-clip-text text-transparent">
                  der Märkte blicken
                </span>
              </h1>

              {/* Subheadline */}
              <p className="max-w-2xl text-xl md:text-2xl leading-relaxed text-slate-600 font-light mb-12">
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
                  {/* Glow Effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-violet-600 to-blue-600 rounded-[40px] opacity-20 group-hover:opacity-30 blur-xl transition-all" />
                  
                  {/* Card */}
                  <Card className="relative overflow-hidden border-none bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 md:p-10 shadow-2xl text-white transform hover:scale-[1.02] transition-all duration-500">
                    {/* Top Badge */}
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-widest">
                        <Sparkles className="h-4 w-4" />
                        Featured Analysis
                      </div>
                      {featuredAnalysis.isPremium && <PremiumIcon />}
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl md:text-3xl font-bold leading-tight text-white mb-8">
                      {featuredAnalysis.title}
                    </h2>

                    {/* Content Box */}
                    {featuredAnalysis.analysis?.businessModel && (
                      <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm mb-8">
                        <div className="text-xs font-bold text-blue-400 uppercase mb-3 tracking-wide">
                          Investment Thesis
                        </div>
                        <p className="text-sm text-slate-200 leading-relaxed line-clamp-3">
                          {featuredAnalysis.analysis.businessModel}
                        </p>
                      </div>
                    )}

                    {/* CTA */}
                    <Link
                      href={`/analysen/${featuredAnalysis.slug}`}
                      className="group/btn flex items-center justify-between w-full px-6 py-4 bg-white/10 hover:bg-white/20 rounded-2xl border border-white/20 transition-all"
                    >
                      <span className="text-sm font-bold text-white">Analyse öffnen</span>
                      <ArrowRight className="h-5 w-5 text-blue-400 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </Card>
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
      <section className="ff-container px-4 py-20 border-b border-slate-100">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { value: "500+", label: "Analysen" },
            { value: "12K+", label: "Leser" },
            { value: "95%", label: "Erfolgsquote" },
            { value: "24/7", label: "Updates" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-slate-950 mb-2">
                {stat.value}
              </div>
              <div className="text-sm font-medium text-slate-500">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* NEWS SECTION */}
      <section className="ff-container px-4 py-20 border-b border-slate-100">
        <HomeTopStories allNews={allNews} />
      </section>

      {/* ANALYSES SECTION */}
      <section className="ff-container px-4 py-20 border-b border-slate-100">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full mb-4">
              <Zap size={14} className="text-blue-600" />
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
                Deep Dives
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-950 mb-4">
              Aktuelle Analysen
            </h2>
            <p className="text-lg text-slate-600 font-light max-w-2xl">
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
        
        <div className="relative ff-container px-4 py-20 text-center">
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
      <section className="ff-container px-4 py-12 text-center">
        <div className="max-w-4xl mx-auto p-8 bg-slate-50 rounded-3xl border border-slate-200">
          <p className="text-xs leading-relaxed text-slate-500">
            <span className="font-bold text-slate-700 uppercase tracking-wider">Risikohinweis:</span>{" "}
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