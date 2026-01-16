
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'
import { auth } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const supabase = await createClient()
    const userId = session.user.id
    const body = await request.json()
    const { reason } = body

    // Log the objection request via Supabase
    await supabase
      .from('data_exports')
      .insert({
        user_id: userId,
        type: 'objection_request',
        data: {
          objectedAt: new Date().toISOString(),
          reason: reason || 'general objection'
        }
      })

    return NextResponse.json({
      message: 'Your objection has been recorded. We will cease processing your data for the specified purposes.',
      note: 'If you object to processing based on legitimate interests, we will stop unless we can demonstrate compelling legitimate grounds.'
    })

  } catch (error) {
    logger.error('Data objection request error', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
