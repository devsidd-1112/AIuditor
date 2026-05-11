/**
 * Tool and plan name normalization utilities
 * Ensures consistent comparisons and matching
 */

/**
 * Normalize tool names to canonical IDs
 */
const TOOL_NAME_MAPPINGS: Record<string, string> = {
  // ChatGPT variations
  "chatgpt": "chatgpt",
  "chat gpt": "chatgpt",
  "gpt": "chatgpt",
  "openai chat": "chatgpt",
  
  // Claude variations
  "claude": "claude",
  "claude ai": "claude",
  "anthropic": "claude",
  
  // Cursor variations
  "cursor": "cursor",
  "cursor ai": "cursor",
  "cursor editor": "cursor",
  
  // Copilot variations
  "copilot": "copilot",
  "github copilot": "copilot",
  "gh copilot": "copilot",
  
  // Gemini variations
  "gemini": "gemini",
  "google gemini": "gemini",
  "bard": "gemini",
  
  // Windsurf variations
  "windsurf": "windsurf",
  "windsurf ai": "windsurf",
  
  // API variations
  "openai api": "openai-api",
  "openai": "openai-api",
  "gpt api": "openai-api",
  "anthropic api": "anthropic-api",
  "claude api": "anthropic-api",
};

/**
 * Normalize plan names to canonical IDs
 */
const PLAN_NAME_MAPPINGS: Record<string, Record<string, string>> = {
  chatgpt: {
    "free": "chatgpt-free",
    "plus": "chatgpt-plus",
    "chatgpt plus": "chatgpt-plus",
    "team": "chatgpt-team",
    "teams": "chatgpt-team",
    "enterprise": "chatgpt-enterprise",
  },
  claude: {
    "free": "claude-free",
    "pro": "claude-pro",
    "claude pro": "claude-pro",
    "team": "claude-team",
    "teams": "claude-team",
  },
  cursor: {
    "free": "cursor-free",
    "hobby": "cursor-free",
    "pro": "cursor-pro",
    "pro+": "cursor-pro-plus",
    "pro plus": "cursor-pro-plus",
    "ultra": "cursor-ultra",
    "team": "cursor-teams",
    "teams": "cursor-teams",
  },
  copilot: {
    "individual": "copilot-individual",
    "business": "copilot-business",
    "enterprise": "copilot-enterprise",
  },
  gemini: {
    "free": "gemini-free",
    "advanced": "gemini-advanced",
  },
  windsurf: {
    "free": "windsurf-free",
    "pro": "windsurf-pro",
  },
};

/**
 * Normalize a tool name to its canonical ID
 */
export function normalizeToolName(name: string): string {
  const normalized = name.toLowerCase().trim();
  return TOOL_NAME_MAPPINGS[normalized] || normalized;
}

/**
 * Normalize a plan name for a specific tool
 */
export function normalizePlanName(toolId: string, planName: string): string {
  const normalized = planName.toLowerCase().trim();
  const toolMappings = PLAN_NAME_MAPPINGS[toolId];
  
  if (!toolMappings) {
    return normalized;
  }
  
  return toolMappings[normalized] || normalized;
}

/**
 * Check if two tool names refer to the same tool
 */
export function isSameTool(name1: string, name2: string): boolean {
  return normalizeToolName(name1) === normalizeToolName(name2);
}

/**
 * Check if two plan names refer to the same plan
 */
export function isSamePlan(toolId: string, plan1: string, plan2: string): boolean {
  return normalizePlanName(toolId, plan1) === normalizePlanName(toolId, plan2);
}

/**
 * Extract tool category from normalized tool ID
 */
export function getToolCategoryFromId(toolId: string): string {
  const categoryMap: Record<string, string> = {
    "chatgpt": "general_chat",
    "claude": "general_chat",
    "gemini": "general_chat",
    "cursor": "coding_assistant",
    "copilot": "coding_assistant",
    "windsurf": "coding_assistant",
    "openai-api": "api_provider",
    "anthropic-api": "api_provider",
  };
  
  return categoryMap[toolId] || "specialized";
}
