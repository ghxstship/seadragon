
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'

// POST /api/auth/verify-email - Email verification handled by Supabase callback
// This route is for manual token verification if needed
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.token) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Verification token is required',
            field: 'token'
          }
        },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Supabase handles email verification via the callback URL
    // This endpoint can be used to verify the token hash if needed
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash: body.token,
      type: 'email'
    })

    if (error) {
      logger.error('Email verification error', { error: error.message })
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_TOKEN',
            message: error.message || 'Invalid or expired verification token'
          }
        },
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        message: 'Email verified successfully',
        user: data.user ? {
          id: data.user.id,
          email: data.user.email,
          emailVerified: !!data.user.email_confirmed_at
        } : null,
        nextSteps: [
          'You can now log in with your account',
          'Complete your profile to get personalized recommendations',
          'Set up two-factor authentication for added security'
        ]
      }
    })
  } catch (error) {
    logger.error('Email verification error', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while verifying your email'
        }
      },
      { status: 500 }
    )
  }
}

// PUT /api/auth/verify-email - Resend email verification
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.email) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Email is required',
            field: 'email'
          }
        },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Resend verification email using Supabase
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: body.email,
      options: {
        emailRedirectTo: `${request.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL}/auth/callback`
      }
    })

    if (error) {
      logger.error('Resend verification error', { error: error.message })
      // Don't reveal specific errors for security
    }

    // Always return success for security (don't reveal if email exists)
    return NextResponse.json({
      success: true,
      data: {
        message: 'If an account with this email exists, a verification link has been sent.',
        nextSteps: [
          'Check your email for the verification link',
          'Click the link to verify your email address',
          'The link will expire in 24 hours'
        ]
      }
    })
  } catch (error) {
    logger.error('Resend verification error', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while resending verification email'
        }
      },
      { status: 500 }
    )
  }
}
