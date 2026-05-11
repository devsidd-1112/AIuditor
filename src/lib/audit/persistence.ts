/**
 * Audit persistence layer
 * Handles saving and retrieving audits from database
 */

import { nanoid } from "nanoid";
import type { AuditResult } from "@/types";
import type { AuditRow, PublicAuditData } from "@/lib/supabase";
import { auditResultToRow, auditRowToPublic } from "@/lib/supabase";

/**
 * Generate a short, URL-safe public slug
 * Format: 8 characters, lowercase alphanumeric
 * Example: "a3f9k2m1"
 */
export function generateSlug(): string {
  return nanoid(8).toLowerCase();
}

/**
 * Validate slug format
 */
export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9]{8}$/.test(slug);
}

/**
 * Save audit result to database
 * Returns the public slug for sharing
 */
export async function saveAudit(
  result: AuditResult,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabaseClient: any,
  narrativeData?: any
): Promise<{ slug: string; id: string }> {
  const slug = generateSlug();
  const row = auditResultToRow(result, slug, narrativeData);
  
  const { data, error } = await supabaseClient
    .from("audits")
    .insert(row)
    .select("id, public_slug")
    .single();
  
  if (error) {
    console.error("Failed to save audit:", error);
    throw new Error("Failed to save audit report");
  }
  
  return {
    slug: data.public_slug,
    id: data.id,
  };
}

/**
 * Retrieve audit by public slug
 * Returns public-safe data only
 */
export async function getAuditBySlug(
  slug: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabaseClient: any
): Promise<PublicAuditData | null> {
  if (!isValidSlug(slug)) {
    return null;
  }
  
  const { data, error } = await supabaseClient
    .from("audits")
    .select("*")
    .eq("public_slug", slug)
    .single();
  
  if (error || !data) {
    return null;
  }
  
  return auditRowToPublic(data as AuditRow);
}

/**
 * Check if audit exists by slug
 */
export async function auditExists(
  slug: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabaseClient: any
): Promise<boolean> {
  if (!isValidSlug(slug)) {
    return false;
  }
  
  const { data, error } = await supabaseClient
    .from("audits")
    .select("id")
    .eq("public_slug", slug)
    .single();
  
  return !error && !!data;
}
