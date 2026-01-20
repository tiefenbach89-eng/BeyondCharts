-- ============================================
-- BEYOND CHARTS 2.0 - TRADING SIGNALS SYSTEM
-- Migration: Trading Signals & Performance Tracking
-- Date: 2026-01-20
-- ============================================

-- ============================================
-- 1. TRADING SIGNALS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS signals (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  ticker TEXT NOT NULL,
  asset_type TEXT NOT NULL DEFAULT 'stock', -- stock, etf, crypto
  asset_name TEXT,
  signal_type TEXT NOT NULL, -- BUY, SELL, HOLD
  confidence INTEGER CHECK (confidence BETWEEN 1 AND 10),
  reason TEXT NOT NULL,
  analysis TEXT, -- Detailed analysis
  target_price DECIMAL(15, 4),
  stop_loss DECIMAL(15, 4),
  entry_price DECIMAL(15, 4), -- Actual price when signal was given
  premium_only BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'active', -- active, closed, expired
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  closed_at TIMESTAMPTZ,
  tags TEXT[] DEFAULT '{}'
);

-- Indexes
CREATE INDEX idx_signals_ticker ON signals(ticker);
CREATE INDEX idx_signals_type ON signals(signal_type);
CREATE INDEX idx_signals_status ON signals(status);
CREATE INDEX idx_signals_created_at ON signals(created_at DESC);
CREATE INDEX idx_signals_asset_type ON signals(asset_type);
CREATE INDEX idx_signals_premium ON signals(premium_only);

-- Auto-update updated_at
CREATE TRIGGER update_signals_updated_at
  BEFORE UPDATE ON signals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 2. SIGNAL PERFORMANCE TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS signal_performance (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  signal_id TEXT NOT NULL REFERENCES signals(id) ON DELETE CASCADE,
  entry_price DECIMAL(15, 4) NOT NULL,
  exit_price DECIMAL(15, 4) NOT NULL,
  return_amount DECIMAL(15, 4),
  return_percent DECIMAL(8, 4),
  outcome TEXT NOT NULL, -- win, loss, neutral
  days_held INTEGER,
  closed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_signal_performance_signal_id ON signal_performance(signal_id);
CREATE INDEX idx_signal_performance_outcome ON signal_performance(outcome);
CREATE INDEX idx_signal_performance_closed_at ON signal_performance(closed_at DESC);

-- ============================================
-- 3. USER SIGNAL ALERTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS signal_alerts (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  signal_id TEXT NOT NULL REFERENCES signals(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL, -- email, push, sms
  sent_at TIMESTAMPTZ,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, signal_id, alert_type)
);

-- Indexes
CREATE INDEX idx_signal_alerts_user_id ON signal_alerts(user_id);
CREATE INDEX idx_signal_alerts_signal_id ON signal_alerts(signal_id);
CREATE INDEX idx_signal_alerts_sent ON signal_alerts(sent_at) WHERE sent_at IS NOT NULL;

-- ============================================
-- 4. USER SIGNAL FOLLOWS (Follow specific tickers)
-- ============================================
CREATE TABLE IF NOT EXISTS signal_follows (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ticker TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, ticker)
);

-- Indexes
CREATE INDEX idx_signal_follows_user_id ON signal_follows(user_id);
CREATE INDEX idx_signal_follows_ticker ON signal_follows(ticker);

-- ============================================
-- 5. ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS
ALTER TABLE signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE signal_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE signal_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE signal_follows ENABLE ROW LEVEL SECURITY;

-- SIGNALS POLICIES
-- Everyone can read non-premium signals
CREATE POLICY "Anyone can read free signals"
  ON signals FOR SELECT
  TO public
  USING (premium_only = false);

-- Authenticated users can read all signals (for future premium features)
CREATE POLICY "Authenticated users can read all signals"
  ON signals FOR SELECT
  TO authenticated
  USING (true);

-- Admins can manage signals
CREATE POLICY "Admins can manage signals"
  ON signals FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- SIGNAL PERFORMANCE POLICIES
-- Everyone can read performance data
CREATE POLICY "Anyone can read signal performance"
  ON signal_performance FOR SELECT
  TO public
  USING (true);

-- Admins can manage performance data
CREATE POLICY "Admins can manage signal performance"
  ON signal_performance FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- SIGNAL ALERTS POLICIES
-- Users can read their own alerts
CREATE POLICY "Users can read own alerts"
  ON signal_alerts FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Users can update their own alerts (mark as read)
CREATE POLICY "Users can update own alerts"
  ON signal_alerts FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Service role can create alerts
CREATE POLICY "Service role can create alerts"
  ON signal_alerts FOR INSERT
  TO service_role
  WITH CHECK (true);

-- SIGNAL FOLLOWS POLICIES
-- Users can manage their own follows
CREATE POLICY "Users can manage own follows"
  ON signal_follows FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- ============================================
-- 6. HELPER FUNCTIONS
-- ============================================

-- Function to close a signal and record performance
CREATE OR REPLACE FUNCTION close_signal(
  p_signal_id TEXT,
  p_exit_price DECIMAL(15, 4),
  p_notes TEXT DEFAULT NULL
)
RETURNS VOID AS $$
DECLARE
  v_signal RECORD;
  v_return_amount DECIMAL(15, 4);
  v_return_percent DECIMAL(8, 4);
  v_outcome TEXT;
  v_days_held INTEGER;
BEGIN
  -- Get signal details
  SELECT * INTO v_signal
  FROM signals
  WHERE id = p_signal_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Signal not found';
  END IF;

  -- Calculate returns
  IF v_signal.signal_type = 'BUY' THEN
    v_return_amount := p_exit_price - v_signal.entry_price;
    v_return_percent := ((p_exit_price - v_signal.entry_price) / v_signal.entry_price) * 100;
  ELSIF v_signal.signal_type = 'SELL' THEN
    v_return_amount := v_signal.entry_price - p_exit_price;
    v_return_percent := ((v_signal.entry_price - p_exit_price) / v_signal.entry_price) * 100;
  ELSE
    v_return_amount := 0;
    v_return_percent := 0;
  END IF;

  -- Determine outcome
  IF v_return_percent > 1 THEN
    v_outcome := 'win';
  ELSIF v_return_percent < -1 THEN
    v_outcome := 'loss';
  ELSE
    v_outcome := 'neutral';
  END IF;

  -- Calculate days held
  v_days_held := EXTRACT(DAY FROM NOW() - v_signal.created_at)::INTEGER;

  -- Insert performance record
  INSERT INTO signal_performance (
    signal_id,
    entry_price,
    exit_price,
    return_amount,
    return_percent,
    outcome,
    days_held,
    notes
  ) VALUES (
    p_signal_id,
    v_signal.entry_price,
    p_exit_price,
    v_return_amount,
    v_return_percent,
    v_outcome,
    v_days_held,
    p_notes
  );

  -- Update signal status
  UPDATE signals
  SET
    status = 'closed',
    closed_at = NOW(),
    updated_at = NOW()
  WHERE id = p_signal_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get signal statistics
CREATE OR REPLACE FUNCTION get_signal_stats()
RETURNS TABLE (
  total_signals BIGINT,
  active_signals BIGINT,
  closed_signals BIGINT,
  win_rate DECIMAL(5, 2),
  avg_return DECIMAL(8, 4),
  total_wins BIGINT,
  total_losses BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::BIGINT as total_signals,
    COUNT(*) FILTER (WHERE status = 'active')::BIGINT as active_signals,
    COUNT(*) FILTER (WHERE status = 'closed')::BIGINT as closed_signals,
    COALESCE(
      (COUNT(*) FILTER (WHERE sp.outcome = 'win')::DECIMAL /
       NULLIF(COUNT(sp.id), 0) * 100),
      0
    )::DECIMAL(5, 2) as win_rate,
    COALESCE(AVG(sp.return_percent), 0)::DECIMAL(8, 4) as avg_return,
    COUNT(*) FILTER (WHERE sp.outcome = 'win')::BIGINT as total_wins,
    COUNT(*) FILTER (WHERE sp.outcome = 'loss')::BIGINT as total_losses
  FROM signals s
  LEFT JOIN signal_performance sp ON s.id = sp.signal_id;
END;
$$ LANGUAGE plpgsql;

-- Function to auto-expire old signals (call via cron)
CREATE OR REPLACE FUNCTION expire_old_signals()
RETURNS INTEGER AS $$
DECLARE
  v_count INTEGER;
BEGIN
  WITH updated AS (
    UPDATE signals
    SET
      status = 'expired',
      updated_at = NOW()
    WHERE
      status = 'active'
      AND expires_at IS NOT NULL
      AND expires_at < NOW()
    RETURNING id
  )
  SELECT COUNT(*)::INTEGER INTO v_count FROM updated;

  RETURN v_count;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 7. VIEWS FOR COMMON QUERIES
-- ============================================

-- Active signals with performance stats
CREATE OR REPLACE VIEW active_signals_view AS
SELECT
  s.id,
  s.ticker,
  s.asset_type,
  s.asset_name,
  s.signal_type,
  s.confidence,
  s.reason,
  s.target_price,
  s.stop_loss,
  s.entry_price,
  s.premium_only,
  s.created_at,
  s.expires_at,
  s.tags,
  -- Calculate days active
  EXTRACT(DAY FROM NOW() - s.created_at)::INTEGER as days_active
FROM signals s
WHERE s.status = 'active'
ORDER BY s.created_at DESC;

-- Signal performance leaderboard
CREATE OR REPLACE VIEW signal_leaderboard_view AS
SELECT
  s.ticker,
  s.asset_type,
  COUNT(sp.id) as total_closed,
  COUNT(*) FILTER (WHERE sp.outcome = 'win') as wins,
  COUNT(*) FILTER (WHERE sp.outcome = 'loss') as losses,
  COALESCE(
    (COUNT(*) FILTER (WHERE sp.outcome = 'win')::DECIMAL /
     NULLIF(COUNT(sp.id), 0) * 100),
    0
  )::DECIMAL(5, 2) as win_rate,
  AVG(sp.return_percent)::DECIMAL(8, 4) as avg_return,
  SUM(sp.return_amount)::DECIMAL(15, 4) as total_return
FROM signals s
INNER JOIN signal_performance sp ON s.id = sp.signal_id
GROUP BY s.ticker, s.asset_type
ORDER BY win_rate DESC, avg_return DESC;

-- ============================================
-- COMMENTS
-- ============================================
COMMENT ON TABLE signals IS 'Trading signals (BUY/SELL/HOLD recommendations)';
COMMENT ON TABLE signal_performance IS 'Historical performance tracking for closed signals';
COMMENT ON TABLE signal_alerts IS 'User notification preferences for signals';
COMMENT ON TABLE signal_follows IS 'Users following specific ticker signals';
COMMENT ON FUNCTION close_signal IS 'Closes a signal and records its performance';
COMMENT ON FUNCTION get_signal_stats IS 'Returns overall signal performance statistics';
COMMENT ON FUNCTION expire_old_signals IS 'Auto-expires signals past their expiry date';
