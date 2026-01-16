
import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { auth } from '@/auth'
import { db } from '@/lib/db'

// POST /api/social/follow - Follow user or entity
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { targetId, targetType = 'user' } = body

    if (!targetId) {
      return NextResponse.json({ error: 'Missing target ID' }, { status: 400 })
    }

    if (targetId === session.user.id) {
      return NextResponse.json({ error: 'Cannot follow yourself' }, { status: 400 })
    }

    // Create follow relationship in database
    const newFollow = await db.insert('follows', {
      follower_id: session.user.id,
      following_id: targetId,
      following_type: targetType,
      created_at: new Date().toISOString()
    })

    return NextResponse.json({
      action: 'followed',
      following: true,
      follow: newFollow
    })
  } catch (error) {
    logger.error('Error creating follow', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/social/follow - Unfollow user or entity
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const targetId = searchParams.get('targetId')

    if (!targetId) {
      return NextResponse.json({ error: 'Missing target ID' }, { status: 400 })
    }

    // Delete follow relationship from database using query to find and delete
    const follows = await db.query('follows', {
      filters: { follower_id: session.user.id, following_id: targetId },
      limit: 1
    })
    if (follows.length > 0 && (follows[0] as { id: string }).id) {
      await db.delete('follows', (follows[0] as { id: string }).id)
    }

    return NextResponse.json({
      action: 'unfollowed',
      following: false
    })
  } catch (error) {
    logger.error('Error removing follow', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// GET /api/social/follow - Check follow status
export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const targetId = searchParams.get('targetId')

    if (!targetId) {
      return NextResponse.json({ error: 'Missing target ID' }, { status: 400 })
    }

    // Query follow status from database
    const follows = await db.query('follows', {
      filters: { follower_id: session.user.id, following_id: targetId },
      limit: 1
    })

    const isFollowing = follows.length > 0

    return NextResponse.json({
      following: isFollowing
    })
  } catch (error) {
    logger.error('Error checking follow status', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
