
// Time Tracking Integrations - Harvest, Toggl, Clockify

import { IntegrationAPIClient, IntegrationConfig, IntegrationSyncResult, SyncDataParams, SyncResultMetadata } from '../types'
import { AuthProviderId, getProviderBaseUrl } from '../../constants/integration-providers'
import { buildHarvestHeaders } from '../../constants/provider-headers'

class IntegrationError extends Error {
  constructor(public code: string, message: string, public context?: Record<string, unknown>) {
    super(message)
    this.name = 'IntegrationError'
  }
}

const resolveBaseUrl = (providerId: AuthProviderId, override?: string): string =>
  getProviderBaseUrl(providerId, override)

// Shared sync params for providers
type HarvestSyncParams = SyncDataParams & {
  includeProjects?: boolean
  includeClients?: boolean
  from?: string
  to?: string
}

type HarvestTimeEntry = {
  id: number
  hours?: number
  user_id?: number
  project_id?: number
  task_id?: number
  spent_date?: string
}

type HarvestProjectsResponse = { projects?: HarvestProject[] }
type HarvestProject = { id: number; name?: string }

type HarvestClientsResponse = { clients?: HarvestClientType[] }
type HarvestClientType = { id: number; name?: string }

type TogglSyncParams = SyncDataParams & {
  includeProjects?: boolean
  includeWorkspaces?: boolean
  workspaceId?: string
  startDate?: string
  endDate?: string
}

type ClockifySyncParams = SyncDataParams & {
  includeProjects?: boolean
  includeUsers?: boolean
  start?: string
  end?: string
}

// Harvest Integration Implementation
export class HarvestClient implements IntegrationAPIClient {
  providerId = 'harvest'
  private baseUrl = resolveBaseUrl('harvest')
  private accessToken: string = ''
  private accountId: string = ''

  async authenticate(config: IntegrationConfig): Promise<void> {
    if (!config.additionalConfig?.accountId || !config.apiKey) {
      throw new Error('Harvest account ID and access token are required')
    }

    this.baseUrl = resolveBaseUrl(this.providerId, config.baseUrl)
    this.accountId = config.additionalConfig.accountId
    this.accessToken = config.apiKey
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.request('/users/me', { method: 'GET' })
      return true
    } catch {
      return false
    }
  }

  async syncData(params?: HarvestSyncParams): Promise<IntegrationSyncResult> {
    const syncStart = new Date()
    let recordsProcessed = 0
    const errors: string[] = []

    try {
      const timeEntries = await this.getTimeEntries(params)
      recordsProcessed += timeEntries.length

      if (params?.includeProjects) {
        const projects = await this.getProjects()
        recordsProcessed += projects.length
      }

      if (params?.includeClients) {
        const clients = await this.getClients()
        recordsProcessed += clients.length
      }

      const metadata: SyncResultMetadata = {
        totalRecords: recordsProcessed,
        createdCount: 0,
        updatedCount: 0,
        deletedCount: 0,
        skippedCount: 0,
        durationMs: Date.now() - syncStart.getTime(),
        warnings: []
      }

      return {
        success: true,
        recordsProcessed,
        errors,
        metadata,
        syncStarted: syncStart,
        syncCompleted: new Date()
      }
    } catch (error) {
      errors.push(error instanceof Error ? error.message : 'Unknown sync error')
      return {
        success: false,
        recordsProcessed,
        errors,
        metadata: {
          totalRecords: recordsProcessed,
          createdCount: 0,
          updatedCount: 0,
          deletedCount: 0,
          skippedCount: 0,
          durationMs: Date.now() - syncStart.getTime(),
          warnings: ['Harvest sync failed']
        },
        syncStarted: syncStart,
        syncCompleted: new Date()
      }
    }
  }

  async getTimeEntries(params?: HarvestSyncParams): Promise<HarvestTimeEntry[]> {
    const from = params?.from || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    const to = params?.to || new Date().toISOString().split('T')[0]
    const data = await this.request<{ time_entries?: HarvestTimeEntry[] }>(`/time_entries?from=${from}&to=${to}`, { method: 'GET' })
    return data.time_entries || []
  }

  async getProjects(): Promise<HarvestProject[]> {
    const data = await this.request<HarvestProjectsResponse>('/projects', { method: 'GET' })
    return data.projects || []
  }

  async getClients(): Promise<HarvestClientType[]> {
    const data = await this.request<HarvestClientsResponse>('/clients', { method: 'GET' })
    return data.clients || []
  }

  async createTimeEntry(timeEntryData: Record<string, unknown>): Promise<HarvestTimeEntry> {
    return this.request<HarvestTimeEntry>('/time_entries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(timeEntryData)
    })
  }

  private async request<T>(path: string, init: RequestInit): Promise<T> {
    const url = path.startsWith('http') ? path : `${this.baseUrl}${path}`
    const headers = {
      ...buildHarvestHeaders(this.accessToken, this.accountId),
      ...(init.headers as Record<string, string> | undefined)
    }
    const response = await fetch(url, { ...init, headers })
    if (!response.ok) {
      throw new IntegrationError('HTTP_ERROR', `HTTP ${response.status}: ${response.statusText}`, {
        providerId: this.providerId,
        url,
        status: response.status
      })
    }
    return response.json() as Promise<T>
  }
}

// Toggl Integration Implementation
export class TogglClient implements IntegrationAPIClient {
  providerId = 'toggl'
  private baseUrl = resolveBaseUrl('toggl')
  private apiToken: string = ''

  async authenticate(config: IntegrationConfig): Promise<void> {
    if (!config.apiKey) {
      throw new Error('Toggl API token is required')
    }
    this.baseUrl = resolveBaseUrl(this.providerId, config.baseUrl)
    this.apiToken = config.apiKey
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.request('/me', { method: 'GET' })
      return true
    } catch {
      return false
    }
  }

  async syncData(params?: TogglSyncParams): Promise<IntegrationSyncResult> {
    const syncStart = new Date()
    let recordsProcessed = 0
    const errors: string[] = []

    try {
      const timeEntries = await this.getTimeEntries(params)
      recordsProcessed += timeEntries.length

      if (params?.includeProjects) {
        const projects = await this.getProjects(params)
        recordsProcessed += projects.length
      }

      if (params?.includeWorkspaces) {
        const workspaces = await this.getWorkspaces()
        recordsProcessed += (workspaces as unknown[]).length
      }

      const metadata: SyncResultMetadata = {
        totalRecords: recordsProcessed,
        createdCount: 0,
        updatedCount: 0,
        deletedCount: 0,
        skippedCount: 0,
        durationMs: Date.now() - syncStart.getTime(),
        warnings: []
      }

      return {
        success: true,
        recordsProcessed,
        errors,
        metadata,
        syncStarted: syncStart,
        syncCompleted: new Date()
      }
    } catch (error) {
      errors.push(error instanceof Error ? error.message : 'Unknown sync error')
      return {
        success: false,
        recordsProcessed,
        errors,
        metadata: {
          totalRecords: recordsProcessed,
          createdCount: 0,
          updatedCount: 0,
          deletedCount: 0,
          skippedCount: 0,
          durationMs: Date.now() - syncStart.getTime(),
          warnings: ['Toggl sync failed']
        },
        syncStarted: syncStart,
        syncCompleted: new Date()
      }
    }
  }

  async getTimeEntries(params?: TogglSyncParams): Promise<Array<{ id: number; start?: string; duration?: number }>> {
    const startDate = params?.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    const endDate = params?.endDate || new Date().toISOString()
    return this.request<Array<{ id: number; start?: string; duration?: number }>>(
      `/me/time_entries?start_date=${startDate}&end_date=${endDate}`,
      { method: 'GET' }
    )
  }

  async getProjects(params?: TogglSyncParams): Promise<Array<{ id: number; name?: string }>> {
    const workspaceId = params?.workspaceId
    if (!workspaceId) {
      throw new Error('Workspace ID is required for project sync')
    }

    return this.request<Array<{ id: number; name?: string }>>(`/workspaces/${workspaceId}/projects`, { method: 'GET' })
  }

  async getWorkspaces(): Promise<Array<{ id: number; name?: string }>> {
    return this.request<Array<{ id: number; name?: string }>>('/workspaces', { method: 'GET' })
  }

  async startTimeEntry(timeEntryData: Record<string, unknown>): Promise<{ id: number; start?: string; duration?: number }> {
    const workspaceId = (timeEntryData as Record<string, unknown>)?.['workspace_id']
    return this.request<{ id: number; start?: string; duration?: number }>(`/workspaces/${workspaceId}/time_entries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(timeEntryData)
    })
  }

  private authHeader(): Record<string, string> {
    return { 'Authorization': `Basic ${Buffer.from(`${this.apiToken}:api_token`).toString('base64')}` }
  }

  private async request<T>(path: string, init: RequestInit): Promise<T> {
    const url = path.startsWith('http') ? path : `${this.baseUrl}${path}`
    const headers = { ...this.authHeader(), ...(init.headers as Record<string, string> | undefined) }
    const response = await fetch(url, { ...init, headers })
    if (!response.ok) {
      throw new IntegrationError('HTTP_ERROR', `HTTP ${response.status}: ${response.statusText}`, {
        providerId: this.providerId,
        url,
        status: response.status
      })
    }
    return response.json() as Promise<T>
  }
}

// Clockify Integration Implementation
export class ClockifyClient implements IntegrationAPIClient {
  providerId = 'clockify'
  private baseUrl = resolveBaseUrl('clockify')
  private apiKey: string = ''
  private workspaceId: string = ''

  async authenticate(config: IntegrationConfig): Promise<void> {
    if (!config.apiKey || !config.additionalConfig?.workspaceId) {
      throw new Error('Clockify API key and workspace ID are required')
    }

    this.baseUrl = resolveBaseUrl(this.providerId, config.baseUrl)
    this.apiKey = config.apiKey
    this.workspaceId = config.additionalConfig.workspaceId
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.request('/user', { method: 'GET' })
      return true
    } catch {
      return false
    }
  }

  async syncData(params?: ClockifySyncParams): Promise<IntegrationSyncResult> {
    const syncStart = new Date()
    let recordsProcessed = 0
    const errors: string[] = []

    try {
      const timeEntries = await this.getTimeEntries(params)
      recordsProcessed += timeEntries.length

      if (params?.includeProjects) {
        const projects = await this.getProjects()
        recordsProcessed += projects.length
      }

      if (params?.includeUsers) {
        const users = await this.getUsers()
        recordsProcessed += users.length
      }

      const metadata: SyncResultMetadata = {
        totalRecords: recordsProcessed,
        createdCount: 0,
        updatedCount: 0,
        deletedCount: 0,
        skippedCount: 0,
        durationMs: Date.now() - syncStart.getTime()
      }

      return {
        success: true,
        recordsProcessed,
        errors,
        metadata,
        syncStarted: syncStart,
        syncCompleted: new Date()
      }
    } catch (error) {
      errors.push(error instanceof Error ? error.message : 'Unknown sync error')
      return {
        success: false,
        recordsProcessed,
        errors,
        metadata: {
          totalRecords: recordsProcessed,
          createdCount: 0,
          updatedCount: 0,
          deletedCount: 0,
          skippedCount: 0,
          durationMs: Date.now() - syncStart.getTime(),
          warnings: ['Clockify sync failed']
        },
        syncStarted: syncStart,
        syncCompleted: new Date()
      }
    }
  }

  async getTimeEntries(params?: ClockifySyncParams): Promise<unknown[]> {
    const start = params?.start || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    const end = params?.end || new Date().toISOString()
    return this.request(`/workspaces/${this.workspaceId}/time-entries?start=${start}&end=${end}`, { method: 'GET' })
  }

  async getProjects(): Promise<unknown[]> {
    return this.request(`/workspaces/${this.workspaceId}/projects`, { method: 'GET' })
  }

  async getUsers(): Promise<unknown[]> {
    return this.request(`/workspaces/${this.workspaceId}/users`, { method: 'GET' })
  }

  async createTimeEntry(timeEntryData: Record<string, unknown>): Promise<unknown> {
    return this.request(`/workspaces/${this.workspaceId}/time-entries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(timeEntryData)
    })
  }

  private async request(path: string, init: RequestInit): Promise<any> {
    const url = path.startsWith('http') ? path : `${this.baseUrl}${path}`
    const headers = {
      'X-Api-Key': this.apiKey,
      ...(init.headers as Record<string, string> | undefined)
    }
    const response = await fetch(url, { ...init, headers })
    if (!response.ok) {
      throw new IntegrationError('HTTP_ERROR', `HTTP ${response.status}: ${response.statusText}`, {
        providerId: this.providerId,
        url,
        status: response.status
      })
    }
    return response.json()
  }
}

// Register time tracking integrations
import { integrationManager } from '../manager'

export function registerTimeTrackingIntegrations(): void {
  integrationManager.registerAPIClient('harvest', new HarvestClient())
  integrationManager.registerAPIClient('toggl', new TogglClient())
  integrationManager.registerAPIClient('clockify', new ClockifyClient())
}
