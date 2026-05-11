/**
 * Resend email client configuration
 */

import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;

if (!resendApiKey) {
  console.warn(
    "Missing RESEND_API_KEY environment variable. Email functionality will not work."
  );
}

/**
 * Resend client instance
 */
export const resend = resendApiKey ? new Resend(resendApiKey) : null;

/**
 * Default sender email
 * Update this to your verified domain
 */
export const FROM_EMAIL = process.env.FROM_EMAIL || "AIuditor <noreply@aiuditor.com>";
