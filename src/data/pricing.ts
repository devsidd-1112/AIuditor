/**
 * Centralized pricing configuration for all AI tools
 * This is the single source of truth for pricing intelligence
 */

export type ToolCategory = 
  | "coding_assistant"
  | "general_chat"
  | "research"
  | "api_provider"
  | "specialized";

export type ToolRole = 
  | "development"
  | "writing"
  | "research"
  | "general_purpose"
  | "api_integration";

export interface ToolPlan {
  id: string;
  name: string;
  price: number; // monthly USD
  isEnterprise: boolean;
  features: {
    sso?: boolean;
    centralizedBilling?: boolean;
    auditLogs?: boolean;
    scim?: boolean;
    adminControls?: boolean;
    prioritySupport?: boolean;
    customLimits?: boolean;
  };
  intendedFor: string; // who this plan is designed for
  seats?: {
    min?: number;
    max?: number;
    perSeat?: boolean;
  };
}

export interface ToolConfig {
  id: string;
  name: string;
  category: ToolCategory;
  roles: ToolRole[];
  plans: ToolPlan[];
  hasApi: boolean;
  apiPricing?: {
    model: string;
    inputPer1M?: number; // USD per 1M tokens
    outputPer1M?: number;
  }[];
  overlapsWith: string[]; // IDs of tools with similar use cases
  strengths: string[]; // what this tool excels at
}

/**
 * Cursor - AI-powered code editor
 */
const cursorConfig: ToolConfig = {
  id: "cursor",
  name: "Cursor",
  category: "coding_assistant",
  roles: ["development"],
  hasApi: false,
  overlapsWith: ["copilot", "windsurf"],
  strengths: ["code completion", "code review", "AI-assisted development"],
  plans: [
    {
      id: "cursor-free",
      name: "Free (Hobby)",
      price: 0,
      isEnterprise: false,
      intendedFor: "Individual hobbyists and students",
      features: {},
    },
    {
      id: "cursor-pro",
      name: "Pro",
      price: 20,
      isEnterprise: false,
      intendedFor: "Individual professional developers",
      features: {
        prioritySupport: false,
      },
    },
    {
      id: "cursor-pro-plus",
      name: "Pro+",
      price: 60,
      isEnterprise: false,
      intendedFor: "Power users with high usage needs",
      features: {
        customLimits: true,
      },
    },
    {
      id: "cursor-ultra",
      name: "Ultra",
      price: 200,
      isEnterprise: false,
      intendedFor: "Extreme power users",
      features: {
        customLimits: true,
        prioritySupport: true,
      },
    },
    {
      id: "cursor-teams",
      name: "Teams",
      price: 40,
      isEnterprise: true,
      intendedFor: "Teams of 5+ developers needing collaboration",
      features: {
        centralizedBilling: true,
        adminControls: true,
        sso: true,
        scim: true,
        auditLogs: true,
      },
      seats: {
        min: 1,
        perSeat: true,
      },
    },
  ],
};

/**
 * ChatGPT - General purpose AI assistant
 */
const chatgptConfig: ToolConfig = {
  id: "chatgpt",
  name: "ChatGPT",
  category: "general_chat",
  roles: ["general_purpose", "writing", "research"],
  hasApi: false, // ChatGPT subscription is separate from OpenAI API
  overlapsWith: ["claude", "gemini"],
  strengths: ["general conversation", "writing", "brainstorming", "research"],
  plans: [
    {
      id: "chatgpt-free",
      name: "Free",
      price: 0,
      isEnterprise: false,
      intendedFor: "Casual users with basic needs",
      features: {},
    },
    {
      id: "chatgpt-plus",
      name: "Plus",
      price: 20,
      isEnterprise: false,
      intendedFor: "Individual power users",
      features: {
        prioritySupport: false,
      },
    },
    {
      id: "chatgpt-team",
      name: "Team",
      price: 25,
      isEnterprise: true,
      intendedFor: "Small teams needing collaboration workspace",
      features: {
        centralizedBilling: true,
        adminControls: true,
      },
      seats: {
        min: 2,
        perSeat: true,
      },
    },
    {
      id: "chatgpt-enterprise",
      name: "Enterprise",
      price: 60, // estimated, actual pricing is custom
      isEnterprise: true,
      intendedFor: "Large organizations with security/compliance needs",
      features: {
        sso: true,
        scim: true,
        auditLogs: true,
        centralizedBilling: true,
        adminControls: true,
        prioritySupport: true,
      },
      seats: {
        min: 50,
        perSeat: true,
      },
    },
  ],
};

/**
 * Claude - Anthropic's AI assistant
 */
const claudeConfig: ToolConfig = {
  id: "claude",
  name: "Claude",
  category: "general_chat",
  roles: ["general_purpose", "writing", "research"],
  hasApi: false, // Claude subscription is separate from Anthropic API
  overlapsWith: ["chatgpt", "gemini"],
  strengths: ["long-form writing", "analysis", "research", "nuanced reasoning"],
  plans: [
    {
      id: "claude-free",
      name: "Free",
      price: 0,
      isEnterprise: false,
      intendedFor: "Casual users",
      features: {},
    },
    {
      id: "claude-pro",
      name: "Pro",
      price: 20,
      isEnterprise: false,
      intendedFor: "Individual power users",
      features: {
        prioritySupport: false,
      },
    },
    {
      id: "claude-team",
      name: "Team",
      price: 30,
      isEnterprise: true,
      intendedFor: "Teams needing shared workspace",
      features: {
        centralizedBilling: true,
        adminControls: true,
      },
      seats: {
        min: 5,
        perSeat: true,
      },
    },
  ],
};

/**
 * Gemini - Google's AI assistant
 */
const geminiConfig: ToolConfig = {
  id: "gemini",
  name: "Gemini",
  category: "general_chat",
  roles: ["general_purpose", "research"],
  hasApi: true,
  overlapsWith: ["chatgpt", "claude"],
  strengths: ["Google integration", "research", "multimodal"],
  plans: [
    {
      id: "gemini-free",
      name: "Free",
      price: 0,
      isEnterprise: false,
      intendedFor: "Casual users",
      features: {},
    },
    {
      id: "gemini-advanced",
      name: "Advanced",
      price: 20,
      isEnterprise: false,
      intendedFor: "Power users",
      features: {
        prioritySupport: false,
      },
    },
  ],
};

/**
 * GitHub Copilot - AI pair programmer
 */
const copilotConfig: ToolConfig = {
  id: "copilot",
  name: "GitHub Copilot",
  category: "coding_assistant",
  roles: ["development"],
  hasApi: false,
  overlapsWith: ["cursor", "windsurf"],
  strengths: ["code completion", "GitHub integration", "IDE support"],
  plans: [
    {
      id: "copilot-individual",
      name: "Individual",
      price: 10,
      isEnterprise: false,
      intendedFor: "Individual developers",
      features: {},
    },
    {
      id: "copilot-business",
      name: "Business",
      price: 19,
      isEnterprise: true,
      intendedFor: "Organizations needing policy controls",
      features: {
        centralizedBilling: true,
        adminControls: true,
      },
      seats: {
        min: 1,
        perSeat: true,
      },
    },
    {
      id: "copilot-enterprise",
      name: "Enterprise",
      price: 39,
      isEnterprise: true,
      intendedFor: "Large organizations with custom needs",
      features: {
        sso: true,
        auditLogs: true,
        centralizedBilling: true,
        adminControls: true,
        customLimits: true,
      },
      seats: {
        min: 1,
        perSeat: true,
      },
    },
  ],
};

/**
 * Windsurf - AI coding assistant
 */
const windsurfConfig: ToolConfig = {
  id: "windsurf",
  name: "Windsurf",
  category: "coding_assistant",
  roles: ["development"],
  hasApi: false,
  overlapsWith: ["cursor", "copilot"],
  strengths: ["code generation", "AI-assisted development"],
  plans: [
    {
      id: "windsurf-free",
      name: "Free",
      price: 0,
      isEnterprise: false,
      intendedFor: "Individual developers",
      features: {},
    },
    {
      id: "windsurf-pro",
      name: "Pro",
      price: 15,
      isEnterprise: false,
      intendedFor: "Professional developers",
      features: {},
    },
  ],
};

/**
 * OpenAI API - API access to GPT models
 */
const openaiApiConfig: ToolConfig = {
  id: "openai-api",
  name: "OpenAI API",
  category: "api_provider",
  roles: ["api_integration"],
  hasApi: true,
  overlapsWith: ["anthropic-api"],
  strengths: ["GPT models", "embeddings", "wide model selection"],
  plans: [
    {
      id: "openai-api-payg",
      name: "Pay-as-you-go",
      price: 0, // usage-based
      isEnterprise: false,
      intendedFor: "Developers with variable usage",
      features: {},
    },
  ],
  apiPricing: [
    {
      model: "gpt-4o",
      inputPer1M: 2.50,
      outputPer1M: 10.00,
    },
    {
      model: "gpt-4o-mini",
      inputPer1M: 0.15,
      outputPer1M: 0.60,
    },
    {
      model: "gpt-3.5-turbo",
      inputPer1M: 0.50,
      outputPer1M: 1.50,
    },
  ],
};

/**
 * Anthropic API - API access to Claude models
 */
const anthropicApiConfig: ToolConfig = {
  id: "anthropic-api",
  name: "Anthropic API",
  category: "api_provider",
  roles: ["api_integration"],
  hasApi: true,
  overlapsWith: ["openai-api"],
  strengths: ["Claude models", "long context", "safety"],
  plans: [
    {
      id: "anthropic-api-payg",
      name: "Pay-as-you-go",
      price: 0, // usage-based
      isEnterprise: false,
      intendedFor: "Developers with variable usage",
      features: {},
    },
  ],
  apiPricing: [
    {
      model: "claude-3-opus",
      inputPer1M: 15.00,
      outputPer1M: 75.00,
    },
    {
      model: "claude-3-sonnet",
      inputPer1M: 3.00,
      outputPer1M: 15.00,
    },
    {
      model: "claude-3-haiku",
      inputPer1M: 0.25,
      outputPer1M: 1.25,
    },
  ],
};

/**
 * All tool configurations
 */
export const TOOL_CONFIGS: Record<string, ToolConfig> = {
  cursor: cursorConfig,
  chatgpt: chatgptConfig,
  claude: claudeConfig,
  gemini: geminiConfig,
  copilot: copilotConfig,
  windsurf: windsurfConfig,
  "openai-api": openaiApiConfig,
  "anthropic-api": anthropicApiConfig,
};

/**
 * Get tool configuration by ID
 */
export function getToolConfig(toolId: string): ToolConfig | undefined {
  return TOOL_CONFIGS[toolId];
}

/**
 * Get all tools in a category
 */
export function getToolsByCategory(category: ToolCategory): ToolConfig[] {
  return Object.values(TOOL_CONFIGS).filter((tool) => tool.category === category);
}

/**
 * Get tools that overlap with a given tool
 */
export function getOverlappingTools(toolId: string): ToolConfig[] {
  const tool = getToolConfig(toolId);
  if (!tool) return [];
  
  return tool.overlapsWith
    .map((id) => getToolConfig(id))
    .filter((t): t is ToolConfig => t !== undefined);
}

/**
 * Find a plan by tool ID and plan ID
 */
export function findPlan(toolId: string, planId: string): ToolPlan | undefined {
  const tool = getToolConfig(toolId);
  return tool?.plans.find((p) => p.id === planId);
}
