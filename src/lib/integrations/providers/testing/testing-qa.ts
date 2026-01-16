
// Testing & QA Integrations - BrowserStack, Cypress, Percy

import { IntegrationAPIClient, IntegrationConfig, IntegrationSyncResult } from '../types'
import { AuthProviderId, getProviderBaseUrl } from '../../constants/integration-providers'

interface Build {
  hashed_id: string
  name?: string
  status?: string
  duration?: number
  created_at?: string
  updated_at?: string
  automation_project?: {
    name?: string
    id?: string
  }
  sessions?: Array<{
    id?: string
    status?: string
    os?: string
    browser?: string
  }>
}

const resolveBaseUrl = (providerId: AuthProviderId, override?: string): string =>
  getProviderBaseUrl(providerId, override)

export class BrowserStackClient implements IntegrationAPIClient {
  providerId = 'browserstack'
  private baseUrl = resolveBaseUrl('browserstack')
  private username: string = ''
  private accessKey: string = ''

  async authenticate(config: IntegrationConfig): Promise<void> {
    if (!config.additionalConfig?.username || !config.apiKey) {
      throw new Error('BrowserStack username and access key are required')
    }

    this.baseUrl = resolveBaseUrl(this.providerId, config.baseUrl)
    this.username = config.additionalConfig.username
    this.accessKey = config.apiKey
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/automate/plan.json`, {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${this.username}:${this.accessKey}`).toString('base64')}`
        }
      })
      return response.ok
    } catch {
      return false
    }
  }

  async syncData(params?: { includeSessions?: boolean; limit?: number; includeRuns?: boolean; includeBuilds?: boolean }): Promise<IntegrationSyncResult> {
    const syncStart = new Date()
    let recordsProcessed = 0
    const errors: string[] = []

    try {
      // Sync build sessions
      // Branch 1: BrowserStack builds/sessions
      const builds = await this.getBuilds(params)
      const buildList: any[] = Array.isArray(builds) ? builds : []
      recordsProcessed += buildList.length

      // Sync sessions if specified
      if (params?.includeSessions) {
        for (const build of buildList.slice(0, 5)) {
          try {
            const sessions = await this.getBuildSessions(String((build as any).hashed_id))
            recordsProcessed += sessions.length
          } catch (error) {
            errors.push(`Failed to sync sessions for build ${String((build as any).hashed_id)}: ${error}`)
          }
        }
      }

      return {
        success: true,
        recordsProcessed,
        errors,
        metadata: {
          buildsCount: buildList.length,
          projectsCount: 0
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

  async getBuilds(params?: { limit?: number }): Promise<unknown[]> {
    const limit = typeof params?.limit === 'number' ? params.limit : 20
    const url = `${this.baseUrl}/automate/builds.json?limit=${limit}`

    const response = await fetch(url, {
      headers: {
        'Authorization': `Basic ${Buffer.from(`${this.username}:${this.accessKey}`).toString('base64')}`
      }
    })

    if (!response.ok) {
      throw new Error(`BrowserStack API error: ${response.status}`)
    }

    const data = await response.json()
    return data || []
  }

  async getBuildSessions(buildId: string): Promise<unknown[]> {
    const response = await fetch(`${this.baseUrl}/automate/builds/${buildId}/sessions.json`, {
      headers: {
        'Authorization': `Basic ${Buffer.from(`${this.username}:${this.accessKey}`).toString('base64')}`
      }
    })

    if (!response.ok) {
      throw new Error(`BrowserStack API error: ${response.status}`)
    }

    const data = await response.json()
    return data || []
  }

  async startBrowserTest(testConfig: Record<string, unknown>): Promise<unknown> {
    const response = await fetch(`${this.baseUrl}/automate/tests`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${this.username}:${this.accessKey}`).toString('base64')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testConfig)
    })

    if (!response.ok) {
      throw new Error(`BrowserStack API error: ${response.status}`)
    }

    return response.json()
  }
}

// Cypress Dashboard Integration Implementation
export class CypressClient implements IntegrationAPIClient {
  providerId = 'cypress'
  private baseUrl = resolveBaseUrl('cypress')
  private apiKey: string = ''

  async authenticate(config: IntegrationConfig): Promise<void> {
    if (!config.apiKey) {
      throw new Error('Cypress API key is required')
    }
    this.baseUrl = resolveBaseUrl(this.providerId, config.baseUrl)
    this.apiKey = config.apiKey
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/projects`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      })
      return response.ok
    } catch {
      return false
    }
  }

  async syncData(params?: { includeRuns?: boolean }): Promise<IntegrationSyncResult> {
    const syncStart = new Date()
    let recordsProcessed = 0
    const errors: string[] = []

    try {
      // Sync projects
      const projects = await this.getProjects()
      const projectList: Array<{ id?: unknown }> = Array.isArray(projects) ? (projects as Array<{ id?: unknown }>) : []
      recordsProcessed += projectList.length

      // Sync runs for each project if specified
      if (params?.includeRuns) {
        for (const project of projectList.slice(0, 5)) {
          try {
            const runs = await this.getProjectRuns(String(project?.id ?? ''))
            recordsProcessed += runs.length
          } catch (error) {
            errors.push(`Failed to sync runs for project ${String(project?.id ?? '')}: ${error}`)
          }
        }
      }

      return {
        success: true,
        recordsProcessed,
        errors,
        metadata: {
          projectsCount: projectList.length
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

  async getProjects(): Promise<unknown[]> {
    const response = await fetch(`${this.baseUrl}/projects`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`
      }
    })

    if (!response.ok) {
      throw new Error(`Cypress API error: ${response.status}`)
    }

    const data = await response.json()
    return data || []
  }

  async getProjectRuns(projectId: string): Promise<unknown[]> {
    const response = await fetch(`${this.baseUrl}/projects/${projectId}/runs`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`
      }
    })

    if (!response.ok) {
      throw new Error(`Cypress API error: ${response.status}`)
    }

    const data = await response.json()
    return data || []
  }

  async triggerTestRun(projectId: string, config?: Record<string, unknown>): Promise<unknown> {
    const response = await fetch(`${this.baseUrl}/projects/${projectId}/runs`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(config || {})
    })

    if (!response.ok) {
      throw new Error(`Cypress API error: ${response.status}`)
    }

    return response.json()
  }
}

// Percy Visual Testing Integration Implementation
export class PercyClient implements IntegrationAPIClient {
  providerId = 'percy'
  private baseUrl = resolveBaseUrl('percy')
  private token: string = ''

  async authenticate(config: IntegrationConfig): Promise<void> {
    if (!config.apiKey) {
      throw new Error('Percy API token is required')
    }
    this.baseUrl = resolveBaseUrl(this.providerId, config.baseUrl)
    this.token = config.apiKey
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/projects`, {
        headers: {
          'Authorization': `Token ${this.token}`
        }
      })
      return response.ok
    } catch {
      return false
    }
  }

  async syncData(params?: { includeBuilds?: boolean }): Promise<IntegrationSyncResult> {
    const syncStart = new Date()
    let recordsProcessed = 0
    const errors: string[] = []

    try {
      // Sync projects
      const projects = await this.getProjects()
      const projectList: Array<{ id?: unknown }> = Array.isArray(projects) ? (projects as Array<{ id?: unknown }>) : []
      recordsProcessed += projectList.length

      // Sync builds for each project if specified
      if (params?.includeBuilds) {
        for (const project of projectList.slice(0, 5)) {
          try {
            const builds = await this.getProjectBuilds(String(project?.id ?? ''))
            recordsProcessed += builds.length
          } catch (error) {
            errors.push(`Failed to sync builds for project ${String(project?.id ?? '')}: ${error}`)
          }
        }
      }

      return {
        success: true,
        recordsProcessed,
        errors,
        metadata: {
          projectsCount: projectList.length
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

  async getProjects(): Promise<unknown[]> {
    const response = await fetch(`${this.baseUrl}/projects`, {
      headers: {
        'Authorization': `Token ${this.token}`
      }
    })

    if (!response.ok) {
      throw new Error(`Percy API error: ${response.status}`)
    }

    const data = await response.json()
    return data || []
  }

  async getProjectBuilds(projectId: string): Promise<unknown[]> {
    const response = await fetch(`${this.baseUrl}/projects/${projectId}/builds`, {
      headers: {
        'Authorization': `Token ${this.token}`
      }
    })

    if (!response.ok) {
      throw new Error(`Percy API error: ${response.status}`)
    }

    const data = await response.json()
    return data || []
  }

  async createBuildSnapshot(projectId: string, snapshotData: Record<string, unknown>): Promise<unknown> {
    const response = await fetch(`${this.baseUrl}/projects/${projectId}/builds`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${this.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(snapshotData)
    })

    if (!response.ok) {
      throw new Error(`Percy API error: ${response.status}`)
    }

    return response.json()
  }

  async finalizeBuild(buildId: string): Promise<unknown> {
    const response = await fetch(`${this.baseUrl}/builds/${buildId}/finalize`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${this.token}`
      }
    })

    if (!response.ok) {
      throw new Error(`Percy API error: ${response.status}`)
    }

    return response.json()
  }
}

// Register testing integrations
import { integrationManager } from '../manager'

export function registerTestingIntegrations(): void {
  integrationManager.registerAPIClient('browserstack', new BrowserStackClient())
  integrationManager.registerAPIClient('cypress', new CypressClient())
  integrationManager.registerAPIClient('percy', new PercyClient())
}
