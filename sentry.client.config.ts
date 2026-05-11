/**
 * Sentry client-side configuration
 * Captures errors in browser context
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
  
  // Replay configuration
  replaysOnErrorSampleRate: 1.0, // Capture 100% of sessions with errors
  replaysSessionSampleRate: 0.01, // Capture 1% of all sessions
  
  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
  
  // Filter out known non-critical errors
  beforeSend(event, hint) {
    const error = hint.originalException;
    
    // Filter out network errors (user's connection issues)
    if (error && typeof error === "object" && "message" in error) {
      const message = String(error.message).toLowerCase();
      if (
        message.includes("network") ||
        message.includes("fetch") ||
        message.includes("timeout")
      ) {
        return null;
      }
    }
    
    return event;
  },
});
