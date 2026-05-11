/**
 * Supabase database types
 * Lightweight type definitions for database tables
 */

import type { AuditResult, Recommendation } from "@/types";

/**
 * Audits table row
 */
export interface AuditRow {
  id: string;
  created_at: string;
  public_slug: string;
  
  // Normalized audit data
  tool_data: {
    tools: Array<{
      toolId: string;
      toolName: string;
      planId: string;
      planName: string;
      monthlySpend: number;
      seats: number;
      category: string;
    }>;
    teamSize?: number;
  };
  
  recommendations: Recommendation[];
  
  overlap_data: {
    clusters: Array<{
      category: string;
      tools: string[];
      overlapScore: number;
      estimatedWaste: number;
      suggestion: string;
    }>;
  } | null;
  
  optimization_score: {
    overall: number;
    breakdown: {
      planEfficiency: number;
      toolRedundancy: number;
      seatUtilization: number;
      enterpriseOverkill: number;
    };
    rating: string;
  };
  
  monthly_savings: number;
  annual_savings: number;
  current_monthly_spend: number;
  
  metadata: {
    version: string;
    auditedAt: string;
  };
}

/**
 * Leads table row
 */
export interface LeadRow {
  id: string;
  created_at: string;
  email: string;
  company: string | null;
  role: string | null;
  team_size: string | null;
  audit_id: string;
}

/**
 * Public audit data (safe for sharing)
 */
export interface PublicAuditData {
  slug: string;
  createdAt: string;
  
  toolStack: Array<{
    toolName: string;
    category: string;
    planName: string;
  }>;
  
  recommendations: Recommendation[];
  
  savings: {
    monthly: number;
    annual: number;
    percentage: number;
  };
  
  score: {
    overall: number;
    rating: string;
  };
  
  metadata: {
    version: string;
  };
}

/**
 * Convert AuditResult to AuditRow for database storage
 */
export function auditResultToRow(
  result: AuditResult,
  slug: string,
  narrativeData?: any
): Omit<AuditRow, "id" | "created_at" | "narrative_data"> {
  return {
    public_slug: slug,
    
    tool_data: {
      tools: result.input.tools.map((tool) => ({
        toolId: tool.toolId,
        toolName: tool.toolName,
        planId: tool.planId,
        planName: tool.planName,
        monthlySpend: tool.monthlySpend,
        seats: tool.seats,
        category: tool.category,
      })),
      teamSize: result.input.teamSize,
    },
    
    recommendations: result.recommendations,
    
    overlap_data: null, // Can be populated if overlap analysis is added
    
    optimization_score: {
      overall: result.score.overall,
      breakdown: result.score.breakdown,
      rating: result.score.rating,
    },
    
    monthly_savings: result.savings.savings.monthly,
    annual_savings: result.savings.savings.annual,
    current_monthly_spend: result.savings.current.monthly,
    
    metadata: {
      version: result.version,
      auditedAt: result.auditedAt.toISOString(),
    },
  };
}

/**
 * Convert AuditRow to PublicAuditData (strips sensitive info)
 */
export function auditRowToPublic(row: AuditRow): PublicAuditData {
  const currentMonthly = row.current_monthly_spend;
  const savingsMonthly = row.monthly_savings;
  const savingsPercentage = currentMonthly > 0 
    ? (savingsMonthly / currentMonthly) * 100 
    : 0;
  
  return {
    slug: row.public_slug,
    createdAt: row.created_at,
    
    toolStack: row.tool_data.tools.map((tool) => ({
      toolName: tool.toolName,
      category: tool.category,
      planName: tool.planName,
    })),
    
    recommendations: row.recommendations,
    
    savings: {
      monthly: savingsMonthly,
      annual: row.annual_savings,
      percentage: savingsPercentage,
    },
    
    score: {
      overall: row.optimization_score.overall,
      rating: row.optimization_score.rating,
    },
    
    metadata: {
      version: row.metadata.version,
    },
  };
}
