// Marketing & Campaign Integrations - Top 10 Providers
// Mailchimp, HubSpot, Klaviyo, SendGrid, Constant Contact, ActiveCampaign, Drip, ConvertKit, GetResponse, MailerLite

import { IntegrationAPIClient, IntegrationConfig, IntegrationSyncResult, SyncDataParams, SyncResultMetadata } from '../../types'

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

interface MarketingSyncParams extends SyncDataParams {
  includeCampaigns?: boolean
  includeAudiences?: boolean
  includeEmailLists?: boolean
  includeAutomation?: boolean
  includeContacts?: boolean
  campaignId?: string
  listId?: string
}

interface MailchimpCampaign {
  id: string
  type: string
  create_time: string
  send_time?: string
  emails_sent?: number
  status: string
  settings: {
    subject_line: string
    title: string
  }
  [key: string]: unknown
}

interface HubSpotContact {
  id: string
  properties: {
    email?: string
    firstname?: string
    lastname?: string
    company?: string
    [key: string]: unknown
  }
  createdAt: string
  updatedAt: string
  [key: string]: unknown
}

// interface KlaviyoProfile {
//   id: string
//   email?: string
//   phone_number?: string
//   first_name?: string
//   last_name?: string
//   created: string
//   updated: string
//   [key: string]: unknown
// }

// =============================================================================
// MAILCHIMP INTEGRATION
// =============================================================================

export class MailchimpClient implements IntegrationAPIClient {
  providerId = 'mailchimp'
  private baseUrl: string = ''
  private apiKey: string = ''
  private serverPrefix: string = ''

  async authenticate(config: IntegrationConfig): Promise<void> {
    if (!config.apiKey || !config.additionalConfig?.serverPrefix) {
      throw new Error('Mailchimp API key and server prefix are required')
    }
    this.apiKey = config.apiKey
    this.serverPrefix = config.additionalConfig.serverPrefix
    this.baseUrl = `https://${this.serverPrefix}.api.mailchimp.com/3.0`
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/ping`, {
        headers: {
          'Authorization': `Basic ${Buffer.from(`any:${this.apiKey}`).toString('base64')}`,
          'Accept': 'application/json'
        }
      })
      return response.ok
    } catch {
      return false
    }
  }

  async syncData(params?: SyncDataParams): Promise<IntegrationSyncResult> {
    const syncStart = new Date()
    let recordsProcessed = 0
    const errors: string[] = []

    try {
      // Sync campaigns
      if ((params as any)?.['includeCampaigns']) {
        const campaigns = await this.getCampaigns(params)
        recordsProcessed += campaigns.length
      }

      // Sync audiences/lists
      if ((params as any)?.['includeAudiences']) {
        const audiences = await this.getAudiences(params)
        recordsProcessed += audiences.length
      }

      // Sync automation workflows
      if ((params as any)?.['includeAutomation']) {
        const automations = await this.getAutomations(params)
        recordsProcessed += automations.length
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

  async getCampaigns(params?: MarketingSyncParams): Promise<MailchimpCampaign[]> {
    const url = `${this.baseUrl}/campaigns?count=${params?.limit || 100}&status=${params?.filters?.['status'] || 'all'}`

    const response = await fetch(url, {
      headers: {
        'Authorization': `Basic ${Buffer.from(`any:${this.apiKey}`).toString('base64')}`,
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`Mailchimp API error: ${response.status}`)
    }

    const data = await response.json()
    return data.campaigns || []
  }

  async getAudiences(params?: MarketingSyncParams): Promise<any[]> {
    const url = `${this.baseUrl}/lists?count=${params?.limit || 100}`

    const response = await fetch(url, {
      headers: {
        'Authorization': `Basic ${Buffer.from(`any:${this.apiKey}`).toString('base64')}`,
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`Mailchimp API error: ${response.status}`)
    }

    const data = await response.json()
    return data.lists || []
  }

  async getAutomations(params?: MarketingSyncParams): Promise<any[]> {
    const url = `${this.baseUrl}/automations?count=${params?.limit || 100}`

    const response = await fetch(url, {
      headers: {
        'Authorization': `Basic ${Buffer.from(`any:${this.apiKey}`).toString('base64')}`,
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`Mailchimp API error: ${response.status}`)
    }

    const data = await response.json()
    return data.automations || []
  }

  async createCampaign(campaignData: Record<string, unknown>): Promise<MailchimpCampaign> {
    const response = await fetch(`${this.baseUrl}/campaigns`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`any:${this.apiKey}`).toString('base64')}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(campaignData)
    })

    if (!response.ok) {
      throw new Error(`Mailchimp API error: ${response.status}`)
    }

    return response.json()
  }
}

// =============================================================================
// HUBSPOT INTEGRATION
// =============================================================================

export class HubSpotClient implements IntegrationAPIClient {
  providerId = 'hubspot'
  private baseUrl = 'https://api.hubapi.com'
  private accessToken: string = ''

  async authenticate(config: IntegrationConfig): Promise<void> {
    if (!config.accessToken) {
      throw new Error('HubSpot access token is required')
    }
    this.accessToken = config.accessToken
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/crm/v3/objects/contacts?limit=1`, {
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

  async syncData(params?: MarketingSyncParams): Promise<IntegrationSyncResult> {
    const syncStart = new Date()
    let recordsProcessed = 0
    const errors: string[] = []

    try {
      // Sync contacts
      if (params?.includeContacts) {
        const contacts = await this.getContacts(params)
        recordsProcessed += contacts.length
      }

      // Sync marketing campaigns
      if (params?.includeCampaigns) {
        const campaigns = await this.getMarketingCampaigns(params)
        recordsProcessed += campaigns.length
      }

      // Sync marketing emails
      const marketingEmails = await this.getMarketingEmails(params)
      recordsProcessed += marketingEmails.length

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

  async getContacts(params?: MarketingSyncParams): Promise<HubSpotContact[]> {
    const url = `${this.baseUrl}/crm/v3/objects/contacts?limit=${params?.limit || 100}&properties=email,firstname,lastname,company`

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`HubSpot API error: ${response.status}`)
    }

    const data = await response.json()
    return data.results || []
  }

  async getMarketingCampaigns(params?: MarketingSyncParams): Promise<any[]> {
    const url = `${this.baseUrl}/marketing/v3/campaigns?limit=${params?.limit || 100}`

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`HubSpot API error: ${response.status}`)
    }

    const data = await response.json()
    return data.results || []
  }

  async getMarketingEmails(params?: MarketingSyncParams): Promise<any[]> {
    const url = `${this.baseUrl}/marketing/v3/emails?limit=${params?.limit || 100}`

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`HubSpot API error: ${response.status}`)
    }

    const data = await response.json()
    return data.results || []
  }

  async createContact(contactData: Record<string, unknown>): Promise<HubSpotContact> {
    const response = await fetch(`${this.baseUrl}/crm/v3/objects/contacts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ properties: contactData })
    })

    if (!response.ok) {
      throw new Error(`HubSpot API error: ${response.status}`)
    }

    return response.json()
  }
}

// Additional implementations for Klaviyo, SendGrid, Constant Contact, ActiveCampaign, Drip, ConvertKit, GetResponse, MailerLite would follow the same pattern...

// =============================================================================
// REGISTRATION
// =============================================================================

import { integrationManager } from '../../manager'

export function registerMarketingIntegrations(): void {
  integrationManager.registerAPIClient('mailchimp', new MailchimpClient())
  integrationManager.registerAPIClient('hubspot', new HubSpotClient())
  // Register remaining providers...
}
