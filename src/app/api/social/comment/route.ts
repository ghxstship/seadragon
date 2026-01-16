
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'
import { auth } from '@/auth'

// GET /api/social/comments - Get comments for content
export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const contentId = searchParams.get('contentId')
    const contentType = searchParams.get('contentType')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    if (!contentId || !contentType) {
      return NextResponse.json({ error: 'Missing content ID or type' }, { status: 400 })
    }

    // Fetch comments from Supabase
    const { data: comments, error, count } = await supabase
      .from('comments')
      .select('*', { count: 'exact' })
      .eq('content_id', contentId)
      .eq('content_type', contentType)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error

    return NextResponse.json({
      comments: comments || [],
      total: count || 0,
      hasMore: offset + limit < (count || 0)
    })
  } catch (error) {
    logger.error('Error fetching comments', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/social/comment - Create new comment
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createClient()
    const body = await request.json()
    const { contentId, contentType, text, parentId } = body

    if (!contentId || !contentType || !text) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Create new comment in Supabase
    const { data: newComment, error } = await supabase
      .from('comments')
      .insert({
        user_id: session.user.id,
        content_id: contentId,
        content_type: contentType,
        text,
        parent_id: parentId || null,
      })
      .select()
      .single()

    if (error) throw error

    // In a real app, you might want to create a notification for the content owner
    // if (contentOwnerId !== session.user.id) {
    //   await createNotification(contentOwnerId, 'comment', `${session.user.name} commented on your ${contentType}`, `/comments/${newComment.id}`)
    // }

    return NextResponse.json(newComment, { status: 201 })
  } catch (error) {
    logger.error('Error creating comment', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
