
import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { db } from '@/lib/db'

// Creator data interfaces
interface CreatorAchievement {
  id: string
  title: string
  description?: string
  date: string
  category?: string
  verified?: boolean
}

interface CareerHighlight {
  id: string
  title: string
  description?: string
  year: number
  type: 'award' | 'release' | 'milestone' | 'collaboration'
  impact?: string
}

interface CreatorStats {
  followers?: number
  following?: number
  totalStreams?: number
  monthlyListeners?: number
  topGenres?: string[]
  engagement?: number
}

// GET /api/v1/creators/[handle] - Get creator profile by handle
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ handle: string }> }
) {
  try {
    const { handle } = await params

    // Query creator from database
    const creatorsData = await db.query<{
      id?: string
      handle?: string
      name?: string
      avatar?: string
      cover_image?: string
      location?: string
      genre?: string
      verified?: boolean
      about?: string
      bio?: string
      description?: string
      genres?: string[]
      influences?: string[]
      achievements?: CreatorAchievement[]
      career_highlights?: CareerHighlight[]
      stats?: CreatorStats
    }>('creators', {
      limit: 1
    })

    // Find the specific creator by handle
    const creator = creatorsData.find(c => c.handle === handle) || creatorsData[0]

    if (!creator) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Creator not found'
          }
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      creator
    })
  } catch (error) {
    logger.error('Error fetching creator profile', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while fetching creator profile'
        }
      },
      { status: 500 }
    )
  }
}
