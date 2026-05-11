/**
 * Operational Assessment Generator
 * Creates final audit conclusions with confidence and continuity assurance
 * Tone: confident, clear, trustworthy
 */

import type { AuditResult, Recommendation } from "@/types/audit";
import type { OperationalAssessment } from "@/types/narrative";

/**
 * Generate final operational assessment
 */
export function generateOperationalAssessment(
  auditResult: AuditResult,
  highestConfidenceRec?: Recommendation
): OperationalAssessment {
  return {
    overallConclusion: generateOverallConclusion(auditResult),
    
    confidenceStatement: generateConfidenceStatement(auditResult, highestConfidenceRec),
    
    operationalContinuity: generateContinuityAssurance(auditResult),
    
    nextSteps: generateNextSteps(auditResult),
  };
}

/**
 * Generate overall conclusion
 */
function generateOverallConclusion(auditResult: AuditResult): string {
  const { score, savings, recommendations } = auditResult;
  const monthlySavings = savings.savings.monthly;
  const actionableRecs = recommendations.filter(r => 
    r.actionable && r.category !== "already_optimized"
  );
  
  // Already optimized
  if (score.overall >= 85 && monthlySavings < 20) {
    return "Your current AI tooling stack appears operationally efficient relative to organizational scale and workflow complexity. Only minor optimization opportunities were identified, and the current environment demonstrates relatively disciplined tooling allocation. The audit found no major structural inefficiencies requiring immediate attention.";
  }
  
  // Good with opportunities
  if (score.overall >= 70) {
    return `Overall, your AI tooling environment appears relatively well-managed compared to typical startup operational patterns. The identified optimization opportunities (${actionableRecs.length} recommendation${actionableRecs.length > 1 ? "s" : ""}) are concentrated primarily around ${identifyPrimaryFocus(recommendations)} rather than severe structural overspending. The proposed changes are expected to improve recurring software efficiency while preserving workflow flexibility and operational continuity.`;
  }
  
  // Moderate efficiency
  if (score.overall >= 50) {
    return `Your AI tooling environment demonstrates moderate operational efficiency with clear optimization pathways. The audit identified ${actionableRecs.length} actionable recommendation${actionableRecs.length > 1 ? "s" : ""} that can be implemented incrementally to improve cost efficiency while maintaining essential capabilities. The recommendations prioritize high-confidence, low-risk optimizations that align with typical startup operational patterns.`;
  }
  
  // Needs improvement
  return `The audit identified substantial optimization potential across your AI tooling environment. The ${actionableRecs.length} recommendation${actionableRecs.length > 1 ? "s" : ""} focus on consolidating overlapping capabilities, right-sizing enterprise subscriptions, and improving overall tooling efficiency. Implementation can be phased to minimize workflow disruption while achieving meaningful cost reductions.`;
}

/**
 * Generate confidence statement
 */
function generateConfidenceStatement(
  auditResult: AuditResult,
  highestConfidenceRec?: Recommendation
): string {
  const { recommendations } = auditResult;
  
  const highConfidenceRecs = recommendations.filter(r => 
    r.confidence >= 0.8 && r.category !== "already_optimized"
  );
  
  const mediumConfidenceRecs = recommendations.filter(r => 
    r.confidence >= 0.6 && r.confidence < 0.8 && r.category !== "already_optimized"
  );
  
  if (highConfidenceRecs.length === 0 && mediumConfidenceRecs.length === 0) {
    return "The audit methodology employed deterministic rule-based evaluation with conservative confidence scoring. All assessments trace to explainable heuristics and operational patterns.";
  }
  
  if (highConfidenceRecs.length >= 2) {
    return `The audit identified ${highConfidenceRecs.length} high-confidence optimization${highConfidenceRecs.length > 1 ? "s" : ""} (80%+ confidence) based on deterministic analysis of team size, tool overlap, and enterprise feature utilization. These recommendations are supported by clear operational indicators and carry minimal implementation risk.`;
  }
  
  if (highConfidenceRecs.length === 1) {
    const rec = highConfidenceRecs[0];
    return `The highest-confidence recommendation (${(rec.confidence * 100).toFixed(0)}% confidence) focuses on ${getCategoryDescription(rec.category)}. This assessment is based on deterministic analysis of ${getConfidenceFactors(rec)} and represents a clear optimization opportunity with minimal workflow risk.`;
  }
  
  return `The recommendations reflect moderate-confidence assessments (60-80% range) based on deterministic analysis of tooling patterns and operational indicators. These optimizations warrant stakeholder validation before implementation to ensure alignment with specific workflow requirements.`;
}

/**
 * Generate operational continuity assurance
 */
function generateContinuityAssurance(auditResult: AuditResult): string {
  const { recommendations } = auditResult;
  
  const lowRiskRecs = recommendations.filter(r => 
    r.metadata?.workflowRisk === "low" || r.metadata?.workflowRisk === "none"
  );
  
  const mediumRiskRecs = recommendations.filter(r => 
    r.metadata?.workflowRisk === "medium"
  );
  
  if (lowRiskRecs.length === recommendations.length) {
    return "All recommended optimizations are designed to preserve core operational capabilities and workflow continuity. Implementation should not materially disrupt day-to-day operations, and rollback options remain available if unexpected issues arise.";
  }
  
  if (mediumRiskRecs.length > 0) {
    return `The recommendations prioritize operational continuity and workflow preservation. ${lowRiskRecs.length} recommendation${lowRiskRecs.length > 1 ? "s carry" : " carries"} minimal workflow risk, while ${mediumRiskRecs.length} require${mediumRiskRecs.length === 1 ? "s" : ""} stakeholder validation and careful implementation planning. All optimizations can be implemented incrementally with monitoring and rollback capability.`;
  }
  
  return "The recommended optimizations are designed to maintain operational continuity while improving cost efficiency. Implementation should be phased with appropriate testing and stakeholder communication to ensure smooth transitions.";
}

/**
 * Generate next steps
 */
function generateNextSteps(auditResult: AuditResult): string[] {
  const { recommendations, score } = auditResult;
  const steps: string[] = [];
  
  const actionableRecs = recommendations.filter(r => 
    r.actionable && r.category !== "already_optimized"
  );
  
  if (actionableRecs.length === 0) {
    steps.push("Continue monitoring AI tooling usage and costs quarterly");
    steps.push("Reassess optimization opportunities as team size or workflows evolve");
    return steps;
  }
  
  // Prioritize high-confidence, low-risk recommendations
  const quickWins = actionableRecs.filter(r => 
    r.confidence >= 0.8 && 
    (r.metadata?.workflowRisk === "low" || r.metadata?.workflowRisk === "none")
  );
  
  if (quickWins.length > 0) {
    steps.push(`Implement ${quickWins.length} high-confidence, low-risk optimization${quickWins.length > 1 ? "s" : ""} immediately`);
  }
  
  // Medium-confidence recommendations
  const mediumConfidence = actionableRecs.filter(r => 
    r.confidence >= 0.6 && r.confidence < 0.8
  );
  
  if (mediumConfidence.length > 0) {
    steps.push(`Validate ${mediumConfidence.length} moderate-confidence recommendation${mediumConfidence.length > 1 ? "s" : ""} with stakeholders`);
  }
  
  // Overlap consolidation
  const overlapRecs = actionableRecs.filter(r => r.category === "overlap");
  if (overlapRecs.length > 0) {
    steps.push("Evaluate tool consolidation opportunities with affected team members");
  }
  
  // Enterprise downgrades
  const downgradeRecs = actionableRecs.filter(r => r.category === "downgrade");
  if (downgradeRecs.length > 0) {
    steps.push("Review enterprise feature utilization before downgrading subscriptions");
  }
  
  // Monitoring
  steps.push("Monitor implementation impact and adjust as needed");
  steps.push("Reassess AI tooling efficiency quarterly as usage patterns evolve");
  
  return steps;
}

/**
 * Get category description
 */
function getCategoryDescription(category: string): string {
  switch (category) {
    case "overlap":
      return "tool consolidation";
    case "downgrade":
      return "enterprise plan optimization";
    case "unused_seats":
      return "seat utilization";
    case "enterprise_overkill":
      return "enterprise feature rationalization";
    case "api_optimization":
      return "API pricing optimization";
    default:
      return "operational efficiency";
  }
}

/**
 * Get confidence factors
 */
function getConfidenceFactors(rec: Recommendation): string {
  const factors: string[] = [];
  
  if (rec.metadata?.currentSeats) {
    factors.push("team size analysis");
  }
  
  if (rec.metadata?.overlapScore) {
    factors.push("overlap intensity scoring");
  }
  
  if (rec.category === "downgrade") {
    factors.push("enterprise feature utilization patterns");
  }
  
  if (rec.category === "unused_seats") {
    factors.push("seat allocation vs. team size");
  }
  
  return factors.length > 0 ? factors.join(", ") : "operational pattern analysis";
}

/**
 * Identify primary focus area
 */
function identifyPrimaryFocus(recommendations: Recommendation[]): string {
  const categorySavings = new Map<string, number>();
  
  for (const rec of recommendations) {
    if (rec.category === "already_optimized") continue;
    categorySavings.set(
      rec.category,
      (categorySavings.get(rec.category) || 0) + rec.savings.monthly
    );
  }
  
  let maxSavings = 0;
  let primaryCategory = "optimization";
  
  for (const [category, savings] of categorySavings) {
    if (savings > maxSavings) {
      maxSavings = savings;
      primaryCategory = category;
    }
  }
  
  return getCategoryDescription(primaryCategory);
}
