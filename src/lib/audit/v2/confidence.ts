/**
 * Weighted Confidence System
 * Nuanced confidence scoring instead of binary rules
 */

import type { ToolUsage } from "@/types";

export interface ConfidenceFactors {
  teamSize: number;
  spendLevel: number;
  overlapIntensity: number;
  context: number;
}

export interface ConfidenceResult {
  confidence: number;
  factors: ConfidenceFactors;
  reasoning: string;
}

/**
 * Calculate weighted confidence for a recommendation
 */
export function calculateWeightedConfidence(
  baseConfidence: number,
  teamSize: number,
  monthlySpend: number,
  overlapIntensity: number = 0,
  contextModifier: number = 1.0
): ConfidenceResult {
  // Team size modifier
  const teamSizeModifier = getTeamSizeModifier(teamSize);
  
  // Spend level modifier
  const spendLevelModifier = getSpendLevelModifier(monthlySpend);
  
  // Overlap intensity modifier
  const overlapModifier = getOverlapModifier(overlapIntensity);
  
  // Calculate final confidence
  const confidence = Math.min(
    1.0,
    baseConfidence * teamSizeModifier * spendLevelModifier * overlapModifier * contextModifier
  );
  
  const factors: ConfidenceFactors = {
    teamSize: teamSizeModifier,
    spendLevel: spendLevelModifier,
    overlapIntensity: overlapModifier,
    context: contextModifier,
  };
  
  const reasoning = generateConfidenceReasoning(confidence, factors);
  
  return { confidence, factors, reasoning };
}

/**
 * Team size confidence modifier
 */
function getTeamSizeModifier(teamSize: number): number {
  if (teamSize <= 2) return 1.0;
  if (teamSize <= 5) return 0.9;
  if (teamSize <= 10) return 0.75;
  if (teamSize <= 20) return 0.6;
  return 0.5;
}

/**
 * Spend level confidence modifier
 */
function getSpendLevelModifier(monthlySpend: number): number {
  if (monthlySpend >= 500) return 1.0;
  if (monthlySpend >= 200) return 0.95;
  if (monthlySpend >= 100) return 0.9;
  if (monthlySpend >= 50) return 0.85;
  return 0.8;
}

/**
 * Overlap intensity confidence modifier
 */
function getOverlapModifier(overlapIntensity: number): number {
  // Higher overlap = higher confidence in consolidation recommendations
  if (overlapIntensity >= 75) return 1.1; // Boost confidence for critical overlaps
  if (overlapIntensity >= 50) return 1.05;
  if (overlapIntensity >= 25) return 1.0;
  return 0.95;
}

/**
 * Generate human-readable confidence reasoning
 */
function generateConfidenceReasoning(
  confidence: number,
  factors: ConfidenceFactors
): string {
  const reasons: string[] = [];
  
  if (factors.teamSize < 0.8) {
    reasons.push("larger team size reduces certainty");
  }
  
  if (factors.spendLevel < 0.9) {
    reasons.push("lower spend level affects confidence");
  }
  
  if (factors.overlapIntensity > 1.0) {
    reasons.push("high overlap increases confidence");
  }
  
  if (confidence >= 0.9) {
    return "Very high confidence based on clear patterns";
  } else if (confidence >= 0.8) {
    return `High confidence${reasons.length > 0 ? `, though ${reasons.join(" and ")}` : ""}`;
  } else if (confidence >= 0.7) {
    return `Moderate confidence: ${reasons.join(", ")}`;
  } else {
    return `Lower confidence due to: ${reasons.join(", ")}`;
  }
}

/**
 * Calculate confidence for downgrade recommendations
 */
export function calculateDowngradeConfidence(
  teamSize: number,
  currentPlanPrice: number,
  seats: number
): ConfidenceResult {
  let baseConfidence = 0.75;
  
  // Very small teams have higher confidence for downgrades
  if (teamSize <= 2) baseConfidence = 0.90;
  else if (teamSize <= 3) baseConfidence = 0.85;
  else if (teamSize <= 5) baseConfidence = 0.80;
  
  // High per-seat cost increases confidence
  if (currentPlanPrice >= 40) baseConfidence += 0.05;
  
  // Unused seats increase confidence
  const seatUtilization = teamSize / seats;
  if (seatUtilization < 0.7) baseConfidence += 0.05;
  
  return calculateWeightedConfidence(
    baseConfidence,
    teamSize,
    currentPlanPrice * seats,
    0,
    1.0
  );
}

/**
 * Calculate confidence for overlap/consolidation recommendations
 */
export function calculateOverlapConfidence(
  teamSize: number,
  totalSpend: number,
  overlapIntensity: number,
  toolCount: number
): ConfidenceResult {
  let baseConfidence = 0.70;
  
  // More tools = higher confidence in consolidation
  if (toolCount >= 4) baseConfidence = 0.85;
  else if (toolCount >= 3) baseConfidence = 0.80;
  else if (toolCount >= 2) baseConfidence = 0.75;
  
  return calculateWeightedConfidence(
    baseConfidence,
    teamSize,
    totalSpend,
    overlapIntensity,
    1.0
  );
}

/**
 * Calculate confidence for seat reduction recommendations
 */
export function calculateSeatReductionConfidence(
  teamSize: number,
  seats: number,
  monthlySpend: number
): ConfidenceResult {
  const excessSeats = seats - teamSize;
  const excessRatio = excessSeats / teamSize;
  
  let baseConfidence = 0.75;
  
  // High excess ratio = higher confidence
  if (excessRatio >= 0.5) baseConfidence = 0.90;
  else if (excessRatio >= 0.3) baseConfidence = 0.85;
  else if (excessRatio >= 0.2) baseConfidence = 0.80;
  
  return calculateWeightedConfidence(
    baseConfidence,
    teamSize,
    monthlySpend,
    0,
    1.0
  );
}
