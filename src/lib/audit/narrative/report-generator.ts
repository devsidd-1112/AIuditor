/**
 * Executive Audit Report Generator
 * Orchestrates all narrative components into cohesive executive report
 * This is the main entry point for narrative generation
 */

import type { AuditResult, Recommendation, ToolUsage } from "@/types/audit";
import type { ExecutiveAuditReport, RecommendationNarrative, BenchmarkInsight } from "@/types/narrative";

import { generateExecutiveSummary } from "./executive-summary";
import {
  generateOperationalObservations,
  inferWorkflowStyle,
  inferTeamMaturity,
} from "./operational-observations";
import {
  generateOverlapNarratives,
  generateOverlapSummary,
} from "./overlap-analysis";
import {
  generateLayeredExplanation,
  generateDetectionReason,
  generateEvaluationMethod,
} from "./recommendation-explanations";
import {
  assessWorkflowRisk,
  assessImplementationComplexity,
  generateTradeoffAssessment,
} from "./workflow-risk";
import {
  generateOptimizationSimulation,
  generateBatchSimulations,
} from "./optimization-simulations";
import { generateOperationalAssessment } from "./operational-assessment";

/**
 * Generate complete executive audit report
 * This is the main function that transforms V2 audit results into narrative reports
 */
export function generateExecutiveAuditReport(
  auditResult: AuditResult
): ExecutiveAuditReport {
  const { input, recommendations } = auditResult;
  const teamSize = input.teamSize || 1;
  
  // Step 1: Infer workflow context
  const workflowStyle = inferWorkflowStyle(input.tools);
  const teamMaturity = inferTeamMaturity(input.tools, teamSize);
  
  // Step 2: Generate executive summary
  const executiveSummary = generateExecutiveSummary(auditResult);
  
  // Step 3: Generate operational observations
  const operationalObservations = generateOperationalObservations(
    input.tools,
    teamSize,
    workflowStyle,
    teamMaturity
  );
  
  // Step 4: Generate overlap narratives
  const overlapNarratives = generateOverlapNarratives(input.tools, teamSize);
  
  // Step 5: Generate enhanced recommendation narratives
  const recommendationNarratives = recommendations.map(rec => 
    generateRecommendationNarrative(rec, input.tools)
  );
  
  // Step 6: Generate benchmark insights
  const benchmarkInsights = generateBenchmarkInsights(
    input.tools,
    teamSize,
    workflowStyle,
    auditResult
  );
  
  // Step 7: Generate final operational assessment
  const highestConfidenceRec = recommendations
    .filter(r => r.category !== "already_optimized")
    .sort((a, b) => b.confidence - a.confidence)[0];
  
  const operationalAssessment = generateOperationalAssessment(
    auditResult,
    highestConfidenceRec
  );
  
  return {
    auditResult,
    executiveSummary,
    operationalObservations,
    workflowStyle,
    teamMaturity,
    overlapNarratives,
    recommendationNarratives,
    benchmarkInsights,
    operationalAssessment,
    generatedAt: new Date(),
    reportVersion: "2.0.0",
  };
}

/**
 * Generate enhanced recommendation narrative
 */
function generateRecommendationNarrative(
  recommendation: Recommendation,
  tools: ToolUsage[]
): RecommendationNarrative {
  // Generate layered explanations
  const explanations = generateLayeredExplanation(recommendation);
  
  // Generate detection and evaluation explanations
  const detectionReason = generateDetectionReason(recommendation);
  const evaluationMethod = generateEvaluationMethod(recommendation);
  
  // Assess workflow risk
  const { risk: workflowRisk, explanation: workflowRiskExplanation } = 
    assessWorkflowRisk(recommendation);
  
  // Assess implementation complexity
  const { 
    complexity: implementationComplexity,
    explanation: implementationExplanation,
    steps: implementationSteps,
  } = assessImplementationComplexity(recommendation);
  
  // Generate tradeoff assessment
  const tradeoffAssessment = generateTradeoffAssessment(recommendation);
  
  // Generate simulation
  const simulation = generateOptimizationSimulation(recommendation, tools);
  
  // Generate confidence explanation
  const confidenceExplanation = generateConfidenceExplanation(recommendation);
  
  // Determine operational impact
  const operationalImpact = determineOperationalImpact(
    recommendation,
    workflowRisk,
    implementationComplexity
  );
  
  return {
    recommendation,
    explanations,
    detectionReason,
    evaluationMethod,
    operationalImpact,
    workflowRisk,
    workflowRiskExplanation,
    implementationComplexity,
    implementationSteps,
    tradeoffAssessment,
    simulation,
    confidenceExplanation,
  };
}

/**
 * Generate confidence explanation
 */
function generateConfidenceExplanation(rec: Recommendation): string {
  const confidencePercent = (rec.confidence * 100).toFixed(0);
  
  if (rec.confidence >= 0.9) {
    return `Very high confidence (${confidencePercent}%). This recommendation is supported by clear operational indicators with minimal uncertainty. The assessment is based on deterministic analysis of quantifiable metrics.`;
  }
  
  if (rec.confidence >= 0.8) {
    return `High confidence (${confidencePercent}%). This recommendation is well-supported by operational data and typical deployment patterns. The assessment carries low uncertainty and aligns with industry best practices.`;
  }
  
  if (rec.confidence >= 0.7) {
    return `Moderate-high confidence (${confidencePercent}%). This recommendation is supported by operational indicators, though some workflow-specific factors may warrant validation before implementation.`;
  }
  
  if (rec.confidence >= 0.6) {
    return `Moderate confidence (${confidencePercent}%). This recommendation reflects typical optimization patterns, though specific organizational requirements should be validated before proceeding.`;
  }
  
  return `Conservative confidence (${confidencePercent}%). This recommendation suggests potential optimization opportunity but requires careful evaluation of specific workflow requirements and stakeholder input.`;
}

/**
 * Determine operational impact
 */
function determineOperationalImpact(
  rec: Recommendation,
  workflowRisk: string,
  implementationComplexity: string
): string {
  if (workflowRisk === "none" && implementationComplexity === "easy") {
    return "Minimal expected workflow disruption. Implementation is straightforward with no anticipated operational impact.";
  }
  
  if (workflowRisk === "low" && implementationComplexity === "easy") {
    return "Low operational impact. Core capabilities remain preserved with minimal workflow adjustment required.";
  }
  
  if (workflowRisk === "low" || implementationComplexity === "moderate") {
    return "Moderate operational impact. Some workflow adjustment may be required, though essential capabilities remain available.";
  }
  
  return "Moderate-to-significant operational impact. Careful planning and stakeholder coordination recommended before implementation.";
}

/**
 * Generate benchmark insights
 */
function generateBenchmarkInsights(
  tools: any[],
  teamSize: number,
  workflowStyle: string,
  auditResult: AuditResult
): BenchmarkInsight[] {
  const insights: BenchmarkInsight[] = [];
  
  const totalSpend = tools.reduce((sum: number, t: any) => sum + t.monthlySpend, 0);
  const spendPerPerson = totalSpend / teamSize;
  
  // Spend per person benchmark
  if (spendPerPerson > 150) {
    insights.push({
      insight: "Your AI tooling spend per team member exceeds typical startup operational patterns.",
      context: `At $${spendPerPerson.toFixed(0)}/person/month, your spend is elevated compared to teams of similar size. Most startups maintain $50-100/person/month for AI tooling.`,
      confidence: 0.75,
    });
  } else if (spendPerPerson < 50) {
    insights.push({
      insight: "Your AI tooling spend per team member is below typical startup patterns.",
      context: `At $${spendPerPerson.toFixed(0)}/person/month, your spend is conservative compared to teams of similar size. This may indicate disciplined tooling management or potential capability gaps.`,
      confidence: 0.7,
    });
  }
  
  // Tool count benchmark
  if (tools.length >= 5) {
    insights.push({
      insight: "Your AI tooling portfolio is broader than typical for teams of comparable size.",
      context: `Most teams of ${teamSize} member${teamSize > 1 ? "s" : ""} maintain 2-4 AI tools. Your ${tools.length}-tool configuration suggests either comprehensive coverage or potential consolidation opportunities.`,
      confidence: 0.7,
    });
  }
  
  // Overlap benchmark
  const chatTools = tools.filter((t: any) => t.category === "general_chat");
  if (chatTools.length >= 3) {
    insights.push({
      insight: "Teams of comparable size typically maintain fewer overlapping generalized assistant subscriptions.",
      context: `Your ${chatTools.length} chat assistant subscriptions exceed typical deployment patterns. Most teams standardize on 1-2 primary platforms for general-purpose AI assistance.`,
      confidence: 0.85,
    });
  }
  
  // Workflow-specific benchmarks
  if (workflowStyle === "developer-focused") {
    const codingTools = tools.filter((t: any) => t.category === "coding_assistant");
    if (codingTools.length >= 2) {
      insights.push({
        insight: "Engineering-focused teams commonly consolidate coding assistant tooling to reduce recurring overhead.",
        context: `Your ${codingTools.length} coding assistant subscriptions suggest either active evaluation or distributed team preferences. Most engineering teams standardize on a single primary platform.`,
        confidence: 0.8,
      });
    }
  }
  
  return insights;
}

/**
 * Export utility function for generating just the narrative layer
 * (useful for testing or incremental adoption)
 */
export function enhanceAuditWithNarrative(
  auditResult: AuditResult
): ExecutiveAuditReport {
  return generateExecutiveAuditReport(auditResult);
}
