/**
 * Optimization Simulations Engine
 * Generates before/after scenarios for recommendations
 * Shows concrete, actionable transformations
 */

import type { Recommendation, ToolUsage } from "@/types/audit";
import type { OptimizationSimulation } from "@/types/narrative";

/**
 * Generate optimization simulation for a recommendation
 */
export function generateOptimizationSimulation(
  rec: Recommendation,
  tools: ToolUsage[]
): OptimizationSimulation {
  const affectedTools = tools.filter(t => rec.affectedTools.includes(t.toolId));
  
  return {
    recommendationId: rec.id,
    
    currentState: generateCurrentState(rec, affectedTools),
    
    optimizedState: generateOptimizedState(rec, affectedTools),
    
    savings: {
      monthly: rec.savings.monthly,
      annual: rec.savings.annual,
    },
    
    capabilityRetention: assessCapabilityRetention(rec),
    
    workflowImpact: generateWorkflowImpact(rec),
  };
}

/**
 * Generate current state description
 */
function generateCurrentState(
  rec: Recommendation,
  tools: ToolUsage[]
): {
  description: string;
  monthlySpend: number;
  tools: string[];
} {
  const totalSpend = tools.reduce((sum, t) => sum + t.monthlySpend, 0);
  const toolNames = tools.map(t => t.toolName);
  
  let description: string;
  
  switch (rec.category) {
    case "downgrade":
      const currentPlan = rec.metadata?.currentPlan || "Enterprise plan";
      const seats = rec.metadata?.currentSeats || tools[0]?.seats || 1;
      description = `${currentPlan} with ${seats} seat${seats > 1 ? "s" : ""}`;
      break;
    
    case "overlap":
      description = `${tools.length} overlapping tools: ${toolNames.join(", ")}`;
      break;
    
    case "unused_seats":
      const current = rec.metadata?.currentSeats || 0;
      description = `${current} seats allocated (${current - (rec.metadata?.suggestedSeats || 0)} unused)`;
      break;
    
    case "enterprise_overkill":
      description = `Enterprise-tier subscription with underutilized features`;
      break;
    
    case "api_optimization":
      description = `Current API pricing model`;
      break;
    
    default:
      description = `Current configuration: ${toolNames.join(", ")}`;
  }
  
  return {
    description,
    monthlySpend: totalSpend,
    tools: toolNames,
  };
}

/**
 * Generate optimized state description
 */
function generateOptimizedState(
  rec: Recommendation,
  tools: ToolUsage[]
): {
  description: string;
  monthlySpend: number;
  tools: string[];
} {
  const currentSpend = tools.reduce((sum, t) => sum + t.monthlySpend, 0);
  const optimizedSpend = currentSpend - rec.savings.monthly;
  
  let description: string;
  let optimizedTools: string[];
  
  switch (rec.category) {
    case "downgrade":
      const suggestedPlan = rec.metadata?.suggestedPlan || "Standard plan";
      const seats = rec.metadata?.currentSeats || tools[0]?.seats || 1;
      description = `${suggestedPlan} with ${seats} seat${seats > 1 ? "s" : ""}`;
      optimizedTools = tools.map(t => `${t.toolName} (${suggestedPlan})`);
      break;
    
    case "overlap":
      // Assume consolidation to first/primary tool
      const primaryTool = tools[0]?.toolName || "Primary tool";
      description = `Consolidated to ${primaryTool}`;
      optimizedTools = [primaryTool];
      break;
    
    case "unused_seats":
      const suggested = rec.metadata?.suggestedSeats || 0;
      description = `${suggested} seats allocated (right-sized)`;
      optimizedTools = tools.map(t => t.toolName);
      break;
    
    case "enterprise_overkill":
      description = `Standard-tier subscription`;
      optimizedTools = tools.map(t => `${t.toolName} (Standard)`);
      break;
    
    case "api_optimization":
      description = `Optimized API pricing model`;
      optimizedTools = tools.map(t => t.toolName);
      break;
    
    default:
      description = `Optimized configuration`;
      optimizedTools = tools.map(t => t.toolName);
  }
  
  return {
    description,
    monthlySpend: optimizedSpend,
    tools: optimizedTools,
  };
}

/**
 * Assess capability retention after optimization
 */
function assessCapabilityRetention(rec: Recommendation): "high" | "medium" | "low" {
  switch (rec.category) {
    case "unused_seats":
      return "high"; // No capability loss
    
    case "downgrade":
      // High confidence downgrades retain most capability
      return rec.confidence >= 0.8 ? "high" : "medium";
    
    case "overlap":
      // High overlap means high retention when consolidating
      const overlapScore = rec.metadata?.overlapScore || 50;
      if (overlapScore >= 80) return "high";
      if (overlapScore >= 60) return "medium";
      return "medium";
    
    case "enterprise_overkill":
      return "medium"; // Lose enterprise features
    
    case "api_optimization":
      return "high"; // Same capabilities, different pricing
    
    default:
      return "medium";
  }
}

/**
 * Generate workflow impact description
 */
function generateWorkflowImpact(rec: Recommendation): string {
  const retention = assessCapabilityRetention(rec);
  
  if (retention === "high") {
    return "Minimal workflow disruption expected. Core capabilities remain fully preserved.";
  }
  
  if (retention === "medium") {
    return "Minor workflow adjustment may be required. Essential capabilities remain available, though some platform-specific features may change.";
  }
  
  return "Moderate workflow adjustment expected. Evaluate capability requirements carefully before proceeding.";
}

/**
 * Generate comparison summary
 */
export function generateComparisonSummary(simulation: OptimizationSimulation): string {
  const savingsPercent = (
    (simulation.savings.monthly / simulation.currentState.monthlySpend) * 100
  ).toFixed(0);
  
  return `Transitioning from ${simulation.currentState.description} to ${simulation.optimizedState.description} would reduce monthly spend from $${simulation.currentState.monthlySpend.toFixed(2)} to $${simulation.optimizedState.monthlySpend.toFixed(2)} (${savingsPercent}% reduction, $${simulation.savings.annual.toFixed(2)}/year) with ${simulation.capabilityRetention} capability retention.`;
}

/**
 * Generate batch simulations for all recommendations
 */
export function generateBatchSimulations(
  recommendations: Recommendation[],
  tools: ToolUsage[]
): OptimizationSimulation[] {
  return recommendations
    .filter(rec => rec.category !== "already_optimized")
    .map(rec => generateOptimizationSimulation(rec, tools));
}

/**
 * Calculate cumulative impact of all recommendations
 */
export function calculateCumulativeImpact(
  simulations: OptimizationSimulation[]
): {
  totalCurrentSpend: number;
  totalOptimizedSpend: number;
  totalSavings: number;
  annualSavings: number;
  averageCapabilityRetention: string;
} {
  const totalCurrentSpend = simulations.reduce(
    (sum, sim) => sum + sim.currentState.monthlySpend,
    0
  );
  
  const totalSavings = simulations.reduce(
    (sum, sim) => sum + sim.savings.monthly,
    0
  );
  
  const totalOptimizedSpend = totalCurrentSpend - totalSavings;
  
  // Calculate average capability retention
  const retentionScores = simulations.map(sim => {
    switch (sim.capabilityRetention) {
      case "high": return 3;
      case "medium": return 2;
      case "low": return 1;
    }
  });
  
  const avgScore = retentionScores.reduce((sum, s) => sum + s, 0) / retentionScores.length;
  const averageCapabilityRetention = avgScore >= 2.5 ? "high" : avgScore >= 1.5 ? "medium" : "low";
  
  return {
    totalCurrentSpend,
    totalOptimizedSpend,
    totalSavings,
    annualSavings: totalSavings * 12,
    averageCapabilityRetention,
  };
}
