import { NextRequest, NextResponse } from "next/server"
import { logger } from "@/lib/logger"
import { auth } from "@/auth"
import { createClient } from "@/lib/supabase/server"
import { safeJsonParse } from "@/lib/safe-json"
import { withOrgContext } from "@/lib/middleware"

// GET /api/projects - List projects for user's organizations
export const GET = withOrgContext(async (request: NextRequest) => {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const workspaceId = searchParams.get('workspaceId')
    const status = searchParams.get('status')
    const type = searchParams.get('type')

    // Get user's organizations first
    const { data: userOrganizations } = await supabase
      .from('user_organizations')
      .select('organization_id')
      .eq('user_id', session.user.id)
      .eq('is_active', true)

    const organizationIds = (userOrganizations || []).map((uo) => uo.organization_id)

    // Build query for projects
    let query = supabase
      .from('projects')
      .select(`
        *,
        workspaces (
          id,
          name,
          slug,
          organization_id,
          organizations (
            id,
            name,
            slug
          )
        )
      `)
      .in('workspaces.organization_id', organizationIds)
      .order('updated_at', { ascending: false })

    if (workspaceId) query = query.eq('workspace_id', workspaceId)
    if (status) query = query.eq('status', status)
    if (type) query = query.eq('type', type)

    const { data: projects, error } = await query

    if (error) {
      logger.error('Error fetching projects', error)
      return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
    }

    return NextResponse.json({ projects: projects || [] })
  } catch (error) {
    logger.error('Error fetching projects', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
})

// POST /api/projects - Create new project
export const POST = withOrgContext(async (request: NextRequest) => {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createClient()
    const body = await request.json()
    const { name, slug, description, workspaceId, status, startDate, endDate } = body

    if (!name || !slug || !workspaceId) {
      return NextResponse.json(
        { error: 'Name, slug, and workspace ID are required' },
        { status: 400 }
      )
    }

    // Verify user has access to the workspace
    const { data: workspace } = await supabase
      .from('workspaces')
      .select('organization_id')
      .eq('id', workspaceId)
      .single()

    if (!workspace) {
      return NextResponse.json(
        { error: 'Access denied to this workspace' },
        { status: 403 }
      )
    }

    // Check if user has permission to create projects
    const { data: userOrg } = await supabase
      .from('user_organizations')
      .select('is_active, roles(permissions)')
      .eq('user_id', session.user.id)
      .eq('organization_id', workspace.organization_id)
      .single()

    if (!userOrg || !userOrg.is_active) {
      return NextResponse.json(
        { error: 'Access denied to this organization' },
        { status: 403 }
      )
    }

    const roleData = userOrg.roles as { permissions: string[] | string }[] | null
    const permissions = roleData && roleData.length > 0
      ? (Array.isArray(roleData[0].permissions)
          ? roleData[0].permissions
          : safeJsonParse((roleData[0].permissions as string) || '[]') || [])
      : []

    if (!permissions.includes('project:create')) {
      return NextResponse.json(
        { error: 'Insufficient permissions to create projects' },
        { status: 403 }
      )
    }

    // Check if slug is unique within workspace
    const { data: existingProject } = await supabase
      .from('projects')
      .select('id')
      .eq('workspace_id', workspaceId)
      .eq('slug', slug)
      .single()

    if (existingProject) {
      return NextResponse.json(
        { error: 'Project slug already exists in this workspace' },
        { status: 400 }
      )
    }

    // Create project
    const { data: project, error } = await supabase
      .from('projects')
      .insert({
        name,
        slug,
        description,
        workspace_id: workspaceId,
        status: status || 'concept',
        start_date: startDate || null,
        end_date: endDate || null
      })
      .select(`
        *,
        workspaces (
          id,
          name,
          slug,
          organizations (
            id,
            name,
            slug
          )
        )
      `)
      .single()

    if (error) {
      logger.error('Error creating project', error)
      return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })
    }

    // Log the creation
    await supabase
      .from('activities')
      .insert({
        user_id: session.user.id,
        action: 'create',
        entity: 'project',
        entity_id: project.id,
        details: { name, slug, workspaceId, status }
      })

    return NextResponse.json({ project }, { status: 201 })
  } catch (error) {
    logger.error('Error creating project', error)
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    )
  }
})
