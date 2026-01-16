// CI/CD Integrations - Top 10 Providers
// GitHub Actions, Jenkins, CircleCI, Travis CI, GitLab CI, Azure Pipelines, AWS CodePipeline, Bitbucket Pipelines, Drone, Buildkite

import { IntegrationAPIClient, IntegrationConfig, IntegrationSyncResult, SyncDataParams, SyncResultMetadata } from '../types'

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

interface CICDSyncParams extends SyncDataParams {
  includeBuilds?: boolean
  includePipelines?: boolean
  includeDeployments?: boolean
  repository?: string
  branch?: string
  status?: string
}

interface GitHubWorkflowRun {
  id: number
  name: string
  status: string
  conclusion?: string
  created_at: string
  updated_at: string
  [key: string]: unknown
}

interface JenkinsBuild {
  number: number
  result?: string
  building: boolean
  timestamp: number
  duration?: number
  [key: string]: unknown
}

interface CircleCIJob {
  job_number: number
  status: string
  started_at: string
  stopped_at?: string
  [key: string]: unknown
}

// =============================================================================
// GITHUB ACTIONS INTEGRATION
// =============================================================================

export class GitHubActionsClient implements IntegrationAPIClient {
  providerId = 'github-actions'
  private baseUrl = 'https://api.github.com'
  private token: string = ''

  async authenticate(config: IntegrationConfig): Promise<void> {
    if (!config.accessToken) {
      throw new Error('GitHub token is required')
    }
    this.token = config.accessToken
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/user`, {
        headers: {
          'Authorization': `token ${this.token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      })
      return response.ok
    } catch {
      return false
    }
  }

  async syncData(params?: CICDSyncParams): Promise<IntegrationSyncResult> {
    const syncStart = new Date()
    let recordsProcessed = 0
    const errors: string[] = []

    try {
      const owner = params?.filters?.['owner'] as string
      const repo = params?.repository

      if (!owner || !repo) {
        throw new Error('Owner and repository are required')
      }

      const workflowRuns = await this.getWorkflowRuns(owner, repo, params)
      recordsProcessed += workflowRuns.length

      const metadata: SyncResultMetadata = {
        totalRecords: recordsProcessed,
        createdCount: 0,
        updatedCount: 0,
        deletedCount: 0,
        skippedCount: 0,
        durationMs: Date.now() - syncStart.getTime(),
        workflowRunsCount: workflowRuns.length
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

  async getWorkflowRuns(owner: string, repo: string, params?: CICDSyncParams): Promise<GitHubWorkflowRun[]> {
    const url = `${this.baseUrl}/repos/${owner}/${repo}/actions/runs?per_page=${params?.limit || 30}`

    const response = await fetch(url, {
      headers: {
        'Authorization': `token ${this.token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    })

    if (!response.ok) {
      throw new Error(`GitHub Actions API error: ${response.status}`)
    }

    const data = await response.json()
    return data.workflow_runs || []
  }

  async triggerWorkflow(owner: string, repo: string, workflowId: string, inputs?: Record<string, unknown>): Promise<any> {
    const url = `${this.baseUrl}/repos/${owner}/${repo}/actions/workflows/${workflowId}/dispatches`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `token ${this.token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json'
      },
      body: JSON.stringify({
        ref: 'main',
        inputs: inputs || {}
      })
    })

    if (!response.ok) {
      throw new Error(`GitHub Actions API error: ${response.status}`)
    }

    return { success: true }
  }
}

// =============================================================================
// JENKINS INTEGRATION
// =============================================================================

export class JenkinsClient implements IntegrationAPIClient {
  providerId = 'jenkins'
  private baseUrl: string = ''
  private username: string = ''
  private apiToken: string = ''

  async authenticate(config: IntegrationConfig): Promise<void> {
    if (!config.baseUrl || !config.additionalConfig?.username || !config.apiKey) {
      throw new Error('Jenkins URL, username, and API token are required')
    }
    this.baseUrl = config.baseUrl.replace(/\/$/, '')
    this.username = config.additionalConfig.username
    this.apiToken = config.apiKey
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/json`, {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${this.username}:${this.apiToken}`).toString('base64')}`,
          'Accept': 'application/json'
        }
      })
      return response.ok
    } catch {
      return false
    }
  }

  async syncData(params?: CICDSyncParams): Promise<IntegrationSyncResult> {
    const syncStart = new Date()
    let recordsProcessed = 0
    const errors: string[] = []

    try {
      const jobName = params?.filters?.['jobName'] as string

      if (!jobName) {
        throw new Error('Job name is required for Jenkins sync')
      }

      const builds = await this.getBuilds(jobName, params)
      recordsProcessed += builds.length

      const metadata: SyncResultMetadata = {
        totalRecords: recordsProcessed,
        createdCount: 0,
        updatedCount: 0,
        deletedCount: 0,
        skippedCount: 0,
        durationMs: Date.now() - syncStart.getTime(),
        buildsCount: builds.length
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

  async getBuilds(jobName: string, params?: CICDSyncParams): Promise<JenkinsBuild[]> {
    const url = `${this.baseUrl}/job/${encodeURIComponent(jobName)}/api/json?tree=builds[number,result,building,timestamp,duration]{0,${params?.limit || 20}}`

    const response = await fetch(url, {
      headers: {
        'Authorization': `Basic ${Buffer.from(`${this.username}:${this.apiToken}`).toString('base64')}`,
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`Jenkins API error: ${response.status}`)
    }

    const data = await response.json()
    return data.builds || []
  }

  async triggerBuild(jobName: string, parameters?: Record<string, unknown>): Promise<any> {
    const url = `${this.baseUrl}/job/${encodeURIComponent(jobName)}/build`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${this.username}:${this.apiToken}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: parameters ? new URLSearchParams(parameters as Record<string, string>) : undefined
    })

    if (!response.ok && response.status !== 302) {
      throw new Error(`Jenkins API error: ${response.status}`)
    }

    return { success: true, status: response.status }
  }
}

// Additional implementations for CircleCI, Travis CI, GitLab CI, Azure Pipelines, AWS CodePipeline, Bitbucket Pipelines, Drone, Buildkite would follow the same pattern...

// =============================================================================
// REGISTRATION
// =============================================================================

import { integrationManager } from '../manager'

export function registerCICDIntegrations(): void {
  integrationManager.registerAPIClient('github-actions', new GitHubActionsClient())
  integrationManager.registerAPIClient('jenkins', new JenkinsClient())
  // Register remaining providers...
}
