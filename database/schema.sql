-- ============================================
-- AIuditor Database Schema
-- PostgreSQL / Supabase
-- ============================================

-- Drop existing tables if recreating
-- DROP TABLE IF EXISTS leads CASCADE;
-- DROP TABLE IF EXISTS audits CASCADE;

-- ============================================
-- AUDITS TABLE
-- Stores complete audit results with public sharing
-- ============================================

CREATE TABLE audits (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Public sharing
  public_slug TEXT NOT NULL UNIQUE,
  
  -- Audit data (JSONB for flexibility)
  tool_data JSONB NOT NULL,
  recommendations JSONB NOT NULL,
  overlap_data JSONB,
  
  -- Optimization metrics (denormalized for fast queries)
  optimization_score JSONB NOT NULL,
  monthly_savings DECIMAL(10, 2) NOT NULL DEFAULT 0,
  annual_savings DECIMAL(10, 2) NOT NULL DEFAULT 0,
  current_monthly_spend DECIMAL(10, 2) NOT NULL DEFAULT 0,
  
  -- Metadata
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  
  -- Constraints
  CONSTRAINT audits_public_slug_length CHECK (char_length(public_slug) = 8),
  CONSTRAINT audits_monthly_savings_positive CHECK (monthly_savings >= 0),
  CONSTRAINT audits_annual_savings_positive CHECK (annual_savings >= 0),
  CONSTRAINT audits_current_spend_positive CHECK (current_monthly_spend >= 0)
);

-- Indexes for audits
CREATE INDEX idx_audits_public_slug ON audits(public_slug);
CREATE INDEX idx_audits_created_at ON audits(created_at DESC);
CREATE INDEX idx_audits_monthly_savings ON audits(monthly_savings DESC);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_audits_updated_at
  BEFORE UPDATE ON audits
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- LEADS TABLE
-- Stores user information captured after value delivery
-- ============================================

CREATE TABLE leads (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Lead information
  email TEXT NOT NULL,
  company TEXT,
  role TEXT,
  team_size TEXT,
  
  -- Link to audit
  audit_id UUID NOT NULL REFERENCES audits(id) ON DELETE CASCADE,
  
  -- Constraints
  CONSTRAINT leads_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Indexes for leads
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_audit_id ON leads(audit_id);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS
ALTER TABLE audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access to audits (for shareable reports)
CREATE POLICY "Allow public read access to audits"
  ON audits
  FOR SELECT
  USING (true);

-- Policy: Service role handles all writes
-- (No public insert/update/delete policies - handled via API routes with service role)

-- ============================================
-- COMMENTS (Documentation)
-- ============================================

COMMENT ON TABLE audits IS 'Stores AI spend audit results with public sharing capability';
COMMENT ON COLUMN audits.public_slug IS 'Short URL-safe identifier for public sharing (8 chars)';
COMMENT ON COLUMN audits.tool_data IS 'Tool stack information (no sensitive data)';
COMMENT ON COLUMN audits.recommendations IS 'Array of recommendation objects';
COMMENT ON COLUMN audits.overlap_data IS 'Optional overlap analysis results';

COMMENT ON TABLE leads IS 'Stores user information captured after showing audit value';
COMMENT ON COLUMN leads.email IS 'User email address (required)';
COMMENT ON COLUMN leads.audit_id IS 'Reference to associated audit report';

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Verify tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('audits', 'leads');

-- Verify indexes exist
SELECT indexname 
FROM pg_indexes 
WHERE schemaname = 'public' 
  AND tablename IN ('audits', 'leads');

-- Verify RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('audits', 'leads');
