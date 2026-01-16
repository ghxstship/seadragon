
import { NextRequest, NextResponse } from 'next/server'
import { validateEmail } from '@/lib/validation'
import { URLS } from '@/lib/constants/config'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'

// POST /api/auth/forgot-password - Request password reset with Supabase
export async function POST(request: NextRequest) {
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

    // Validate email format
    const emailValidation = validateEmail(body.email)
    if (!emailValidation.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: emailValidation.errors[0] || 'Invalid email format',
            field: 'email'
          }
        },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    
    // Use Supabase Auth to send password reset email
    const origin = request.headers.get('origin') || URLS.DEVELOPMENT
    const { error } = await supabase.auth.resetPasswordForEmail(body.email, {
      redirectTo: `${origin}/auth/reset-password`
    })

    if (error) {
      logger.error('Password reset error', { error: error.message })
      // Don't reveal if email exists for security
    }

    // Always return success for security (don't reveal if email exists)
    return NextResponse.json({
      success: true,
      data: {
        message: 'If an account with this email exists, a password reset link has been sent.',
        nextSteps: [
          'Check your email for the password reset link',
          'Click the link to reset your password',
          'The link will expire in 1 hour'
        ]
      }
    })
  } catch (error) {
    logger.error('Forgot password error', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while processing your request'
        }
      },
      { status: 500 }
    )
  }
}
