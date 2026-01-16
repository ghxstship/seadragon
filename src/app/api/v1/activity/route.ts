
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'
import { auth } from '@/auth'

// GET /api/v1/activity - Get activity logs for user/organization
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const entityType = searchParams.get('entityType')
    const action = searchParams.get('action')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = supabase
      .from('activity_logs')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Filter by user if specified, otherwise get current user's activity
    if (userId) {
      query = query.eq('user_id', userId)
    } else {
      query = query.eq('user_id', session.user.id)
    }

    if (entityType) {
      query = query.eq('entity_type', entityType)
    }

    if (action) {
      query = query.eq('action', action)
    }

    const { data: activities, error, count } = await query

    if (error) {
      throw error
    }

    return NextResponse.json({
      activities: activities || [],
      total: count || 0,
      pagination: {
        limit,
        offset,
        hasNext: offset + limit < (count || 0),
        hasPrev: offset > 0
      }
    })
  } catch (error) {
    logger.error('Error fetching activity logs', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/v1/activity - Create activity log entry
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createClient()
    const body = await request.json()
    const { action, entity_type, entity_id, metadata } = body

    if (!action || !entity_type) {
      return NextResponse.json(
        { error: 'action and entity_type are required' },
        { status: 400 }
      )
    }

    const { data: activity, error } = await supabase
      .from('activity_logs')
      .insert({
        user_id: session.user.id,
        action,
        entity_type,
        entity_id: entity_id || null,
        metadata: metadata || null
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({ activity }, { status: 201 })
  } catch (error) {
    logger.error('Error creating activity log', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
