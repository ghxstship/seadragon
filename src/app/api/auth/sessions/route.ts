
import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { db } from '@/lib/db'

// GET /api/auth/sessions - List user sessions from database
export async function GET(request: NextRequest) {
  try {
    // Query sessions from database
    const sessionsData = await db.query<{
      id?: string
      device_type?: string
      device_name?: string
      browser?: string
      location?: string
      ip_address?: string
      last_active?: string
      is_current?: boolean
      is_trusted?: boolean
      user_id?: string
      created_at?: string
    }>('user_sessions', {
      limit: 20,
      order: { column: 'last_active', ascending: false }
    })

    // Map to expected format
    const sessions = sessionsData.map(s => ({
      id: s.id,
      deviceType: s.device_type || 'desktop',
      deviceName: s.device_name || 'Unknown Device',
      browser: s.browser || 'Unknown Browser',
      location: s.location || 'Unknown',
      ipAddress: s.ip_address || '',
      lastActive: s.last_active || s.created_at || new Date().toISOString(),
      isCurrent: Boolean(s.is_current),
      isTrusted: Boolean(s.is_trusted)
    }))

    return NextResponse.json({
      success: true,
      sessions
    })
  } catch (error) {
    logger.error('Error fetching sessions', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while fetching sessions'
        }
      },
      { status: 500 }
    )
  }
}

// DELETE /api/auth/sessions - Revoke a session
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('id')

    if (!sessionId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Session ID is required'
          }
        },
        { status: 400 }
      )
    }

    // Delete session from database
    await db.delete('user_sessions', sessionId)

    return NextResponse.json({
      success: true,
      message: 'Session revoked successfully'
    })
  } catch (error) {
    logger.error('Error revoking session', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while revoking the session'
        }
      },
      { status: 500 }
    )
  }
}
