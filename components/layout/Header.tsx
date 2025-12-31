"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Search, User, Sparkles } from "lucide-react";
import { useSearch } from "@/components/search/SearchProvider";
import { useRole } from "@/components/role/RoleProvider";

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
  const { role } = useRole();

  const isAdmin = pathname?.startsWith("/admin");

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b bg-white/95 backdrop-blur-md shadow-sm",
        isAdmin ? "border-slate-200/70 bg-white/90" : "border-slate-200"
      )}
    >
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between gap-3 px-4 md:h-20">
        {/* Left Section - Logo & Nav */}
        <div className="flex items-center gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative h-10 w-10 rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg">
              {/* Animated bars */}
              <div className="absolute inset-0 flex items-center justify-center gap-0.5">
                <div className="h-5 w-1 bg-blue-500 rounded-full animate-pulse" />
                <div className="h-3 w-1 bg-white rounded-full opacity-90" />
                <div className="h-6 w-1 bg-blue-400 rounded-full" />
              </div>
            </div>
            <div className="hidden sm:block">
              <div className="text-lg font-bold text-slate-900 leading-none mb-1">
                Beyond<span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">Charts</span>
              </div>
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                Investieren verstehen
              </div>
            </div>
          </Link>

          {/* Navigation - Desktop */}
          <nav
            className={cn(
              "hidden lg:flex items-center gap-1 rounded-2xl p-1.5 shadow-sm",
              isAdmin 
                ? "bg-white/50 backdrop-blur-sm border border-slate-200/60" 
                : "bg-gradient-to-r from-slate-50 to-slate-100/50 border border-slate-200/50"
            )}
          >
            {nav.map((n) => {
              const active = pathname?.startsWith(n.href);
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  className={cn(
                    "relative rounded-xl px-4 py-2.5 text-xs font-semibold uppercase tracking-wide transition-all duration-200",
                    active
                      ? isAdmin
                        ? "bg-white text-slate-900 shadow-md"
                        : "bg-white text-blue-600 shadow-md"
                      : isAdmin
                        ? "text-slate-500 hover:text-slate-900 hover:bg-white/50"
                        : "text-slate-600 hover:text-slate-900 hover:bg-white/80"
                  )}
                >
                  {active && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-violet-500/5 rounded-xl" />
                  )}
                  <span className="relative">{n.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-2">
          {/* Premium Badge */}
          {role !== "premium" && (
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

          {/* Search Button */}
          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 hover:shadow-md"
            onClick={() => setOpen(true)}
            aria-label="Suche öffnen"
          >
            <Search className="h-4 w-4 text-slate-600" />
          </button>

          {/* Account Button */}
          <Link href="/account" className="hidden sm:block">
            <button className="inline-flex items-center gap-2 h-10 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 hover:shadow-md text-sm font-semibold text-slate-700">
              <User className="h-4 w-4" />
              <span>Konto</span>
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
}
