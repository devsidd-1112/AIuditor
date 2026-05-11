/**
 * Overlap Analysis Narrative Engine
 * Generates human-readable explanations for overlap detection
 * 100% deterministic - explains WHY overlap exists and HOW severe it is
 */

import type { ToolUsage } from "@/types/audit";
import type { OverlapNarrative } from "@/types/narrative";

/**
 * Generate overlap narratives for detected overlaps
 */
export function generateOverlapNarratives(
  tools: ToolUsage[],
  teamSize: number
): OverlapNarrative[] {
  const narratives: OverlapNarrative[] = [];
  
  // Check for chat assistant overlaps
  const chatOverlap = analyzeChatAssistantOverlap(tools, teamSize);
  if (chatOverlap) {
    narratives.push(chatOverlap);
  }
  
  // Check for coding assistant overlaps
  const codingOverlap = analyzeCodingAssistantOverlap(tools, teamSize);
  if (codingOverlap) {
    narratives.push(codingOverlap);
  }
  
  // Check for API provider overlaps
  const apiOverlap = analyzeAPIProviderOverlap(tools);
  if (apiOverlap) {
    narratives.push(apiOverlap);
  }
  
  return narratives;
}

/**
 * Analyze chat assistant overlap
 */
function analyzeChatAssistantOverlap(
  tools: ToolUsage[],
  teamSize: number
): OverlapNarrative | null {
  const chatTools = tools.filter(t => t.category === "general_chat");
  
  if (chatTools.length < 2) {
    return null;
  }
  
  const toolNames = chatTools.map(t => t.toolName);
  const totalSpend = chatTools.reduce((sum, t) => sum + t.monthlySpend, 0);
  
  // Determine severity
  let severity: string;
  let justification: "justified" | "questionable" | "unjustified";
  
  if (chatTools.length >= 4) {
    severity = "critical";
    justification = "unjustified";
  } else if (chatTools.length === 3) {
    severity = "high";
    justification = teamSize > 10 ? "questionable" : "unjustified";
  } else {
    severity = "medium";
    justification = teamSize > 20 ? "questionable" : "unjustified";
  }
  
  // Generate explanation
  const explanation = generateChatOverlapExplanation(
    toolNames,
    chatTools.length,
    teamSize,
    justification
  );
  
  return {
    summary: `${toolNames.join(", ")} currently occupy highly similar workflow categories within your tooling environment.`,
    severity,
    justification,
    explanation,
    affectedTools: chatTools.map(t => t.toolId),
  };
}

/**
 * Generate chat overlap explanation
 */
function generateChatOverlapExplanation(
  toolNames: string[],
  count: number,
  teamSize: number,
  justification: "justified" | "questionable" | "unjustified"
): string {
  const toolList = toolNames.join(", ");
  
  if (justification === "unjustified") {
    return `While maintaining multiple assistant platforms can be justified for research-heavy organizations, the current overlap intensity exceeds expected operational requirements for teams of comparable size. ${toolList} provide substantially similar conversational AI capabilities, and most teams find a single primary assistant sufficient for general-purpose workflows.`;
  }
  
  if (justification === "questionable") {
    return `The current configuration maintains ${count} generalized assistant platforms (${toolList}). For organizations of ${teamSize}+ members, some platform diversity may support distributed team preferences, though the operational overlap remains elevated relative to typical deployment patterns.`;
  }
  
  return `Your team maintains ${count} generalized assistant platforms (${toolList}). This configuration may reflect legitimate research requirements or distributed team workflows, though consolidation opportunities likely exist.`;
}

/**
 * Analyze coding assistant overlap
 */
function analyzeCodingAssistantOverlap(
  tools: ToolUsage[],
  teamSize: number
): OverlapNarrative | null {
  const codingTools = tools.filter(t => t.category === "coding_assistant");
  
  if (codingTools.length < 2) {
    return null;
  }
  
  const toolNames = codingTools.map(t => t.toolName);
  
  // Determine severity
  let severity: string;
  let justification: "justified" | "questionable" | "unjustified";
  
  if (codingTools.length >= 3) {
    severity = "high";
    justification = "unjustified";
  } else {
    severity = "medium";
    justification = teamSize > 15 ? "questionable" : "unjustified";
  }
  
  // Generate explanation
  const explanation = generateCodingOverlapExplanation(
    toolNames,
    codingTools.length,
    teamSize,
    justification
  );
  
  return {
    summary: `Multiple coding assistant subscriptions (${toolNames.join(", ")}) are currently maintained with substantial feature overlap.`,
    severity,
    justification,
    explanation,
    affectedTools: codingTools.map(t => t.toolId),
  };
}

/**
 * Generate coding overlap explanation
 */
function generateCodingOverlapExplanation(
  toolNames: string[],
  count: number,
  teamSize: number,
  justification: "justified" | "questionable" | "unjustified"
): string {
  const toolList = toolNames.join(", ");
  
  if (justification === "unjustified") {
    return `The current stack maintains ${count} coding assistant platforms (${toolList}), which provide substantially overlapping AI-assisted development capabilities. Most engineering teams standardize on a single primary coding assistant to maintain workflow consistency and reduce recurring overhead. Unless active evaluation is underway, consolidation would likely preserve core development productivity while reducing operational complexity.`;
  }
  
  if (justification === "questionable") {
    return `Your engineering environment maintains ${count} coding assistants (${toolList}). For larger development organizations (${teamSize}+ members), some tooling diversity may reflect team-specific preferences or specialized workflow requirements, though the operational overlap suggests potential rationalization opportunities.`;
  }
  
  return `The current configuration includes ${count} coding assistant platforms (${toolList}). This may reflect evaluation-phase tooling or specialized development workflows, though consolidation opportunities likely exist.`;
}

/**
 * Analyze API provider overlap
 */
function analyzeAPIProviderOverlap(
  tools: ToolUsage[]
): OverlapNarrative | null {
  const apiTools = tools.filter(t => t.category === "api_provider");
  
  if (apiTools.length < 2) {
    return null;
  }
  
  const toolNames = apiTools.map(t => t.toolName);
  
  return {
    summary: `Multiple AI API providers (${toolNames.join(", ")}) are currently subscribed.`,
    severity: "low",
    justification: "questionable",
    explanation: `Your environment maintains ${apiTools.length} API provider subscriptions (${toolNames.join(", ")}). This configuration may reflect legitimate multi-model requirements for production systems, model-specific capabilities, or redundancy strategies. API provider diversity is common in research and production environments, though usage patterns should be monitored to ensure cost efficiency.`,
    affectedTools: apiTools.map(t => t.toolId),
  };
}

/**
 * Generate overall overlap summary
 */
export function generateOverlapSummary(
  narratives: OverlapNarrative[]
): string {
  if (narratives.length === 0) {
    return "No significant tool overlap detected within the current AI tooling environment. Your stack demonstrates focused capability allocation without substantial redundancy.";
  }
  
  const criticalCount = narratives.filter(n => n.severity === "critical").length;
  const highCount = narratives.filter(n => n.severity === "high").length;
  const unjustifiedCount = narratives.filter(n => n.justification === "unjustified").length;
  
  if (criticalCount > 0 || highCount >= 2) {
    return `The audit identified ${narratives.length} area${narratives.length > 1 ? "s" : ""} of tool overlap, with ${unjustifiedCount} appearing operationally unjustified relative to typical deployment patterns. These overlaps represent the primary optimization opportunity within the current environment.`;
  }
  
  if (narratives.length >= 2) {
    return `The current tooling environment includes ${narratives.length} areas of moderate overlap. While some platform diversity may serve legitimate operational requirements, consolidation opportunities likely exist to reduce recurring overhead.`;
  }
  
  return `Minor tool overlap detected within the current stack. The overlap appears manageable relative to overall tooling complexity, though targeted consolidation may yield incremental efficiency gains.`;
}
