
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

    // Fetch user data via Supabase
    const { data: user, error: userError } = await supabase
      .from('platform_users')
      .select('*')
      .eq('id', userId)
      .single()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Fetch related data
    const [profilesRes, notificationsRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('user_id', userId),
      supabase.from('notifications').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(100)
    ])

    // Create data export
    const exportData = {
      user,
      profiles: profilesRes.data || [],
      notifications: notificationsRes.data || [],
      exportDate: new Date().toISOString(),
      requestType: 'right_to_access',
      version: '1.0'
    }

    // Store export record for audit via Supabase
    const { data: exportRecord, error: exportError } = await supabase
      .from('data_exports')
      .insert({
        user_id: userId,
        type: 'access_request',
        data: exportData,
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      })
      .select()
      .single()

    return NextResponse.json({
      message: 'Data export initiated. You will receive an email with download link.',
      exportId: exportRecord?.id || 'pending',
      estimatedTime: '24 hours'
    })

  } catch (error) {
    logger.error('Data access request error', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
