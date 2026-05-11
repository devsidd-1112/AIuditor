/**
 * Simple in-memory rate limiter for API routes
 * Suitable for MVP deployment on Vercel (single-region, low traffic)
 * 
 * For production scale, consider:
 * - Upstash Redis for distributed rate limiting
 * - Vercel Edge Config for global rate limits
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// In-memory store (resets on serverless function cold start)
const store = new Map<string, RateLimitEntry>();

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (entry.resetAt < now) {
      store.delete(key);
    }
  }
}, 5 * 60 * 1000);

export interface RateLimitConfig {
  /**
   * Maximum number of requests allowed in the window
   */
  limit: number;
  
  /**
   * Time window in milliseconds
   */
  windowMs: number;
}

export interface RateLimitResult {
  /**
   * Whether the request is allowed
   */
  allowed: boolean;
  
  /**
   * Number of requests remaining in current window
   */
  remaining: number;
  
  /**
   * Timestamp when the rate limit resets (ms since epoch)
   */
  resetAt: number;
  
  /**
   * Total limit for this identifier
   */
  limit: number;
}

/**
 * Check if a request should be rate limited
 * 
 * @param identifier - Unique identifier (IP address, user ID, etc.)
 * @param config - Rate limit configuration
 * @returns Rate limit result
 * 
 * @example
 * ```ts
 * const result = rateLimit(request.ip, { limit: 10, windowMs: 60000 });
 * if (!result.allowed) {
 *   return NextResponse.json(
 *     { error: "Too many requests" },
 *     { status: 429, headers: { 'Retry-After': String(Math.ceil((result.resetAt - Date.now()) / 1000)) } }
 *   );
 * }
 * ```
 */
export function rateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  const key = `${identifier}:${config.limit}:${config.windowMs}`;
  
  let entry = store.get(key);
  
  // Create new entry if doesn't exist or expired
  if (!entry || entry.resetAt < now) {
    entry = {
      count: 0,
      resetAt: now + config.windowMs,
    };
    store.set(key, entry);
  }
  
  // Increment count
  entry.count++;
  
  const allowed = entry.count <= config.limit;
  const remaining = Math.max(0, config.limit - entry.count);
  
  return {
    allowed,
    remaining,
    resetAt: entry.resetAt,
    limit: config.limit,
  };
}

/**
 * Get client identifier from request
 * Uses IP address with fallback to 'unknown'
 */
export function getClientIdentifier(request: Request): string {
  // Try to get real IP from headers (Vercel provides x-forwarded-for)
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  
  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }
  
  // Fallback (not ideal but better than nothing)
  return "unknown";
}

/**
 * Preset rate limit configurations
 */
export const RATE_LIMITS = {
  /**
   * For audit generation (expensive operation)
   * 5 audits per 5 minutes per IP
   */
  AUDIT: {
    limit: 5,
    windowMs: 5 * 60 * 1000, // 5 minutes
  },
  
  /**
   * For lead capture (less expensive)
   * 3 submissions per 5 minutes per IP
   */
  LEAD: {
    limit: 3,
    windowMs: 5 * 60 * 1000, // 5 minutes
  },
} as const;
