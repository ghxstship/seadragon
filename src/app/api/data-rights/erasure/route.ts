
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

    // Check if user exists
    const { data: user, error: userError } = await supabase
      .from('platform_users')
      .select('id')
      .eq('id', userId)
      .single()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Instead of hard delete, anonymize the data for compliance and audit purposes
    await supabase
      .from('platform_users')
      .update({
        email: `deleted-${userId}@anonymous.local`,
        username: null,
        first_name: null,
        last_name: null,
        avatar_url: null,
        phone: null,
        bio: null,
        location: null,
        website: null,
        social_links: null,
        password_hash: null,
        mfa_secret: null
      })
      .eq('id', userId)

    // Log the erasure request
    await supabase
      .from('data_exports')
      .insert({
        user_id: userId,
        type: 'erasure_request',
        data: {
          erased_at: new Date().toISOString(),
          reason: 'User exercised right to erasure'
        }
      })

    return NextResponse.json({
      message: 'Your data has been erased successfully. You will be logged out.',
      note: 'Some data may be retained for legal compliance purposes in anonymized form.'
    })

  } catch (error) {
    logger.error('Data erasure request error', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
