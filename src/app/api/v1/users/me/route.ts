
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      )
    }

    if (!user) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      )
    }

    // Get additional user data from database
    const { data: userData, error: dbError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    const userResponse = {
      id: user.id,
      email: user.email,
      name: user.user_metadata?.name || userData?.name,
      createdAt: user.created_at,
      ...userData
    }

    return NextResponse.json({ user: userResponse })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    // Update auth user metadata if name is provided
    if (body.name) {
      const { error: authError } = await supabase.auth.updateUser({
        data: { name: body.name }
      })

      if (authError) {
        return NextResponse.json(
          { error: authError.message },
          { status: 400 }
        )
      }
    }

    // Update additional user data in database
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const updateData = { ...body }
      delete updateData.name // Already updated in auth

      if (Object.keys(updateData).length > 0) {
        const { data: updatedUser, error: dbError } = await supabase
          .from('profiles')
          .update(updateData)
          .eq('id', user.id)
          .select()
          .single()

        if (dbError) {
          return NextResponse.json(
            { error: dbError.message },
            { status: 400 }
          )
        }

        return NextResponse.json({
          message: 'User updated successfully',
          user: {
            id: user.id,
            email: user.email,
            name: user.user_metadata?.name || updatedUser?.display_name,
            ...updatedUser
          }
        })
      }
    }

    // If only name was updated
    const { data: { user: currentUser } } = await supabase.auth.getUser()
    return NextResponse.json({
      message: 'User updated successfully',
      user: {
        id: currentUser?.id,
        email: currentUser?.email,
        name: currentUser?.user_metadata?.name
      }
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
