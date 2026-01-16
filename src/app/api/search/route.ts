
import { NextRequest, NextResponse } from "next/server"
import { logger } from "@/lib/logger"
import { auth } from "@/auth"
import { createClient } from "@/lib/supabase/server"

interface EventSearchResult {
  id: string
  name: string
  description?: string
  start_date?: string
  end_date?: string
  venue?: string
  projects?: {
    name?: string
    workspaces?: {
      name?: string
      organizations?: {
        name?: string
      }
    }
  }
  venues?: {
    name?: string
    address?: string
  }
}

interface ProjectSearchResult {
  id: string
  name: string
  description?: string
  updated_at?: string
  workspaces?: {
    name?: string
    organizations?: {
      name?: string
    }
  }
}

interface PersonSearchResult {
  id: string
  name: string
  email?: string
  role?: string
}

interface PlaceSearchResult {
  id: string
  name: string
  address?: string
  type?: string
}

interface AssetSearchResult {
  id: string
  name: string
  type?: string
  url?: string
}

// GET /api/search - Global search across the platform
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const type = searchParams.get('type')
    const limit = parseInt(searchParams.get('limit') || '20')

    if (!query || query.trim().length < 2) {
      return NextResponse.json({
        error: "Search query must be at least 2 characters"
      }, { status: 400 })
    }

    const supabase = await createClient()
    const results: { events: EventSearchResult[]; projects: ProjectSearchResult[]; people: PersonSearchResult[]; places: PlaceSearchResult[]; assets: AssetSearchResult[] } = {
      events: [],
      projects: [],
      people: [],
      places: [],
      assets: []
    }

    // Search events
    if (!type || type === 'events') {
      const { data: events } = await supabase
        .from('events')
        .select('*, projects(name, workspaces(name, organizations(name))), venues(name, address)')
        .ilike('name', `%${query}%`)
        .limit(limit)
        .order('start_date', { ascending: true })
      results.events = events || []
    }

    // Search projects
    if (!type || type === 'projects') {
      const { data: projects } = await supabase
        .from('projects')
        .select('*, workspaces(name, organizations(name))')
        .ilike('name', `%${query}%`)
        .limit(limit)
        .order('updated_at', { ascending: false })
      results.projects = projects || []
    }

    // Search people
    if (!type || type === 'people') {
      const { data: people } = await supabase
        .from('people')
        .select('*, projects(name, workspaces(name, organizations(name)))')
        .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,email.ilike.%${query}%`)
        .limit(limit)
        .order('last_name', { ascending: true })
      results.people = people || []
    }

    // Search places
    if (!type || type === 'places') {
      const { data: places } = await supabase
        .from('places')
        .select('*, projects(name, workspaces(name, organizations(name)))')
        .ilike('name', `%${query}%`)
        .limit(limit)
        .order('name', { ascending: true })
      results.places = places || []
    }

    // Search assets
    if (!type || type === 'assets') {
      const { data: assets } = await supabase
        .from('assets')
        .select('*, projects(name, workspaces(name, organizations(name)))')
        .or(`name.ilike.%${query}%,type.ilike.%${query}%`)
        .limit(limit)
        .order('updated_at', { ascending: false })
      results.assets = assets || []
    }

    return NextResponse.json({
      query,
      results,
      total: Object.values(results).reduce((sum: number, arr: (EventSearchResult | ProjectSearchResult | PersonSearchResult | PlaceSearchResult | AssetSearchResult)[]) => sum + arr.length, 0)
    })
  } catch (error) {
    logger.error("Search error", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
