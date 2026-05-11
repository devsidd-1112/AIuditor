# Pricing Data

## Overview

Comprehensive pricing intelligence for AI tools, centralized in `src/data/pricing.ts`. This is the single source of truth for all pricing-related logic in the audit engine.

---

## Tracked Tools (8 Total)

### 1. Cursor
**Category**: Coding Assistant

**Plans**:
- **Free (Hobby)**: $0/month
- **Pro**: $20/month
- **Pro+**: $60/month
- **Ultra**: $200/month
- **Teams**: $40/user/month (Enterprise)

**Enterprise Features** (Teams):
- SSO, SCIM, Audit Logs
- Centralized Billing
- Admin Controls

**Key Insight**: Small teams (< 5) often overpay for Teams plan when Pro ($20) provides core functionality.

**Overlaps With**: GitHub Copilot, Windsurf

---

### 2. ChatGPT
**Category**: General Chat Assistant

**Plans**:
- **Free**: $0/month
- **Plus**: $20/month
- **Team**: $25/user/month (min 2 seats)
- **Enterprise**: ~$60/user/month (custom, min 50 seats)

**Enterprise Features** (Team/Enterprise):
- Centralized Billing, Admin Controls
- SSO, SCIM (Enterprise only)
- Audit Logs (Enterprise only)

**Key Insight**: For teams ≤ 3, individual Plus subscriptions are cheaper than Team plan.

**Overlaps With**: Claude, Gemini

---

### 3. Claude
**Category**: General Chat Assistant

**Plans**:
- **Free**: $0/month
- **Pro**: $20/month
- **Team**: $30/user/month (min 5 seats)

**Enterprise Features** (Team):
- Centralized Billing
- Admin Controls

**Key Insight**: Strong for long-form writing and analysis. Often subscribed alongside ChatGPT, creating overlap.

**Overlaps With**: ChatGPT, Gemini

---

### 4. Gemini
**Category**: General Chat Assistant

**Plans**:
- **Free**: $0/month
- **Advanced**: $20/month

**Key Insight**: Google integration is main differentiator. Often third subscription in chat assistant stack.

**Overlaps With**: ChatGPT, Claude

---

### 5. GitHub Copilot
**Category**: Coding Assistant

**Plans**:
- **Individual**: $10/month
- **Business**: $19/user/month
- **Enterprise**: $39/user/month

**Enterprise Features** (Business/Enterprise):
- Centralized Billing, Admin Controls
- SSO, Audit Logs (Enterprise only)
- Custom Limits (Enterprise only)

**Key Insight**: Most affordable coding assistant. Often overlaps with Cursor or Windsurf.

**Overlaps With**: Cursor, Windsurf

---

### 6. Windsurf
**Category**: Coding Assistant

**Plans**:
- **Free**: $0/month
- **Pro**: $15/month

**Key Insight**: Newer player in coding assistant space. Often third subscription in coding stack.

**Overlaps With**: Cursor, GitHub Copilot

---

### 7. OpenAI API
**Category**: API Provider

**Pricing Model**: Pay-as-you-go (usage-based)

**Model Pricing** (per 1M tokens):
- **GPT-4o**: $2.50 input / $10.00 output
- **GPT-4o-mini**: $0.15 input / $0.60 output
- **GPT-3.5-turbo**: $0.50 input / $1.50 output

**Key Insight**: For high-volume programmatic usage, API may be more cost-effective than subscriptions.

**Overlaps With**: Anthropic API

---

### 8. Anthropic API
**Category**: API Provider

**Pricing Model**: Pay-as-you-go (usage-based)

**Model Pricing** (per 1M tokens):
- **Claude 3 Opus**: $15.00 input / $75.00 output
- **Claude 3 Sonnet**: $3.00 input / $15.00 output
- **Claude 3 Haiku**: $0.25 input / $1.25 output

**Key Insight**: Premium pricing reflects model quality. Haiku competitive with GPT-4o-mini.

**Overlaps With**: OpenAI API

---

## Overlap Clusters

### Coding Assistants (High Overlap: 70-90%)
- Cursor
- GitHub Copilot
- Windsurf

**Common Pattern**: Developers subscribe to multiple "just in case" but primarily use one.

**Recommendation**: Choose one primary tool based on workflow preferences.

---

### General Chat Assistants (Medium-High Overlap: 60-80%)
- ChatGPT
- Claude
- Gemini

**Common Pattern**: Teams subscribe to all three for "access to best models."

**Reality**: Most use cases can be served by one primary tool.

**Recommendation**: Consolidate to 1-2 tools based on specific strengths needed.

---

### API Providers (Medium Overlap: 50-70%)
- OpenAI API
- Anthropic API

**Common Pattern**: Using both APIs for model diversity.

**Consideration**: Legitimate use case for some applications, but evaluate actual usage.

---

## Enterprise Feature Analysis

### When Enterprise Features Matter

**Rarely Needed (< 10 people)**:
- SSO (Single Sign-On)
- SCIM (user provisioning)
- Audit logs
- Centralized billing (manageable manually)

**Sometimes Needed (10-50 people)**:
- Depends on security requirements
- Compliance needs (SOC 2, HIPAA)
- IT admin overhead

**Usually Needed (50+ people)**:
- SSO becomes valuable
- Audit logs for compliance
- Centralized billing essential
- Admin controls important

### Common Overkill Patterns

1. **3-person startup on Cursor Teams** ($120/month)
   - Could use Cursor Pro ($20/month)
   - Savings: $100/month

2. **2-person team on ChatGPT Team** ($50/month)
   - Could use 2x ChatGPT Plus ($40/month)
   - Savings: $10/month

3. **5-person team on Copilot Enterprise** ($195/month)
   - Could use Copilot Business ($95/month)
   - Savings: $100/month

---

## Pricing Update Strategy

### Current Approach (MVP)
- Manual updates to `src/data/pricing.ts`
- Quarterly pricing reviews
- User-reported changes

### Future Enhancements (Post-MVP)
- Automated pricing scraping
- Real-time pricing updates
- Historical pricing tracking
- Price change notifications

---

## Research Sources

- Official tool websites
- Pricing pages (as of May 2026)
- User reports and community discussions
- Direct testing of free/trial tiers

---

## Notes

- All pricing in USD
- Monthly billing assumed
- Annual discounts not yet factored in
- Enterprise pricing often custom (estimates used)
- API pricing subject to frequent changes

---

## Last Updated

**Day 2** — Comprehensive pricing intelligence added for 8 tools with 25+ plans configured.
