// AI tool data and constants
// This will be populated with pricing data as the audit engine is built

export const AI_TOOLS = [
  "ChatGPT",
  "Claude",
  "Cursor",
  "Gemini",
  "GitHub Copilot",
  "OpenAI API",
  "Anthropic API",
] as const;

export type AITool = (typeof AI_TOOLS)[number];
