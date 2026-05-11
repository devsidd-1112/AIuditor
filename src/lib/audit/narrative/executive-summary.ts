/**
 * Executive Summary Generator
 * Creates high-level operational assessments
 * Tone: operationally intelligent, financially literate, executive-level
 */

import type { AuditResult, Recommendation } from "@/types/audit";
import type { ExecutiveSummary } from "@/types/narrative";
import { formatCurrency, formatPercentage } from "./vocabulary";

/**
 * Generate executive summary from audit result
 */
export function generateExecutiveSummary(
  auditResult: AuditResult
): ExecutiveSummary {
  const { score, savings, recommendations } = auditResult;
  
  return {
    operationalMaturity: generateOperationalMaturity(score.overall, auditResult),
    
    optimizationHealth: determineOptimizationHealth(score.overall),
    
    savingsOverview: generateSavingsOverview(savings, recommendations),
    
    topOpportunities: identifyTopOpportunities(recommendations),
    
    workflowObservations: generateWorkflowObservations(auditResult),
    
    overallStatement: generateOverallStatement(auditResult),
  };
}

/**
 * Generate operational maturity assessment
 */
function generateOperationalMaturity(
  score: number,
  auditResult: AuditResult
): string {
  const teamContext = auditResult.teamContext;
  const toolCount = auditResult.input.tools.length;
  const teamSize = auditResult.input.teamSize || 1;
  
  if (score >= 85) {
    return `Your current AI tooling environment demonstrates mature operational patterns with disciplined spend management and focused capability allocation. The stack appears well-optimized relative to organizational scale and workflow requirements.`;
  }
  
  if (score >= 70) {
    return `Your AI tooling environment appears operationally sound overall, with ${toolCount} tools supporting ${teamSize > 1 ? `a team of ${teamSize}` : "individual workflows"}. Several moderate optimization opportunities exist that could improve recurring efficiency without disrupting core operations.`;
  }
  
  if (score >= 50) {
    return `Your current AI tooling environment shows moderate operational efficiency with notable optimization opportunities around ${identifyPrimaryIssue(auditResult)}. The stack demonstrates typical startup experimentation patterns with room for rationalization.`;
  }
  
  return `Your AI tooling environment indicates significant optimization potential across multiple dimensions. The current configuration suggests either active evaluation phase or accumulated tooling complexity that could benefit from strategic consolidation.`;
}

/**
 * Determine optimization health rating
 */
function determineOptimizationHealth(score: number): "excellent" | "good" | "moderate" | "needs-attention" {
  if (score >= 85) return "excellent";
  if (score >= 70) return "good";
  if (score >= 50) return "moderate";
  return "needs-attention";
}

/**
 * Generate savings overview
 */
function generateSavingsOverview(
  savings: AuditResult["savings"],
  recommendations: Recommendation[]
): string {
  const monthlySavings = savings.savings.monthly;
  const annualSavings = savings.savings.annual;
  const percentage = savings.savings.percentage;
  
  if (monthlySavings === 0) {
    return "No major optimization opportunities detected. Your current spend allocation appears efficient relative to operational requirements.";
  }
  
  if (monthlySavings < 50) {
    return `The audit identified minor optimization opportunities totaling approximately $${monthlySavings.toFixed(0)}/month ($${annualSavings.toFixed(0)}/year). While savings are modest, implementation complexity is low and workflow risk is minimal.`;
  }
  
  if (monthlySavings < 200) {
    return `The audit identified approximately $${monthlySavings.toFixed(0)}/month ($${annualSavings.toFixed(0)}/year) in potential recurring savings, representing ${percentage.toFixed(0)}% of current AI tooling spend. These optimizations can be implemented without materially impacting workflow flexibility or operational capabilities.`;
  }
  
  return `The audit identified substantial optimization opportunities totaling approximately $${monthlySavings.toFixed(0)}/month ($${annualSavings.toFixed(0)}/year), representing ${percentage.toFixed(0)}% of current spend. The recommendations focus on ${identifyPrimarySavingsSource(recommendations)} while preserving essential operational capabilities.`;
}

/**
 * Identify top opportunities
 */
function identifyTopOpportunities(recommendations: Recommendation[]): string[] {
  const opportunities: string[] = [];
  
  // Get top 3 recommendations by savings
  const topRecs = [...recommendations]
    .filter(r => r.category !== "already_optimized")
    .sort((a, b) => b.savings.monthly - a.savings.monthly)
    .slice(0, 3);
  
  for (const rec of topRecs) {
    opportunities.push(summarizeOpportunity(rec));
  }
  
  return opportunities;
}

/**
 * Summarize a single opportunity
 */
function summarizeOpportunity(rec: Recommendation): string {
  const savings = rec.savings.monthly;
  
  switch (rec.category) {
    case "downgrade":
      return `Enterprise plan downgrade opportunity ($${savings.toFixed(0)}/month)`;
    
    case "overlap":
      return `Tool consolidation opportunity ($${savings.toFixed(0)}/month)`;
    
    case "unused_seats":
      return `Unused seat reduction ($${savings.toFixed(0)}/month)`;
    
    case "enterprise_overkill":
      return `Enterprise feature optimization ($${savings.toFixed(0)}/month)`;
    
    case "api_optimization":
      return `API pricing optimization ($${savings.toFixed(0)}/month)`;
    
    default:
      return `Optimization opportunity ($${savings.toFixed(0)}/month)`;
  }
}

/**
 * Generate workflow observations
 */
function generateWorkflowObservations(auditResult: AuditResult): string[] {
  const observations: string[] = [];
  const { input, overlapAnalysis } = auditResult;
  
  // Tool diversity observation
  if (input.tools.length >= 5) {
    observations.push("Broad AI tooling coverage across multiple capability categories");
  } else if (input.tools.length <= 2) {
    observations.push("Focused tooling allocation with minimal platform diversity");
  }
  
  // Overlap observation
  if (overlapAnalysis && overlapAnalysis.totalOverlaps >= 2) {
    observations.push(`${overlapAnalysis.totalOverlaps} areas of tool overlap detected`);
  }
  
  // Team size observation
  const teamSize = input.teamSize || 1;
  if (teamSize === 1) {
    observations.push("Individual contributor workflow with personal tooling subscriptions");
  } else if (teamSize <= 5) {
    observations.push(`Small team environment (${teamSize} members) with collaborative tooling`);
  } else {
    observations.push(`Team-scale deployment (${teamSize}+ members) with shared infrastructure`);
  }
  
  return observations;
}

/**
 * Generate overall statement
 */
function generateOverallStatement(auditResult: AuditResult): string {
  const { score, savings, recommendations } = auditResult;
  const monthlySavings = savings.savings.monthly;
  
  // Already optimized
  if (score.overall >= 85 && monthlySavings < 20) {
    return "Your AI tooling stack demonstrates mature operational efficiency. The current environment appears well-managed with minimal optimization opportunities. Continue monitoring usage patterns and costs quarterly to maintain this efficiency.";
  }
  
  // Good with minor opportunities
  if (score.overall >= 70) {
    const primaryIssue = identifyPrimaryIssue(auditResult);
    return `Your AI tooling environment appears relatively well-managed compared to typical startup operational patterns. The identified optimization opportunities are concentrated primarily around ${primaryIssue} rather than severe structural overspending. The proposed recommendations are expected to improve recurring software efficiency while preserving workflow flexibility and operational continuity.`;
  }
  
  // Moderate with clear opportunities
  if (score.overall >= 50) {
    return `Your current AI tooling environment demonstrates typical startup experimentation patterns with clear optimization pathways. The recommendations focus on consolidating overlapping capabilities and right-sizing enterprise subscriptions while maintaining operational flexibility. Implementation can be phased to minimize workflow disruption.`;
  }
  
  // Needs attention
  return `Your AI tooling environment indicates substantial optimization potential across multiple dimensions. The recommendations prioritize high-confidence, low-risk optimizations that can be implemented incrementally. Consider addressing the highest-impact opportunities first while evaluating longer-term tooling strategy.`;
}

/**
 * Identify primary issue from audit
 */
function identifyPrimaryIssue(auditResult: AuditResult): string {
  const { recommendations, overlapAnalysis } = auditResult;
  
  // Count by category
  const categoryCounts = new Map<string, number>();
  const categorySavings = new Map<string, number>();
  
  for (const rec of recommendations) {
    if (rec.category === "already_optimized") continue;
    
    categoryCounts.set(rec.category, (categoryCounts.get(rec.category) || 0) + 1);
    categorySavings.set(
      rec.category,
      (categorySavings.get(rec.category) || 0) + rec.savings.monthly
    );
  }
  
  // Find highest savings category
  let maxSavings = 0;
  let primaryCategory = "optimization";
  
  for (const [category, savings] of categorySavings) {
    if (savings > maxSavings) {
      maxSavings = savings;
      primaryCategory = category;
    }
  }
  
  switch (primaryCategory) {
    case "overlap":
      return "overlapping assistant subscriptions";
    case "downgrade":
      return "enterprise plan optimization";
    case "unused_seats":
      return "seat utilization";
    case "enterprise_overkill":
      return "enterprise feature utilization";
    case "api_optimization":
      return "API pricing efficiency";
    default:
      return "tooling rationalization";
  }
}

/**
 * Identify primary savings source
 */
function identifyPrimarySavingsSource(recommendations: Recommendation[]): string {
  const topRec = recommendations
    .filter(r => r.category !== "already_optimized")
    .sort((a, b) => b.savings.monthly - a.savings.monthly)[0];
  
  if (!topRec) return "optimization";
  
  switch (topRec.category) {
    case "overlap":
      return "tool consolidation";
    case "downgrade":
      return "plan optimization";
    case "unused_seats":
      return "seat right-sizing";
    case "enterprise_overkill":
      return "enterprise feature rationalization";
    case "api_optimization":
      return "API pricing optimization";
    default:
      return "operational efficiency";
  }
}
