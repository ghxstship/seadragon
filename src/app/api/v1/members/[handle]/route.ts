
import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { db } from '@/lib/db'

// Member data interfaces
interface MemberActivity {
  id: string
  type: 'review' | 'experience' | 'follow' | 'comment' | 'checkin'
  description: string
  timestamp: string
  venue?: string
  rating?: number
}

interface MemberReview {
  id: string
  venue: string
  venue_type: string
  rating: number
  comment?: string
  date: string
  helpful_votes?: number
  verified?: boolean
}

// GET /api/v1/members/[handle] - Get member profile by handle
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ handle: string }> }
) {
  try {
    const { handle } = await params

    // Query member from database
    const membersData = await db.query<{
      id?: string
      handle?: string
      name?: string
      bio?: string
      avatar?: string
      cover_image?: string
      location?: string
      joined_date?: string
      created_at?: string
      verified?: boolean
      badges?: string[]
      stats?: {
        reviews?: number
        experiences?: number
        followers?: number
        following?: number
      }
      interests?: string[]
      favorite_venues?: { name: string; type: string; rating: number }[]
      recent_activity?: MemberActivity[]
      reviews?: MemberReview[]
    }>('members', {
      limit: 1
    })

    // Find the specific member by handle
    const member = membersData.find(m => m.handle === handle) || membersData[0]

    if (!member) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Member not found'
          }
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      member
    })
  } catch (error) {
    logger.error('Error fetching member profile', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while fetching member profile'
        }
      },
      { status: 500 }
    )
  }
}
