// Security & Access Integrations - Top 10 Providers
// Okta, Auth0, OneLogin, Azure AD, AWS IAM, Ping Identity, Duo Security, LastPass, Bitwarden, Keeper

import { IntegrationAPIClient, IntegrationConfig, IntegrationSyncResult, SyncDataParams, SyncResultMetadata } from '../../types'

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

interface SecuritySyncParams extends SyncDataParams {
  includeUsers?: boolean
  includeGroups?: boolean
  includePolicies?: boolean
  includeMFA?: boolean
  includeSSO?: boolean
  includeProvisioning?: boolean
  userId?: string
  groupName?: string
}

interface OktaUser {
  id: string
  status: string
  created: string
  activated: string
  lastLogin?: string
  profile: {
    login: string
    email: string
    firstName: string
    lastName: string
  }
  [key: string]: unknown
}

interface Auth0User {
  user_id: string
  email: string
  email_verified: boolean
  name: string
  given_name?: string
  family_name?: string
  created_at: string
  updated_at: string
  last_login?: string
  [key: string]: unknown
}

// interface AzureADUser {
//   id: string
//   displayName: string
//   mail?: string
//   userPrincipalName: string
//   createdDateTime: string
//   lastPasswordChangeDateTime?: string
//   [key: string]: unknown
// }

// =============================================================================
// OKTA INTEGRATION
// =============================================================================

export class OktaClient implements IntegrationAPIClient {
  providerId = 'okta'
  private baseUrl: string = ''
  private apiToken: string = ''

  async authenticate(config: IntegrationConfig): Promise<void> {
    if (!config.baseUrl || !config.apiKey) {
      throw new Error('Okta domain and API token are required')
    }
    this.baseUrl = config.baseUrl.replace(/\/$/, '')
    this.apiToken = config.apiKey
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/users/me`, {
        headers: {
          'Authorization': `SSWS ${this.apiToken}`,
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
      // Sync users
      if ((params as any)?.['includeUsers']) {
        const users = await this.getUsers(params)
        recordsProcessed += users.length
      }

      // Sync groups
      if ((params as any)?.['includeGroups']) {
        const groups = await this.getGroups(params)
        recordsProcessed += groups.length
      }

      // Sync applications
      const apps = await this.getApplications(params)
      recordsProcessed += apps.length

      // Sync policies if requested
      if ((params as any)?.['includePolicies']) {
        const policies = await this.getPolicies(params)
        recordsProcessed += policies.length
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

  async getUsers(params?: SecuritySyncParams): Promise<OktaUser[]> {
    const url = `${this.baseUrl}/api/v1/users?limit=${params?.limit || 200}`

    const response = await fetch(url, {
      headers: {
        'Authorization': `SSWS ${this.apiToken}`,
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`Okta API error: ${response.status}`)
    }

    return response.json()
  }

  async getGroups(params?: SecuritySyncParams): Promise<any[]> {
    const url = `${this.baseUrl}/api/v1/groups?limit=${params?.limit || 200}`

    const response = await fetch(url, {
      headers: {
        'Authorization': `SSWS ${this.apiToken}`,
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`Okta API error: ${response.status}`)
    }

    return response.json()
  }

  async getApplications(params?: SecuritySyncParams): Promise<any[]> {
    const url = `${this.baseUrl}/api/v1/apps?limit=${params?.limit || 200}`

    const response = await fetch(url, {
      headers: {
        'Authorization': `SSWS ${this.apiToken}`,
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`Okta API error: ${response.status}`)
    }

    return response.json()
  }

  async getPolicies(params?: SecuritySyncParams): Promise<any[]> {
    const url = `${this.baseUrl}/api/v1/policies?type=${params?.filters?.['policyType'] || 'ACCESS_POLICY'}&limit=${params?.limit || 200}`

    const response = await fetch(url, {
      headers: {
        'Authorization': `SSWS ${this.apiToken}`,
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`Okta API error: ${response.status}`)
    }

    return response.json()
  }

  async createUser(userData: Record<string, unknown>): Promise<OktaUser> {
    const response = await fetch(`${this.baseUrl}/api/v1/users`, {
      method: 'POST',
      headers: {
        'Authorization': `SSWS ${this.apiToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        profile: userData
      })
    })

    if (!response.ok) {
      throw new Error(`Okta API error: ${response.status}`)
    }

    return response.json()
  }
}

// =============================================================================
// AUTH0 INTEGRATION
// =============================================================================

export class Auth0Client implements IntegrationAPIClient {
  providerId = 'auth0'
  private baseUrl: string = ''
  private clientId: string = ''
  private clientSecret: string = ''

  async authenticate(config: IntegrationConfig): Promise<void> {
    if (!config.baseUrl || !config.additionalConfig?.['clientId'] || !config.additionalConfig?.['clientSecret']) {
      throw new Error('Auth0 domain, client ID, and client secret are required')
    }
    this.baseUrl = config.baseUrl.replace(/\/$/, '')
    this.clientId = config.additionalConfig['clientId'] as string
    this.clientSecret = config.additionalConfig['clientSecret'] as string
  }

  async testConnection(): Promise<boolean> {
    try {
      // Get access token first
      const tokenResponse = await fetch(`${this.baseUrl}/oauth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          grant_type: 'client_credentials',
          client_id: this.clientId,
          client_secret: this.clientSecret,
          audience: `${this.baseUrl}/api/v2/`
        })
      })

      if (!tokenResponse.ok) return false

      const tokenData = await tokenResponse.json()
      const accessToken = tokenData.access_token

      // Test with users endpoint
      const response = await fetch(`${this.baseUrl}/api/v2/users?per_page=1`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
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
      // Sync users
      if ((params as any)?.['includeUsers']) {
        const users = await this.getUsers(params)
        recordsProcessed += users.length
      }

      // Sync connections
      const connections = await this.getConnections(params)
      recordsProcessed += connections.length

      // Sync clients/applications
      const clients = await this.getClients(params)
      recordsProcessed += clients.length

      // Sync rules if requested
      if ((params as any)?.['includePolicies']) {
        const rules = await this.getRules(params)
        recordsProcessed += rules.length
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

  async getUsers(params?: SyncDataParams): Promise<Auth0User[]> {
    const accessToken = await this.getAccessToken()
    const url = `${this.baseUrl}/api/v2/users?per_page=${(params as any)?.['limit'] || 50}`

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`Auth0 API error: ${response.status}`)
    }

    return response.json()
  }

  async getConnections(params?: SyncDataParams): Promise<any[]> {
    const accessToken = await this.getAccessToken()
    const url = `${this.baseUrl}/api/v2/connections?per_page=${(params as any)?.['limit'] || 50}`

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`Auth0 API error: ${response.status}`)
    }

    return response.json()
  }

  async getClients(params?: SyncDataParams): Promise<any[]> {
    const accessToken = await this.getAccessToken()
    const url = `${this.baseUrl}/api/v2/clients?per_page=${(params as any)?.['limit'] || 50}`

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`Auth0 API error: ${response.status}`)
    }

    return response.json()
  }

  async getRules(params?: SyncDataParams): Promise<any[]> {
    const accessToken = await this.getAccessToken()
    const url = `${this.baseUrl}/api/v2/rules?per_page=${(params as any)?.['limit'] || 50}`

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`Auth0 API error: ${response.status}`)
    }

    return response.json()
  }

  async createUser(userData: Record<string, unknown>): Promise<Auth0User> {
    const accessToken = await this.getAccessToken()

    const response = await fetch(`${this.baseUrl}/api/v2/users`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(userData)
    })

    if (!response.ok) {
      throw new Error(`Auth0 API error: ${response.status}`)
    }

    return response.json()
  }

  private async getAccessToken(): Promise<string> {
    const response = await fetch(`${this.baseUrl}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        grant_type: 'client_credentials',
        client_id: this.clientId,
        client_secret: this.clientSecret,
        audience: `${this.baseUrl}/api/v2/`
      })
    })

    if (!response.ok) {
      throw new Error(`Auth0 token error: ${response.status}`)
    }

    const data = await response.json()
    return data.access_token
  }
}

// Additional implementations for OneLogin, Azure AD, AWS IAM, Ping Identity, Duo Security, LastPass, Bitwarden, Keeper would follow the same pattern...

// =============================================================================
// REGISTRATION
// =============================================================================

import { integrationManager } from '../../manager'

export function registerSecurityIntegrations(): void {
  integrationManager.registerAPIClient('okta', new OktaClient())
  integrationManager.registerAPIClient('auth0', new Auth0Client())
  // Register remaining providers...
}
