
import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { createClient } from '@/lib/supabase/server'
import { auth } from '@/lib/auth'

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/v1/assets/[id] - Get asset
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createClient()
    const { data: asset, error } = await supabase
      .from('assets')
      .select(`
        *,
        projects (
          id,
          name,
          slug,
          status
        ),
        campaign_assets (
          *,
          campaigns (*)
        ),
        transfers (*)
      `)
      .eq('id', id)
      .single()

    if (error || !asset) {
      return NextResponse.json({ error: 'Asset not found' }, { status: 404 })
    }

    return NextResponse.json(asset)
  } catch (error) {
    logger.error('Error fetching asset', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH /api/v1/assets/[id] - Update asset
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createClient()
    const body = await request.json()
    const { name, type, category, description, ownerId, location, status, metadata } = body

    const updates: Record<string, unknown> = {}
    if (name) updates.name = name
    if (type) updates.type = type
    if (category !== undefined) updates.category = category
    if (description !== undefined) updates.description = description
    if (ownerId !== undefined) updates.owner_id = ownerId
    if (location !== undefined) updates.location = location
    if (status) updates.status = status
    if (metadata !== undefined) updates.metadata = metadata

    const { data: asset, error } = await supabase
      .from('assets')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        projects (
          id,
          name,
          slug
        )
      `)
      .single()

    if (error || !asset) {
      return NextResponse.json({ error: 'Asset not found' }, { status: 404 })
    }

    return NextResponse.json(asset)
  } catch (error) {
    logger.error('Error updating asset', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/v1/assets/[id] - Delete asset
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createClient()
    const { error } = await supabase
      .from('assets')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: 'Asset not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Asset deleted successfully' })
  } catch (error) {
    logger.error('Error deleting asset', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
