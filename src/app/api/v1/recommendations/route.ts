
import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { db } from '@/lib/db'

// GET /api/v1/recommendations - Get personalized recommendations
export async function GET(request: NextRequest) {
  try {
    // Query recommendations from database
    const recommendationsData = await db.query<{
      id?: string
      type?: string
      title?: string
      name?: string
      description?: string
      image?: string
      image_url?: string
      rating?: number
      location?: string
      date?: string
      price?: string
    }>('recommendations', {
      limit: 10,
      order: { column: 'rating', ascending: false }
    })

    return NextResponse.json({
      success: true,
      recommendations: recommendationsData,
      pagination: {
        total: recommendationsData.length
      }
    })
  } catch (error) {
    logger.error('Error fetching recommendations', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while fetching recommendations'
        }
      },
      { status: 500 }
    )
  }
}
