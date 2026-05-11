/**
 * Vocabulary Variation System
 * Prevents repetitive phrasing in narrative generation
 * Maintains professional tone while varying language
 */

/**
 * Vary "workflow" terminology
 */
export function varyWorkflowTerm(index: number): string {
  const terms = [
    "workflow",
    "operational environment",
    "development process",
    "team operations",
    "daily operations",
  ];
  return terms[index % terms.length];
}

/**
 * Vary "operational patterns" terminology
 */
export function varyOperationalPatterns(index: number): string {
  const terms = [
    "operational patterns",
    "deployment characteristics",
    "usage characteristics",
    "organizational patterns",
    "operational profile",
  ];
  return terms[index % terms.length];
}

/**
 * Vary "overlap" terminology
 */
export function varyOverlapTerm(index: number): string {
  const terms = [
    "overlap",
    "redundancy",
    "capability duplication",
    "functional overlap",
    "tool redundancy",
  ];
  return terms[index % terms.length];
}

/**
 * Vary "optimization" terminology
 */
export function varyOptimizationTerm(index: number): string {
  const terms = [
    "optimization",
    "efficiency improvement",
    "cost reduction",
    "rationalization",
    "consolidation",
  ];
  return terms[index % terms.length];
}

/**
 * Vary "tooling" terminology
 */
export function varyToolingTerm(index: number): string {
  const terms = [
    "tooling",
    "AI stack",
    "platform mix",
    "tool portfolio",
    "capability stack",
  ];
  return terms[index % terms.length];
}

/**
 * Format currency consistently
 * Always rounds to nearest $5 for trust and realism
 */
export function formatCurrency(amount: number, period?: "month" | "year"): string {
  // Round to nearest $5 for amounts under $100
  // Round to nearest $10 for amounts over $100
  let rounded: number;
  if (amount < 100) {
    rounded = Math.round(amount / 5) * 5;
  } else {
    rounded = Math.round(amount / 10) * 10;
  }
  
  const formatted = `$${rounded}`;
  if (period === "month") return `${formatted}/mo`;
  if (period === "year") return `${formatted}/yr`;
  return formatted;
}

/**
 * Format percentage consistently
 * Always rounds to whole number
 */
export function formatPercentage(value: number): string {
  return `${Math.round(value)}%`;
}

/**
 * Vary "team" terminology
 */
export function varyTeamTerm(teamSize: number, index: number): string {
  if (teamSize === 1) {
    return "individual contributor";
  }
  
  const terms = [
    "team",
    "organization",
    "group",
    "team environment",
  ];
  return terms[index % terms.length];
}

/**
 * Vary "recommendation" terminology
 */
export function varyRecommendationTerm(index: number): string {
  const terms = [
    "recommendation",
    "opportunity",
    "optimization",
    "improvement area",
  ];
  return terms[index % terms.length];
}
