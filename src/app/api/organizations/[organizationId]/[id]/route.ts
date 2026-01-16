
import { NextRequest, NextResponse } from "next/server"
import { logger } from "@/lib/logger"
import { auth } from "@/auth"
import { createClient } from "@/lib/supabase/server"

// GET /api/organizations/[id] - Get organization details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await auth()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await createClient()
    const organizationId = id

    // Check if user has access to this organization
    const { data: userOrg } = await supabase
      .from('user_organizations')
      .select('*, roles(*)')
      .eq('user_id', session.user.id)
      .eq('organization_id', organizationId)
      .eq('is_active', true)
      .single()

    if (!userOrg) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    // Get organization with related data
    const { data: organization } = await supabase
      .from('organizations')
      .select('*, workspaces(*), user_organizations(*, users(*), roles(*)), teams(*)')
      .eq('id', organizationId)
      .single()

    if (!organization) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 })
    }

    return NextResponse.json({
      organization: {
        ...organization,
        role: userOrg.roles?.name,
        permissions: userOrg.roles?.permissions
      }
    })
  } catch (error) {
    logger.error("Error fetching organization", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT /api/organizations/[id] - Update organization
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await auth()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await createClient()
    const organizationId = id
    const body = await request.json()

    // Check if user has admin access
    const { data: userOrg } = await supabase
      .from('user_organizations')
      .select('*, roles(permissions)')
      .eq('user_id', session.user.id)
      .eq('organization_id', organizationId)
      .eq('is_active', true)
      .single()

    const permissions = userOrg?.roles?.permissions || []
    if (!userOrg || !permissions.includes("manage_settings")) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    // Update organization
    const { data: updatedOrganization, error } = await supabase
      .from('organizations')
      .update({
        name: body.name,
        slug: body.slug,
        domain: body.domain
      })
      .eq('id', organizationId)
      .select()
      .single()

    if (error) {
      logger.error("Error updating organization", error)
      return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }

    return NextResponse.json({ organization: updatedOrganization })
  } catch (error) {
    logger.error("Error updating organization", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE /api/organizations/[id] - Delete organization
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await auth()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await createClient()
    const organizationId = id

    // Check if user has admin access
    const { data: userOrg } = await supabase
      .from('user_organizations')
      .select('*, roles(permissions)')
      .eq('user_id', session.user.id)
      .eq('organization_id', organizationId)
      .eq('is_active', true)
      .single()

    const permissions = userOrg?.roles?.permissions || []
    if (!userOrg || !permissions.includes("manage_settings")) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    // Delete organization
    const { error } = await supabase
      .from('organizations')
      .delete()
      .eq('id', organizationId)

    if (error) {
      logger.error("Error deleting organization", error)
      return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }

    return NextResponse.json({ message: "Organization deleted successfully" })
  } catch (error) {
    logger.error("Error deleting organization", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
