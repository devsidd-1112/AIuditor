/**
 * Reasoning template system for generating human-readable explanations
 * All explanations are deterministic and template-based
 */

import type { RecommendationCategory } from "@/types";

/**
 * Generate reasoning for enterprise downgrade recommendation
 */
export function generateEnterpriseDowngradeReasoning(
  toolName: string,
  teamSize: number,
  currentPlan: string,
  suggestedPlan: string
): string {
  const templates = [
    `Your team of ${teamSize} may not need the enterprise features in ${currentPlan}. Features like SSO, SCIM, and audit logs are typically valuable for teams of 10+ users. ${suggestedPlan} provides the core functionality at a lower cost.`,
    `With ${teamSize} team members, the administrative and security features in ${currentPlan} may be underutilized. ${suggestedPlan} offers the same core ${toolName} experience without the enterprise overhead.`,
    `Enterprise plans are designed for larger organizations with complex security and compliance needs. For a team of ${teamSize}, ${suggestedPlan} typically provides better value while maintaining full access to core features.`,
  ];
  
  return templates[Math.floor(Math.random() * templates.length)];
}

/**
 * Generate reasoning for overlap/consolidation recommendation
 */
export function generateOverlapReasoning(
  toolNames: string[],
  category: string,
  overlapScore: number
): string {
  const toolList = formatToolList(toolNames);
  const overlapLevel = overlapScore > 0.7 ? "significant" : overlapScore > 0.4 ? "moderate" : "some";
  
  const templates = [
    `${toolList} show ${overlapLevel} functional overlap in ${category}. These tools serve similar purposes, which may create redundancy in your workflow and budget.`,
    `Your stack includes ${toolList}, which have ${overlapLevel} overlap in ${category} capabilities. Consolidating to fewer tools could streamline workflows and reduce costs.`,
    `${toolList} provide similar functionality for ${category}. While each has unique strengths, the overlap suggests potential consolidation opportunities.`,
  ];
  
  return templates[Math.floor(Math.random() * templates.length)];
}

/**
 * Generate reasoning for unused seats recommendation
 */
export function generateUnusedSeatsReasoning(
  toolName: string,
  totalSeats: number,
  teamSize: number,
  wasteAmount: number
): string {
  const unusedSeats = totalSeats - teamSize;
  
  const templates = [
    `You're paying for ${totalSeats} ${toolName} seats but have ${teamSize} team members. The ${unusedSeats} unused seats cost approximately $${wasteAmount}/month.`,
    `${toolName} is provisioned for ${totalSeats} users, but your team size is ${teamSize}. Reducing to match actual usage could save $${wasteAmount}/month.`,
    `With ${unusedSeats} unused seats on ${toolName}, you're spending $${wasteAmount}/month on capacity that isn't being utilized.`,
  ];
  
  return templates[Math.floor(Math.random() * templates.length)];
}

/**
 * Generate reasoning for API optimization recommendation
 */
export function generateApiOptimizationReasoning(
  toolName: string,
  subscriptionCost: number,
  estimatedApiCost: number
): string {
  if (estimatedApiCost < subscriptionCost) {
    return `Based on typical usage patterns, API access to ${toolName} might cost approximately $${estimatedApiCost}/month, compared to your current subscription of $${subscriptionCost}/month. Consider evaluating API pricing for your specific use case.`;
  } else {
    return `Your ${toolName} subscription at $${subscriptionCost}/month appears cost-effective compared to estimated API costs of $${estimatedApiCost}/month for similar usage.`;
  }
}

/**
 * Generate reasoning for already optimized stack
 */
export function generateOptimizedReasoning(score: number): string {
  const templates = [
    `Your AI stack appears well-optimized with a score of ${score}/100. Plans are appropriately sized for your team, and there's minimal tool redundancy.`,
    `Great job! Your current configuration scores ${score}/100 for optimization. Your tool selection and plan choices align well with your team size and needs.`,
    `Your AI spending is efficiently managed (${score}/100). The tools and plans you've chosen are appropriate for your use case with minimal waste.`,
  ];
  
  return templates[Math.floor(Math.random() * templates.length)];
}

/**
 * Generate title for recommendation
 */
export function generateRecommendationTitle(
  category: RecommendationCategory,
  toolNames: string[]
): string {
  const toolList = formatToolList(toolNames);
  
  const titles: Record<RecommendationCategory, string> = {
    downgrade: `Consider downgrading ${toolList}`,
    overlap: `Consolidate overlapping tools: ${toolList}`, // V2: Updated
    unused_seats: `Optimize seat allocation for ${toolList}`, // V2: Updated
    enterprise_overkill: `Simplify enterprise features for ${toolList}`, // V2: New
    api_optimization: `Evaluate API pricing for ${toolList}`,
    credit_opportunity: `Potential credits available for ${toolList}`,
    already_optimized: "Your stack is well-optimized",
  };
  
  return titles[category];
}

/**
 * Generate actionable suggestion
 */
export function generateActionableSuggestion(
  category: RecommendationCategory,
  metadata: Record<string, string | number>
): string {
  switch (category) {
    case "downgrade":
      return `Downgrade from ${metadata.currentPlan} to ${metadata.suggestedPlan}`;
    
    case "overlap": // V2: Updated
      return `Choose one primary tool and cancel redundant subscriptions`;
    
    case "unused_seats": // V2: Updated
      return `Reduce seats from ${metadata.currentSeats} to ${metadata.suggestedSeats}`;
    
    case "enterprise_overkill": // V2: New
      return `Simplify to standard plan without enterprise features`;
    
    case "api_optimization":
      return `Compare API pricing with current subscription costs`;
    
    case "credit_opportunity":
      return `Contact provider about available credits or discounts`;
    
    case "already_optimized":
      return `Continue monitoring usage and costs quarterly`;
    
    default:
      return "Review this recommendation and take appropriate action";
  }
}

/**
 * Format list of tool names
 */
function formatToolList(toolNames: string[]): string {
  if (toolNames.length === 0) return "";
  if (toolNames.length === 1) return toolNames[0];
  if (toolNames.length === 2) return `${toolNames[0]} and ${toolNames[1]}`;
  
  const last = toolNames[toolNames.length - 1];
  const rest = toolNames.slice(0, -1).join(", ");
  return `${rest}, and ${last}`;
}

/**
 * Get severity explanation
 */
export function getSeverityExplanation(
  severity: "high" | "medium" | "low"
): string {
  const explanations = {
    high: "High-impact opportunity with significant savings potential",
    medium: "Moderate savings opportunity worth considering",
    low: "Minor optimization with small financial impact",
  };
  
  return explanations[severity];
}
