/**
 * Layered Explanation Engine
 * Multi-level explanations for different audiences
 */

import type { Recommendation, ToolUsage } from "@/types";
import type { OverlapScore } from "./overlap-intensity";
import type { TeamContext } from "./context";

export interface LayeredExplanation {
  concise: string;      // 1 sentence
  detailed: string;     // 2-3 sentences
  technical: string;    // Full technical reasoning
  executive: string;    // Business-focused explanation
}

/**
 * Generate layered explanations for overlap recommendations
 */
export function generateOverlapExplanation(
  tools: ToolUsage[],
  overlapScore: OverlapScore,
  teamSize: number
): LayeredExplanation {
  const toolNames = tools.map(t => t.toolName).join(", ");
  const category = tools[0]?.category || "similar";
  
  return {
    concise: `Multiple overlapping ${category.replace('_', ' ')} tools detected`,
    
    detailed: `${toolNames} serve similar ${category.replace('_', ' ')} workflows. For a team of ${teamSize}, consolidating to 1-2 tools could reduce redundancy while maintaining capability.`,
    
    technical: `${tools.length} tools within the '${category}' category with ${Math.round(overlapScore.workflowSimilarity * 100)}% workflow similarity exceed expected redundancy thresholds for teams under ${teamSize + 5} people. Overlap intensity: ${overlapScore.intensity} (${overlapScore.score}/100).`,
    
    executive: `Your team maintains ${tools.length} ${category.replace('_', ' ')} tools with overlapping capabilities, representing a consolidation opportunity worth approximately $${overlapScore.wasteEstimate}/month without workflow impact.`,
  };
}

/**
 * Generate layered explanations for downgrade recommendations
 */
export function generateDowngradeExplanation(
  toolName: string,
  currentPlan: string,
  suggestedPlan: string,
  teamSize: number,
  monthlySavings: number
): LayeredExplanation {
  return {
    concise: `${toolName} ${currentPlan} plan exceeds team needs`,
    
    detailed: `For a team of ${teamSize}, ${toolName} ${currentPlan} provides features typically used by larger organizations. Downgrading to ${suggestedPlan} maintains core functionality while reducing costs.`,
    
    technical: `Team size of ${teamSize} falls below the typical threshold (5-10 users) where ${currentPlan} features provide measurable value. ${suggestedPlan} offers 85%+ feature parity for teams of this size.`,
    
    executive: `${toolName}'s ${currentPlan} plan is designed for larger teams. Downgrading to ${suggestedPlan} could save $${monthlySavings}/month while retaining essential capabilities for your ${teamSize}-person team.`,
  };
}

/**
 * Generate layered explanations for seat reduction recommendations
 */
export function generateSeatReductionExplanation(
  toolName: string,
  currentSeats: number,
  suggestedSeats: number,
  teamSize: number,
  monthlySavings: number
): LayeredExplanation {
  const excessSeats = currentSeats - teamSize;
  
  return {
    concise: `${toolName} has ${excessSeats} unused seat${excessSeats > 1 ? 's' : ''}`,
    
    detailed: `${toolName} is provisioned for ${currentSeats} seats but your team size is ${teamSize}. Reducing to ${suggestedSeats} seats aligns capacity with actual usage.`,
    
    technical: `Seat utilization: ${Math.round((teamSize / currentSeats) * 100)}%. Excess capacity of ${excessSeats} seats (${Math.round((excessSeats / currentSeats) * 100)}% over-provisioning) represents inefficient spend.`,
    
    executive: `${toolName} is over-provisioned with ${excessSeats} unused seats, costing $${monthlySavings}/month. Right-sizing to ${suggestedSeats} seats matches your current team structure.`,
  };
}

/**
 * Generate layered explanations for "already optimized" status
 */
export function generateOptimizedExplanation(
  optimizationScore: number,
  teamSize: number,
  toolCount: number
): LayeredExplanation {
  return {
    concise: "Your AI stack is well-optimized",
    
    detailed: `Your ${toolCount}-tool stack shows efficient procurement with minimal redundancy. Tool selection is appropriate for a ${teamSize}-person team, and spending is within expected ranges.`,
    
    technical: `Optimization score: ${optimizationScore}/100. Tool redundancy analysis shows <15% overlap, seat utilization >80%, and plan selection appropriate for team size. No high-confidence optimization opportunities detected.`,
    
    executive: `Your AI tooling demonstrates mature procurement practices. The current configuration balances capability and cost effectively, with spending ${optimizationScore >= 90 ? 'well' : 'slightly'} below industry benchmarks for teams of your size.`,
  };
}

/**
 * Generate context-aware explanation modifier
 */
export function addContextToExplanation(
  explanation: LayeredExplanation,
  context: TeamContext
): LayeredExplanation {
  const contextNote = getContextNote(context);
  
  if (!contextNote) return explanation;
  
  return {
    ...explanation,
    detailed: `${explanation.detailed} ${contextNote}`,
    executive: `${explanation.executive} ${contextNote}`,
  };
}

/**
 * Get context-specific note
 */
function getContextNote(context: TeamContext): string {
  // Engineering teams
  if (context.type === 'engineering' && context.workflowIntensity.coding >= 0.7) {
    return "Note: Engineering-heavy teams may benefit from specialized tooling, though consolidation opportunities still exist.";
  }
  
  // Content teams
  if (context.type === 'content' && context.workflowIntensity.content >= 0.7) {
    return "Note: Content teams typically require fewer specialized tools than engineering teams.";
  }
  
  // Early-stage
  if (context.stage === 'early-stage') {
    return "Note: Early-stage teams often benefit most from cost optimization to extend runway.";
  }
  
  return "";
}

/**
 * Generate executive summary explanation
 */
export function generateExecutiveSummary(
  totalSavings: number,
  optimizationScore: number,
  topIssues: string[],
  context: TeamContext
): string {
  const stageDesc = {
    'early-stage': 'early-stage',
    'growth': 'growth-stage',
    'mature': 'mature',
  }[context.stage];
  
  const typeDesc = {
    'engineering': 'engineering',
    'content': 'content',
    'research': 'research',
    'operations': 'operations',
    'mixed': 'mixed-function',
  }[context.type];
  
  if (optimizationScore >= 85) {
    return `Your AI stack demonstrates strong optimization for a ${stageDesc} ${typeDesc} team. Tool selection is appropriate, spending is efficient, and no major inefficiencies were detected. Continue monitoring usage quarterly to maintain this efficiency.`;
  }
  
  if (optimizationScore >= 70) {
    return `Your AI stack shows moderate optimization opportunities for a ${stageDesc} ${typeDesc} team. ${topIssues.length > 0 ? `Primary areas for improvement include ${topIssues.join(' and ')}.` : ''} Implementing high-confidence recommendations could reduce monthly spend by approximately $${Math.round(totalSavings)} while maintaining operational capability.`;
  }
  
  return `Your AI stack shows significant optimization potential for a ${stageDesc} ${typeDesc} team. ${topIssues.length > 0 ? `Key inefficiencies include ${topIssues.join(', ')}.` : ''} Addressing these opportunities could reduce monthly spend by approximately $${Math.round(totalSavings)} (${Math.round((totalSavings / (totalSavings + 100)) * 100)}% reduction) without impacting core workflows.`;
}
