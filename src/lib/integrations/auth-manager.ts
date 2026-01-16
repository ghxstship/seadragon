// Integration Authentication Manager
// Handles OAuth flows, API key management, and credential storage for third-party integrations

import { google } from 'googleapis'
import { logger } from '../logger'
import Stripe from 'stripe'
import { AUTH_PROVIDERS } from '../constants/integration-providers'
import { supabase } from '../supabase'

interface FlowState {
  providerId: string
  organizationId: string
  userId: string
  redirectUri: string
  codeVerifier?: string
  timestamp: Date
}

export interface AuthCredentials {
  accessToken?: string
  refreshToken?: string
  apiKey?: string
  clientId?: string
  clientSecret?: string
  expiresAt?: Date | undefined
  scopes?: string[]
  metadata?: Record<string, any> | undefined
}

// AuthProvider definition now centralized in constants/integration-providers
import type { ProviderConfig } from '../constants/integration-providers'

export interface AuthSession {
  id: string
  providerId: string
  organizationId: string
  userId: string
  credentials: AuthCredentials
  status: 'active' | 'expired' | 'revoked'
  createdAt: Date
  updatedAt: Date
  expiresAt?: Date | undefined
}

const INTEGRATION_PROVIDERS: Record<string, ProviderConfig> = AUTH_PROVIDERS

class IntegrationAuthManager {
  private sessions: Map<string, AuthSession> = new Map()

  // Initialize OAuth flow
  async initiateOAuthFlow(
    providerId: string,
    organizationId: string,
    userId: string,
    redirectUri: string,
    state?: string
  ): Promise<{ authUrl: string; state: string }> {
    const provider = INTEGRATION_PROVIDERS[providerId]
    if (!provider) {
      throw new Error(`Provider ${providerId} not found`)
    }

    if (provider.type !== 'oauth2') {
      throw new Error(`Provider ${providerId} does not support OAuth`)
    }

    const clientId = provider.clientId || process.env[`${providerId.toUpperCase()}_CLIENT_ID`]
    if (!clientId) {
      throw new Error(`Client ID not configured for ${providerId}`)
    }

    const flowState = state || this.generateState()
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: provider.scopes?.join(' ') || '',
      response_type: 'code',
      state: flowState,
      access_type: 'offline',
      prompt: 'consent'
    })

    const authUrl = `${provider.authUrl}?${params.toString()}`

    // Store flow state temporarily
    this.storeFlowState(flowState, {
      providerId,
      organizationId,
      userId,
      redirectUri
    })

    return { authUrl, state: flowState }
  }

  // Complete OAuth flow
  async completeOAuthFlow(
    providerId: string,
    code: string,
    state: string
  ): Promise<AuthSession> {
    const flowData = this.getFlowState(state)
    if (!flowData) {
      throw new Error('Invalid or expired state')
    }

    const provider = INTEGRATION_PROVIDERS[providerId]
    if (!provider) {
      throw new Error(`Provider ${providerId} not found`)
    }

    const clientId = provider.clientId || process.env[`${providerId.toUpperCase()}_CLIENT_ID`]
    const clientSecret = provider.clientSecret || process.env[`${providerId.toUpperCase()}_CLIENT_SECRET`]

    if (!clientId || !clientSecret) {
      throw new Error(`OAuth credentials not configured for ${providerId}`)
    }

    // Exchange code for tokens
    const tokenResponse = await fetch(provider.tokenUrl!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: flowData.redirectUri
      })
    })

    if (!tokenResponse.ok) {
      throw new Error(`OAuth token exchange failed: ${tokenResponse.statusText}`)
    }

    const tokens = await tokenResponse.json()

    // Create auth session
    const session: AuthSession = {
      id: `auth_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      providerId,
      organizationId: flowData.organizationId,
      userId: flowData.userId,
      credentials: {
        accessToken: tokens.access_token ?? undefined,
        refreshToken: tokens.refresh_token ?? undefined,
        expiresAt: tokens.expires_in ? new Date(Date.now() + tokens.expires_in * 1000) : undefined,
        scopes: tokens.scope?.split(' ') || provider.scopes
      },
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
      expiresAt: tokens.expires_in ? new Date(Date.now() + tokens.expires_in * 1000) : undefined
    }

    this.sessions.set(session.id, session)

    // Clean up flow state
    this.clearFlowState(state)

    // Persist session (in real implementation, save to database)
    await this.persistSession(session)

    return session
  }

  // Setup API key authentication
  async setupApiKeyAuth(
    providerId: string,
    organizationId: string,
    userId: string,
    apiKey: string,
    additionalConfig?: Record<string, any>
  ): Promise<AuthSession> {
    const provider = INTEGRATION_PROVIDERS[providerId]
    if (!provider) {
      throw new Error(`Provider ${providerId} not found`)
    }

    if (provider.type !== 'api_key') {
      throw new Error(`Provider ${providerId} does not support API key authentication`)
    }

    // Validate API key (basic validation)
    if (!apiKey || apiKey.length < 10) {
      throw new Error('Invalid API key format')
    }

    const session: AuthSession = {
      id: `auth_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      providerId,
      organizationId,
      userId,
      credentials: {
        apiKey,
        metadata: additionalConfig?.['metadata'] ?? undefined
      },
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    this.sessions.set(session.id, session)
    await this.persistSession(session)

    return session
  }

  // Refresh OAuth tokens
  async refreshTokens(sessionId: string): Promise<AuthSession> {
    const session = this.sessions.get(sessionId)
    if (!session || !session.credentials.refreshToken) {
      throw new Error('Session not found or refresh token unavailable')
    }

    const provider = INTEGRATION_PROVIDERS[session.providerId]
    if (!provider) {
      throw new Error(`Provider ${session.providerId} not found`)
    }

    const clientId = provider.clientId || process.env[`${session.providerId.toUpperCase()}_CLIENT_ID`]
    const clientSecret = provider.clientSecret || process.env[`${session.providerId.toUpperCase()}_CLIENT_SECRET`]

    const refreshResponse = await fetch(provider.tokenUrl!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: clientId ?? '',
        client_secret: clientSecret ?? '',
        refresh_token: session.credentials.refreshToken
      })
    })

    if (!refreshResponse.ok) {
      throw new Error(`Token refresh failed: ${refreshResponse.statusText}`)
    }

    const tokens = await refreshResponse.json()

    // Update session
    session.credentials.accessToken = tokens.access_token
    session.credentials.expiresAt = tokens.expires_in ? new Date(Date.now() + tokens.expires_in * 1000) : undefined
    session.updatedAt = new Date()
    session.expiresAt = tokens.expires_in ? new Date(Date.now() + tokens.expires_in * 1000) : undefined

    this.sessions.set(sessionId, session)
    await this.persistSession(session)

    return session
  }

  // Get authenticated client for provider
  async getAuthenticatedClient(sessionId: string): Promise<any> {
    const session = this.sessions.get(sessionId)
    if (!session) {
      throw new Error('Authentication session not found')
    }

    // Check if tokens need refresh
    if (session.credentials.expiresAt && session.credentials.expiresAt < new Date()) {
      await this.refreshTokens(sessionId)
      // Re-fetch session after refresh
      const refreshedSession = this.sessions.get(sessionId)!
      session.credentials = refreshedSession.credentials
    }

    const provider = INTEGRATION_PROVIDERS[session.providerId]
    if (!provider) {
      throw new Error(`Provider ${session.providerId} not found`)
    }

    switch (session.providerId) {
      case 'google-analytics':
        {
          const oauth2Client = new google.auth.OAuth2()
          oauth2Client.setCredentials({
            access_token: session.credentials.accessToken ?? null,
            refresh_token: session.credentials.refreshToken ?? null
          })
          return google.analytics({ version: 'v3', auth: oauth2Client })
        }

      case 'stripe':
        return new Stripe(session.credentials.apiKey!)

      case 'github':
        return {
          baseUrl: provider.baseUrl,
          headers: {
            'Authorization': `Bearer ${session.credentials.accessToken}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        }

      case 'jira':
        return {
          baseUrl: provider.baseUrl,
          headers: {
            'Authorization': `Bearer ${session.credentials.accessToken}`,
            'Accept': 'application/json'
          }
        }

      case 'slack':
        return {
          baseUrl: provider.baseUrl,
          headers: {
            'Authorization': `Bearer ${session.credentials.accessToken}`
          }
        }

      default:
        throw new Error(`Client not implemented for provider ${session.providerId}`)
    }
  }

  // Revoke authentication
  async revokeAuth(sessionId: string): Promise<void> {
    const session = this.sessions.get(sessionId)
    if (!session) {
      throw new Error('Session not found')
    }

    const provider = INTEGRATION_PROVIDERS[session.providerId]
    if (!provider) {
      throw new Error(`Provider ${session.providerId} not found`)
    }

    // Attempt to revoke tokens if possible
    if (provider.type === 'oauth2' && session.credentials.accessToken) {
      try {
        // Implementation would depend on provider's revoke endpoint
        // This is a placeholder
        logger.info('Revoking tokens', { providerId: session.providerId })
      } catch (error) {
        logger.warn('Failed to revoke tokens', {
          error: error instanceof Error ? error.message : String(error)
        })
      }
    }

    session.status = 'revoked'
    session.updatedAt = new Date()

    // In a real implementation, persist the revoked status
    await this.persistSession(session)
  }
  // Utility methods
  private generateState(length: number = 32): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let state = ''
    for (let i = 0; i < length; i++) {
      state += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return state
  }

  private flowStates = new Map<string, FlowState>()

  private storeFlowState(state: string, data: FlowState): void {
    this.flowStates.set(state, data)
  }

  private getFlowState(state: string): FlowState | undefined {
    return this.flowStates.get(state)
  }

  private clearFlowState(state: string): void {
    this.flowStates.delete(state)
  }

  // Persistence method using Supabase database
  private async persistSession(session: AuthSession): Promise<void> {
    const { error } = await supabase
      .from('integration_auth_sessions')
      .upsert({
        id: session.id,
        provider_id: session.providerId,
        organization_id: session.organizationId,
        user_id: session.userId,
        credentials: session.credentials,
        status: session.status,
        created_at: session.createdAt,
        updated_at: session.updatedAt,
        expires_at: session.expiresAt
      })

    if (error) {
      logger.error('Failed to persist auth session', { error, sessionId: session.id })
      throw error
    }
  }

  // Get active sessions for organization
  getActiveSessions(organizationId: string): AuthSession[] {
    return Array.from(this.sessions.values()).filter(
      session => session.organizationId === organizationId && session.status === 'active'
    )
  }

  // Get available providers
  getAvailableProviders(): { id: string; name: string; type: string }[] {
    return Object.values(INTEGRATION_PROVIDERS).map(provider => ({
      id: provider.id,
      name: provider.name,
      type: provider.type
    }))
  }

  // Create OAuth session (for testing compatibility)
  async createOAuthSession(
    providerId: string,
    organizationId: string,
    userId: string,
  ): Promise<AuthSession> {
    const session: AuthSession = {
      id: `auth_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      providerId,
      organizationId,
      userId,
      credentials: {
        accessToken: 'test-token',
        scopes: []
      },
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    this.sessions.set(session.id, session)
    return session
  }
}

export const integrationAuthManager = new IntegrationAuthManager()

// Helper functions for common auth operations
export const initiateGoogleAnalyticsAuth = async (
  organizationId: string,
  userId: string,
  redirectUri: string
) => {
  return await integrationAuthManager.initiateOAuthFlow(
    'google-analytics',
    organizationId,
    userId,
    redirectUri
  )
}

export const setupStripeAuth = async (
  organizationId: string,
  userId: string,
  apiKey: string
) => {
  return await integrationAuthManager.setupApiKeyAuth(
    'stripe',
    organizationId,
    userId,
    apiKey
  )
}

export const initiateJiraAuth = async (
  organizationId: string,
  userId: string,
  redirectUri: string
) => {
  return await integrationAuthManager.initiateOAuthFlow(
    'jira',
    organizationId,
    userId,
    redirectUri
  )
}

export const getAuthenticatedClient = async (sessionId: string) => {
  return await integrationAuthManager.getAuthenticatedClient(sessionId)
}
