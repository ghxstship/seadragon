
import { NextRequest, NextResponse } from "next/server"
import { logger } from "@/lib/logger"
import { auth } from "@/auth"
import { createClient } from "@/lib/supabase/server"

// GET /api/events - List events for authenticated user's organizations
export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await createClient()
    const userId = session.user.id
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')
    const status = searchParams.get('status')

    // Build query for events with related data
    let query = supabase
      .from('events')
      .select(`
        *,
        projects!inner (
          id,
          name,
          slug,
          workspaces!inner (
            id,
            name,
            slug,
            organizations!inner (
              id,
              name,
              slug,
              user_organizations!inner (
                user_id,
                is_active
              )
            )
          )
        ),
        venues (
          id,
          name,
          address
        )
      `)
      .eq('projects.workspaces.organizations.user_organizations.user_id', userId)
      .eq('projects.workspaces.organizations.user_organizations.is_active', true)
      .order('start_date', { ascending: true })

    if (projectId) {
      query = query.eq('project_id', projectId)
    }

    if (status) {
      query = query.eq('status', status)
    }

    const { data: events, error } = await query

    if (error) {
      logger.error("Error fetching events", error)
      return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 })
    }

    return NextResponse.json({ events: events || [] })
  } catch (error) {
    logger.error("Error fetching events", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/events - Create new event
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await createClient()
    const body = await request.json()
    const { name, slug, description, projectId, venueId, startDate, endDate, capacity } = body

    if (!name || !slug || !projectId || !startDate || !endDate) {
      return NextResponse.json({ error: "Name, slug, project ID, start date, and end date are required" }, { status: 400 })
    }

    // Check if user has access to the project
    const { data: project } = await supabase
      .from('projects')
      .select(`
        id,
        workspace_id,
        workspaces!inner (
          organization_id,
          organizations!inner (
            id,
            user_organizations!inner (
              user_id,
              is_active,
              role_id,
              roles!inner (
                permissions
              )
            )
          )
        )
      `)
      .eq('id', projectId)
      .eq('workspaces.organizations.user_organizations.user_id', session.user.id)
      .eq('workspaces.organizations.user_organizations.is_active', true)
      .single()

    if (!project) {
      return NextResponse.json({ error: "Access denied or project not found" }, { status: 403 })
    }

    // Check if slug is unique within project
    const { data: existingEvent } = await supabase
      .from('events')
      .select('id')
      .eq('project_id', projectId)
      .eq('slug', slug)
      .single()

    if (existingEvent) {
      return NextResponse.json({ error: "Event slug already exists in this project" }, { status: 400 })
    }

    // Create event
    const { data: event, error } = await supabase
      .from('events')
      .insert({
        name,
        slug,
        description,
        project_id: projectId,
        venue_id: venueId || null,
        start_date: startDate,
        end_date: endDate,
        capacity: capacity ? parseInt(capacity) : null
      })
      .select(`
        *,
        projects (
          id,
          name,
          slug,
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
        ),
        venues (
          id,
          name,
          address
        )
      `)
      .single()

    if (error) {
      logger.error("Error creating event", error)
      return NextResponse.json({ error: "Failed to create event" }, { status: 500 })
    }

    return NextResponse.json({ event }, { status: 201 })
  } catch (error) {
    logger.error("Error creating event", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
