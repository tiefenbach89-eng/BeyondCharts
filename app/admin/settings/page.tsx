"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

type Settings = {
  features: {
    auth: boolean;
    premium: boolean;
    premiumCTA: boolean;
    paywall: boolean;
  };
  legal: {
    requireSourceForExternalNews: boolean;
    showDisclaimer: boolean;
  };
};

const DEFAULT_SETTINGS: Settings = {
  features: { auth: false, premium: false, premiumCTA: false, paywall: false },
  legal: { requireSourceForExternalNews: true, showDisclaimer: true },
};

function Row({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-start justify-between gap-4 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4">
      <div className="min-w-0">
        <div className="font-semibold">{label}</div>
        <div className="mt-1 text-sm ff-muted">{description}</div>
      </div>
      <input
        type="checkbox"
        className="h-5 w-5 rounded-lg border border-[rgb(var(--border))] accent-[rgb(var(--primary))]"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
    </label>
  );
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/settings", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : DEFAULT_SETTINGS))
      .then((s) => setSettings(s || DEFAULT_SETTINGS))
      .catch(() => setSettings(DEFAULT_SETTINGS));
  }, []);

  async function save() {
    setSaving(true);
    try {
      await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(settings),
      });
      setToast("Gespeichert.");
      setTimeout(() => setToast(null), 2000);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="py-10">
      <header className="ff-container">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Badge>Einstellungen</Badge>
              <Badge tone="neutral">Admin</Badge>
            </div>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">Konfiguration</h1>
            <p className="mt-2 ff-muted max-w-2xl">
              Bewusst minimal: nur Schalter, die Produkt- und Rechts-Logik wirklich steuern.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/admin" className="ff-tap inline-flex items-center rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-4 py-2 text-sm font-medium">
              Zurück
            </Link>
            <Button onClick={save} disabled={saving}>
              {saving ? "Speichern…" : "Speichern"}
            </Button>
          </div>
        </div>
      </header>

      <div className="ff-container mt-8 grid gap-6 md:grid-cols-12">
        <div className="md:col-span-8 space-y-6">
          <Card className="p-4 md:p-6">
            <div className="text-sm font-semibold">Features</div>
            <div className="mt-4 space-y-3">
              <Row
                label="Premium aktivieren"
                description="Aktiviert Premium-Badges und Premium-Logik in der App. Wenn aus, verhalten sich Premium-Beiträge wie Free."
                checked={settings.features.premium}
                onChange={(v) =>
                  setSettings((p) => ({ ...p, features: { ...p.features, premium: v } }))
                }
              />

              <Row
                label="Paywall aktivieren"
                description="Wenn ein Beitrag als Premium markiert ist, sehen Nicht-Premium-User nur eine Vorschau."
                checked={settings.features.paywall}
                onChange={(v) =>
                  setSettings((p) => ({ ...p, features: { ...p.features, paywall: v } }))
                }
              />
            </div>
          </Card>

          <Card className="p-4 md:p-6">
            <div className="text-sm font-semibold">Recht & Compliance</div>
            <div className="mt-4 space-y-3">
              <Row
                label="Disclaimer anzeigen"
                description="Zeigt den Standard-Hinweis (keine Anlageberatung) in Detailseiten an."
                checked={settings.legal.showDisclaimer}
                onChange={(v) =>
                  setSettings((p) => ({ ...p, legal: { ...p.legal, showDisclaimer: v } }))
                }
              />

              <Row
                label="Quelle für externe News erzwingen"
                description="Blockiert Veröffentlichung externer News ohne Source + URL (rechtliche Nachvollziehbarkeit)."
                checked={settings.legal.requireSourceForExternalNews}
                onChange={(v) =>
                  setSettings((p) => ({ ...p, legal: { ...p.legal, requireSourceForExternalNews: v } }))
                }
              />
            </div>
          </Card>
        </div>

        <aside className="md:col-span-4">
          <Card className="p-4 md:p-6">
            <div className="text-sm font-semibold">Hinweise</div>
            <ul className="mt-3 space-y-2 text-sm ff-muted">
              <li>Keine Tracking- oder Cookie-Defaults. Keine externen Calls in der UI ohne explizite Integration.</li>
              <li>Premium ist nicht nur visuell: Inhalte werden für Nicht-Premium-User gekürzt.</li>
              <li>Supabase/Vercel: vorgesehen über ENV-basierte Integration, ohne Bruch der UI.</li>
            </ul>
          </Card>
        </aside>
      </div>

      {toast ? (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-[rgb(var(--text))] px-4 py-2 text-sm text-white shadow-card">
          {toast}
        </div>
      ) : null}
    </div>
  );
}
