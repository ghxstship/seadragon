// Documentation Integrations - Top 10 Providers
// Confluence, Notion, GitBook, ReadMe, GitHub Wiki, Slab, Nuclino, Dropbox Paper, Google Docs, OneNote

import { IntegrationAPIClient, IntegrationConfig, IntegrationSyncResult, SyncDataParams, SyncResultMetadata } from '../types'

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

interface DocumentationSyncParams extends SyncDataParams {
  includePages?: boolean
  includeComments?: boolean
  spaceId?: string
  databaseId?: string
}

interface ConfluencePage {
  id: string
  title: string
  status: string
  createdDate: string
  lastModified: string
  [key: string]: unknown
}

interface NotionPage {
  id: string
  properties: {
    Name?: { title: Array<{ plain_text: string }> }
    Status?: { select: { name: string } }
    [key: string]: unknown
  }
  created_time: string
  last_edited_time: string
  [key: string]: unknown
}

interface GitBookPage {
  id: string
  title: string
  description?: string
  path: string
  createdAt: string
  updatedAt: string
  [key: string]: unknown
}

// =============================================================================
// CONFLUENCE INTEGRATION
// =============================================================================

export class ConfluenceClient implements IntegrationAPIClient {
  providerId = 'confluence'
  private baseUrl: string = ''
  private email: string = ''
  private apiToken: string = ''

  async authenticate(config: IntegrationConfig): Promise<void> {
    if (!config.baseUrl || !config.additionalConfig?.username || !config.apiKey) {
      throw new Error('Confluence base URL, email, and API token are required')
    }
    this.baseUrl = config.baseUrl.replace(/\/$/, '')
    this.email = config.additionalConfig.username
    this.apiToken = config.apiKey
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/rest/api/content?limit=1`, {
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

  async syncData(params?: DocumentationSyncParams): Promise<IntegrationSyncResult> {
    const syncStart = new Date()
    let recordsProcessed = 0
    const errors: string[] = []

    try {
      const spaceKey = params?.filters?.['spaceKey'] as string

      if (!spaceKey) {
        throw new Error('Space key is required for Confluence sync')
      }

      const pages = await this.getPages(spaceKey, params)
      recordsProcessed += pages.length

      const metadata: SyncResultMetadata = {
        totalRecords: recordsProcessed,
        createdCount: 0,
        updatedCount: 0,
        deletedCount: 0,
        skippedCount: 0,
        durationMs: Date.now() - syncStart.getTime(),
        pagesCount: pages.length
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

  async getPages(spaceKey: string, params?: DocumentationSyncParams): Promise<ConfluencePage[]> {
    const url = `${this.baseUrl}/rest/api/content?spaceKey=${spaceKey}&limit=${params?.limit || 25}&expand=version`

    const response = await fetch(url, {
      headers: {
        'Authorization': `Basic ${Buffer.from(`${this.email}:${this.apiToken}`).toString('base64')}`,
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`Confluence API error: ${response.status}`)
    }

    const data = await response.json()
    return data.results || []
  }

  async createPage(spaceKey: string, title: string, content: string): Promise<ConfluencePage> {
    const response = await fetch(`${this.baseUrl}/rest/api/content`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${this.email}:${this.apiToken}`).toString('base64')}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        type: 'page',
        title,
        space: { key: spaceKey },
        body: {
          storage: {
            value: content,
            representation: 'storage'
          }
        }
      })
    })

    if (!response.ok) {
      throw new Error(`Confluence API error: ${response.status}`)
    }

    return response.json()
  }
}

// =============================================================================
// NOTION INTEGRATION
// =============================================================================

export class NotionClient implements IntegrationAPIClient {
  providerId = 'notion'
  private baseUrl = 'https://api.notion.com/v1'
  private apiKey: string = ''
  private version = '2022-06-28'

  async authenticate(config: IntegrationConfig): Promise<void> {
    if (!config.additionalConfig?.integrationToken) {
      throw new Error('Notion integration token is required')
    }
    this.apiKey = config.additionalConfig.integrationToken
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/users`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Notion-Version': this.version,
          'Accept': 'application/json'
        }
      })
      return response.ok
    } catch {
      return false
    }
  }

  async syncData(params?: DocumentationSyncParams): Promise<IntegrationSyncResult> {
    const syncStart = new Date()
    let recordsProcessed = 0
    const errors: string[] = []

    try {
      const databaseId = params?.databaseId

      if (!databaseId) {
        throw new Error('Database ID is required for Notion sync')
      }

      const pages = await this.getDatabasePages(databaseId, params)
      recordsProcessed += pages.length

      const metadata: SyncResultMetadata = {
        totalRecords: recordsProcessed,
        createdCount: 0,
        updatedCount: 0,
        deletedCount: 0,
        skippedCount: 0,
        durationMs: Date.now() - syncStart.getTime(),
        pagesCount: pages.length
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

  async getDatabasePages(databaseId: string, params?: DocumentationSyncParams): Promise<NotionPage[]> {
    const url = `${this.baseUrl}/databases/${databaseId}/query`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Notion-Version': this.version,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        page_size: params?.limit || 100
      })
    })

    if (!response.ok) {
      throw new Error(`Notion API error: ${response.status}`)
    }

    const data = await response.json()
    return data.results || []
  }

  async createPage(databaseId: string, properties: Record<string, unknown>): Promise<NotionPage> {
    const response = await fetch(`${this.baseUrl}/pages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Notion-Version': this.version,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        parent: { database_id: databaseId },
        properties
      })
    })

    if (!response.ok) {
      throw new Error(`Notion API error: ${response.status}`)
    }

    return response.json()
  }
}

// Additional implementations for GitBook, ReadMe, GitHub Wiki, Slab, Nuclino, Dropbox Paper, Google Docs, OneNote would follow the same pattern...

// =============================================================================
// REGISTRATION
// =============================================================================

import { integrationManager } from '../manager'

export function registerDocumentationIntegrations(): void {
  integrationManager.registerAPIClient('confluence', new ConfluenceClient())
  integrationManager.registerAPIClient('notion-docs', new NotionClient())
  // Register remaining providers...
}
