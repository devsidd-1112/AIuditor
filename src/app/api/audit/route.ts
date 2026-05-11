/**
 * POST /api/audit
 * Save audit result and return public slug
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerClient } from "@/lib/supabase";
import { saveAudit } from "@/lib/audit/persistence";
import { rateLimit, getClientIdentifier, RATE_LIMITS } from "@/lib/rate-limit";
import type { AuditResult } from "@/types";

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const identifier = getClientIdentifier(request);
    const rateLimitResult = rateLimit(identifier, RATE_LIMITS.AUDIT);
    
    if (!rateLimitResult.allowed) {
      const retryAfter = Math.ceil((rateLimitResult.resetAt - Date.now()) / 1000);
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { 
          status: 429,
          headers: {
            'Retry-After': String(retryAfter),
            'X-RateLimit-Limit': String(rateLimitResult.limit),
            'X-RateLimit-Remaining': String(rateLimitResult.remaining),
            'X-RateLimit-Reset': String(rateLimitResult.resetAt),
          }
        }
      );
    }
    
    const body = await request.json();
    
    // Basic validation
    if (!body || !body.input || !body.recommendations || !body.savings) {
      return NextResponse.json(
        { error: "Invalid audit data" },
        { status: 400 }
      );
    }
    
    // Reconstruct AuditResult with proper Date object
    const auditResult: AuditResult = {
      ...body,
      auditedAt: new Date(body.auditedAt),
    };
    
    // Save to database
    const supabase = getServerClient();
    const { slug, id } = await saveAudit(auditResult, supabase);
    
    // Return public URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const reportUrl = `${baseUrl}/audit/${slug}`;
    
    return NextResponse.json({
      success: true,
      slug,
      id,
      reportUrl,
    });
    
  } catch (error) {
    console.error("Error saving audit:", error);
    
    return NextResponse.json(
      { error: "Failed to save audit report" },
      { status: 500 }
    );
  }
}
