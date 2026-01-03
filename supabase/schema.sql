-- Supabase schema for BeyondCharts (Option A)
-- Run this in Supabase Dashboard -> SQL Editor.

create table if not exists settings (
  id text primary key default 'global',
  data jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists news (
  id text primary key,
  slug text not null unique,
  title text not null,
  summary text not null,
  content text not null,
  image_url text,
  image_source text,
  tags jsonb not null default '[]'::jsonb,
  is_premium boolean not null default false,
  status text not null default 'draft',
  created_at timestamptz not null,
  updated_at timestamptz not null,
  published_at timestamptz,
  audit_status text not null default 'pending',
  audit_notes text not null default '',
  audited_at timestamptz,
  category text not null default 'News',
  source text not null default '',
  source_url text,
  source_type text not null default 'own',
  impact text not null default 'Medium',
  ticker text
);

create table if not exists analyses (
  id text primary key,
  slug text not null unique,
  title text not null,
  summary text not null,
  content text not null,
  image_url text,
  image_source text,
  tags jsonb not null default '[]'::jsonb,
  is_premium boolean not null default false,
  status text not null default 'draft',
  created_at timestamptz not null,
  updated_at timestamptz not null,
  published_at timestamptz,
  audit_status text not null default 'pending',
  audit_notes text not null default '',
  audited_at timestamptz,
  category text not null default 'Analysen',
  analysis jsonb not null default '{}'::jsonb,
  ticker text
);

-- Helpful indexes (optional)
create index if not exists idx_news_status_created_at on news(status, created_at desc);
create index if not exists idx_analyses_status_created_at on analyses(status, created_at desc);
