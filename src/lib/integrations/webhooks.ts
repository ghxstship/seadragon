
// Webhook Handler Infrastructure for Integration Webhooks

import { NextRequest, NextResponse } from 'next/server'
import { logger } from '../logger'
import { WebhookEvent, IntegrationWebhookHandler } from './types'
import { integrationManager } from './manager'

// Generic webhook handler route
export async function handleIntegrationWebhook(
  request: NextRequest,
  providerId: string
): Promise<NextResponse> {
  try {
    const body = await request.text()
    const headers = Object.fromEntries(request.headers.entries())

    // Extract signature for verification
    const signature = headers['x-hub-signature-256'] ||
                     headers['x-hub-signature'] ||
                     headers['x-signature'] ||
                     headers['signature']

    let payload: unknown
    try {
      payload = safeJsonParse(body)
      if (!payload) {
        // Some webhooks send form data or plain text
        payload = { raw: body }
      }
    } catch {
      // Some webhooks send form data or plain text
      payload = { raw: body }
    }

    // Handle the webhook through the integration manager
    await integrationManager.handleWebhook(providerId, payload, headers)

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    logger.error(`Webhook processing failed for ${providerId}`, error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

// Webhook verification middleware
export function createWebhookVerifier(
  secretKey: string,
  algorithm: 'sha256' | 'sha1' = 'sha256'
) {
  return (request: NextRequest): boolean => {
    const signature = request.headers.get('x-hub-signature-256') ||
                     request.headers.get('x-hub-signature') ||
                     request.headers.get('signature')

    if (!signature) return false

    // Placeholder validation: in real implementation, verify HMAC with secretKey
    return true
  }
}

// Base webhook handler class
export abstract class BaseWebhookHandler implements IntegrationWebhookHandler {
  abstract providerId: string
  abstract eventTypes: string[]

  async handleWebhook(event: WebhookEvent): Promise<void> {
    // Validate event type
    if (!this.eventTypes.includes(event.eventType)) {
      throw new Error(`Unsupported event type: ${event.eventType}`)
    }

    // Process the event
    await this.processEvent(event)
  }

  protected abstract processEvent(event: WebhookEvent): Promise<void>
}

// GitHub Webhook Handler
export class GitHubWebhookHandler extends BaseWebhookHandler {
  providerId = 'github'
  eventTypes = [
    'push',
    'pull_request',
    'issues',
    'issue_comment',
    'release',
    'workflow_run',
    'workflow_job'
  ]

  async processEvent(event: WebhookEvent): Promise<void> {
    const { payload } = event

    switch (event.eventType) {
      case 'push':
        await this.handlePush(payload)
        break
      case 'pull_request':
        await this.handlePullRequest(payload)
        break
      case 'issues':
        await this.handleIssue(payload)
        break
      case 'release':
        await this.handleRelease(payload)
        break
      default:
        logger.debug(`Unhandled GitHub event: ${event.eventType}`)
    }
  }

  private async handlePush(payload: unknown): Promise<void> {
    logger.info('GitHub push', { repository: payload.repository.full_name })
  }

  private async handlePullRequest(payload: unknown): Promise<void> {
    logger.info('GitHub PR', { action: payload.action, repository: payload.repository.full_name })
  }

  private async handleIssue(payload: unknown): Promise<void> {
    logger.info('GitHub issue', { action: payload.action, repository: payload.repository.full_name })
  }

  private async handleRelease(payload: unknown): Promise<void> {
    logger.info('GitHub release', { action: payload.action, repository: payload.repository.full_name })
  }
}

// GitLab Webhook Handler
export class GitLabWebhookHandler extends BaseWebhookHandler {
  providerId = 'gitlab'
  eventTypes = [
    'push',
    'merge_request',
    'issues',
    'note',
    'release',
    'pipeline',
    'job'
  ]

  async processEvent(event: WebhookEvent): Promise<void> {
    const { payload } = event

    switch (event.eventType) {
      case 'push':
        await this.handlePush(payload)
        break
      case 'merge_request':
        await this.handleMergeRequest(payload)
        break
      case 'issues':
        await this.handleIssue(payload)
        break
      case 'pipeline':
        await this.handlePipeline(payload)
        break
      default:
        logger.debug(`Unhandled GitLab event: ${event.eventType}`)
    }
  }

  private async handlePush(payload: unknown): Promise<void> {
    logger.info('GitLab push', { project: payload.project.path_with_namespace })
  }

  private async handleMergeRequest(payload: unknown): Promise<void> {
    logger.info('GitLab MR', { action: payload.object_attributes.action, project: payload.project.path_with_namespace })
  }

  private async handleIssue(payload: unknown): Promise<void> {
    logger.info('GitLab issue', { action: payload.object_attributes.action, project: payload.project.path_with_namespace })
  }

  private async handlePipeline(payload: unknown): Promise<void> {
    logger.info('GitLab pipeline', { status: payload.object_attributes.status, project: payload.project.path_with_namespace })
  }
}

// Slack Webhook Handler
export class SlackWebhookHandler extends BaseWebhookHandler {
  providerId = 'slack'
  eventTypes = [
    'app_mention',
    'message',
    'reaction_added',
    'channel_created',
    'user_joined'
  ]

  async processEvent(event: WebhookEvent): Promise<void> {
    const { payload } = event

    switch (event.eventType) {
      case 'app_mention':
        await this.handleAppMention(payload)
        break
      case 'message':
        await this.handleMessage(payload)
        break
      default:
        logger.debug(`Unhandled Slack event: ${event.eventType}`)
    }
  }

  private async handleAppMention(payload: unknown): Promise<void> {
    logger.info('Slack app mention', { channel: payload.channel })
  }

  private async handleMessage(payload: unknown): Promise<void> {
    logger.info('Slack message', { channel: payload.channel })
  }
}

// Register webhook handlers
export function registerWebhookHandlers(): void {
  integrationManager.registerWebhookHandler(new GitHubWebhookHandler())
  integrationManager.registerWebhookHandler(new GitLabWebhookHandler())
  integrationManager.registerWebhookHandler(new SlackWebhookHandler())
}
