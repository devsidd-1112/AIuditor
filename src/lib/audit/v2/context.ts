/**
 * Context Engine
 * Understands business context beyond team size
 */

import type { ToolUsage } from "@/types";

export type CompanyStage = 'early-stage' | 'growth' | 'mature';
export type TeamType = 'engineering' | 'content' | 'research' | 'operations' | 'mixed';

export interface WorkflowIntensity {
  coding: number;        // 0-1
  content: number;       // 0-1
  research: number;      // 0-1
  collaboration: number; // 0-1
}

export interface TeamContext {
  stage: CompanyStage;
  type: TeamType;
  workflowIntensity: WorkflowIntensity;
  confidence: number;    // 0-1
  reasoning: string;
}

/**
 * Analyze team context from tool stack and inputs
 */
export function analyzeTeamContext(
  tools: ToolUsage[],
  teamSize: number,
  primaryUseCase?: string
): TeamContext {
  // Determine company stage
  const stage = determineCompanyStage(teamSize, tools);
  
  // Determine team type
  const type = determineTeamType(tools, primaryUseCase);
  
  // Calculate workflow intensity
  const workflowIntensity = calculateWorkflowIntensity(tools);
  
  // Calculate confidence in context analysis
  const confidence = calculateContextConfidence(tools, primaryUseCase);
  
  // Generate reasoning
  const reasoning = generateContextReasoning(stage, type, workflowIntensity);
  
  return {
    stage,
    type,
    workflowIntensity,
    confidence,
    reasoning,
  };
}

/**
 * Determine company stage from team size and tool sophistication
 */
function determineCompanyStage(teamSize: number, tools: ToolUsage[]): CompanyStage {
  const totalSpend = tools.reduce((sum, t) => sum + t.monthlySpend, 0);
  const spendPerPerson = totalSpend / teamSize;
  
  // Early-stage: small team, moderate spend
  if (teamSize <= 5 && spendPerPerson < 100) {
    return 'early-stage';
  }
  
  // Mature: larger team or high spend per person
  if (teamSize >= 20 || spendPerPerson >= 150) {
    return 'mature';
  }
  
  // Growth: in between
  return 'growth';
}

/**
 * Determine team type from tool composition
 */
function determineTeamType(tools: ToolUsage[], primaryUseCase?: string): TeamType {
  // Check primary use case first
  if (primaryUseCase) {
    const lowerCase = primaryUseCase.toLowerCase();
    if (lowerCase.includes('develop') || lowerCase.includes('engineer') || lowerCase.includes('code')) {
      return 'engineering';
    }
    if (lowerCase.includes('content') || lowerCase.includes('market') || lowerCase.includes('write')) {
      return 'content';
    }
    if (lowerCase.includes('research') || lowerCase.includes('analysis')) {
      return 'research';
    }
  }
  
  // Analyze tool categories
  const categories = tools.map(t => t.category);
  const codingTools = categories.filter(c => c === 'coding_assistant').length;
  const chatTools = categories.filter(c => c === 'general_chat').length;
  const apiTools = categories.filter(c => c === 'api_provider').length;
  
  // Engineering-heavy: multiple coding tools
  if (codingTools >= 2 || (codingTools >= 1 && apiTools >= 1)) {
    return 'engineering';
  }
  
  // Content-heavy: multiple chat tools, no coding tools
  if (chatTools >= 2 && codingTools === 0) {
    return 'content';
  }
  
  // Research-heavy: chat tools + API tools, no coding
  if (chatTools >= 1 && apiTools >= 1 && codingTools === 0) {
    return 'research';
  }
  
  // Mixed or operations
  if (codingTools >= 1 && chatTools >= 1) {
    return 'mixed';
  }
  
  return 'operations';
}

/**
 * Calculate workflow intensity scores
 */
function calculateWorkflowIntensity(tools: ToolUsage[]): WorkflowIntensity {
  const categories = tools.map(t => t.category);
  const totalTools = tools.length;
  
  if (totalTools === 0) {
    return { coding: 0, content: 0, research: 0, collaboration: 0 };
  }
  
  // Coding intensity
  const codingTools = categories.filter(c => c === 'coding_assistant').length;
  const coding = Math.min(1, codingTools / 2); // 2+ coding tools = 1.0
  
  // Content intensity
  const chatTools = categories.filter(c => c === 'general_chat').length;
  const content = Math.min(1, chatTools / 3); // 3+ chat tools = 1.0
  
  // Research intensity
  const apiTools = categories.filter(c => c === 'api_provider').length;
  const research = Math.min(1, (chatTools + apiTools) / 3);
  
  // Collaboration intensity (based on team plans)
  const teamPlans = tools.filter(t => 
    t.planName.toLowerCase().includes('team') || 
    t.planName.toLowerCase().includes('business')
  ).length;
  const collaboration = Math.min(1, teamPlans / 2);
  
  return { coding, content, research, collaboration };
}

/**
 * Calculate confidence in context analysis
 */
function calculateContextConfidence(tools: ToolUsage[], primaryUseCase?: string): number {
  let confidence = 0.6; // Base confidence
  
  // Higher confidence if primary use case provided
  if (primaryUseCase && primaryUseCase.length > 5) {
    confidence += 0.2;
  }
  
  // Higher confidence with more tools (more data)
  if (tools.length >= 3) confidence += 0.1;
  if (tools.length >= 5) confidence += 0.1;
  
  return Math.min(1.0, confidence);
}

/**
 * Generate human-readable context reasoning
 */
function generateContextReasoning(
  stage: CompanyStage,
  type: TeamType,
  intensity: WorkflowIntensity
): string {
  const stageDesc = {
    'early-stage': 'early-stage startup',
    'growth': 'growth-stage company',
    'mature': 'mature organization',
  }[stage];
  
  const typeDesc = {
    'engineering': 'engineering-focused team',
    'content': 'content-focused team',
    'research': 'research-focused team',
    'operations': 'operations team',
    'mixed': 'mixed-function team',
  }[type];
  
  // Find dominant workflow
  const workflows = Object.entries(intensity).sort((a, b) => b[1] - a[1]);
  const dominant = workflows[0][0];
  
  return `Appears to be a ${typeDesc} at a ${stageDesc}, with ${dominant}-heavy workflows.`;
}

/**
 * Get context-aware modifier for recommendations
 */
export function getContextModifier(
  context: TeamContext,
  recommendationType: 'downgrade' | 'consolidate' | 'reduce_seats'
): number {
  // Engineering teams may justify more tools
  if (context.type === 'engineering' && recommendationType === 'consolidate') {
    if (context.workflowIntensity.coding >= 0.8) {
      return 0.85; // Reduce confidence slightly for heavy coding teams
    }
  }
  
  // Content teams rarely need multiple coding tools
  if (context.type === 'content' && recommendationType === 'consolidate') {
    if (context.workflowIntensity.coding >= 0.5) {
      return 1.15; // Increase confidence for content teams with coding tools
    }
  }
  
  // Early-stage companies are more cost-sensitive
  if (context.stage === 'early-stage' && recommendationType === 'downgrade') {
    return 1.1; // Increase confidence in downgrades
  }
  
  // Mature companies may have valid reasons for premium plans
  if (context.stage === 'mature' && recommendationType === 'downgrade') {
    return 0.9; // Reduce confidence slightly
  }
  
  return 1.0; // No modification
}
