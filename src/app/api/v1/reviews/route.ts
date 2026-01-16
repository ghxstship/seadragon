
import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'
import { requireAuth, apiSuccess, apiError, validateRequired, logApiAction, logApiError } from '@/lib/api-utils'

// GET /api/v1/reviews - List reviews from Supabase with filtering
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    // Extract query parameters
    const itemType = searchParams.get('itemType')
    const itemId = searchParams.get('itemId')
    const userId = searchParams.get('userId')
    const minRating = searchParams.get('minRating')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = supabase
      .from('reviews')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Apply filters
    if (itemType) {
      query = query.eq('item_type', itemType)
    }

    if (itemId) {
      query = query.eq('item_id', itemId)
    }

    if (userId) {
      query = query.eq('user_id', userId)
    }

    if (minRating) {
      query = query.gte('rating', parseInt(minRating))
    }

    const { data: reviews, error, count } = await query

    if (error) throw error

    return apiSuccess({
      reviews: reviews || [],
      total: count || 0,
      pagination: {
        limit,
        offset,
        hasNext: offset + limit < (count || 0),
        hasPrev: offset > 0
      },
      filters: {
        applied: {
          itemType,
          itemId,
          userId,
          minRating
        }
      }
    })
  } catch (error) {
    logApiError(error, 'get_reviews')
    return apiError('An error occurred while fetching reviews', 500, 'INTERNAL_ERROR')
  }
}

// POST /api/v1/reviews - Create new review in Supabase
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Authenticate user
    const authResult = await requireAuth(request)
    if (authResult instanceof Response) return authResult
    const { session } = authResult

    const body = await request.json()

    // Validate required fields
    const { user_id, item_type, item_id, rating, title, content } = body
    const validation = validateRequired(body, ['user_id', 'item_type', 'item_id', 'rating', 'title', 'content'])
    if (!validation.isValid) {
      logApiError(validation.errors, 'create_review_validation', session)
      return apiError('Missing required fields', 400, 'VALIDATION_ERROR', validation.errors)
    }

    // Ensure user can only create reviews for themselves
    if (user_id !== session.user.id) {
      logApiError('Unauthorized review creation attempt', 'create_review_auth', session)
      return apiError('Cannot create reviews for other users', 403, 'FORBIDDEN')
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      logApiError('Invalid rating value', 'create_review_validation', session)
      return apiError('Rating must be between 1 and 5', 400, 'VALIDATION_ERROR', { field: 'rating' })
    }

    // Create new review in Supabase
    const { data: newReview, error } = await supabase
      .from('reviews')
      .insert({
        user_id,
        item_type,
        item_id,
        rating,
        title,
        content,
      })
      .select()
      .single()

    if (error) {
      logApiError(error, 'create_review_supabase', session)
      throw error
    }

    // Log successful action
    logApiAction('create_review', session, 'review', newReview.id)

    return apiSuccess({
      review: newReview,
      message: 'Review submitted successfully'
    }, 201)
  } catch (error) {
    logApiError(error, 'create_review', session)
    return apiError('An error occurred while creating the review', 500, 'INTERNAL_ERROR')
  }
}
