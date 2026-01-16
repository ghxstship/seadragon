// Data Synchronization Manager
// Handles bidirectional data synchronization between platform and integrated services

import { IntegrationClientFactory } from './clients'
import { logger } from '../logger'
import { workflowStateManager } from '../workflow-state-manager'
import { createClient } from '../supabase/client'

// Type definitions for integration client and data structures
interface IntegrationClient {
  listPayments?: (filters?: Record<string, unknown>) => Promise<PaymentData[]>
  listCustomers?: (filters?: Record<string, unknown>) => Promise<CustomerData[]>
  getIssues?: (projectKey?: string, filters?: Record<string, unknown>) => Promise<IssueData[]>
  listIssues?: (owner?: string, repo?: string, filters?: Record<string, unknown>) => Promise<IssueData[]>
  createCustomer?: (data: CustomerData) => Promise<void>
  createJiraIssue?: (projectKey: string, data: IssueData) => Promise<void>
  createGitHubIssue?: (owner: string, repo: string, data: IssueData) => Promise<void>
}

interface PaymentData {
  id: string
  amount: number
  currency: string
  customer: string
  status: string
  [key: string]: unknown
}

interface CustomerData {
  id: string
  email: string
  name?: string
  [key: string]: unknown
}

interface IssueData {
  id: string
  title: string
  description?: string
  status: string
  assignee?: string
  projectKey?: string
  owner?: string
  repo?: string
  [key: string]: unknown
}

interface ExternalData {
  externalId?: string
  platformId?: string
  [key: string]: unknown
}

export interface SyncEntity {
  id: string
  type: 'event' | 'task' | 'user' | 'project' | 'payment' | 'issue' | 'metric'
  externalId?: string
  platformId: string
  providerId: string
  data: Record<string, unknown>
  lastSyncedAt: Date
  version: number
  status: 'active' | 'deleted' | 'conflicted'
}

export interface SyncOperation {
  id: string
  entityId: string
  operation: 'create' | 'update' | 'delete'
  direction: 'to_provider' | 'from_provider' | 'bidirectional'
  providerId: string
  data: Record<string, unknown>
  status: 'pending' | 'in_progress' | 'completed' | 'failed'
  createdAt: Date
  completedAt?: Date
  error?: string
  retryCount: number
}

export interface SyncConflict {
  id: string
  entityId: string
  providerId: string
  platformVersion: Record<string, unknown>
  providerVersion: Record<string, unknown>
  conflictFields: string[]
  resolution?: 'platform_wins' | 'provider_wins' | 'merge' | 'manual'
  resolvedAt?: Date
  resolvedBy?: string
}

export interface SyncRule {
  id: string
  providerId: string
  entityType: string
  syncDirection: 'to_provider' | 'from_provider' | 'bidirectional'
  syncFrequency: 'real-time' | 'hourly' | 'daily' | 'weekly'
  fieldMappings: Record<string, string>
  conflictResolution: 'platform_wins' | 'provider_wins' | 'merge' | 'manual'
  filters?: Record<string, unknown>
  transformers?: Array<{
    field: string
    transform: (value: unknown) => unknown
  }>
}

export class DataSyncManager {
  private syncRules = new Map<string, SyncRule>()
  private activeSyncs = new Map<string, SyncOperation>()
  private conflictQueue: SyncConflict[] = []

  constructor() {}

  // Register sync rules for providers
  registerSyncRule(rule: SyncRule): void {
    this.syncRules.set(`${rule.providerId}_${rule.entityType}`, rule)
  }

  // Sync entity to provider
  async syncToProvider(
    entity: SyncEntity,
    sessionId: string
  ): Promise<SyncOperation> {
    const rule = this.getSyncRule(entity.providerId, entity.type)
    if (!rule || rule.syncDirection === 'from_provider') {
      throw new Error(`Sync to provider not allowed for ${entity.type} in ${entity.providerId}`)
    }

    const operation: SyncOperation = {
      id: `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      entityId: entity.id,
      operation: entity.status === 'deleted' ? 'delete' : 'update',
      direction: 'to_provider',
      providerId: entity.providerId,
      data: this.transformData(entity.data, rule),
      status: 'pending',
      createdAt: new Date(),
      retryCount: 0
    }

    this.activeSyncs.set(operation.id, operation)
    await this.executeSyncOperation(operation, sessionId)

    return operation
  }

  // Sync from provider to platform
  async syncFromProvider(
    providerId: string,
    entityType: string,
    sessionId: string,
    filters?: Record<string, unknown>
  ): Promise<SyncOperation[]> {
    const rule = this.getSyncRule(providerId, entityType)
    if (!rule || rule.syncDirection === 'to_provider') {
      throw new Error(`Sync from provider not allowed for ${entityType} in ${providerId}`)
    }

    const client = IntegrationClientFactory.createClient(providerId, sessionId)
    const externalData = await this.fetchProviderData(client, providerId, entityType, filters)

    const operations: SyncOperation[] = []

    for (const item of externalData) {
      const platformEntity = await this.findPlatformEntity(item as ExternalData, providerId, entityType)

      if (platformEntity) {
        // Check for conflicts
        const conflict = await this.detectConflict(platformEntity, item, rule)
        if (conflict) {
          this.conflictQueue.push(conflict)
          continue
        }

        // Update existing entity
        const operation: SyncOperation = {
          id: `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          entityId: platformEntity.id,
          operation: 'update',
          direction: 'from_provider',
          providerId,
          data: this.transformData(item, rule, true),
          status: 'pending',
          createdAt: new Date(),
          retryCount: 0
        }

        operations.push(operation)
        this.activeSyncs.set(operation.id, operation)
      } else {
        // Create new entity
        const operation: SyncOperation = {
          id: `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          entityId: `new_${Date.now()}`,
          operation: 'create',
          direction: 'from_provider',
          providerId,
          data: this.transformData(item, rule, true),
          status: 'pending',
          createdAt: new Date(),
          retryCount: 0
        }

        operations.push(operation)
        this.activeSyncs.set(operation.id, operation)
      }
    }

    // Execute operations
    for (const operation of operations) {
      await this.executeSyncOperation(operation, sessionId)
    }

    return operations
  }

  // Bidirectional sync
  async syncBidirectional(
    providerId: string,
    entityType: string,
    sessionId: string
  ): Promise<{ toProvider: SyncOperation[]; fromProvider: SyncOperation[] }> {
    const rule = this.getSyncRule(providerId, entityType)
    if (!rule || rule.syncDirection !== 'bidirectional') {
      throw new Error(`Bidirectional sync not allowed for ${entityType} in ${providerId}`)
    }

    // First sync from provider to get latest data
    const fromProviderOps = await this.syncFromProvider(providerId, entityType, sessionId)

    // Then sync local changes to provider
    const toProviderOps = await this.syncPendingChanges(providerId, entityType, sessionId)

    return { toProvider: toProviderOps, fromProvider: fromProviderOps }
  }

  async resolveConflict(
    conflictId: string,
    resolution: 'platform_wins' | 'provider_wins' | 'merge',
    customData?: Record<string, unknown>
  ): Promise<void> {
    const conflictIndex = this.conflictQueue.findIndex(c => c.id === conflictId)
    if (conflictIndex === -1) {
      throw new Error('Conflict not found')
    }

    const conflict = this.conflictQueue[conflictIndex]
    if (!conflict) {
      throw new Error('Conflict not found')
    }

    let resolvedData: Record<string, unknown>

    switch (resolution) {
      case 'platform_wins':
        resolvedData = conflict.platformVersion
        break
      case 'provider_wins':
        resolvedData = conflict.providerVersion
        break
      case 'merge':
        resolvedData = { ...conflict.platformVersion, ...conflict.providerVersion, ...customData }
        break
    }

    // Update the entity with resolved data
    await this.updatePlatformEntity(conflict.entityId, resolvedData)

    // Mark conflict as resolved
    conflict.resolution = resolution
    conflict.resolvedAt = new Date()

    // Remove from queue
    this.conflictQueue.splice(conflictIndex, 1)
  }

  // Get pending conflicts
  getPendingConflicts(): SyncConflict[] {
    return this.conflictQueue
  }

  // Execute sync operation
  private async executeSyncOperation(operation: SyncOperation, sessionId: string): Promise<void> {
    try {
      operation.status = 'in_progress'

      const client = IntegrationClientFactory.createClient(operation.providerId, sessionId) as IntegrationClient

      switch (operation.operation) {
        case 'create':
          await this.createInProvider(client, operation.providerId, operation.data)
          break
        case 'update':
          await this.updateInProvider(client, operation.providerId, operation.data)
          break
        case 'delete':
          await this.deleteInProvider(client, operation.providerId, operation.data)
          break
      }

      operation.status = 'completed'
      operation.completedAt = new Date()

      // Update sync metadata
      await this.updateSyncMetadata(operation.entityId, new Date())

    } catch (error) {
      operation.status = 'failed'
      operation.error = (error as Error).message
      operation.retryCount++

      // Retry logic
      if (operation.retryCount < 3) {
        setTimeout(() => {
          this.executeSyncOperation(operation, sessionId)
        }, Math.pow(2, operation.retryCount) * 1000)
      }
    }
  }

  // Provider-specific data operations
  private async fetchProviderData(
    client: IntegrationClient,
    providerId: string,
    entityType: string,
    filters?: Record<string, unknown>
  ): Promise<unknown[]> {
    switch (providerId) {
      case 'google-analytics':
        // Fetch analytics data
        return []

      case 'stripe':
        if (entityType === 'payment') {
          return await client.listPayments?.(filters as Record<string, unknown>) ?? []
        }
        if (entityType === 'user') {
          return await client.listCustomers?.(filters as Record<string, unknown>) ?? []
        }
        return []

      case 'jira':
        if (client.getIssues) {
          return await client.getIssues(filters?.['projectKey'] as string, filters as Record<string, unknown>)
        }
        return []

      case 'github':
        if (client.listIssues) {
          return await client.listIssues(filters?.['owner'] as string, filters?.['repo'] as string, filters as Record<string, unknown>)
        }
        return []

      default:
        return []
    }
  }

  private async createInProvider(client: IntegrationClient, providerId: string, data: Record<string, unknown>): Promise<void> {
    switch (providerId) {
      case 'stripe':
        if (data['object'] === 'customer' && client.createCustomer) {
          await client.createCustomer(data as CustomerData)
        }
        break

      case 'jira':
        if (client.createJiraIssue) {
          await client.createJiraIssue(data['projectKey'] as string, data as IssueData)
        }
        break

      case 'github':
        if (client.createGitHubIssue) {
          await client.createGitHubIssue(data['owner'] as string, data['repo'] as string, data as IssueData)
        }
        break
    }
  }

  private async updateInProvider(_client: IntegrationClient, providerId: string, data: Record<string, unknown>): Promise<void> {
    // Implementation depends on provider APIs
    // This is a placeholder
    logger.debug('Updating provider', { providerId, data })
  }

  private async deleteInProvider(_client: IntegrationClient, providerId: string, data: Record<string, unknown>): Promise<void> {
    // Implementation depends on provider APIs
    // This is a placeholder
    logger.debug('Deleting from provider', { providerId, data })
  }

  // Platform data operations
  private async findPlatformEntity(externalData: ExternalData, providerId: string, entityType: string): Promise<SyncEntity | null> {
    try {
      const supabase = await createClient()
      let tableName: string
      let idField: string = 'id'
      let externalIdField: string = 'external_id'
      let query

      switch (entityType) {
        case 'event':
          tableName = 'events'
          break
        case 'task':
          tableName = 'tasks'
          break
        case 'user':
          tableName = 'platform_users' // Use the actual table, not the view
          externalIdField = 'external_id'
          break
        case 'project':
          // Projects table may not exist, skip for now
          return null
        case 'payment':
          // Use invoices or wallets table? Skip for now
          return null
        case 'issue':
          // Issues table doesn't exist in schema, skip
          return null
        case 'metric':
          // Analytics metrics table doesn't exist, skip
          return null
        default:
          logger.warn('Unknown entity type for sync lookup', { entityType, providerId })
          return null
      }

      // Try to find by external ID first, then by platform ID
      if (externalData.externalId) {
        query = supabase
          .from(tableName)
          .select('*')
          .eq(externalIdField, externalData.externalId)
          .eq('provider_id', providerId)
          .single()
      } else {
        query = supabase
          .from(tableName)
          .select('*')
          .eq(idField, externalData.platformId)
          .single()
      }

      const { data, error } = await query

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        logger.error('Error finding platform entity', { error, entityType, providerId })
        throw error
      }

      if (!data) {
        return null
      }

      return {
        id: data[idField],
        type: entityType as SyncEntity['type'],
        externalId: data[externalIdField],
        platformId: data[idField],
        providerId,
        data,
        lastSyncedAt: new Date(data.last_synced_at || data.updated_at || data.created_at),
        version: data.version || 1,
        status: data.status || 'active'
      }
    } catch (error) {
      logger.error('Failed to find platform entity', { error, entityType, providerId, externalData })
      throw error
    }
  }

  private async updatePlatformEntity(entityId: string, data: Record<string, unknown>): Promise<void> {
    try {
      const supabase = await createClient()
      // Determine which table to update based on the data structure
      // This is a simplified implementation - in practice, you'd need more sophisticated
      // logic to determine the correct table and update fields

      let tableName: string
      let updateData: Record<string, unknown> = { ...data }

      // Add sync metadata
      updateData['updated_at'] = new Date().toISOString()

      // Try to determine table from data structure or use a generic approach
      if (data['title'] && data['status']) {
        // Could be task
        if (['todo', 'in_progress', 'done'].includes(data['status'] as string)) {
          tableName = 'tasks'
          // Map fields to match database schema
          if (data['assigned_to']) updateData['assigned_to'] = data['assigned_to']
          if (data['priority']) updateData['priority'] = data['priority']
        } else {
          tableName = 'events'
          // Map fields for events
          if (data['start_date']) updateData['start_date'] = data['start_date']
          if (data['end_date']) updateData['end_date'] = data['end_date']
        }
      } else if (data['email']) {
        tableName = 'platform_users'
        // Map user fields
        if (data['name']) updateData['display_name'] = data['name']
      } else {
        // Skip unsupported entity types for now
        logger.debug('Skipping update for unsupported entity type', { entityId, data })
        return
      }

      const { error } = await supabase
        .from(tableName)
        .update(updateData)
        .eq('id', entityId)

      if (error) {
        logger.error('Error updating platform entity', { error, entityId, tableName, data })
        throw error
      }

      logger.debug('Updated platform entity', { entityId, tableName })
    } catch (error) {
      logger.error('Failed to update platform entity', { error, entityId, data })
      throw error
    }
  }

  // Conflict detection
  private async detectConflict(
    platformEntity: SyncEntity,
    providerData: Record<string, unknown>,
    rule: SyncRule
  ): Promise<SyncConflict | null> {
    const platformVersion = platformEntity.data
    const providerVersion = this.transformData(providerData, rule, true)

    const conflictFields: string[] = []

    // Compare fields for conflicts
    for (const [platformField, providerField] of Object.entries(rule.fieldMappings)) {
      const platformValue = platformVersion[platformField]
      const providerValue = providerVersion[providerField as string]

      if (platformValue !== providerValue &&
          platformEntity.lastSyncedAt < new Date()) { // Only conflict if local changes after last sync
        conflictFields.push(platformField)
      }
    }

    if (conflictFields.length > 0) {
      return {
        id: `conflict_${Date.now()}`,
        entityId: platformEntity.id,
        providerId: platformEntity.providerId,
        platformVersion,
        providerVersion,
        conflictFields
      }
    }

    return null
  }

  private async updateSyncMetadata(entityId: string, lastSyncedAt: Date): Promise<void> {
    try {
      const supabase = await createClient()
      // Since the current tables don't have last_synced_at fields,
      // we'll use the updated_at field to track sync status
      // In a production system, you'd add dedicated sync metadata fields

      // Try to find which table this entity belongs to and update it
      const tables = ['events', 'tasks', 'platform_users']
      let updated = false

      for (const tableName of tables) {
        try {
          const { error } = await supabase
            .from(tableName)
            .update({
              updated_at: lastSyncedAt.toISOString()
            })
            .eq('id', entityId)

          if (!error) {
            updated = true
            logger.debug('Updated sync metadata', { entityId, tableName, lastSyncedAt })
            break
          }
        } catch {
          // Continue to next table
        }
      }

      if (!updated) {
        logger.warn('Could not update sync metadata - entity not found in any table', { entityId })
      }
    } catch (error) {
      logger.error('Failed to update sync metadata', { error, entityId, lastSyncedAt })
      throw error
    }
  }

  // Helper methods
  private getSyncRule(providerId: string, entityType: string): SyncRule | undefined {
    return this.syncRules.get(`${providerId}_${entityType}`)
  }

  private transformData(
    data: Record<string, unknown>,
    rule: SyncRule,
    reverse: boolean = false
  ): Record<string, unknown> {
    const transformed: Record<string, unknown> = {}

    // Apply field mappings
    for (const [fromField, toField] of Object.entries(rule.fieldMappings)) {
      const sourceField = reverse ? toField : fromField
      const targetField = reverse ? fromField : toField

      if (data[sourceField] !== undefined) {
        transformed[targetField] = data[sourceField]
      }
    }

    // Apply transformers if any
    if (rule.transformers) {
      for (const transformer of rule.transformers) {
        if (transformed[transformer.field] !== undefined) {
          transformed[transformer.field] = transformer.transform(transformed[transformer.field])
        }
      }
    }

    return transformed
  }

  private async syncPendingChanges(
    providerId: string,
    entityType: string,
    _sessionId: string
  ): Promise<SyncOperation[]> {
    try {
      const supabase = await createClient()
      const rule = this.getSyncRule(providerId, entityType)
      if (!rule || rule.syncDirection === 'from_provider') {
        return []
      }

      let tableName: string
      switch (entityType) {
        case 'event':
          tableName = 'events'
          break
        case 'task':
          tableName = 'tasks'
          break
        case 'user':
          tableName = 'platform_users'
          break
        default:
          return []
      }

      // Get entities that need syncing:
      // Since we don't have last_synced_at fields, we'll sync recently updated entities
      // In production, you'd have proper sync tracking

      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

      const { data: entities, error } = await supabase
        .from(tableName)
        .select('*')
        .gt('updated_at', oneDayAgo) // Get entities updated in the last 24 hours
        .limit(50) // Limit to prevent overwhelming the sync process

      if (error) {
        logger.error('Error fetching entities for sync', { error, providerId, entityType })
        throw error
      }

      if (!entities || entities.length === 0) {
        return []
      }

      const operations: SyncOperation[] = []

      for (const entity of entities) {
        const operation: SyncOperation = {
          id: `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          entityId: entity.id,
          operation: 'update', // Assume update for now, could be create
          direction: 'to_provider',
          providerId,
          data: this.transformData(entity, rule),
          status: 'pending',
          createdAt: new Date(),
          retryCount: 0
        }

        operations.push(operation)
        this.activeSyncs.set(operation.id, operation)
      }

      logger.debug('Found entities pending sync', { providerId, entityType, count: operations.length })
      return operations
    } catch (error) {
      logger.error('Failed to get entities pending sync', { error, providerId, entityType })
      throw error
    }
  }
}

// Singleton instance
export const dataSyncManager = new DataSyncManager()

// Register default sync rules
dataSyncManager.registerSyncRule({
  id: 'stripe-payment-sync',
  providerId: 'stripe',
  entityType: 'payment',
  syncDirection: 'from_provider',
  syncFrequency: 'real-time',
  fieldMappings: {
    'amount': 'amount',
    'currency': 'currency',
    'customer': 'customerId',
    'status': 'status'
  },
  conflictResolution: 'provider_wins'
})

dataSyncManager.registerSyncRule({
  id: 'jira-issue-sync',
  providerId: 'jira',
  entityType: 'issue',
  syncDirection: 'bidirectional',
  syncFrequency: 'hourly',
  fieldMappings: {
    'title': 'summary',
    'description': 'description',
    'status': 'status',
    'assignee': 'assignee'
  },
  conflictResolution: 'manual'
})

dataSyncManager.registerSyncRule({
  id: 'github-issue-sync',
  providerId: 'github',
  entityType: 'issue',
  syncDirection: 'bidirectional',
  syncFrequency: 'hourly',
  fieldMappings: {
    'title': 'title',
    'description': 'body',
    'status': 'state',
    'assignee': 'assignee'
  },
  conflictResolution: 'merge'
})

// Helper functions
export const syncWorkflowData = async (
  workflowId: string,
  providerId: string,
  sessionId: string
) => {
  const workflowState = await workflowStateManager.getWorkflowState(workflowId)
  if (!workflowState) return

  const entity: SyncEntity = {
    id: workflowState.id,
    type: 'event',
    platformId: workflowState.id,
    providerId,
    data: workflowState.data,
    lastSyncedAt: new Date(),
    version: 1,
    status: 'active'
  }

  return await dataSyncManager.syncToProvider(entity, sessionId)
}

export const syncProviderData = async (
  providerId: string,
  entityType: string,
  sessionId: string,
  filters?: Record<string, unknown>
) => {
  return await dataSyncManager.syncFromProvider(providerId, entityType, sessionId, filters)
}

export const getSyncConflicts = () => {
  return dataSyncManager.getPendingConflicts()
}

export const resolveSyncConflict = async (
  conflictId: string,
  resolution: 'platform_wins' | 'provider_wins' | 'merge',
  customData?: Record<string, unknown>
) => {
  return await dataSyncManager.resolveConflict(conflictId, resolution, customData)
}
