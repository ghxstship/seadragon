
import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { logger } from "@/lib/logger"
import { db } from "@/lib/db"

// Force dynamic rendering for API routes
export const dynamic = "force-dynamic"

// GET /api/v1/ghxstship/events - List all events from database
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // 'upcoming', 'featured'
    const projectId = searchParams.get('projectId')
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '50')

    let events

    if (type === 'upcoming') {
      events = await db.getUpcomingEvents(limit)
    } else {
      events = await db.getEvents({ 
        projectId: projectId || undefined,
        status: status || undefined,
        limit 
      })
    }

    // Apply search filter if provided
    if (search) {
      const searchLower = search.toLowerCase()
      events = events.filter(e => 
        e.name.toLowerCase().includes(searchLower) ||
        e.slug?.toLowerCase().includes(searchLower)
      )
    }

    return NextResponse.json({
      events,
      total: events.length,
      meta: {
        type: type || 'all',
        projectId: projectId || null,
        status: status || null,
        search: search || null,
        limit
      }
    })
  } catch (error) {
    logger.error("Error fetching events", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/v1/ghxstship/events - Create new event
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, slug, project_id, start_date, end_date, status = 'draft' } = body

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    const event = await db.insert('events', {
      name,
      slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
      project_id,
      start_date,
      end_date,
      status,
      created_at: new Date().toISOString()
    })

    return NextResponse.json({ event }, { status: 201 })
  } catch (error) {
    logger.error("Error creating event", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
