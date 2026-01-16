
import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { db } from '@/lib/db'

// GET /api/v1/destinations/[id]/events - Get events for a destination
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Query events from database
    const eventsData = await db.query<{
      id?: string
      name?: string
      description?: string
      category?: string
      date?: string
      start_date?: string
      time?: string
      start_time?: string
      duration?: number
      venue?: string
      venue_name?: string
      location?: string
      price_min?: number
      price_max?: number
      ticket_price?: number
      currency?: string
      capacity?: number
      attendees?: number
      rating?: number
      review_count?: number
      image?: string
      featured?: boolean
      status?: string
      tags?: string[]
      organizer?: string
      website?: string
      destination_slug?: string
      created_at?: string
    }>('events', {
      limit: 50,
      order: { column: 'date', ascending: true }
    })

    // Filter by destination slug if needed
    const filtered = eventsData.filter(e => 
      !e.destination_slug || e.destination_slug === id
    )

    return NextResponse.json({
      success: true,
      destinationId: id,
      events: filtered,
      pagination: {
        total: filtered.length
      }
    })
  } catch (error) {
    logger.error('Error fetching events', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while fetching events'
        }
      },
      { status: 500 }
    )
  }
}

// POST /api/v1/destinations/[id]/events - Add an event
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    // Validate required fields
    const requiredFields = ['name', 'date']
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

    // Create new event in database
    const newEvent = await db.insert('events', {
      ...body,
      destination_id: id,
      created_at: new Date().toISOString()
    })

    return NextResponse.json({
      success: true,
      event: newEvent
    }, { status: 201 })
  } catch (error) {
    logger.error('Error creating event', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while creating the event'
        }
      },
      { status: 500 }
    )
  }
}
