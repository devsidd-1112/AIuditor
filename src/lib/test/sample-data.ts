/**
 * Sample test data for development and QA
 * Use for local testing, UI development, and public report testing
 */

import type { AuditResult, Recommendation, ToolUsage } from "@/types";

/**
 * Sample tool usage data
 */
export const sampleTools: ToolUsage[] = [
  {
    toolId: "cursor",
    toolName: "Cursor",
    planId: "cursor-teams",
    planName: "Teams",
    monthlySpend: 120,
    seats: 3,
    category: "coding_assistant",
    roles: ["development"],
  },
  {
    toolId: "chatgpt",
    toolName: "ChatGPT",
    planId: "chatgpt-team",
    planName: "Team",
    monthlySpend: 75,
    seats: 3,
    category: "general_chat",
    roles: ["writing", "research", "general_purpose"],
  },
  {
    toolId: "github-copilot",
    toolName: "GitHub Copilot",
    planId: "copilot-business",
    planName: "Business",
    monthlySpend: 57,
    seats: 3,
    category: "coding_assistant",
    roles: ["development"],
  },
];

/**
 * Sample recommendations
 */
export const sampleRecommendations: Recommendation[] = [
  {
    id: "rec-1",
    category: "downgrade",
    severity: "high",
    confidence: 0.9,
    title: "Downgrade Cursor from Teams to Pro",
    description: "Your team of 3 would save $60/month by using individual Pro plans instead of Teams",
    reasoning:
      "Cursor Teams is designed for teams of 5+ users who need collaboration features. For 3 users, individual Pro subscriptions ($20/user) are more cost-effective than Teams ($40/user).",
    affectedTools: ["cursor"],
    suggestion: "Switch to 3 individual Cursor Pro subscriptions at $20/month each",
    actionable: true,
    savings: {
      monthly: 60,
      annual: 720,
      percentage: 50,
    },
    metadata: {
      currentPlan: "Teams",
      suggestedPlan: "Pro",
      currentSeats: 3,
      suggestedSeats: 3,
    },
  },
  {
    id: "rec-2",
    category: "overlap",
    severity: "medium",
    confidence: 0.75,
    title: "Consolidate overlapping coding assistants",
    description: "You're using both Cursor and GitHub Copilot, which have 80% feature overlap",
    reasoning:
      "Both tools provide AI code completion and generation. Most teams find one coding assistant sufficient. Cursor includes most Copilot features plus additional IDE capabilities.",
    affectedTools: ["cursor", "github-copilot"],
    suggestion: "Consider using only Cursor and canceling GitHub Copilot Business",
    actionable: true,
    savings: {
      monthly: 57,
      annual: 684,
      percentage: 100,
    },
    metadata: {
      overlapScore: 80,
    },
  },
  {
    id: "rec-3",
    category: "downgrade",
    severity: "medium",
    confidence: 0.85,
    title: "Downgrade ChatGPT from Team to Plus",
    description: "For 3 users, individual Plus subscriptions are cheaper than Team plan",
    reasoning:
      "ChatGPT Team costs $25/user/month. Individual Plus subscriptions cost $20/user/month. Unless you need workspace features, Plus is more economical.",
    affectedTools: ["chatgpt"],
    suggestion: "Switch to 3 individual ChatGPT Plus subscriptions",
    actionable: true,
    savings: {
      monthly: 15,
      annual: 180,
      percentage: 20,
    },
    metadata: {
      currentPlan: "Team",
      suggestedPlan: "Plus",
      currentSeats: 3,
    },
  },
];

/**
 * Sample audit result with high savings
 */
export const sampleAuditHighSavings: AuditResult = {
  input: {
    tools: sampleTools,
    teamSize: 3,
  },
  savings: {
    current: {
      monthly: 252,
      annual: 3024,
    },
    optimized: {
      monthly: 120,
      annual: 1440,
    },
    savings: {
      monthly: 132,
      annual: 1584,
      percentage: 52.4,
    },
  },
  score: {
    overall: 58,
    breakdown: {
      planEfficiency: 45,
      toolRedundancy: 60,
      seatUtilization: 70,
      enterpriseOverkill: 55,
    },
    rating: "moderate",
  },
  recommendations: sampleRecommendations,
  auditedAt: new Date(),
  version: "2.0.0",
};

/**
 * Sample audit result already optimized
 */
export const sampleAuditOptimized: AuditResult = {
  input: {
    tools: [
      {
        toolId: "cursor",
        toolName: "Cursor",
        planId: "cursor-pro",
        planName: "Pro",
        monthlySpend: 20,
        seats: 1,
        category: "coding_assistant",
        roles: ["development"],
      },
      {
        toolId: "chatgpt",
        toolName: "ChatGPT",
        planId: "chatgpt-plus",
        planName: "Plus",
        monthlySpend: 20,
        seats: 1,
        category: "general_chat",
        roles: ["writing"],
      },
    ],
    teamSize: 1,
  },
  savings: {
    current: {
      monthly: 40,
      annual: 480,
    },
    optimized: {
      monthly: 40,
      annual: 480,
    },
    savings: {
      monthly: 0,
      annual: 0,
      percentage: 0,
    },
  },
  score: {
    overall: 92,
    breakdown: {
      planEfficiency: 95,
      toolRedundancy: 90,
      seatUtilization: 100,
      enterpriseOverkill: 85,
    },
    rating: "excellent",
  },
  recommendations: [
    {
      id: "rec-optimized",
      category: "already_optimized",
      severity: "low",
      confidence: 0.9,
      title: "Your AI stack is well-optimized",
      description: "No major optimization opportunities detected",
      reasoning:
        "You're using individual plans appropriate for solo usage with no significant overlap or waste.",
      affectedTools: [],
      suggestion: "Continue monitoring usage and costs quarterly",
      actionable: false,
      savings: {
        monthly: 0,
        annual: 0,
        percentage: 0,
      },
    },
  ],
  auditedAt: new Date(),
  version: "2.0.0",
};

/**
 * Sample audit result with moderate savings
 */
export const sampleAuditModerateSavings: AuditResult = {
  input: {
    tools: [
      {
        toolId: "cursor",
        toolName: "Cursor",
        planId: "cursor-pro",
        planName: "Pro",
        monthlySpend: 40,
        seats: 2,
        category: "coding_assistant",
        roles: ["development"],
      },
      {
        toolId: "chatgpt",
        toolName: "ChatGPT",
        planId: "chatgpt-team",
        planName: "Team",
        monthlySpend: 50,
        seats: 2,
        category: "general_chat",
        roles: ["writing"],
      },
    ],
    teamSize: 2,
  },
  savings: {
    current: {
      monthly: 90,
      annual: 1080,
    },
    optimized: {
      monthly: 80,
      annual: 960,
    },
    savings: {
      monthly: 10,
      annual: 120,
      percentage: 11.1,
    },
  },
  score: {
    overall: 78,
    breakdown: {
      planEfficiency: 85,
      toolRedundancy: 80,
      seatUtilization: 75,
      enterpriseOverkill: 70,
    },
    rating: "good",
  },
  recommendations: [
    {
      id: "rec-moderate",
      category: "downgrade",
      severity: "low",
      confidence: 0.7,
      title: "Consider ChatGPT Plus instead of Team",
      description: "Small potential savings by switching to individual Plus plans",
      reasoning: "For 2 users, the cost difference is minimal but Plus may be sufficient",
      affectedTools: ["chatgpt"],
      suggestion: "Evaluate if Team workspace features are needed",
      actionable: true,
      savings: {
        monthly: 10,
        annual: 120,
        percentage: 20,
      },
    },
  ],
  auditedAt: new Date(),
  version: "2.0.0",
};
