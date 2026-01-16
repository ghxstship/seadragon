
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')

    // Check if id is a UUID or a handle/slug
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)

    let profile = null
    let error = null

    if (isUUID) {
      // Lookup by ID
      const result = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single()
      profile = result.data
      error = result.error
    } else {
      // Lookup by handle/slug
      let query = supabase
        .from('profiles')
        .select('*')
        .eq('handle', id)
      
      // Filter by type if provided
      if (type) {
        query = query.eq('type', type)
      }
      
      const result = await query.single()
      profile = result.data
      error = result.error

      // If not found by handle, try slug field
      if (error || !profile) {
        let slugQuery = supabase
          .from('profiles')
          .select('*')
          .eq('slug', id)
        
        if (type) {
          slugQuery = slugQuery.eq('type', type)
        }
        
        const slugResult = await slugQuery.single()
        profile = slugResult.data
        error = slugResult.error
      }
    }

    if (error || !profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ profile })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const body = await request.json()

    const { data: profile, error } = await supabase
      .from('profiles')
      .update(body)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json({
      message: 'Profile updated successfully',
      profile
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json({
      message: 'Profile deleted successfully'
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
