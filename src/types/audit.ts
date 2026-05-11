/**
 * Core audit types for AIuditor
 */

import type { ToolCategory, ToolRole } from "@/data/pricing";

/**
 * User's tool usage input
 */
export interface ToolUsage {
  toolId: string; // matches pricing config ID
  toolName: string;
  planId: string;
  planName: string;
  monthlySpend: number;
  seats: number; // number of users/seats
  category: ToolCategory;
  roles: ToolRole[];
}

/**
 * Complete audit input from user
 */
export interface AuditInput {
  tools: ToolUsage[];
  teamSize?: number; // optional context about team size
  primaryUseCase?: string; // optional context about main workflow
}

/**
 * Recommendation categories
 */
export type RecommendationCategory =
  | "overlap" // overlapping tools (renamed from consolidation)
  | "downgrade" // downgrade from enterprise to individual plan
  | "unused_seats" // reduce unused seats (renamed from seat_optimization)
  | "enterprise_overkill" // unnecessary enterprise features
  | "api_optimization" // optimize API vs subscription usage
  | "credit_opportunity" // potential credits or discounts
  | "already_optimized"; // no changes needed

/**
 * Recommendation severity/priority
 */
export type RecommendationSeverity = "high" | "medium" | "low";

/**
 * Individual recommendation (V2 Enhanced)
 */
export interface Recommendation {
  id: string;
  category: RecommendationCategory;
  severity: RecommendationSeverity;
  confidence: number; // 0-1 score
  
  // What's the issue?
  title: string;
  description: string;
  reasoning: string;
  
  // What tools are affected?
  affectedTools: string[]; // tool IDs
  
  // What should the user do?
  suggestion: string;
  actionable: boolean;
  
  // Financial impact
  savings: {
    monthly: number;
    annual: number;
    percentage?: number;
  };
  
  // V2: Enhanced metadata
  metadata?: {
    currentPlan?: string;
    suggestedPlan?: string;
    currentSeats?: number;
    suggestedSeats?: number;
    overlapScore?: number;
    overlapIntensity?: 'low' | 'medium' | 'high' | 'critical';
    priorityScore?: number;
    implementationComplexity?: 'easy' | 'moderate' | 'complex';
    workflowRisk?: 'none' | 'low' | 'medium' | 'high';
  };
}

/**
 * Savings summary
 */
export interface SavingsSummary {
  current: {
    monthly: number;
    annual: number;
  };
  optimized: {
    monthly: number;
    annual: number;
  };
  savings: {
    monthly: number;
    annual: number;
    percentage: number;
  };
}

/**
 * Optimization score (0-100) - V2 Enhanced
 */
export interface OptimizationScore {
  overall: number; // 0-100
  breakdown: {
    planEfficiency: number; // are plans appropriate for team size?
    toolRedundancy: number; // overlapping tools?
    seatUtilization: number; // unused seats?
    enterpriseOverkill: number; // unnecessary enterprise features?
    usageEfficiency?: number; // V2: usage-based efficiency
  };
  rating: "excellent" | "good" | "moderate" | "poor";
}

/**
 * Complete audit result (V2 Enhanced)
 */
export interface AuditResult {
  // Input summary
  input: AuditInput;
  
  // Financial analysis
  savings: SavingsSummary;
  
  // Optimization score
  score: OptimizationScore;
  
  // Recommendations
  recommendations: Recommendation[];
  
  // V2: Enhanced analysis
  overlapAnalysis?: {
    totalOverlaps: number;
    criticalOverlaps: number;
    overlapIntensity: 'low' | 'medium' | 'high' | 'critical';
    overallScore: number;
  };
  
  teamContext?: {
    stage: 'early-stage' | 'growth' | 'mature';
    type: 'engineering' | 'content' | 'research' | 'operations' | 'mixed';
    confidence: number;
  };
  
  executiveSummary?: string;
  
  // Metadata
  auditedAt: Date;
  version: string; // audit engine version
}

/**
 * Overlap detection result
 */
export interface OverlapAnalysis {
  clusters: OverlapCluster[];
  totalRedundancy: number; // 0-1 score
}

export interface OverlapCluster {
  category: ToolCategory;
  tools: string[]; // tool IDs
  overlapScore: number; // 0-1 score
  estimatedWaste: number; // monthly USD
  suggestion: string;
}
