/* scripts/migrate-to-supabase.ts
   One-time migration script:
   - data/news.json + data/analyses.json -> Supabase Postgres tables
   - data/settings.json -> settings table
   - public/uploads/* referenced by imageUrl -> Supabase Storage (public bucket), then rewrite URLs

   Usage:
     1) Ensure .env.local has SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_STORAGE_BUCKET
     2) Run: node --loader ts-node/esm scripts/migrate-to-supabase.ts
   Alternative:
     - Compile with ts-node/register or use tsx (recommended): npx tsx scripts/migrate-to-supabase.ts
*/
import "dotenv/config";
import fs from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

type ContentType = "news" | "analyses";

const root = process.cwd();
const bucket = process.env.SUPABASE_STORAGE_BUCKET || "uploads";
const url = process.env.SUPABASE_URL!;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!url || !service) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
}

const supabase = createClient(url, service, { auth: { persistSession: false } });

async function fileExists(p: string) {
  try {
    await fs.stat(p);
    return true;
  } catch {
    return false;
  }
}

async function uploadLocalFileToStorage(localPath: string, objectPath: string) {
  const buf = await fs.readFile(localPath);
  const ext = path.extname(localPath).slice(1).toLowerCase();
  const mime =
    ext === "jpg" || ext === "jpeg"
      ? "image/jpeg"
      : ext === "png"
      ? "image/png"
      : ext === "webp"
      ? "image/webp"
      : "application/octet-stream";

  const { error } = await supabase.storage.from(bucket).upload(objectPath, buf, {
    contentType: mime,
    upsert: false,
  });
  if (error) throw error;

  const { data } = supabase.storage.from(bucket).getPublicUrl(objectPath);
  return data.publicUrl;
}

async function migrateContent(type: ContentType, fileName: string) {
  const p = path.join(root, "data", fileName);
  const raw = await fs.readFile(p, "utf-8");
  const items = JSON.parse(raw) as any[];

  console.log(`Migrating ${items.length} ${type} items from ${fileName}...`);

  for (const it of items) {
    // Upload local image if referenced
    if (typeof it.imageUrl === "string" && it.imageUrl.startsWith("/uploads/")) {
      const local = path.join(root, "public", it.imageUrl);
      if (await fileExists(local)) {
        const objectPath = `legacy${it.imageUrl}`.replace(/^\/+/, "");
        const publicUrl = await uploadLocalFileToStorage(local, objectPath);
        it.imageUrl = publicUrl;
        console.log(`  Uploaded ${it.id} image -> ${publicUrl}`);
      } else {
        console.warn(`  WARN: missing local upload file for ${it.id}: ${local}`);
      }
    }

    // Map to DB
    const payload: any = {
      id: it.id,
      slug: it.slug,
      title: it.title,
      summary: it.summary,
      content: it.content,
      image_url: it.imageUrl || null,
      image_source: it.imageSource || null,
      tags: it.tags || [],
      is_premium: !!it.isPremium,
      status: it.status || "draft",
      created_at: it.createdAt || new Date().toISOString(),
      updated_at: it.updatedAt || new Date().toISOString(),
      published_at: it.publishedAt || null,
      audit_status: it.auditStatus || "pending",
      audit_notes: it.auditNotes || "",
      audited_at: it.auditedAt || null,
      category: it.category || (type === "news" ? "News" : "Analysen"),
      ticker: it.ticker || null,
    };

    if (type === "news") {
      payload.source = it.source || "";
      payload.source_url = it.sourceUrl || null;
      payload.source_type = it.sourceType || "own";
      payload.impact = it.impact || "Medium";
    } else {
      payload.analysis = it.analysis || {};
    }

    const { error } = await supabase
      .from(type === "news" ? "news" : "analyses")
      .upsert(payload, { onConflict: "id" });

    if (error) throw error;
  }
}

async function migrateSettings() {
  const p = path.join(root, "data", "settings.json");
  if (!(await fileExists(p))) return;

  const raw = await fs.readFile(p, "utf-8");
  const settings = JSON.parse(raw);

  const { error } = await supabase.from("settings").upsert(
    {
      id: "global",
      data: settings,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" }
  );

  if (error) throw error;
  console.log("Settings migrated.");
}

async function main() {
  await migrateSettings();
  await migrateContent("news", "news.json");
  await migrateContent("analyses", "analyses.json");
  console.log("Migration complete.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
