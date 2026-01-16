
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'

// POST /api/auth/mfa/verify - Verify MFA code with Supabase
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { factorId, code, challengeId } = body

    if (!factorId || !code) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Factor ID and code are required'
          }
        },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Verify the MFA challenge with Supabase
    const { data, error } = await supabase.auth.mfa.verify({
      factorId,
      challengeId,
      code
    })

    if (error) {
      logger.error('MFA verification error', { error: error.message })
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_CODE',
            message: error.message || 'Invalid or expired MFA code'
          }
        },
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        message: 'MFA verification successful',
        session: data,
        twoFactorVerified: true
      }
    })
  } catch (error) {
    logger.error('MFA verification error', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred during MFA verification'
        }
      },
      { status: 500 }
    )
  }
}

// PUT /api/auth/mfa/verify - Create MFA challenge (send code)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { factorId } = body

    if (!factorId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Factor ID is required'
          }
        },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Create MFA challenge with Supabase
    const { data, error } = await supabase.auth.mfa.challenge({
      factorId
    })

    if (error) {
      logger.error('MFA challenge error', { error: error.message })
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'MFA_ERROR',
            message: error.message || 'Failed to create MFA challenge'
          }
        },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        message: 'MFA challenge created',
        challengeId: data.id,
        expiresAt: data.expires_at,
        nextSteps: [
          'Enter the 6-digit code from your authenticator app',
          'Codes expire in 10 minutes',
          'Contact support if you need backup codes'
        ]
      }
    })
  } catch (error) {
    logger.error('MFA challenge error', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while creating MFA challenge'
        }
      },
      { status: 500 }
    )
  }
}
