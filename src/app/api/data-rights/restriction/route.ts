
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

    // Mark user as restricted processing
    await supabase
      .from('users')
      .update({
        processing_restricted: true
      })
      .eq('id', userId)

    // Log the restriction request via Supabase
    await supabase
      .from('data_exports')
      .insert({
        user_id: userId,
        type: 'restriction_request',
        data: {
          restrictedAt: new Date().toISOString(),
          reason: 'User exercised right to restriction of processing'
        }
      })

    return NextResponse.json({
      message: 'Processing of your data has been restricted. We will only process your data for specific purposes as required by law.',
      note: 'You can withdraw this restriction at any time.'
    })

  } catch (error) {
    logger.error('Data restriction request error', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
