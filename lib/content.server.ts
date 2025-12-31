import fs from "node:fs/promises";
import path from "node:path";
import { slugify } from "@/lib/slug";

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

  /** Admin / Editor Source */
  imageUrl?: string;

  /** Public alias for Landing / Cards */
  image?: string;

  /** optional but recommended for legal traceability */
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

export type NewsItem = BaseContent & {
  category: string;
  source: string;
  sourceUrl?: string;
  sourceType: "own" | "external";
  impact: "Low" | "Medium" | "High";
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