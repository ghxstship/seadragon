// Project Management Integrations - Top 10 Providers
// Jira, Trello, Asana, Monday.com, Basecamp, ClickUp, Linear, Notion, Microsoft Project, Teamwork

import { IntegrationAPIClient, IntegrationConfig, IntegrationSyncResult, SyncDataParams, SyncResultMetadata } from '../types'
import { API_ENDPOINTS } from '../../constants/api-endpoints'
import { AUTH_PROVIDERS } from '../../constants/integration-providers'

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

interface ProjectManagementSyncParams extends SyncDataParams {
  includeTasks?: boolean
  includeUsers?: boolean
  includeProjects?: boolean
  projectId?: string
  workspaceId?: string
}

interface JiraIssue {
  id: string
  key: string
  fields: {
    summary: string
    status: { name: string }
    assignee?: { displayName: string }
    created: string
    updated: string
    [key: string]: unknown
  }
}

interface TrelloCard {
  id: string
  name: string
  desc?: string
  idList: string
  idMembers: string[]
  due?: string
  labels: Array<{ name: string; color: string }>
  [key: string]: unknown
}

interface AsanaTask {
  gid: string
  name: string
  notes?: string
  completed: boolean
  assignee?: { gid: string; name: string }
  due_on?: string
  created_at: string
  modified_at: string
  [key: string]: unknown
}

interface MondayItem {
  id: string
  name: string
  column_values: Array<{
    id: string
    text: string
    value: string
    [key: string]: unknown
  }>
  [key: string]: unknown
}

interface BasecampTodo {
  id: number
  content: string
  completed: boolean
  assignee?: { id: number; name: string }
  due_on?: string
  created_at: string
  updated_at: string
  [key: string]: unknown
}

interface ClickUpTask {
  id: string
  name: string
  description?: string
  status: { status: string }
  assignees: Array<{ id: number; username: string }>
  due_date?: string
  date_created: string
  date_updated: string
  [key: string]: unknown
}

interface LinearIssue {
  id: string
  title: string
  description?: string
  state: { name: string }
  assignee?: { displayName: string }
  createdAt: string
  updatedAt: string
  [key: string]: unknown
}

interface NotionPage {
  id: string
  properties: {
    Name?: { title: Array<{ plain_text: string }> }
    Status?: { select: { name: string } }
    Assignee?: { people: Array<{ name: string }> }
    Due?: { date: { start: string } }
    [key: string]: unknown
  }
  created_time: string
  last_edited_time: string
  [key: string]: unknown
}

interface MSProjectTask {
  Id: number
  Name: string
  Notes?: string
  PercentComplete: number
  Start: string
  Finish: string
  ResourceNames?: string
  [key: string]: unknown
}

interface TeamworkTask {
  id: string
  name: string
  description?: string
  completed: boolean
  'responsible-party-id'?: string
  'responsible-party-name'?: string
  'due-date'?: string
  'created-on': string
  'last-changed-on': string
  [key: string]: unknown
}

// =============================================================================
// JIRA INTEGRATION
// =============================================================================

export class JiraClient implements IntegrationAPIClient {
  providerId = 'jira'
  private baseUrl: string = ''
  private email: string = ''
  private apiToken: string = ''

  async authenticate(config: IntegrationConfig): Promise<void> {
    if (!config.baseUrl || !config.additionalConfig?.username || !config.apiKey) {
      throw new Error('Jira base URL, email, and API token are required')
    }
    this.baseUrl = config.baseUrl.replace(/\/$/, '')
    this.email = config.additionalConfig.username
    this.apiToken = config.apiKey
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/rest/api/3/myself`, {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${this.email}:${this.apiToken}`).toString('base64')}`,
          'Accept': 'application/json'
        }
      })
      return response.ok
    } catch {
      return false
    }
  }

  async syncData(params?: ProjectManagementSyncParams): Promise<IntegrationSyncResult> {
    const syncStart = new Date()
    let recordsProcessed = 0
    const errors: string[] = []

    try {
      const issues = await this.getIssues(params)
      recordsProcessed += issues.length

      const metadata: SyncResultMetadata = {
        totalRecords: recordsProcessed,
        createdCount: 0,
        updatedCount: 0,
        deletedCount: 0,
        skippedCount: 0,
        durationMs: Date.now() - syncStart.getTime(),
        issuesCount: issues.length
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

  async getIssues(params?: ProjectManagementSyncParams): Promise<JiraIssue[]> {
    const project = params?.projectId || 'PROJ'
    const jql = params?.filters?.['jql'] as string || `project=${project}`
    const maxResults = params?.limit || 50

    const url = `${this.baseUrl}/rest/api/3/search?jql=${encodeURIComponent(jql)}&maxResults=${maxResults}`

    const response = await fetch(url, {
      headers: {
        'Authorization': `Basic ${Buffer.from(`${this.email}:${this.apiToken}`).toString('base64')}`,
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`Jira API error: ${response.status}`)
    }

    const data = await response.json()
    return data.issues || []
  }

  async createIssue(projectKey: string, issueData: Partial<JiraIssue>): Promise<JiraIssue> {
    const response = await fetch(`${this.baseUrl}/rest/api/3/issue`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${this.email}:${this.apiToken}`).toString('base64')}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        fields: {
          project: { key: projectKey },
          summary: issueData.fields?.summary,
          description: issueData.fields?.description || issueData.fields?.summary,
          issuetype: { name: 'Task' },
          ...issueData.fields
        }
      })
    })

    if (!response.ok) {
      throw new Error(`Jira API error: ${response.status}`)
    }

    return response.json()
  }
}

// =============================================================================
// TRELLO INTEGRATION
// =============================================================================

export class TrelloClient implements IntegrationAPIClient {
  providerId = 'trello'
  private baseUrl = 'https://api.trello.com/1'
  private apiKey: string = ''
  private token: string = ''

  async authenticate(config: IntegrationConfig): Promise<void> {
    if (!config.apiKey || !config.additionalConfig?.token) {
      throw new Error('Trello API key and token are required')
    }
    this.apiKey = config.apiKey
    this.token = config.additionalConfig.token
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/members/me?key=${this.apiKey}&token=${this.token}`)
      return response.ok
    } catch {
      return false
    }
  }

  async syncData(params?: ProjectManagementSyncParams): Promise<IntegrationSyncResult> {
    const syncStart = new Date()
    let recordsProcessed = 0
    const errors: string[] = []

    try {
      const boardId = params?.workspaceId
      if (!boardId) {
        throw new Error('Board ID is required for Trello sync')
      }

      const cards = await this.getCards(boardId)
      recordsProcessed += cards.length

      const metadata: SyncResultMetadata = {
        totalRecords: recordsProcessed,
        createdCount: 0,
        updatedCount: 0,
        deletedCount: 0,
        skippedCount: 0,
        durationMs: Date.now() - syncStart.getTime(),
        cardsCount: cards.length
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

  async getCards(boardId: string): Promise<TrelloCard[]> {
    const url = `${this.baseUrl}/boards/${boardId}/cards?key=${this.apiKey}&token=${this.token}`

    const response = await fetch(url, {
      headers: { 'Accept': 'application/json' }
    })

    if (!response.ok) {
      throw new Error(`Trello API error: ${response.status}`)
    }

    return response.json()
  }

  async createCard(listId: string, cardData: Partial<TrelloCard>): Promise<TrelloCard> {
    const url = `${this.baseUrl}/cards?key=${this.apiKey}&token=${this.token}&idList=${listId}&name=${encodeURIComponent(cardData.name || 'New Card')}`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`Trello API error: ${response.status}`)
    }

    return response.json()
  }
}

// =============================================================================
// ASANA INTEGRATION
// =============================================================================

export class AsanaClient implements IntegrationAPIClient {
  providerId = 'asana'
  private baseUrl = 'https://app.asana.com/api/1.0'
  private accessToken: string = ''

  async authenticate(config: IntegrationConfig): Promise<void> {
    if (!config.accessToken) {
      throw new Error('Asana access token is required')
    }
    this.accessToken = config.accessToken
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/users/me`, {
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

  async syncData(params?: ProjectManagementSyncParams): Promise<IntegrationSyncResult> {
    const syncStart = new Date()
    let recordsProcessed = 0
    const errors: string[] = []

    try {
      const projectId = params?.projectId
      if (!projectId) {
        throw new Error('Project ID is required for Asana sync')
      }

      const tasks = await this.getTasks(projectId)
      recordsProcessed += tasks.length

      const metadata: SyncResultMetadata = {
        totalRecords: recordsProcessed,
        createdCount: 0,
        updatedCount: 0,
        deletedCount: 0,
        skippedCount: 0,
        durationMs: Date.now() - syncStart.getTime(),
        tasksCount: tasks.length
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

  async getTasks(projectId: string): Promise<AsanaTask[]> {
    const url = `${this.baseUrl}/projects/${projectId}/tasks`

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`Asana API error: ${response.status}`)
    }

    const data = await response.json()
    return data.data || []
  }

  async createTask(projectId: string, taskData: Partial<AsanaTask>): Promise<AsanaTask> {
    const response = await fetch(`${this.baseUrl}/tasks`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        name: taskData.name,
        notes: taskData.notes,
        projects: [projectId],
        due_on: taskData.due_on
      })
    })

    if (!response.ok) {
      throw new Error(`Asana API error: ${response.status}`)
    }

    return response.json()
  }
}

// Additional implementations for Monday.com, Basecamp, ClickUp, Linear, Notion, Microsoft Project, Teamwork would follow the same pattern...

// =============================================================================
// REGISTRATION
// =============================================================================

import { integrationManager } from '../manager'

export function registerProjectManagementIntegrations(): void {
  integrationManager.registerAPIClient('jira', new JiraClient())
  integrationManager.registerAPIClient('trello', new TrelloClient())
  integrationManager.registerAPIClient('asana', new AsanaClient())
  // Register remaining providers...
}
