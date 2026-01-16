/**
 * Provider header and version constants to avoid inline magic values.
 */

export const PROVIDER_VERSIONS = {
  STRIPE: '2023-10-16',
} as const

export const PROVIDER_USER_AGENTS = {
  HARVEST: 'OpusZero Integration',
} as const

export const buildStripeHeaders = (secretKey: string): Record<string, string> => ({
  Authorization: `Bearer ${secretKey}`,
  'Stripe-Version': PROVIDER_VERSIONS.STRIPE,
  'Content-Type': 'application/json',
})

export const buildHarvestHeaders = (accessToken: string, accountId: string): Record<string, string> => ({
  Authorization: `Bearer ${accessToken}`,
  'Harvest-Account-Id': accountId,
  'User-Agent': PROVIDER_USER_AGENTS.HARVEST,
  'Content-Type': 'application/json',
})
