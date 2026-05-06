export const trackedAiTools = [
  "ChatGPT",
  "Claude",
  "Cursor",
  "Gemini",
  "GitHub Copilot",
  "OpenAI API",
  "Anthropic API",
] as const;

export type TrackedAiTool = (typeof trackedAiTools)[number];
