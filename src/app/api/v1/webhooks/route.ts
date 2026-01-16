
import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { createClient } from '@/lib/supabase/server'
import { auth } from '@/lib/auth'

// GET /api/v1/webhooks - List webhooks
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const organizationId = searchParams.get('organizationId')
    const active = searchParams.get('active')
    const event = searchParams.get('event')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const supabase = await createClient()
    let query = supabase
      .from('webhooks')
      .select(`
        *,
        organizations (
          id,
          name,
          slug
        )
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1)

    if (organizationId) query = query.eq('organization_id', organizationId)
    if (active !== null) query = query.eq('active', active === 'true')
    if (event) query = query.contains('events', [event])

    const { data: webhooks, count, error } = await query

    if (error) {
      logger.error('Error fetching webhooks', error)
      return NextResponse.json({ error: 'Failed to fetch webhooks' }, { status: 500 })
    }

    return NextResponse.json({
      webhooks: webhooks || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit)
      }
    })
  } catch (error) {
    logger.error('Error fetching webhooks', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/v1/webhooks - Create webhook
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createClient()
    const body = await request.json()
    const { organizationId, url, events, name, description } = body

    if (!organizationId || !url || !events || !Array.isArray(events)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Verify organization exists and user has access
    const { data: userOrg } = await supabase
      .from('user_organizations')
      .select('role_id, roles(name)')
      .eq('organization_id', organizationId)
      .eq('user_id', session.user.id)
      .single()

    if (!userOrg) {
      return NextResponse.json({ error: 'Organization not found or access denied' }, { status: 404 })
    }

    const roleData = userOrg.roles as { name: string }[] | null
    const roleName = roleData && roleData.length > 0 ? roleData[0].name : null
    if (!roleName || !['owner', 'admin'].includes(roleName)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    // Create webhook
    const { data: webhook, error } = await supabase
      .from('webhooks')
      .insert({
        organization_id: organizationId,
        url,
        events,
        name: name || 'Webhook',
        description,
        active: true,
        secret: generateWebhookSecret(),
        created_by_id: session.user.id
      })
      .select(`
        *,
        organizations (
          id,
          name,
          slug
        )
      `)
      .single()

    if (error) {
      logger.error('Error creating webhook', error)
      return NextResponse.json({ error: 'Failed to create webhook' }, { status: 500 })
    }

    return NextResponse.json(webhook, { status: 201 })
  } catch (error) {
    logger.error('Error creating webhook', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/v1/webhooks/[id] - Update webhook
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createClient()
    const body = await request.json()
    const { url, events, name, description, active } = body

    if (!id) {
      return NextResponse.json({ error: 'Webhook ID required' }, { status: 400 })
    }

    // Find webhook
    const { data: webhook } = await supabase
      .from('webhooks')
      .select('organization_id')
      .eq('id', id)
      .single()

    if (!webhook) {
      return NextResponse.json({ error: 'Webhook not found' }, { status: 404 })
    }

    // Verify user has access
    const { data: userOrg } = await supabase
      .from('user_organizations')
      .select('role_id, roles(*)')
      .eq('organization_id', webhook.organization_id)
      .eq('user_id', session.user.id)
      .single()

    if (!userOrg) {
      return NextResponse.json({ error: 'Organization not found or access denied' }, { status: 404 })
    }

    const roleData = userOrg.roles as { name: string }[] | null
    const roleName = roleData && roleData.length > 0 ? roleData[0].name : null
    if (!roleName || !['owner', 'admin'].includes(roleName)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    // Update webhook
    const updates: Record<string, unknown> = {}
    if (url) updates.url = url
    if (events && Array.isArray(events)) updates.events = events
    if (name) updates.name = name
    if (description !== undefined) updates.description = description
    if (active !== undefined) updates.active = active

    const { data: updatedWebhook, error } = await supabase
      .from('webhooks')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        organizations (
          id,
          name,
          slug
        )
      `)
      .single()

    if (error) {
      logger.error('Error updating webhook', error)
      return NextResponse.json({ error: 'Failed to update webhook' }, { status: 500 })
    }

    return NextResponse.json(updatedWebhook)
  } catch (error) {
    logger.error('Error updating webhook', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/v1/webhooks/[id] - Delete webhook
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createClient()

    if (!id) {
      return NextResponse.json({ error: 'Webhook ID required' }, { status: 400 })
    }

    // Find webhook
    const { data: webhook } = await supabase
      .from('webhooks')
      .select('organization_id')
      .eq('id', id)
      .single()

    if (!webhook) {
      return NextResponse.json({ error: 'Webhook not found' }, { status: 404 })
    }

    // Verify user has access
    const { data: userOrg } = await supabase
      .from('user_organizations')
      .select('role_id, roles(*)')
      .eq('organization_id', webhook.organization_id)
      .eq('user_id', session.user.id)
      .single()

    if (!userOrg) {
      return NextResponse.json({ error: 'Organization not found or access denied' }, { status: 404 })
    }

    const roleData = userOrg.roles as { name: string }[] | null
    const roleName = roleData && roleData.length > 0 ? roleData[0].name : null
    if (!roleName || !['owner', 'admin'].includes(roleName)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    // Delete webhook
    const { error } = await supabase
      .from('webhooks')
      .delete()
      .eq('id', id)

    if (error) {
      logger.error('Error deleting webhook', error)
      return NextResponse.json({ error: 'Failed to delete webhook' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Webhook deleted successfully' })
  } catch (error) {
    logger.error('Error deleting webhook', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Helper function to generate webhook secret
function generateWebhookSecret(): string {
  return 'whsec_' + Buffer.from(crypto.getRandomValues(new Uint8Array(32))).toString('base64')
}
