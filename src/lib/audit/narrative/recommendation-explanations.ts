/**
 * Recommendation Explanations Engine
 * Generates layered explanations (concise, detailed, executive, technical)
 * Every explanation traces back to deterministic engine logic
 */

import type { Recommendation, RecommendationCategory } from "@/types/audit";
import type { LayeredExplanation } from "@/types/narrative";

/**
 * Generate layered explanations for a recommendation
 */
export function generateLayeredExplanation(
  recommendation: Recommendation
): LayeredExplanation {
  switch (recommendation.category) {
    case "downgrade":
      return generateDowngradeExplanation(recommendation);
    
    case "overlap":
      return generateOverlapExplanation(recommendation);
    
    case "unused_seats":
      return generateUnusedSeatsExplanation(recommendation);
    
    case "enterprise_overkill":
      return generateEnterpriseOverkillExplanation(recommendation);
    
    case "api_optimization":
      return generateAPIOptimizationExplanation(recommendation);
    
    case "already_optimized":
      return generateAlreadyOptimizedExplanation(recommendation);
    
    default:
      return generateGenericExplanation(recommendation);
  }
}

/**
 * Generate downgrade explanations
 */
function generateDowngradeExplanation(rec: Recommendation): LayeredExplanation {
  const currentPlan = rec.metadata?.currentPlan || "enterprise plan";
  const suggestedPlan = rec.metadata?.suggestedPlan || "individual plan";
  const savings = rec.savings.monthly;
  
  return {
    concise: `Enterprise collaboration tooling appears underutilized for current team scale.`,
    
    detailed: `Your current team structure does not strongly indicate operational dependence on enterprise collaboration infrastructure such as SSO, centralized administration, or audit logging. The ${currentPlan} tier provides capabilities typically required by larger organizations, while ${suggestedPlan} would preserve core functionality at reduced cost.`,
    
    executive: `The audit identified enterprise-oriented subscriptions that appear misaligned with current organizational scale. Downgrading to ${suggestedPlan} would reduce recurring overhead by approximately $${savings}/month while maintaining essential workflow capabilities.`,
    
    technical: `Recommendation generated using team-size heuristics (threshold: 5+ members for enterprise plans), workflow analysis, and enterprise utilization scoring. Confidence: ${(rec.confidence * 100).toFixed(0)}%. Detection logic: team size below enterprise efficiency threshold with no indicators of enterprise feature dependency.`,
  };
}

/**
 * Generate overlap explanations
 */
function generateOverlapExplanation(rec: Recommendation): LayeredExplanation {
  const tools = rec.affectedTools.length;
  const overlapScore = rec.metadata?.overlapScore || 70;
  const savings = rec.savings.monthly;
  
  return {
    concise: `Multiple overlapping AI assistants detected with ${overlapScore}% feature similarity.`,
    
    detailed: `The current stack maintains ${tools} tools providing substantially similar capabilities. While platform diversity can serve legitimate research or distributed-team requirements, the overlap intensity (${overlapScore}/100) exceeds typical operational patterns for teams of comparable size. Most organizations find a single primary platform sufficient for core workflows.`,
    
    executive: `Tool overlap represents the primary optimization opportunity within the current environment. Consolidating to a single primary platform would reduce recurring spend by approximately $${savings}/month while preserving essential workflow capabilities.`,
    
    technical: `Recommendation generated using overlap intensity scoring (score: ${overlapScore}/100), capability mapping, and workflow redundancy analysis. Confidence: ${(rec.confidence * 100).toFixed(0)}%. Detection logic: ${tools} tools in same category with overlap score exceeding medium threshold (26+).`,
  };
}

/**
 * Generate unused seats explanations
 */
function generateUnusedSeatsExplanation(rec: Recommendation): LayeredExplanation {
  const currentSeats = rec.metadata?.currentSeats || 0;
  const suggestedSeats = rec.metadata?.suggestedSeats || 0;
  const excessSeats = currentSeats - suggestedSeats;
  const savings = rec.savings.monthly;
  
  return {
    concise: `Paying for ${excessSeats} unused seat${excessSeats > 1 ? "s" : ""} on per-seat subscription.`,
    
    detailed: `Current subscription includes ${currentSeats} seats while team size indicates ${suggestedSeats} active users. The excess capacity suggests either recent team changes, over-provisioning, or inactive seat allocation. Reducing to ${suggestedSeats} seats would eliminate waste while maintaining appropriate operational buffer.`,
    
    executive: `Seat utilization analysis identified ${excessSeats} unused subscription seat${excessSeats > 1 ? "s" : ""}, representing approximately $${savings}/month in recoverable overhead. This optimization carries minimal workflow risk and can be implemented immediately.`,
    
    technical: `Recommendation generated using seat utilization analysis (current: ${currentSeats}, team size: ${suggestedSeats - Math.ceil(suggestedSeats * 0.1)}, suggested: ${suggestedSeats} with 10% buffer). Confidence: ${(rec.confidence * 100).toFixed(0)}%. Detection logic: seats exceed team size by >20%.`,
  };
}

/**
 * Generate enterprise overkill explanations
 */
function generateEnterpriseOverkillExplanation(rec: Recommendation): LayeredExplanation {
  const savings = rec.savings.monthly;
  
  return {
    concise: `Enterprise features appear unnecessary for current operational requirements.`,
    
    detailed: `The current subscription tier includes enterprise-grade capabilities (SSO, advanced admin controls, compliance features) that do not appear actively utilized based on team size and workflow patterns. Standard tier would preserve core functionality while reducing unnecessary overhead.`,
    
    executive: `Enterprise feature utilization appears minimal relative to subscription cost. Downgrading to standard tier would reduce recurring spend by approximately $${savings}/month without impacting day-to-day operations.`,
    
    technical: `Recommendation generated using enterprise feature utilization heuristics, team size analysis, and workflow complexity scoring. Confidence: ${(rec.confidence * 100).toFixed(0)}%. Detection logic: enterprise plan with team size below typical enterprise threshold.`,
  };
}

/**
 * Generate API optimization explanations
 */
function generateAPIOptimizationExplanation(rec: Recommendation): LayeredExplanation {
  const savings = rec.savings.monthly;
  
  return {
    concise: `API usage patterns suggest potential subscription vs. pay-per-use optimization.`,
    
    detailed: `Current API consumption patterns indicate potential cost efficiency through alternative pricing models. Depending on usage volume and consistency, switching between subscription and pay-per-use models may reduce recurring overhead while maintaining operational flexibility.`,
    
    executive: `API cost analysis identified potential savings of approximately $${savings}/month through pricing model optimization. This recommendation requires usage pattern validation before implementation.`,
    
    technical: `Recommendation generated using API usage analysis, cost-per-call calculations, and subscription breakeven modeling. Confidence: ${(rec.confidence * 100).toFixed(0)}%. Detection logic: usage patterns fall outside optimal subscription efficiency range.`,
  };
}

/**
 * Generate already optimized explanations
 */
function generateAlreadyOptimizedExplanation(rec: Recommendation): LayeredExplanation {
  return {
    concise: `Your AI tooling stack appears well-optimized for current operational requirements.`,
    
    detailed: `The audit found no major optimization opportunities within the current environment. Your tooling allocation demonstrates disciplined spend management, appropriate plan selection for team scale, and minimal redundancy. The stack appears operationally efficient relative to comparable organizations.`,
    
    executive: `No significant optimization opportunities detected. Your current AI tooling environment demonstrates relatively mature operational patterns with focused capability allocation and appropriate spend levels for organizational scale.`,
    
    technical: `Assessment based on optimization score (>80), minimal overlap detection, appropriate plan-to-team-size ratios, and efficient per-person spend patterns. No rules triggered above medium confidence threshold.`,
  };
}

/**
 * Generate generic explanations (fallback)
 */
function generateGenericExplanation(rec: Recommendation): LayeredExplanation {
  const savings = rec.savings.monthly;
  
  return {
    concise: rec.description,
    
    detailed: rec.reasoning,
    
    executive: `The audit identified a potential optimization opportunity with estimated savings of $${savings}/month. ${rec.suggestion}`,
    
    technical: `Recommendation generated through rule-based evaluation. Confidence: ${(rec.confidence * 100).toFixed(0)}%. Category: ${rec.category}.`,
  };
}

/**
 * Generate detection reason explanation
 */
export function generateDetectionReason(rec: Recommendation): string {
  switch (rec.category) {
    case "downgrade":
      return `This recommendation was identified through team-size analysis and enterprise feature utilization assessment. Your current team structure (${rec.metadata?.currentSeats || "small"} members) does not strongly indicate operational dependence on enterprise collaboration infrastructure.`;
    
    case "overlap":
      return `This recommendation was identified through overlap intensity scoring and capability mapping. The system detected ${rec.affectedTools.length} tools providing substantially similar functionality with overlap score of ${rec.metadata?.overlapScore || "high"}.`;
    
    case "unused_seats":
      return `This recommendation was identified through seat utilization analysis. Current subscription includes ${rec.metadata?.currentSeats} seats while team size indicates ${rec.metadata?.suggestedSeats} active users.`;
    
    default:
      return `This recommendation was identified through automated rule evaluation and heuristic analysis of your tooling environment.`;
  }
}

/**
 * Generate evaluation method explanation
 */
export function generateEvaluationMethod(rec: Recommendation): string {
  const methods: string[] = [];
  
  // Always include confidence scoring
  methods.push(`weighted confidence scoring (${(rec.confidence * 100).toFixed(0)}%)`);
  
  // Category-specific methods
  switch (rec.category) {
    case "downgrade":
      methods.push("team-size heuristics", "enterprise feature utilization analysis");
      break;
    case "overlap":
      methods.push("overlap intensity measurement", "capability mapping", "workflow redundancy analysis");
      break;
    case "unused_seats":
      methods.push("seat utilization tracking", "team size comparison");
      break;
  }
  
  // Add prioritization
  methods.push("multi-factor prioritization");
  
  return `The system evaluated this recommendation using: ${methods.join(", ")}.`;
}
