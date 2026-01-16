
import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { db } from '@/lib/db'

// GET /api/v1/destinations/[id]/dining - Get restaurants for a destination
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Query restaurants from database
    const restaurantsData = await db.query<{
      id?: string
      name?: string
      cuisine?: string[]
      price_range?: string
      rating?: number
      review_count?: number
      location?: string
      distance?: string
      description?: string
      images?: string[]
      features?: string[]
      hours?: Record<string, string>
      phone?: string
      website?: string
      reservation_required?: boolean
      featured?: boolean
      awards?: string[]
      destination_slug?: string
      created_at?: string
    }>('restaurants', {
      limit: 50,
      order: { column: 'rating', ascending: false }
    })

    // Filter by destination slug if needed
    const filtered = restaurantsData.filter(r => 
      !r.destination_slug || r.destination_slug === id
    )

    return NextResponse.json({
      success: true,
      destinationId: id,
      restaurants: filtered,
      pagination: {
        total: filtered.length
      }
    })
  } catch (error) {
    logger.error('Error fetching restaurants', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while fetching restaurants'
        }
      },
      { status: 500 }
    )
  }
}

// POST /api/v1/destinations/[id]/dining - Add a restaurant
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    // Validate required fields
    const requiredFields = ['name', 'cuisine']
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

    // Create new restaurant in database
    const newRestaurant = await db.insert('restaurants', {
      ...body,
      destination_id: id,
      created_at: new Date().toISOString()
    })

    return NextResponse.json({
      success: true,
      restaurant: newRestaurant
    }, { status: 201 })
  } catch (error) {
    logger.error('Error creating restaurant', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while creating the restaurant'
        }
      },
      { status: 500 }
    )
  }
}
