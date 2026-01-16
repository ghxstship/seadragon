
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'
import { auth } from '@/lib/auth'

// GET /api/integrations/sync-status - Get sync status from Supabase
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const integrationId = searchParams.get('integrationId')
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '20')

    let query = supabase
      .from('integration_syncs')
      .select('*', { count: 'exact' })
      .order('started_at', { ascending: false })
      .limit(limit)

    if (integrationId) {
      query = query.eq('integration_id', integrationId)
    }

    if (status) {
      query = query.eq('status', status)
    }

    const { data: syncs, error, count } = await query

    if (error) throw error

    return NextResponse.json({
      syncs: syncs || [],
      total: count || 0,
      limit,
      offset: 0
    })
  } catch (error) {
    logger.error('Error fetching sync status', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
