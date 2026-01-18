"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Search, User, Sparkles, Shield } from "lucide-react";
import { useSearch } from "@/components/search/SearchProvider";
import { useAuth } from "@/components/auth/AuthProvider";
import { MobileNav } from "./MobileNav";

const nav = [
  { href: "/news", label: "News" },
  { href: "/analysen", label: "Analysen" },
  { href: "/maerkte", label: "Märkte" },
  { href: "/assets", label: "Assets" },
  { href: "/watchlist", label: "Watchlist" },
];

export function Header() {
  const pathname = usePathname();
  const { setOpen } = useSearch();
  const { user, role, isPremium, isAdmin, loading } = useAuth();

  const isAdminPage = pathname?.startsWith("/admin");

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b backdrop-blur-2xl shadow-lg transition-all duration-300",
        isAdminPage
          ? "border-slate-200/30 bg-white/70"
          : "border-white/20 bg-gradient-to-r from-white/80 via-white/70 to-white/80"
      )}
    >
      {/* Subtle animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-violet-500/5 to-purple-500/5 opacity-50 animate-shimmer"
           style={{ backgroundSize: '200% 100%' }} />

      <div className="relative max-w-7xl mx-auto flex h-16 items-center justify-between gap-3 px-4 md:h-20">
        {/* Left Section - Logo & Nav */}
        <div className="flex items-center gap-6">
          {/* Logo - Enhanced 3D Effect */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative h-12 w-12 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-xl group-hover:shadow-2xl">
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-violet-600 rounded-2xl opacity-0 group-hover:opacity-30 blur-lg transition-opacity duration-500" />

              {/* Animated bars */}
              <div className="absolute inset-0 flex items-center justify-center gap-0.5">
                <div className="h-5 w-1 bg-blue-500 rounded-full animate-pulse shadow-lg shadow-blue-500/50" />
                <div className="h-3 w-1 bg-white rounded-full opacity-90 shadow-lg" />
                <div className="h-6 w-1 bg-blue-400 rounded-full shadow-lg shadow-blue-400/50" />
              </div>
            </div>
            <div className="hidden sm:block">
              <div className="text-xl font-bold text-slate-900 leading-none mb-1 transition-all duration-300 group-hover:scale-105">
                Beyond<span className="bg-gradient-to-r from-blue-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">Charts</span>
              </div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Investieren verstehen
              </div>
            </div>
          </Link>

          {/* Navigation - Desktop - Revolutionary Glassmorphism */}
          <nav
            className={cn(
              "hidden lg:flex items-center gap-1.5 rounded-2xl p-2 backdrop-blur-xl shadow-xl border transition-all duration-300",
              isAdminPage
                ? "bg-white/60 border-white/40"
                : "bg-white/50 border-white/30"
            )}
          >
            {nav.map((n) => {
              const active = pathname?.startsWith(n.href);
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  className={cn(
                    "relative rounded-xl px-5 py-3 text-xs font-bold uppercase tracking-wider transition-all duration-300 group overflow-hidden",
                    active
                      ? "bg-gradient-to-r from-blue-600 via-violet-600 to-purple-600 text-white shadow-xl"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/80 hover:shadow-lg"
                  )}
                >
                  {/* Shimmer effect on active */}
                  {active && (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"
                           style={{ backgroundSize: '200% 100%' }} />
                      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-violet-600 to-purple-600 opacity-30 blur-xl" />
                    </>
                  )}

                  {/* Hover glow effect */}
                  {!active && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-violet-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                  )}

                  <span className="relative z-10">{n.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-2">
          {/* Mobile Navigation - Only visible on mobile */}
          <MobileNav />

          {/* Premium Badge - Hide if already premium */}
          {!isPremium && (
            <Link href="/premium" className="hidden sm:block">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-violet-600 rounded-xl opacity-20 group-hover:opacity-30 blur transition-opacity" />
                <Badge tone="premium" className="relative flex items-center gap-1.5 px-4 py-2">
                  <Sparkles className="h-3 w-3" />
                  <span className="font-semibold">Premium</span>
                </Badge>
              </div>
            </Link>
          )}

          {/* CMS Button - ONLY FOR ADMINS */}
          {isAdmin && (
            <Link href="/admin" className="hidden sm:block">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl opacity-20 group-hover:opacity-30 blur transition-opacity" />
                <button className="relative inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white transition-all duration-200 shadow-lg hover:shadow-xl text-sm font-semibold">
                  <Shield className="h-4 w-4" />
                  <span>CMS</span>
                </button>
              </div>
            </Link>
          )}

          {/* Search Button - Premium Glassmorphism */}
          <button
            className="relative inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/40 bg-white/60 backdrop-blur-xl hover:bg-white/80 hover:border-white/60 transition-all duration-300 hover:shadow-xl hover:scale-105 group overflow-hidden"
            onClick={() => setOpen(true)}
            aria-label="Suche öffnen"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-violet-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <Search className="h-4 w-4 text-slate-700 relative z-10 group-hover:scale-110 transition-transform duration-300" />
          </button>

          {/* Account Button - Shows dropdown when not logged in */}
          {user ? (
            <Link href="/konto" className="hidden sm:block">
              <button className="relative inline-flex items-center gap-2 h-11 px-5 rounded-xl border border-blue-300/50 bg-gradient-to-r from-blue-50/80 to-violet-50/80 backdrop-blur-xl hover:from-blue-100/80 hover:to-violet-100/80 text-blue-700 transition-all duration-300 hover:shadow-xl hover:scale-105 text-sm font-bold overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-violet-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <User className="h-4 w-4 relative z-10" />
                <span className="relative z-10">{loading ? '...' : role.charAt(0).toUpperCase() + role.slice(1)}</span>
              </button>
            </Link>
          ) : (
            <div className="hidden sm:block relative group">
              <button className="relative inline-flex items-center gap-2 h-11 px-5 rounded-xl border border-white/40 bg-white/60 backdrop-blur-xl hover:bg-white/80 hover:border-white/60 text-slate-700 transition-all duration-300 hover:shadow-xl hover:scale-105 text-sm font-bold overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-violet-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <User className="h-4 w-4 relative z-10" />
                <span className="relative z-10">Login</span>
              </button>

              {/* Dropdown on Hover - Premium Glassmorphism */}
              <div className="absolute right-0 top-full mt-3 w-52 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 group-hover:translate-y-0 translate-y-2">
                <div className="bg-white/90 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/50 py-2 overflow-hidden">
                  <Link href="/login" className="block px-5 py-3 text-sm text-slate-700 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-violet-50/50 transition-all duration-200 font-semibold">
                    Anmelden
                  </Link>
                  <Link href="/register" className="block px-5 py-3 text-sm text-slate-700 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-violet-50/50 transition-all duration-200 font-semibold">
                    Registrieren
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}