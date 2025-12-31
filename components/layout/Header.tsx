"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Search, User } from "lucide-react";
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
        "fixed inset-x-0 top-0 z-50 border-b border-slate-200 bg-white/85 backdrop-blur",
        isAdmin && "bg-white/70 border-slate-200/70"
      )}
    >
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between gap-3 px-4 md:h-20">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-4 group">
            <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center transition-transform group-hover:scale-105">
              <div className="h-5 w-1 bg-blue-500 rounded-full mr-0.5 animate-pulse" />
              <div className="h-3 w-1 bg-white rounded-full mr-0.5" />
              <div className="h-6 w-1 bg-blue-400 rounded-full" />
            </div>
            <div className="leading-tight">
              <div className="text-lg font-black tracking-tighter text-slate-900 uppercase">
                Beyond<span className="text-blue-600">Charts</span>
              </div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">
                Investieren verstehen
              </div>
            </div>
          </Link>

          <nav
            className={cn(
              "hidden lg:flex items-center gap-1 rounded-2xl p-1 border",
              isAdmin ? "bg-transparent border-slate-200/60" : "bg-slate-50 border-slate-100"
            )}
          >
            {nav.map((n) => {
              const active = pathname?.startsWith(n.href);
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  className={cn(
                    "rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wide transition",
                    active
                      ? isAdmin
                        ? "bg-white/70 text-slate-900 shadow-sm"
                        : "bg-white text-blue-600 shadow-sm"
                      : isAdmin
                        ? "text-slate-400 hover:text-slate-700"
                        : "text-slate-500 hover:text-slate-900"
                  )}
                >
                  {n.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {role !== "premium" && (
            <Link href="/premium" className="hidden sm:block">
              <Badge tone="premium">Premium</Badge>
            </Link>
          )}
          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition"
            onClick={() => setOpen(true)}
          >
            <Search className="h-4 w-4" />
          </button>
          <Button variant="secondary" href="/account" className="hidden sm:inline-flex">
            <User className="mr-2 h-4 w-4" /> Konto
          </Button>
        </div>
      </div>
    </header>
  );
}
