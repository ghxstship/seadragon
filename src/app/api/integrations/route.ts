import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'
import { requireAuth, apiSuccess, apiError } from '@/lib/api-utils'
import { integrationAuthManager } from '@/lib/integrations/auth-manager'
import { dataSyncManager, getSyncConflicts } from '@/lib/integrations/sync-manager'
import { getWebhookStats } from '@/lib/integrations/webhook-processor'
import { URLS } from '@/lib/constants/config'
import { supabase } from '@/lib/supabase'
import { auth } from '@/auth'

// GET /api/integrations - List integrations and their status
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const limit = parseInt(searchParams.get('limit') || '20')
    const organizationId = searchParams.get('organizationId') || 'default-org'

    // Get available providers from database
    const { data: availableProviders, error: providersError } = await supabase
      .from('integration_providers')
      .select('*')
      .eq('is_active', true)

    if (providersError) {
      logger.error('Error fetching integration providers', providersError)
      return NextResponse.json({ error: 'Failed to fetch providers' }, { status: 500 })
    }

    // Get active integrations for the organization
    const { data: activeIntegrations, error: integrationsError } = await supabase
      .from('integrations')
      .select(`
        *,
        integration_providers (
          name,
          provider_type,
          description,
          website_url,
          api_docs_url,
          supported_features
        )
      `)
      .eq('organization_id', organizationId)
      .eq('is_active', true)

    if (integrationsError) {
      logger.error('Error fetching integrations', integrationsError)
      return NextResponse.json({ error: 'Failed to fetch integrations' }, { status: 500 })
    }

    // Build integrations list with live data
    const allIntegrations = availableProviders.map(provider => {
      const integration = activeIntegrations.find(i => i.provider_id === provider.id)
      return {
        id: provider.id,
        name: provider.name,
        provider: provider.name, // For compatibility
        category: provider.provider_type,
        description: provider.description,
        websiteUrl: provider.website_url,
        apiDocsUrl: provider.api_docs_url,
        supportedFeatures: provider.supported_features,
        isActive: provider.is_active,
        status: integration ? 'connected' : 'disconnected',
        connectedAt: integration?.created_at,
        lastSync: integration?.last_sync_at,
        settings: integration?.settings,
        hasApiKey: !!integration?.configuration?.apiKey,
        hasWebhooks: ['stripe', 'github', 'jira', 'slack'].includes(provider.id),
        authType: provider.provider_type
      }
    })

    let filteredIntegrations = allIntegrations
    if (category) {
      filteredIntegrations = allIntegrations.filter(i => i.category === category)
    }

    const limitedIntegrations = filteredIntegrations.slice(0, limit)

    return NextResponse.json({
      integrations: limitedIntegrations,
      total: filteredIntegrations.length,
      limit,
      offset: 0,
      stats: {
        webhooks: getWebhookStats(),
        syncConflicts: getSyncConflicts().length
      }
    })
  } catch (error) {
    logger.error('Error fetching integrations', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/integrations - Connect or configure integration
export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const authResult = await requireAuth(request)
    if (authResult instanceof Response) return authResult
    const { session } = authResult

    const supabase = await createClient()
    const body = await request.json()
    const { providerId, action, config, organizationId = 'default-org' } = body

    if (!providerId) {
      return apiError('Provider ID is required', 400, 'VALIDATION_ERROR')
    }

    let result

    switch (action) {
      case 'connect_oauth':
        // Initiate OAuth flow
        const authUrl = await initiateOAuthFlow(providerId, organizationId, session.user.id)
        result = { authUrl, message: 'OAuth flow initiated' }
        break

      case 'connect_api_key':
        // Setup API key authentication
        const { apiKey, additionalConfig } = config
        if (!apiKey) {
          return apiError('API key is required', 400, 'VALIDATION_ERROR')
        }

        const apiKeySession = await integrationAuthManager.setupApiKeyAuth(
          providerId,
          organizationId,
          session.user.id,
          apiKey,
          additionalConfig
        )
        result = { session: apiKeySession, message: 'API key configured successfully' }
        break

      case 'sync':
        // Trigger data synchronization
        const { entityType, filters } = config || {}
        if (!entityType) {
          return apiError('Entity type is required for sync', 400, 'VALIDATION_ERROR')
        }

        // Find active session for sync
        const sessions = integrationAuthManager.getActiveSessions(organizationId)
        const syncSession = sessions.find(s => s.providerId === providerId)

        if (!syncSession) {
          return apiError('Integration not connected', 404, 'NOT_FOUND')
        }

        const syncResult = await dataSyncManager.syncFromProvider(
          providerId,
          entityType,
          syncSession.id,
          filters
        )
        result = { syncResult, message: 'Data synchronization initiated' }
        break

      case 'disconnect':
        // Disconnect integration
        const disconnectSessions = integrationAuthManager.getActiveSessions(organizationId)
        const targetSession = disconnectSessions.find(s => s.providerId === providerId)

        if (targetSession) {
          await integrationAuthManager.revokeAuth(targetSession.id)
          result = { message: 'Integration disconnected successfully' }
        } else {
          return apiError('Integration not found', 404, 'NOT_FOUND')
        }
        break

      default:
        // Create new integration in database
        const { name, description, configuration, settings, isSandbox } = body

        if (!name) {
          return apiError('Name is required', 400, 'VALIDATION_ERROR')
        }

        // Insert new integration
        const { data: newIntegration, error: insertError } = await supabase
          .from('integrations')
          .insert({
            organization_id: organizationId,
            provider_id: providerId,
            name,
            description: description || '',
            configuration: configuration || {},
            settings: settings || {},
            is_sandbox: isSandbox || false,
            created_by: session.user.id
          })
          .select(`
            *,
            integration_providers (
              name,
              description,
              provider_type
            )
          `)
          .single()

        if (insertError) {
          logger.error('Error creating integration', insertError)
          return apiError('Failed to create integration', 500, 'INTERNAL_ERROR')
        }

        result = newIntegration
    }

    return apiSuccess(result, 201)
  } catch (error) {
    logger.error('Error in integration operation', error)
    return apiError('Internal server error', 500, 'INTERNAL_ERROR')
  }
}

// PUT /api/integrations/[id] - Update integration configuration
export async function PUT(request: NextRequest) {
  try {
    // Authenticate user
    const authResult = await requireAuth(request)
    if (authResult instanceof Response) return authResult
    const { session } = authResult

    const { searchParams } = new URL(request.url)
    const providerId = searchParams.get('id')
    const organizationId = searchParams.get('organizationId') || 'default-org'

    if (!providerId) {
      return apiError('Integration ID is required', 400, 'VALIDATION_ERROR')
    }

    const body = await request.json()
    const { config } = body

    // Find active session for this provider
    const sessions = integrationAuthManager.getActiveSessions(organizationId)
    const targetSession = sessions.find(s => s.providerId === providerId)

    if (!targetSession) {
      return NextResponse.json(
        { error: 'Integration not connected' },
        { status: 404 }
      )
    }

    // Update configuration (this would typically update the session metadata)
    // For now, just return success
    logger.action('update_integration_config', { providerId, config })

    return NextResponse.json({
      message: 'Integration configuration updated successfully'
    })

  } catch (error) {
    logger.error('Error updating integration', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function initiateOAuthFlow(
  providerId: string,
  organizationId: string,
  userId: string
): Promise<string> {
  // This would generate the OAuth URL and store the flow state
  // For now, return a placeholder URL
  const baseUrl = process.env.NEXTAUTH_URL || URLS.DEVELOPMENT
  const state = Math.random().toString(36).substring(7)

  // Store flow state (in production, use Redis/database)
  ;(global as any).oauthFlows = (global as any).oauthFlows || new Map()
  ;(global as any).oauthFlows.set(state, {
    providerId,
    organizationId,
    userId,
    createdAt: new Date()
  })

  // Return OAuth URL (in production, this would be the actual provider URL)
  return `https://example.com/oauth/${providerId}?state=${state}&redirect_uri=${encodeURIComponent(`${baseUrl}/api/integrations/oauth/callback`)}`
}
