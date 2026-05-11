/**
 * Overlap detection utilities
 * Identifies redundant tools serving similar purposes
 */

import type { ToolUsage, OverlapAnalysis, OverlapCluster } from "@/types";
import type { ToolCategory } from "@/data/pricing";
import { getToolConfig } from "@/data/pricing";

/**
 * Detect overlapping tools in user's stack
 */
export function detectOverlaps(tools: ToolUsage[]): OverlapAnalysis {
  const clusters = findOverlapClusters(tools);
  const totalRedundancy = calculateTotalRedundancy(clusters);
  
  return {
    clusters,
    totalRedundancy,
  };
}

/**
 * Find clusters of overlapping tools
 */
function findOverlapClusters(tools: ToolUsage[]): OverlapCluster[] {
  const clusters: OverlapCluster[] = [];
  
  // Group tools by category
  const byCategory = groupByCategory(tools);
  
  // Analyze each category for overlaps
  for (const [category, categoryTools] of Object.entries(byCategory)) {
    if (categoryTools.length > 1) {
      const cluster = analyzeCluster(category as ToolCategory, categoryTools);
      if (cluster) {
        clusters.push(cluster);
      }
    }
  }
  
  return clusters;
}

/**
 * Group tools by category
 */
function groupByCategory(tools: ToolUsage[]): Record<string, ToolUsage[]> {
  const groups: Record<string, ToolUsage[]> = {};
  
  for (const tool of tools) {
    const category = tool.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(tool);
  }
  
  return groups;
}

/**
 * Analyze a cluster of tools in the same category
 */
function analyzeCluster(
  category: ToolCategory,
  tools: ToolUsage[]
): OverlapCluster | null {
  if (tools.length < 2) return null;
  
  const toolIds = tools.map((t) => t.toolId);
  const overlapScore = calculateOverlapScore(toolIds);
  const estimatedWaste = estimateClusterWaste(tools);
  const suggestion = generateClusterSuggestion(category, tools);
  
  return {
    category,
    tools: toolIds,
    overlapScore,
    estimatedWaste,
    suggestion,
  };
}

/**
 * Calculate overlap score for a set of tools
 * Higher score = more redundancy
 */
function calculateOverlapScore(toolIds: string[]): number {
  if (toolIds.length < 2) return 0;
  
  // Check how many tools overlap with each other
  let overlapCount = 0;
  let totalPairs = 0;
  
  for (let i = 0; i < toolIds.length; i++) {
    for (let j = i + 1; j < toolIds.length; j++) {
      totalPairs++;
      const tool1 = getToolConfig(toolIds[i]);
      const tool2 = getToolConfig(toolIds[j]);
      
      if (tool1 && tool2 && tool1.overlapsWith.includes(toolIds[j])) {
        overlapCount++;
      }
    }
  }
  
  return totalPairs > 0 ? overlapCount / totalPairs : 0;
}

/**
 * Estimate monthly waste from overlapping tools
 * Conservative estimate: assume user could eliminate all but cheapest tool
 */
function estimateClusterWaste(tools: ToolUsage[]): number {
  if (tools.length < 2) return 0;
  
  // Sort by monthly spend
  const sorted = [...tools].sort((a, b) => a.monthlySpend - b.monthlySpend);
  
  // Keep cheapest, sum the rest as potential waste
  const waste = sorted.slice(1).reduce((sum, tool) => sum + tool.monthlySpend, 0);
  
  // Apply confidence factor (not all overlaps are 100% redundant)
  return waste * 0.7; // 70% confidence
}

/**
 * Generate suggestion for a cluster
 */
function generateClusterSuggestion(
  category: ToolCategory,
  tools: ToolUsage[]
): string {
  const categoryNames: Record<ToolCategory, string> = {
    coding_assistant: "coding assistants",
    general_chat: "general AI assistants",
    research: "research tools",
    api_provider: "API providers",
    specialized: "specialized tools",
  };
  
  const categoryName = categoryNames[category] || "tools";
  const toolNames = tools.map((t) => t.toolName).join(", ");
  
  return `Consider consolidating ${categoryName}: ${toolNames}. These tools serve similar purposes and may create unnecessary overlap.`;
}

/**
 * Calculate total redundancy score across all clusters
 */
function calculateTotalRedundancy(clusters: OverlapCluster[]): number {
  if (clusters.length === 0) return 0;
  
  const avgScore = clusters.reduce((sum, c) => sum + c.overlapScore, 0) / clusters.length;
  return avgScore;
}

/**
 * Check if specific tools overlap
 */
export function doToolsOverlap(toolId1: string, toolId2: string): boolean {
  const tool1 = getToolConfig(toolId1);
  if (!tool1) return false;
  
  return tool1.overlapsWith.includes(toolId2);
}

/**
 * Get overlap explanation for two tools
 */
export function getOverlapExplanation(toolId1: string, toolId2: string): string | null {
  if (!doToolsOverlap(toolId1, toolId2)) return null;
  
  const tool1 = getToolConfig(toolId1);
  const tool2 = getToolConfig(toolId2);
  
  if (!tool1 || !tool2) return null;
  
  // Find common strengths
  const commonStrengths = tool1.strengths.filter((s) =>
    tool2.strengths.some((s2) => s2.toLowerCase().includes(s.toLowerCase()))
  );
  
  if (commonStrengths.length > 0) {
    return `Both tools excel at: ${commonStrengths.join(", ")}`;
  }
  
  return `Both tools serve similar purposes in the ${tool1.category} category`;
}
