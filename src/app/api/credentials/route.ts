
import { NextRequest, NextResponse } from "next/server"
import { logger } from "@/lib/logger"
import { auth } from "@/auth"
import { createClient } from "@/lib/supabase/server"

// GET /api/credentials - List credentials for authenticated user's organizations
export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await createClient()

    const { searchParams } = new URL(request.url)
    const eventId = searchParams.get('eventId')
    const status = searchParams.get('status')
    const organizationId = searchParams.get('organizationId') || session.user.organizationId
    const limit = parseInt(searchParams.get('limit') || '50')

    let query = supabase
      .from('credentials')
      .select(`
        *,
        event:event_id(id, name, slug),
        person:person_id(id, first_name, last_name, email, company, role)
      `)
      .order('valid_from', { ascending: true })
      .limit(limit)

    if (organizationId) {
      query = query.eq('organization_id', organizationId)
    }

    if (eventId) {
      query = query.eq('event_id', eventId)
    }

    if (status) {
      query = query.eq('status', status)
    }

    const { data: credentials, error } = await query

    if (error) {
      throw error
    }

    return NextResponse.json({ credentials: credentials || [] })
  } catch (error) {
    logger.error("Error fetching credentials", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/credentials - Create new credential
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { event_id, person_id, type, level, zones, department, position, valid_from, valid_to, organization_id } = body

    const supabase = await createClient()

    const orgId = organization_id || session.user.organizationId
    if (!event_id || !person_id || !type || !level || !valid_from || !valid_to) {
      return NextResponse.json({
        error: "event_id, person_id, type, level, valid_from, and valid_to are required"
      }, { status: 400 })
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

    // Create credential
    const { data: credential, error } = await supabase
      .from('credentials')
      .insert({
        organization_id: orgId,
        event_id,
        person_id,
        type,
        level,
        zones: zones || [],
        department: department || null,
        position: position || null,
        valid_from,
        valid_to,
        status: 'active'
      })
      .select(`
        *,
        event:event_id(id, name, slug),
        person:person_id(id, first_name, last_name, email, company)
      `)
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({ credential }, { status: 201 })
  } catch (error) {
    logger.error("Error creating credential", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
