// app/news/[slug]/NewsView.tsx

'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Clock, Calendar, ChevronLeft, Share2, User,
  ExternalLink, TrendingUp, AlertCircle, CheckCircle,
  Zap, Shield, ArrowUpRight
} from "lucide-react";
import type { NewsItem, ImpactLevel } from "@/types/news";
import {
  calculateReadingTime,
  parseStructuredContent,
  isList,
  extractListItems,
  isHighlight,
  removeHighlightMarkers
} from "@/lib/contentParser";
import { formatDate } from "@/lib/date";
import { ContentProtection } from "@/components/auth/ContentProtection";

interface NewsViewProps {
  item: NewsItem;
}

export function NewsView({ item }: NewsViewProps) {
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

  const readingTime = calculateReadingTime(item.content || "");
  
  // Check if content is HTML or Markdown
  const isHtml = item.content && /<(h[1-6]|p|div|strong|em|ul|ol|li)[^>]*>/i.test(item.content);
  const { sections: contentSections } = !isHtml ? parseStructuredContent(item.content || "") : { sections: [] };

  return (
    <div className="bg-gradient-to-br from-slate-50 via-white to-emerald-50/20 min-h-screen antialiased">
      
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-slate-100/50 z-[60]">
        <div 
          className="h-full bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 transition-all duration-300"
          style={{ width: `${readProgress}%` }}
        />
      </div>

      {/* Floating Mini Nav - nur beim Scrollen */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'translate-y-0 opacity-100' 
          : '-translate-y-full opacity-0'
      } bg-white/90 backdrop-blur-2xl border-b border-slate-200/60 shadow-sm`}>
        <div className="max-w-5xl mx-auto px-8 h-16 flex justify-between items-center">
          <Link href="/news" className="group flex items-center gap-2 hover:gap-3 transition-all">
            <ChevronLeft size={16} className="text-slate-600 group-hover:text-emerald-600" />
            <span className="text-sm font-semibold text-slate-600 group-hover:text-slate-900">News</span>
          </Link>
          
          <div className="flex items-center gap-4">
            {/* Impact Badge REMOVED - überflüssig beim Scrollen */}
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

      <main className="max-w-5xl mx-auto px-8 pt-20 pb-24">
        
        {/* Back Button - Always visible */}
        <div className="mb-12">
          <Link href="/news" className="group inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span>Zurück zu News</span>
          </Link>
        </div>
        
        {/* Header - TITLE FIRST! */}
        <header className="mb-12">
          <div className="flex items-center gap-4 mb-8">
            <div className="px-4 py-2 bg-white/80 backdrop-blur-xl rounded-full border border-slate-200 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wide text-slate-700">
                {item.category}
              </span>
            </div>
            <div className="h-px flex-1 bg-gradient-to-r from-slate-300 via-slate-200 to-transparent" />
            <div className="flex items-center gap-6 text-xs font-medium text-slate-500">
              <span className="flex items-center gap-2">
                <Calendar size={13} /> 
                {formatDate(item.publishedAt || item.createdAt)}
              </span>
              <span className="flex items-center gap-2">
                <Clock size={13} /> 
                {readingTime} min
              </span>
            </div>
          </div>

          {/* 1. ÜBERSCHRIFT */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight text-slate-950 mb-12">
            {item.title}
          </h1>
        </header>

        {/* 2. BILD */}
        {item.imageUrl && (
          <div className="mb-12 -mx-8 md:mx-0 md:rounded-[32px] overflow-hidden shadow-2xl shadow-slate-900/10">
            <div className="relative aspect-[21/9] bg-slate-900">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
            </div>
            {item.imageSource && (
              <div className="px-6 py-3 bg-slate-50 border-t border-slate-200">
                <p className="text-xs text-slate-500 flex items-center gap-1.5">
                  <span>Bildquelle:</span>
                  <span className="font-medium text-slate-700">© {item.imageSource}</span>
                </p>
              </div>
            )}
          </div>
        )}

        {/* 3. ZUSAMMENFASSUNG */}
        <div className="mb-12">
          <p className="text-xl md:text-2xl text-slate-600 leading-relaxed max-w-4xl">
            {item.summary}
          </p>
        </div>

        {/* 4. META INFO */}
        <div className="flex flex-wrap items-center gap-6 pb-12 mb-12 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center shadow-lg">
              <User size={20} className="text-white" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Gepostet von</p>
              <p className="text-sm font-bold text-slate-900">{item.source || "BeyondCharts Team"}</p>
            </div>
          </div>

          {item.ticker && (
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-xl">
              <TrendingUp size={14} className="text-blue-600" />
              <span className="text-sm font-bold text-blue-700 font-mono">{item.ticker}</span>
            </div>
          )}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

          {/* Main Content */}
          <article className="lg:col-span-8">
            <ContentProtection
              title="Vollständigen Artikel freischalten"
              description="Registriere dich kostenlos, um diesen Artikel vollständig zu lesen und unbegrenzten Zugriff auf alle News und Analysen zu erhalten."
              preview={
                <div className="space-y-12 max-h-[600px] overflow-hidden">
                  {isHtml ? (
                    <div
                      className="prose prose-slate prose-lg max-w-none
                        prose-headings:font-bold prose-headings:tracking-tight
                        prose-h2:text-3xl prose-h2:mb-6 prose-h2:mt-12 prose-h2:pb-4
                        prose-h2:border-b-2 prose-h2:border-emerald-200
                        prose-h3:text-2xl prose-h3:mb-4 prose-h3:mt-8
                        prose-p:text-slate-700 prose-p:leading-[1.8] prose-p:mb-6 prose-p:text-lg
                        prose-strong:text-slate-950 prose-strong:font-bold
                        prose-em:text-slate-700 prose-em:italic
                        prose-ul:my-6 prose-ul:list-disc prose-ul:ml-6
                        prose-ol:my-6 prose-ol:list-decimal prose-ol:ml-6
                        prose-li:text-slate-700 prose-li:text-lg prose-li:leading-relaxed prose-li:my-2
                        prose-li:marker:text-emerald-600"
                      dangerouslySetInnerHTML={{ __html: item.content?.split('</p>').slice(0, 3).join('</p>') + '</p>' }}
                    />
                  ) : contentSections.length > 0 && contentSections[0] ? (
                    <section className="scroll-mt-32">
                      <div className="mb-6 pb-4 border-b-2 border-emerald-200">
                        <h2 className="text-3xl font-bold tracking-tight text-slate-950">
                          {contentSections[0].title}
                        </h2>
                      </div>
                      <div className="space-y-5">
                        {contentSections[0].paragraphs.slice(0, 3).map((paragraph, pIdx) => (
                          <p key={pIdx} className="text-lg text-slate-700 leading-[1.8]">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </section>
                  ) : (
                    <p className="text-slate-500 italic">No content available</p>
                  )}
                </div>
              }
            >
              <div className="space-y-12">
                {isHtml ? (
                  <div
                    className="prose prose-slate prose-lg max-w-none
                      prose-headings:font-bold prose-headings:tracking-tight
                      prose-h2:text-3xl prose-h2:mb-6 prose-h2:mt-12 prose-h2:pb-4
                      prose-h2:border-b-2 prose-h2:border-emerald-200
                      prose-h3:text-2xl prose-h3:mb-4 prose-h3:mt-8
                      prose-p:text-slate-700 prose-p:leading-[1.8] prose-p:mb-6 prose-p:text-lg
                      prose-strong:text-slate-950 prose-strong:font-bold
                      prose-em:text-slate-700 prose-em:italic
                      prose-ul:my-6 prose-ul:list-disc prose-ul:ml-6
                      prose-ol:my-6 prose-ol:list-decimal prose-ol:ml-6
                      prose-li:text-slate-700 prose-li:text-lg prose-li:leading-relaxed prose-li:my-2
                      prose-li:marker:text-emerald-600
                      prose-blockquote:border-l-4 prose-blockquote:border-emerald-600
                      prose-blockquote:bg-emerald-50/50 prose-blockquote:py-4 prose-blockquote:px-6
                      prose-blockquote:italic prose-blockquote:text-slate-800 prose-blockquote:my-6
                      prose-blockquote:rounded-r-xl
                      prose-img:rounded-2xl prose-img:shadow-lg prose-img:my-8
                      prose-a:text-emerald-600 prose-a:underline hover:prose-a:text-emerald-700
                      prose-hr:border-emerald-200 prose-hr:my-12
                      prose-code:bg-slate-100 prose-code:px-2 prose-code:py-1 prose-code:rounded
                      prose-code:text-slate-800 prose-code:text-base"
                    dangerouslySetInnerHTML={{ __html: item.content }}
                  />
                ) : contentSections.length > 0 ? (
                  contentSections.map((section, idx) => (
                    <section key={idx} className="scroll-mt-32">
                      {/* Section Header */}
                      <div className="mb-6 pb-4 border-b-2 border-emerald-200">
                        <h2 className="text-3xl font-bold tracking-tight text-slate-950">
                          {section.title}
                        </h2>
                      </div>

                      {/* Section Content */}
                      <div className="space-y-5">
                        {section.paragraphs.map((paragraph, pIdx) => {
                          if (isList(paragraph)) {
                            const items = extractListItems(paragraph);
                            return (
                              <ul key={pIdx} className="space-y-3 ml-1">
                                {items.map((listItem, iIdx) => (
                                  <li key={iIdx} className="text-lg text-slate-700 leading-relaxed flex gap-3 group">
                                    <span className="text-emerald-600 font-bold mt-1 group-hover:scale-125 transition-transform">•</span>
                                    <span>{listItem}</span>
                                  </li>
                                ))}
                              </ul>
                            );
                          }

                          if (isHighlight(paragraph)) {
                            const text = removeHighlightMarkers(paragraph);
                            return (
                              <div key={pIdx} className="relative">
                                <div className="absolute -inset-2 bg-emerald-100/50 rounded-2xl blur-sm" />
                                <div className="relative p-6 bg-gradient-to-br from-emerald-50 to-teal-50/50 border-l-4 border-emerald-600 rounded-r-2xl">
                                  <p className="text-lg text-slate-900 leading-relaxed font-semibold">
                                    {text}
                                  </p>
                                </div>
                              </div>
                            );
                          }

                          return (
                            <p key={pIdx} className="text-lg text-slate-700 leading-[1.8]">
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
            </ContentProtection>

            {/* Related Actions CTA */}
            <div className="mt-16 p-8 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 rounded-[32px] relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.15),transparent_50%)]" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp size={22} className="text-emerald-400" />
                  <h3 className="text-xl font-bold text-white">Bleib informiert</h3>
                </div>
                <p className="text-slate-300 text-base mb-6 leading-relaxed">
                  Verpasse keine wichtigen Markt-Updates und News mehr.
                </p>
                <Link 
                  href="/news"
                  className="inline-flex items-center gap-3 px-6 py-3 bg-white text-slate-900 rounded-2xl font-bold text-sm hover:bg-emerald-50 transition-all shadow-xl hover:shadow-2xl hover:scale-105 group"
                >
                  Alle News ansehen
                  <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </Link>
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-4">
            <div className="sticky top-32 space-y-6">
              
              {/* Impact Info Card - KOMPLETT NEU */}
              <div className="bg-white/90 backdrop-blur-xl rounded-[28px] p-6 border border-slate-200 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-md ${getImpactColors(item.impact).bgGradient}`}>
                    {getImpactIcon(item.impact)}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Markt-Impact</p>
                    <p className={`text-lg font-bold ${getImpactColors(item.impact).text}`}>
                      {item.impact === 'High' ? 'Hoch' : item.impact === 'Medium' ? 'Mittel' : 'Niedrig'}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {/* Quellentyp + Link kombiniert */}
                  <InfoBox 
                    label="Quellentyp" 
                    value={item.sourceType === "own" ? "Eigene Recherche" : "Externe Quelle"}
                    icon={item.sourceType === "own" ? <Shield size={14} className="text-emerald-600" /> : <ExternalLink size={14} className="text-blue-600" />}
                  />
                  
                  {/* Source URL als Button (nur bei external) */}
                  {item.sourceType === 'external' && item.sourceUrl && (
                    <a 
                      href={item.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between gap-2 px-4 py-3 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all group border border-blue-200"
                    >
                      <span className="text-sm font-semibold text-blue-800">Originalquelle öffnen</span>
                      <ArrowUpRight size={16} className="text-blue-700 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>
                  )}
                  
                  <InfoBox 
                    label="Kategorie" 
                    value={item.category}
                  />
                  <InfoBox 
                    label="Veröffentlicht" 
                    value={formatDate(item.publishedAt || item.createdAt)}
                    icon={<Calendar size={14} className="text-slate-500" />}
                  />
                  {/* STATUS ENTFERNT! */}
                </div>
              </div>

              {/* Tags */}
              {item.tags.length > 0 && (
                <div className="bg-white/70 backdrop-blur-sm rounded-[24px] p-5 border border-slate-200/60">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Related Topics</p>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag, i) => (
                      <span 
                        key={i}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                      >
                        #{tag}
                      </span>
                    ))}
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

function ImpactBadge({ level }: { level: ImpactLevel }) {
  const config = {
    Low: {
      bg: "bg-slate-100",
      text: "text-slate-700",
      border: "border-slate-200",
      icon: <AlertCircle size={12} />
    },
    Medium: {
      bg: "bg-blue-100",
      text: "text-blue-700",
      border: "border-blue-200",
      icon: <TrendingUp size={12} />
    },
    High: {
      bg: "bg-rose-100",
      text: "text-rose-700",
      border: "border-rose-200",
      icon: <Zap size={12} />
    }
  };

  const { bg, text, border, icon } = config[level];

  return (
    <div className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border ${bg} ${text} ${border}`}>
      {icon}
      <span className="text-xs font-bold">{level}</span>
    </div>
  );
}

function InfoBox({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="flex justify-between items-center py-2.5 border-b border-slate-100 last:border-0">
      <span className="text-xs font-medium text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
        {icon}
        {label}
      </span>
      <span className="text-sm font-bold text-slate-900">{value}</span>
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3 border border-slate-200/40 hover:shadow-md transition-shadow">
      <p className="text-xl font-bold text-slate-900 mb-0.5">{value}</p>
      <p className="text-xs font-medium text-slate-500">{label}</p>
    </div>
  );
}

/* Helper Functions */
function getImpactColors(level: ImpactLevel) {
  const colors = {
    Low: {
      bgGradient: "bg-gradient-to-br from-slate-600 to-slate-700",
      text: "text-slate-700"
    },
    Medium: {
      bgGradient: "bg-gradient-to-br from-blue-600 to-blue-700",
      text: "text-blue-700"
    },
    High: {
      bgGradient: "bg-gradient-to-br from-rose-600 to-rose-700",
      text: "text-rose-700"
    }
  };
  return colors[level];
}

function getImpactIcon(level: ImpactLevel) {
  const icons = {
    Low: <AlertCircle size={20} className="text-white" />,
    Medium: <TrendingUp size={20} className="text-white" />,
    High: <Zap size={20} className="text-white" />
  };
  return icons[level];
}