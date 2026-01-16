
import { NextRequest, NextResponse } from "next/server"
import { logger } from "@/lib/logger"
import { auth } from "@/auth"
import { createClient } from "@/lib/supabase/server"

// GET /api/people - List people for authenticated user's organizations
export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await createClient()

    const { searchParams } = new URL(request.url)
    const organizationId = searchParams.get('organizationId') || session.user.organizationId
    const type = searchParams.get('type')
    const limit = parseInt(searchParams.get('limit') || '50')

    let query = supabase
      .from('legend_people')
      .select('*')
      .order('display_name', { ascending: true })
      .limit(limit)

    if (organizationId) {
      query = query.eq('organization_id', organizationId)
    }

    if (type) {
      query = query.eq('status', type)
    }

    const { data: people, error } = await query

    if (error) {
      throw error
    }

    return NextResponse.json({ people: people || [] })
  } catch (error) {
    logger.error("Error fetching people", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/people - Create new person
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { first_name, last_name, email, phone, title, organization_id } = body

    const supabase = await createClient()

    const orgId = organization_id || session.user.organizationId
    if (!first_name || !last_name || !orgId) {
      return NextResponse.json({ error: "First name, last name, and organization_id are required" }, { status: 400 })
    }

    // Verify user has access to the organization
    const { data: userOrg, error: userOrgError } = await supabase
      .from('user_organizations')
      .select('id')
      .eq('user_id', session.user.id)
      .eq('organization_id', orgId)
      .eq('is_active', true)
      .single()

    if (userOrgError || !userOrg) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    // Create person
    const { data: person, error } = await supabase
      .from('legend_people')
      .insert({
        organization_id: orgId,
        first_name,
        last_name,
        display_name: `${first_name} ${last_name}`,
        email: email || null,
        phone: phone || null,
        title: title || null,
        status: 'active'
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({ person }, { status: 201 })
  } catch (error) {
    logger.error("Error creating person", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
