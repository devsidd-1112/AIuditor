# Metrics & Analytics

## Overview

Metrics strategy for AIuditor MVP, focusing on actionable insights that drive product and growth decisions.

---

## Core Metrics (Day 1)

### 1. Audit Completion Rate
**Definition**: % of users who start and complete an audit

**Formula**: (Completed Audits / Started Audits) × 100

**Target**: > 70%

**Why It Matters**: Indicates form UX quality and value clarity

**Tracking**:
- Event: `audit_started`
- Event: `audit_completed`
- Event: `audit_abandoned` (with step)

---

### 2. Average Savings Identified
**Definition**: Mean monthly savings across all audits

**Formula**: Sum(Monthly Savings) / Total Audits

**Target**: $200-300/month

**Why It Matters**: Validates value proposition

**Tracking**:
- Property: `savings_monthly`
- Property: `savings_annual`
- Property: `savings_percentage`

---

### 3. Recommendation Distribution
**Definition**: Breakdown of recommendation types

**Categories**:
- Downgrade (enterprise → individual)
- Consolidation (overlapping tools)
- Seat optimization (unused seats)
- API optimization
- Already optimized

**Why It Matters**: Identifies most common optimization patterns

**Tracking**:
- Property: `recommendation_category`
- Property: `recommendation_count`

---

### 4. Tool Usage Distribution
**Definition**: Which tools users are auditing

**Metrics**:
- Most common tools
- Most common combinations
- Average tools per audit

**Why It Matters**: Guides pricing data priorities and marketing

**Tracking**:
- Property: `tools_audited` (array)
- Property: `tool_count`

---

## User Behavior Metrics (Week 1+)

### 5. Return Rate
**Definition**: % of users who complete multiple audits

**Formula**: (Users with 2+ Audits / Total Users) × 100

**Target**: > 20%

**Why It Matters**: Indicates ongoing value and engagement

**Tracking**:
- User ID (cookie or email)
- Event: `audit_completed` (count per user)

---

### 6. Share Rate
**Definition**: % of users who share results

**Formula**: (Shared Results / Completed Audits) × 100

**Target**: > 10%

**Why It Matters**: Drives organic growth

**Tracking**:
- Event: `results_shared`
- Property: `share_method` (twitter, linkedin, email, link)

---

### 7. Time to Complete
**Definition**: Median time from start to completion

**Target**: < 90 seconds

**Why It Matters**: Validates "60-second audit" claim

**Tracking**:
- Timestamp: `audit_started_at`
- Timestamp: `audit_completed_at`
- Calculated: `duration_seconds`

---

## Optimization Score Metrics (Day 2+)

### 8. Score Distribution
**Definition**: Breakdown of optimization scores

**Buckets**:
- Excellent (85-100)
- Good (70-84)
- Moderate (50-69)
- Poor (0-49)

**Why It Matters**: Validates scoring algorithm

**Tracking**:
- Property: `optimization_score`
- Property: `optimization_rating`

---

### 9. Score Components
**Definition**: Average scores for each component

**Components**:
- Plan efficiency
- Tool redundancy
- Seat utilization
- Enterprise overkill

**Why It Matters**: Identifies most common inefficiencies

**Tracking**:
- Property: `score_plan_efficiency`
- Property: `score_tool_redundancy`
- Property: `score_seat_utilization`
- Property: `score_enterprise_overkill`

---

## Conversion Metrics (Month 2+)

### 10. Email Capture Rate
**Definition**: % of users who provide email

**Formula**: (Emails Captured / Completed Audits) × 100

**Target**: > 30%

**Why It Matters**: Lead generation for future monetization

**Tracking**:
- Event: `email_captured`
- Property: `capture_timing` (pre_results, post_results)

---

### 11. Premium Conversion Rate
**Definition**: % of users who upgrade to premium

**Formula**: (Premium Subscribers / Total Users) × 100

**Target**: > 1%

**Why It Matters**: Revenue validation

**Tracking**:
- Event: `premium_subscribed`
- Property: `plan_type`
- Property: `mrr`

---

### 12. Churn Rate (Premium)
**Definition**: % of premium users who cancel monthly

**Formula**: (Cancellations / Active Subscribers) × 100

**Target**: < 10%

**Why It Matters**: Product-market fit indicator

**Tracking**:
- Event: `premium_cancelled`
- Property: `cancellation_reason`
- Property: `lifetime_days`

---

## Growth Metrics (Week 2+)

### 13. Traffic Sources
**Definition**: Where users are coming from

**Sources**:
- Organic search
- Direct
- Social (Twitter, LinkedIn, Reddit)
- Referral
- Paid

**Why It Matters**: Guides marketing investment

**Tracking**:
- Property: `utm_source`
- Property: `utm_medium`
- Property: `utm_campaign`
- Property: `referrer`

---

### 14. Viral Coefficient
**Definition**: How many new users each user brings

**Formula**: (Referred Users / Total Users)

**Target**: > 0.3 (30% viral growth)

**Why It Matters**: Organic growth potential

**Tracking**:
- Property: `referral_code`
- Event: `referred_user_signup`

---

### 15. Week-over-Week Growth
**Definition**: % increase in audits week-over-week

**Formula**: ((This Week - Last Week) / Last Week) × 100

**Target**: > 20% (early stage)

**Why It Matters**: Growth trajectory indicator

**Tracking**:
- Aggregate: Weekly audit count
- Calculated: WoW growth rate

---

## Quality Metrics (Month 1+)

### 16. Recommendation Confidence
**Definition**: Average confidence score of recommendations

**Formula**: Mean(Confidence Scores)

**Target**: > 0.75

**Why It Matters**: Validates rule quality

**Tracking**:
- Property: `recommendation_confidence`
- Property: `recommendation_severity`

---

### 17. User Feedback Score
**Definition**: Satisfaction rating (if collected)

**Scale**: 1-5 stars or thumbs up/down

**Target**: > 4.0 / 5.0

**Why It Matters**: Product quality signal

**Tracking**:
- Event: `feedback_submitted`
- Property: `rating`
- Property: `feedback_text`

---

### 18. Action Taken Rate
**Definition**: % of users who report taking action

**Formula**: (Actions Taken / Completed Audits) × 100

**Target**: > 30%

**Why It Matters**: Real-world impact validation

**Tracking**:
- Event: `action_taken`
- Property: `action_type` (downgraded, cancelled, consolidated)
- Property: `actual_savings`

---

## Technical Metrics (Ongoing)

### 19. Error Rate
**Definition**: % of audits that encounter errors

**Formula**: (Failed Audits / Total Attempts) × 100

**Target**: < 1%

**Why It Matters**: Technical quality

**Tracking**:
- Event: `audit_error`
- Property: `error_type`
- Property: `error_message`

---

### 20. Page Load Time
**Definition**: Time to interactive for landing page

**Target**: < 2 seconds

**Why It Matters**: User experience and SEO

**Tracking**:
- Metric: `page_load_time`
- Metric: `time_to_interactive`

---

## Dashboard Views

### Executive Dashboard (Weekly Review)
- Total audits (WoW growth)
- Average savings identified
- Completion rate
- Share rate
- Top traffic sources

### Product Dashboard (Daily Review)
- Audit completion funnel
- Time to complete
- Error rate
- Recommendation distribution
- Score distribution

### Growth Dashboard (Weekly Review)
- New users
- Return rate
- Viral coefficient
- Traffic sources
- Conversion rates

---

## Analytics Stack

### MVP (Day 1-7)
**Tool**: Vercel Analytics (built-in)

**Pros**: Free, simple, privacy-friendly
**Cons**: Limited custom events

---

### Phase 2 (Week 2+)
**Tool**: PostHog or Plausible

**Pros**: Self-hosted option, custom events, funnels
**Cons**: Setup required

---

### Phase 3 (Month 2+)
**Tool**: Mixpanel or Amplitude

**Pros**: Advanced analytics, cohort analysis, retention
**Cons**: Cost at scale

---

## Privacy & Compliance

### Data Collection Principles
- No PII without consent
- Anonymous by default
- Clear opt-in for email
- GDPR compliant
- No third-party tracking pixels

### Data Retention
- Anonymous events: 2 years
- User data: Until deletion requested
- Audit results: 90 days (unless saved)

---

## Key Performance Indicators (KPIs)

### Week 1
- 50 completed audits
- 70% completion rate
- $200+ average savings

### Month 1
- 500 completed audits
- 20% return rate
- 10% share rate

### Month 3
- 5,000 completed audits
- 30% return rate
- 15% share rate
- 50 email captures

### Month 6
- 20,000 completed audits
- 100 premium subscribers
- $1,500 MRR
- < 10% churn

---

## Reporting Cadence

### Daily (Internal)
- Audits completed
- Errors encountered
- User feedback

### Weekly (Team)
- Growth metrics
- Completion funnel
- Top recommendations

### Monthly (Stakeholders)
- User growth
- Revenue (if applicable)
- Product improvements
- Roadmap progress

---

## A/B Testing Framework (Future)

### Test Ideas
1. Headline variations
2. CTA button text
3. Email capture timing
4. Results page layout
5. Recommendation presentation

### Testing Tool
- Vercel Edge Config (simple)
- PostHog (advanced)
- Custom implementation

---

## Last Updated

**Day 2** — Comprehensive metrics framework added with 20 core metrics, dashboard views, and KPI targets.
