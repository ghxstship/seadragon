import * as Sentry from "@sentry/nextjs";
import { logger } from "./src/lib/logger";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Performance monitoring
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Enable debug mode in development
  debug: process.env.NODE_ENV === 'development',

  // Session replay configuration
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 0.5,

  // Enhanced integrations
  integrations: [
    // Session replay with enhanced privacy
    new Sentry.Replay({
      maskAllText: true,
      blockAllMedia: true,
      maskAllInputs: true,
    }),

    // Browser tracing for performance monitoring
    new Sentry.BrowserTracing({
      tracePropagationTargets: [
        "localhost",
        /^https:\/\/.*\.opuszero\.com/,
        /^https:\/\/.*\.supabase\.co/,
        /^https:\/\/.*\.stripe\.com/
      ],
    }),

    // Capture console errors
    new Sentry.CaptureConsole({
      levels: ['error', 'warn']
    }),

    // HTTP client errors
    new Sentry.HttpClient({
      failedRequestStatusCodes: [[400, 599]],
    }),
  ],

  // Environment configuration
  environment: process.env.NODE_ENV || 'development',
  release: process.env.VERCEL_GIT_COMMIT_SHA || process.env.COMMIT_SHA,

  // Enhanced error filtering
  beforeSend(event, hint) {
    // Filter out known non-actionable errors
    const error = hint.originalException;
    if (error && typeof error === 'object') {
      const errorMessage = error.message || error.toString();

      // Filter out network errors that are expected
      if (errorMessage.includes('Failed to fetch') && errorMessage.includes('chrome-extension://')) {
        return null;
      }

      // Filter out ResizeObserver loop errors (browser bug)
      if (errorMessage.includes('ResizeObserver loop completed with undelivered notifications')) {
        return null;
      }

      // Filter out AbortController aborts (expected cancellations)
      if (errorMessage.includes('AbortError') || errorMessage.includes('The operation was aborted')) {
        return null;
      }
    }

    // Log filtered events
    logger.debug('Sending error to Sentry', {
      eventId: event.event_id,
      error: hint.originalException?.message
    });

    return event;
  },

  // Enhanced user context
  beforeSendTransaction(event) {
    // Add additional context for performance transactions
    if (event.transaction) {
      logger.debug('Sending transaction to Sentry', {
        transaction: event.transaction,
        duration: event.contexts?.trace?.data?.duration
      });
    }

    return event;
  },

  // Performance monitoring configuration
  tracesSampler: (samplingContext) => {
    // Sample all errors
    if (samplingContext.request?.url?.includes('/api/')) {
      return 0.5; // 50% of API calls
    }

    // Sample navigation and user interactions
    if (samplingContext.op === 'navigation' || samplingContext.op === 'ui.interaction') {
      return 0.1; // 10% of navigation/UI interactions
    }

    // Default sampling rate
    return 0.05; // 5% of other transactions
  },

  // Custom sampling for replays
  replaysSampler: (replay) => {
    // Sample more replays with errors
    if (replay.error_ids && replay.error_ids.length > 0) {
      return 1.0; // 100% of replays with errors
    }

    // Sample less for regular sessions
    return 0.1; // 10% of regular sessions
  },

  // Enhanced context
  initialScope: {
    tags: {
      component: 'client',
      framework: 'nextjs',
      environment: process.env.NODE_ENV,
    },
    contexts: {
      app: {
        version: process.env.npm_package_version,
        build: process.env.VERCEL_GIT_COMMIT_SHA || 'development',
        environment: process.env.NODE_ENV,
      }
    }
  }
});

// Global error handler integration
window.addEventListener('error', (event) => {
  logger.error('Global error caught', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    error: event.error
  });
});

// Unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  logger.error('Unhandled promise rejection', {
    reason: event.reason,
    promise: event.promise
  });
});

// Performance monitoring
if (typeof window !== 'undefined' && 'performance' in window) {
  // Monitor Core Web Vitals
  import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
    getCLS(Sentry.captureUserFeedback);
    getFID(Sentry.captureUserFeedback);
    getFCP(Sentry.captureUserFeedback);
    getLCP(Sentry.captureUserFeedback);
    getTTFB(Sentry.captureUserFeedback);
  }).catch((error) => {
    logger.warn('Failed to load web-vitals', error);
  });
}
