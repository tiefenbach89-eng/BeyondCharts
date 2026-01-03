"use client";

import React from "react";
import { X, Search, TrendingUp, Clock, Sparkles, ArrowRight } from "lucide-react";
import { useSearch } from "@/components/search/SearchProvider";
import { useRouter } from "next/navigation";

export function SearchOverlay() {
  const { open, setOpen, query, setQuery } = useSearch();
  const router = useRouter();
  const [recentSearches, setRecentSearches] = React.useState<string[]>([]);

  // Load recent searches from localStorage
  React.useEffect(() => {
    if (open) {
      const stored = localStorage.getItem('beyondcharts_recent_searches');
      if (stored) {
        try {
          setRecentSearches(JSON.parse(stored));
        } catch {
          setRecentSearches([]);
        }
      }
    }
  }, [open]);

  // Keyboard shortcuts
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setOpen]);

  if (!open) return null;

  const submit = (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    
    // Save to recent searches
    const updated = [trimmed, ...recentSearches.filter(s => s !== trimmed)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('beyondcharts_recent_searches', JSON.stringify(updated));
    
    setOpen(false);
    setQuery('');
    router.push(`/suche?q=${encodeURIComponent(trimmed)}`);
  };

  const trendingSearches = [
    { term: "NVIDIA", icon: <TrendingUp className="h-3.5 w-3.5" />, color: "text-blue-600 bg-blue-50" },
    { term: "AI Aktien", icon: <Sparkles className="h-3.5 w-3.5" />, color: "text-violet-600 bg-violet-50" },
    { term: "ETFs", icon: <TrendingUp className="h-3.5 w-3.5" />, color: "text-emerald-600 bg-emerald-50" },
    { term: "Inflation", icon: <TrendingUp className="h-3.5 w-3.5" />, color: "text-orange-600 bg-orange-50" },
    { term: "DAX", icon: <TrendingUp className="h-3.5 w-3.5" />, color: "text-blue-600 bg-blue-50" },
    { term: "EUR/USD", icon: <TrendingUp className="h-3.5 w-3.5" />, color: "text-slate-600 bg-slate-50" },
  ];

  return (
    <div className="fixed inset-0 z-[60] animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
        onClick={() => setOpen(false)} 
      />
      
      {/* Content */}
      <div className="relative max-w-3xl mx-auto px-4 pt-20 md:pt-24">
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in slide-in-from-top-4 duration-300">
          
          {/* Search Input */}
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 flex-1">
                <Search className="h-5 w-5 text-slate-400 flex-shrink-0" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Suche nach Analysen, News, Ticker, Themen..."
                  className="w-full bg-transparent text-lg outline-none placeholder:text-slate-400 text-slate-900"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") submit(query);
                  }}
                />
              </div>
              
              <button
                className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors flex-shrink-0"
                onClick={() => setOpen(false)}
                aria-label="Schließen"
              >
                <X className="h-5 w-5 text-slate-600" />
              </button>
            </div>

            {/* Quick Action */}
            {query.trim() && (
              <button
                onClick={() => submit(query)}
                className="mt-4 w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-50 to-violet-50 hover:from-blue-100 hover:to-violet-100 rounded-xl border border-blue-200 transition-all group"
              >
                <span className="text-sm font-medium text-slate-700">
                  Suche nach <span className="font-bold text-blue-700">"{query.trim()}"</span>
                </span>
                <ArrowRight className="h-4 w-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
              </button>
            )}
          </div>

          {/* Recent Searches */}
          {recentSearches.length > 0 && !query && (
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="h-4 w-4 text-slate-400" />
                <h3 className="text-sm font-semibold text-slate-600">Letzte Suchen</h3>
              </div>
              <div className="space-y-2">
                {recentSearches.map((search, i) => (
                  <button
                    key={i}
                    onClick={() => submit(search)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all group"
                  >
                    <span className="text-sm font-medium text-slate-700">{search}</span>
                    <ArrowRight className="h-4 w-4 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Trending Searches */}
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-4 w-4 text-slate-400" />
              <h3 className="text-sm font-semibold text-slate-600">Beliebte Suchbegriffe</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {trendingSearches.map((item) => (
                <button
                  key={item.term}
                  className={`group inline-flex items-center gap-2 px-4 py-2 rounded-xl border transition-all hover:scale-105 hover:shadow-md ${item.color}`}
                  onClick={() => submit(item.term)}
                >
                  {item.icon}
                  <span className="text-sm font-semibold">{item.term}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-blue-50/50 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-4 text-slate-500">
                <div className="flex items-center gap-1.5">
                  <kbd className="px-2 py-1 bg-white rounded border border-slate-300 font-mono text-xs">↵</kbd>
                  <span>Suchen</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <kbd className="px-2 py-1 bg-white rounded border border-slate-300 font-mono text-xs">Esc</kbd>
                  <span>Schließen</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-slate-500">
                <kbd className="px-2 py-1 bg-white rounded border border-slate-300 font-mono text-xs">⌘</kbd>
                <kbd className="px-2 py-1 bg-white rounded border border-slate-300 font-mono text-xs">K</kbd>
                <span>Öffnen</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}