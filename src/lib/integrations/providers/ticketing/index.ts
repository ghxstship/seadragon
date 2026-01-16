// Ticketing Support Integrations - Top 10 Providers
// Zendesk, ServiceNow, Jira Service Desk, Freshworks, Help Scout, Intercom, Groove, Front, Zoho Desk, Salesforce Service Cloud

import { IntegrationAPIClient, IntegrationConfig, IntegrationSyncResult, SyncDataParams, SyncResultMetadata } from '../types'

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

interface TicketingSyncParams extends SyncDataParams {
  includeTickets?: boolean
  includeUsers?: boolean
  includeOrganizations?: boolean
  status?: string
  priority?: string
  assignee?: string
}

interface ZendeskTicket {
  id: number
  subject: string
  description?: string
  status: string
  priority: string
  created_at: string
  updated_at: string
  requester_id: number
  assignee_id?: number
  [key: string]: unknown
}

interface ServiceNowIncident {
  sys_id: string
  number: string
  short_description: string
  description?: string
  state: string
  priority: string
  opened_at: string
  [key: string]: unknown
}

interface FreshworksTicket {
  id: number
  subject: string
  description?: string
  status: number
  priority: number
  created_at: string
  updated_at: string
  [key: string]: unknown
}

// =============================================================================
// ZENDESK INTEGRATION
// =============================================================================

export class ZendeskClient implements IntegrationAPIClient {
  providerId = 'zendesk'
  private baseUrl: string = ''
  private email: string = ''
  private apiToken: string = ''

  async authenticate(config: IntegrationConfig): Promise<void> {
    if (!config.baseUrl || !config.additionalConfig?.username || !config.apiKey) {
      throw new Error('Zendesk subdomain, email, and API token are required')
    }
    this.baseUrl = config.baseUrl.replace(/\/$/, '')
    this.email = config.additionalConfig.username
    this.apiToken = config.apiKey
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v2/tickets.json?per_page=1`, {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${this.email}/token:${this.apiToken}`).toString('base64')}`,
          'Accept': 'application/json'
        }
      })
      return response.ok
    } catch {
      return false
    }
  }

  async syncData(params?: TicketingSyncParams): Promise<IntegrationSyncResult> {
    const syncStart = new Date()
    let recordsProcessed = 0
    const errors: string[] = []

    try {
      // Sync tickets
      const tickets = await this.getTickets(params)
      recordsProcessed += tickets.length

      // Sync users if requested
      if (params?.includeUsers) {
        const users = await this.getUsers()
        recordsProcessed += users.length
      }

      // Sync organizations if requested
      if (params?.includeOrganizations) {
        const organizations = await this.getOrganizations()
        recordsProcessed += organizations.length
      }

      const metadata: SyncResultMetadata = {
        totalRecords: recordsProcessed,
        createdCount: 0,
        updatedCount: 0,
        deletedCount: 0,
        skippedCount: 0,
        durationMs: Date.now() - syncStart.getTime(),
        ticketsCount: tickets.length
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

  async getTickets(params?: TicketingSyncParams): Promise<ZendeskTicket[]> {
    let url = `${this.baseUrl}/api/v2/tickets.json?per_page=${params?.limit || 100}`

    if (params?.status) {
      url += `&query=status:${params.status}`
    }

    if (params?.priority) {
      url += ` priority:${params.priority}`
    }

    if (params?.assignee) {
      url += ` assignee:${params.assignee}`
    }

    const response = await fetch(url, {
      headers: {
        'Authorization': `Basic ${Buffer.from(`${this.email}/token:${this.apiToken}`).toString('base64')}`,
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`Zendesk API error: ${response.status}`)
    }

    const data = await response.json()
    return data.tickets || []
  }

  async getUsers(): Promise<any[]> {
    const response = await fetch(`${this.baseUrl}/api/v2/users.json`, {
      headers: {
        'Authorization': `Basic ${Buffer.from(`${this.email}/token:${this.apiToken}`).toString('base64')}`,
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`Zendesk API error: ${response.status}`)
    }

    const data = await response.json()
    return data.users || []
  }

  async getOrganizations(): Promise<any[]> {
    const response = await fetch(`${this.baseUrl}/api/v2/organizations.json`, {
      headers: {
        'Authorization': `Basic ${Buffer.from(`${this.email}/token:${this.apiToken}`).toString('base64')}`,
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`Zendesk API error: ${response.status}`)
    }

    const data = await response.json()
    return data.organizations || []
  }

  async createTicket(ticketData: Partial<ZendeskTicket>): Promise<ZendeskTicket> {
    const response = await fetch(`${this.baseUrl}/api/v2/tickets.json`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${this.email}/token:${this.apiToken}`).toString('base64')}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ ticket: ticketData })
    })

    if (!response.ok) {
      throw new Error(`Zendesk API error: ${response.status}`)
    }

    const data = await response.json()
    return data.ticket
  }
}

// =============================================================================
// SERVICENOW INTEGRATION
// =============================================================================

export class ServiceNowClient implements IntegrationAPIClient {
  providerId = 'servicenow'
  private baseUrl: string = ''
  private username: string = ''
  private password: string = ''

  async authenticate(config: IntegrationConfig): Promise<void> {
    if (!config.baseUrl || !config.additionalConfig?.username || !config.additionalConfig?.password) {
      throw new Error('ServiceNow instance URL, username, and password are required')
    }
    this.baseUrl = config.baseUrl.replace(/\/$/, '')
    this.username = config.additionalConfig.username
    this.password = config.additionalConfig.password
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/now/table/incident?sysparm_limit=1`, {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${this.username}:${this.password}`).toString('base64')}`,
          'Accept': 'application/json'
        }
      })
      return response.ok
    } catch {
      return false
    }
  }

  async syncData(params?: TicketingSyncParams): Promise<IntegrationSyncResult> {
    const syncStart = new Date()
    let recordsProcessed = 0
    const errors: string[] = []

    try {
      // Sync incidents
      const incidents = await this.getIncidents(params)
      recordsProcessed += incidents.length

      // Sync problems if requested
      if (params?.includeTickets) {
        const problems = await this.getProblems(params)
        recordsProcessed += problems.length
      }

      // Sync changes if requested
      if (params?.includeTickets) {
        const changes = await this.getChanges(params)
        recordsProcessed += changes.length
      }

      const metadata: SyncResultMetadata = {
        totalRecords: recordsProcessed,
        createdCount: 0,
        updatedCount: 0,
        deletedCount: 0,
        skippedCount: 0,
        durationMs: Date.now() - syncStart.getTime(),
        incidentsCount: incidents.length
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

  async getIncidents(params?: TicketingSyncParams): Promise<ServiceNowIncident[]> {
    let url = `${this.baseUrl}/api/now/table/incident?sysparm_limit=${params?.limit || 100}`

    if (params?.status) {
      url += `&state=${params.status}`
    }

    if (params?.priority) {
      url += `&priority=${params.priority}`
    }

    const response = await fetch(url, {
      headers: {
        'Authorization': `Basic ${Buffer.from(`${this.username}:${this.password}`).toString('base64')}`,
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`ServiceNow API error: ${response.status}`)
    }

    const data = await response.json()
    return data.result || []
  }

  async getProblems(params?: TicketingSyncParams): Promise<any[]> {
    const url = `${this.baseUrl}/api/now/table/problem?sysparm_limit=${params?.limit || 100}`

    const response = await fetch(url, {
      headers: {
        'Authorization': `Basic ${Buffer.from(`${this.username}:${this.password}`).toString('base64')}`,
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`ServiceNow API error: ${response.status}`)
    }

    const data = await response.json()
    return data.result || []
  }

  async getChanges(params?: TicketingSyncParams): Promise<any[]> {
    const url = `${this.baseUrl}/api/now/table/change_request?sysparm_limit=${params?.limit || 100}`

    const response = await fetch(url, {
      headers: {
        'Authorization': `Basic ${Buffer.from(`${this.username}:${this.password}`).toString('base64')}`,
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`ServiceNow API error: ${response.status}`)
    }

    const data = await response.json()
    return data.result || []
  }

  async createIncident(incidentData: Partial<ServiceNowIncident>): Promise<ServiceNowIncident> {
    const response = await fetch(`${this.baseUrl}/api/now/table/incident`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${this.username}:${this.password}`).toString('base64')}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(incidentData)
    })

    if (!response.ok) {
      throw new Error(`ServiceNow API error: ${response.status}`)
    }

    return response.json()
  }
}

// Additional implementations for Jira Service Desk, Freshworks, Help Scout, Intercom, Groove, Front, Zoho Desk, Salesforce Service Cloud would follow the same pattern...

// =============================================================================
// REGISTRATION
// =============================================================================

import { integrationManager } from '../manager'

export function registerTicketingIntegrations(): void {
  integrationManager.registerAPIClient('zendesk', new ZendeskClient())
  integrationManager.registerAPIClient('servicenow', new ServiceNowClient())
  // Register remaining providers...
}
