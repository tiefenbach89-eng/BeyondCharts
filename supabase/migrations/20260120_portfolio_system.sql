-- ============================================
-- BEYOND CHARTS 2.0 - PORTFOLIO SYSTEM
-- Migration: Portfolio Tracking & Holdings
-- Date: 2026-01-20
-- ============================================

-- ============================================
-- 1. PORTFOLIOS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS portfolios (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  visibility TEXT NOT NULL DEFAULT 'private', -- private, public, followers_only
  is_house_portfolio BOOLEAN NOT NULL DEFAULT false, -- Admin's official portfolio
  total_value DECIMAL(15, 2) DEFAULT 0,
  total_invested DECIMAL(15, 2) DEFAULT 0,
  total_return DECIMAL(15, 2) DEFAULT 0,
  total_return_percent DECIMAL(8, 4) DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'EUR',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_portfolios_user_id ON portfolios(user_id);
CREATE INDEX idx_portfolios_visibility ON portfolios(visibility);
CREATE INDEX idx_portfolios_house ON portfolios(is_house_portfolio) WHERE is_house_portfolio = true;

-- Auto-update updated_at
CREATE TRIGGER update_portfolios_updated_at
  BEFORE UPDATE ON portfolios
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 2. PORTFOLIO HOLDINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS holdings (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  portfolio_id TEXT NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
  ticker TEXT NOT NULL,
  asset_type TEXT NOT NULL DEFAULT 'stock', -- stock, etf, crypto
  asset_name TEXT,
  quantity DECIMAL(15, 8) NOT NULL,
  entry_price DECIMAL(15, 4) NOT NULL,
  entry_date DATE NOT NULL,
  current_price DECIMAL(15, 4),
  current_value DECIMAL(15, 2),
  pnl DECIMAL(15, 2),
  pnl_percent DECIMAL(8, 4),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_holdings_portfolio_id ON holdings(portfolio_id);
CREATE INDEX idx_holdings_ticker ON holdings(ticker);
CREATE INDEX idx_holdings_asset_type ON holdings(asset_type);

-- Auto-update updated_at
CREATE TRIGGER update_holdings_updated_at
  BEFORE UPDATE ON holdings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 3. PORTFOLIO FOLLOWERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS portfolio_followers (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  follower_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  portfolio_id TEXT NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(follower_user_id, portfolio_id)
);

-- Indexes
CREATE INDEX idx_portfolio_followers_user ON portfolio_followers(follower_user_id);
CREATE INDEX idx_portfolio_followers_portfolio ON portfolio_followers(portfolio_id);

-- ============================================
-- 4. PORTFOLIO PERFORMANCE HISTORY
-- ============================================
CREATE TABLE IF NOT EXISTS portfolio_snapshots (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  portfolio_id TEXT NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
  total_value DECIMAL(15, 2) NOT NULL,
  total_return DECIMAL(15, 2) NOT NULL,
  total_return_percent DECIMAL(8, 4) NOT NULL,
  snapshot_date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(portfolio_id, snapshot_date)
);

-- Indexes
CREATE INDEX idx_portfolio_snapshots_portfolio_date ON portfolio_snapshots(portfolio_id, snapshot_date DESC);

-- ============================================
-- 5. ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE holdings ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_followers ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_snapshots ENABLE ROW LEVEL SECURITY;

-- PORTFOLIOS POLICIES
-- Users can read their own portfolios
CREATE POLICY "Users can read own portfolios"
  ON portfolios FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Users can read public portfolios
CREATE POLICY "Anyone can read public portfolios"
  ON portfolios FOR SELECT
  TO public
  USING (visibility = 'public');

-- Users can read house portfolio
CREATE POLICY "Anyone can read house portfolio"
  ON portfolios FOR SELECT
  TO public
  USING (is_house_portfolio = true);

-- Users can insert their own portfolios
CREATE POLICY "Users can insert own portfolios"
  ON portfolios FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Users can update their own portfolios
CREATE POLICY "Users can update own portfolios"
  ON portfolios FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Users can delete their own portfolios
CREATE POLICY "Users can delete own portfolios"
  ON portfolios FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Admins can manage all portfolios
CREATE POLICY "Admins can manage all portfolios"
  ON portfolios FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- HOLDINGS POLICIES
-- Users can read holdings of their own portfolios
CREATE POLICY "Users can read own holdings"
  ON holdings FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM portfolios
      WHERE portfolios.id = holdings.portfolio_id
      AND portfolios.user_id = auth.uid()
    )
  );

-- Anyone can read holdings of public portfolios
CREATE POLICY "Anyone can read public portfolio holdings"
  ON holdings FOR SELECT
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM portfolios
      WHERE portfolios.id = holdings.portfolio_id
      AND portfolios.visibility = 'public'
    )
  );

-- Anyone can read house portfolio holdings
CREATE POLICY "Anyone can read house portfolio holdings"
  ON holdings FOR SELECT
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM portfolios
      WHERE portfolios.id = holdings.portfolio_id
      AND portfolios.is_house_portfolio = true
    )
  );

-- Users can manage holdings of their own portfolios
CREATE POLICY "Users can manage own holdings"
  ON holdings FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM portfolios
      WHERE portfolios.id = holdings.portfolio_id
      AND portfolios.user_id = auth.uid()
    )
  );

-- Admins can manage all holdings
CREATE POLICY "Admins can manage all holdings"
  ON holdings FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- FOLLOWERS POLICIES
-- Users can read followers of public portfolios
CREATE POLICY "Users can read public portfolio followers"
  ON portfolio_followers FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM portfolios
      WHERE portfolios.id = portfolio_followers.portfolio_id
      AND portfolios.visibility = 'public'
    )
  );

-- Users can follow/unfollow portfolios
CREATE POLICY "Users can manage their follows"
  ON portfolio_followers FOR ALL
  TO authenticated
  USING (follower_user_id = auth.uid());

-- SNAPSHOTS POLICIES
-- Anyone can read snapshots of public portfolios
CREATE POLICY "Anyone can read public portfolio snapshots"
  ON portfolio_snapshots FOR SELECT
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM portfolios
      WHERE portfolios.id = portfolio_snapshots.portfolio_id
      AND portfolios.visibility = 'public'
    )
  );

-- Users can read snapshots of their own portfolios
CREATE POLICY "Users can read own portfolio snapshots"
  ON portfolio_snapshots FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM portfolios
      WHERE portfolios.id = portfolio_snapshots.portfolio_id
      AND portfolios.user_id = auth.uid()
    )
  );

-- Service role can manage snapshots (for cron jobs)
CREATE POLICY "Service role can manage snapshots"
  ON portfolio_snapshots FOR ALL
  TO service_role
  USING (true);

-- ============================================
-- 6. HELPER FUNCTIONS
-- ============================================

-- Function to calculate portfolio value
CREATE OR REPLACE FUNCTION calculate_portfolio_value(p_portfolio_id TEXT)
RETURNS VOID AS $$
DECLARE
  v_total_value DECIMAL(15, 2);
  v_total_invested DECIMAL(15, 2);
  v_total_return DECIMAL(15, 2);
  v_total_return_percent DECIMAL(8, 4);
BEGIN
  -- Calculate total current value
  SELECT COALESCE(SUM(current_value), 0)
  INTO v_total_value
  FROM holdings
  WHERE portfolio_id = p_portfolio_id;

  -- Calculate total invested
  SELECT COALESCE(SUM(quantity * entry_price), 0)
  INTO v_total_invested
  FROM holdings
  WHERE portfolio_id = p_portfolio_id;

  -- Calculate return
  v_total_return := v_total_value - v_total_invested;

  -- Calculate return percent
  IF v_total_invested > 0 THEN
    v_total_return_percent := (v_total_return / v_total_invested) * 100;
  ELSE
    v_total_return_percent := 0;
  END IF;

  -- Update portfolio
  UPDATE portfolios
  SET
    total_value = v_total_value,
    total_invested = v_total_invested,
    total_return = v_total_return,
    total_return_percent = v_total_return_percent,
    updated_at = NOW()
  WHERE id = p_portfolio_id;
END;
$$ LANGUAGE plpgsql;

-- Function to create daily snapshots (call via cron)
CREATE OR REPLACE FUNCTION create_daily_portfolio_snapshots()
RETURNS INTEGER AS $$
DECLARE
  v_count INTEGER := 0;
  v_portfolio RECORD;
BEGIN
  FOR v_portfolio IN
    SELECT id, total_value, total_return, total_return_percent
    FROM portfolios
  LOOP
    INSERT INTO portfolio_snapshots (
      portfolio_id,
      total_value,
      total_return,
      total_return_percent,
      snapshot_date
    )
    VALUES (
      v_portfolio.id,
      v_portfolio.total_value,
      v_portfolio.total_return,
      v_portfolio.total_return_percent,
      CURRENT_DATE
    )
    ON CONFLICT (portfolio_id, snapshot_date) DO UPDATE
    SET
      total_value = EXCLUDED.total_value,
      total_return = EXCLUDED.total_return,
      total_return_percent = EXCLUDED.total_return_percent;

    v_count := v_count + 1;
  END LOOP;

  RETURN v_count;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- COMMENTS
-- ============================================
COMMENT ON TABLE portfolios IS 'User investment portfolios';
COMMENT ON TABLE holdings IS 'Individual positions within portfolios';
COMMENT ON TABLE portfolio_followers IS 'Users following public portfolios';
COMMENT ON TABLE portfolio_snapshots IS 'Daily portfolio performance snapshots';
COMMENT ON FUNCTION calculate_portfolio_value IS 'Recalculates total portfolio value and returns';
COMMENT ON FUNCTION create_daily_portfolio_snapshots IS 'Creates daily performance snapshots for all portfolios';
