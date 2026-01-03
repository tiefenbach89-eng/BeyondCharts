# BeyondCharts – Vercel + Supabase (Public Storage) Deployment

This repo has been refactored to be **Vercel-safe**:
- No runtime writes to the filesystem (no `data/*.json` writes, no `public/uploads` writes)
- Content + Settings are stored in **Supabase Postgres**
- Images are stored in **Supabase Storage** (public bucket)

## 1) Supabase setup

### 1.1 Create Storage bucket
Supabase Dashboard → **Storage** → Create bucket:

- Name: `uploads`
- Public: **ON**

### 1.2 Create DB schema
Supabase Dashboard → **SQL Editor** → run:

- `supabase/schema.sql`

This creates:
- `news`
- `analyses`
- `settings`

## 2) Environment variables

### 2.1 Local (`.env.local`)
Create `.env.local` using `.env.example`.

Required variables:

- `FINNHUB_API_KEY`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_STORAGE_BUCKET` (default: `uploads`)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 2.2 Vercel
Vercel → Project → Settings → Environment Variables

Add all variables above for:
- Production
- Preview

**Important:** `SUPABASE_SERVICE_ROLE_KEY` must exist only as a server env var (do not expose it to the browser).

## 3) One-time migration (recommended)

If you currently have content in local JSON files:

- `data/news.json`
- `data/analyses.json`
- `data/settings.json`
- images in `public/uploads/*`

Run the migration once:

```bash
npm install
npm run migrate:supabase
```

What it does:
- Upserts all items into Supabase tables
- Uploads referenced `/uploads/...` images into Supabase Storage
- Rewrites `imageUrl` to Supabase public URLs before writing to DB
- Writes settings into the `settings` table

After migration, your live app will read from Supabase.

## 4) Next.js image host allowlist

`next.config.mjs` includes a wildcard host for Supabase:

- `*.supabase.co`

If your Next.js version rejects wildcard hostnames, replace it with your exact project host:

- `<PROJECT-REF>.supabase.co`

## 5) Deploy to Vercel

1. Push to GitHub (or import the repository into Vercel)
2. In Vercel, set the Environment Variables (section 2.2)
3. Deploy

## 6) Operational notes

- Admin API routes force Node runtime (`export const runtime = "nodejs";`) for compatibility.
- Image uploads from the admin panel can still be base64; the server converts them into Storage objects.
- You can later add a *private* bucket for premium assets without changing the public-image flow.

