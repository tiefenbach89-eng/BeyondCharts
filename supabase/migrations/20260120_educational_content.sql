-- ============================================
-- BEYOND CHARTS 2.0 - EDUCATIONAL CONTENT
-- Migration: Guides, Tutorials, Glossary
-- Date: 2026-01-20
-- ============================================

-- ============================================
-- 1. GUIDES TABLE (Educational Articles)
-- ============================================
CREATE TABLE IF NOT EXISTS guides (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  image_source TEXT,
  category TEXT NOT NULL DEFAULT 'General', -- Getting Started, Technical Analysis, Fundamental Analysis, Risk Management, etc.
  difficulty TEXT NOT NULL DEFAULT 'beginner', -- beginner, intermediate, advanced
  tags TEXT[] DEFAULT '{}',
  reading_time INTEGER, -- estimated minutes
  premium_only BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'draft', -- draft, published
  view_count INTEGER DEFAULT 0,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_guides_slug ON guides(slug);
CREATE INDEX idx_guides_category ON guides(category);
CREATE INDEX idx_guides_difficulty ON guides(difficulty);
CREATE INDEX idx_guides_status ON guides(status);
CREATE INDEX idx_guides_published_at ON guides(published_at DESC);
CREATE INDEX idx_guides_tags ON guides USING GIN(tags);

-- Auto-update updated_at
CREATE TRIGGER update_guides_updated_at
  BEFORE UPDATE ON guides
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 2. GLOSSARY TABLE (Financial Terms)
-- ============================================
CREATE TABLE IF NOT EXISTS glossary (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  term TEXT NOT NULL UNIQUE,
  definition TEXT NOT NULL,
  example TEXT,
  category TEXT NOT NULL DEFAULT 'General', -- Trading, Technical Analysis, Fundamental Analysis, etc.
  related_terms TEXT[] DEFAULT '{}',
  difficulty TEXT NOT NULL DEFAULT 'beginner',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_glossary_term ON glossary(term);
CREATE INDEX idx_glossary_category ON glossary(category);
CREATE INDEX idx_glossary_difficulty ON glossary(difficulty);

-- Auto-update updated_at
CREATE TRIGGER update_glossary_updated_at
  BEFORE UPDATE ON glossary
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 3. VIDEO TUTORIALS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS video_tutorials (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  video_url TEXT NOT NULL, -- YouTube, Vimeo, etc.
  thumbnail_url TEXT,
  category TEXT NOT NULL DEFAULT 'General',
  difficulty TEXT NOT NULL DEFAULT 'beginner',
  duration INTEGER, -- seconds
  tags TEXT[] DEFAULT '{}',
  premium_only BOOLEAN NOT NULL DEFAULT false,
  view_count INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_video_tutorials_category ON video_tutorials(category);
CREATE INDEX idx_video_tutorials_difficulty ON video_tutorials(difficulty);
CREATE INDEX idx_video_tutorials_status ON video_tutorials(status);
CREATE INDEX idx_video_tutorials_published_at ON video_tutorials(published_at DESC);

-- Auto-update updated_at
CREATE TRIGGER update_video_tutorials_updated_at
  BEFORE UPDATE ON video_tutorials
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 4. USER PROGRESS TRACKING
-- ============================================
CREATE TABLE IF NOT EXISTS user_guide_progress (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  guide_id TEXT NOT NULL REFERENCES guides(id) ON DELETE CASCADE,
  completed BOOLEAN NOT NULL DEFAULT false,
  marked_helpful BOOLEAN NOT NULL DEFAULT false,
  last_read_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, guide_id)
);

-- Indexes
CREATE INDEX idx_user_guide_progress_user_id ON user_guide_progress(user_id);
CREATE INDEX idx_user_guide_progress_guide_id ON user_guide_progress(guide_id);

-- ============================================
-- 5. FAQ TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS faq (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'General', -- Account, Trading, Platform, etc.
  order_index INTEGER DEFAULT 0,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_faq_category ON faq(category);
CREATE INDEX idx_faq_order ON faq(order_index);

-- Auto-update updated_at
CREATE TRIGGER update_faq_updated_at
  BEFORE UPDATE ON faq
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 6. ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS
ALTER TABLE guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE glossary ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_tutorials ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_guide_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq ENABLE ROW LEVEL SECURITY;

-- GUIDES POLICIES
-- Everyone can read published non-premium guides
CREATE POLICY "Anyone can read published free guides"
  ON guides FOR SELECT
  TO public
  USING (status = 'published' AND premium_only = false);

-- Authenticated users can read all published guides (for future premium)
CREATE POLICY "Authenticated users can read all published guides"
  ON guides FOR SELECT
  TO authenticated
  USING (status = 'published');

-- Admins can manage guides
CREATE POLICY "Admins can manage guides"
  ON guides FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- GLOSSARY POLICIES
-- Everyone can read glossary
CREATE POLICY "Anyone can read glossary"
  ON glossary FOR SELECT
  TO public
  USING (true);

-- Admins can manage glossary
CREATE POLICY "Admins can manage glossary"
  ON glossary FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- VIDEO TUTORIALS POLICIES
-- Everyone can read published non-premium videos
CREATE POLICY "Anyone can read published free videos"
  ON video_tutorials FOR SELECT
  TO public
  USING (status = 'published' AND premium_only = false);

-- Authenticated users can read all published videos
CREATE POLICY "Authenticated users can read all published videos"
  ON video_tutorials FOR SELECT
  TO authenticated
  USING (status = 'published');

-- Admins can manage videos
CREATE POLICY "Admins can manage videos"
  ON video_tutorials FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- USER PROGRESS POLICIES
-- Users can manage their own progress
CREATE POLICY "Users can manage own progress"
  ON user_guide_progress FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- FAQ POLICIES
-- Everyone can read FAQ
CREATE POLICY "Anyone can read FAQ"
  ON faq FOR SELECT
  TO public
  USING (true);

-- Admins can manage FAQ
CREATE POLICY "Admins can manage FAQ"
  ON faq FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- ============================================
-- 7. HELPER FUNCTIONS
-- ============================================

-- Function to increment guide view count
CREATE OR REPLACE FUNCTION increment_guide_views(p_guide_id TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE guides
  SET view_count = view_count + 1
  WHERE id = p_guide_id;
END;
$$ LANGUAGE plpgsql;

-- Function to mark guide as helpful
CREATE OR REPLACE FUNCTION mark_guide_helpful(p_guide_id TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE guides
  SET helpful_count = helpful_count + 1
  WHERE id = p_guide_id;
END;
$$ LANGUAGE plpgsql;

-- Function to increment video view count
CREATE OR REPLACE FUNCTION increment_video_views(p_video_id TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE video_tutorials
  SET view_count = view_count + 1
  WHERE id = p_video_id;
END;
$$ LANGUAGE plpgsql;

-- Function to mark FAQ as helpful
CREATE OR REPLACE FUNCTION mark_faq_helpful(p_faq_id TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE faq
  SET helpful_count = helpful_count + 1
  WHERE id = p_faq_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 8. VIEWS FOR COMMON QUERIES
-- ============================================

-- Popular guides view
CREATE OR REPLACE VIEW popular_guides_view AS
SELECT
  id,
  slug,
  title,
  summary,
  category,
  difficulty,
  reading_time,
  view_count,
  helpful_count,
  created_at,
  published_at
FROM guides
WHERE status = 'published'
ORDER BY view_count DESC, helpful_count DESC
LIMIT 10;

-- User learning progress view
CREATE OR REPLACE VIEW user_learning_stats AS
SELECT
  ugp.user_id,
  COUNT(*) as guides_read,
  COUNT(*) FILTER (WHERE ugp.completed = true) as guides_completed,
  COUNT(*) FILTER (WHERE ugp.marked_helpful = true) as guides_found_helpful,
  COALESCE(
    (COUNT(*) FILTER (WHERE ugp.completed = true)::DECIMAL /
     NULLIF(COUNT(*), 0) * 100),
    0
  )::DECIMAL(5, 2) as completion_rate
FROM user_guide_progress ugp
GROUP BY ugp.user_id;

-- ============================================
-- COMMENTS
-- ============================================
COMMENT ON TABLE guides IS 'Educational guides and tutorials';
COMMENT ON TABLE glossary IS 'Financial terms and definitions';
COMMENT ON TABLE video_tutorials IS 'Video learning content';
COMMENT ON TABLE user_guide_progress IS 'Tracks user progress through educational content';
COMMENT ON TABLE faq IS 'Frequently asked questions';
COMMENT ON FUNCTION increment_guide_views IS 'Increments view count for a guide';
COMMENT ON FUNCTION mark_guide_helpful IS 'Marks a guide as helpful';
