
import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { auth } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'

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

    // Fetch user data in machine-readable format
    const { data: user, error: userError } = await supabase
      .from('platform_users')
      .select('*, profiles(*)')
      .eq('id', userId)
      .single()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Remove sensitive information
    const { password_hash, mfa_secret, ...safeUser } = user

    // Create portable data export in JSON-LD or structured format
    const portableData = {
      '@context': 'https://schema.org/',
      '@type': 'Person',
      identifier: userId,
      email: safeUser.email,
      name: user.profiles?.first_name && user.profiles?.last_name ? `${user.profiles.first_name} ${user.profiles.last_name}` : undefined,
      givenName: user.profiles?.first_name,
      familyName: user.profiles?.last_name,
      telephone: user.profiles?.phone,
      description: user.profiles?.bio,
      address: user.profiles?.location ? {
        '@type': 'PostalAddress',
        addressLocality: user.profiles.location
      } : undefined,
      url: user.profiles?.website,
      image: user.profiles?.avatar,
      additionalData: {
        emailVerified: safeUser.email_verified,
        phoneVerified: safeUser.phone_verified,
        mfaEnabled: safeUser.mfa_enabled,
        createdAt: safeUser.created_at,
        updatedAt: safeUser.updated_at,
      }
    }

    // Store export
    await supabase
      .from('data_exports')
      .insert({
        user_id: userId,
        type: 'portability_request',
        data: portableData,
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      })

    return NextResponse.json({
      message: 'Data portability request submitted. You will receive a download link via email.',
      format: 'JSON-LD',
      estimatedTime: '24 hours'
    })

  } catch (error) {
    logger.error('Data portability request error', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
