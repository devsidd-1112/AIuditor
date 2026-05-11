/**
 * AI-Generated Audit Summary
 * Uses Google Gemini API to generate personalized audit summaries
 * Falls back to template-based summary if API fails
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import type { AuditResult } from "@/types/audit";

/**
 * Generate AI-powered personalized summary
 * Returns ~100 word summary of the audit results
 */
export async function generateAISummary(
  auditResult: AuditResult
): Promise<string> {
  // Check if API key is configured
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.warn("GEMINI_API_KEY not configured, using fallback summary");
    return generateFallbackSummary(auditResult);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash", // Gemini 2.5 Flash - Free tier model
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048, // Much higher limit for complete response
      },
    });

    const prompt = buildPrompt(auditResult);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    // Log finish reason for debugging
    const candidate = response.candidates?.[0];
    if (candidate?.finishReason && candidate.finishReason !== "STOP") {
      console.warn("AI response finished with reason:", candidate.finishReason);
    }
    
    // Check if response was blocked
    if (!response.candidates || response.candidates.length === 0) {
      console.warn("AI response blocked or empty, using fallback");
      return generateFallbackSummary(auditResult);
    }
    
    const summary = response.text();

    return summary.trim();
  } catch (error) {
    console.error("AI summary generation failed:", error);
    return generateFallbackSummary(auditResult);
  }
}

/**
 * Build the prompt for Gemini
 */
function buildPrompt(auditResult: AuditResult): string {
  const { input, savings, score, recommendations } = auditResult;
  
  const toolsList = input.tools
    .map((t) => `${t.toolName} (${t.planName})`)
    .join(", ");
  
  const savingsAmount = savings.savings.monthly;
  const savingsPercent = savings.savings.percentage;
  const optimizationScore = score.overall;
  const recCount = recommendations.filter(r => r.category !== "already_optimized").length;

  return `You are an AI spend optimization consultant. Write a personalized 100-word summary for a startup's AI tool audit.

Context:
- Team size: ${input.teamSize} people
- Current tools: ${toolsList}
- Monthly spend: $${savings.current.monthly}
- Potential savings: $${savingsAmount}/month (${savingsPercent.toFixed(1)}%)
- Optimization score: ${optimizationScore}/100
- Recommendations: ${recCount}

Write a concise, professional summary that:
1. Acknowledges their current setup
2. Highlights the key finding (savings opportunity or already optimized)
3. Mentions 1-2 specific actionable recommendations if any
4. Uses a consultative, honest tone (not salesy)
5. Is exactly ~100 words

Do not use phrases like "I analyzed" or "I recommend". Write in third person or direct address.`;
}

/**
 * Fallback summary when AI is unavailable
 */
function generateFallbackSummary(auditResult: AuditResult): string {
  const { input, savings, score, recommendations } = auditResult;
  
  const savingsAmount = savings.savings.monthly;
  const optimizationScore = score.overall;
  const recCount = recommendations.filter(r => r.category !== "already_optimized").length;
  
  // Already optimized case
  if (optimizationScore >= 80 && savingsAmount < 20) {
    return `Your ${input.teamSize}-person team demonstrates disciplined AI tool allocation. With an optimization score of ${optimizationScore}/100, your current stack of ${input.tools.length} tool${input.tools.length > 1 ? 's' : ''} reflects appropriate plan sizing and minimal redundancy. Your monthly spend of $${savings.current.monthly} aligns well with team scale and usage patterns. Continue monitoring quarterly as your team grows and usage evolves.`;
  }
  
  // Moderate savings case
  if (savingsAmount < 100) {
    return `Analysis of your ${input.teamSize}-person team's AI stack identified ${recCount} optimization opportunit${recCount === 1 ? 'y' : 'ies'} with potential monthly savings of $${savingsAmount}. Your current optimization score of ${optimizationScore}/100 suggests room for improvement through plan adjustments and overlap reduction. The recommendations focus on right-sizing subscriptions to match actual team usage patterns while maintaining operational capability.`;
  }
  
  // High savings case
  return `Your ${input.teamSize}-person team has significant optimization potential, with $${savingsAmount}/month ($${savings.savings.annual}/year) in identified savings. Current optimization score of ${optimizationScore}/100 indicates ${recCount} actionable recommendation${recCount === 1 ? '' : 's'} across plan downgrades and overlap reduction. These changes can be implemented with minimal workflow disruption while preserving core capabilities. Priority should be given to high-confidence recommendations with immediate financial impact.`;
}
