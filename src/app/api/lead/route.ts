/**
 * POST /api/lead
 * Capture lead information and send email confirmation
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerClient } from "@/lib/supabase";
import { resend, FROM_EMAIL, generateAuditReportEmail, generateAuditReportEmailText } from "@/lib/email";
import { rateLimit, getClientIdentifier, RATE_LIMITS } from "@/lib/rate-limit";

interface LeadRequestBody {
  email: string;
  company?: string;
  role?: string;
  teamSize?: string;
  auditId: string;
  reportUrl: string;
  monthlySavings: number;
  annualSavings: number;
  optimizationScore: number;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const identifier = getClientIdentifier(request);
    const rateLimitResult = rateLimit(identifier, RATE_LIMITS.LEAD);
    
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
    
    const body: LeadRequestBody = await request.json();
    
    // Validate required fields
    if (!body.email || !body.auditId || !body.reportUrl) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }
    
    // Save lead to database
    const supabase = getServerClient();
    const { error: dbError } = await supabase
      .from("leads")
      .insert({
        email: body.email,
        company: body.company || null,
        role: body.role || null,
        team_size: body.teamSize || null,
        audit_id: body.auditId,
      });
    
    if (dbError) {
      console.error("Failed to save lead:", dbError);
      // Continue even if lead save fails - still send email
    }
    
    // Send email confirmation
    let emailSent = false;
    if (resend) {
      try {
        const emailHtml = generateAuditReportEmail({
          reportUrl: body.reportUrl,
          monthlySavings: body.monthlySavings,
          annualSavings: body.annualSavings,
          optimizationScore: body.optimizationScore,
        });
        
        const emailText = generateAuditReportEmailText({
          reportUrl: body.reportUrl,
          monthlySavings: body.monthlySavings,
          annualSavings: body.annualSavings,
          optimizationScore: body.optimizationScore,
        });
        
        await resend.emails.send({
          from: FROM_EMAIL,
          to: body.email,
          subject: `Your AIuditor Report - $${body.monthlySavings.toFixed(0)}/mo in potential savings`,
          html: emailHtml,
          text: emailText,
        });
        
        emailSent = true;
      } catch (emailError) {
        console.error("Failed to send email:", emailError);
        // Don't fail the request if email fails
      }
    }
    
    return NextResponse.json({
      success: true,
      emailSent,
      message: emailSent 
        ? "Report sent to your email" 
        : "Lead captured successfully",
    });
    
  } catch (error) {
    console.error("Error processing lead:", error);
    
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
