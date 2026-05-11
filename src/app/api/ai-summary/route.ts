/**
 * AI Summary API Route
 * Generates personalized audit summary using Claude API
 */

import { NextRequest, NextResponse } from "next/server";
import { generateAISummary } from "@/lib/ai/summary";
import type { AuditResult } from "@/types/audit";

export async function POST(request: NextRequest) {
  try {
    const auditResult: AuditResult = await request.json();

    // Validate input
    if (!auditResult || !auditResult.input || !auditResult.savings) {
      return NextResponse.json(
        { error: "Invalid audit result data" },
        { status: 400 }
      );
    }

    // Generate AI summary
    const summary = await generateAISummary(auditResult);

    return NextResponse.json({ summary });
  } catch (error) {
    console.error("AI summary API error:", error);
    
    return NextResponse.json(
      { 
        error: "Failed to generate summary",
        fallback: true 
      },
      { status: 500 }
    );
  }
}
