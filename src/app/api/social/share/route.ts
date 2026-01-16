
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'
import { auth } from '@/auth'

// POST /api/social/share - Share content
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createClient()
    const body = await request.json()
    const { contentId, contentType, url, platform = 'web' } = body

    if (!contentId || !contentType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Create new share record in Supabase
    const { data: newShare, error } = await supabase
      .from('shares')
      .insert({
        user_id: session.user.id,
        content_id: contentId,
        content_type: contentType,
        url: url || null,
        platform,
      })
      .select()
      .single()

    if (error) throw error

    // Get share count for this content
    const { count: shareCount } = await supabase
      .from('shares')
      .select('*', { count: 'exact', head: true })
      .eq('content_id', contentId)
      .eq('content_type', contentType)

    return NextResponse.json({
      action: 'shared',
      share: newShare,
      shareCount: shareCount || 0
    })
  } catch (error) {
    logger.error('Error creating share', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// GET /api/social/share - Get share count for content
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const contentId = searchParams.get('contentId')
    const contentType = searchParams.get('contentType')

    if (!contentId || !contentType) {
      return NextResponse.json({ error: 'Missing content ID or type' }, { status: 400 })
    }

    // Get share count from Supabase
    const { count: shareCount } = await supabase
      .from('shares')
      .select('*', { count: 'exact', head: true })
      .eq('content_id', contentId)
      .eq('content_type', contentType)

    return NextResponse.json({ shareCount: shareCount || 0 })
  } catch (error) {
    logger.error('Error fetching share count', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
