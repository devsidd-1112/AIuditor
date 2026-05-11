# Prompts & AI Usage

## Overview

This document tracks AI prompts used during development and planning for AIuditor. It demonstrates thoughtful AI usage as a tool for acceleration, not replacement of critical thinking.

---

## Development Philosophy

### AI as Thought Partner
- Use AI to explore ideas and alternatives
- Validate assumptions with research
- Generate boilerplate, refine with expertise
- Never blindly accept AI output

### Human-Led Decisions
- Product strategy
- Architecture choices
- Business logic
- User experience
- Pricing decisions

---

## Day 1 Prompts

### Project Planning
**Prompt**: "Help me plan a 7-day MVP for an AI spend audit tool. Focus on realistic scope for a solo developer."

**Output Used**: 
- Day-by-day breakdown
- Scope boundaries
- Feature prioritization

**Refinement**: Adjusted timeline based on actual complexity

---

### Folder Structure
**Prompt**: "Suggest a clean Next.js 15 App Router folder structure for a SaaS MVP with audit logic, pricing data, and reusable components."

**Output Used**:
- `src/app/` organization
- `src/lib/` separation
- `src/components/` hierarchy

**Refinement**: Added `src/data/` for pricing configuration

---

### Landing Page Copy
**Prompt**: "Write 5 headline variations for an AI spend audit tool targeting startup founders. Focus on pain points and quick value."

**Output Used**:
- "Stop Overpaying for AI Tools" (selected)
- Alternative variations documented

**Refinement**: Shortened subheadline for clarity

---

## Day 2 Prompts

### Pricing Research
**Prompt**: "What are the current pricing tiers for Cursor, ChatGPT, Claude, GitHub Copilot, and Gemini? Include enterprise features."

**Output Used**:
- Pricing tiers
- Feature breakdowns
- Enterprise capabilities

**Refinement**: Verified against official websites, added missing details

---

### Rule Logic
**Prompt**: "What are common patterns where small teams overpay for enterprise AI tool plans?"

**Output Used**:
- Enterprise overkill pattern
- Unused seats pattern
- Overlap detection ideas

**Refinement**: Added confidence scoring and nuanced reasoning

---

### Type System Design
**Prompt**: "Design TypeScript interfaces for an audit system that evaluates AI tool spending and generates recommendations."

**Output Used**:
- Base interface structure
- Recommendation categories
- Confidence scoring approach

**Refinement**: Added severity levels, metadata fields, overlap analysis types

---

### Reasoning Templates
**Prompt**: "Write 3 variations of explanation text for why a small team doesn't need enterprise features like SSO and SCIM."

**Output Used**:
- Template structure
- Key talking points
- Tone and voice

**Refinement**: Made more specific to team sizes, added context

---

## Architecture Prompts

### System Design
**Prompt**: "Explain the tradeoffs between deterministic rules vs AI-generated recommendations for a financial audit tool."

**Output Used**:
- Explainability benefits
- Trust considerations
- Performance implications

**Refinement**: Added specific examples, emphasized honesty-first approach

---

### Overlap Detection
**Prompt**: "How would you detect overlapping functionality between AI tools like ChatGPT, Claude, and Gemini?"

**Output Used**:
- Category-based grouping
- Overlap scoring concept
- Waste estimation approach

**Refinement**: Made conservative (70% confidence factor), added nuance

---

## Documentation Prompts

### Architecture Doc
**Prompt**: "Create a Mermaid diagram showing the flow from user input to audit recommendations for an AI spend audit tool."

**Output Used**:
- Flow diagram structure
- Component relationships

**Refinement**: Simplified, added decision points, clarified stages

---

### DEVLOG Entry
**Prompt**: "Help me write a reflective devlog entry about building a deterministic recommendation engine vs using AI for financial decisions."

**Output Used**:
- Reflection structure
- Key insights format
- Lessons learned framing

**Refinement**: Added personal observations, specific examples, honest challenges

---

## Business Prompts

### Economics Analysis
**Prompt**: "What are realistic unit economics for a freemium SaaS tool that helps startups optimize AI spending?"

**Output Used**:
- LTV:CAC framework
- Conversion rate benchmarks
- Churn assumptions

**Refinement**: Adjusted for bootstrap-friendly model, added conservative estimates

---

### GTM Strategy
**Prompt**: "Where do startup founders and engineering managers discuss AI tool costs online?"

**Output Used**:
- Community list
- Channel priorities
- Content ideas

**Refinement**: Added specific subreddits, timing strategies, launch sequence

---

## Content Prompts

### Landing Copy Variations
**Prompt**: "Write 5 alternative headlines for 'Stop Overpaying for AI Tools' that emphasize different value propositions."

**Output Used**:
- Savings-focused
- Time-focused
- Problem-focused variations

**Refinement**: Tested for clarity, selected based on directness

---

### Testimonial Templates
**Prompt**: "Write realistic testimonial templates for users who saved money using an AI spend audit tool."

**Output Used**:
- Specific dollar amounts
- Time investment mentioned
- Credible tone

**Refinement**: Made more conversational, added context

---

## Technical Prompts

### Calculation Utilities
**Prompt**: "Write TypeScript utility functions for financial calculations that safely handle edge cases like division by zero."

**Output Used**:
- Safe division function
- Currency formatting
- Percentage calculations

**Refinement**: Added TypeScript types, improved error handling

---

### Normalization Logic
**Prompt**: "How would you normalize user input variations like 'ChatGPT Plus', 'GPT Plus', 'chat gpt plus' to a canonical ID?"

**Output Used**:
- Mapping approach
- Lowercase + trim strategy
- Lookup table structure

**Refinement**: Added more variations, organized by tool

---

## Prompt Patterns That Worked

### 1. Specific Context
**Good**: "For a 3-person startup using Cursor Teams at $40/user..."
**Bad**: "How to optimize AI spending?"

### 2. Constraints Included
**Good**: "Write in 100 words or less, conversational tone..."
**Bad**: "Write about this topic"

### 3. Examples Provided
**Good**: "Like this example: [example]. Now do it for..."
**Bad**: "Generate similar content"

### 4. Iterative Refinement
**Good**: "That's close, but make it more [specific feedback]"
**Bad**: Accepting first output

---

## Prompt Patterns That Didn't Work

### 1. Too Vague
**Bad**: "Help me build an audit tool"
**Result**: Generic, unusable output

### 2. Too Complex
**Bad**: "Design the entire system architecture with all edge cases..."
**Result**: Overwhelming, impractical

### 3. No Constraints
**Bad**: "Write documentation"
**Result**: Too long, wrong tone

### 4. Blind Trust
**Bad**: Using output without verification
**Result**: Inaccurate pricing, wrong assumptions

---

## AI Tools Used

### ChatGPT (GPT-4)
**Used For**:
- Brainstorming
- Documentation drafting
- Code structure suggestions

**Not Used For**:
- Final code (always reviewed/refined)
- Business decisions
- Pricing data (verified separately)

---

### Claude (Sonnet)
**Used For**:
- Long-form writing
- Architecture explanations
- Nuanced reasoning

**Not Used For**:
- Quick iterations
- Code generation
- Real-time research

---

### Cursor (AI Editor)
**Used For**:
- Code completion
- Refactoring suggestions
- Type inference

**Not Used For**:
- Architecture decisions
- Business logic
- Critical algorithms

---

## Lessons Learned

### What Worked
✅ Using AI for first drafts, then refining
✅ Specific prompts with context and constraints
✅ Iterative refinement over single prompts
✅ Verification of factual claims
✅ Human oversight on all decisions

### What Didn't Work
❌ Accepting AI output without review
❌ Vague prompts expecting perfect results
❌ Using AI for critical business logic
❌ Trusting pricing data without verification
❌ Skipping human judgment

---

## Prompt Library (Reusable)

### Feature Planning
```
"Plan a [feature] for [product] that:
- Solves [problem]
- Takes [time] to build
- Fits [constraints]
- Avoids [anti-patterns]"
```

### Code Structure
```
"Design TypeScript interfaces for [system] that:
- Supports [use cases]
- Is type-safe and maintainable
- Avoids [complexity]
- Follows [principles]"
```

### Documentation
```
"Write [doc type] for [audience] that:
- Explains [concept]
- Is [length]
- Uses [tone]
- Includes [examples]"
```

### Copy Writing
```
"Write [copy type] for [product] that:
- Emphasizes [value prop]
- Targets [audience]
- Is [length]
- Avoids [pitfalls]"
```

---

## AI Usage Principles

### 1. AI Accelerates, Doesn't Replace
Use AI to move faster, not to avoid thinking.

### 2. Verify Everything
Especially pricing, technical claims, and business assumptions.

### 3. Refine Iteratively
First output is rarely final output.

### 4. Maintain Ownership
You're responsible for the final product, not the AI.

### 5. Document Usage
Track what worked and what didn't for future reference.

---

## Future AI Integration

### In Product (Day 4+)
**AI-Generated Summaries**:
- Convert recommendations to prose
- Personalize based on user context
- Explain savings in plain language

**Not AI**:
- Core audit logic (stays deterministic)
- Financial calculations
- Confidence scoring

### In Development
**Continue Using**:
- Documentation drafting
- Code structure suggestions
- Copy variations

**Never Use For**:
- Final business decisions
- Critical algorithms
- Pricing data

---

## Last Updated

**Day 2** — Comprehensive prompt tracking added with examples, patterns, and lessons learned.
