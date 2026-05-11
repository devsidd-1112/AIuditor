/**
 * Overlap Intensity Engine
 * Measures overlap severity, not just existence
 */

import type { ToolUsage } from "@/types";

export type OverlapIntensity = 'low' | 'medium' | 'high' | 'critical';

export interface OverlapScore {
  intensity: OverlapIntensity;
  score: number;              // 0-100
  categoryOverlap: number;    // How many tools in same category
  roleOverlap: number;        // How many tools serve same role
  workflowSimilarity: number; // 0-1
  wasteEstimate: number;      // Monthly $ wasted
  affectedTools: string[];
}

export interface OverlapDetail {
  tools: string[];
  category: string;
  score: OverlapScore;
  reasoning: string;
}

/**
 * Calculate overlap intensity for a group of tools
 */
export function calculateOverlapIntensity(
  tools: ToolUsage[],
  category?: string
): OverlapScore {
  // Filter tools by category if specified
  const relevantTools = category
    ? tools.filter(t => t.category === category)
    : tools;
  
  if (relevantTools.length < 2) {
    return {
      intensity: 'low',
      score: 0,
      categoryOverlap: 0,
      roleOverlap: 0,
      workflowSimilarity: 0,
      wasteEstimate: 0,
      affectedTools: [],
    };
  }
  
  // Count category overlaps
  const categoryOverlapCount = relevantTools.length - 1;
  
  // Count role overlaps
  const roleOverlapCount = calculateRoleOverlap(relevantTools);
  
  // Calculate workflow similarity
  const workflowSimilarity = calculateWorkflowSimilarity(relevantTools);
  
  // Calculate spend concentration
  const spendConcentration = calculateSpendConcentration(relevantTools, tools);
  
  // Calculate overall overlap score (0-100)
  const score = Math.min(
    100,
    (categoryOverlapCount * 20) +
    (roleOverlapCount * 15) +
    (workflowSimilarity * 30) +
    (spendConcentration * 35)
  );
  
  // Determine intensity level
  const intensity = getIntensityLevel(score);
  
  // Estimate waste (conservative)
  const wasteEstimate = estimateWaste(relevantTools, score);
  
  return {
    intensity,
    score,
    categoryOverlap: categoryOverlapCount,
    roleOverlap: roleOverlapCount,
    workflowSimilarity,
    wasteEstimate,
    affectedTools: relevantTools.map(t => t.toolName),
  };
}

/**
 * Calculate role overlap between tools
 */
function calculateRoleOverlap(tools: ToolUsage[]): number {
  if (tools.length < 2) return 0;
  
  // Count unique roles vs total roles
  const allRoles = tools.flatMap(t => t.roles);
  const uniqueRoles = new Set(allRoles);
  
  // More duplicate roles = higher overlap
  const duplicateRoles = allRoles.length - uniqueRoles.size;
  
  return Math.min(10, duplicateRoles);
}

/**
 * Calculate workflow similarity (0-1)
 */
function calculateWorkflowSimilarity(tools: ToolUsage[]): number {
  if (tools.length < 2) return 0;
  
  // Same category tools have high workflow similarity
  const categories = new Set(tools.map(t => t.category));
  if (categories.size === 1) {
    // All same category
    const category = tools[0].category;
    
    // Coding assistants have very high similarity
    if (category === 'coding_assistant') return 0.92;
    
    // Chat assistants have high similarity
    if (category === 'general_chat') return 0.85;
    
    // API tools have medium similarity
    if (category === 'api_provider') return 0.60;
    
    // Default for same category
    return 0.75;
  }
  
  // Different categories have lower similarity
  return 0.40;
}

/**
 * Calculate spend concentration (0-1)
 */
function calculateSpendConcentration(
  relevantTools: ToolUsage[],
  allTools: ToolUsage[]
): number {
  const relevantSpend = relevantTools.reduce((sum, t) => sum + t.monthlySpend, 0);
  const totalSpend = allTools.reduce((sum, t) => sum + t.monthlySpend, 0);
  
  if (totalSpend === 0) return 0;
  
  // Higher concentration = more waste potential
  return relevantSpend / totalSpend;
}

/**
 * Get intensity level from score
 */
function getIntensityLevel(score: number): OverlapIntensity {
  if (score >= 76) return 'critical';
  if (score >= 51) return 'high';
  if (score >= 26) return 'medium';
  return 'low';
}

/**
 * Estimate monthly waste from overlap (conservative)
 */
function estimateWaste(tools: ToolUsage[], score: number): number {
  if (tools.length < 2) return 0;
  
  // Conservative waste estimation based on overlap score
  let wastePercentage = 0;
  
  if (score >= 76) wastePercentage = 0.60; // Critical: 60% waste
  else if (score >= 51) wastePercentage = 0.45; // High: 45% waste
  else if (score >= 26) wastePercentage = 0.30; // Medium: 30% waste
  else wastePercentage = 0.15; // Low: 15% waste
  
  // Apply waste to all but the cheapest tool (keep one)
  const sortedByPrice = [...tools].sort((a, b) => a.monthlySpend - b.monthlySpend);
  const redundantSpend = sortedByPrice.slice(1).reduce((sum, t) => sum + t.monthlySpend, 0);
  
  return Math.round(redundantSpend * wastePercentage);
}

/**
 * Detect all overlaps in tool stack
 */
export function detectAllOverlaps(tools: ToolUsage[]): OverlapDetail[] {
  const overlaps: OverlapDetail[] = [];
  
  // Group tools by category
  const byCategory = new Map<string, ToolUsage[]>();
  tools.forEach(tool => {
    const existing = byCategory.get(tool.category) || [];
    byCategory.set(tool.category, [...existing, tool]);
  });
  
  // Check each category for overlaps
  byCategory.forEach((categoryTools, category) => {
    if (categoryTools.length >= 2) {
      const score = calculateOverlapIntensity(categoryTools, category);
      
      // Only report medium+ overlaps
      if (score.score >= 26) {
        overlaps.push({
          tools: categoryTools.map(t => t.toolName),
          category,
          score,
          reasoning: generateOverlapReasoning(categoryTools, score),
        });
      }
    }
  });
  
  // Sort by score (highest first)
  return overlaps.sort((a, b) => b.score.score - a.score.score);
}

/**
 * Generate human-readable overlap reasoning
 */
function generateOverlapReasoning(tools: ToolUsage[], score: OverlapScore): string {
  const toolNames = tools.map(t => t.toolName).join(", ");
  const category = tools[0].category;
  
  if (score.intensity === 'critical') {
    return `${toolNames} show critical overlap in ${category} workflows with ${Math.round(score.workflowSimilarity * 100)}% workflow similarity. Consolidation strongly recommended.`;
  } else if (score.intensity === 'high') {
    return `${toolNames} have significant overlap in ${category} capabilities. Consolidating to 1-2 tools could reduce redundancy.`;
  } else if (score.intensity === 'medium') {
    return `${toolNames} show moderate overlap in ${category} functionality. Consider consolidation for efficiency.`;
  } else {
    return `${toolNames} have minor overlap but may serve different use cases.`;
  }
}

/**
 * Calculate total overlap intensity across entire stack
 */
export function calculateTotalOverlapIntensity(tools: ToolUsage[]): {
  overallIntensity: OverlapIntensity;
  overallScore: number;
  criticalOverlaps: number;
  highOverlaps: number;
  mediumOverlaps: number;
} {
  const overlaps = detectAllOverlaps(tools);
  
  const criticalOverlaps = overlaps.filter(o => o.score.intensity === 'critical').length;
  const highOverlaps = overlaps.filter(o => o.score.intensity === 'high').length;
  const mediumOverlaps = overlaps.filter(o => o.score.intensity === 'medium').length;
  
  // Calculate weighted overall score
  const overallScore = overlaps.length > 0
    ? overlaps.reduce((sum, o) => sum + o.score.score, 0) / overlaps.length
    : 0;
  
  const overallIntensity = getIntensityLevel(overallScore);
  
  return {
    overallIntensity,
    overallScore,
    criticalOverlaps,
    highOverlaps,
    mediumOverlaps,
  };
}
