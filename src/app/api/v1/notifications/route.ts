
import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireAuth, apiSuccess, apiError, validateRequired, logApiAction, logApiError } from '@/lib/api-utils'

// GET /api/v1/notifications - Get user notifications from Supabase
export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const authResult = await requireAuth(request)
    if (authResult instanceof Response) return authResult
    const { session } = authResult

    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    // Extract query parameters
    const userId = searchParams.get('userId') || session.user.id
    const type = searchParams.get('type')
    const unreadOnly = searchParams.get('unreadOnly') === 'true'
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = supabase
      .from('notifications')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (type) {
      query = query.eq('type', type)
    }

    if (unreadOnly) {
      query = query.eq('is_read', false)
    }

    const { data, error, count } = await query

    if (error) {
      throw error
    }

    // Get unread count
    const { count: unreadCount } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_read', false)

    return apiSuccess({
      notifications: data || [],
      unreadCount: unreadCount || 0,
      total: count || 0,
      pagination: {
        limit,
        offset,
        hasNext: offset + limit < (count || 0),
        hasPrev: offset > 0
      }
    })
  } catch (error) {
    logApiError(error, 'get_notifications')
    return apiError('An error occurred while fetching notifications', 500, 'INTERNAL_ERROR')
  }
}

// POST /api/v1/notifications - Create new notification
export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const authResult = await requireAuth(request)
    if (authResult instanceof Response) return authResult
    const { session } = authResult

    const supabase = await createClient()
    const body = await request.json()

    // Validate required fields
    const validation = validateRequired(body, ['user_id', 'organization_id', 'type', 'title'])
    if (!validation.isValid) {
      logApiError(validation.errors, 'create_notification_validation', session)
      return apiError('Missing required fields', 400, 'VALIDATION_ERROR', validation.errors)
    }

    const { user_id, organization_id, type, title } = body

    // Create new notification in Supabase
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        organization_id,
        user_id,
        type,
        title,
        body: body.message || body.body || null,
        data: body.metadata || body.data || null,
        is_read: false,
      })
      .select()
      .single()

    if (error) {
      logApiError(error, 'create_notification_supabase', session)
      throw error
    }

    // Log successful action
    logApiAction('create_notification', session, 'notification', data.id)

    return apiSuccess({
      notification: data
    }, 201)
  } catch (error) {
    logApiError(error, 'create_notification')
    return apiError('An error occurred while creating the notification', 500, 'INTERNAL_ERROR')
  }
}
