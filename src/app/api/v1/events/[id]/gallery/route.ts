
import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { db } from '@/lib/db'

// GET /api/v1/events/[id]/gallery - Get gallery items for an event
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Query gallery items from database
    const galleryData = await db.query<{
      id?: string
      type?: string
      url?: string
      thumbnail?: string
      title?: string
      description?: string
      photographer?: string
      tags?: string[]
      likes?: number
      views?: number
      date_taken?: string
      created_at?: string
      category?: string
      is_official?: boolean
      event_slug?: string
    }>('event_gallery', {
      limit: 50,
      order: { column: 'created_at', ascending: false }
    })

    // Filter by event slug if needed
    const filtered = galleryData.filter(item => 
      !item.event_slug || item.event_slug === id
    )

    return NextResponse.json({
      success: true,
      eventId: id,
      items: filtered,
      pagination: {
        total: filtered.length
      }
    })
  } catch (error) {
    logger.error('Error fetching event gallery', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while fetching event gallery'
        }
      },
      { status: 500 }
    )
  }
}

// POST /api/v1/events/[id]/gallery - Add a gallery item
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    // Validate required fields
    if (!body.url || !body.title) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Missing required fields: url and title'
          }
        },
        { status: 400 }
      )
    }

    // Create new gallery item in database
    const newItem = await db.insert('event_gallery', {
      ...body,
      event_id: id,
      likes: 0,
      views: 0,
      created_at: new Date().toISOString()
    })

    return NextResponse.json({
      success: true,
      item: newItem
    }, { status: 201 })
  } catch (error) {
    logger.error('Error creating gallery item', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while creating the gallery item'
        }
      },
      { status: 500 }
    )
  }
}
