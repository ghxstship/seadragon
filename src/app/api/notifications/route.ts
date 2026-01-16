
import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { auth } from '@/auth'
import { db } from '@/lib/db'

// GET /api/notifications - Get user notifications from database
export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const unreadOnly = searchParams.get('unreadOnly') === 'true'

    // Fetch notifications from database
    const notifications = await db.getNotifications({
      userId: session.user.id,
      unreadOnly,
      limit
    })

    return NextResponse.json({
      notifications,
      total: notifications.length,
      hasMore: false
    })
  } catch (error) {
    logger.error('Error fetching notifications', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/notifications - Create new notification
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      type,
      title,
      body: notificationBody,
      action_url,
      data,
      user_id
    } = body

    // Validate required fields
    if (!type || !title) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Create new notification in database
    const newNotification = await db.insert('notifications', {
      user_id: user_id || session.user.id,
      type,
      title,
      body: notificationBody || null,
      action_url: action_url || null,
      data: data || null,
      is_read: false,
      created_at: new Date().toISOString()
    })

    return NextResponse.json(newNotification, { status: 201 })
  } catch (error) {
    logger.error('Error creating notification', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
