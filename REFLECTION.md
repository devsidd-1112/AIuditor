# Reflection

## 1. What was the hardest bug you faced? (150-400 words)

The hardest bug was actually a design flaw, not a traditional bug: **automatic price calculation inconsistency in the tool input form**.

When users selected certain tools like Cursor Teams or ChatGPT Team, the monthly spend would auto-calculate correctly based on per-seat pricing. But for other tools, changing the seat count wouldn't update the price, creating an inconsistent and confusing experience.

The root cause was in `handlePlanChange()` and `handleSeatsChange()` functions in `tool-row-fixed.tsx`. The plan change handler calculated initial prices correctly, but the seats change handler only updated the seat count without recalculating the monthly spend for per-seat plans.

What made this particularly tricky was that it worked correctly for some tools but not others, depending on whether users changed plans or seats first. This intermittent behavior made it hard to reproduce consistently.

The fix required ensuring both handlers properly calculated per-seat pricing:
```typescript
// In handleSeatsChange
if (selectedPlan.pricingModel === 'per_seat') {
  const seatPrice = selectedPlan.price;
  const newMonthlySpend = seatPrice * newSeats;
  setMonthlySpend(newMonthlySpend);
}
```

This taught me that **consistency in user experience is critical**. When one interaction pattern works differently from another, users lose trust in the tool. It also reinforced the importance of testing all user paths, not just the happy path.

The lesson: UX bugs are often harder to catch than logic bugs because they require thinking through every possible user interaction sequence.

---

## 2. What's one decision you reversed? Why? (150-400 words)

I initially decided to use **AI-generated recommendations** for the core audit logic, thinking it would provide more nuanced and contextual advice. The plan was to send tool data to GPT-4 and have it generate personalized savings recommendations.

After implementing a prototype, I completely reversed this decision and switched to **100% deterministic, rule-based logic**.

**Why I reversed it:**

1. **Trust**: Financial recommendations need to be explainable. When I tested the AI version, I couldn't confidently explain WHY it recommended something. "The AI said so" doesn't build trust.

2. **Consistency**: The same input would sometimes produce different recommendations. For a financial tool, this is unacceptable. Users need reproducible results.

3. **Cost**: Every audit would cost $0.02-0.05 in API fees. At scale, this becomes expensive and creates a dependency on external services.

4. **Speed**: AI calls added 2-3 seconds of latency. The deterministic version runs in <50ms.

5. **Debugging**: When recommendations seemed wrong, I couldn't debug them. With rules, I can trace exactly why each recommendation was made.

**The better approach:**

Keep the core logic deterministic and rule-based, but use AI for enhancement:
- Generate executive summaries (narrative layer)
- Personalize language and tone
- Create human-readable explanations

This gives us the best of both worlds: trustworthy, explainable core logic with AI-enhanced presentation.

**Lesson learned**: The "cool" technical solution (AI everything!) isn't always the right product solution. Sometimes boring, deterministic code is exactly what users need.

---

## 3. If you had another week, what would you build? (150-400 words)

If I had another week (Week 2), I would focus on three areas: **validation, intelligence, and distribution**.

### 1. Real User Validation (Days 8-10)
**Priority: Highest**

Conduct 10-15 user interviews with actual startup founders and engineering managers. Show them the tool, watch them use it, and gather feedback on:
- Are the recommendations believable?
- Is the savings estimate conservative enough?
- What's missing from the audit?
- Would they share this with their team?

This would validate (or invalidate) core assumptions and guide all future development.

### 2. Enhanced Intelligence (Days 11-12)
**Priority: High**

Add three features that increase recommendation quality:
- **Usage-based optimization**: "You're paying for 5 Cursor seats but only 2 are active"
- **Seasonal recommendations**: "Consider annual billing for 20% savings"
- **Benchmark insights**: "Similar 5-person teams spend $180/month on average"

These would require integrating with tool APIs (where available) or asking users for usage data.

### 3. Distribution & Growth (Days 13-14)
**Priority: Medium**

Build features that encourage sharing and word-of-mouth:
- **Comparison mode**: "Compare your stack with your co-founder's"
- **Team dashboard**: "Track optimization over time"
- **Slack integration**: "Get monthly spend alerts"
- **Referral system**: "Invite your network, get premium features"

The goal: turn users into advocates.

### What I Wouldn't Build

- User authentication (not needed yet)
- Payment system (freemium can wait)
- Admin dashboard (manual ops are fine)
- Mobile app (web works great)

**Philosophy**: Week 2 should be about validation and distribution, not features. The product works. Now we need to prove people want it and will share it.

---

## 4. How did you use AI tools? Be specific. (150-400 words)

I used AI tools extensively, but strategically. Here's exactly how:

### Cursor AI (Primary Tool)
**Used for:**
- Code completion and boilerplate generation (~30% time savings)
- Refactoring suggestions (especially TypeScript type improvements)
- Quick documentation generation (JSDoc comments)

**Example**: When building the narrative engine, Cursor suggested consistent function signatures across all 8 narrative generators, which I refined and standardized.

**Not used for**: Core business logic, financial calculations, or architecture decisions.

### ChatGPT-4 (Planning & Research)
**Used for:**
- Pricing research validation (cross-checking official sources)
- Documentation structure (README, ARCHITECTURE outlines)
- Copy variations (landing page headlines, 5 alternatives generated)
- Interview question templates (USER_INTERVIEWS.md structure)

**Example prompt**: "Write 5 headline variations for an AI spend audit tool targeting startup founders. Focus on pain points and quick value."

**Not used for**: Final copy (always heavily edited), product decisions, or technical implementation.

### Claude (Long-form Writing)
**Used for:**
- DEVLOG entries (initial drafts, then heavily edited)
- Architecture documentation (explaining complex flows)
- Business planning docs (ECONOMICS.md, GTM.md outlines)

**Example**: Generated initial draft of Engine V2 architecture explanation, which I then rewrote to match actual implementation.

### GitHub Copilot (Minimal Use)
**Used for:**
- Test case generation (suggested test scenarios)
- Type definitions (autocomplete for complex interfaces)

### What I Learned

**AI is best for**:
- First drafts (then refine heavily)
- Boilerplate code (then customize)
- Exploring alternatives (then decide)

**AI is worst for**:
- Final decisions (requires human judgment)
- Business logic (needs domain expertise)
- User experience (needs empathy)

**Key principle**: AI accelerates, but humans decide. Every AI-generated output was reviewed, edited, and often rewritten. The final product reflects human judgment, not AI output.

---

## 5. Rate yourself 1-10 on: (150-400 words total)

### Code Quality: 8/10
**Strengths**: Clean architecture, strong TypeScript typing, readable code, good separation of concerns. The audit engine is modular and maintainable. Each rule is self-contained and easy to understand.

**Weaknesses**: Limited test coverage (only 8 tests for MVP), some components could be further decomposed, and a few `any` types remain in form handlers. Would benefit from more comprehensive error handling.

### Product Thinking: 9/10
**Strengths**: Strong focus on honesty-first design, conservative estimates, and "already optimized" support. Clear understanding of target user pain points. Deterministic logic was the right choice for trust-building.

**Weaknesses**: Haven't validated with real users yet (interviews planned but not conducted). Some assumptions about enterprise overkill need validation. Could have done more competitive analysis.

### Execution Speed: 7/10
**Strengths**: Shipped a working product in 7 days with core features complete. Stayed focused on MVP scope and avoided feature creep. Made quick decisions when needed.

**Weaknesses**: Spent too much time on documentation polish (could have shipped Day 5). Some refactoring could have been avoided with better upfront planning. Premium design iteration took longer than expected.

### Communication: 8/10
**Strengths**: Comprehensive documentation (README, ARCHITECTURE, DEVLOG). Clear commit messages. Well-structured code comments. Good separation between technical and business docs.

**Weaknesses**: DEVLOG entries written retrospectively rather than daily (less authentic). Some docs are overly detailed for MVP stage. Could have been more concise in places.

### Overall Self-Assessment: 8/10

**What went exceptionally well**: Product thinking, architecture decisions, honesty-first approach, and deterministic logic. The core value proposition is clear and differentiated.

**What needs improvement**: Test coverage, real user validation, execution speed (could have shipped faster), and more concise documentation.

**Key learning**: Building an MVP is about making the right tradeoffs. I prioritized product quality and trust-building over speed, which feels right for a financial tool. But I could have validated assumptions with users earlier.

