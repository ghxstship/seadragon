
import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { db } from '@/lib/db'

// GET /api/v1/destinations - List destinations from database
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search')

    // Query destinations from database (using regions table)
    const destinations = await db.query('regions', {
      limit,
      order: { column: 'name', ascending: true }
    })

    return NextResponse.json({
      success: true,
      data: {
        destinations,
        pagination: {
          total: destinations.length,
          limit,
          offset: 0,
          hasNext: false,
          hasPrev: false
        }
      }
    })
  } catch (error) {
    logger.error('Error fetching destinations', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while fetching destinations'
        }
      },
      { status: 500 }
    )
  }
}

// POST /api/v1/destinations - Create new destination
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = ['name', 'code']
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

    // Create new destination in database
    const newDestination = await db.insert('regions', {
      code: body.code,
      name: body.name,
      state: body.state || null,
      country: body.country || 'USA'
    })

    return NextResponse.json({
      success: true,
      data: {
        destination: newDestination
      }
    }, { status: 201 })
  } catch (error) {
    logger.error('Error creating destination', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while creating the destination'
        }
      },
      { status: 500 }
    )
  }
}
