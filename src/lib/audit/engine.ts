/**
 * Main audit engine - V2 Enhanced
 * Orchestrates the entire audit process with next-gen intelligence
 */

import type { AuditInput, AuditResult, Recommendation, RecommendationSeverity, OptimizationScore, SavingsSummary } from "@/types";
import { evaluateAllRules } from "./rules";
import { createSavingsSummary } from "./calculations";
import { calculateOptimizationScore } from "./scoring";
import { generateOptimizedReasoning } from "./reasoning";

// V2 Components
import { 
  analyzeTeamContext,
  detectAllOverlaps,
  calculateTotalOverlapIntensity,
  prioritizeRecommendations as prioritizeV2,
  generateExecutiveSummary,
} from "./v2";

/**
 * Run complete audit on user's AI tool stack (V2 Enhanced)
 */
export function runAudit(input: AuditInput): AuditResult {
  // Step 1: Calculate current total spend
  const currentMonthly = input.tools.reduce((sum, tool) => sum + tool.monthlySpend, 0);
  
  // Step 2: V2 - Analyze team context
  const teamContext = analyzeTeamContext(
    input.tools,
    input.teamSize || 1,
    input.primaryUseCase
  );
  
  // Step 3: V2 - Detect overlaps with intensity scoring
  const overlapDetails = detectAllOverlaps(input.tools);
  const overlapAnalysis = calculateTotalOverlapIntensity(input.tools);
  
  // Step 4: Evaluate all rules to generate recommendations
  const recommendations = evaluateAllRules({
    tools: input.tools,
    teamSize: input.teamSize,
    primaryUseCase: input.primaryUseCase,
  });
  
  // Step 5: V2 - Enhanced prioritization with overlap scores
  const overlapScores = new Map<string, number>();
  recommendations.forEach(rec => {
    if (rec.metadata?.overlapScore) {
      overlapScores.set(rec.id, rec.metadata.overlapScore);
    }
  });
  
  const sortedRecommendations = prioritizeV2(recommendations, overlapScores);
  
  // Step 6: Calculate total potential savings
  const totalSavingsMonthly = sortedRecommendations.reduce(
    (sum, rec) => sum + rec.savings.monthly,
    0
  );
  
  const optimizedMonthly = currentMonthly - totalSavingsMonthly;
  
  // Step 7: Create savings summary
  const savings = createSavingsSummary(currentMonthly, optimizedMonthly);
  
  // Step 8: Calculate optimization score
  const score = calculateOptimizationScore(input.tools, input.teamSize);
  
  // Step 9: Add "already optimized" recommendation if score is high and no major savings
  const finalRecommendations = addOptimizedRecommendationIfNeeded(
    sortedRecommendations,
    score,
    savings
  );
  
  // Step 10: V2 - Generate executive summary
  const topIssues = finalRecommendations
    .slice(0, 3)
    .filter(r => r.category !== 'already_optimized')
    .map(r => r.category.replace('_', ' '));
  
  const executiveSummary = generateExecutiveSummary(
    totalSavingsMonthly,
    score.overall,
    topIssues,
    teamContext
  );
  
  return {
    input,
    savings,
    score,
    recommendations: finalRecommendations,
    
    // V2 Enhanced fields
    overlapAnalysis: {
      totalOverlaps: overlapDetails.length,
      criticalOverlaps: overlapAnalysis.criticalOverlaps,
      overlapIntensity: overlapAnalysis.overallIntensity,
      overallScore: overlapAnalysis.overallScore,
    },
    
    teamContext: {
      stage: teamContext.stage,
      type: teamContext.type,
      confidence: teamContext.confidence,
    },
    
    executiveSummary,
    
    auditedAt: new Date(),
    version: "2.0.0", // V2!
  };
}

/**
 * Add "already optimized" recommendation if stack is efficient
 */
function addOptimizedRecommendationIfNeeded(
  recommendations: Recommendation[],
  score: OptimizationScore,
  savings: SavingsSummary
): Recommendation[] {
  // If score is high and savings are minimal, add positive feedback
  if (score.overall >= 80 && savings.savings.monthly < 20) {
    const optimizedRec: Recommendation = {
      id: `rec-${Date.now()}-optimized`,
      category: "already_optimized",
      severity: "low",
      confidence: 0.9,
      
      title: "Your AI stack is well-optimized",
      description: "No major optimization opportunities detected",
      reasoning: generateOptimizedReasoning(score.overall),
      
      affectedTools: [],
      
      suggestion: "Continue monitoring usage and costs quarterly",
      actionable: false,
      
      savings: {
        monthly: 0,
        annual: 0,
        percentage: 0,
      },
    };
    
    return [...recommendations, optimizedRec];
  }
  
  return recommendations;
}
