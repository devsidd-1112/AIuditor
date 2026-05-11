/**
 * Sentry server-side configuration
 * Captures errors in API routes and server components
 */

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Only enable in production
  enabled: process.env.NODE_ENV === "production",
  
  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 0.1, // 10% of transactions
  
  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
  
  // Filter out known non-critical errors
  beforeSend(event, hint) {
    const error = hint.originalException;
    
    // Filter out expected errors
    if (error && typeof error === "object" && "message" in error) {
      const message = String(error.message).toLowerCase();
      
      // Don't report validation errors (user input issues)
      if (message.includes("validation") || message.includes("invalid")) {
        return null;
      }
      
      // Don't report rate limit errors (expected behavior)
      if (message.includes("rate limit") || message.includes("too many")) {
        return null;
      }
    }
    
    return event;
  },
});
