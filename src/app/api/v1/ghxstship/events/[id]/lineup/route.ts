
import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { db } from '@/lib/db'

// GET /api/v1/ghxstship/events/[id]/lineup - Get event lineup
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Query artists from database
    const artistsData = await db.query<{
      id?: string
      name?: string
      genre?: string
      image?: string
      bio?: string
      description?: string
      social_links?: Record<string, string>
      performance_time?: string
      stage?: string
      duration?: number
      is_headliner?: boolean
      popularity?: number
      followers?: number
      top_tracks?: string[]
      created_at?: string
    }>('artists', {
      limit: 50,
      order: { column: 'popularity', ascending: false }
    })

    // Query performances from database
    const performancesData = await db.query<{
      id?: string
      artist_id?: string
      start_time?: string
      end_time?: string
      stage?: string
      day?: string
      description?: string
      created_at?: string
    }>('event_performances', {
      limit: 50,
      order: { column: 'start_time', ascending: true }
    })

    return NextResponse.json({
      success: true,
      eventId: id,
      artists: artistsData,
      performances: performancesData,
      pagination: {
        totalArtists: artistsData.length,
        totalPerformances: performancesData.length
      }
    })
  } catch (error) {
    logger.error('Error fetching event lineup', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while fetching the event lineup'
        }
      },
      { status: 500 }
    )
  }
}

// POST /api/v1/ghxstship/events/[id]/lineup - Add artist to lineup
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    // Validate required fields
    const requiredFields = ['name', 'genre']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'VALIDATION_ERROR',
              message: `Missing required field: ${field}`,
              field
            }
          },
          { status: 400 }
        )
      }
    }

    // Create new artist in database
    const newArtist = await db.insert('artists', {
      ...body,
      event_id: id,
      created_at: new Date().toISOString()
    })

    return NextResponse.json({
      success: true,
      artist: newArtist
    }, { status: 201 })
  } catch (error) {
    logger.error('Error adding artist to lineup', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while adding the artist'
        }
      },
      { status: 500 }
    )
  }
}
