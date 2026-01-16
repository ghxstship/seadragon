
// Communication Integrations - Slack, Microsoft Teams, Discord

import { IntegrationAPIClient, IntegrationConfig, IntegrationSyncResult, SyncDataParams, SyncResultMetadata } from '../types'
import { AuthProviderId, getProviderBaseUrl } from '../../constants/integration-providers'

interface MessageOptions {
  threadTs?: string
  attachments?: Array<{
    title?: string
    text?: string
    color?: string
    fields?: Array<{
      title: string
      value: string
      short?: boolean
    }>
  }>
  username?: string
  iconUrl?: string
  parse?: 'full' | 'none'
}

interface MessageResponse {
  ok: boolean
  ts?: string
  channel?: string
  message?: {
    ts: string
    text: string
  }
  error?: string
}

interface Channel {
  id: string
  name: string
  type: number
  is_channel?: boolean
  is_group?: boolean
  is_im?: boolean
}

const resolveBaseUrl = (providerId: AuthProviderId, override?: string): string =>
  getProviderBaseUrl(providerId, override)

type SlackSyncParams = SyncDataParams & {
  syncUsers?: boolean
  syncMessages?: boolean
  channels?: string[]
}

type TeamsSyncParams = SyncDataParams & {
  syncChannels?: boolean
}

export class SlackClient implements IntegrationAPIClient {
  providerId = 'slack'
  private baseUrl = resolveBaseUrl('slack')
  private token: string = ''

  async authenticate(config: IntegrationConfig): Promise<void> {
    if (!config.apiKey) {
      throw new Error('Slack API token is required')
    }
    this.baseUrl = resolveBaseUrl(this.providerId, config.baseUrl)
    this.token = config.apiKey
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/auth.test`, {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      })

      if (!response.ok) return false

      const data = await response.json()
      return data.ok === true
    } catch {
      return false
    }
  }

  async syncData(params?: SlackSyncParams): Promise<IntegrationSyncResult> {
    const syncStart = new Date()
    let recordsProcessed = 0
    const errors: string[] = []

    try {
      // Sync channels
      const channels = await this.getChannels()
      recordsProcessed += channels.length

      // Sync users if requested
      if (params?.['syncUsers']) {
        const users = await this.getUsers()
        recordsProcessed += users.length
      }

      // Sync recent messages from channels if requested
      const channelIds = Array.isArray(params?.['channels']) ? params['channels'] : []
      if (params?.['syncMessages'] && channelIds.length > 0) {
        for (const channelId of channelIds.slice(0, 5)) { // Limit to avoid rate limits
          try {
            const messages = await this.getChannelMessages(channelId)
            recordsProcessed += messages.length
          } catch (error) {
            errors.push(`Failed to sync messages for channel ${channelId}: ${error}`)
          }
        }
      }

      const metadata: SyncResultMetadata = {
        totalRecords: recordsProcessed,
        createdCount: 0,
        updatedCount: 0,
        deletedCount: 0,
        skippedCount: 0,
        durationMs: Date.now() - syncStart.getTime(),
        channelsSynced: channels.length,
        hasUsers: params?.syncUsers || false
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

  async getChannels(): Promise<any[]> {
    const response = await fetch(`${this.baseUrl}/conversations.list?limit=100`, {
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    })

    if (!response.ok) {
      throw new Error(`Slack API error: ${response.status}`)
    }

    const data = await response.json()
    if (!data.ok) {
      throw new Error(`Slack API error: ${data.error}`)
    }

    return data.channels || []
  }

  async getUsers(): Promise<any[]> {
    const response = await fetch(`${this.baseUrl}/users.list?limit=200`, {
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    })

    if (!response.ok) {
      throw new Error(`Slack API error: ${response.status}`)
    }

    const data = await response.json()
    if (!data.ok) {
      throw new Error(`Slack API error: ${data.error}`)
    }

    return data.members || []
  }

  async getChannelMessages(channelId: string, limit: number = 50): Promise<any[]> {
    const response = await fetch(
      `${this.baseUrl}/conversations.history?channel=${channelId}&limit=${limit}`,
      {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      }
    )

    if (!response.ok) {
      throw new Error(`Slack API error: ${response.status}`)
    }

    const data = await response.json()
    if (!data.ok) {
      throw new Error(`Slack API error: ${data.error}`)
    }

    return data.messages || []
  }

  async sendMessage(channelId: string, text: string, options?: MessageOptions): Promise<MessageResponse> {
    const payload = {
      channel: channelId,
      text,
      ...options
    }

    const response = await fetch(`${this.baseUrl}/chat.postMessage`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      throw new Error(`Slack API error: ${response.status}`)
    }

    const data = await response.json()
    if (!data.ok) {
      throw new Error(`Slack API error: ${data.error}`)
    }

    return data
  }
}

// Microsoft Teams Integration Implementation
export class MicrosoftTeamsClient implements IntegrationAPIClient {
  providerId = 'microsoft-teams'
  private baseUrl = resolveBaseUrl('microsoft-teams')
  private token: string = ''

  async authenticate(config: IntegrationConfig): Promise<void> {
    if (!config.accessToken) {
      throw new Error('Microsoft Teams access token is required')
    }
    this.baseUrl = resolveBaseUrl(this.providerId, config.baseUrl)
    this.token = config.accessToken
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/me`, {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      })
      return response.ok
    } catch {
      return false
    }
  }

  async syncData(params?: TeamsSyncParams): Promise<IntegrationSyncResult> {
    const syncStart = new Date()
    let recordsProcessed = 0
    const errors: string[] = []

    try {
      // Sync teams
      const teams = await this.getTeams()
      recordsProcessed += teams.length

      // Sync channels for each team if requested
      if (params?.['syncChannels']) {
        for (const team of teams.slice(0, 5)) {
          try {
            const channels = await this.getTeamChannels(team.id)
            recordsProcessed += channels.length
          } catch (error) {
            errors.push(`Failed to sync channels for team ${team.displayName}: ${error}`)
          }
        }
      }

      const metadata: SyncResultMetadata = {
        totalRecords: recordsProcessed,
        createdCount: 0,
        updatedCount: 0,
        deletedCount: 0,
        skippedCount: 0,
        durationMs: Date.now() - syncStart.getTime(),
        teamsSynced: teams.length
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

  async getTeams(): Promise<any[]> {
    const response = await fetch(`${this.baseUrl}/me/joinedTeams`, {
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    })

    if (!response.ok) {
      throw new Error(`Microsoft Teams API error: ${response.status}`)
    }

    const data = await response.json()
    return data.value || []
  }

  async getTeamChannels(teamId: string): Promise<any[]> {
    const response = await fetch(
      `${this.baseUrl}/teams/${teamId}/channels`,
      {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      }
    )

    if (!response.ok) {
      throw new Error(`Microsoft Teams API error: ${response.status}`)
    }

    const data = await response.json()
    return data.value || []
  }

  async sendMessage(teamId: string, channelId: string, content: string): Promise<any> {
    const response = await fetch(
      `${this.baseUrl}/teams/${teamId}/channels/${channelId}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          body: {
            content
          }
        })
      }
    )

    if (!response.ok) {
      throw new Error(`Microsoft Teams API error: ${response.status}`)
    }

    return response.json()
  }
}

// Discord Integration Implementation
export class DiscordClient implements IntegrationAPIClient {
  providerId = 'discord'
  private baseUrl = resolveBaseUrl('discord')
  private token: string = ''

  async authenticate(config: IntegrationConfig): Promise<void> {
    if (!config.apiKey) {
      throw new Error('Discord bot token is required')
    }
    this.baseUrl = resolveBaseUrl(this.providerId, config.baseUrl)
    this.token = config.apiKey
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/users/@me`, {
        headers: {
          'Authorization': `Bot ${this.token}`
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
      // Sync guilds (servers)
      const guilds = await this.getGuilds()
      recordsProcessed += guilds.length

      // Sync channels for each guild if requested
      if (params?.['syncChannels']) {
        for (const guild of guilds.slice(0, 3)) {
          try {
            const channels = await this.getGuildChannels(guild.id)
            recordsProcessed += channels.length
          } catch (error) {
            errors.push(`Failed to sync channels for guild ${guild.name}: ${error}`)
          }
        }
      }

      const metadata: SyncResultMetadata = {
        totalRecords: recordsProcessed,
        createdCount: 0,
        updatedCount: 0,
        deletedCount: 0,
        skippedCount: 0,
        durationMs: Date.now() - syncStart.getTime(),
        guildsSynced: guilds.length
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

  async getGuilds(): Promise<any[]> {
    const response = await fetch(`${this.baseUrl}/users/@me/guilds`, {
      headers: {
        'Authorization': `Bot ${this.token}`
      }
    })

    if (!response.ok) {
      throw new Error(`Discord API error: ${response.status}`)
    }

    return response.json()
  }

  async getGuildChannels(guildId: string): Promise<any[]> {
    const response = await fetch(
      `${this.baseUrl}/guilds/${guildId}/channels`,
      {
        headers: {
          'Authorization': `Bot ${this.token}`
        }
      }
    )

    if (!response.ok) {
      throw new Error(`Discord API error: ${response.status}`)
    }

    const channels = await response.json()
    return channels.filter((channel: Channel) => channel.type === 0) // Text channels only
  }

  async sendMessage(channelId: string, content: string): Promise<any> {
    const response = await fetch(
      `${this.baseUrl}/channels/${channelId}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bot ${this.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content })
      }
    )

    if (!response.ok) {
      throw new Error(`Discord API error: ${response.status}`)
    }

    return response.json()
  }
}

// Register communication integrations
import { integrationManager } from '../manager'

export function registerCommunicationIntegrations(): void {
  integrationManager.registerAPIClient('slack', new SlackClient())
  integrationManager.registerAPIClient('microsoft-teams', new MicrosoftTeamsClient())
  integrationManager.registerAPIClient('discord', new DiscordClient())
}
