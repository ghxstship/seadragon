
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'

interface SearchResult {
  id: string
  type: string
  title: string
  description: string
  category: string
  location: string
  rating: number
  tags: string[]
  relevanceScore?: number
  price?: number | { min: number; max: number }
  currency?: string
}

// GET /api/v1/search - Global search across all content using Supabase
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    // Extract query parameters
    const query = searchParams.get('q') || searchParams.get('query')
    const type = searchParams.get('type') // experience, event, destination, project, or all
    const category = searchParams.get('category')
    const location = searchParams.get('location')
    const limitParam = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    if (!query || query.length < 2) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Search query must be at least 2 characters long',
            field: 'q'
          }
        },
        { status: 400 }
      )
    }

    const searchTerm = `%${query.toLowerCase()}%`
    const allResults: SearchResult[] = []

    // Search events
    if (!type || type === 'all' || type === 'event') {
      const { data: events } = await supabase
        .from('events')
        .select('id, name, slug, status, start_date')
        .or(`name.ilike.${searchTerm},slug.ilike.${searchTerm}`)
        .limit(limitParam)

      if (events) {
        allResults.push(...events.map(e => ({
          id: e.id,
          type: 'event',
          title: e.name,
          description: e.slug || '',
          category: 'Event',
          location: '',
          rating: 0,
          tags: []
        })))
      }
    }

    // Search projects
    if (!type || type === 'all' || type === 'project') {
      const { data: projects } = await supabase
        .from('projects')
        .select('id, name, description, phase')
        .or(`name.ilike.${searchTerm},description.ilike.${searchTerm}`)
        .limit(limitParam)

      if (projects) {
        allResults.push(...projects.map(p => ({
          id: p.id,
          type: 'project',
          title: p.name,
          description: p.description || '',
          category: p.phase || 'Project',
          location: '',
          rating: 0,
          tags: []
        })))
      }
    }

    // Search destinations
    if (!type || type === 'all' || type === 'destination') {
      const { data: destinations } = await supabase
        .from('destinations')
        .select('id, name, description, country, region')
        .or(`name.ilike.${searchTerm},description.ilike.${searchTerm},country.ilike.${searchTerm}`)
        .limit(limitParam)

      if (destinations) {
        allResults.push(...destinations.map(d => ({
          id: d.id,
          type: 'destination',
          title: d.name,
          description: d.description || '',
          category: 'Destination',
          location: d.country || d.region || '',
          rating: 0,
          tags: []
        })))
      }
    }

    // Apply category filter if specified
    let filteredResults = allResults
    if (category) {
      filteredResults = filteredResults.filter(item =>
        item.category.toLowerCase() === category.toLowerCase()
      )
    }

    // Apply location filter if specified
    if (location) {
      filteredResults = filteredResults.filter(item =>
        item.location.toLowerCase().includes(location.toLowerCase())
      )
    }

    // Apply pagination
    const total = filteredResults.length
    const paginatedResults = filteredResults.slice(offset, offset + limitParam)

    // Group results by type
    const groupedResults = paginatedResults.reduce((acc: Record<string, SearchResult[]>, item) => {
      if (!acc[item.type]) {
        acc[item.type] = []
      }
      acc[item.type].push(item)
      return acc
    }, {})

    // Calculate facets
    const facets = {
      types: Object.entries(
        filteredResults.reduce((acc: Record<string, number>, item) => {
          acc[item.type] = (acc[item.type] || 0) + 1
          return acc
        }, {})
      ).map(([type, count]) => ({ type, count })),
      categories: Object.entries(
        filteredResults.reduce((acc: Record<string, number>, item) => {
          acc[item.category] = (acc[item.category] || 0) + 1
          return acc
        }, {})
      ).map(([category, count]) => ({ category, count })),
      locations: Object.entries(
        filteredResults.reduce((acc: Record<string, number>, item) => {
          if (item.location) {
            acc[item.location] = (acc[item.location] || 0) + 1
          }
          return acc
        }, {})
      ).map(([location, count]) => ({ location, count }))
    }

    return NextResponse.json({
      success: true,
      data: {
        query,
        total,
        results: paginatedResults,
        groupedResults,
        facets,
        pagination: {
          limit: limitParam,
          offset,
          hasNext: offset + limitParam < total,
          hasPrev: offset > 0
        },
        filters: {
          applied: {
            type,
            category,
            location
          }
        }
      }
    })
  } catch (error) {
    logger.error('Error performing search', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while performing the search'
        }
      },
      { status: 500 }
    )
  }
}
