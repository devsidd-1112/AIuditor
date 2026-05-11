-- ============================================
-- Test Data Seeds
-- For local development and testing
-- ============================================

-- Sample audit 1: High savings opportunity
INSERT INTO audits (
  public_slug,
  tool_data,
  recommendations,
  overlap_data,
  optimization_score,
  monthly_savings,
  annual_savings,
  current_monthly_spend,
  metadata
) VALUES (
  'test0001',
  '{
    "tools": [
      {
        "toolId": "cursor",
        "toolName": "Cursor",
        "planId": "cursor-teams",
        "planName": "Teams",
        "monthlySpend": 120,
        "seats": 3,
        "category": "coding_assistant"
      },
      {
        "toolId": "chatgpt",
        "toolName": "ChatGPT",
        "planId": "chatgpt-team",
        "planName": "Team",
        "monthlySpend": 75,
        "seats": 3,
        "category": "general_chat"
      }
    ],
    "teamSize": 3
  }'::jsonb,
  '[
    {
      "id": "rec-1",
      "category": "downgrade",
      "severity": "high",
      "confidence": 0.9,
      "title": "Downgrade Cursor from Teams to Pro",
      "description": "Your team of 3 would save by using individual Pro plans",
      "reasoning": "Teams plan is designed for 5+ users with collaboration needs",
      "affectedTools": ["cursor"],
      "suggestion": "Switch to 3 individual Cursor Pro subscriptions",
      "actionable": true,
      "savings": {
        "monthly": 60,
        "annual": 720,
        "percentage": 50
      },
      "metadata": {
        "currentPlan": "Teams",
        "suggestedPlan": "Pro",
        "currentSeats": 3
      }
    }
  ]'::jsonb,
  null,
  '{
    "overall": 65,
    "breakdown": {
      "planEfficiency": 60,
      "toolRedundancy": 75,
      "seatUtilization": 70,
      "enterpriseOverkill": 55
    },
    "rating": "moderate"
  }'::jsonb,
  60.00,
  720.00,
  195.00,
  '{
    "version": "1.0.0",
    "auditedAt": "2024-01-15T10:30:00Z"
  }'::jsonb
);

-- Sample audit 2: Already optimized
INSERT INTO audits (
  public_slug,
  tool_data,
  recommendations,
  overlap_data,
  optimization_score,
  monthly_savings,
  annual_savings,
  current_monthly_spend,
  metadata
) VALUES (
  'test0002',
  '{
    "tools": [
      {
        "toolId": "cursor",
        "toolName": "Cursor",
        "planId": "cursor-pro",
        "planName": "Pro",
        "monthlySpend": 20,
        "seats": 1,
        "category": "coding_assistant"
      },
      {
        "toolId": "chatgpt",
        "toolName": "ChatGPT",
        "planId": "chatgpt-plus",
        "planName": "Plus",
        "monthlySpend": 20,
        "seats": 1,
        "category": "general_chat"
      }
    ],
    "teamSize": 1
  }'::jsonb,
  '[
    {
      "id": "rec-optimized",
      "category": "already_optimized",
      "severity": "low",
      "confidence": 0.9,
      "title": "Your AI stack is well-optimized",
      "description": "No major optimization opportunities detected",
      "reasoning": "Individual plans are appropriate for solo usage",
      "affectedTools": [],
      "suggestion": "Continue monitoring usage quarterly",
      "actionable": false,
      "savings": {
        "monthly": 0,
        "annual": 0,
        "percentage": 0
      }
    }
  ]'::jsonb,
  null,
  '{
    "overall": 92,
    "breakdown": {
      "planEfficiency": 95,
      "toolRedundancy": 90,
      "seatUtilization": 100,
      "enterpriseOverkill": 85
    },
    "rating": "excellent"
  }'::jsonb,
  0.00,
  0.00,
  40.00,
  '{
    "version": "1.0.0",
    "auditedAt": "2024-01-15T11:00:00Z"
  }'::jsonb
);

-- Sample lead for audit 1
INSERT INTO leads (
  email,
  company,
  role,
  team_size,
  audit_id
) VALUES (
  'test@example.com',
  'Test Startup Inc',
  'CTO',
  '1-10',
  (SELECT id FROM audits WHERE public_slug = 'test0001')
);

-- Verification queries
SELECT 
  public_slug,
  monthly_savings,
  annual_savings,
  (optimization_score->>'overall')::int as score,
  created_at
FROM audits
ORDER BY created_at DESC;

SELECT 
  email,
  company,
  role,
  created_at
FROM leads
ORDER BY created_at DESC;
