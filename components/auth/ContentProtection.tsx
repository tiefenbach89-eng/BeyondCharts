"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import { Lock, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

interface ContentProtectionProps {
  children: ReactNode;
  preview?: ReactNode;
  title?: string;
  description?: string;
}

export function ContentProtection({
  children,
  preview,
  title = "Premium Inhalte freischalten",
  description = "Registriere dich kostenlos, um den vollständigen Artikel zu lesen und Zugriff auf alle Funktionen zu erhalten."
}: ContentProtectionProps) {
  const { user } = useAuth();

  // If user is logged in, show full content
  if (user) {
    return <>{children}</>;
  }

  // If not logged in, show preview with login wall
  return (
    <div className="relative">
      {/* Preview Content (if provided) */}
      {preview && (
        <div className="relative">
          {preview}
          {/* Fade Overlay */}
          <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-white via-white/95 to-transparent pointer-events-none" />
        </div>
      )}

      {/* Login Wall - Glassmorphism Card */}
      <div className="relative -mt-32 mb-12">
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-violet-500/10 to-purple-500/10 rounded-3xl blur-3xl animate-pulse" />

        {/* Main Card */}
        <div className="relative bg-white/80 backdrop-blur-xl border-2 border-white/50 rounded-3xl shadow-2xl p-12 text-center max-w-2xl mx-auto">
          {/* Glow Effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-violet-600 to-purple-600 rounded-3xl opacity-20 blur-2xl" />

          {/* Content */}
          <div className="relative">
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 shadow-xl mb-6 animate-float">
              <Lock className="w-10 h-10 text-white" />
            </div>

            {/* Title */}
            <h3 className="text-3xl font-bold text-slate-900 mb-4 leading-tight">
              {title}
            </h3>

            {/* Description */}
            <p className="text-lg text-slate-600 mb-8 max-w-xl mx-auto leading-relaxed">
              {description}
            </p>

            {/* Benefits Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-violet-50/30 border border-blue-100/50">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center shadow-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-semibold text-slate-900">Alle Artikel</span>
                <span className="text-xs text-slate-600">Unbegrenzter Zugriff</span>
              </div>

              <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-gradient-to-br from-violet-50 to-purple-50/30 border border-violet-100/50">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600 to-violet-500 flex items-center justify-center shadow-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-semibold text-slate-900">Analysen</span>
                <span className="text-xs text-slate-600">Experten-Insights</span>
              </div>

              <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50/30 border border-purple-100/50">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-purple-500 flex items-center justify-center shadow-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-semibold text-slate-900">Watchlist</span>
                <span className="text-xs text-slate-600">Portfolio-Tracking</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <button className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 via-violet-600 to-purple-600 hover:from-blue-700 hover:via-violet-700 hover:to-purple-700 text-white font-bold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
                  <span>Kostenlos registrieren</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />

                  {/* Shine Effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                </button>
              </Link>

              <Link href="/login">
                <button className="px-8 py-4 bg-white hover:bg-slate-50 text-slate-900 font-semibold rounded-2xl border-2 border-slate-200 hover:border-slate-300 transition-all duration-300 hover:shadow-lg">
                  Bereits registriert? Anmelden
                </button>
              </Link>
            </div>

            {/* Trust Badge */}
            <p className="mt-8 text-sm text-slate-500">
              ✓ Kostenlos • ✓ Keine Kreditkarte erforderlich • ✓ Jederzeit kündbar
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
