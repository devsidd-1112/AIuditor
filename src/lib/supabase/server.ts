/**
 * Supabase server configuration
 * Server-safe client for server components and API routes
 */

import { createClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase client with service role key
 * Use in API routes and server components
 * Has elevated permissions - use carefully
 */
export function getServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable");
  }
  
  if (!supabaseServiceKey) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY environment variable. This is required for server-side operations."
    );
  }
  
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    global: {
      fetch: (url, options = {}) => {
        return fetch(url, {
          ...options,
          // Increase timeout to 30 seconds
          signal: AbortSignal.timeout(30000),
        });
      },
    },
  });
}
