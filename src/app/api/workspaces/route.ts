import { NextRequest, NextResponse } from "next/server"
import { logger } from "@/lib/logger"
import { auth } from "@/auth"
import { createClient } from "@/lib/supabase/server"
import { safeJsonParse } from "@/lib/safe-json"

// GET /api/workspaces - List workspaces for authenticated user's organizations
export async function GET() {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await createClient()
    const userId = session.user.id

    // Get user's organizations first
    const { data: userOrgs } = await supabase
      .from('user_organizations')
      .select('organization_id')
      .eq('user_id', userId)
      .eq('is_active', true)

    const orgIds = (userOrgs || []).map(uo => uo.organization_id)

    // Get workspaces from those organizations
    const { data: workspaces, error } = await supabase
      .from('workspaces')
      .select(`
        *,
        organizations (
          id,
          name,
          slug
        )
      `)
      .in('organization_id', orgIds)
      .order('updated_at', { ascending: false })

    if (error) {
      logger.error("Error fetching workspaces", error)
      return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }

    return NextResponse.json({ workspaces: workspaces || [] })
  } catch (error) {
    logger.error("Error fetching workspaces", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/workspaces - Create new workspace
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await createClient()
    const body = await request.json()
    const { name, slug, description, organizationId } = body

    if (!name || !slug || !organizationId) {
      return NextResponse.json({ error: "Name, slug, and organization ID are required" }, { status: 400 })
    }

    // Check if user has access to the organization
    const { data: userOrg } = await supabase
      .from('user_organizations')
      .select('is_active, roles(permissions)')
      .eq('user_id', session.user.id)
      .eq('organization_id', organizationId)
      .eq('is_active', true)
      .single()

    const roleData = userOrg?.roles as unknown as { permissions: string[] | string } | null
    const permissions = Array.isArray(roleData?.permissions)
      ? roleData.permissions
      : safeJsonParse((roleData?.permissions as string) || '[]') || []

    if (!userOrg || !permissions.includes("write")) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    // Check if slug is unique within organization
    const { data: existingWorkspace } = await supabase
      .from('workspaces')
      .select('id')
      .eq('organization_id', organizationId)
      .eq('slug', slug)
      .single()

    if (existingWorkspace) {
      return NextResponse.json({ error: "Workspace slug already exists in this organization" }, { status: 400 })
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
      logger.error("Error creating workspace", error)
      return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }

    return NextResponse.json({ workspace }, { status: 201 })
  } catch (error) {
    logger.error("Error creating workspace", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
