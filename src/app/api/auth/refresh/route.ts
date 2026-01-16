
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'

// POST /api/auth/refresh - Refresh access token with Supabase
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const refreshToken = body.refreshToken

    if (!refreshToken) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Refresh token is required',
            field: 'refreshToken'
          }
        },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Refresh session with Supabase
    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: refreshToken
    })

    if (error) {
      logger.error('Token refresh error', { error: error.message })
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_TOKEN',
            message: error.message || 'Invalid or expired refresh token'
          }
        },
        { status: 401 }
      )
    }

    if (!data.session) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'REFRESH_FAILED',
            message: 'Failed to refresh session'
          }
        },
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        tokens: {
          accessToken: data.session.access_token,
          refreshToken: data.session.refresh_token,
          expiresIn: data.session.expires_in,
          tokenType: 'Bearer'
        },
        message: 'Tokens refreshed successfully'
      }
    })
  } catch (error) {
    logger.error('Token refresh error', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while refreshing tokens'
        }
      },
      { status: 500 }
    )
  }
}
