-- ============================================
-- Migration: Add Narrative Data Support
-- Adds narrative engine output storage to audits table
-- ============================================

-- Add narrative_data column to store executive audit report
ALTER TABLE audits 
ADD COLUMN IF NOT EXISTS narrative_data JSONB;

-- Add index for narrative queries
CREATE INDEX IF NOT EXISTS idx_audits_narrative_data ON audits USING GIN (narrative_data);

-- Add comment
COMMENT ON COLUMN audits.narrative_data IS 'Executive audit report with narrative explanations (V2 Narrative Engine)';

-- Verify column was added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'audits' 
  AND column_name = 'narrative_data';
