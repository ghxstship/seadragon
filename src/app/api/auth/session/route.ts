
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'

// GET /api/auth/session - Get current session info with Supabase
export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNAUTHENTICATED',
            message: 'No active session'
          }
        },
        { status: 401 }
      )
    }

    // Fetch profile for additional user info
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: profile?.display_name || profile?.first_name || user.user_metadata?.name,
          image: profile?.avatar_url || user.user_metadata?.avatar_url || null,
          role: profile?.role || 'member'
        },
        session: {
          expiresAt: user.last_sign_in_at
        }
      }
    })
  } catch (error) {
    logger.error('Session check error', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while checking session'
        }
      },
      { status: 500 }
    )
  }
}

// DELETE /api/auth/session - Destroy current session with Supabase
export async function DELETE() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNAUTHENTICATED',
            message: 'No active session'
          }
        },
        { status: 401 }
      )
    }

    // Sign out with Supabase
    await supabase.auth.signOut()

    return NextResponse.json({
      success: true,
      data: {
        message: 'Session terminated successfully'
      }
    })
  } catch (error) {
    logger.error('Session destroy error', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while terminating session'
        }
      },
      { status: 500 }
    )
  }
}
