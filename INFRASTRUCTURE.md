# AIuditor Infrastructure Documentation

## Overview

AIuditor uses a lightweight, production-ready infrastructure stack designed for startup MVPs.

## Architecture

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       ├─── Next.js App Router (SSR + Client)
       │
       ├─── API Routes (/api/*)
       │    ├── /api/audit (save audits)
       │    ├── /api/lead (capture leads)
       │    ├── /api/ai-summary (AI summaries)
       │    ├── /api/test-db (testing)
       │    ├── /api/test-email (testing)
       │    └── /api/test-audit-save (testing)
       │
       ├─── Supabase (PostgreSQL)
       │    ├── audits table
       │    └── leads table
       │
       ├─── Anthropic API (Claude)
       │    └── AI-generated summaries
       │
       └─── Resend (Email)
            └── Transactional emails
```

## Components

### 1. Next.js App Router

**Purpose**: Server-side rendering, API routes, client components

**Key Features**:
- Server-side rendering for public reports (fast, SEO-friendly)
- API routes for backend logic
- Client components for interactive UI
- TypeScript for type safety

**Files**:
- `src/app/` - Pages and layouts
- `src/app/api/` - API routes
- `src/components/` - React components

### 2. Supabase (PostgreSQL)

**Purpose**: Database persistence

**Tables**:
- `audits` - Stores audit results with public slugs
- `leads` - Stores user information

**Features**:
- Row Level Security (RLS) enabled
- Public read access to audits
- Service role for writes
- JSONB for flexible data
- Indexes for performance

**Files**:
- `database/schema.sql` - Table definitions
- `database/seed.sql` - Test data
- `src/lib/supabase/` - Client configuration

### 3. Resend

**Purpose**: Transactional email delivery

**Features**:
- Professional HTML templates
- Plain text fallback
- High deliverability
- Development mode (onboarding@resend.dev)

**Files**:
- `src/lib/email/resend.ts` - Client configuration
- `src/lib/email/templates.ts` - Email templates

### 4. Persistence Layer

**Purpose**: Audit save/retrieve logic

**Features**:
- Generate URL-safe slugs (8 chars)
- Save audits to database
- Retrieve public-safe data
- Validate slug format

**Files**:
- `src/lib/audit/persistence.ts` - Core logic
- `src/lib/supabase/types.ts` - Type transformations

## Environment Variables

### Required Variables

```bash
# Supabase (Database)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key

# Resend (Email)
RESEND_API_KEY=re_your_api_key
FROM_EMAIL=AIuditor <onboarding@resend.dev>

# Anthropic (AI Summaries)
ANTHROPIC_API_KEY=sk-ant-your_api_key

# Application
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Variable Scope

**Client-side (exposed to browser)**:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_BASE_URL`

**Server-side only (never exposed)**:
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`
- `FROM_EMAIL`
- `ANTHROPIC_API_KEY`

### Validation

Environment variables are validated using `src/lib/env.ts`:

```typescript
import { validateServerEnv } from '@/lib/env';

const validation = validateServerEnv();
if (!validation.valid) {
  console.error(validation.errors);
}
```

## Database Schema

### Audits Table

```sql
CREATE TABLE audits (
  id UUID PRIMARY KEY,
  created_at TIMESTAMPTZ,
  public_slug TEXT UNIQUE,
  tool_data JSONB,
  recommendations JSONB,
  optimization_score JSONB,
  monthly_savings DECIMAL(10, 2),
  annual_savings DECIMAL(10, 2),
  current_monthly_spend DECIMAL(10, 2),
  metadata JSONB
);
```

**Indexes**:
- `idx_audits_public_slug` - Fast slug lookups
- `idx_audits_created_at` - Chronological queries
- `idx_audits_monthly_savings` - Sorting by savings

### Leads Table

```sql
CREATE TABLE leads (
  id UUID PRIMARY KEY,
  created_at TIMESTAMPTZ,
  email TEXT,
  company TEXT,
  role TEXT,
  team_size TEXT,
  audit_id UUID REFERENCES audits(id)
);
```

**Indexes**:
- `idx_leads_email` - Email lookups
- `idx_leads_audit_id` - Audit linkage
- `idx_leads_created_at` - Chronological queries

### Row Level Security

**Audits**:
- Public can SELECT (read)
- Service role can INSERT/UPDATE/DELETE

**Leads**:
- No public access
- Service role can INSERT/UPDATE/DELETE

## API Routes

### POST /api/audit

**Purpose**: Save audit result, generate public slug

**Request**:
```json
{
  "input": { "tools": [...], "teamSize": 3 },
  "savings": { ... },
  "score": { ... },
  "recommendations": [...],
  "auditedAt": "2024-01-15T10:00:00Z",
  "version": "1.0.0"
}
```

**Response**:
```json
{
  "success": true,
  "slug": "abc12345",
  "id": "uuid",
  "reportUrl": "http://localhost:3000/audit/abc12345"
}
```

### POST /api/lead

**Purpose**: Capture lead, send email

**Request**:
```json
{
  "email": "user@example.com",
  "company": "Startup Inc",
  "role": "CTO",
  "teamSize": "1-10",
  "auditId": "uuid",
  "reportUrl": "http://localhost:3000/audit/abc12345",
  "monthlySavings": 100,
  "annualSavings": 1200,
  "optimizationScore": 75
}
```

**Response**:
```json
{
  "success": true,
  "emailSent": true,
  "message": "Report sent to your email"
}
```

## Testing Routes

### GET /api/test-db

**Purpose**: Test database connectivity

**Response**:
```json
{
  "success": true,
  "tests": {
    "auditsTable": { "accessible": true, "count": 5 },
    "leadsTable": { "accessible": true, "count": 2 }
  }
}
```

### POST /api/test-email

**Purpose**: Test email sending

**Request**:
```json
{
  "email": "your@email.com"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Test email sent successfully"
}
```

### POST /api/test-audit-save

**Purpose**: Test complete audit persistence flow

**Response**:
```json
{
  "success": true,
  "tests": {
    "save": { "success": true, "slug": "abc12345" },
    "retrieve": { "success": true },
    "publicSafety": { "passed": true }
  }
}
```

## Security

### Public Data Safety

Public reports NEVER expose:
- Email addresses
- Company names
- Service role keys
- Internal metadata

Public reports ONLY expose:
- Tool names and categories
- Recommendations
- Savings calculations
- Optimization scores

### RLS Policies

- Audits: Public read, service role write
- Leads: No public access, service role only

### Environment Security

- `.env.local` in `.gitignore`
- Service role key server-only
- No secrets in client code
- Validation on all inputs

## Performance

### Database Queries

- Audit save: ~200ms
- Audit fetch: ~100ms
- Lead save: ~100ms

### Page Load Times

- Landing page: <2s
- Audit results: <1s
- Public report: <2s (SSR)

### Optimizations

- Server-side rendering for public reports
- Indexed database queries
- JSONB for flexible data
- Lazy client initialization

## Monitoring

### Key Metrics

- Database connection errors
- Email delivery failures
- API error rates
- Audit save success rate
- Lead capture conversion rate

### Logging

All errors logged to console:
- Server errors
- Database errors
- Email errors
- API errors

## Deployment

### Pre-Deployment

1. Run tests: `npm run build`
2. Type check: `npm run typecheck`
3. Lint: `npm run lint`
4. Test infrastructure: `./test-infrastructure.ps1`

### Production Setup

1. Create production Supabase project
2. Run `database/schema.sql`
3. Set production environment variables
4. Deploy to Vercel/Netlify
5. Verify domain in Resend (optional)
6. Remove or protect test routes

### Environment Variables (Production)

Same as development, but:
- Use production Supabase project
- Use production Resend API key
- Set `NEXT_PUBLIC_BASE_URL` to production domain
- Verify FROM_EMAIL domain

## Troubleshooting

### Database Connection Failed

**Symptoms**: `Could not find table 'audits'`

**Solution**:
1. Verify Supabase URL and keys
2. Run `database/schema.sql` in Supabase
3. Check RLS policies enabled
4. Test with `/api/test-db`

### Email Not Sending

**Symptoms**: Email not received

**Solution**:
1. Verify Resend API key
2. Check spam folder
3. Verify FROM_EMAIL format
4. Test with `/api/test-email`
5. Check Resend dashboard for errors

### Build Errors

**Symptoms**: Build fails with env errors

**Solution**:
1. Ensure lazy client initialization
2. Check `src/lib/supabase/client.ts`
3. Check `src/lib/supabase/server.ts`
4. Validate with `src/lib/env.ts`

## Cost Estimates

### Free Tier (MVP)

- Supabase: 500 MB database, 1 GB bandwidth
- Resend: 100 emails/day
- Vercel: Hobby plan
- **Total: $0/month**

### Early Growth (~1000 users)

- Supabase Pro: $25/month
- Resend Pro: $20/month
- Vercel Pro: $20/month
- **Total: ~$65/month**

## Files Reference

### Core Infrastructure

- `src/lib/env.ts` - Environment validation
- `src/lib/supabase/client.ts` - Browser client
- `src/lib/supabase/server.ts` - Server client
- `src/lib/supabase/types.ts` - Database types
- `src/lib/email/resend.ts` - Email client
- `src/lib/email/templates.ts` - Email templates
- `src/lib/audit/persistence.ts` - Audit persistence

### Database

- `database/schema.sql` - Table definitions
- `database/seed.sql` - Test data

### Testing

- `src/app/api/test-db/route.ts` - Database test
- `src/app/api/test-email/route.ts` - Email test
- `src/app/api/test-audit-save/route.ts` - Persistence test
- `src/lib/test/sample-data.ts` - Sample data
- `test-infrastructure.ps1` - Test script
- `INFRASTRUCTURE_QA.md` - QA checklist

### Documentation

- `INFRASTRUCTURE.md` - This file
- `docs/DATABASE_SCHEMA.md` - Schema details
- `docs/DAY4_SETUP.md` - Setup guide
- `docs/DAY4_COMPLETE.md` - Complete docs

## Support

For issues:
1. Check `INFRASTRUCTURE_QA.md` checklist
2. Run `./test-infrastructure.ps1`
3. Review error logs
4. Check Supabase dashboard
5. Check Resend dashboard

---

**Version**: 1.0.0
**Last Updated**: Day 4 Complete
**Status**: Production Ready
