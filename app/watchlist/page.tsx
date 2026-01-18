'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRole, useAuth } from "@/components/auth/AuthProvider";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ContentProtection } from "@/components/auth/ContentProtection";

const STORAGE_KEY = "ff_watchlist";

type Item = {
  ticker: string;
  note?: string;
};

export default function WatchlistPage() {
  const { role, setRole, isPremium } = useRole();

  const [items, setItems] = useState<Item[]>([]);
  const [ticker, setTicker] = useState("");

  /* -------------------------------------------------------------------------- */
  /* Load from localStorage                                                      */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setItems(JSON.parse(raw));
      } else {
        // Default demo items
        setItems([{ ticker: "DAX" }, { ticker: "MSFT" }]);
      }
    } catch (error) {
      console.error("Watchlist localStorage error:", error);
      setItems([{ ticker: "DAX" }, { ticker: "MSFT" }]);
    }
  }, []);

  /* -------------------------------------------------------------------------- */
  /* Helpers                                                                     */
  /* -------------------------------------------------------------------------- */

  const persist = useCallback((next: Item[]) => {
    setItems(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (error) {
      console.error("Watchlist save error:", error);
    }
  }, []);

  const add = useCallback(() => {
    const t = ticker.trim().toUpperCase();
    if (!t) return;
    if (items.some((i) => i.ticker === t)) return;

    persist([{ ticker: t }, ...items]);
    setTicker("");
  }, [ticker, items, persist]);

  const remove = useCallback(
    (t: string) => {
      persist(items.filter((x) => x.ticker !== t));
    },
    [items, persist]
  );

  /* -------------------------------------------------------------------------- */
  /* Render                                                                      */
  /* -------------------------------------------------------------------------- */

  return (
    <div className="ff-container py-6 md:py-10">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Badge>Watchlist</Badge>
            <Badge tone="neutral">
              {role === "guest" ? "Gast" : role === "free" ? "Free" : "Premium"}
            </Badge>
          </div>

          <h1 className="mt-3 text-2xl font-semibold md:text-3xl">
            Watchlist
          </h1>

          <p className="mt-1 text-sm ff-muted">
            Lokal gespeichert. Später via Supabase + Alerts (Premium).
          </p>
        </div>

        {role === "guest" ? (
          <Button onClick={() => setRole("free")} variant="secondary">
            Kostenlos registrieren (Demo)
          </Button>
        ) : (
          <Button href="/premium" variant={isPremium ? "secondary" : "primary"}>
            {isPremium ? "Premium aktiv" : "Premium testen"}
          </Button>
        )}
      </div>

      <ContentProtection
        title="Watchlist-Funktion freischalten"
        description="Registriere dich kostenlos, um deine persönliche Watchlist zu erstellen und Assets zu verfolgen."
        preview={
          <div className="mt-6 grid gap-4 md:grid-cols-12">
            <div className="md:col-span-8">
              <Card className="p-4 md:p-5 opacity-50 pointer-events-none">
                <div className="text-sm font-semibold">Assets hinzufügen</div>
                <div className="mt-3 flex gap-2">
                  <input
                    disabled
                    placeholder="Ticker/ISIN (z. B. DAX, MSFT, EUNL)"
                    className="w-full rounded-xl border border-[rgb(var(--border))] bg-white px-3 py-2 text-sm outline-none"
                  />
                  <Button disabled>Add</Button>
                </div>
              </Card>

              <div className="mt-4 grid gap-3">
                <Card className="p-4 md:p-5 opacity-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold">DAX</div>
                      <div className="mt-1 text-xs ff-muted">Beispiel Asset</div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        }
      >
        <div className="mt-6 grid gap-4 md:grid-cols-12">
          {/* ------------------------------------------------------------------ */}
          {/* Watchlist                                                           */}
          {/* ------------------------------------------------------------------ */}
          <div className="md:col-span-8">
            <Card className="p-4 md:p-5">
              <div className="text-sm font-semibold">Assets hinzufügen</div>

              <div className="mt-3 flex gap-2">
                <input
                  value={ticker}
                  onChange={(e) => setTicker(e.target.value)}
                  placeholder="Ticker/ISIN (z. B. DAX, MSFT, EUNL)"
                  className="w-full rounded-xl border border-[rgb(var(--border))] bg-white px-3 py-2 text-sm outline-none"
                  onKeyDown={(e) => e.key === "Enter" && add()}
                />
                <Button onClick={add}>Add</Button>
              </div>
            </Card>

            <div className="mt-4 grid gap-3">
              {items.map((i) => (
                <Card key={i.ticker} className="p-4 md:p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold">
                        {i.ticker}
                      </div>
                      <div className="mt-1 text-xs ff-muted">
                        News-Cluster & Alerts in Phase 2.
                      </div>
                    </div>

                    <button
                      className="text-sm ff-muted hover:text-[rgb(var(--text))]"
                      onClick={() => remove(i.ticker)}
                    >
                      Entfernen
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* ------------------------------------------------------------------ */}
          {/* Premium Preview                                                     */}
          {/* ------------------------------------------------------------------ */}
          <div className="md:col-span-4">
            <Card className="p-4 md:p-5">
              <div className="text-sm font-semibold">
                Premium Alerts (Preview)
              </div>

              <p className="mt-2 text-sm ff-muted">
                Preisbewegungen, Earnings, Makro-Events, Breaking-News — alles
                auf deine Watchlist.
              </p>

              <div className="mt-4 rounded-2xl border border-[rgb(var(--border))] bg-white p-3">
                <div className="text-xs ff-muted">Beispiel</div>
                <div className="mt-1 text-sm font-medium">
                  MSFT · Earnings in 7 Tagen
                </div>
                <div className="mt-1 text-xs ff-muted">
                  Push/Email (Phase 2)
                </div>
              </div>
            </Card>
          </div>
        </div>
      </ContentProtection>
    </div>
  );
}
