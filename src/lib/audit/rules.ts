/**
 * Audit rules system - V2 Enhanced
 * Deterministic rules with weighted confidence scoring
 */

import type { ToolUsage, Recommendation, RecommendationCategory } from "@/types";
import { getToolConfig, findPlan } from "@/data/pricing";
import { calculateMonthlySavings, calculateAnnualSavings, calculatePercentageSavings } from "./calculations";
import {
  generateEnterpriseDowngradeReasoning,
  generateOverlapReasoning,
  generateUnusedSeatsReasoning,
  generateRecommendationTitle,
  generateActionableSuggestion,
} from "./reasoning";

import {
  calculateDowngradeConfidence,
  calculateOverlapConfidence,
  calculateSeatReductionConfidence,
  calculateOverlapIntensity,
} from "./v2";

/**
 * Rule evaluation context
 */
export interface RuleContext {
  tools: ToolUsage[];
  teamSize?: number;
  primaryUseCase?: string;
}

/**
 * Rule evaluation result
 */
export interface RuleResult {
  triggered: boolean;
  recommendation?: Recommendation;
}

/**
 * Base rule interface
 */
export interface AuditRule {
  id: string;
  name: string;
  description: string;
  category: RecommendationCategory;
  evaluate: (context: RuleContext) => RuleResult;
}

/**
 * Rule 1: Small team using Cursor Teams - V2 Enhanced
 * Weighted confidence based on team size and spend
 */
export const cursorTeamsDowngradeRule: AuditRule = {
  id: "cursor-teams-small-team",
  name: "Cursor Teams Downgrade",
  description: "Detect small teams overpaying for Cursor Teams",
  category: "downgrade",
  
  evaluate: (context: RuleContext): RuleResult => {
    const { tools, teamSize } = context;
    
    // Only trigger if team size is known and small
    if (!teamSize || teamSize >= 5) {
      return { triggered: false };
    }
    
    // Find Cursor Teams usage
    const cursorTeams = tools.find(
      (t) => t.toolId === "cursor" && t.planId === "cursor-teams"
    );
    
    if (!cursorTeams) {
      return { triggered: false };
    }
    
    // Calculate savings: Teams ($40/seat) → Pro ($20)
    const currentCost = cursorTeams.monthlySpend;
    const proCost = 20;
    const monthlySavings = calculateMonthlySavings(currentCost, proCost);
    
    if (monthlySavings <= 0) {
      return { triggered: false };
    }
    
    // V2: Calculate weighted confidence
    const confidenceResult = calculateDowngradeConfidence(
      teamSize,
      40, // Cursor Teams price per seat
      cursorTeams.seats
    );
    
    const recommendation: Recommendation = {
      id: `rec-${Date.now()}-cursor-teams`,
      category: "downgrade",
      severity: "high",
      confidence: confidenceResult.confidence, // V2: Weighted confidence
      
      title: generateRecommendationTitle("downgrade", ["Cursor"]),
      description: "Small team using enterprise plan",
      reasoning: generateEnterpriseDowngradeReasoning(
        "Cursor",
        teamSize,
        "Cursor Teams",
        "Cursor Pro"
      ),
      
      affectedTools: ["cursor"],
      
      suggestion: generateActionableSuggestion("downgrade", {
        currentPlan: "Cursor Teams",
        suggestedPlan: "Cursor Pro",
      }),
      actionable: true,
      
      savings: {
        monthly: monthlySavings,
        annual: calculateAnnualSavings(monthlySavings),
        percentage: calculatePercentageSavings(currentCost, monthlySavings),
      },
      
      metadata: {
        currentPlan: "Cursor Teams",
        suggestedPlan: "Cursor Pro",
        currentSeats: cursorTeams.seats,
        implementationComplexity: 'easy',
        workflowRisk: 'low',
      },
    };
    
    return { triggered: true, recommendation };
  },
};

/**
 * Rule 2: Multiple overlapping general chat assistants - V2 Enhanced
 * Weighted confidence with overlap intensity scoring
 */
export const overlappingChatAssistantsRule: AuditRule = {
  id: "overlapping-chat-assistants",
  name: "Overlapping Chat Assistants",
  description: "Detect multiple general AI chat subscriptions",
  category: "overlap", // V2: Updated category name
  
  evaluate: (context: RuleContext): RuleResult => {
    const { tools, teamSize } = context;
    
    // Find all general chat assistants
    const chatTools = tools.filter((t) =>
      ["chatgpt", "claude", "gemini"].includes(t.toolId)
    );
    
    // Only trigger if 2+ chat assistants
    if (chatTools.length < 2) {
      return { triggered: false };
    }
    
    // V2: Calculate overlap intensity
    const overlapScore = calculateOverlapIntensity(chatTools, 'chat_assistant');
    
    // Only trigger for medium+ overlaps
    if (overlapScore.score < 26) {
      return { triggered: false };
    }
    
    const toolNames = chatTools.map((t) => t.toolName);
    const totalCost = chatTools.reduce((sum, t) => sum + t.monthlySpend, 0);
    const estimatedSavings = overlapScore.wasteEstimate;
    
    // V2: Calculate weighted confidence
    const confidenceResult = calculateOverlapConfidence(
      teamSize || 1,
      totalCost,
      overlapScore.score,
      chatTools.length
    );
    
    const recommendation: Recommendation = {
      id: `rec-${Date.now()}-chat-overlap`,
      category: "overlap", // V2: Updated category
      severity: overlapScore.intensity === 'critical' ? 'high' : 'medium',
      confidence: confidenceResult.confidence, // V2: Weighted confidence
      
      title: generateRecommendationTitle("overlap", toolNames),
      description: "Multiple overlapping AI chat assistants",
      reasoning: generateOverlapReasoning(
        toolNames,
        "general AI assistance",
        overlapScore.score / 100
      ),
      
      affectedTools: chatTools.map((t) => t.toolId),
      
      suggestion: generateActionableSuggestion("overlap", {}),
      actionable: true,
      
      savings: {
        monthly: estimatedSavings,
        annual: calculateAnnualSavings(estimatedSavings),
        percentage: calculatePercentageSavings(totalCost, estimatedSavings),
      },
      
      metadata: {
        overlapScore: overlapScore.score,
        overlapIntensity: overlapScore.intensity,
        implementationComplexity: 'moderate',
        workflowRisk: 'low',
      },
    };
    
    return { triggered: true, recommendation };
  },
};

/**
 * Rule 3: Unused seats on per-seat plans - V2 Enhanced
 * Weighted confidence based on excess ratio
 */
export const unusedSeatsRule: AuditRule = {
  id: "unused-seats",
  name: "Unused Seats",
  description: "Detect unused seats on per-seat plans",
  category: "unused_seats", // V2: Updated category name
  
  evaluate: (context: RuleContext): RuleResult => {
    const { tools, teamSize } = context;
    
    if (!teamSize) {
      return { triggered: false };
    }
    
    // Find tools with excess seats
    for (const tool of tools) {
      const config = getToolConfig(tool.toolId);
      if (!config) continue;
      
      const plan = findPlan(tool.toolId, tool.planId);
      if (!plan || !plan.seats?.perSeat) continue;
      
      // Check if seats significantly exceed team size
      if (tool.seats > teamSize * 1.2) {
        const perSeatCost = tool.monthlySpend / tool.seats;
        const suggestedSeats = Math.ceil(teamSize * 1.1); // 10% buffer
        const monthlySavings = (tool.seats - suggestedSeats) * perSeatCost;
        
        // V2: Calculate weighted confidence
        const confidenceResult = calculateSeatReductionConfidence(
          teamSize,
          tool.seats,
          tool.monthlySpend
        );
        
        const recommendation: Recommendation = {
          id: `rec-${Date.now()}-unused-seats-${tool.toolId}`,
          category: "unused_seats", // V2: Updated category
          severity: "high",
          confidence: confidenceResult.confidence, // V2: Weighted confidence
          
          title: generateRecommendationTitle("unused_seats", [tool.toolName]),
          description: "Paying for unused seats",
          reasoning: generateUnusedSeatsReasoning(
            tool.toolName,
            tool.seats,
            teamSize,
            Math.round(monthlySavings)
          ),
          
          affectedTools: [tool.toolId],
          
          suggestion: generateActionableSuggestion("unused_seats", {
            currentSeats: tool.seats,
            suggestedSeats,
          }),
          actionable: true,
          
          savings: {
            monthly: monthlySavings,
            annual: calculateAnnualSavings(monthlySavings),
            percentage: calculatePercentageSavings(tool.monthlySpend, monthlySavings),
          },
          
          metadata: {
            currentSeats: tool.seats,
            suggestedSeats,
            implementationComplexity: 'easy',
            workflowRisk: 'none',
          },
        };
        
        return { triggered: true, recommendation };
      }
    }
    
    return { triggered: false };
  },
};

/**
 * Rule 4: Small team using ChatGPT Team - V2 Enhanced
 * Weighted confidence based on team size and spend
 */
export const chatgptTeamDowngradeRule: AuditRule = {
  id: "chatgpt-team-small-team",
  name: "ChatGPT Team Downgrade",
  description: "Detect small teams overpaying for ChatGPT Team",
  category: "downgrade",
  
  evaluate: (context: RuleContext): RuleResult => {
    const { tools, teamSize } = context;
    
    if (!teamSize || teamSize > 3) {
      return { triggered: false };
    }
    
    const chatgptTeam = tools.find(
      (t) => t.toolId === "chatgpt" && t.planId === "chatgpt-team"
    );
    
    if (!chatgptTeam) {
      return { triggered: false };
    }
    
    // Calculate savings: Team ($25/seat) → Plus ($20)
    const currentCost = chatgptTeam.monthlySpend;
    const plusCost = 20 * teamSize;
    const monthlySavings = calculateMonthlySavings(currentCost, plusCost);
    
    if (monthlySavings <= 0) {
      return { triggered: false };
    }
    
    // V2: Calculate weighted confidence
    const confidenceResult = calculateDowngradeConfidence(
      teamSize,
      25, // ChatGPT Team price per seat
      chatgptTeam.seats
    );
    
    const recommendation: Recommendation = {
      id: `rec-${Date.now()}-chatgpt-team`,
      category: "downgrade",
      severity: "medium",
      confidence: confidenceResult.confidence, // V2: Weighted confidence
      
      title: generateRecommendationTitle("downgrade", ["ChatGPT"]),
      description: "Small team using Team plan",
      reasoning: generateEnterpriseDowngradeReasoning(
        "ChatGPT",
        teamSize,
        "ChatGPT Team",
        "ChatGPT Plus"
      ),
      
      affectedTools: ["chatgpt"],
      
      suggestion: generateActionableSuggestion("downgrade", {
        currentPlan: "ChatGPT Team",
        suggestedPlan: "ChatGPT Plus (individual subscriptions)",
      }),
      actionable: true,
      
      savings: {
        monthly: monthlySavings,
        annual: calculateAnnualSavings(monthlySavings),
        percentage: calculatePercentageSavings(currentCost, monthlySavings),
      },
      
      metadata: {
        currentPlan: "ChatGPT Team",
        suggestedPlan: "ChatGPT Plus",
        implementationComplexity: 'easy',
        workflowRisk: 'low',
      },
    };
    
    return { triggered: true, recommendation };
  },
};

/**
 * Rule 5: Overlapping coding assistants - V2 Enhanced
 * Weighted confidence with overlap intensity scoring
 */
export const overlappingCodingAssistantsRule: AuditRule = {
  id: "overlapping-coding-assistants",
  name: "Overlapping Coding Assistants",
  description: "Detect multiple coding assistant subscriptions",
  category: "overlap", // V2: Updated category
  
  evaluate: (context: RuleContext): RuleResult => {
    const { tools, teamSize } = context;
    
    const codingTools = tools.filter((t) =>
      ["cursor", "copilot", "windsurf"].includes(t.toolId)
    );
    
    if (codingTools.length < 2) {
      return { triggered: false };
    }
    
    // V2: Calculate overlap intensity
    const overlapScore = calculateOverlapIntensity(codingTools, 'coding_assistant');
    
    // Only trigger for medium+ overlaps
    if (overlapScore.score < 26) {
      return { triggered: false };
    }
    
    const toolNames = codingTools.map((t) => t.toolName);
    const totalCost = codingTools.reduce((sum, t) => sum + t.monthlySpend, 0);
    const estimatedSavings = overlapScore.wasteEstimate;
    
    // V2: Calculate weighted confidence
    const confidenceResult = calculateOverlapConfidence(
      teamSize || 1,
      totalCost,
      overlapScore.score,
      codingTools.length
    );
    
    const recommendation: Recommendation = {
      id: `rec-${Date.now()}-coding-overlap`,
      category: "overlap", // V2: Updated category
      severity: overlapScore.intensity === 'critical' ? 'high' : 'medium',
      confidence: confidenceResult.confidence, // V2: Weighted confidence
      
      title: generateRecommendationTitle("overlap", toolNames),
      description: "Multiple overlapping coding assistants",
      reasoning: generateOverlapReasoning(
        toolNames,
        "AI-assisted development",
        overlapScore.score / 100
      ),
      
      affectedTools: codingTools.map((t) => t.toolId),
      
      suggestion: generateActionableSuggestion("overlap", {}),
      actionable: true,
      
      savings: {
        monthly: estimatedSavings,
        annual: calculateAnnualSavings(estimatedSavings),
        percentage: calculatePercentageSavings(totalCost, estimatedSavings),
      },
      
      metadata: {
        overlapScore: overlapScore.score,
        overlapIntensity: overlapScore.intensity,
        implementationComplexity: 'moderate',
        workflowRisk: 'low',
      },
    };
    
    return { triggered: true, recommendation };
  },
};

/**
 * All available rules
 */
export const ALL_RULES: AuditRule[] = [
  cursorTeamsDowngradeRule,
  overlappingChatAssistantsRule,
  unusedSeatsRule,
  chatgptTeamDowngradeRule,
  overlappingCodingAssistantsRule,
];

/**
 * Evaluate all rules against context
 */
export function evaluateAllRules(context: RuleContext): Recommendation[] {
  const recommendations: Recommendation[] = [];
  
  for (const rule of ALL_RULES) {
    const result = rule.evaluate(context);
    if (result.triggered && result.recommendation) {
      recommendations.push(result.recommendation);
    }
  }
  
  return recommendations;
}
