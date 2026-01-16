
import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { db } from '@/lib/db'

// GET /api/v1/ghxstship/events/[id]/schedule - Get event schedule
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Query event performances/schedule from database
    const performancesData = await db.query<{
      id?: string
      event_id?: string
      artist_id?: string
      artist_name?: string
      artist_image?: string
      genre?: string
      start_time?: string
      end_time?: string
      duration?: number
      stage?: string
      day?: string
      description?: string
      is_headliner?: boolean
      popularity?: number
      followers?: number
      social_links?: Record<string, string>
      created_at?: string
    }>('event_performances', {
      limit: 50,
      order: { column: 'start_time', ascending: true }
    })

    // Filter by event id if needed
    const performances = performancesData

    return NextResponse.json({
      success: true,
      eventId: id,
      performances,
      pagination: {
        total: performances.length
      }
    })
  } catch (error) {
    logger.error('Error fetching event schedule', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while fetching the event schedule'
        }
      },
      { status: 500 }
    )
  }
}

// POST /api/v1/ghxstship/events/[id]/schedule - Add performance to event
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const performance = await db.insert('event_performances', {
      ...body,
      event_id: id
    })

    return NextResponse.json({
      success: true,
      performance
    }, { status: 201 })
  } catch (error) {
    logger.error('Error creating event performance', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while creating the event performance'
        }
      },
      { status: 500 }
    )
  }
}
