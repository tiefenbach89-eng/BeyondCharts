import { generateSlug as slugify } from "@/lib/slugGenerator";
import { supabaseServer } from "@/lib/supabase/server";

/* =====================
   TYPES
===================== */

export type ContentType = "news" | "analyses";
export type ContentStatus = "draft" | "published";
export type AuditStatus = "pending" | "approved";

export type BaseContent = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;

  imageUrl?: string;
  imageSource?: string;

  tags: string[];
  isPremium: boolean;
  status: ContentStatus;

  createdAt: string;
  updatedAt: string;
  publishedAt?: string;

  auditStatus: AuditStatus;
  auditNotes: string;
  auditedAt?: string;
};

export type NewsContent = BaseContent & {
  category: string;
  source: string;
  sourceUrl?: string;
  sourceType: "own" | "external";
  impact: "Low" | "Medium" | "High";
  ticker?: string;
};

export type AnalysisContent = BaseContent & {
  category: string;
  analysis: Record<string, any>;
  ticker?: string;
};

export type AnyContent = NewsContent | AnalysisContent;

type ListOptions = {
  includeDrafts?: boolean;
};

/* =====================
   HELPERS
===================== */

function nowIso() {
  return new Date().toISOString();
}

function nextId(prefix: string): string {
  // stable enough for admin CMS usage; stored as primary key
  return `${prefix}_${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

function normalizeBase(type: ContentType, it: any): AnyContent {
  const now = nowIso();
  const publishedAtIso =
    typeof it.publishedAt === "string" && it.publishedAt ? it.publishedAt : undefined;

  const base: BaseContent = {
    id: String(it.id || nextId(type)),
    slug: String(it.slug || slugify(String(it.title || ""))),
    title: String(it.title || ""),
    summary: String(it.summary || ""),
    content: String(it.content || ""),

    imageUrl: it.imageUrl || undefined,
    imageSource: it.imageSource || "",

    tags: Array.isArray(it.tags) ? it.tags.map(String) : [],
    isPremium: !!it.isPremium,

    status: it.status === "published" ? "published" : "draft",

    createdAt: it.createdAt || publishedAtIso || now,
    updatedAt: it.updatedAt || now,
    publishedAt: publishedAtIso,

    auditStatus: it.auditStatus === "approved" ? "approved" : "pending",
    auditNotes: it.auditNotes || "",
    auditedAt: it.auditedAt || undefined,
  };

  if (type === "news") {
    const news: NewsContent = {
      ...base,
      category: it.category || "News",
      source: it.source || "",
      sourceUrl: it.sourceUrl || "",
      sourceType: it.sourceType === "external" ? "external" : "own",
      impact: it.impact === "High" || it.impact === "Low" ? it.impact : "Medium",
      ticker: it.ticker || undefined,
    };
    return news;
  }

  const analysis: AnalysisContent = {
    ...base,
    category: it.category || "Analysen",
    analysis: typeof it.analysis === "object" && it.analysis !== null ? it.analysis : {},
    ticker: it.ticker || undefined,
  };
  return analysis;
}

function dbTable(type: ContentType) {
  return type === "news" ? "news" : "analyses";
}

function fromDb(type: ContentType, row: any): AnyContent {
  const base: any = {
    id: row.id,
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    content: row.content,
    imageUrl: row.image_url || undefined,
    imageSource: row.image_source || "",
    tags: Array.isArray(row.tags) ? row.tags : [],
    isPremium: !!row.is_premium,
    status: row.status === "published" ? "published" : "draft",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    publishedAt: row.published_at || undefined,
    auditStatus: row.audit_status === "approved" ? "approved" : "pending",
    auditNotes: row.audit_notes || "",
    auditedAt: row.audited_at || undefined,
  };

  if (type === "news") {
    return {
      ...base,
      category: row.category || "News",
      source: row.source || "",
      sourceUrl: row.source_url || "",
      sourceType: row.source_type === "external" ? "external" : "own",
      impact: row.impact === "High" || row.impact === "Low" ? row.impact : "Medium",
      ticker: row.ticker || undefined,
    } as NewsContent;
  }

  return {
    ...base,
    category: row.category || "Analysen",
    analysis: row.analysis || {},
    ticker: row.ticker || undefined,
  } as AnalysisContent;
}

function toDb(type: ContentType, item: AnyContent): any {
  const common = {
    id: item.id,
    slug: item.slug,
    title: item.title,
    summary: item.summary,
    content: item.content,
    image_url: item.imageUrl || null,
    image_source: item.imageSource || null,
    tags: item.tags || [],
    is_premium: !!item.isPremium,
    status: item.status,
    created_at: item.createdAt,
    updated_at: item.updatedAt,
    published_at: item.publishedAt || null,
    audit_status: item.auditStatus,
    audit_notes: item.auditNotes || "",
    audited_at: item.auditedAt || null,
    ticker: (item as any).ticker || null,
  };

  if (type === "news") {
    const n = item as NewsContent;
    return {
      ...common,
      category: n.category || "News",
      source: n.source || "",
      source_url: n.sourceUrl || null,
      source_type: n.sourceType || "own",
      impact: n.impact || "Medium",
    };
  }

  const a = item as AnalysisContent;
  return {
    ...common,
    category: a.category || "Analysen",
    analysis: a.analysis || {},
  };
}

/* =====================
   PUBLIC API (Supabase-backed)
===================== */

export async function listContent(
  type: ContentType,
  options: ListOptions = {}
): Promise<AnyContent[]> {
  const includeDrafts = options.includeDrafts ?? false;
  const supabase = supabaseServer();

  let query = supabase.from(dbTable(type)).select("*").order("created_at", { ascending: false });
  if (!includeDrafts) {
    query = query.eq("status", "published");
  }

  const { data, error } = await query;
  if (error) throw error;

  return (data || []).map((row) => fromDb(type, row));
}

export async function getBySlug(
  type: ContentType,
  slug: string
): Promise<AnyContent | null> {
  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from(dbTable(type))
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return fromDb(type, data);
}

export async function upsertContent(
  type: ContentType,
  input: Partial<AnyContent>
): Promise<AnyContent> {
  const normalized = normalizeBase(type, input);
  // enforce slug from title if missing
  normalized.slug = normalized.slug || slugify(normalized.title);

  // update timestamps
  normalized.updatedAt = nowIso();
  if (normalized.status === "published" && !normalized.publishedAt) {
    normalized.publishedAt = nowIso();
  }
  if (normalized.status !== "published") {
    normalized.publishedAt = undefined;
  }

  const supabase = supabaseServer();
  const payload = toDb(type, normalized);

  const { data, error } = await supabase
    .from(dbTable(type))
    .upsert(payload, { onConflict: "id" })
    .select("*")
    .single();

  if (error) throw error;

  return fromDb(type, data);
}

export async function deleteContent(type: ContentType, id: string): Promise<void> {
  const supabase = supabaseServer();
  const { error } = await supabase.from(dbTable(type)).delete().eq("id", id);
  if (error) throw error;
}
