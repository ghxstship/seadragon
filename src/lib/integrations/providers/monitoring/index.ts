// Monitoring & Observability Integrations - Top 10 Providers
// Datadog, New Relic, Sentry, Grafana, Prometheus, ELK Stack, Splunk, AppDynamics, Dynatrace, Pingdom

import { IntegrationAPIClient, IntegrationConfig, IntegrationSyncResult, SyncDataParams, SyncResultMetadata } from '../types'
import { API_ENDPOINTS } from '../../../constants/api-endpoints'

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

interface MonitoringSyncParams extends SyncDataParams {
  includeMetrics?: boolean
  includeLogs?: boolean
  includeAlerts?: boolean
  includeErrors?: boolean
  includeTraces?: boolean
  timeRange?: {
    start: string
    end: string
  }
  serviceName?: string
  severity?: string
}

interface DatadogMetric {
  metric: string
  points: Array<[number, number]>
  tags: string[]
  [key: string]: unknown
}

interface NewRelicMetric {
  name: string
  value: number
  timestamp: number
  attributes: Record<string, unknown>
  [key: string]: unknown
}

interface SentryIssue {
  id: string
  title: string
  level: string
  status: string
  lastSeen: string
  firstSeen: string
  count: number
  [key: string]: unknown
}

// =============================================================================
// DATADOG INTEGRATION
// =============================================================================

export class DatadogClient implements IntegrationAPIClient {
  providerId = 'datadog'
  private baseUrl = API_ENDPOINTS.DATADOG.BASE_URL
  private apiKey: string = ''
  private appKey: string = ''

  async authenticate(config: IntegrationConfig): Promise<void> {
    if (!config.additionalConfig?.apiKey || !config.additionalConfig?.appKey) {
      throw new Error('Datadog API key and application key are required')
    }
    this.apiKey = config.additionalConfig.apiKey
    this.appKey = config.additionalConfig.appKey
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/validate?api_key=${this.apiKey}&application_key=${this.appKey}`)
      return response.ok
    } catch {
      return false
    }
  }

  async syncData(params?: MonitoringSyncParams): Promise<IntegrationSyncResult> {
    const syncStart = new Date()
    let recordsProcessed = 0
    const errors: string[] = []

    try {
      // Sync metrics
      if (params?.includeMetrics) {
        const metrics = await this.getMetrics(params)
        recordsProcessed += metrics.length
      }

      // Sync logs
      if (params?.includeLogs) {
        const logs = await this.getLogs(params)
        recordsProcessed += logs.length
      }

      // Sync alerts/monitors
      if (params?.includeAlerts) {
        const alerts = await this.getMonitors(params)
        recordsProcessed += alerts.length
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
          durationMs: Date.now() - syncStart.getTime()
        },
        syncStarted: syncStart,
        syncCompleted: new Date()
      }
    }
  }

  async getMetrics(params?: MonitoringSyncParams): Promise<DatadogMetric[]> {
    const from = params?.timeRange?.start || Math.floor(Date.now() / 1000) - 3600
    const to = params?.timeRange?.end || Math.floor(Date.now() / 1000)

    const url = `${this.baseUrl}/query?api_key=${this.apiKey}&application_key=${this.appKey}&from=${from}&to=${to}&query=system.cpu.idle{*}`

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Datadog API error: ${response.status}`)
    }

    const data = await response.json()
    return data.series || []
  }

  async getLogs(params?: MonitoringSyncParams): Promise<any[]> {
    const from = params?.timeRange?.start || new Date(Date.now() - 3600000).toISOString()
    const to = params?.timeRange?.end || new Date().toISOString()

    const url = `${this.baseUrl.replace('v1', 'v2')}/logs/events?api_key=${this.apiKey}&application_key=${this.appKey}&filter[from]=${from}&filter[to]=${to}`

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Datadog API error: ${response.status}`)
    }

    const data = await response.json()
    return data.data || []
  }

  async getMonitors(params?: MonitoringSyncParams): Promise<any[]> {
    const url = `${this.baseUrl}/monitor?api_key=${this.apiKey}&application_key=${this.appKey}`

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Datadog API error: ${response.status}`)
    }

    const data = await response.json()
    return data.monitors || []
  }

  async createMonitor(monitorData: Record<string, unknown>): Promise<any> {
    const url = `${this.baseUrl}/monitor?api_key=${this.apiKey}&application_key=${this.appKey}`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(monitorData)
    })

    if (!response.ok) {
      throw new Error(`Datadog API error: ${response.status}`)
    }

    return response.json()
  }
}

// =============================================================================
// NEW RELIC INTEGRATION
// =============================================================================

export class NewRelicClient implements IntegrationAPIClient {
  providerId = 'new-relic'
  private baseUrl = API_ENDPOINTS.NEW_RELIC.BASE_URL
  private apiKey: string = ''
  private accountId: string = ''

  async authenticate(config: IntegrationConfig): Promise<void> {
    if (!config.apiKey || !config.additionalConfig?.accountId) {
      throw new Error('New Relic API key and account ID are required')
    }
    this.apiKey = config.apiKey
    this.accountId = config.additionalConfig.accountId
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/applications.json`, {
        headers: {
          'X-Api-Key': this.apiKey,
          'Accept': 'application/json'
        }
      })
      return response.ok
    } catch {
      return false
    }
  }

  async syncData(params?: MonitoringSyncParams): Promise<IntegrationSyncResult> {
    const syncStart = new Date()
    let recordsProcessed = 0
    const errors: string[] = []

    try {
      // Sync applications
      const applications = await this.getApplications(params)
      recordsProcessed += applications.length

      // Sync servers
      const servers = await this.getServers(params)
      recordsProcessed += servers.length

      // Sync alerts if requested
      if (params?.includeAlerts) {
        const alertPolicies = await this.getAlertPolicies(params)
        recordsProcessed += alertPolicies.length
      }

      const metadata: SyncResultMetadata = {
        totalRecords: recordsProcessed,
        createdCount: 0,
        updatedCount: 0,
        deletedCount: 0,
        skippedCount: 0,
        durationMs: Date.now() - syncStart.getTime(),
        applicationsCount: applications.length,
        serversCount: servers.length
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
          durationMs: Date.now() - syncStart.getTime()
        },
        syncStarted: syncStart,
        syncCompleted: new Date()
      }
    }
  }

  async getApplications(params?: MonitoringSyncParams): Promise<any[]> {
    const url = `${this.baseUrl}/applications.json?filter[ids]=${this.accountId}`

    const response = await fetch(url, {
      headers: {
        'X-Api-Key': this.apiKey,
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`New Relic API error: ${response.status}`)
    }

    const data = await response.json()
    return data.applications || []
  }

  async getServers(params?: MonitoringSyncParams): Promise<any[]> {
    const url = `${this.baseUrl}/servers.json`

    const response = await fetch(url, {
      headers: {
        'X-Api-Key': this.apiKey,
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`New Relic API error: ${response.status}`)
    }

    const data = await response.json()
    return data.servers || []
  }

  async getAlertPolicies(params?: MonitoringSyncParams): Promise<any[]> {
    const url = `${this.baseUrl}/alerts_policies.json`

    const response = await fetch(url, {
      headers: {
        'X-Api-Key': this.apiKey,
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`New Relic API error: ${response.status}`)
    }

    const data = await response.json()
    return data.policies || []
  }
}

// =============================================================================
// SENTRY INTEGRATION
// =============================================================================

export class SentryClient implements IntegrationAPIClient {
  providerId = 'sentry'
  private baseUrl = API_ENDPOINTS.SENTRY.BASE_URL
  private authToken: string = ''
  private organization: string = ''

  async authenticate(config: IntegrationConfig): Promise<void> {
    if (!config.additionalConfig?.authToken || !config.additionalConfig?.organization) {
      throw new Error('Sentry auth token and organization slug are required')
    }
    this.authToken = config.additionalConfig.authToken
    this.organization = config.additionalConfig.organization
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/organizations/${this.organization}/`, {
        headers: {
          'Authorization': `Bearer ${this.authToken}`,
          'Accept': 'application/json'
        }
      })
      return response.ok
    } catch {
      return false
    }
  }

  async syncData(params?: MonitoringSyncParams): Promise<IntegrationSyncResult> {
    const syncStart = new Date()
    let recordsProcessed = 0
    const errors: string[] = []

    try {
      // Sync projects
      const projects = await this.getProjects()
      recordsProcessed += projects.length

      // Sync issues/errors if requested
      if (params?.includeErrors) {
        for (const project of projects.slice(0, 5)) { // Limit to avoid rate limits
          try {
            const issues = await this.getIssues(project.id, params)
            recordsProcessed += issues.length
          } catch (error) {
            errors.push(`Failed to sync issues for project ${project.id}: ${error}`)
          }
        }
      }

      // Sync releases if requested
      const releases = await this.getReleases(params)
      recordsProcessed += releases.length

      const metadata: SyncResultMetadata = {
        totalRecords: recordsProcessed,
        createdCount: 0,
        updatedCount: 0,
        deletedCount: 0,
        skippedCount: 0,
        durationMs: Date.now() - syncStart.getTime(),
        projectsCount: projects.length,
        releasesCount: releases.length
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
          durationMs: Date.now() - syncStart.getTime()
        },
        syncStarted: syncStart,
        syncCompleted: new Date()
      }
    }
  }

  async getProjects(): Promise<any[]> {
    const url = `${this.baseUrl}/organizations/${this.organization}/projects/`

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${this.authToken}`,
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`Sentry API error: ${response.status}`)
    }

    return response.json()
  }

  async getIssues(projectId: string, params?: MonitoringSyncParams): Promise<SentryIssue[]> {
    const url = `${this.baseUrl}/projects/${this.organization}/${projectId}/issues/?limit=${params?.limit || 50}`

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${this.authToken}`,
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`Sentry API error: ${response.status}`)
    }

    return response.json()
  }

  async getReleases(params?: MonitoringSyncParams): Promise<any[]> {
    const url = `${this.baseUrl}/organizations/${this.organization}/releases/?limit=${params?.limit || 50}`

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${this.authToken}`,
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`Sentry API error: ${response.status}`)
    }

    return response.json()
  }

  async createRelease(releaseData: Record<string, unknown>): Promise<any> {
    const url = `${this.baseUrl}/organizations/${this.organization}/releases/`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.authToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(releaseData)
    })

    if (!response.ok) {
      throw new Error(`Sentry API error: ${response.status}`)
    }

    return response.json()
  }
}

// Additional implementations for Grafana, Prometheus, ELK Stack, Splunk, AppDynamics, Dynatrace, Pingdom would follow the same pattern...

// =============================================================================
// REGISTRATION
// =============================================================================

import { integrationManager } from '../manager'

export function registerMonitoringIntegrations(): void {
  integrationManager.registerAPIClient('datadog', new DatadogClient())
  integrationManager.registerAPIClient('new-relic', new NewRelicClient())
  integrationManager.registerAPIClient('sentry', new SentryClient())
  // Register remaining providers...
}
