
import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { auth } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'

export async function PUT(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const supabase = await createClient()
    const userId = session.user.id
    const body = await request.json()

    // Validate the data to update (snake_case for Supabase)
    const fieldMapping: Record<string, string> = {
      firstName: 'first_name',
      lastName: 'last_name',
      phone: 'phone',
      bio: 'bio',
      location: 'location',
      website: 'website'
    }
    const updates: Record<string, string | null> = {}

    for (const [camelField, snakeField] of Object.entries(fieldMapping)) {
      if (body[camelField] !== undefined) {
        updates[snakeField] = body[camelField]
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      )
    }

    // Update user data
    const { data: updatedUser, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select('id, email, first_name, last_name, phone, bio, location, website, updated_at')
      .single()

    if (error) {
      logger.error('Error updating user data', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }

    // Log the rectification request
    await supabase
      .from('data_exports')
      .insert({
        user_id: userId,
        type: 'rectification_request',
        data: {
          updatedFields: Object.keys(updates),
          updatedAt: new Date().toISOString()
        }
      })

    return NextResponse.json({
      message: 'Your data has been updated successfully.',
      updatedData: updatedUser
    })

  } catch (error) {
    logger.error('Data rectification request error', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
