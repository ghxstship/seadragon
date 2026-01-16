
// GitHub Integration Implementation

import { IntegrationAPIClient, IntegrationConfig, IntegrationSyncResult, SyncDataParams } from '../types'
import { logger } from '../../logger'
import { IntegrationUtils } from '../manager'
import { AuthProviderId, getProviderBaseUrl } from '../../constants/integration-providers'

// GitHub API Response Types
interface GitHubRepository {
  id: number
  name: string
  full_name: string
  owner: {
    login: string
    id: number
    avatar_url: string
  }
  private: boolean
  html_url: string
  description: string | null
  fork: boolean
  url: string
  created_at: string
  updated_at: string
  pushed_at: string
  language: string | null
  forks_count: number
  stargazers_count: number
  watchers_count: number
}

interface GitHubIssue {
  id: number
  number: number
  title: string
  user: {
    login: string
    id: number
    avatar_url: string
  }
  state: 'open' | 'closed'
  html_url: string
  body: string | null
  created_at: string
  updated_at: string
  closed_at: string | null
  pull_request?: {
    url: string
    html_url: string
  }
}

interface GitHubWorkflow {
  id: number
  name: string
  path: string
  state: string
  created_at: string
  updated_at: string
}

interface GitHubSyncParams extends SyncDataParams {
  syncIssues?: boolean
  syncWorkflows?: boolean
  repo?: string
}

const resolveBaseUrl = (providerId: AuthProviderId, override?: string): string =>
  getProviderBaseUrl(providerId, override)

export class GitHubClient implements IntegrationAPIClient {
  providerId = 'github'
  private baseUrl = resolveBaseUrl('github')
  private accessToken: string = ''
  private token: string = ''

  async authenticate(config: IntegrationConfig): Promise<void> {
    if (!config.accessToken) {
      throw new Error('GitHub access token is required')
    }
    this.baseUrl = resolveBaseUrl(this.providerId, config.baseUrl)
    this.accessToken = config.accessToken
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

  async syncData(params?: GitHubSyncParams): Promise<IntegrationSyncResult> {
    const syncStart = new Date()
    let recordsProcessed = 0
    const errors: string[] = []

    try {
      // Sync repositories
      const repos = await this.getRepositories()
      recordsProcessed += repos.length

      // Sync issues/PRs if specified
      if (params?.syncIssues !== false) {
        const issues = await this.getIssues(params?.repo)
        recordsProcessed += issues.length
      }

      // Sync workflows if specified
      if (params?.syncWorkflows) {
        const workflows = await this.getWorkflows(params?.repo)
        recordsProcessed += workflows.length
      }

      return {
        success: true,
        recordsProcessed,
        errors,
        metadata: { reposSynced: repos.length },
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

  async getRepositories(): Promise<GitHubRepository[]> {
    const response = await fetch(`${this.baseUrl}/user/repos?per_page=100`, {
      headers: {
        'Authorization': `token ${this.token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    })

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`)
    }

    return response.json()
  }

  async getIssues(repo?: string): Promise<GitHubIssue[]> {
    let repoNames: string[]

    if (repo) {
      // If specific repo provided, use it directly
      repoNames = [repo]
    } else {
      // Otherwise get all repositories and extract names
      const repos = await this.getRepositories()
      repoNames = repos.map(r => r.full_name)
    }

    const allIssues: GitHubIssue[] = []

    for (const repoName of repoNames.slice(0, 5)) { // Limit to first 5 repos
      try {
        const response = await fetch(
          `${this.baseUrl}/repos/${repoName}/issues?state=all&per_page=50`,
          {
            headers: {
              'Authorization': `token ${this.token}`,
              'Accept': 'application/vnd.github.v3+json'
            }
          }
        )

        if (response.ok) {
          const issues = await response.json()
          allIssues.push(...issues)
        }
      } catch (error) {
        logger.warn(`Failed to fetch issues for ${repoName}`, error instanceof Error ? error.message : String(error))
      }
    }

    return allIssues
  }

  async getWorkflows(repo?: string): Promise<GitHubWorkflow[]> {
    if (!repo) return []

    try {
      const response = await fetch(
        `${this.baseUrl}/repos/${repo}/actions/workflows`,
        {
          headers: {
            'Authorization': `token ${this.token}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        }
      )

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`)
      }

      const data = await response.json()
      return data.workflows || []
    } catch (error) {
      logger.warn(`Failed to fetch workflows for ${repo}`, error instanceof Error ? error.message : String(error))
      return []
    }
  }

  async getWebhooks(): Promise<unknown[]> {
    // Get webhooks for user's repositories
    const repos = await this.getRepositories()
    const allWebhooks: unknown[] = []

    for (const repo of repos.slice(0, 3)) { // Limit to first 3 repos
      try {
        const response = await fetch(
          `${this.baseUrl}/repos/${repo.full_name || repo.name}/hooks`,
          {
            headers: {
              'Authorization': `token ${this.token}`,
              'Accept': 'application/vnd.github.v3+json'
            }
          }
        )

        if (response.ok) {
          const webhooks = await response.json()
          allWebhooks.push(...webhooks.map((hook: unknown) => ({ ...hook, repository: repo.full_name })))
        }
      } catch (error) {
        logger.warn(`Failed to fetch webhooks for ${repo.full_name}`, error instanceof Error ? error.message : String(error))
      }
    }

    return allWebhooks
  }

  async createWebhook(config: unknown): Promise<unknown> {
    const { repo, url, events = ['push', 'pull_request'] } = config

    if (!repo || !url) {
      throw new Error('Repository and webhook URL are required')
    }

    const response = await fetch(`${this.baseUrl}/repos/${repo}/hooks`, {
      method: 'POST',
      headers: {
        'Authorization': `token ${this.token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        config: {
          url,
          content_type: 'json',
          secret: IntegrationUtils.generateWebhookSecret()
        },
        events,
        active: true
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Failed to create webhook: ${error.message}`)
    }

    return response.json()
  }

  async deleteWebhook(webhookId: string): Promise<void> {
    // This would need the repo and webhook ID
    // For now, throw an error as this requires more complex logic
    throw new Error('Delete webhook not implemented - requires repo context')
  }
}

// GitLab Integration Implementation
export class GitLabClient implements IntegrationAPIClient {
  providerId = 'gitlab'
  private baseUrl = resolveBaseUrl('gitlab')
  private accessToken: string = ''
  private token: string = ''

  async authenticate(config: IntegrationConfig): Promise<void> {
    if (!config.accessToken) {
      throw new Error('GitLab access token is required')
    }
    this.accessToken = config.accessToken
    this.token = config.accessToken

    if (config.baseUrl) {
      this.baseUrl = resolveBaseUrl(this.providerId, config.baseUrl.replace(/\/$/, '') + '/api/v4')
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/user`, {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      })
      return response.ok
    } catch {
      return false
    }
  }

  async syncData(params?: unknown): Promise<IntegrationSyncResult> {
    const syncStart = new Date()
    let recordsProcessed = 0
    const errors: string[] = []

    try {
      // Sync projects
      const projects = await this.getProjects()
      recordsProcessed += projects.length

      // Sync issues/MRs if specified
      if (params?.syncIssues !== false) {
        const issues = await this.getIssues(params?.projectId)
        recordsProcessed += issues.length
      }

      // Sync pipelines if specified
      if (params?.syncPipelines) {
        const pipelines = await this.getPipelines(params?.projectId)
        recordsProcessed += pipelines.length
      }

      return {
        success: true,
        recordsProcessed,
        errors,
        metadata: { projectsSynced: projects.length },
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
    const response = await fetch(`${this.baseUrl}/projects?owned=true&per_page=50`, {
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    })

    if (!response.ok) {
      throw new Error(`GitLab API error: ${response.status}`)
    }

    return response.json()
  }

  async getIssues(projectId?: number): Promise<unknown[]> {
    if (!projectId) {
      // Get issues from user's projects
      const projects = await this.getProjects()
      const allIssues: unknown[] = []

      for (const project of projects.slice(0, 3)) {
        try {
          const response = await fetch(
            `${this.baseUrl}/projects/${project.id}/issues?per_page=30`,
            {
              headers: {
                'Authorization': `Bearer ${this.token}`
              }
            }
          )

          if (response.ok) {
            const issues = await response.json()
            allIssues.push(...issues)
          }
        } catch (error) {
          logger.warn(`Failed to fetch issues for project ${project.id}`, error instanceof Error ? error.message : String(error))
        }
      }

      return allIssues
    } else {
      const response = await fetch(
        `${this.baseUrl}/projects/${projectId}/issues?per_page=50`,
        {
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        }
      )

      if (!response.ok) {
        throw new Error(`GitLab API error: ${response.status}`)
      }

      return response.json()
    }
  }

  async getPipelines(projectId?: number): Promise<unknown[]> {
    if (!projectId) return []

    const response = await fetch(
      `${this.baseUrl}/projects/${projectId}/pipelines?per_page=20`,
      {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      }
    )

    if (!response.ok) {
      throw new Error(`GitLab API error: ${response.status}`)
    }

    const data = await response.json()
    return data
  }

  async getWebhooks(): Promise<unknown[]> {
    const projects = await this.getProjects()
    const allWebhooks: unknown[] = []

    for (const project of projects.slice(0, 3)) {
      try {
        const response = await fetch(
          `${this.baseUrl}/projects/${project.id}/hooks`,
          {
            headers: {
              'Authorization': `Bearer ${this.token}`
            }
          }
        )

        if (response.ok) {
          const webhooks = await response.json()
          allWebhooks.push(...webhooks.map((hook: unknown) => ({ ...hook, project: project.name })))
        }
      } catch (error) {
        logger.warn(`Failed to fetch webhooks for project ${project.id}`, error instanceof Error ? error.message : String(error))
      }
    }

    return allWebhooks
  }

  async createWebhook(config: unknown): Promise<unknown> {
    const { projectId, url, events = ['push', 'merge_request'] } = config

    if (!projectId || !url) {
      throw new Error('Project ID and webhook URL are required')
    }

    const response = await fetch(`${this.baseUrl}/projects/${projectId}/hooks`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url,
        push_events: events.includes('push'),
        merge_requests_events: events.includes('merge_request'),
        issues_events: events.includes('issues'),
        enable_ssl_verification: true
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Failed to create webhook: ${error.message}`)
    }

    return response.json()
  }

  async deleteWebhook(webhookId: string): Promise<void> {
    throw new Error('Delete webhook not implemented - requires project context')
  }
}

// Register the integration clients
import { integrationManager } from '../manager'

export function registerVersionControlIntegrations(): void {
  // Register GitHub client
  integrationManager.registerAPIClient('github', new GitHubClient())

  // Register GitLab client
  integrationManager.registerAPIClient('gitlab', new GitLabClient())

  // Register webhook handlers
  import('../webhooks').then(({ registerWebhookHandlers }) => {
    registerWebhookHandlers()
  })
}
