"use client";

import { Button } from "@/components/ui/Button";
import { Home, ArrowLeft, Search, TrendingUp, Sparkles } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        
        {/* Animated Background Blurs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-blue-500/10 blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-violet-500/10 blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative text-center space-y-8">
          
          {/* 404 Number - Big & Bold */}
          <div className="relative">
            <div className="text-[180px] md:text-[240px] font-black leading-none text-transparent bg-clip-text bg-gradient-to-br from-slate-200 to-slate-300 select-none">
              404
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl bg-gradient-to-br from-blue-600 to-violet-600 shadow-2xl shadow-blue-500/30 flex items-center justify-center transform hover:scale-110 transition-all">
                <Search className="h-16 w-16 md:h-20 md:h-20 text-white" />
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="space-y-4 -mt-12">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              Seite nicht gefunden
            </h1>
            <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-lg mx-auto">
              Die Seite die du suchst existiert nicht oder wurde verschoben. 
              Vielleicht findest du was du suchst auf unserer Startseite.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button 
              href="/"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
            >
              <Home className="h-5 w-5 mr-2" />
              Zur Startseite
            </Button>
            <Button 
              onClick={() => window.history.back()}
              variant="secondary"
              className="px-8 py-4 bg-white border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-sm"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Zurück
            </Button>
          </div>

          {/* Quick Links */}
          <div className="pt-12 border-t border-slate-200">
            <p className="text-sm font-semibold text-slate-500 mb-4">
              Oder schau dir diese Seiten an:
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link 
                href="/analysen"
                className="group flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all shadow-sm"
              >
                <TrendingUp className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-slate-700 group-hover:text-blue-700">Analysen</span>
              </Link>
              <Link 
                href="/news"
                className="group flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all shadow-sm"
              >
                <Sparkles className="h-4 w-4 text-emerald-600" />
                <span className="text-sm font-medium text-slate-700 group-hover:text-emerald-700">News</span>
              </Link>
              <Link 
                href="/premium"
                className="group flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-200 hover:border-violet-300 hover:bg-violet-50 transition-all shadow-sm"
              >
                <Sparkles className="h-4 w-4 text-violet-600" />
                <span className="text-sm font-medium text-slate-700 group-hover:text-violet-700">Premium</span>
              </Link>
              <Link 
                href="/suche"
                className="group flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all shadow-sm"
              >
                <Search className="h-4 w-4 text-slate-600" />
                <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">Suche</span>
              </Link>
            </div>
          </div>

          {/* Footer Badge */}
          <div className="pt-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm">
              <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-xs font-semibold text-slate-600">
                BeyondCharts · Fehlercode 404
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}