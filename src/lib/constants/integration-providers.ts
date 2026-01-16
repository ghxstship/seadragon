/**
 * Integration Provider Configuration
 *
 * Centralized, typed configuration for all third-party integration providers.
 * Eliminates hardcoded URLs and scattered provider metadata.
 */

import { EXTERNAL_SERVICES } from './external-services'
import { OAUTH_ENDPOINTS } from './oauth-endpoints'

type ProviderType = 'oauth2' | 'api_key' | 'basic_auth'

export interface ProviderConfig {
  id: string
  name: string
  type: ProviderType
  baseUrl: string
  authUrl?: string
  tokenUrl?: string
  scopes?: string[]
  clientId?: string
  clientSecret?: string
}

export const AUTH_PROVIDERS: Record<string, ProviderConfig> = {
  'google-analytics': {
    id: 'google-analytics',
    name: 'Google Analytics',
    type: 'oauth2',
    baseUrl: EXTERNAL_SERVICES.GOOGLE_ANALYTICS.baseUrl,
    ...OAUTH_ENDPOINTS['google-analytics'],
    scopes: [
      'https://www.googleapis.com/auth/analytics.readonly',
      'https://www.googleapis.com/auth/analytics.edit'
    ]
  },
  stripe: {
    id: 'stripe',
    name: 'Stripe',
    type: 'api_key',
    baseUrl: EXTERNAL_SERVICES.STRIPE.baseUrl
  },
  jira: {
    id: 'jira',
    name: 'Jira',
    type: 'oauth2',
    baseUrl: EXTERNAL_SERVICES.JIRA.baseUrl,
    ...OAUTH_ENDPOINTS.jira,
    scopes: ['read:jira-work', 'write:jira-work', 'manage:jira-project']
  },
  github: {
    id: 'github',
    name: 'GitHub',
    type: 'oauth2',
    baseUrl: EXTERNAL_SERVICES.GITHUB.baseUrl,
    ...OAUTH_ENDPOINTS.github,
    scopes: ['repo', 'workflow', 'read:org']
  },
  slack: {
    id: 'slack',
    name: 'Slack',
    type: 'oauth2',
    baseUrl: EXTERNAL_SERVICES.SLACK.baseUrl,
    ...OAUTH_ENDPOINTS.slack,
    scopes: ['channels:read', 'chat:write', 'users:read']
  },
  harvest: {
    id: 'harvest',
    name: 'Harvest',
    type: 'api_key',
    baseUrl: EXTERNAL_SERVICES.HARVEST.baseUrl
  },
  toggl: {
    id: 'toggl',
    name: 'Toggl',
    type: 'api_key',
    baseUrl: EXTERNAL_SERVICES.TOGGL.baseUrl
  },
  clockify: {
    id: 'clockify',
    name: 'Clockify',
    type: 'api_key',
    baseUrl: EXTERNAL_SERVICES.CLOCKIFY.baseUrl
  },
  'microsoft-teams': {
    id: 'microsoft-teams',
    name: 'Microsoft Teams',
    type: 'oauth2',
    baseUrl: EXTERNAL_SERVICES.MICROSOFT_TEAMS.baseUrl
  },
  discord: {
    id: 'discord',
    name: 'Discord',
    type: 'api_key',
    baseUrl: EXTERNAL_SERVICES.DISCORD.baseUrl
  },
  mixpanel: {
    id: 'mixpanel',
    name: 'Mixpanel',
    type: 'api_key',
    baseUrl: EXTERNAL_SERVICES.MIXPANEL.baseUrl
  },
  amplitude: {
    id: 'amplitude',
    name: 'Amplitude',
    type: 'api_key',
    baseUrl: EXTERNAL_SERVICES.AMPLITUDE.baseUrl
  },
  gitlab: {
    id: 'gitlab',
    name: 'GitLab',
    type: 'oauth2',
    baseUrl: EXTERNAL_SERVICES.GITLAB.baseUrl
  },
  browserstack: {
    id: 'browserstack',
    name: 'BrowserStack',
    type: 'basic_auth',
    baseUrl: EXTERNAL_SERVICES.BROWSERSTACK.baseUrl
  },
  cypress: {
    id: 'cypress',
    name: 'Cypress Dashboard',
    type: 'api_key',
    baseUrl: EXTERNAL_SERVICES.CYPRESS.baseUrl
  },
  percy: {
    id: 'percy',
    name: 'Percy',
    type: 'api_key',
    baseUrl: EXTERNAL_SERVICES.PERCY.baseUrl
  }
} as const

export type AuthProviderId = keyof typeof AUTH_PROVIDERS

export const getProviderBaseUrl = (providerId: AuthProviderId, overrideBaseUrl?: string): string => {
  if (overrideBaseUrl) {
    return overrideBaseUrl.replace(/\/$/, '')
  }

  const provider = AUTH_PROVIDERS[providerId]
  if (!provider) {
    throw new Error(`Provider configuration not found for ${providerId}`)
  }

  return provider.baseUrl
}
