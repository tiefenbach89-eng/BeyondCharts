module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/lib/slug.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "slugify",
    ()=>slugify
]);
function slugify(input) {
    return input.toLowerCase().trim().replace(/\s+/g, "-").replace(/[ä]/g, "ae").replace(/[ö]/g, "oe").replace(/[ü]/g, "ue").replace(/[ß]/g, "ss").replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, "");
}
}),
"[project]/lib/supabase/server.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "supabaseServer",
    ()=>supabaseServer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/index.mjs [app-route] (ecmascript) <locals>");
;
function supabaseServer() {
    const url = process.env.SUPABASE_URL;
    const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !serviceRole) {
        throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(url, serviceRole, {
        auth: {
            persistSession: false
        }
    });
}
}),
"[project]/lib/content.server.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$slug$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/slug.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase/server.ts [app-route] (ecmascript)");
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
        slug: String(it.slug || (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$slug$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["slugify"])(String(it.title || ""))),
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
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseServer"])();
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
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseServer"])();
    const { data, error } = await supabase.from(dbTable(type)).select("*").eq("slug", slug).maybeSingle();
    if (error) throw error;
    if (!data) return null;
    return fromDb(type, data);
}
async function upsertContent(type, input) {
    const normalized = normalizeBase(type, input);
    // enforce slug from title if missing
    normalized.slug = normalized.slug || (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$slug$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["slugify"])(normalized.title);
    // update timestamps
    normalized.updatedAt = nowIso();
    if (normalized.status === "published" && !normalized.publishedAt) {
        normalized.publishedAt = nowIso();
    }
    if (normalized.status !== "published") {
        normalized.publishedAt = undefined;
    }
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseServer"])();
    const payload = toDb(type, normalized);
    const { data, error } = await supabase.from(dbTable(type)).upsert(payload, {
        onConflict: "id"
    }).select("*").single();
    if (error) throw error;
    return fromDb(type, data);
}
async function deleteContent(type, id) {
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseServer"])();
    const { error } = await supabase.from(dbTable(type)).delete().eq("id", id);
    if (error) throw error;
}
}),
"[project]/lib/settings.server.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DEFAULT_SETTINGS",
    ()=>DEFAULT_SETTINGS,
    "getSettings",
    ()=>getSettings,
    "saveSettings",
    ()=>saveSettings
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase/server.ts [app-route] (ecmascript)");
;
const DEFAULT_SETTINGS = {
    features: {
        auth: false,
        premium: false,
        premiumCTA: true,
        paywall: false
    },
    legal: {
        requireSourceForExternalNews: true,
        showDisclaimer: true
    },
    ui: {
        showTicker: true,
        showCategoryBadges: true
    },
    admin: {
        allowDrafts: true
    }
};
function normalizeSettings(next) {
    const n = next || {};
    return {
        features: {
            auth: !!n?.features?.auth,
            premium: !!n?.features?.premium,
            premiumCTA: n?.features?.premiumCTA !== false,
            paywall: !!n?.features?.paywall
        },
        legal: {
            requireSourceForExternalNews: n?.legal?.requireSourceForExternalNews !== false,
            showDisclaimer: n?.legal?.showDisclaimer !== false
        },
        ui: {
            showTicker: n?.ui?.showTicker !== false,
            showCategoryBadges: n?.ui?.showCategoryBadges !== false
        },
        admin: {
            allowDrafts: n?.admin?.allowDrafts !== false
        }
    };
}
const SETTINGS_ROW_ID = "global";
async function getSettings() {
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseServer"])();
    const { data, error } = await supabase.from("settings").select("data").eq("id", SETTINGS_ROW_ID).maybeSingle();
    if (error) throw error;
    if (!data?.data) return DEFAULT_SETTINGS;
    return normalizeSettings(data.data);
}
async function saveSettings(next) {
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseServer"])();
    const existing = await getSettings();
    const merged = normalizeSettings({
        ...existing,
        ...next
    });
    const { error } = await supabase.from("settings").upsert({
        id: SETTINGS_ROW_ID,
        data: merged,
        updated_at: new Date().toISOString()
    }, {
        onConflict: "id"
    });
    if (error) throw error;
    return merged;
}
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[project]/lib/imageStorage.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "processImageUrl",
    ()=>processImageUrl,
    "uploadImageFromBase64",
    ()=>uploadImageFromBase64
]);
// lib/imageStorage.ts
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto [external] (crypto, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase/server.ts [app-route] (ecmascript)");
;
;
async function uploadImageFromBase64(base64Data) {
    const match = base64Data.match(/^data:(image\/\w+);base64,(.+)$/);
    if (!match) {
        throw new Error("Invalid base64 image data");
    }
    const mime = match[1];
    const b64 = match[2];
    const buffer = Buffer.from(b64, "base64");
    const ext = mime.split("/")[1] || "png";
    const bucket = process.env.SUPABASE_STORAGE_BUCKET || "uploads";
    const objectPath = `images/${new Date().toISOString().slice(0, 10)}/${(0, __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["randomUUID"])()}.${ext}`;
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseServer"])();
    const { error: uploadError } = await supabase.storage.from(bucket).upload(objectPath, buffer, {
        contentType: mime,
        upsert: false
    });
    if (uploadError) {
        throw uploadError;
    }
    const { data } = supabase.storage.from(bucket).getPublicUrl(objectPath);
    if (!data?.publicUrl) {
        throw new Error("Failed to obtain public URL from Supabase");
    }
    return data.publicUrl;
}
async function processImageUrl(imageUrl) {
    if (!imageUrl) return undefined;
    // already a URL or local path
    if (imageUrl.startsWith("http") || imageUrl.startsWith("/")) {
        return imageUrl;
    }
    // base64 => upload
    if (imageUrl.startsWith("data:image/")) {
        return await uploadImageFromBase64(imageUrl);
    }
    return imageUrl;
}
}),
"[project]/app/api/admin/[type]/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DELETE",
    ()=>DELETE,
    "GET",
    ()=>GET,
    "POST",
    ()=>POST,
    "PUT",
    ()=>PUT,
    "runtime",
    ()=>runtime
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$content$2e$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/content.server.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$settings$2e$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/settings.server.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$imageStorage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/imageStorage.ts [app-route] (ecmascript)");
;
;
;
;
const runtime = "nodejs";
/* ===================== REVALIDATION ===================== */ async function triggerRevalidation(type, slug, action) {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
        await fetch(`${baseUrl}/api/revalidate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                type,
                slug,
                action
            })
        });
    } catch (err) {
        console.error("⚠️ Revalidation failed (non-critical):", err);
    }
}
async function GET(request, context) {
    const { type } = await context.params;
    const contentType = type;
    const includeDrafts = request.nextUrl.searchParams.get("includeDrafts") === "1";
    const items = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$content$2e$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["listContent"])(contentType, {
        includeDrafts
    });
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(items);
}
async function POST(request, context) {
    const { type } = await context.params;
    const contentType = type;
    const body = await request.json();
    const settings = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$settings$2e$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getSettings"])();
    const error = validatePayload(contentType, body, settings);
    if (error) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error
        }, {
            status: 400
        });
    }
    if (body.imageUrl) {
        body.imageUrl = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$imageStorage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["processImageUrl"])(body.imageUrl);
    }
    if (contentType === "analyses" && body.snapshot) {
        body.analysis = {
            overview: body.snapshot.thesis || "",
            businessModel: body.snapshot.profitability || "",
            risks: body.snapshot.risk || "",
            scenarios: body.snapshot.substance || ""
        };
        delete body.snapshot;
    }
    const item = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$content$2e$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["upsertContent"])(contentType, body);
    if (item.status === "published") {
        await triggerRevalidation(contentType, item.slug, "create");
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(item);
}
async function PUT(request, context) {
    const { type } = await context.params;
    const contentType = type;
    const body = await request.json();
    const settings = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$settings$2e$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getSettings"])();
    const error = validatePayload(contentType, body, settings);
    if (error) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error
        }, {
            status: 400
        });
    }
    if (body.imageUrl) {
        try {
            body.imageUrl = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$imageStorage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["processImageUrl"])(body.imageUrl);
        } catch (err) {
            console.error("❌ Image processing failed:", err);
        }
    }
    if (contentType === "analyses" && body.snapshot) {
        body.analysis = {
            overview: body.snapshot.thesis || "",
            businessModel: body.snapshot.profitability || "",
            risks: body.snapshot.risk || "",
            scenarios: body.snapshot.substance || ""
        };
        delete body.snapshot;
    }
    const item = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$content$2e$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["upsertContent"])(contentType, body);
    if (item.status === "published") {
        await triggerRevalidation(contentType, item.slug, "update");
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(item);
}
async function DELETE(request, context) {
    const { type } = await context.params;
    const contentType = type;
    const id = request.nextUrl.searchParams.get("id");
    if (!id) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Missing id"
        }, {
            status: 400
        });
    }
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$content$2e$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["deleteContent"])(contentType, id);
    await triggerRevalidation(contentType, undefined, "delete");
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        ok: true
    });
}
/* ===================== VALIDATION ===================== */ function validatePayload(type, payload, settings) {
    if (payload.status === "published") {
        if (payload.auditStatus !== "approved") {
            return "Beitrag muss vor Veröffentlichung freigegeben werden.";
        }
    }
    if (type === "news") {
        const requireSource = settings?.legal?.requireSourceForExternalNews !== false;
        if (requireSource && payload.sourceType === "external") {
            if (!payload.source || !payload.source.trim()) {
                return "Quelle ist erforderlich (externe News).";
            }
            if (!payload.sourceUrl || !isValidHttpUrl(payload.sourceUrl)) {
                return "Gültiger Quellen-Link ist erforderlich (externe News).";
            }
        }
    }
    return null;
}
function isValidHttpUrl(maybeUrl) {
    try {
        const u = new URL(maybeUrl);
        return u.protocol === "http:" || u.protocol === "https:";
    } catch  {
        return false;
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__a2fd0b78._.js.map