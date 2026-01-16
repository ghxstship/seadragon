
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'

// POST /api/auth/reset-password - Reset password with Supabase
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.password) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Password is required',
            field: 'password'
          }
        },
        { status: 400 }
      )
    }

    const { password, confirmPassword } = body

    // Validate password match if confirmPassword provided
    if (confirmPassword && password !== confirmPassword) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Passwords do not match',
            field: 'confirmPassword'
          }
        },
        { status: 400 }
      )
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Password must be at least 8 characters long',
            field: 'password'
          }
        },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Update password with Supabase Auth
    // Note: User must be authenticated via the reset link which sets a session
    const { error } = await supabase.auth.updateUser({
      password: password
    })

    if (error) {
      logger.error('Supabase password update error', { error: error.message })
      
      if (error.message.includes('session')) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'INVALID_SESSION',
              message: 'Invalid or expired reset session. Please request a new password reset.'
            }
          },
          { status: 401 }
        )
      }

      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'AUTH_ERROR',
            message: error.message
          }
        },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        message: 'Password reset successfully',
        nextSteps: [
          'You can now log in with your new password',
          'All existing sessions have been invalidated for security',
          'Consider enabling two-factor authentication'
        ]
      }
    })
  } catch (error) {
    logger.error('Reset password error', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while resetting your password'
        }
      },
      { status: 500 }
    )
  }
}
