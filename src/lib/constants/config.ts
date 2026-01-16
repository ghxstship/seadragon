/**
 * Magic Numbers & Configuration Constants
 *
 * Centralized constants for all magic numbers, timeouts, limits, and configuration
 * values used throughout the application.
 */

export const TIMEOUTS = {
  // Network timeouts
  API_REQUEST: 30000, // 30 seconds
  FILE_UPLOAD: 120000, // 2 minutes
  IMAGE_UPLOAD: 60000, // 1 minute

  // UI timeouts
  TOAST_NOTIFICATION: 5000, // 5 seconds
  LOADING_SPINNER: 1000, // 1 second minimum display
  DEBOUNCE_SEARCH: 300, // 300ms for search debouncing

  // Session timeouts
  SESSION_WARNING: 300000, // 5 minutes before expiry warning
  SESSION_EXTEND: 60000 // 1 minute grace period
} as const

export const LIMITS = {
  // Pagination
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  MIN_PAGE_SIZE: 5,

  // File uploads
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_FILES_PER_UPLOAD: 10,

  // Text limits
  MAX_TITLE_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 1000,
  MAX_COMMENT_LENGTH: 500,
  MAX_TAG_LENGTH: 50,

  // Array/collection limits
  MAX_TAGS_PER_ITEM: 10,
  MAX_MEMBERS_PER_TEAM: 100,
  MAX_INTEGRATIONS_PER_ORG: 50
} as const

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503
} as const

export const RETRY_CONFIG = {
  MAX_ATTEMPTS: 3,
  BASE_DELAY: 1000, // 1 second
  MAX_DELAY: 10000, // 10 seconds
  BACKOFF_MULTIPLIER: 2
} as const

export const CACHE_CONFIG = {
  DEFAULT_TTL: 300000, // 5 minutes
  LONG_TTL: 3600000, // 1 hour
  SHORT_TTL: 60000 // 1 minute
} as const

export const URLS = {
  // Base URLs for different environments
  DEVELOPMENT: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  PRODUCTION: process.env.NEXT_PUBLIC_APP_URL || 'https://atlvs.com',
  STAGING: process.env.NEXT_PUBLIC_APP_URL || 'https://staging.atlvs.com',

  // API base URLs
  API_DEVELOPMENT: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  API_PRODUCTION: process.env.NEXT_PUBLIC_API_URL || 'https://api.atlvs.com/v1',
  API_STAGING: process.env.NEXT_PUBLIC_API_URL || 'https://staging-api.atlvs.com/v1',

  // External service URLs
  STRIPE_API: 'https://api.stripe.com/v1',
  GITHUB_API: 'https://api.github.com',
  JIRA_API: 'https://api.atlassian.com/ex/jira',
  SLACK_API: 'https://slack.com/api',

  // Integration provider websites
  PROVIDER_WEBSITES: {
    stripe: 'https://stripe.com',
    'google-analytics': 'https://analytics.google.com',
    github: 'https://github.com',
    jira: 'https://www.atlassian.com/software/jira',
    slack: 'https://slack.com'
  },

  // Integration provider documentation
  PROVIDER_DOCS: {
    stripe: 'https://stripe.com/docs/api',
    'google-analytics': 'https://developers.google.com/analytics',
    github: 'https://docs.github.com/en/rest',
    jira: 'https://developer.atlassian.com/cloud/jira/platform/rest/v3/',
    slack: 'https://api.slack.com/'
  }
} as const

export type TimeoutValue = typeof TIMEOUTS[keyof typeof TIMEOUTS]
export type LimitValue = typeof LIMITS[keyof typeof LIMITS]
export type HttpStatusCode = typeof HTTP_STATUS[keyof typeof HTTP_STATUS]
