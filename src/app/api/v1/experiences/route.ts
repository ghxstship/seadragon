
import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { db } from '@/lib/db'

// GET /api/v1/experiences - List experiences from database
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search')

    // Query experiences from database
    const experiencesData = await db.query<{ name?: string; description?: string }>('experiences', {
      limit,
      order: { column: 'created_at', ascending: false }
    })

    // Apply search filter if provided
    let experiences = experiencesData
    if (search) {
      const searchLower = search.toLowerCase()
      experiences = experiencesData.filter(exp =>
        exp.name?.toLowerCase().includes(searchLower) ||
        exp.description?.toLowerCase().includes(searchLower)
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        experiences,
        pagination: {
          total: experiences.length,
          limit,
          offset: 0,
          hasNext: false,
          hasPrev: false
        }
      }
    })
  } catch (error) {
    logger.error('Error fetching experiences', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while fetching experiences'
        }
      },
      { status: 500 }
    )
  }
}

// POST /api/v1/experiences - Create new experience
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = ['name', 'description']
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

    // Create new experience in database
    const newExperience = await db.insert('experiences', {
      ...body,
      created_at: new Date().toISOString()
    })

    return NextResponse.json({
      success: true,
      data: {
        experience: newExperience
      }
    }, { status: 201 })
  } catch (error) {
    logger.error('Error creating experience', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while creating the experience'
        }
      },
      { status: 500 }
    )
  }
}
