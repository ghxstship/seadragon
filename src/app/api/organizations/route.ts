
import { NextRequest, NextResponse } from "next/server"
import { logger } from "@/lib/logger"
import { auth } from "@/auth"
import { createClient } from "@/lib/supabase/server"

// User organization data interface
interface UserOrganization {
  id: string
  is_active: boolean
  organization: {
    id: string
    name: string
    slug: string
    description?: string
    logo_url?: string
    created_at: string
  }
  role: {
    id: string
    name: string
    permissions: string[]
  }
}

// GET /api/organizations - List organizations for authenticated user
export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await createClient()

    const userId = session.user.id

    // Get all organizations the user belongs to
    const { data: userOrganizations, error } = await supabase
      .from('user_organizations')
      .select(`
        id,
        is_active,
        organization:organization_id(
          id,
          name,
          slug,
          description,
          logo_url,
          created_at
        ),
        role:role_id(
          id,
          name,
          permissions
        )
      `)
      .eq('user_id', userId)
      .eq('is_active', true)

    if (error) throw error

    const organizations = (userOrganizations || []).map((uo: UserOrganization) => ({
      ...uo.organization,
      role: uo.role?.name,
      permissions: uo.role?.permissions
    }))

    return NextResponse.json({ organizations })
  } catch (error) {
    logger.error("Error fetching organizations", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/organizations - Create new organization
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, slug } = body

    const supabase = await createClient()

    if (!name || !slug) {
      return NextResponse.json({ error: "Name and slug are required" }, { status: 400 })
    }

    // Check if slug is unique
    const { data: existingOrg } = await supabase
      .from('organizations')
      .select('id')
      .eq('slug', slug)
      .single()

    if (existingOrg) {
      return NextResponse.json({ error: "Organization slug already exists" }, { status: 400 })
    }

    // Create organization
    const { data: organization, error: orgError } = await supabase
      .from('organizations')
      .insert({
        name,
        slug
      })
      .select()
      .single()

    if (orgError) throw orgError

    // Create default admin role
    const { data: adminRole, error: roleError } = await supabase
      .from('roles')
      .insert({
        name: "admin",
        description: "Organization Administrator",
        organization_id: organization.id,
        permissions: ["read", "write", "delete", "manage_users", "manage_settings"]
      })
      .select()
      .single()

    if (roleError) throw roleError

    // Add user as admin
    await supabase
      .from('user_organizations')
      .insert({
        user_id: session.user.id,
        organization_id: organization.id,
        role_id: adminRole.id,
        is_active: true
      })

    return NextResponse.json({ organization }, { status: 201 })
  } catch (error) {
    logger.error("Error creating organization", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
