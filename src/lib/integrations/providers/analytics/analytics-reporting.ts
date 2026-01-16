
// Analytics & Reporting Integrations - Google Analytics, Mixpanel, Amplitude

import { IntegrationAPIClient, IntegrationConfig, IntegrationSyncResult } from '../types'
import { AuthProviderId, getProviderBaseUrl } from '../../constants/integration-providers'

const resolveBaseUrl = (providerId: AuthProviderId, override?: string): string =>
  getProviderBaseUrl(providerId, override)

export class GoogleAnalyticsClient implements IntegrationAPIClient {
  providerId = 'google-analytics'
  private baseUrl = resolveBaseUrl('google-analytics')
  private accessToken: string = ''

  async authenticate(config: IntegrationConfig): Promise<void> {
    if (!config.accessToken) {
      throw new Error('Google Analytics access token is required')
    }
    this.baseUrl = resolveBaseUrl(this.providerId, config.baseUrl)
    this.accessToken = config.accessToken
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(
        `${this.baseUrl}/properties/${process.env.GA_PROPERTY_ID}/runReport`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
            dimensions: [{ name: 'date' }],
            metrics: [{ name: 'sessions' }],
            limit: 1
          })
        }
      )
      return response.ok
    } catch {
      return false
    }
  }

  async syncData(params?: Record<string, unknown>): Promise<IntegrationSyncResult> {
    const syncStart = new Date()
    let recordsProcessed = 0
    const errors: string[] = []

    try {
      const rawPropertyId = params?.propertyId ?? process.env.GA_PROPERTY_ID
      if (!rawPropertyId || typeof rawPropertyId !== 'string') {
        throw new Error('Google Analytics Property ID is required and must be a string')
      }
      const propertyId = rawPropertyId

      // Sync audience data
      const audienceData = await this.getAudienceData(propertyId, params)
      recordsProcessed += audienceData.length

      // Sync conversion data
      const conversionData = await this.getConversionData(propertyId, params)
      recordsProcessed += conversionData.length

      // Sync custom events if specified
      if (params?.includeCustomEvents) {
        const customEvents = await this.getCustomEvents(propertyId, params)
        recordsProcessed += customEvents.length
      }

      return {
        success: true,
        recordsProcessed,
        errors,
        metadata: {
          propertyId,
          audienceRecords: audienceData.length,
          conversionRecords: conversionData.length,
          dateRange: params?.dateRange || '30days'
        },
        syncStarted: syncStart,
        syncCompleted: new Date()
      }
    } catch (error) {
      errors.push(error instanceof Error ? error.message : 'Unknown sync error')
      return {
        success: false,
        recordsProcessed,
        errors,
        metadata: {},
        syncStarted: syncStart,
        syncCompleted: new Date()
      }
    }
  }

  async getAudienceData(propertyId: string, params?: unknown): Promise<unknown[]> {
    const dateRange = params?.dateRange || '30daysAgo'
    const response = await fetch(
      `${this.baseUrl}/properties/${propertyId}/runReport`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          dateRanges: [{ startDate: dateRange, endDate: 'today' }],
          dimensions: [
            { name: 'date' },
            { name: 'deviceCategory' },
            { name: 'country' },
            { name: 'city' }
          ],
          metrics: [
            { name: 'sessions' },
            { name: 'users' },
            { name: 'pageviews' },
            { name: 'bounceRate' },
            { name: 'averageSessionDuration' }
          ],
          orderBys: [{ dimension: { dimensionName: 'date' } }]
        })
      }
    )

    if (!response.ok) {
      throw new Error(`Google Analytics API error: ${response.status}`)
    }

    const data = await response.json()
    return data.rows || []
  }

  async getConversionData(propertyId: string, params?: unknown): Promise<unknown[]> {
    const dateRange = params?.dateRange || '30daysAgo'
    const response = await fetch(
      `${this.baseUrl}/properties/${propertyId}/runReport`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          dateRanges: [{ startDate: dateRange, endDate: 'today' }],
          dimensions: [
            { name: 'date' },
            { name: 'eventName' }
          ],
          metrics: [
            { name: 'eventCount' },
            { name: 'totalUsers' }
          ],
          dimensionFilter: {
            filter: {
              fieldName: 'eventName',
              inListFilter: {
                values: ['purchase', 'signup', 'contact', 'download']
              }
            }
          }
        })
      }
    )

    if (!response.ok) {
      throw new Error(`Google Analytics API error: ${response.status}`)
    }

    const data = await response.json()
    return data.rows || []
  }

  async getCustomEvents(propertyId: string, params?: unknown): Promise<unknown[]> {
    const dateRange = params?.dateRange || '30daysAgo'
    const response = await fetch(
      `${this.baseUrl}/properties/${propertyId}/runReport`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          dateRanges: [{ startDate: dateRange, endDate: 'today' }],
          dimensions: [
            { name: 'date' },
            { name: 'eventName' },
            { name: 'customEvent:parameter_name' }
          ],
          metrics: [
            { name: 'eventCount' },
            { name: 'totalUsers' }
          ]
        })
      }
    )

    if (!response.ok) {
      throw new Error(`Google Analytics API error: ${response.status}`)
    }

    const data = await response.json()
    return data.rows || []
  }
}

// Mixpanel Integration Implementation
export class MixpanelClient implements IntegrationAPIClient {
  providerId = 'mixpanel'
  private baseUrl = resolveBaseUrl('mixpanel')
  private apiSecret: string = ''
  private projectToken: string = ''

  async authenticate(config: IntegrationConfig): Promise<void> {
    if (!config.apiKey || !config.additionalConfig?.projectToken) {
      throw new Error('Mixpanel API secret and project token are required')
    }

    this.baseUrl = resolveBaseUrl(this.providerId, config.baseUrl)
    this.apiSecret = config.apiKey
    this.projectToken = config.additionalConfig.projectToken
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(
        `${this.baseUrl}/events?project_id=${this.projectToken}`,
        {
          headers: {
            'Authorization': `Basic ${Buffer.from(`${this.apiSecret}:`).toString('base64')}`
          }
        }
      )
      return response.ok
    } catch {
      return false
    }
  }

  async syncData(params?: Record<string, unknown>): Promise<IntegrationSyncResult> {
    const syncStart = new Date()
    let recordsProcessed = 0
    const errors: string[] = []

    try {
      // Sync events data
      const eventsData = await this.getEventsData(params)
      recordsProcessed += eventsData.length

      // Sync funnels if specified
      if (params?.includeFunnels) {
        const funnelsData = await this.getFunnelsData(params)
        recordsProcessed += funnelsData.length
      }

      // Sync cohorts if specified
      if (params?.includeCohorts) {
        const cohortsData = await this.getCohortsData(params)
        recordsProcessed += cohortsData.length
      }

      return {
        success: true,
        recordsProcessed,
        errors,
        metadata: {
          eventsCount: eventsData.length,
          dateRange: params?.dateRange || '30days'
        },
        syncStarted: syncStart,
        syncCompleted: new Date()
      }
    } catch (error) {
      errors.push(error instanceof Error ? error.message : 'Unknown sync error')
      return {
        success: false,
        recordsProcessed,
        errors,
        metadata: {},
        syncStarted: syncStart,
        syncCompleted: new Date()
      }
    }
  }

  async getEventsData(params?: unknown): Promise<unknown[]> {
    const fromDate = params?.fromDate || '2024-01-01'
    const toDate = params?.toDate || new Date().toISOString().split('T')[0]

    const response = await fetch(
      `${this.baseUrl}/events?project_id=${this.projectToken}&from_date=${fromDate}&to_date=${toDate}&type=general&unit=day`,
      {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${this.apiSecret}:`).toString('base64')}`
        }
      }
    )

    if (!response.ok) {
      throw new Error(`Mixpanel API error: ${response.status}`)
    }

    const data = await response.json()
    return data.data?.values || []
  }

  async getFunnelsData(params?: unknown): Promise<unknown[]> {
    const response = await fetch(
      `${this.baseUrl}/funnels/list?project_id=${this.projectToken}`,
      {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${this.apiSecret}:`).toString('base64')}`
        }
      }
    )

    if (!response.ok) {
      throw new Error(`Mixpanel API error: ${response.status}`)
    }

    const data = await response.json()
    return data || []
  }

  async getCohortsData(params?: unknown): Promise<unknown[]> {
    const response = await fetch(
      `${this.baseUrl}/cohorts/list?project_id=${this.projectToken}`,
      {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${this.apiSecret}:`).toString('base64')}`
        }
      }
    )

    if (!response.ok) {
      throw new Error(`Mixpanel API error: ${response.status}`)
    }

    const data = await response.json()
    return data || []
  }
}

// Amplitude Integration Implementation
export class AmplitudeClient implements IntegrationAPIClient {
  providerId = 'amplitude'
  private baseUrl = resolveBaseUrl('amplitude')
  private apiKey: string = ''
  private secretKey: string = ''

  async authenticate(config: IntegrationConfig): Promise<void> {
    if (!config.apiKey || !config.additionalConfig?.secretKey) {
      throw new Error('Amplitude API key and secret key are required')
    }

    this.baseUrl = resolveBaseUrl(this.providerId, config.baseUrl)
    this.apiKey = config.apiKey
    this.secretKey = config.additionalConfig.secretKey
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(
        `${this.baseUrl}/events/segmentation`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            api_key: this.apiKey,
            start: '1DayAgo',
            end: 'today',
            e: { event_type: 'session_start' },
            m: 'count'
          })
        }
      )
      return response.ok
    } catch {
      return false
    }
  }

  async syncData(params?: Record<string, unknown>): Promise<IntegrationSyncResult> {
    const syncStart = new Date()
    let recordsProcessed = 0
    const errors: string[] = []

    try {
      // Sync event segmentation data
      const segmentationData = await this.getEventSegmentation(params)
      recordsProcessed += segmentationData.length

      // Sync user activity if specified
      if (params?.includeUserActivity) {
        const userActivityData = await this.getUserActivity(params)
        recordsProcessed += userActivityData.length
      }

      // Sync revenue metrics if specified
      if (params?.includeRevenue) {
        const revenueData = await this.getRevenueMetrics(params)
        recordsProcessed += revenueData.length
      }

      return {
        success: true,
        recordsProcessed,
        errors,
        metadata: {
          segmentationRecords: segmentationData.length,
          dateRange: params?.dateRange || '30days'
        },
        syncStarted: syncStart,
        syncCompleted: new Date()
      }
    } catch (error) {
      errors.push(error instanceof Error ? error.message : 'Unknown sync error')
      return {
        success: false,
        recordsProcessed,
        errors,
        metadata: {},
        syncStarted: syncStart,
        syncCompleted: new Date()
      }
    }
  }

  async getEventSegmentation(params?: unknown): Promise<unknown[]> {
    const start = params?.start || '30DayAgo'
    const end = params?.end || 'today'

    const response = await fetch(`${this.baseUrl}/events/segmentation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        api_key: this.apiKey,
        start,
        end,
        e: { event_type: params?.eventType || 'session_start' },
        m: 'count',
        group_by: params?.groupBy || ['date']
      })
    })

    if (!response.ok) {
      throw new Error(`Amplitude API error: ${response.status}`)
    }

    const data = await response.json()
    return data.data?.series || []
  }

  async getUserActivity(params?: unknown): Promise<unknown[]> {
    const start = params?.start || '30DayAgo'
    const end = params?.end || 'today'

    const response = await fetch(`${this.baseUrl}/users/activity`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        api_key: this.apiKey,
        start,
        end,
        m: 'active',
        group_by: ['date']
      })
    })

    if (!response.ok) {
      throw new Error(`Amplitude API error: ${response.status}`)
    }

    const data = await response.json()
    return data.data?.series || []
  }

  async getRevenueMetrics(params?: unknown): Promise<unknown[]> {
    const start = params?.start || '30DayAgo'
    const end = params?.end || 'today'

    const response = await fetch(`${this.baseUrl}/events/segmentation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        api_key: this.apiKey,
        start,
        end,
        e: { event_type: 'revenue' },
        m: 'sum',
        group_by: ['date']
      })
    })

    if (!response.ok) {
      throw new Error(`Amplitude API error: ${response.status}`)
    }

    const data = await response.json()
    return data.data?.series || []
  }
}

// Register analytics integrations
import { integrationManager } from '../manager'

export function registerAnalyticsIntegrations(): void {
  integrationManager.registerAPIClient('google-analytics', new GoogleAnalyticsClient())
  integrationManager.registerAPIClient('mixpanel', new MixpanelClient())
  integrationManager.registerAPIClient('amplitude', new AmplitudeClient())
}
