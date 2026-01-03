<<<<<<< HEAD
import { slugify } from "@/lib/slug";
import { supabaseServer } from "@/lib/supabase/server";
=======
import fs from "node:fs/promises";
import path from "node:path";
import { slugify } from "@/lib/slug";
>>>>>>> 1ad3d42fee7245012111a3a2033405f598854555

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

<<<<<<< HEAD
  imageUrl?: string;
=======
  /** Admin / Editor Source */
  imageUrl?: string;

  /** Public alias for Landing / Cards */
  image?: string;

  /** optional but recommended for legal traceability */
>>>>>>> 1ad3d42fee7245012111a3a2033405f598854555
  imageSource?: string;

  tags: string[];
  isPremium: boolean;
<<<<<<< HEAD

=======
>>>>>>> 1ad3d42fee7245012111a3a2033405f598854555
  status: ContentStatus;

  createdAt: string;
  updatedAt: string;
  publishedAt?: string;

  auditStatus: AuditStatus;
<<<<<<< HEAD
  auditNotes: string;
  auditedAt?: string;
};

export type NewsContent = BaseContent & {
=======
  auditNotes?: string;
  auditedAt?: string;
};

export type NewsItem = BaseContent & {
>>>>>>> 1ad3d42fee7245012111a3a2033405f598854555
  category: string;
  source: string;
  sourceUrl?: string;
  sourceType: "own" | "external";
  impact: "Low" | "Medium" | "High";
<<<<<<< HEAD
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
=======
};

export type AnalysisDeepDive = {
  overview?: string;
  businessModel?: string;
  risks?: string;
  scenarios?: string;
};

export type AnalysisItem = BaseContent & {
  category: string;
  analysis?: AnalysisDeepDive;
};

export type ContentMap = {
  news: NewsItem;
  analyses: AnalysisItem;
};

/* =====================
   FILE HELPERS
===================== */

const DATA_DIR = path.join(process.cwd(), "data");

function fileFor(type: ContentType): string {
  return path.join(DATA_DIR, type === "news" ? "news.json" : "analyses.json");
}

async function readJson<T>(filePath: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/* =====================
   WRITE LOCK
===================== */

let writeLock = false;

async function writeJsonSafe<T>(filePath: string, data: T): Promise<void> {
  while (writeLock) {
    await new Promise((r) => setTimeout(r, 10));
  }
  writeLock = true;
  try {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(
      filePath,
      JSON.stringify(data, null, 2) + "\n",
      "utf-8"
    );
  } finally {
    writeLock = false;
  }
}

/* =====================
   SLUG UNIQUENESS
===================== */

function ensureUniqueSlug(slug: string, items: BaseContent[]): string {
  let next = slug;
  let i = 1;
  while (items.some((it) => it.slug === next)) {
    next = `${slug}-${i++}`;
  }
  return next;
}

/* =====================
   NORMALIZATION
===================== */

function normalizeLegacy<T extends Record<string, any>>(
  type: ContentType,
  items: T[]
): Array<ContentMap[typeof type]> {
  const now = new Date().toISOString();

  return (items as any[]).map((it) => {
    const publishedAtIso = it.publishedAt
      ? new Date(it.publishedAt).toISOString()
      : undefined;

    const imageUrl =
      typeof it.imageUrl === "string" && it.imageUrl.trim()
        ? it.imageUrl.trim()
        : undefined;

    return {
      ...it,

      /** Admin source */
      imageUrl,

      /** Public alias (Landing, Cards, Hero) */
      image: imageUrl,

      imageSource:
        typeof it.imageSource === "string" ? it.imageSource : undefined,

      slug: it.slug || slugify(it.title || ""),
      tags: Array.isArray(it.tags) ? it.tags : [],
      isPremium: Boolean(it.isPremium),

      status:
        (it.status as ContentStatus) ||
        (publishedAtIso ? "published" : "draft"),

      createdAt: it.createdAt || publishedAtIso || now,
      updatedAt: it.updatedAt || now,
      publishedAt: publishedAtIso,

      auditStatus: it.auditStatus === "approved" ? "approved" : "pending",
      auditNotes: it.auditNotes || "",
      auditedAt: it.auditedAt,

      ...(type === "news"
        ? {
            category: it.category || "News",
            source: it.source || "",
            sourceUrl: it.sourceUrl || "",
            sourceType: it.sourceType === "external" ? "external" : "own",
            impact: it.impact || "Medium",
          }
        : {
            category: it.category || "Analysen",
            analysis:
              typeof it.analysis === "object" && it.analysis !== null
                ? it.analysis
                : {},
          }),
    };
  });
}

/* =====================
   PUBLIC API
===================== */

export async function listContent<T extends ContentType>(
  type: T,
  opts?: { includeDrafts?: boolean }
): Promise<Array<ContentMap[T]>> {
  const raw = await readJson<any[]>(fileFor(type), []);
  const normalized = normalizeLegacy(type, raw) as Array<ContentMap[T]>;

  const filtered = opts?.includeDrafts
    ? normalized
    : normalized.filter((i) => i.status === "published");

  return filtered.sort(
    (a, b) =>
      new Date(b.publishedAt || b.updatedAt).getTime() -
      new Date(a.publishedAt || a.updatedAt).getTime()
  );
}

export async function getBySlug<T extends ContentType>(
  type: T,
  slug: string
): Promise<ContentMap[T] | null> {
  const items = await listContent(type, { includeDrafts: true });
  return items.find((i) => i.slug === slug) || null;
}

/* =====================
   UPSERT (B2 FINAL)
===================== */

export async function upsertContent<T extends ContentType>(
  type: T,
  input: Partial<ContentMap[T]> &
    Pick<ContentMap[T], "title" | "summary" | "content"> & { id?: string }
): Promise<ContentMap[T]> {
  const filePath = fileFor(type);
  const raw = await readJson<any[]>(filePath, []);
  const items = normalizeLegacy(type, raw) as Array<ContentMap[T]>;
  const now = new Date().toISOString();

  const id = input.id || nextId(type === "news" ? "n" : "a");
  const existing = items.find((i) => i.id === id);

  const isAlreadyPublished = existing?.status === "published";

  const slug = isAlreadyPublished
    ? existing.slug
    : ensureUniqueSlug(
        input.slug?.trim() || slugify(input.title),
        items
      );

  const base: any = {
    id: existing?.id || id,
    slug,
    title: input.title,
    summary: input.summary,
    content: input.content,

    imageUrl:
      typeof input.imageUrl === "string" && input.imageUrl.trim()
        ? input.imageUrl.trim()
        : undefined,

    imageSource:
      typeof (input as any).imageSource === "string"
        ? (input as any).imageSource.trim()
        : undefined,

    tags: Array.isArray(input.tags) ? input.tags : [],
    isPremium: Boolean(input.isPremium),
    status: (input.status as ContentStatus) || "draft",

    createdAt: existing?.createdAt || now,
    updatedAt: now,

    publishedAt:
      input.status === "published"
        ? existing?.publishedAt || input.publishedAt || now
        : existing?.publishedAt,

    auditStatus: input.auditStatus === "approved" ? "approved" : "pending",
    auditNotes: input.auditNotes || "",
    auditedAt:
      input.auditStatus === "approved"
        ? existing?.auditedAt || now
        : existing?.auditedAt,
  };

  if (type === "news") {
    base.category = (input as any).category || "News";
    base.sourceType =
      (input as any).sourceType === "external" ? "external" : "own";
    base.source = (input as any).source || "";
    base.sourceUrl = (input as any).sourceUrl || "";
    base.impact = (input as any).impact || "Medium";
  } else {
    base.category = (input as any).category || "Analysen";
    base.analysis =
      typeof (input as any).analysis === "object"
        ? (input as any).analysis
        : {};
  }

  const next = existing
    ? items.map((i) => (i.id === id ? { ...i, ...base } : i))
    : [base, ...items];

  await writeJsonSafe(filePath, next);
  return next.find((i) => i.id === id)!;
}

function nextId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 7)}`;
}

export async function deleteContent(
  type: ContentType,
  id: string
): Promise<void> {
  const raw = await readJson<any[]>(fileFor(type), []);
  const items = normalizeLegacy(type, raw);
  await writeJsonSafe(
    fileFor(type),
    items.filter((i) => i.id !== id)
  );
}
>>>>>>> 1ad3d42fee7245012111a3a2033405f598854555
