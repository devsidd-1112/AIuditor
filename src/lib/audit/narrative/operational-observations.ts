/**
 * Operational Observations Engine
 * Infers workflow patterns and team characteristics from tool usage
 * 100% deterministic - no ML, no embeddings
 */

import type { ToolUsage } from "@/types/audit";
import type { OperationalObservation, WorkflowStyle, TeamMaturity } from "@/types/narrative";

/**
 * Infer workflow style from tool mix
 */
export function inferWorkflowStyle(tools: ToolUsage[]): WorkflowStyle {
  const categories = tools.map(t => t.category);
  const codingTools = categories.filter(c => c === "coding_assistant").length;
  const chatTools = categories.filter(c => c === "general_chat").length;
  const researchTools = categories.filter(c => c === "research").length;
  
  // Developer-focused: primarily coding assistants
  if (codingTools >= 2 && chatTools <= 1) {
    return "developer-focused";
  }
  
  // Research-heavy: multiple chat/research tools
  if (chatTools >= 3 || researchTools >= 2) {
    return "research-heavy";
  }
  
  // Content-creation: chat tools without coding tools
  if (chatTools >= 2 && codingTools === 0) {
    return "content-creation";
  }
  
  // Operations-focused: specialized tools
  if (categories.includes("specialized")) {
    return "operations-focused";
  }
  
  // Mixed workflow: diverse tool mix
  return "mixed-workflow";
}

/**
 * Infer team maturity from tool choices and spend
 */
export function inferTeamMaturity(
  tools: ToolUsage[],
  teamSize: number
): TeamMaturity {
  const totalSpend = tools.reduce((sum, t) => sum + t.monthlySpend, 0);
  const spendPerPerson = totalSpend / teamSize;
  
  const hasEnterpriseTools = tools.some(t => 
    t.planName.toLowerCase().includes("enterprise") ||
    t.planName.toLowerCase().includes("business") ||
    t.planName.toLowerCase().includes("team")
  );
  
  // Early-stage: low spend, individual plans
  if (spendPerPerson < 50 && !hasEnterpriseTools) {
    return "early-stage";
  }
  
  // Mature: high spend, enterprise tools
  if (spendPerPerson > 150 || (hasEnterpriseTools && teamSize > 10)) {
    return "mature";
  }
  
  // Growth: moderate spend, some team plans
  return "growth";
}

/**
 * Generate operational observations from tool usage
 */
export function generateOperationalObservations(
  tools: ToolUsage[],
  teamSize: number,
  workflowStyle: WorkflowStyle,
  teamMaturity: TeamMaturity
): OperationalObservation[] {
  const observations: OperationalObservation[] = [];
  
  // Workflow observation
  observations.push({
    observation: generateWorkflowObservation(workflowStyle, tools),
    confidence: 0.85,
    category: "workflow",
  });
  
  // Tooling behavior observation
  const toolingObs = generateToolingObservation(tools, teamSize);
  if (toolingObs) {
    observations.push(toolingObs);
  }
  
  // Maturity observation
  observations.push({
    observation: generateMaturityObservation(teamMaturity, teamSize),
    confidence: 0.8,
    category: "maturity",
  });
  
  // Optimization tendency observation
  const optimizationObs = generateOptimizationObservation(tools, teamSize);
  if (optimizationObs) {
    observations.push(optimizationObs);
  }
  
  return observations;
}

/**
 * Generate workflow-specific observation
 */
function generateWorkflowObservation(
  style: WorkflowStyle,
  tools: ToolUsage[]
): string {
  const toolCount = tools.length;
  
  switch (style) {
    case "developer-focused":
      return `Your tooling mix suggests a developer-focused workflow environment with ${toolCount > 3 ? "moderate experimentation" : "focused usage"} across coding assistant platforms.`;
    
    case "research-heavy":
      return `The current stack indicates a research-intensive operational workflow with multiple conversational AI capabilities maintained in parallel.`;
    
    case "content-creation":
      return `Your tooling environment suggests content-creation and communication workflows with emphasis on generalized AI assistance.`;
    
    case "operations-focused":
      return `The current stack indicates specialized operational workflows with domain-specific AI tooling requirements.`;
    
    case "mixed-workflow":
      return `Your tooling mix suggests a diverse operational environment spanning development, research, and general-purpose AI assistance.`;
  }
}

/**
 * Generate tooling behavior observation
 */
function generateToolingObservation(
  tools: ToolUsage[],
  teamSize: number
): OperationalObservation | null {
  const categories = new Set(tools.map(t => t.category));
  const chatTools = tools.filter(t => t.category === "general_chat");
  const codingTools = tools.filter(t => t.category === "coding_assistant");
  
  // Multiple chat assistants
  if (chatTools.length >= 3) {
    return {
      observation: "Multiple generalized assistant platforms are currently maintained, suggesting either active experimentation or distributed team preferences.",
      confidence: 0.9,
      category: "tooling",
    };
  }
  
  // Multiple coding assistants
  if (codingTools.length >= 2) {
    return {
      observation: "The current stack maintains overlapping coding assistant subscriptions, which may indicate evaluation-phase tooling or specialized workflow requirements.",
      confidence: 0.85,
      category: "tooling",
    };
  }
  
  // Enterprise tools for small team
  const enterpriseTools = tools.filter(t =>
    t.planName.toLowerCase().includes("enterprise") ||
    t.planName.toLowerCase().includes("business")
  );
  
  if (enterpriseTools.length > 0 && teamSize <= 5) {
    return {
      observation: "Enterprise-oriented collaboration tooling appears disproportionate relative to current organizational scale.",
      confidence: 0.8,
      category: "tooling",
    };
  }
  
  return null;
}

/**
 * Generate maturity observation
 */
function generateMaturityObservation(
  maturity: TeamMaturity,
  teamSize: number
): string {
  switch (maturity) {
    case "early-stage":
      return `The current tooling allocation suggests early-stage operational patterns with disciplined spend management relative to team scale.`;
    
    case "growth":
      return `Your AI tooling environment reflects growth-stage operational characteristics with balanced investment across ${teamSize > 5 ? "team" : "individual"} capabilities.`;
    
    case "mature":
      return `The tooling stack demonstrates mature operational patterns with established enterprise infrastructure and comprehensive AI capability coverage.`;
  }
}

/**
 * Generate optimization tendency observation
 */
function generateOptimizationObservation(
  tools: ToolUsage[],
  teamSize: number
): OperationalObservation | null {
  const totalSpend = tools.reduce((sum, t) => sum + t.monthlySpend, 0);
  const spendPerPerson = totalSpend / teamSize;
  
  // High spend per person
  if (spendPerPerson > 200) {
    return {
      observation: "Current AI tooling spend per team member exceeds typical startup operational patterns, suggesting potential consolidation opportunities.",
      confidence: 0.75,
      category: "optimization",
    };
  }
  
  // Many tools
  if (tools.length >= 5) {
    return {
      observation: "The breadth of AI tooling subscriptions suggests either comprehensive workflow coverage or potential rationalization opportunities.",
      confidence: 0.7,
      category: "optimization",
    };
  }
  
  // Efficient spend
  if (spendPerPerson < 50 && tools.length <= 3) {
    return {
      observation: "Current AI tooling allocation demonstrates relatively disciplined spend management and focused capability selection.",
      confidence: 0.85,
      category: "optimization",
    };
  }
  
  return null;
}
