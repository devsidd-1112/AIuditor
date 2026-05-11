/**
 * Enhanced Prioritization Engine
 * Weighted multi-factor prioritization
 */

import type { Recommendation } from "@/types";

export interface PriorityFactors {
  savingsAmount: number;      // 0-100
  confidence: number;         // 0-100
  overlapIntensity: number;   // 0-100
  usageWaste: number;         // 0-100
  implementationEase: number; // 0-100
}

export interface PriorityResult {
  score: number;              // 0-100
  factors: PriorityFactors;
  rank: number;
}

/**
 * Calculate priority score for a recommendation
 */
export function calculatePriorityScore(
  recommendation: Recommendation,
  maxSavings: number,
  overlapIntensity: number = 0
): number {
  // Normalize savings (0-100)
  const savingsAmount = maxSavings > 0
    ? Math.min(100, (recommendation.savings.monthly / maxSavings) * 100)
    : 0;
  
  // Convert confidence to 0-100
  const confidence = recommendation.confidence * 100;
  
  // Overlap intensity (0-100, passed in)
  const overlapScore = overlapIntensity;
  
  // Usage waste (estimated from severity)
  const usageWaste = getSeverityScore(recommendation.severity);
  
  // Implementation ease (estimated from category)
  const implementationEase = getImplementationEaseScore(recommendation.category);
  
  // Weighted formula
  const priority =
    (savingsAmount * 0.30) +
    (confidence * 0.25) +
    (overlapScore * 0.20) +
    (usageWaste * 0.15) +
    (implementationEase * 0.10);
  
  return Math.round(priority);
}

/**
 * Get severity score (0-100)
 */
function getSeverityScore(severity: string): number {
  switch (severity) {
    case 'high': return 90;
    case 'medium': return 60;
    case 'low': return 30;
    default: return 50;
  }
}

/**
 * Get implementation ease score (0-100)
 */
function getImplementationEaseScore(category: string): number {
  switch (category) {
    case 'overlap': return 70; // Medium ease - requires decision
    case 'downgrade': return 85; // Easy - just change plan
    case 'unused_seats': return 90; // Very easy - reduce seats
    case 'enterprise_overkill': return 80; // Easy - downgrade
    case 'already_optimized': return 100; // No action needed
    default: return 70;
  }
}

/**
 * Prioritize recommendations with enhanced scoring
 */
export function prioritizeRecommendations(
  recommendations: Recommendation[],
  overlapIntensities: Map<string, number> = new Map()
): Recommendation[] {
  if (recommendations.length === 0) return [];
  
  // Find max savings for normalization
  const maxSavings = Math.max(...recommendations.map(r => r.savings.monthly), 1);
  
  // Calculate priority scores
  const withPriority = recommendations.map(rec => {
    const overlapIntensity = overlapIntensities.get(rec.id) || 0;
    const priorityScore = calculatePriorityScore(rec, maxSavings, overlapIntensity);
    
    return {
      recommendation: rec,
      priorityScore,
    };
  });
  
  // Sort by priority score (highest first)
  withPriority.sort((a, b) => b.priorityScore - a.priorityScore);
  
  // Return sorted recommendations
  return withPriority.map(item => item.recommendation);
}

/**
 * Get top N recommendations
 */
export function getTopRecommendations(
  recommendations: Recommendation[],
  count: number = 3
): Recommendation[] {
  return recommendations.slice(0, count);
}

/**
 * Group recommendations by category
 */
export function groupRecommendationsByCategory(
  recommendations: Recommendation[]
): Map<string, Recommendation[]> {
  const groups = new Map<string, Recommendation[]>();
  
  recommendations.forEach(rec => {
    const existing = groups.get(rec.category) || [];
    groups.set(rec.category, [...existing, rec]);
  });
  
  return groups;
}

/**
 * Calculate total impact of recommendations
 */
export function calculateTotalImpact(recommendations: Recommendation[]): {
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  averageConfidence: number;
  highConfidenceCount: number;
  actionableCount: number;
} {
  const totalMonthlySavings = recommendations.reduce(
    (sum, rec) => sum + rec.savings.monthly,
    0
  );
  
  const totalAnnualSavings = recommendations.reduce(
    (sum, rec) => sum + rec.savings.annual,
    0
  );
  
  const averageConfidence = recommendations.length > 0
    ? recommendations.reduce((sum, rec) => sum + rec.confidence, 0) / recommendations.length
    : 0;
  
  const highConfidenceCount = recommendations.filter(rec => rec.confidence >= 0.8).length;
  
  const actionableCount = recommendations.filter(rec => rec.actionable !== false).length;
  
  return {
    totalMonthlySavings,
    totalAnnualSavings,
    averageConfidence,
    highConfidenceCount,
    actionableCount,
  };
}
