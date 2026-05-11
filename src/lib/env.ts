/**
 * Environment variable validation
 * Validates presence and format of required environment variables
 * Safe for both client and server contexts
 */

/**
 * Client-safe environment variables (exposed to browser)
 */
export const clientEnv = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
} as const;

/**
 * Server-only environment variables (never exposed to browser)
 */
export const serverEnv = {
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  resendApiKey: process.env.RESEND_API_KEY,
  fromEmail: process.env.FROM_EMAIL,
} as const;

/**
 * Validate client environment variables
 * Safe to call in browser context
 */
export function validateClientEnv(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!clientEnv.supabaseUrl) {
    errors.push("Missing NEXT_PUBLIC_SUPABASE_URL");
  } else if (!clientEnv.supabaseUrl.startsWith("https://")) {
    errors.push("NEXT_PUBLIC_SUPABASE_URL must start with https://");
  }

  if (!clientEnv.supabaseAnonKey) {
    errors.push("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  if (!clientEnv.baseUrl) {
    errors.push("Missing NEXT_PUBLIC_BASE_URL");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate server environment variables
 * Only call in server context (API routes, server components)
 */
export function validateServerEnv(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Validate client env first
  const clientValidation = validateClientEnv();
  errors.push(...clientValidation.errors);

  if (!serverEnv.supabaseServiceKey) {
    errors.push("Missing SUPABASE_SERVICE_ROLE_KEY");
  }

  if (!serverEnv.resendApiKey) {
    errors.push("Missing RESEND_API_KEY (email will not work)");
  } else if (!serverEnv.resendApiKey.startsWith("re_")) {
    errors.push("RESEND_API_KEY has invalid format (should start with re_)");
  }

  if (!serverEnv.fromEmail) {
    errors.push("Missing FROM_EMAIL");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Get readable error message for missing environment variables
 */
export function getEnvErrorMessage(errors: string[]): string {
  return [
    "Environment configuration error:",
    ...errors.map((e) => `  - ${e}`),
    "",
    "Please check your .env.local file.",
    "See .env.example for required variables.",
  ].join("\n");
}

/**
 * Assert server environment is valid (throws if not)
 * Use in API routes to fail fast
 */
export function assertServerEnv(): void {
  const validation = validateServerEnv();
  if (!validation.valid) {
    throw new Error(getEnvErrorMessage(validation.errors));
  }
}

/**
 * Assert client environment is valid (throws if not)
 * Use in client components to fail fast
 */
export function assertClientEnv(): void {
  const validation = validateClientEnv();
  if (!validation.valid) {
    throw new Error(getEnvErrorMessage(validation.errors));
  }
}
