
import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { auth } from '@/auth'
import { createClient } from '@/lib/supabase/server'
import { safeJsonParse } from '@/lib/safe-json'

// GET /api/organizations/[organizationId]/workspaces - Get organization's workspaces
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ organizationId: string }> }
) {
  const { organizationId } = await params
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createClient()

    // Verify user has access to this organization
    const { data: userOrg } = await supabase
      .from('user_organizations')
      .select('is_active')
      .eq('user_id', session.user.id)
      .eq('organization_id', organizationId)
      .single()

    if (!userOrg || !userOrg.is_active) {
      return NextResponse.json(
        { error: 'Access denied to this organization' },
        { status: 403 }
      )
    }

    // Get organization's workspaces
    const { data: workspaces, error } = await supabase
      .from('workspaces')
      .select('*')
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: true })

    if (error) {
      logger.error('Error fetching workspaces', error)
      return NextResponse.json({ error: 'Failed to fetch workspaces' }, { status: 500 })
    }

    return NextResponse.json(workspaces || [])
  } catch (error) {
    logger.error('Error fetching workspaces', error)
    return NextResponse.json(
      { error: 'Failed to fetch workspaces' },
      { status: 500 }
    )
  }
}

// POST /api/organizations/[organizationId]/workspaces - Create new workspace
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ organizationId: string }> }
) {
  const { organizationId } = await params
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createClient()
    const { name, description } = await request.json()

    if (!name) {
      return NextResponse.json(
        { error: 'Workspace name is required' },
        { status: 400 }
      )
    }

    // Verify user has admin access to this organization
    const { data: userOrg } = await supabase
      .from('user_organizations')
      .select('is_active, roles(permissions)')
      .eq('user_id', session.user.id)
      .eq('organization_id', organizationId)
      .single()

    if (!userOrg || !userOrg.is_active) {
      return NextResponse.json(
        { error: 'Access denied to this organization' },
        { status: 403 }
      )
    }

    // Check if user has permission to create workspaces
    const roleData = userOrg.roles as unknown as { permissions: string[] | string } | null
    const permissions = Array.isArray(roleData?.permissions)
      ? roleData.permissions
      : safeJsonParse((roleData?.permissions as string) || '[]') || []

    if (!permissions.includes('workspace:create')) {
      return NextResponse.json(
        { error: 'Insufficient permissions to create workspaces' },
        { status: 403 }
      )
    }

    // Generate unique slug
    const baseSlug = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
    let slug = baseSlug
    let counter = 1

    // Check for existing slug
    let existingSlug = true
    while (existingSlug) {
      const { data } = await supabase
        .from('workspaces')
        .select('id')
        .eq('organization_id', organizationId)
        .eq('slug', slug)
        .single()
      
      if (!data) {
        existingSlug = false
      } else {
        slug = `${baseSlug}-${counter}`
        counter++
      }
    }

    // Create workspace
    const { data: workspace, error } = await supabase
      .from('workspaces')
      .insert({
        name,
        slug,
        description,
        organization_id: organizationId
      })
      .select()
      .single()

    if (error) {
      logger.error('Error creating workspace', error)
      return NextResponse.json({ error: 'Failed to create workspace' }, { status: 500 })
    }

    // Log the creation
    await supabase
      .from('activities')
      .insert({
        user_id: session.user.id,
        action: 'create',
        entity: 'workspace',
        entity_id: workspace.id,
        details: { name, slug }
      })

    return NextResponse.json(workspace, { status: 201 })
  } catch (error) {
    logger.error('Error creating workspace', error)
    return NextResponse.json(
      { error: 'Failed to create workspace' },
      { status: 500 }
    )
  }
}
