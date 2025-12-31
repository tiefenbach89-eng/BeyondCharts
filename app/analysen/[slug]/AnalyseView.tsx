// app/analysen/[slug]/AnalyseView.tsx

'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Target, Zap, BarChart3, ShieldAlert, Fingerprint, 
  Clock, Calendar, ChevronLeft, ArrowUpRight, Share2, 
  TrendingUp, Sparkles, Eye
} from "lucide-react";
import type { 
  Analyse, 
  MetricCardProps, 
  InfoRowProps, 
  StatBoxProps 
} from "@/types/analyse";
import { 
  calculateReadingTime, 
  parseStructuredContent,
  formatDate,
  isList,
  extractListItems,
  isHighlight,
  removeHighlightMarkers
} from "@/lib/contentParser";

interface AnalyseViewProps {
  item: Analyse;
}

export function AnalyseView({ item }: AnalyseViewProps) {
  const [scrolled, setScrolled] = useState(false);
  const [readProgress, setReadProgress] = useState(0);

  useEffect(() => {
    // Hide global header on mount
    const body = document.body;
    body.classList.add('immersive-reading');
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrollTop = window.scrollY;
      const progress = documentHeight > 0 ? (scrollTop / documentHeight) * 100 : 0;
      setReadProgress(progress);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      body.classList.remove('immersive-reading');
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Safe data extraction
  // Map analysis fields to snapshot for backwards compatibility
  const analysis = item.analysis || {};
  const snapshot = {
    thesis: analysis.overview || '',
    profitability: analysis.businessModel || '',
    substance: analysis.scenarios || '',
    risk: analysis.risks || '',
  };
  const readingTime = calculateReadingTime(item.content || "");
  
  // Check if content is HTML or Markdown
  const isHtml = item.content && /<(h[1-6]|p|div|strong|em|ul|ol|li)[^>]*>/i.test(item.content);
  const { sections: contentSections } = !isHtml ? parseStructuredContent(item.content || "") : { sections: [] };

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 min-h-screen antialiased">
      
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-slate-100/50 z-[60]">
        <div 
          className="h-full bg-gradient-to-r from-blue-600 via-violet-600 to-blue-600 transition-all duration-300"
          style={{ width: `${readProgress}%` }}
        />
      </div>

      {/* Floating Mini Nav - nur beim Scrollen */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'translate-y-0 opacity-100' 
          : '-translate-y-full opacity-0'
      } bg-white/90 backdrop-blur-2xl border-b border-slate-200/50 shadow-sm`}>
        <div className="max-w-7xl mx-auto px-8 h-16 flex justify-between items-center">
          <Link href="/analysen" className="group flex items-center gap-2 hover:gap-3 transition-all">
            <ChevronLeft size={16} className="text-slate-600 group-hover:text-blue-600" />
            <span className="text-sm font-semibold text-slate-600 group-hover:text-slate-900">Research</span>
          </Link>
          
          <div className="flex items-center gap-4">
            {item.ticker && (
              <span className="hidden md:inline-block text-xs font-bold text-blue-600 px-3 py-1 bg-blue-50 rounded-full">
                {item.ticker}
              </span>
            )}
            <button 
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: item.title,
                    text: item.summary,
                    url: window.location.href,
                  }).catch(() => {});
                } else {
                  navigator.clipboard.writeText(window.location.href);
                }
              }}
              className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 hover:scale-105 transition-all shadow-sm"
              aria-label="Share article"
            >
              <Share2 size={15} className="text-slate-600" />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-8 pt-20 pb-24">
        
        {/* Back Button - Always visible */}
        <div className="mb-12">
          <Link href="/analysen" className="group inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to Research</span>
          </Link>
        </div>

        {/* Hero Header */}
        <header className="mb-24">
          <div className="flex items-center gap-6 mb-12">
            <div className="flex items-center gap-3 px-4 py-2 bg-white/60 backdrop-blur-xl rounded-full border border-slate-200/50 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-violet-500 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wide text-slate-600">
                {item.category || "Institutional Research"}
              </span>
            </div>
            <div className="h-px flex-1 bg-gradient-to-r from-slate-300 via-slate-200 to-transparent" />
            <div className="flex items-center gap-6 text-xs font-medium text-slate-500">
              <span className="flex items-center gap-2">
                <Calendar size={14} className="text-slate-400" /> 
                {formatDate(item.publishedAt || item.createdAt)}
              </span>
              <span className="flex items-center gap-2">
                <Clock size={14} className="text-slate-400" /> 
                {readingTime} min
              </span>
            </div>
          </div>

          {/* Hero Image */}
          {item.imageUrl && (
            <div className="relative w-full aspect-[21/9] mb-12 rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <h1 className="text-6xl md:text-6xl lg:text-6xl font-bold tracking-tight leading-tight text-slate-950 mb-12 break-words">
            {item.title}
          </h1>

          <p className="text-2xl md:text-3xl text-slate-600/90 leading-[1.5] max-w-5xl break-words">
            {item.summary}
          </p>
        </header>

        {/* Premium Snapshot Cards */}
        {(snapshot.thesis || snapshot.profitability || snapshot.substance || snapshot.risk) && (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-32">
            <MetricCard 
              label="Investment Thesis" 
              value={snapshot.thesis} 
              icon={<Target size={22} />}
              gradient="from-blue-500 to-cyan-500"
            />
            <MetricCard 
              label="Key Catalyst" 
              value={snapshot.profitability} 
              icon={<Zap size={22} />}
              gradient="from-violet-500 to-purple-500"
            />
            <MetricCard 
              label="Fundamental Strength" 
              value={snapshot.substance} 
              icon={<BarChart3 size={22} />}
              gradient="from-emerald-500 to-teal-500"
            />
            <MetricCard 
              label="Risk Assessment" 
              value={snapshot.risk} 
              icon={<ShieldAlert size={22} />}
              gradient="from-rose-500 to-orange-500"
              isRisk
            />
          </section>
        )}

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          
          {/* Main Content */}
          <article className="lg:col-span-8">
            <div className="space-y-16">
              {isHtml ? (
                <div 
                  className="prose prose-slate prose-xl max-w-none
                    prose-headings:font-bold prose-headings:tracking-tight
                    prose-h2:text-4xl prose-h2:mb-8 prose-h2:mt-16 prose-h2:pb-6 
                    prose-h2:border-b-2 prose-h2:border-slate-200
                    prose-h3:text-3xl prose-h3:mb-6 prose-h3:mt-12
                    prose-p:text-slate-700 prose-p:leading-[1.85] prose-p:mb-8 prose-p:text-lg
                    prose-strong:text-slate-950 prose-strong:font-bold
                    prose-em:text-slate-700 prose-em:italic
                    prose-ul:my-8 prose-ul:list-disc prose-ul:ml-6
                    prose-ol:my-8 prose-ol:list-decimal prose-ol:ml-6
                    prose-li:text-slate-700 prose-li:text-lg prose-li:leading-relaxed prose-li:my-2
                    prose-blockquote:border-l-4 prose-blockquote:border-blue-500 
                    prose-blockquote:bg-blue-50/30 prose-blockquote:py-4 prose-blockquote:px-6
                    prose-blockquote:italic prose-blockquote:text-slate-800 prose-blockquote:my-8
                    prose-blockquote:rounded-r-xl
                    prose-img:rounded-2xl prose-img:shadow-xl prose-img:my-12
                    prose-a:text-blue-600 prose-a:underline hover:prose-a:text-blue-700
                    prose-hr:border-slate-300 prose-hr:my-16
                    prose-code:bg-slate-100 prose-code:px-2 prose-code:py-1 prose-code:rounded
                    prose-code:text-slate-800 prose-code:text-base"
                  dangerouslySetInnerHTML={{ __html: item.content }} 
                />
              ) : contentSections.length > 0 ? (
                contentSections.map((section, idx) => (
                  <section key={idx} className="scroll-mt-32">
                    {/* Section Header */}
                    <div className="mb-8 pb-6 border-b-2 border-slate-200">
                      <h2 className="text-4xl font-bold tracking-tight text-slate-950">
                        {section.title}
                      </h2>
                    </div>
                    
                    {/* Section Content */}
                    <div className="space-y-6">
                      {section.paragraphs.map((paragraph, pIdx) => {
                        if (isList(paragraph)) {
                          const items = extractListItems(paragraph);
                          
                          return (
                            <ul key={pIdx} className="space-y-3 ml-6">
                              {items.map((listItem, iIdx) => (
                                <li key={iIdx} className="text-lg text-slate-700 leading-relaxed flex gap-4">
                                  <span className="text-blue-600 font-bold mt-1.5">→</span>
                                  <span>{listItem}</span>
                                </li>
                              ))}
                            </ul>
                          );
                        }
                        
                        if (isHighlight(paragraph)) {
                          const text = removeHighlightMarkers(paragraph);
                          return (
                            <div key={pIdx} className="pl-6 border-l-4 border-blue-500 bg-blue-50/30 py-4 pr-6 rounded-r-xl">
                              <p className="text-lg text-slate-800 leading-relaxed font-medium italic">
                                {text}
                              </p>
                            </div>
                          );
                        }
                        
                        return (
                          <p key={pIdx} className="text-lg text-slate-700 leading-[1.85]">
                            {paragraph}
                          </p>
                        );
                      })}
                    </div>
                  </section>
                ))
              ) : (
                <p className="text-slate-500 italic">No content available</p>
              )}
            </div>

            {/* CTA Section */}
            {item.isPremium && (
              <div className="mt-20 p-10 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-[40px] relative overflow-hidden border border-slate-700/50">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.1),transparent_50%)]" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <Sparkles size={24} className="text-blue-400" />
                    <h3 className="text-2xl font-bold text-white">Deep Dive Available</h3>
                  </div>
                  <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                    Access our complete institutional report with detailed financial models, scenario analysis, and competitive intelligence.
                  </p>
                  <button className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-bold text-sm hover:bg-blue-50 transition-all flex items-center gap-3 group shadow-xl hover:shadow-2xl hover:scale-[1.02]">
                    Download Full Report
                    <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </button>
                </div>
              </div>
            )}
          </article>

          {/* Premium Sidebar */}
          <aside className="lg:col-span-4">
            <div className="sticky top-32 space-y-6">
              
              {/* Analyst Card */}
              <div className="bg-white/80 backdrop-blur-xl rounded-[32px] p-8 border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgb(0,0,0,0.08)] transition-all">
                <div className="flex items-center justify-between mb-8">
                  <div className="w-14 h-14 rounded-[20px] bg-gradient-to-br from-slate-900 to-slate-700 flex items-center justify-center shadow-lg shadow-slate-900/20">
                    <Fingerprint size={26} className="text-white" />
                  </div>
                  {item.auditStatus === "approved" && (
                    <div className="px-4 py-1.5 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-full text-xs font-bold">
                      VERIFIED
                    </div>
                  )}
                </div>
                
                <div className="space-y-5">
                  <InfoRow label="Lead Analyst" value={item.author || "Research Team"} />
                  <InfoRow label="Methodology" value="Fundamental Analysis" />
                  <InfoRow label="Rating" value="Institutional Grade" highlight />
                  <InfoRow label="Sector" value={item.category} />
                  {item.tags.length > 0 && (
                    <InfoRow label="Focus" value={item.tags.slice(0, 2).join(", ")} />
                  )}
                </div>
              </div>

              {/* Stats Card */}
              <div className="bg-gradient-to-br from-blue-50 via-white to-violet-50 rounded-[28px] p-6 border border-blue-100/60 backdrop-blur-xl">
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp size={20} className="text-blue-600" />
                  <span className="text-xs font-bold text-blue-900 uppercase tracking-wide">Analysis Metrics</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <StatBox label="Reading Time" value={`${readingTime}m`} />
                  <StatBox label="Status" value={item.isPremium ? "Premium" : "Free"} />
                </div>
              </div>

              {/* Premium Badge */}
              {item.isPremium && (
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-violet-600 rounded-[28px] opacity-20 group-hover:opacity-40 blur transition-all" />
                  <div className="relative bg-white rounded-[28px] p-6 border border-slate-200">
                    <div className="flex items-center gap-3">
                      <Eye size={18} className="text-slate-600" />
                      <div>
                        <p className="text-xs font-bold text-slate-600 mb-1">PREMIUM CONTENT</p>
                        <p className="text-sm text-slate-900 font-medium">Exclusive access required</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

/* =====================
   SUB-COMPONENTS
===================== */

function MetricCard({ label, value, icon, gradient, isRisk }: MetricCardProps) {
  if (!value) return null;
  
  return (
    <div className="group relative">
      <div className={`absolute -inset-0.5 bg-gradient-to-r ${gradient} rounded-[32px] opacity-0 group-hover:opacity-20 blur transition-all duration-500`} />
      <div className="relative h-full p-8 bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgb(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-300">
        <div className={`w-14 h-14 rounded-[20px] bg-gradient-to-br ${gradient} flex items-center justify-center mb-6 shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-3`}>
          <div className="text-white">{icon}</div>
        </div>
        <p className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-4">{label}</p>
        <p className="text-base font-semibold leading-snug text-slate-900">
          {value}
        </p>
      </div>
    </div>
  );
}

function InfoRow({ label, value, highlight }: InfoRowProps) {
  return (
    <div className="flex justify-between items-center py-3 border-b border-slate-100/80">
      <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</span>
      <span className={`text-sm font-bold ${highlight ? 'text-blue-600' : 'text-slate-900'}`}>
        {value}
      </span>
    </div>
  );
}

function StatBox({ label, value }: StatBoxProps) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-slate-200/40">
      <p className="text-2xl font-bold text-slate-900 mb-1">{value}</p>
      <p className="text-xs font-medium text-slate-500">{label}</p>
    </div>
  );
}