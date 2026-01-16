
import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { db } from '@/lib/db'

// GET /api/v1/experiences/[id]/reviews - Get experience reviews
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Query reviews from database
    const reviewsData = await db.query<{
      id?: string
      author_name?: string
      author_avatar?: string
      author_location?: string
      author_verified?: boolean
      rating?: number
      title?: string
      content?: string
      body?: string
      date?: string
      created_at?: string
      helpful?: number
      aspect?: string
      tags?: string[]
      images?: string[]
      response?: Record<string, unknown>
      experience_date?: string
      group_size?: number
    }>('reviews', {
      limit: 50,
      order: { column: 'created_at', ascending: false }
    })

    return NextResponse.json({
      success: true,
      experienceId: id,
      reviews: reviewsData,
      pagination: {
        total: reviewsData.length
      }
    })
  } catch (error) {
    logger.error('Error fetching reviews', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while fetching reviews'
        }
      },
      { status: 500 }
    )
  }
}

// POST /api/v1/experiences/[id]/reviews - Add a review
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    // Validate required fields
    const requiredFields = ['rating', 'content']
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

    // Create new review in database
    const newReview = await db.insert('reviews', {
      ...body,
      experience_id: id,
      created_at: new Date().toISOString(),
      date: new Date().toISOString()
    })

    return NextResponse.json({
      success: true,
      review: newReview
    }, { status: 201 })
  } catch (error) {
    logger.error('Error creating review', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while creating the review'
        }
      },
      { status: 500 }
    )
  }
}
