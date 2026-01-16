
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'

// POST /api/auth/logout - User logout with Supabase
export async function POST() {
  try {
    const supabase = await createClient()
    
    // Sign out with Supabase Auth
    const { error } = await supabase.auth.signOut()

    if (error) {
      logger.error('Supabase logout error', { error: error.message })
    }

    return NextResponse.json({
      success: true,
      data: {
        message: 'Logout successful'
      }
    })
  } catch (error) {
    logger.error('Logout error', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred during logout'
        }
      },
      { status: 500 }
    )
  }
}
