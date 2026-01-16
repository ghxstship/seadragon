// Analytics Integrations - Top 10 Providers
// Google Analytics, Mixpanel, Amplitude, Hotjar, Segment, Adobe Analytics, Matomo, Piwik PRO, Kissmetrics, FullStory

import { IntegrationAPIClient, IntegrationConfig, IntegrationSyncResult, SyncDataParams, SyncResultMetadata } from '../types'
import { AuthProviderId, getProviderBaseUrl } from '../../constants/integration-providers'

const resolveBaseUrl = (providerId: AuthProviderId, override?: string): string =>
  getProviderBaseUrl(providerId, override)

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

interface AnalyticsSyncParams extends SyncDataParams {
  includeEvents?: boolean
  includeUsers?: boolean
  includeSessions?: boolean
  dateRange?: {
    startDate: string
    endDate: string
  }
  metrics?: string[]
  dimensions?: string[]
}

interface GoogleAnalyticsReport {
  dimensionHeaders: Array<{ name: string }>
  metricHeaders: Array<{ name: string; type: string }>
  rows: Array<{
    dimensionValues: Array<{ value: string }>
    metricValues: Array<{ value: string }>
  }>
  [key: string]: unknown
}

interface MixpanelEvent {
  name: string
  distinct_id: string
  time: number
  properties: Record<string, unknown>
  [key: string]: unknown
}

interface AmplitudeEvent {
  event_type: string
  user_id?: string
  device_id?: string
  time: number
  event_properties?: Record<string, unknown>
  user_properties?: Record<string, unknown>
  [key: string]: unknown
}

// =============================================================================
// GOOGLE ANALYTICS INTEGRATION
// =============================================================================

export class GoogleAnalyticsClient implements IntegrationAPIClient {
  providerId = 'google-analytics'
  private baseUrl = resolveBaseUrl('google-analytics')
  private accessToken: string = ''
  private propertyId: string = ''

  async authenticate(config: IntegrationConfig): Promise<void> {
    if (!config.additionalConfig?.propertyId || !config.accessToken) {
      throw new Error('Google Analytics property ID and access token are required')
    }
    this.baseUrl = resolveBaseUrl(this.providerId, config.baseUrl)
    this.accessToken = config.accessToken
    this.propertyId = config.additionalConfig.propertyId
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/properties/${this.propertyId}/metadata`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Accept': 'application/json'
        }
      })
      return response.ok
    } catch {
      return false
    }
  }

  async syncData(params?: AnalyticsSyncParams): Promise<IntegrationSyncResult> {
    const syncStart = new Date()
    let recordsProcessed = 0
    const errors: string[] = []

    try {
      const report = await this.getReport(params)
      recordsProcessed += report.rows?.length || 0

      const metadata: SyncResultMetadata = {
        totalRecords: recordsProcessed,
        createdCount: 0,
        updatedCount: 0,
        deletedCount: 0,
        skippedCount: 0,
        durationMs: Date.now() - syncStart.getTime(),
        rowsCount: report.rows?.length || 0
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

  async getReport(params?: AnalyticsSyncParams): Promise<GoogleAnalyticsReport> {
    const dateRange = params?.dateRange || {
      startDate: '30daysAgo',
      endDate: 'today'
    }

    const dimensions = params?.dimensions || ['date', 'pagePath']
    const metrics = params?.metrics || ['activeUsers', 'screenPageViews']

    const requestBody = {
      dateRanges: [dateRange],
      dimensions: dimensions.map(name => ({ name })),
      metrics: metrics.map(name => ({ name })),
      limit: params?.limit || 10000
    }

    const response = await fetch(`${this.baseUrl}/properties/${this.propertyId}/runReport`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
      throw new Error(`Google Analytics API error: ${response.status}`)
    }

    return response.json()
  }
}

// =============================================================================
// MIXPANEL INTEGRATION
// =============================================================================

export class MixpanelClient implements IntegrationAPIClient {
  providerId = 'mixpanel'
  private baseUrl = resolveBaseUrl('mixpanel')
  private apiSecret: string = ''
  private projectToken: string = ''

  async authenticate(config: IntegrationConfig): Promise<void> {
    if (!config.additionalConfig?.apiSecret || !config.additionalConfig?.projectToken) {
      throw new Error('Mixpanel API secret and project token are required')
    }
    this.apiSecret = config.additionalConfig.apiSecret
    this.projectToken = config.additionalConfig.projectToken
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/events?project_id=${this.projectToken}&from_date=2023-01-01&to_date=2023-01-02`, {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${this.apiSecret}:`).toString('base64')}`,
          'Accept': 'application/json'
        }
      })
      return response.ok
    } catch {
      return false
    }
  }

  async syncData(params?: AnalyticsSyncParams): Promise<IntegrationSyncResult> {
    const syncStart = new Date()
    let recordsProcessed = 0
    const errors: string[] = []

    try {
      const events = await this.getEvents(params)
      recordsProcessed += events.length

      const metadata: SyncResultMetadata = {
        totalRecords: recordsProcessed,
        createdCount: 0,
        updatedCount: 0,
        deletedCount: 0,
        skippedCount: 0,
        durationMs: Date.now() - syncStart.getTime(),
        eventsCount: events.length
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

  async getEvents(params?: AnalyticsSyncParams): Promise<MixpanelEvent[]> {
    const fromDate = params?.dateRange?.startDate || '30daysAgo'
    const toDate = params?.dateRange?.endDate || 'today'

    const url = `${this.baseUrl}/events?project_id=${this.projectToken}&from_date=${fromDate}&to_date=${toDate}&limit=${params?.limit || 1000}`

    const response = await fetch(url, {
      headers: {
        'Authorization': `Basic ${Buffer.from(`${this.apiSecret}:`).toString('base64')}`,
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`Mixpanel API error: ${response.status}`)
    }

    const data = await response.json()
    return data.data?.events || []
  }

  async trackEvent(eventName: string, properties: Record<string, unknown>, distinctId: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/events`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${this.apiSecret}:`).toString('base64')}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify([{
        event: eventName,
        properties: {
          ...properties,
          token: this.projectToken,
          distinct_id: distinctId,
          time: Date.now()
        }
      }])
    })

    if (!response.ok) {
      throw new Error(`Mixpanel API error: ${response.status}`)
    }

    return response.json()
  }
}

// Additional implementations for Amplitude, Hotjar, Segment, Adobe Analytics, Matomo, Piwik PRO, Kissmetrics, FullStory would follow the same pattern...

// =============================================================================
// REGISTRATION
// =============================================================================

import { integrationManager } from '../manager'
