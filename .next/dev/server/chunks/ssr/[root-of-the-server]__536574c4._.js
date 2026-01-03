module.exports = [
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/app/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/layout.tsx [app-rsc] (ecmascript)"));
}),
"[project]/app/not-found.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/not-found.tsx [app-rsc] (ecmascript)"));
}),
"[project]/lib/slug.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "slugify",
    ()=>slugify
]);
function slugify(input) {
    return input.toLowerCase().trim().replace(/\s+/g, "-").replace(/[ä]/g, "ae").replace(/[ö]/g, "oe").replace(/[ü]/g, "ue").replace(/[ß]/g, "ss").replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, "");
}
}),
"[project]/lib/supabase/server.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "supabaseServer",
    ()=>supabaseServer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/index.mjs [app-rsc] (ecmascript) <locals>");
;
function supabaseServer() {
    const url = process.env.SUPABASE_URL;
    const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !serviceRole) {
        throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(url, serviceRole, {
        auth: {
            persistSession: false
        }
    });
}
}),
"[project]/lib/content.server.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "deleteContent",
    ()=>deleteContent,
    "getBySlug",
    ()=>getBySlug,
    "listContent",
    ()=>listContent,
    "upsertContent",
    ()=>upsertContent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$slug$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/slug.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase/server.ts [app-rsc] (ecmascript)");
;
;
/* =====================
   HELPERS
===================== */ function nowIso() {
    return new Date().toISOString();
}
function nextId(prefix) {
    // stable enough for admin CMS usage; stored as primary key
    return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}
function normalizeBase(type, it) {
    const now = nowIso();
    const publishedAtIso = typeof it.publishedAt === "string" && it.publishedAt ? it.publishedAt : undefined;
    const base = {
        id: String(it.id || nextId(type)),
        slug: String(it.slug || (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$slug$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["slugify"])(String(it.title || ""))),
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
        auditedAt: it.auditedAt || undefined
    };
    if (type === "news") {
        const news = {
            ...base,
            category: it.category || "News",
            source: it.source || "",
            sourceUrl: it.sourceUrl || "",
            sourceType: it.sourceType === "external" ? "external" : "own",
            impact: it.impact === "High" || it.impact === "Low" ? it.impact : "Medium",
            ticker: it.ticker || undefined
        };
        return news;
    }
    const analysis = {
        ...base,
        category: it.category || "Analysen",
        analysis: typeof it.analysis === "object" && it.analysis !== null ? it.analysis : {},
        ticker: it.ticker || undefined
    };
    return analysis;
}
function dbTable(type) {
    return type === "news" ? "news" : "analyses";
}
function fromDb(type, row) {
    const base = {
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
        auditedAt: row.audited_at || undefined
    };
    if (type === "news") {
        return {
            ...base,
            category: row.category || "News",
            source: row.source || "",
            sourceUrl: row.source_url || "",
            sourceType: row.source_type === "external" ? "external" : "own",
            impact: row.impact === "High" || row.impact === "Low" ? row.impact : "Medium",
            ticker: row.ticker || undefined
        };
    }
    return {
        ...base,
        category: row.category || "Analysen",
        analysis: row.analysis || {},
        ticker: row.ticker || undefined
    };
}
function toDb(type, item) {
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
        ticker: item.ticker || null
    };
    if (type === "news") {
        const n = item;
        return {
            ...common,
            category: n.category || "News",
            source: n.source || "",
            source_url: n.sourceUrl || null,
            source_type: n.sourceType || "own",
            impact: n.impact || "Medium"
        };
    }
    const a = item;
    return {
        ...common,
        category: a.category || "Analysen",
        analysis: a.analysis || {}
    };
}
async function listContent(type, options = {}) {
    const includeDrafts = options.includeDrafts ?? false;
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["supabaseServer"])();
    let query = supabase.from(dbTable(type)).select("*").order("created_at", {
        ascending: false
    });
    if (!includeDrafts) {
        query = query.eq("status", "published");
    }
    const { data, error } = await query;
    if (error) throw error;
    return (data || []).map((row)=>fromDb(type, row));
}
async function getBySlug(type, slug) {
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["supabaseServer"])();
    const { data, error } = await supabase.from(dbTable(type)).select("*").eq("slug", slug).maybeSingle();
    if (error) throw error;
    if (!data) return null;
    return fromDb(type, data);
}
async function upsertContent(type, input) {
    const normalized = normalizeBase(type, input);
    // enforce slug from title if missing
    normalized.slug = normalized.slug || (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$slug$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["slugify"])(normalized.title);
    // update timestamps
    normalized.updatedAt = nowIso();
    if (normalized.status === "published" && !normalized.publishedAt) {
        normalized.publishedAt = nowIso();
    }
    if (normalized.status !== "published") {
        normalized.publishedAt = undefined;
    }
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["supabaseServer"])();
    const payload = toDb(type, normalized);
    const { data, error } = await supabase.from(dbTable(type)).upsert(payload, {
        onConflict: "id"
    }).select("*").single();
    if (error) throw error;
    return fromDb(type, data);
}
async function deleteContent(type, id) {
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["supabaseServer"])();
    const { error } = await supabase.from(dbTable(type)).delete().eq("id", id);
    if (error) throw error;
}
}),
"[project]/app/news/[slug]/NewsView.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "NewsView",
    ()=>NewsView
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const NewsView = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call NewsView() from the server but NewsView is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/app/news/[slug]/NewsView.tsx <module evaluation>", "NewsView");
}),
"[project]/app/news/[slug]/NewsView.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "NewsView",
    ()=>NewsView
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const NewsView = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call NewsView() from the server but NewsView is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/app/news/[slug]/NewsView.tsx", "NewsView");
}),
"[project]/app/news/[slug]/NewsView.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$news$2f5b$slug$5d2f$NewsView$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/app/news/[slug]/NewsView.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$news$2f5b$slug$5d2f$NewsView$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/app/news/[slug]/NewsView.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$news$2f5b$slug$5d2f$NewsView$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/app/news/[slug]/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>NewsDetailPage,
    "generateMetadata",
    ()=>generateMetadata
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
// app/news/[slug]/page.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$content$2e$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/content.server.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$news$2f5b$slug$5d2f$NewsView$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/news/[slug]/NewsView.tsx [app-rsc] (ecmascript)");
;
;
;
;
/**
 * Type Guard: stellt sicher, dass es wirklich ein NewsItem ist
 */ function isNewsItem(item) {
    return typeof item === "object" && item !== null && "source" in item && "sourceType" in item && "impact" in item;
}
async function generateMetadata({ params }) {
    const item = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$content$2e$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getBySlug"])("news", params.slug);
    if (!item || !isNewsItem(item)) {
        return {
            title: "News nicht gefunden"
        };
    }
    return {
        title: `${item.title} — Beyond Charts News`,
        description: item.summary,
        openGraph: {
            title: item.title,
            description: item.summary,
            images: item.imageUrl ? [
                item.imageUrl
            ] : [],
            type: "article",
            publishedTime: item.publishedAt
        },
        twitter: {
            card: "summary_large_image",
            title: item.title,
            description: item.summary,
            images: item.imageUrl ? [
                item.imageUrl
            ] : []
        }
    };
}
async function NewsDetailPage({ params }) {
    const item = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$content$2e$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getBySlug"])("news", params.slug);
    // Not found oder falscher Content-Typ
    if (!item || !isNewsItem(item)) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["notFound"])();
    }
    // Nur veröffentlichte News anzeigen
    if (item.status !== "published") {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["notFound"])();
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$news$2f5b$slug$5d2f$NewsView$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["NewsView"], {
        item: item
    }, void 0, false, {
        fileName: "[project]/app/news/[slug]/page.tsx",
        lineNumber: 78,
        columnNumber: 10
    }, this);
} /**
 * Optional: Generate Static Params for Static Generation
 */  /*
export async function generateStaticParams() {
  const { listContent } = await import("@/lib/content.server");
  const items = await listContent("news");
  return items.map((item) => ({
    slug: item.slug,
  }));
}
*/ 
}),
"[project]/app/news/[slug]/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/news/[slug]/page.tsx [app-rsc] (ecmascript)"));
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__536574c4._.js.map