"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useRole } from "@/components/role/RoleProvider";
import { Check, Lock } from "lucide-react";

export default function PremiumPage() {
  const { role, setRole, isPremium } = useRole();

  return (
    <div className="ff-container py-6 md:py-12">
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="premium">
          <Lock className="h-3.5 w-3.5" />
          Premium
        </Badge>
        <Badge tone="neutral">Trial · Subscription · Klar getrennt</Badge>
      </div>

      <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">
        Premium, das echten Produktwert liefert.
      </h1>
      <p className="mt-4 text-base ff-muted md:text-lg">
        Briefings, Deep-Dives, Watchlist-Mehrwert und personalisierte Relevanz. Kein Lärm, keine Tricks.
      </p>

      <div className="mt-7 grid gap-4 md:grid-cols-12 md:items-stretch">
        <Card className="p-5 md:p-7 md:col-span-7">
          <div className="text-sm font-semibold">Was du bekommst</div>
          <div className="mt-4 grid gap-3">
            {[
              "Vollzugriff auf Premium-News & Analysen",
              "Daily/Weekly Briefing (Phase 2 mit Realtime-Daten)",
              "Watchlist-Alerts & Trigger (Phase 2)",
              "Personalisierter Feed (Phase 2)",
              "Mehr Kontext: Treiber, Szenarien, Watchpoints",
            ].map((t) => (
              <div key={t} className="flex items-start gap-2">
                <div className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[rgba(var(--primary),0.14)] border border-[rgba(var(--primary),0.25)]">
                  <Check className="h-3.5 w-3.5" />
                </div>
                <div className="text-sm">{t}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5 md:p-7 md:col-span-5">
          <div className="text-sm font-semibold">Pricing (Demo)</div>
          <div className="mt-4 rounded-2xl border border-[rgb(var(--border))] bg-white p-4">
            <div className="text-xs ff-muted">Monatlich</div>
            <div className="mt-1 text-3xl font-semibold">9,99€</div>
            <div className="mt-1 text-xs ff-muted">inkl. 14 Tage Trial</div>
            <div className="mt-4 grid gap-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="ff-muted">Zugang</span>
                <span>Premium</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="ff-muted">Kündigung</span>
                <span>jederzeit</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="ff-muted">Abrechnung</span>
                <span>Stripe (später)</span>
              </div>
            </div>
          </div>

          <div className="mt-4 grid gap-2">
            {!isPremium ? (
              <>
                {role === "guest" && (
                  <Button variant="secondary" onClick={() => setRole("free")}>
                    Kostenlos registrieren (Demo)
                  </Button>
                )}
                <Button onClick={() => setRole("premium")}>Trial starten (Demo)</Button>
              </>
            ) : (
              <>
                <Button variant="secondary" onClick={() => setRole("free")}>
                  Auf Free zurücksetzen (Demo)
                </Button>
                <Button href="/news">Premium nutzen</Button>
              </>
            )}
            <div className="text-xs ff-muted">
              Lokal-Demo: Rollen werden in localStorage gespeichert. Supabase/Stripe folgt später.
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-8">
        <Card className="p-5 md:p-7">
          <div className="text-sm font-semibold">Free vs. Premium (klar)</div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl border border-[rgb(var(--border))] bg-white p-4">
              <div className="text-sm font-semibold">Free</div>
              <ul className="mt-2 list-disc pl-5 text-sm ff-muted">
                <li>Kuratierte Free-News</li>
                <li>Basis-Suche & Kategorien</li>
                <li>Watchlist (lokal), begrenzt</li>
                <li>Premium-Preview</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-[rgb(var(--border))] bg-white p-4">
              <div className="text-sm font-semibold">Premium</div>
              <ul className="mt-2 list-disc pl-5 text-sm ff-muted">
                <li>Vollzugriff auf Premium-Content</li>
                <li>Briefings & Deep-Dives</li>
                <li>Alerts & Personalisierung (Phase 2)</li>
                <li>Mehr Kontext & Tools</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
