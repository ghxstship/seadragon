/**
 * OAuth Provider Endpoints
 *
 * Centralized OAuth authorization and token URLs for third-party providers.
 * No hardcoded values in component files.
 */

export const OAUTH_ENDPOINTS = {
  'google-analytics': {
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
  },
  jira: {
    authUrl: 'https://auth.atlassian.com/oauth/authorize',
    tokenUrl: 'https://auth.atlassian.com/oauth/token',
  },
  github: {
    authUrl: 'https://github.com/login/oauth/authorize',
    tokenUrl: 'https://github.com/login/oauth/access_token',
  },
  slack: {
    authUrl: 'https://slack.com/oauth/v2/authorize',
    tokenUrl: 'https://slack.com/api/oauth.v2.access',
  },
  harvest: {
    // No OAuth, uses API key
  },
  toggl: {
    // No OAuth, uses API key
  },
  clockify: {
    // No OAuth, uses API key
  },
  'microsoft-teams': {
    // Placeholder - would need actual endpoints
  },
  discord: {
    // No OAuth, uses API key
  },
  mixpanel: {
    // No OAuth, uses API key
  },
  amplitude: {
    // No OAuth, uses API key
  },
  gitlab: {
    // Placeholder - would need actual endpoints
  },
  browserstack: {
    // Basic auth, not OAuth
  },
  cypress: {
    // No OAuth, uses API key
  },
  percy: {
    // No OAuth, uses API key
  },
} as const
