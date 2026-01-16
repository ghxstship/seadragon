
// Integration Manager - Core service for managing all integrations in OpusZero

import {
  IntegrationConnection,
  IntegrationProvider,
  IntegrationSyncResult,
  IntegrationAPIClient,
  IntegrationWebhookHandler,
  WebhookEvent
} from './types'

interface SyncParams {
  fullSync?: boolean
  since?: Date
  entityTypes?: string[]
  limit?: number
  offset?: number
  filters?: Record<string, any>
}

interface WebhookEventData {
  id: string
  type: string
  data: Record<string, any>
  timestamp: Date
  source: string
}

export class IntegrationManager {
  private connections: Map<string, IntegrationConnection> = new Map()
  private providers: Map<string, IntegrationProvider> = new Map()
  private apiClients: Map<string, IntegrationAPIClient> = new Map()
  private webhookHandlers: Map<string, IntegrationWebhookHandler> = new Map()

  // Register an integration provider
  registerProvider(provider: IntegrationProvider): void {
    this.providers.set(provider.id, provider)
  }

  // Register an API client for a provider
  registerAPIClient(providerId: string, client: IntegrationAPIClient): void {
    this.apiClients.set(providerId, client)
  }

  // Register a webhook handler for a provider
  registerWebhookHandler(handler: IntegrationWebhookHandler): void {
    this.webhookHandlers.set(handler.providerId, handler)
  }

  // Add or update an integration connection
  async addConnection(connection: IntegrationConnection): Promise<void> {
    // Validate the connection by testing it
    const provider = this.providers.get(connection.providerId)
    if (!provider) {
      throw new Error(`Provider ${connection.providerId} not found`)
    }

    const client = this.apiClients.get(connection.providerId)
    if (client) {
      try {
        await client.authenticate(connection.config)
        const isConnected = await client.testConnection()
        connection.status = isConnected ? 'connected' : 'error'
      } catch (error) {
        connection.status = 'error'
        connection.errorMessage = error instanceof Error ? error.message : 'Connection test failed'
      }
    }

    this.connections.set(connection.id, connection)
  }

  // Remove an integration connection
  removeConnection(connectionId: string): void {
    this.connections.delete(connectionId)
  }

  // Get all connections for an organization
  getConnectionsForOrganization(organizationId: string): IntegrationConnection[] {
    return Array.from(this.connections.values())
      .filter(conn => conn.organizationId === organizationId)
  }

  // Get connection by ID
  getConnection(connectionId: string): IntegrationConnection | undefined {
    return this.connections.get(connectionId)
  }

  // Sync data for a connection
  async syncConnection(connectionId: string, params?: SyncParams): Promise<IntegrationSyncResult> {
    const connection = this.connections.get(connectionId)
    if (!connection) {
      throw new Error(`Connection ${connectionId} not found`)
    }

    if (connection.status !== 'connected') {
      throw new Error(`Connection ${connectionId} is not active`)
    }

    const client = this.apiClients.get(connection.providerId)
    if (!client) {
      throw new Error(`No API client available for provider ${connection.providerId}`)
    }

    try {
      const result = await client.syncData(params)
      connection.lastSync = new Date()
      return result
    } catch (error) {
      connection.status = 'error'
      connection.errorMessage = error instanceof Error ? error.message : 'Sync failed'
      throw error
    }
  }

  // Handle webhook event
  async handleWebhook(providerId: string, event: WebhookEventData, headers: Record<string, string>): Promise<void> {
    const handler = this.webhookHandlers.get(providerId)
    if (!handler) {
      throw new Error(`No webhook handler for provider ${providerId}`)
    }

    // Find the connection for this webhook (you might need additional logic here)
    const connection = Array.from(this.connections.values())
      .find(conn => conn.providerId === providerId && conn.status === 'connected')

    if (!connection) {
      throw new Error(`No active connection found for provider ${providerId}`)
    }

    const crypto = require('crypto')
    const webhookEvent: WebhookEvent = {
      id: crypto.randomUUID(),
      connectionId: connection.id,
      providerId,
      eventType: event.type || 'unknown',
      payload: event,
      headers,
      processed: false,
      createdAt: new Date(),
      processedAt: undefined,
      processingError: undefined
    }

    try {
      await handler.handleWebhook(webhookEvent)
      webhookEvent.processed = true
      webhookEvent.processedAt = new Date()
    } catch (error) {
      webhookEvent.processingError = error instanceof Error ? error.message : 'Webhook processing failed'
      throw error
    }
  }

  // Get all registered providers
  getProviders(): IntegrationProvider[] {
    return Array.from(this.providers.values())
  }

  // Get provider by ID
  getProvider(providerId: string): IntegrationProvider | undefined {
    return this.providers.get(providerId)
  }

  // Get providers by category
  getProvidersByCategory(category: string): IntegrationProvider[] {
    return Array.from(this.providers.values())
      .filter(provider => provider.category === category)
  }

  // Test connection
  async testConnection(connectionId: string): Promise<boolean> {
    const connection = this.connections.get(connectionId)
    if (!connection) {
      return false
    }

    const client = this.apiClients.get(connection.providerId)
    if (!client) {
      return false
    }

    try {
      await client.authenticate(connection.config)
      return await client.testConnection()
    } catch {
      return false
    }
  }
}

// Global integration manager instance
export const integrationManager = new IntegrationManager()

// Utility functions for common integration operations
export const IntegrationUtils = {
  // Validate webhook signature
  validateWebhookSignature: (
    payload: string,
    signature: string,
    secret: string,
    algorithm: 'sha256' | 'sha1' = 'sha256'
  ): boolean => {
    const crypto = require('crypto')
    const expectedSignature = crypto
      .createHmac(algorithm, secret)
      .update(payload, 'utf8')
      .digest('hex')

    return signature === `sha256=${expectedSignature}` ||
           signature === expectedSignature
  },

  // Generate secure webhook secret
  generateWebhookSecret: (length: number = 32): string => {
    const crypto = require('crypto')
    return crypto.randomBytes(length).toString('hex')
  },

  // Rate limiting helper
  createRateLimiter: (limits: { rpm?: number, rph?: number, rpd?: number }) => {
    const requests: number[] = []

    return {
      checkLimit: (): boolean => {
        const now = Date.now()
        const oneMinute = 60 * 1000
        const oneHour = 60 * 60 * 1000
        const oneDay = 24 * 60 * 60 * 1000

        // Clean old requests
        if (limits.rpm) {
          requests.splice(0, requests.filter(t => now - t > oneMinute).length)
          if (requests.length >= limits.rpm) return false
        }

        if (limits.rph) {
          const hourlyRequests = requests.filter(t => now - t <= oneHour).length
          if (hourlyRequests >= limits.rph) return false
        }

        if (limits.rpd) {
          const dailyRequests = requests.filter(t => now - t <= oneDay).length
          if (dailyRequests >= limits.rpd) return false
        }

        requests.push(now)
        return true
      }
    }
  }
}
