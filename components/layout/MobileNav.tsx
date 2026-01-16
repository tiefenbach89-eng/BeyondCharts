"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { X, Menu, Sparkles, Shield, User, Home } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";

const nav = [
  { href: "/", label: "Home", icon: Home },
  { href: "/news", label: "News" },
  { href: "/analysen", label: "Analysen" },
  { href: "/maerkte", label: "Märkte" },
  { href: "/assets", label: "Assets" },
  { href: "/watchlist", label: "Watchlist" },
];

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { user, role, isPremium, isAdmin, loading } = useAuth();

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      {/* Hamburger Button - Only visible on mobile */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-all"
        aria-label="Menü öffnen"
      >
        {isOpen ? (
          <X className="h-5 w-5 text-slate-600" />
        ) : (
          <Menu className="h-5 w-5 text-slate-600" />
        )}
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu Panel */}
          <div className="fixed top-16 left-0 right-0 bottom-0 bg-white z-50 lg:hidden overflow-y-auto">
            <div className="p-6 space-y-6">

              {/* User Info Section */}
              {user && (
                <div className="pb-6 border-b border-slate-200">
                  <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-900">
                        {user.email || "Angemeldet"}
                      </p>
                      <p className="text-xs text-slate-600 capitalize">
                        {role}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Links */}
              <nav className="space-y-2">
                {nav.map((item) => {
                  const active = pathname === item.href || pathname?.startsWith(item.href + "/");
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all",
                        active
                          ? "bg-blue-50 text-blue-600 border border-blue-200"
                          : "text-slate-700 hover:bg-slate-50"
                      )}
                    >
                      {Icon && <Icon className="h-5 w-5" />}
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Quick Actions */}
              <div className="space-y-3 pt-6 border-t border-slate-200">

                {/* Premium Link */}
                {!isPremium && (
                  <Link
                    href="/premium"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 hover:border-amber-300 transition-all"
                  >
                    <Sparkles className="h-5 w-5 text-amber-600" />
                    <span className="font-semibold text-amber-700">
                      Premium upgraden
                    </span>
                  </Link>
                )}

                {/* Admin Link */}
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200 hover:border-violet-300 transition-all"
                  >
                    <Shield className="h-5 w-5 text-violet-600" />
                    <span className="font-semibold text-violet-700">
                      Admin Panel
                    </span>
                  </Link>
                )}

                {/* Account Link */}
                <Link
                  href="/konto"
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl border transition-all",
                    pathname === "/konto"
                      ? "bg-blue-50 text-blue-600 border-blue-200"
                      : "border-slate-200 hover:bg-slate-50"
                  )}
                >
                  <User className="h-5 w-5" />
                  <span className="font-semibold">
                    {user ? "Mein Konto" : "Anmelden / Registrieren"}
                  </span>
                </Link>
              </div>

              {/* Footer Info */}
              <div className="pt-6 border-t border-slate-200">
                <p className="text-xs text-slate-500 text-center">
                  BeyondCharts v3.4.0
                  <br />
                  © 2025 Alle Rechte vorbehalten
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
