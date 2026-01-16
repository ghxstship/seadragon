
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { factorId } = body

    if (!factorId) {
      return NextResponse.json(
        { error: 'Factor ID is required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase.auth.mfa.unenroll({
      factorId,
    })

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json({
      message: 'MFA disabled successfully'
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
