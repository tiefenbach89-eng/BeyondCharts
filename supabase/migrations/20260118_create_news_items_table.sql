-- Create news_items table for persistent storage
-- News are stored for 14 days, then auto-deleted

CREATE TABLE IF NOT EXISTS news_items (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  snippet TEXT,
  url TEXT NOT NULL,
  image_url TEXT,
  published_at TIMESTAMPTZ NOT NULL,
  source TEXT,
  category TEXT,
  related_symbols TEXT[] DEFAULT '{}',
  stored_at TIMESTAMPTZ DEFAULT NOW(),
  fetched_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast date-based queries
CREATE INDEX IF NOT EXISTS idx_news_items_published_at ON news_items(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_items_stored_at ON news_items(stored_at DESC);

-- Index for symbol searches
CREATE INDEX IF NOT EXISTS idx_news_items_symbols ON news_items USING GIN(related_symbols);

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_news_items_updated_at
  BEFORE UPDATE ON news_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE news_items ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read news
CREATE POLICY "News items are publicly readable"
  ON news_items
  FOR SELECT
  TO public
  USING (true);

-- Policy: Only service role can insert/update/delete
CREATE POLICY "Service role can manage news items"
  ON news_items
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Function to auto-delete news older than 14 days
-- This can be called via a cron job or manually
CREATE OR REPLACE FUNCTION cleanup_old_news()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  WITH deleted AS (
    DELETE FROM news_items
    WHERE published_at < NOW() - INTERVAL '14 days'
    RETURNING id
  )
  SELECT COUNT(*) INTO deleted_count FROM deleted;

  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Optional: Set up pg_cron to auto-cleanup daily at 3 AM
-- This requires the pg_cron extension to be enabled
-- Uncomment if you have pg_cron enabled:

-- SELECT cron.schedule(
--   'cleanup-old-news',
--   '0 3 * * *', -- Every day at 3 AM
--   'SELECT cleanup_old_news();'
-- );

COMMENT ON TABLE news_items IS 'Stores financial news items for 14 days';
COMMENT ON FUNCTION cleanup_old_news() IS 'Deletes news items older than 14 days';
