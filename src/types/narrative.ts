/**
 * Narrative Engine Types
 * Types for executive audit reporting and deterministic narrative generation
 */

import type { AuditResult, Recommendation, ToolUsage } from "./audit";

/**
 * Explanation depth levels
 */
export type ExplanationDepth = "concise" | "detailed" | "executive" | "technical";

/**
 * Layered explanation for a recommendation
 */
export interface LayeredExplanation {
  concise: string;      // One sentence summary
  detailed: string;     // Full operational context
  executive: string;    // Business-focused explanation
  technical: string;    // System logic explanation
}

/**
 * Workflow risk level
 */
export type WorkflowRisk = "none" | "low" | "medium" | "high";

/**
 * Implementation complexity
 */
export type ImplementationComplexity = "easy" | "moderate" | "complex";

/**
 * Workflow style inference
 */
export type WorkflowStyle = 
  | "developer-focused"
  | "research-heavy"
  | "content-creation"
  | "operations-focused"
  | "mixed-workflow";

/**
 * Team maturity level
 */
export type TeamMaturity = "early-stage" | "growth" | "mature";

/**
 * Operational observation
 */
export interface OperationalObservation {
  observation: string;
  confidence: number;
  category: "workflow" | "tooling" | "optimization" | "maturity";
}

/**
 * Overlap narrative
 */
export interface OverlapNarrative {
  summary: string;
  severity: string;
  justification: "justified" | "questionable" | "unjustified";
  explanation: string;
  affectedTools: string[];
}

/**
 * Before/After simulation
 */
export interface OptimizationSimulation {
  recommendationId: string;
  currentState: {
    description: string;
    monthlySpend: number;
    tools: string[];
  };
  optimizedState: {
    description: string;
    monthlySpend: number;
    tools: string[];
  };
  savings: {
    monthly: number;
    annual: number;
  };
  capabilityRetention: "high" | "medium" | "low";
  workflowImpact: string;
}

/**
 * Recommendation narrative (enhanced)
 */
export interface RecommendationNarrative {
  recommendation: Recommendation;
  
  // Layered explanations
  explanations: LayeredExplanation;
  
  // Why detected
  detectionReason: string;
  
  // How evaluated
  evaluationMethod: string;
  
  // Operational impact
  operationalImpact: string;
  
  // Workflow risk
  workflowRisk: WorkflowRisk;
  workflowRiskExplanation: string;
  
  // Implementation
  implementationComplexity: ImplementationComplexity;
  implementationSteps?: string[];
  
  // Tradeoffs
  tradeoffAssessment: string;
  
  // Simulation
  simulation: OptimizationSimulation;
  
  // Confidence explanation
  confidenceExplanation: string;
}

/**
 * Executive summary
 */
export interface ExecutiveSummary {
  // High-level assessment
  operationalMaturity: string;
  optimizationHealth: "excellent" | "good" | "moderate" | "needs-attention";
  
  // Savings overview
  savingsOverview: string;
  
  // Key opportunities
  topOpportunities: string[];
  
  // Workflow observations
  workflowObservations: string[];
  
  // Overall statement
  overallStatement: string;
}

/**
 * Operational assessment (final conclusion)
 */
export interface OperationalAssessment {
  overallConclusion: string;
  confidenceStatement: string;
  operationalContinuity: string;
  nextSteps?: string[];
}

/**
 * Benchmark insight
 */
export interface BenchmarkInsight {
  insight: string;
  context: string;
  confidence: number;
}

/**
 * Complete executive audit report
 */
export interface ExecutiveAuditReport {
  // Original audit result
  auditResult: AuditResult;
  
  // Executive summary
  executiveSummary: ExecutiveSummary;
  
  // Operational observations
  operationalObservations: OperationalObservation[];
  
  // Workflow context
  workflowStyle: WorkflowStyle;
  teamMaturity: TeamMaturity;
  
  // Overlap analysis
  overlapNarratives: OverlapNarrative[];
  
  // Enhanced recommendations
  recommendationNarratives: RecommendationNarrative[];
  
  // Benchmark insights
  benchmarkInsights: BenchmarkInsight[];
  
  // Final assessment
  operationalAssessment: OperationalAssessment;
  
  // Metadata
  generatedAt: Date;
  reportVersion: string;
}
