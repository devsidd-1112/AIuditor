/**
 * Optimization scoring system
 * Provides overall efficiency score for AI stack
 */

import type { ToolUsage, OptimizationScore } from "@/types";
import { getToolConfig } from "@/data/pricing";
import { detectOverlaps } from "./overlap";

/**
 * Calculate optimization score for a tool stack
 */
export function calculateOptimizationScore(
  tools: ToolUsage[],
  teamSize?: number
): OptimizationScore {
  const planEfficiency = scorePlanEfficiency(tools, teamSize);
  const toolRedundancy = scoreToolRedundancy(tools);
  const seatUtilization = scoreSeatUtilization(tools, teamSize);
  const enterpriseOverkill = scoreEnterpriseOverkill(tools, teamSize);
  
  // Weighted average
  const overall = Math.round(
    planEfficiency * 0.3 +
    toolRedundancy * 0.3 +
    seatUtilization * 0.2 +
    enterpriseOverkill * 0.2
  );
  
  const rating = getRating(overall);
  
  return {
    overall,
    breakdown: {
      planEfficiency,
      toolRedundancy,
      seatUtilization,
      enterpriseOverkill,
    },
    rating,
  };
}

/**
 * Score plan efficiency (are plans appropriate for team size?)
 * 100 = perfect, 0 = very inefficient
 */
function scorePlanEfficiency(tools: ToolUsage[], teamSize?: number): number {
  if (tools.length === 0) return 100;
  
  let totalScore = 0;
  let count = 0;
  
  for (const tool of tools) {
    const config = getToolConfig(tool.toolId);
    if (!config) continue;
    
    const plan = config.plans.find((p) => p.id === tool.planId);
    if (!plan) continue;
    
    let score = 100;
    
    // Penalize enterprise plans for small teams
    if (plan.isEnterprise && teamSize && teamSize < 5) {
      score -= 40;
    }
    
    // Penalize if seats don't match team size
    if (teamSize && tool.seats > teamSize * 1.5) {
      score -= 30;
    }
    
    totalScore += Math.max(0, score);
    count++;
  }
  
  return count > 0 ? Math.round(totalScore / count) : 100;
}

/**
 * Score tool redundancy (overlapping tools?)
 * 100 = no overlap, 0 = extreme overlap
 */
function scoreToolRedundancy(tools: ToolUsage[]): number {
  const overlapAnalysis = detectOverlaps(tools);
  
  // Convert redundancy (0-1) to score (100-0)
  const redundancyPenalty = overlapAnalysis.totalRedundancy * 100;
  return Math.round(Math.max(0, 100 - redundancyPenalty));
}

/**
 * Score seat utilization (unused seats?)
 * 100 = perfect utilization, 0 = many unused seats
 */
function scoreSeatUtilization(tools: ToolUsage[], teamSize?: number): number {
  if (!teamSize || tools.length === 0) return 100;
  
  let totalScore = 0;
  let count = 0;
  
  for (const tool of tools) {
    if (tool.seats === 0) continue;
    
    const utilizationRate = Math.min(1, teamSize / tool.seats);
    const score = utilizationRate * 100;
    
    totalScore += score;
    count++;
  }
  
  return count > 0 ? Math.round(totalScore / count) : 100;
}

/**
 * Score enterprise overkill (unnecessary enterprise features?)
 * 100 = no overkill, 0 = extreme overkill
 */
function scoreEnterpriseOverkill(tools: ToolUsage[], teamSize?: number): number {
  if (tools.length === 0) return 100;
  
  let enterpriseCount = 0;
  let totalTools = 0;
  
  for (const tool of tools) {
    const config = getToolConfig(tool.toolId);
    if (!config) continue;
    
    const plan = config.plans.find((p) => p.id === tool.planId);
    if (!plan) continue;
    
    totalTools++;
    
    // Count as overkill if enterprise plan for small team
    if (plan.isEnterprise && teamSize && teamSize < 5) {
      enterpriseCount++;
    }
  }
  
  if (totalTools === 0) return 100;
  
  const overkillRate = enterpriseCount / totalTools;
  return Math.round(Math.max(0, 100 - overkillRate * 100));
}

/**
 * Convert numeric score to rating
 */
function getRating(score: number): "excellent" | "good" | "moderate" | "poor" {
  if (score >= 85) return "excellent";
  if (score >= 70) return "good";
  if (score >= 50) return "moderate";
  return "poor";
}

/**
 * Get human-readable score description
 */
export function getScoreDescription(score: OptimizationScore): string {
  const { overall, rating } = score;
  
  const descriptions: Record<typeof rating, string> = {
    excellent: `Your AI stack is highly optimized (${overall}/100). Great job managing costs!`,
    good: `Your AI stack is reasonably efficient (${overall}/100). A few small optimizations could help.`,
    moderate: `Your AI stack has room for improvement (${overall}/100). Several optimization opportunities exist.`,
    poor: `Your AI stack has significant inefficiencies (${overall}/100). Major savings are possible.`,
  };
  
  return descriptions[rating];
}
