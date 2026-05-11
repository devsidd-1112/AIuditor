# Database Schema

AIuditor uses Supabase (PostgreSQL) for persistence. This document describes the database schema and setup instructions.

## Tables

### `audits`

Stores complete audit results with public-safe sharing capability.

```sql
CREATE TABLE audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  public_slug TEXT NOT NULL UNIQUE,
  
  -- Normalized audit data
  tool_data JSONB NOT NULL,
  recommendations JSONB NOT NULL,
  overlap_data JSONB,
  
  -- Optimization metrics
  optimization_score JSONB NOT NULL,
  monthly_savings DECIMAL(10, 2) NOT NULL,
  annual_savings DECIMAL(10, 2) NOT NULL,
  current_monthly_spend DECIMAL(10, 2) NOT NULL,
  
  -- Metadata
  metadata JSONB NOT NULL
);

-- Indexes
CREATE INDEX idx_audits_public_slug ON audits(public_slug);
CREATE INDEX idx_audits_created_at ON audits(created_at DESC);
```

#### Field Descriptions

- `id`: Unique identifier (UUID)
- `created_at`: Timestamp of audit creation
- `public_slug`: Short, URL-safe identifier for public sharing (8 characters)
- `tool_data`: JSON containing tool stack information (no sensitive data)
- `recommendations`: Array of recommendation objects
- `overlap_data`: Optional overlap analysis results
- `optimization_score`: Score breakdown and rating
- `monthly_savings`: Potential monthly savings in USD
- `annual_savings`: Potential annual savings in USD
- `current_monthly_spend`: Current monthly spend in USD
- `metadata`: Audit engine version and timestamp

### `leads`

Stores lead information captured after value delivery.

```sql
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  email TEXT NOT NULL,
  company TEXT,
  role TEXT,
  team_size TEXT,
  audit_id UUID NOT NULL REFERENCES audits(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_audit_id ON leads(audit_id);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);
```

#### Field Descriptions

- `id`: Unique identifier (UUID)
- `created_at`: Timestamp of lead capture
- `email`: User's email address (required)
- `company`: Company name (optional)
- `role`: User's role (optional)
- `team_size`: Team size category (optional)
- `audit_id`: Reference to associated audit

## Setup Instructions

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Wait for database provisioning

### 2. Run Schema Migrations

In your Supabase SQL Editor, run the following:

```sql
-- Create audits table
CREATE TABLE audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  public_slug TEXT NOT NULL UNIQUE,
  tool_data JSONB NOT NULL,
  recommendations JSONB NOT NULL,
  overlap_data JSONB,
  optimization_score JSONB NOT NULL,
  monthly_savings DECIMAL(10, 2) NOT NULL,
  annual_savings DECIMAL(10, 2) NOT NULL,
  current_monthly_spend DECIMAL(10, 2) NOT NULL,
  metadata JSONB NOT NULL
);

CREATE INDEX idx_audits_public_slug ON audits(public_slug);
CREATE INDEX idx_audits_created_at ON audits(created_at DESC);

-- Create leads table
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  email TEXT NOT NULL,
  company TEXT,
  role TEXT,
  team_size TEXT,
  audit_id UUID NOT NULL REFERENCES audits(id) ON DELETE CASCADE
);

CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_audit_id ON leads(audit_id);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);
```

### 3. Configure Row Level Security (RLS)

For MVP, we'll use service role key for writes and allow public reads for audits:

```sql
-- Enable RLS
ALTER TABLE audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Allow public read access to audits by slug
CREATE POLICY "Allow public read access to audits"
  ON audits FOR SELECT
  USING (true);

-- Service role handles all writes (no public insert/update/delete)
```

### 4. Get API Keys

1. Go to Project Settings > API
2. Copy `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
3. Copy `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Copy `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (keep secret!)

### 5. Update Environment Variables

Add to `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Data Privacy

### Public Reports

Public audit reports (`/audit/[slug]`) expose:
- ✅ Tool names and categories
- ✅ Plan names
- ✅ Recommendations
- ✅ Savings calculations
- ✅ Optimization scores

Public reports DO NOT expose:
- ❌ Email addresses
- ❌ Company names
- ❌ User roles
- ❌ Exact seat counts
- ❌ Exact spending amounts (only savings)

### Lead Data

Lead information is stored separately and never exposed publicly. It's only accessible via service role key for internal use.

## Future Enhancements

Potential schema additions for future iterations:

- `users` table for authentication
- `organizations` table for team collaboration
- `audit_history` for tracking changes over time
- `recommendations_feedback` for user feedback on recommendations
- `api_keys` for programmatic access

## Maintenance

### Backup Strategy

Supabase provides automatic daily backups. For production:
- Enable Point-in-Time Recovery (PITR)
- Set up additional backup automation if needed
- Monitor database size and performance

### Data Retention

Consider implementing:
- Automatic deletion of audits older than 90 days
- Lead data retention policy
- GDPR compliance for EU users

## Monitoring

Key metrics to track:
- Audit creation rate
- Lead capture conversion rate
- Database size growth
- Query performance
- Error rates

Use Supabase Dashboard for monitoring or integrate with external tools.
