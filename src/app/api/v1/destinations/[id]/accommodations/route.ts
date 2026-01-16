
import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { db } from '@/lib/db'

// GET /api/v1/destinations/[id]/accommodations - Get accommodations for a destination
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Query accommodations from database
    const accommodationsData = await db.query<{
      id?: string
      name?: string
      type?: string
      rating?: number
      review_count?: number
      price_per_night?: number
      currency?: string
      location?: string
      distance?: string
      images?: string[]
      description?: string
      amenities?: string[]
      rooms?: number
      capacity?: number
      breakfast?: boolean
      cancellation?: string
      featured?: boolean
      destination_slug?: string
      created_at?: string
    }>('accommodations', {
      limit: 50,
      order: { column: 'rating', ascending: false }
    })

    // Filter by destination slug if needed
    const filtered = accommodationsData.filter(a => 
      !a.destination_slug || a.destination_slug === id
    )

    return NextResponse.json({
      success: true,
      destinationId: id,
      accommodations: filtered,
      pagination: {
        total: filtered.length
      }
    })
  } catch (error) {
    logger.error('Error fetching accommodations', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while fetching accommodations'
        }
      },
      { status: 500 }
    )
  }
}

// POST /api/v1/destinations/[id]/accommodations - Add an accommodation
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    // Validate required fields
    const requiredFields = ['name', 'type', 'price_per_night']
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

    // Create new accommodation in database
    const newAccommodation = await db.insert('accommodations', {
      ...body,
      destination_id: id,
      created_at: new Date().toISOString()
    })

    return NextResponse.json({
      success: true,
      accommodation: newAccommodation
    }, { status: 201 })
  } catch (error) {
    logger.error('Error creating accommodation', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while creating the accommodation'
        }
      },
      { status: 500 }
    )
  }
}
