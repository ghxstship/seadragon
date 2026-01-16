
import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { db } from '@/lib/db'

// GET /api/v1/partners - List partners from database
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const type = searchParams.get('type')
    const featured = searchParams.get('featured')

    // Query partners from database
    const partnersData = await db.query<{
      id?: string
      name?: string
      type?: string
      description?: string
      logo?: string
      website?: string
      partnership_level?: string
      since?: number
      benefits?: string[]
      location?: string
      featured?: boolean
      created_at?: string
    }>('partners', {
      limit,
      order: { column: 'created_at', ascending: false }
    })

    // Apply filters if provided
    let partners = partnersData
    if (type) {
      partners = partners.filter(p => p.type?.toLowerCase() === type.toLowerCase())
    }
    if (featured === 'true') {
      partners = partners.filter(p => p.featured)
    }

    return NextResponse.json({
      success: true,
      partners,
      pagination: {
        total: partners.length,
        limit,
        offset: 0
      }
    })
  } catch (error) {
    logger.error('Error fetching partners', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while fetching partners'
        }
      },
      { status: 500 }
    )
  }
}

// POST /api/v1/partners - Create new partner
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = ['name', 'type']
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

    // Create new partner in database
    const newPartner = await db.insert('partners', {
      ...body,
      created_at: new Date().toISOString()
    })

    return NextResponse.json({
      success: true,
      partner: newPartner
    }, { status: 201 })
  } catch (error) {
    logger.error('Error creating partner', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while creating the partner'
        }
      },
      { status: 500 }
    )
  }
}
