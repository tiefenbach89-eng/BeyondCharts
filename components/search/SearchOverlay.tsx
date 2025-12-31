"use client";

import React from "react";
import { X, Search } from "lucide-react";
import { useSearch } from "@/components/search/SearchProvider";
import { useRouter } from "next/navigation";

export function SearchOverlay() {
  const { open, setOpen, query, setQuery } = useSearch();
  const router = useRouter();

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
    setOpen(false);
    router.push(`/suche?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-black/30" onClick={() => setOpen(false)} />
      <div className="ff-container relative pt-24 md:pt-28">
        <div className="ff-card p-3 md:p-4">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 ff-muted" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Suche nach Themen, Assets, News…"
              className="w-full bg-transparent text-sm outline-none placeholder:text-[rgb(var(--muted))]"
              onKeyDown={(e) => {
                if (e.key === "Enter") submit(query);
              }}
            />
            <button
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[rgb(var(--border))] bg-white hover:bg-[rgb(var(--chip))] transition"
              onClick={() => setOpen(false)}
              aria-label="Schließen"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {["DAX", "Inflation", "ETFs", "EURUSD", "Earnings", "Renditekurve"].map((s) => (
              <button
                key={s}
                className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--chip))] px-3 py-1 text-xs hover:bg-white transition"
                onClick={() => submit(s)}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="mt-3 text-xs ff-muted">Tipp: Strg/⌘ + K</div>
        </div>
      </div>
    </div>
  );
}
