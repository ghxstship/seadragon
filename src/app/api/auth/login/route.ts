
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'

// POST /api/auth/login - User login with Supabase
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.email || !body.password) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Email and password are required',
            field: !body.email ? 'email' : 'password'
          }
        },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Sign in with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: body.email,
      password: body.password
    })

    if (authError) {
      logger.error('Supabase auth login error', { error: authError.message })
      
      if (authError.message.includes('Invalid login credentials')) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'INVALID_CREDENTIALS',
              message: 'Invalid email or password'
            }
          },
          { status: 401 }
        )
      }

      if (authError.message.includes('Email not confirmed')) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'EMAIL_NOT_VERIFIED',
              message: 'Please verify your email before logging in'
            }
          },
          { status: 403 }
        )
      }

      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'AUTH_ERROR',
            message: authError.message
          }
        },
        { status: 401 }
      )
    }

    if (!authData.user || !authData.session) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'AUTH_ERROR',
            message: 'Login failed'
          }
        },
        { status: 401 }
      )
    }

    // Fetch user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single()

    // Update last login in profile
    await supabase
      .from('profiles')
      .update({ last_login_at: new Date().toISOString() })
      .eq('id', authData.user.id)

    const userResponse = {
      id: authData.user.id,
      email: authData.user.email,
      firstName: profile?.first_name || authData.user.user_metadata?.first_name,
      lastName: profile?.last_name || authData.user.user_metadata?.last_name,
      role: profile?.role || 'member',
      emailVerified: !!authData.user.email_confirmed_at,
      lastLoginAt: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      data: {
        user: userResponse,
        tokens: {
          accessToken: authData.session.access_token,
          refreshToken: authData.session.refresh_token,
          expiresIn: authData.session.expires_in,
          tokenType: 'Bearer'
        },
        message: 'Login successful'
      }
    })
  } catch (error) {
    logger.error('Login error', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred during login'
        }
      },
      { status: 500 }
    )
  }
}
