
// Integration API Clients
// Provides typed API client implementations for third-party integrations

import { integrationAuthManager } from './auth-manager'

export interface APIClientConfig {
  sessionId: string
  baseUrl?: string
  timeout?: number
  retries?: number
}

export abstract class BaseAPIClient {
  protected sessionId: string
  protected baseUrl: string
  protected timeout: number
  protected retries: number

  constructor(config: APIClientConfig) {
    this.sessionId = config.sessionId
    this.baseUrl = config.baseUrl || ''
    this.timeout = config.timeout || 30000
    this.retries = config.retries || 3
  }

  protected async makeRequest(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<unknown> {
    const client = await integrationAuthManager.getAuthenticatedClient(this.sessionId)

    let url = endpoint
    if (!endpoint.startsWith('http')) {
      url = `${this.baseUrl}${endpoint}`
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers as Record<string, string>
    }

    // Add authentication headers based on client type
    if (client.headers) {
      Object.assign(headers, client.headers)
    } else if (client.request) {
      // Google APIs client
      return await this.makeGoogleRequest(client, url, options)
    }

    const requestOptions: RequestInit = {
      ...options,
      headers
    }

    let lastError: Error | null = null

    for (let attempt = 0; attempt <= this.retries; attempt++) {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), this.timeout)

        const response = await fetch(url, {
          ...requestOptions,
          signal: controller.signal
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        return await response.json()
      } catch (error) {
        lastError = error as Error

        if (attempt < this.retries && this.isRetryableError(error)) {
          // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000))
          continue
        }

        break
      }
    }

    throw lastError || new Error('Request failed after retries')
  }

  private async makeGoogleRequest(client: unknown, url: string, options: RequestInit): Promise<unknown> {
    // Handle Google APIs client
    const method = (options.method || 'GET').toLowerCase()
    const requestOptions: unknown = {
      url,
      method: method.toUpperCase()
    }

    if (options.body) {
      (requestOptions as any).body = options.body
    }

    if (options.headers) {
      (requestOptions as any).headers = options.headers
    }

    return new Promise((resolve, reject) => {
      (client as any).request(requestOptions, (error: unknown, response: unknown) => {
        if (error) {
          reject(error)
        } else {
          resolve((response as any).data)
        }
      })
    })
  }

  private isRetryableError(error: unknown): boolean {
    // Retry on network errors, 5xx errors, rate limits
    if ((error as any).name === 'AbortError') return false
    if ((error as any).message?.includes('HTTP 5')) return true
    if ((error as any).message?.includes('429')) return true
    if ((error as any).message?.includes('network') || (error as any).message?.includes('timeout')) return true
    return false
  }
}

// Google Analytics Client
export class GoogleAnalyticsClient extends BaseAPIClient {
  async getAccountSummaries(): Promise<unknown> {
    return await this.makeRequest('/management/accountSummaries')
  }

  async getReport(propertyId: string, dateRange: { startDate: string; endDate: string }, metrics: string[], dimensions?: string[]): Promise<unknown> {
    const request = {
      reportRequests: [{
        viewId: propertyId,
        dateRanges: [{ ...dateRange }],
        metrics: metrics.map(metric => ({ expression: metric })),
        dimensions: dimensions?.map(dimension => ({ name: dimension }))
      }]
    }

    return await this.makeRequest('/reports:batchGet', {
      method: 'POST',
      body: JSON.stringify(request)
    })
  }

  async getRealtimeData(propertyId: string, metrics: string[]): Promise<unknown> {
    const request = {
      property: `properties/${propertyId}`,
      metrics: metrics.map(metric => ({ name: metric }))
    }

    return await this.makeRequest('/properties:batchRunRealtimeReports', {
      method: 'POST',
      body: JSON.stringify(request)
    })
  }
}

// Stripe Client
export class StripeClient extends BaseAPIClient {
  async getBalance(): Promise<unknown> {
    return await this.makeRequest('/balance')
  }

  async listCustomers(params?: { limit?: number; email?: string }): Promise<unknown> {
    const queryParams = new URLSearchParams()
    if (params?.limit) queryParams.set('limit', params.limit.toString())
    if (params?.email) queryParams.set('email', params.email)

    const endpoint = `/customers${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    return await this.makeRequest(endpoint)
  }

  async createCustomer(customerData: { name: string; email: string }): Promise<unknown> {
    return await this.makeRequest('/customers', {
      method: 'POST',
      body: JSON.stringify(customerData)
    })
  }

  async listPayments(params?: { limit?: number; customer?: string }): Promise<unknown> {
    const queryParams = new URLSearchParams()
    if (params?.limit) queryParams.set('limit', params.limit.toString())
    if (params?.customer) queryParams.set('customer', params.customer)

    const endpoint = `/payment_intents${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    return await this.makeRequest(endpoint)
  }

  async createPaymentIntent(amount: number, currency: string, customerId?: string): Promise<unknown> {
    return await this.makeRequest('/payment_intents', {
      method: 'POST',
      body: JSON.stringify({
        amount,
        currency,
        customer: customerId,
        automatic_payment_methods: { enabled: true }
      })
    })
  }
}

// Jira Client
export class JiraClient extends BaseAPIClient {
  async getCurrentUser(): Promise<unknown> {
    return await this.makeRequest('/me')
  }

  async getProjects(): Promise<unknown> {
    return await this.makeRequest('/projects')
  }

  async getIssues(projectKey: string, params?: { maxResults?: number; startAt?: number }): Promise<unknown> {
    const queryParams = new URLSearchParams()
    if (params?.maxResults) queryParams.set('maxResults', params.maxResults.toString())
    if (params?.startAt) queryParams.set('startAt', params.startAt.toString())

    return await this.makeRequest(`/projects/${projectKey}/issues${queryParams.toString() ? `?${queryParams.toString()}` : ''}`)
  }

  async createIssue(projectKey: string, issueData: {
    summary: string
    description: string
    issueType: string
    assignee?: string
  }): Promise<unknown> {
    const payload = {
      fields: {
        project: { key: projectKey },
        summary: issueData.summary,
        description: issueData.description,
        issuetype: { name: issueData.issueType },
        ...(issueData.assignee && { assignee: { accountId: issueData.assignee } })
      }
    }

    return await this.makeRequest('/issues', {
      method: 'POST',
      body: JSON.stringify(payload)
    })
  }

  async getWorkflows(): Promise<unknown> {
    return await this.makeRequest('/workflows')
  }
}

// GitHub Client
export class GitHubClient extends BaseAPIClient {
  async getUser(): Promise<unknown> {
    return await this.makeRequest('/user')
  }

  async listRepositories(params?: { type?: string; sort?: string; per_page?: number }): Promise<unknown> {
    const queryParams = new URLSearchParams()
    if (params?.type) queryParams.set('type', params.type)
    if (params?.sort) queryParams.set('sort', params.sort)
    if (params?.per_page) queryParams.set('per_page', params.per_page.toString())

    return await this.makeRequest(`/user/repos${queryParams.toString() ? `?${queryParams.toString()}` : ''}`)
  }

  async getRepository(owner: string, repo: string): Promise<unknown> {
    return await this.makeRequest(`/repos/${owner}/${repo}`)
  }

  async listIssues(owner: string, repo: string, params?: { state?: string; labels?: string; per_page?: number }): Promise<unknown> {
    const queryParams = new URLSearchParams()
    if (params?.state) queryParams.set('state', params.state)
    if (params?.labels) queryParams.set('labels', params.labels)
    if (params?.per_page) queryParams.set('per_page', params.per_page.toString())

    return await this.makeRequest(`/repos/${owner}/${repo}/issues${queryParams.toString() ? `?${queryParams.toString()}` : ''}`)
  }

  async createIssue(owner: string, repo: string, issueData: {
    title: string
    body: string
    labels?: string[]
    assignees?: string[]
  }): Promise<unknown> {
    return await this.makeRequest(`/repos/${owner}/${repo}/issues`, {
      method: 'POST',
      body: JSON.stringify(issueData)
    })
  }

  async listWorkflows(owner: string, repo: string): Promise<unknown> {
    return await this.makeRequest(`/repos/${owner}/${repo}/actions/workflows`)
  }
}

// Slack Client
export class SlackClient extends BaseAPIClient {
  async getChannels(): Promise<unknown> {
    return await this.makeRequest('/conversations.list')
  }

  async postMessage(channel: string, text: string, options?: {
    thread_ts?: string
    attachments?: unknown[]
    blocks?: unknown[]
  }): Promise<unknown> {
    const payload = {
      channel,
      text,
      ...options
    }

    return await this.makeRequest('/chat.postMessage', {
      method: 'POST',
      body: JSON.stringify(payload)
    })
  }

  async getUsers(): Promise<unknown> {
    return await this.makeRequest('/users.list')
  }

  async createChannel(name: string, isPrivate: boolean = false): Promise<unknown> {
    return await this.makeRequest('/conversations.create', {
      method: 'POST',
      body: JSON.stringify({
        name,
        is_private: isPrivate
      })
    })
  }
}

// Client factory
export class IntegrationClientFactory {
  static createClient(providerId: string, sessionId: string): BaseAPIClient {
    const config: APIClientConfig = { sessionId }

    switch (providerId) {
      case 'google-analytics':
        return new GoogleAnalyticsClient(config)
      case 'stripe':
        return new StripeClient(config)
      case 'jira':
        return new JiraClient(config)
      case 'github':
        return new GitHubClient(config)
      case 'slack':
        return new SlackClient(config)
      default:
        throw new Error(`No client implementation for provider ${providerId}`)
    }
  }
}

// Helper functions for common operations
export const getGoogleAnalyticsData = async (
  sessionId: string,
  propertyId: string,
  dateRange: { startDate: string; endDate: string }
) => {
  const client = IntegrationClientFactory.createClient('google-analytics', sessionId) as GoogleAnalyticsClient
  return await client.getReport(propertyId, dateRange, ['ga:sessions', 'ga:users', 'ga:pageviews'])
}

export const processStripePayment = async (
  sessionId: string,
  amount: number,
  currency: string,
  customerId?: string
) => {
  const client = IntegrationClientFactory.createClient('stripe', sessionId) as StripeClient
  return await client.createPaymentIntent(amount, currency, customerId)
}

export const createJiraTicket = async (
  sessionId: string,
  projectKey: string,
  summary: string,
  description: string,
  issueType: string = 'Task'
) => {
  const client = IntegrationClientFactory.createClient('jira', sessionId) as JiraClient
  return await client.createIssue(projectKey, { summary, description, issueType })
}

export const postSlackMessage = async (
  sessionId: string,
  channel: string,
  text: string
) => {
  const client = IntegrationClientFactory.createClient('slack', sessionId) as SlackClient
  return await client.postMessage(channel, text)
}
