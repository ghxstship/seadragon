
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'
import { auth } from '@/auth'

// POST /api/social/like - Like/unlike content
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createClient()
    const body = await request.json()
    const { contentId, contentType } = body

    if (!contentId || !contentType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check if already liked in Supabase
    const { data: existingLike } = await supabase
      .from('likes')
      .select('id')
      .eq('user_id', session.user.id)
      .eq('content_id', contentId)
      .eq('content_type', contentType)
      .single()

    if (existingLike) {
      // Unlike - remove the like
      await supabase
        .from('likes')
        .delete()
        .eq('id', existingLike.id)
      return NextResponse.json({ action: 'unliked', liked: false })
    } else {
      // Like - add new like
      const { data: newLike, error } = await supabase
        .from('likes')
        .insert({
          user_id: session.user.id,
          content_id: contentId,
          content_type: contentType,
        })
        .select()
        .single()

      if (error) throw error
      return NextResponse.json({ action: 'liked', liked: true, like: newLike })
    }
  } catch (error) {
    logger.error('Error handling like', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/social/like - Unlike content (alternative endpoint)
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const contentId = searchParams.get('contentId')
    const contentType = searchParams.get('contentType')

    if (!contentId || !contentType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Find and remove the like from Supabase
    const { data: existingLike } = await supabase
      .from('likes')
      .select('id')
      .eq('user_id', session.user.id)
      .eq('content_id', contentId)
      .eq('content_type', contentType)
      .single()

    if (!existingLike) {
      return NextResponse.json({ error: 'Like not found' }, { status: 404 })
    }

    await supabase.from('likes').delete().eq('id', existingLike.id)
    return NextResponse.json({ action: 'unliked', liked: false })
  } catch (error) {
    logger.error('Error unliking', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
