"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { AnalyseView as ContentDetailView } from "@/app/news/[slug]/AnalyseView";
import { AdminNav } from "@/components/admin/AdminNav";
import {
  LayoutDashboard,
  Save,
  Eye,
  Info,
  Lock,
  Pencil,
  Trash2,
  PlusCircle,
  Search,
  ArrowLeft,
  FileText,
  Newspaper,
  CheckCircle2,
  Image as ImageIcon,
} from "lucide-react";

// --- TYPEN ---
type ContentType = "news" | "analyses";
type ContentStatus = "draft" | "published";
type AuditStatus = "pending" | "approved";

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

type BaseItem = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;

  // Admin-UI Feldname:
  imageUrl?: string;
  imageSource?: string;

  tags: string[];
  isPremium: boolean;
  status: ContentStatus;

  createdAt: string;
  updatedAt: string;
  publishedAt?: string;

  auditStatus: AuditStatus;
  auditNotes?: string;
  auditedAt?: string;
};

type NewsItem = BaseItem & {
  category: string;
  source: string;
  sourceUrl?: string;
  sourceType: "own" | "external";
  impact: "Low" | "Medium" | "High";
};

type AnalysisItem = BaseItem & {
  category: string;
  analysis?: {
    overview?: string;
    businessModel?: string;
    risks?: string;
    scenarios?: string;
  };
};

type AnyItem = NewsItem | AnalysisItem;

// --- Helpers ---
function isoNow() {
  return new Date().toISOString();
}

function formatDateShort(iso?: string) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("de-DE");
  } catch {
    return String(iso).slice(0, 10);
  }
}

function isValidHttpUrl(maybeUrl: string) {
  try {
    const u = new URL(maybeUrl);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export default function AdminPage() {
  const [view, setView] = useState<"list" | "edit" | "preview">("list");
  const [type, setType] = useState<ContentType>("news");
  const [items, setItems] = useState<AnyItem[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    fetch("/api/admin/settings", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((s) => setSettings(s))
      .catch(() => setSettings(null));
  }, []);

  const emptyDraft = useMemo((): AnyItem => {
    const base: BaseItem = {
      id: "",
      slug: "",
      title: "",
      summary: "",
      content: "",
      imageUrl: "",
      imageSource: "",
      tags: [],
      isPremium: false,
      status: "draft",
      createdAt: isoNow(),
      updatedAt: isoNow(),
      auditStatus: "pending",
      auditNotes: "",
    };

    return type === "news"
      ? {
          ...base,
          category: "News",
          source: "",
          sourceUrl: "",
          sourceType: "own",
          impact: "Medium",
        }
      : {
          ...base,
          category: "Analysen",
          analysis: { overview: "", businessModel: "", risks: "", scenarios: "" },
        };
  }, [type]);

  const [form, setForm] = useState<AnyItem>(emptyDraft);

  useEffect(() => {
    if (activeId) return;
    setForm(emptyDraft);
  }, [type, activeId, emptyDraft]);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/${type}?includeDrafts=1`, { cache: "no-store" });
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return items;
    return items.filter((i) => {
      const hay = `${i.title} ${i.slug} ${i.summary} ${(i.tags || []).join(" ")}`.toLowerCase();
      return hay.includes(needle);
    });
  }, [items, q]);

  function startNew() {
    setActiveId(null);
    setForm(emptyDraft);
    setView("edit");
  }

  function editItem(item: AnyItem) {
    setActiveId(item.id);
    setForm(item);
    setView("edit");
  }

  async function removeItem(id: string) {
    if (!confirm("Beitrag wirklich löschen?")) return;
    setLoading(true);
    try {
      await fetch(`/api/admin/${type}?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      await load();
      setView("list");
    } finally {
      setLoading(false);
    }
  }

  function validateBeforePublish(): string | null {
    if (form.auditStatus !== "approved") return "Beitrag muss vor Veröffentlichung freigegeben werden.";

    if (type === "news") {
      const n = form as NewsItem;
      const require = settings?.legal?.requireSourceForExternalNews !== false;

      // Nur bei external News erzwingen.
      if (require && n.sourceType === "external") {
        if (!n.source?.trim()) return "Quelle ist erforderlich.";
        if (!n.sourceUrl?.trim()) return "Quellen-Link ist erforderlich.";
        if (!isValidHttpUrl(n.sourceUrl)) return "Quellen-Link ist ungültig.";
      }
    }

    // Analysen: keine Pflichtquelle
    return null;
  }

  async function save(nextStatus?: ContentStatus) {
    const targetStatus = nextStatus || form.status;

    if (targetStatus === "published") {
      const err = validateBeforePublish();
      if (err) {
        setToast(err);
        setTimeout(() => setToast(null), 3000);
        return;
      }
    }

    setLoading(true);
    try {
      const payload = {
        ...form,
        status: targetStatus,
        publishedAt: targetStatus === "published" ? form.publishedAt || isoNow() : undefined,
        updatedAt: isoNow(),
      };

      const res = await fetch(`/api/admin/${type}`, {
        method: payload.id ? "PUT" : "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });

      const saved = await res.json();
      setForm(saved);
      setActiveId(saved.id);
      await load();

      if (targetStatus === "draft") setView("list");

      setToast(targetStatus === "published" ? "Veröffentlicht." : "Gespeichert.");
    } finally {
      setLoading(false);
      setTimeout(() => setToast(null), 2200);
    }
  }

  const kindLabel = type === "news" ? "News" : "Analyse";
  const KindIcon = type === "news" ? Newspaper : FileText;

  return (
    <div className="bg-[rgb(var(--bg))] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4">
        <section className="bg-[rgb(var(--card))] rounded-3xl border border-[rgb(var(--border))] shadow-sm overflow-hidden">
          <header className="px-6 py-6 border-b border-slate-100">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center">
                  <LayoutDashboard className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900">
                    {view === "list" ? "Editor Console" : `Beitrag: ${form.title || "Neu"}`}
                  </h1>
                  <p className="text-[10px] uppercase tracking-widest font-black text-slate-400">
                    BeyondCharts Admin · {kindLabel}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap justify-end">
                {view !== "list" && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setView("list")}
                      className="min-h-[44px] border-slate-200 text-slate-600 hover:text-slate-900"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" /> Schließen
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setView(view === "preview" ? "edit" : "preview")}
                      className="min-h-[44px] flex items-center gap-2 border-slate-200"
                    >
                      {view === "preview" ? (
                        <>
                          <Pencil className="h-4 w-4" /> Editor
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4" /> Vorschau
                        </>
                      )}
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => save("draft")}
                      className="min-h-[44px] border-slate-200 bg-white shadow-sm"
                      disabled={loading}
                    >
                      <Save className="h-4 w-4 mr-2" /> Entwurf
                    </Button>

                    <Button
                      size="sm"
                      onClick={() => save("published")}
                      className="min-h-[44px] bg-blue-600 hover:bg-blue-700 shadow-md flex items-center gap-2 text-white px-6 font-bold"
                      disabled={loading}
                    >
                      <CheckCircle2 className="h-4 w-4" /> Veröffentlichen
                    </Button>
                  </>
                )}
              </div>
            </div>

            <AdminNav />
          </header>

          <main className="p-6">
            {toast && (
              <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[110] bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-bottom-4 font-bold text-sm">
                {toast}
              </div>
            )}

            {/* LIST */}
            {view === "list" && (
              <div className="space-y-6 animate-in fade-in duration-500 max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">Deine Inhalte</h2>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setType("news")}
                        className={
                          "min-h-[44px] px-4 py-2 rounded-xl text-[10px] uppercase tracking-widest font-black border transition-colors " +
                          (type === "news"
                            ? "bg-slate-900 text-white border-slate-900 shadow-md"
                            : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50")
                        }
                      >
                        News
                      </button>
                      <button
                        onClick={() => setType("analyses")}
                        className={
                          "min-h-[44px] px-4 py-2 rounded-xl text-[10px] uppercase tracking-widest font-black border transition-colors " +
                          (type === "analyses"
                            ? "bg-slate-900 text-white border-slate-900 shadow-md"
                            : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50")
                        }
                      >
                        Analysen
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative w-full md:w-72">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        className="min-h-[44px] w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/10 shadow-sm"
                        placeholder="Suchen..."
                      />
                    </div>

                    <Button onClick={startNew} size="sm" className="min-h-[44px] flex items-center gap-2">
                      <PlusCircle className="h-4 w-4" />
                      Neu erstellen
                    </Button>
                  </div>
                </div>

                <Card className="border-slate-200 overflow-hidden shadow-sm rounded-2xl">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                      <tr>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          Beitrag / Details
                        </th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          Status
                        </th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                          Aktionen
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {filtered.map((post) => (
                        <tr key={post.id} className="group hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <KindIcon className="h-4 w-4 text-slate-400" />
                              <div className="flex min-w-0 flex-wrap items-center gap-2">
                                <div className="min-w-0 truncate font-semibold">{post.title}</div>
                                {post.isPremium ? <Badge tone="premium" className="text-xs">Premium</Badge> : null}
                                {post.auditStatus !== "approved" ? (
                                  <Badge tone="warning" className="text-xs">Audit</Badge>
                                ) : null}
                              </div>
                            </div>

                            <div className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-tighter">
                              {formatDateShort(post.publishedAt || post.createdAt)} • {kindLabel} • /{type}/{post.slug}
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <Badge
                              className={
                                post.status === "published"
                                  ? "bg-emerald-600 text-white border-none font-bold"
                                  : "bg-white border-slate-200 text-slate-400 font-bold"
                              }
                            >
                              {post.status.toUpperCase()}
                            </Badge>
                          </td>

                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-1">
                              <button
                                onClick={() => editItem(post)}
                                className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                aria-label="Bearbeiten"
                              >
                                <Pencil className="h-4 w-4" />
                              </button>

                              <button
                                onClick={() => removeItem(post.id)}
                                className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                aria-label="Löschen"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Card>
              </div>
            )}

            {/* EDIT */}
            {view === "edit" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-bottom-4 duration-500 pb-10">
                <div className="lg:col-span-2 space-y-6">
                  <Card className="p-6 md:p-10 border-slate-200 shadow-sm rounded-3xl bg-white">
                    <div className="space-y-8">
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 block">
                          Headline
                        </label>
                        <input
                          value={form.title}
                          onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                          className="w-full text-3xl md:text-4xl font-bold text-slate-900 border-none p-0 focus:ring-0 placeholder:text-slate-200"
                          placeholder={`Titel der ${kindLabel}...`}
                        />
                      </div>

                      <div className="pt-8 border-t border-slate-100">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 block">
                          Summary
                        </label>
                        <textarea
                          value={form.summary}
                          onChange={(e) => setForm((p) => ({ ...p, summary: e.target.value }))}
                          className="w-full h-28 border-none p-0 focus:ring-0 text-base text-slate-600 resize-none leading-relaxed font-sans"
                          placeholder="Kurzfazit / Teaser..."
                        />
                      </div>

                      <div className="pt-8 border-t border-slate-100">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 block">
                          Inhalt (Markdown)
                        </label>
                        <textarea
                          value={form.content}
                          onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
                          className="w-full h-[520px] border-none p-0 focus:ring-0 text-lg text-slate-600 resize-none leading-relaxed font-sans"
                          placeholder="Schreibe hier..."
                        />
                      </div>
                    </div>
                  </Card>
                </div>

                <div className="space-y-6">
                  <Card className="p-6 border-slate-200 shadow-sm sticky top-24 rounded-3xl bg-white">
                    <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2 text-sm uppercase tracking-tight">
                      <Info className="h-4 w-4 text-blue-500" /> Meta & Media
                    </h3>

                    <div className="space-y-5">
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">
                            Bild / Chart URL
                          </label>
                          <div className="relative">
                            <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                            <input
                              value={form.imageUrl || ""}
                              onChange={(e) => setForm((p) => ({ ...p, imageUrl: e.target.value }))}
                              className="min-h-[44px] w-full pl-10 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/10 transition-all"
                              placeholder="https://..."
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">
                            Bildquelle / Copyright
                          </label>
                          <input
                            value={form.imageSource || ""}
                            onChange={(e) => setForm((p) => ({ ...p, imageSource: e.target.value }))}
                            className="min-h-[44px] w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500/10 transition-all"
                            placeholder="z.B. Getty Images / BeyondCharts"
                          />
                        </div>

                        {form.imageUrl ? (
                          <div className="mt-2 rounded-xl overflow-hidden border border-slate-200 aspect-video relative bg-slate-100 shadow-inner">
                            <img src={form.imageUrl} className="w-full h-full object-cover" alt="Preview" />
                            <div className="absolute bottom-1 right-1 bg-black/50 text-[8px] text-white px-1.5 py-0.5 rounded backdrop-blur-sm">
                              © {form.imageSource || "Keine Quelle"}
                            </div>
                          </div>
                        ) : null}
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Slug</label>
                        <input
                          value={form.slug}
                          onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
                          className="min-h-[44px] w-full p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none font-mono text-blue-600"
                          placeholder="z.B. fed-zinsen"
                        />
                      </div>

                      {type === "news" ? (
                        <div className="space-y-4 pt-4 border-t border-slate-100">
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Quelle</label>
                            <input
                              value={(form as NewsItem).source || ""}
                              onChange={(e) => setForm((p: any) => ({ ...p, source: e.target.value }))}
                              className="min-h-[44px] w-full p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none"
                              placeholder="z.B. Reuters"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Quellen-URL</label>
                            <input
                              value={(form as NewsItem).sourceUrl || ""}
                              onChange={(e) => setForm((p: any) => ({ ...p, sourceUrl: e.target.value }))}
                              className="min-h-[44px] w-full p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none"
                              placeholder="https://..."
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="pt-4 border-t border-slate-100 space-y-3">
                          <label className="text-[10px] font-bold text-blue-600 uppercase mb-2 block tracking-tighter italic">
                            Deep Dive Metriken
                          </label>
                          <textarea
                            value={(form as AnalysisItem).analysis?.overview || ""}
                            onChange={(e) =>
                              setForm((p: any) => ({ ...p, analysis: { ...p.analysis, overview: e.target.value } }))
                            }
                            className="w-full min-h-[72px] p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:bg-white transition-colors"
                            placeholder="Überblick / Einordnung"
                          />
                          <textarea
                            value={(form as AnalysisItem).analysis?.businessModel || ""}
                            onChange={(e) =>
                              setForm((p: any) => ({
                                ...p,
                                analysis: { ...p.analysis, businessModel: e.target.value },
                              }))
                            }
                            className="w-full min-h-[72px] p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:bg-white transition-colors"
                            placeholder="Geschäftsmodell"
                          />
                          <textarea
                            value={(form as AnalysisItem).analysis?.risks || ""}
                            onChange={(e) =>
                              setForm((p: any) => ({ ...p, analysis: { ...p.analysis, risks: e.target.value } }))
                            }
                            className="w-full min-h-[72px] p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:bg-white transition-colors"
                            placeholder="Risiken"
                          />
                          <textarea
                            value={(form as AnalysisItem).analysis?.scenarios || ""}
                            onChange={(e) =>
                              setForm((p: any) => ({ ...p, analysis: { ...p.analysis, scenarios: e.target.value } }))
                            }
                            className="w-full min-h-[72px] p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:bg-white transition-colors"
                            placeholder="Szenarien"
                          />
                        </div>
                      )}

                      <div className="pt-4 border-t border-slate-100">
                        <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block tracking-widest">
                          Status / Audit
                        </label>
                        <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
                          <button
                            onClick={() => setForm((p: any) => ({ ...p, auditStatus: "pending" }))}
                            className={
                              "min-h-[44px] flex-1 px-3 rounded-lg text-[10px] font-black border uppercase transition-all " +
                              (form.auditStatus !== "approved"
                                ? "bg-white text-slate-900 border-slate-200 shadow-sm"
                                : "bg-transparent text-slate-400 border-transparent")
                            }
                          >
                            Pending
                          </button>
                          <button
                            onClick={() => setForm((p: any) => ({ ...p, auditStatus: "approved", auditedAt: isoNow() }))}
                            className={
                              "min-h-[44px] flex-1 px-3 rounded-lg text-[10px] font-black border uppercase transition-all " +
                              (form.auditStatus === "approved"
                                ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                                : "bg-transparent text-slate-400 border-transparent")
                            }
                          >
                            Approved
                          </button>
                        </div>
                      </div>

                      <div className="pt-4">
                        <label
                          className={
                            "flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer " +
                            (form.isPremium
                              ? "bg-[rgba(var(--premium),0.06)] border-[rgba(var(--premium),0.25)]"
                              : "bg-[rgb(var(--chip))] border-[rgb(var(--border))] hover:opacity-95")
                          }
                        >
                          <div className="flex items-center gap-3">
                            <Lock
                              className={
                                "h-4 w-4 " +
                                (form.isPremium ? "text-[rgb(var(--premium))]" : "text-[rgb(var(--muted))]")
                              }
                            />
                            <span className="text-sm font-semibold">Premium Beitrag</span>
                          </div>
                          <input
                            type="checkbox"
                            checked={form.isPremium}
                            onChange={(e) => setForm((p) => ({ ...p, isPremium: e.target.checked }))}
                            className="h-5 w-5 rounded-lg border border-[rgb(var(--border))] accent-[rgb(var(--premium))]"
                          />
                        </label>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            )}

            {/* PREVIEW */}
            {view === "preview" && (
              <div className="fixed inset-0 z-50">
                <div className="absolute inset-0 bg-black/40" onClick={() => setView("edit")} />
                <div className="absolute inset-0 overflow-auto">
                  <div className="fixed top-4 right-4 z-10">
                    <Button variant="secondary" size="sm" className="min-h-[44px]" onClick={() => setView("edit")}>
                      Schließen
                    </Button>
                  </div>

                  <ContentDetailView
                    kind={type}
                    settings={settings || DEFAULT_SETTINGS}
                    item={{
                      title: form.title || "Ohne Titel",
                      summary: form.summary || "",
                      content: form.content || "",
                      category: (form as any).category,
                      tags: Array.isArray(form.tags) ? form.tags : [],
                      isPremium: Boolean(form.isPremium),

                      // Preview nutzt imageUrl, API mappt später zu image
                      imageUrl: form.imageUrl || undefined,
                      imageSource: form.imageSource || undefined,

                      publishedAt: form.publishedAt || undefined,
                      createdAt: form.createdAt || undefined,
                      source: type === "news" ? (form as NewsItem).source : undefined,
                      sourceUrl: type === "news" ? (form as NewsItem).sourceUrl : undefined,
                      impact: type === "news" ? (form as NewsItem).impact : undefined,
                    }}
                    extraFull={
                      type === "analyses" ? (
                        <div className="space-y-4">
                          <h2 className="text-xl font-semibold">Deep Dive</h2>
                          <div className="grid gap-4">
                            {(form as AnalysisItem).analysis?.overview ? (
                              <Card className="p-4 md:p-5">
                                <div className="text-xs font-semibold uppercase tracking-widest ff-muted">Überblick</div>
                                <p className="mt-2 text-sm leading-relaxed">{(form as AnalysisItem).analysis?.overview}</p>
                              </Card>
                            ) : null}
                            {(form as AnalysisItem).analysis?.businessModel ? (
                              <Card className="p-4 md:p-5">
                                <div className="text-xs font-semibold uppercase tracking-widest ff-muted">
                                  Geschäftsmodell
                                </div>
                                <p className="mt-2 text-sm leading-relaxed">
                                  {(form as AnalysisItem).analysis?.businessModel}
                                </p>
                              </Card>
                            ) : null}
                            {(form as AnalysisItem).analysis?.risks ? (
                              <Card className="p-4 md:p-5">
                                <div className="text-xs font-semibold uppercase tracking-widest ff-muted">Risiken</div>
                                <p className="mt-2 text-sm leading-relaxed">{(form as AnalysisItem).analysis?.risks}</p>
                              </Card>
                            ) : null}
                            {(form as AnalysisItem).analysis?.scenarios ? (
                              <Card className="p-4 md:p-5">
                                <div className="text-xs font-semibold uppercase tracking-widest ff-muted">
                                  Szenarien
                                </div>
                                <p className="mt-2 text-sm leading-relaxed whitespace-pre-wrap">
                                  {(form as AnalysisItem).analysis?.scenarios}
                                </p>
                              </Card>
                            ) : null}
                          </div>
                        </div>
                      ) : null
                    }
                  />
                </div>
              </div>
            )}
          </main>
        </section>
      </div>
    </div>
  );
}
