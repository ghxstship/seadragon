/**
 * External service configuration
 *
 * Centralizes environment-backed base URLs for third-party services.
 * No production fallbacks are provided to avoid accidental cross-env calls.
 */

type ExternalServiceKey =
  | 'STRIPE'
  | 'QUICKBOOKS'
  | 'XERO'
  | 'GOOGLE_CALENDAR'
  | 'GOOGLE_ANALYTICS'
  | 'JIRA'
  | 'GITHUB'
  | 'SLACK'
  | 'HARVEST'
  | 'TOGGL'
  | 'CLOCKIFY'
  | 'MICROSOFT_TEAMS'
  | 'DISCORD'
  | 'MIXPANEL'
  | 'AMPLITUDE'
  | 'GITLAB'
  | 'BROWSERSTACK'
  | 'CYPRESS'
  | 'PERCY'
  | 'QR_SERVER'

type ExternalServiceConfig = {
  baseUrl: string
}

const getBaseUrl = (envKey: string): string => process.env[envKey] ?? ''

export const EXTERNAL_SERVICES: Record<ExternalServiceKey, ExternalServiceConfig> = {
  STRIPE: { baseUrl: getBaseUrl('STRIPE_API_URL') },
  QUICKBOOKS: { baseUrl: getBaseUrl('QUICKBOOKS_API_URL') },
  XERO: { baseUrl: getBaseUrl('XERO_API_URL') },
  GOOGLE_CALENDAR: { baseUrl: getBaseUrl('GOOGLE_CALENDAR_API_URL') },
  GOOGLE_ANALYTICS: { baseUrl: getBaseUrl('GOOGLE_ANALYTICS_API_URL') },
  JIRA: { baseUrl: getBaseUrl('JIRA_API_URL') },
  GITHUB: { baseUrl: getBaseUrl('GITHUB_API_URL') },
  SLACK: { baseUrl: getBaseUrl('SLACK_API_URL') },
  HARVEST: { baseUrl: getBaseUrl('HARVEST_API_URL') },
  TOGGL: { baseUrl: getBaseUrl('TOGGL_API_URL') },
  CLOCKIFY: { baseUrl: getBaseUrl('CLOCKIFY_API_URL') },
  MICROSOFT_TEAMS: { baseUrl: getBaseUrl('MICROSOFT_TEAMS_API_URL') },
  DISCORD: { baseUrl: getBaseUrl('DISCORD_API_URL') },
  MIXPANEL: { baseUrl: getBaseUrl('MIXPANEL_API_URL') },
  AMPLITUDE: { baseUrl: getBaseUrl('AMPLITUDE_API_URL') },
  GITLAB: { baseUrl: getBaseUrl('GITLAB_API_URL') },
  BROWSERSTACK: { baseUrl: getBaseUrl('BROWSERSTACK_API_URL') },
  CYPRESS: { baseUrl: getBaseUrl('CYPRESS_API_URL') },
  PERCY: { baseUrl: getBaseUrl('PERCY_API_URL') },
  QR_SERVER: { baseUrl: getBaseUrl('QR_CODE_API_URL') },
}
