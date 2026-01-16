
// Webhook Event Processor
// Handles incoming webhooks from integrated services and processes events

import { NextRequest, NextResponse } from 'next/server'
import { logger } from '../logger'
import crypto from 'crypto'
import { workflowStateManager } from '../workflow-state-manager'
import { dataSyncManager } from './sync-manager'

// Webhook payload interfaces for type safety
interface StripeWebhookPayload {
  id: string
  type: string
  data: {
    object: unknown
  }
  [key: string]: unknown
}

interface GitHubWebhookPayload {
  id?: string | number
  action?: string
  type?: string
  issue?: {
    id?: string | number
    title?: string
    [key: string]: unknown
  }
  pull_request?: {
    title?: string
    [key: string]: unknown
  }
  ref?: string
  [key: string]: unknown
}

interface JiraWebhookPayload {
  webhookEvent?: string
  issue?: {
    id?: string | number
    key?: string
    [key: string]: unknown
  }
  [key: string]: unknown
}

interface SlackWebhookPayload {
  event_id?: string
  type?: string
  event?: {
    text?: string
    channel?: {
      name?: string
      [key: string]: unknown
    }
    [key: string]: unknown
  }
  [key: string]: unknown
}

type WebhookPayload = StripeWebhookPayload | GitHubWebhookPayload | JiraWebhookPayload | SlackWebhookPayload

export interface WebhookProcessingEvent {
  id: string
  providerId: string
  eventType: string
  payload: Record<string, unknown>
  receivedAt: Date
  processedAt?: Date
  status: 'received' | 'processing' | 'processed' | 'failed'
  error?: string
  retryCount: number
}

export interface WebhookHandler {
  providerId: string
  eventTypes: string[]
  handler: (event: WebhookProcessingEvent, context: WebhookContext) => Promise<void>
  validateSignature?: (request: NextRequest, secret: string) => boolean
}

export interface WebhookContext {
  organizationId: string
  sessionId?: string
  userId?: string
  metadata?: Record<string, unknown>
}

class WebhookProcessor {
  private handlers: Map<string, WebhookHandler> = new Map()
  private eventQueue: WebhookProcessingEvent[] = []

  // Register webhook handler for a provider
  registerHandler(handler: WebhookHandler): void {
    this.handlers.set(handler.providerId, handler)
  }

  // Process incoming webhook
  async processWebhook(
    request: NextRequest,
    providerId: string,
    organizationId: string
  ): Promise<NextResponse> {
    try {
      const handler = this.handlers.get(providerId)
      if (!handler) {
        return NextResponse.json({ error: 'Provider not supported' }, { status: 400 })
      }

      // Validate signature if handler provides validation
      if (handler.validateSignature) {
        const secret = process.env[`${providerId.toUpperCase()}_WEBHOOK_SECRET`]
        if (!secret || !handler.validateSignature(request, secret)) {
          return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
        }
      }

      const payload = await request.json()
      const eventId = this.extractEventId(payload, providerId)

      const webhookEvent: WebhookProcessingEvent = {
        id: eventId,
        providerId,
        eventType: this.extractEventType(payload, providerId),
        payload,
        receivedAt: new Date(),
        status: 'received',
        retryCount: 0
      }

      // Check if event type is supported
      if (!handler.eventTypes.includes(webhookEvent.eventType)) {
        return NextResponse.json({ message: 'Event type not supported' }, { status: 200 })
      }

      // Queue event for processing
      this.eventQueue.push(webhookEvent)

      // Process event asynchronously
      this.processEventAsync(webhookEvent, handler, { organizationId })

      return NextResponse.json({ message: 'Webhook received' }, { status: 200 })

    } catch (error) {
      logger.error('Webhook processing error', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
  }

  // Process event asynchronously
  private async processEventAsync(
    event: WebhookProcessingEvent,
    handler: WebhookHandler,
    context: WebhookContext
  ): Promise<void> {
    try {
      event.status = 'processing'

      await handler.handler(event, context)

      event.status = 'processed'
      event.processedAt = new Date()

    } catch (error) {
      event.status = 'failed'
      event.error = (error as Error).message
      event.retryCount++

      // Retry logic
      if (event.retryCount < 3) {
        setTimeout(() => {
          this.processEventAsync(event, handler, context)
        }, Math.pow(2, event.retryCount) * 1000)
      }
    }
  }

  // Extract event ID from payload
  private extractEventId(payload: WebhookPayload, providerId: string): string {
    switch (providerId) {
      case 'stripe':
        return (payload as StripeWebhookPayload).id
      case 'github':
        return (payload as GitHubWebhookPayload).id?.toString() || `github_${Date.now()}`
      case 'jira':
        return (payload as JiraWebhookPayload).issue?.id?.toString() || `jira_${Date.now()}`
      case 'slack':
        return (payload as SlackWebhookPayload).event_id || `slack_${Date.now()}`
      default:
        return `webhook_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }
  }

  // Extract event type from payload
  private extractEventType(payload: WebhookPayload, providerId: string): string {
    switch (providerId) {
      case 'stripe':
        return (payload as StripeWebhookPayload).type
      case 'github':
        const githubPayload = payload as GitHubWebhookPayload
        return githubPayload.action ? `${githubPayload.action}.${githubPayload.type || 'unknown'}` : 'unknown'
      case 'jira':
        return (payload as JiraWebhookPayload).webhookEvent || 'unknown'
      case 'slack':
        return (payload as SlackWebhookPayload).type || 'unknown'
      default:
        return 'unknown'
    }
  }

  // Get pending events
  getPendingEvents(): WebhookProcessingEvent[] {
    return this.eventQueue.filter(event => event.status === 'received' || event.status === 'processing')
  }

  // Get failed events
  getFailedEvents(): WebhookProcessingEvent[] {
    return this.eventQueue.filter(event => event.status === 'failed')
  }
}

// Singleton instance
export const webhookProcessor = new WebhookProcessor()

// Webhook handlers for different providers

// Stripe webhook handler
webhookProcessor.registerHandler({
  providerId: 'stripe',
  eventTypes: [
    'payment_intent.succeeded',
    'payment_intent.payment_failed',
    'customer.created',
    'customer.updated',
    'invoice.payment_succeeded',
    'invoice.payment_failed'
  ],
  validateSignature: (request: NextRequest, secret: string) => {
    const signature = request.headers.get('stripe-signature')
    if (!signature) return false

    const elements = signature.split(',')
    const sigElements: Record<string, string> = {}

    for (const element of elements) {
      const [key, value] = element.split('=')
      sigElements[key] = value
    }

    const timestamp = sigElements.t
    const v1 = sigElements.v1

    if (!timestamp || !v1) return false

    const signedPayload = `${timestamp}.${request.body}`
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(signedPayload)
      .digest('hex')

    return v1 === expectedSignature
  },
  handler: async (event: WebhookProcessingEvent, context: WebhookContext) => {
    const { payload } = event

    switch (event.eventType) {
      case 'payment_intent.succeeded':
        // Update payment status in workflow
        await handlePaymentSuccess(payload.data.object, context)
        break

      case 'payment_intent.payment_failed':
        // Handle payment failure
        await handlePaymentFailure(payload.data.object, context)
        break

      case 'customer.created':
      case 'customer.updated':
        // Sync customer data
        await dataSyncManager.syncFromProvider('stripe', 'user', context.sessionId!)
        break

      case 'invoice.payment_succeeded':
        // Handle invoice payment
        await handleInvoicePayment(payload.data.object, context)
        break
    }
  }
})

// GitHub webhook handler
webhookProcessor.registerHandler({
  providerId: 'github',
  eventTypes: [
    'issues.opened',
    'issues.closed',
    'issues.assigned',
    'pull_request.opened',
    'pull_request.closed',
    'push'
  ],
  validateSignature: (request: NextRequest, secret: string) => {
    const signature = request.headers.get('x-hub-signature-256')
    if (!signature) return false

    const body = JSON.stringify(request.body)
    const expectedSignature = 'sha256=' + crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex')

    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    )
  },
  handler: async (event: WebhookProcessingEvent, context: WebhookContext) => {
    const { payload } = event

    switch (event.eventType) {
      case 'issues.opened':
        // Create corresponding task in workflow
        await handleIssueCreated(payload, context)
        break

      case 'issues.closed':
        // Update workflow task status
        await handleIssueClosed(payload, context)
        break

      case 'pull_request.opened':
        // Handle PR opened
        await handlePullRequestOpened(payload, context)
        break

      case 'push':
        // Handle code push
        await handleCodePush(payload, context)
        break
    }
  }
})

// Jira webhook handler
webhookProcessor.registerHandler({
  providerId: 'jira',
  eventTypes: [
    'jira:issue_created',
    'jira:issue_updated',
    'jira:issue_deleted',
    'jira:worklog_updated'
  ],
  handler: async (event: WebhookProcessingEvent, context: WebhookContext) => {
    const { payload } = event

    switch (event.eventType) {
      case 'jira:issue_created':
        await handleJiraIssueCreated(payload, context)
        break

      case 'jira:issue_updated':
        await handleJiraIssueUpdated(payload, context)
        break

      case 'jira:worklog_updated':
        await handleJiraWorklogUpdated(payload, context)
        break
    }
  }
})

// Slack webhook handler
webhookProcessor.registerHandler({
  providerId: 'slack',
  eventTypes: [
    'message',
    'reaction_added',
    'channel_created',
    'member_joined_channel'
  ],
  handler: async (event: WebhookProcessingEvent, context: WebhookContext) => {
    const { payload } = event

    switch (event.eventType) {
      case 'message':
        await handleSlackMessage(payload, context)
        break

      case 'reaction_added':
        await handleSlackReaction(payload, context)
        break

      case 'channel_created':
        await handleSlackChannelCreated(payload, context)
        break
    }
  }
})

// API route handlers (to be used in Next.js API routes)
export async function handleStripeWebhook(request: NextRequest, organizationId: string) {
  return await webhookProcessor.processWebhook(request, 'stripe', organizationId)
}

export async function handleGitHubWebhook(request: NextRequest, organizationId: string) {
  return await webhookProcessor.processWebhook(request, 'github', organizationId)
}

export async function handleJiraWebhook(request: NextRequest, organizationId: string) {
  return await webhookProcessor.processWebhook(request, 'jira', organizationId)
}

export async function handleSlackWebhook(request: NextRequest, organizationId: string) {
  return await webhookProcessor.processWebhook(request, 'slack', organizationId)
}

// Webhook monitoring
export const getWebhookStats = () => {
  return {
    pendingEvents: webhookProcessor.getPendingEvents().length,
    failedEvents: webhookProcessor.getFailedEvents().length,
    totalEvents: webhookProcessor.getPendingEvents().length + webhookProcessor.getFailedEvents().length
  }
}
