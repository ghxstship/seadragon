
import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { createClient } from '@/lib/supabase/server'
import { auth } from '@/lib/auth'

// GET /api/v1/assets - List assets
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')
    const type = searchParams.get('type')
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = supabase
      .from('assets')
      .select(`
        *,
        projects (
          id,
          name,
          slug
        )
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (projectId) query = query.eq('project_id', projectId)
    if (type) query = query.eq('type', type)
    if (status) query = query.eq('status', status)

    const { data: assets, count, error } = await query

    if (error) {
      logger.error('Error fetching assets', error)
      return NextResponse.json({ error: 'Failed to fetch assets' }, { status: 500 })
    }

    return NextResponse.json({
      assets: assets || [],
      pagination: {
        total: count || 0,
        limit,
        offset,
        hasMore: offset + limit < (count || 0)
      }
    })
  } catch (error) {
    logger.error('Error fetching assets', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/v1/assets - Create asset
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createClient()
    const body = await request.json()
    const { name, type, category, description, projectId, ownerId, location, metadata } = body

    if (!name || !type || !projectId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { data: asset, error } = await supabase
      .from('assets')
      .insert({
        name,
        type,
        category,
        description,
        project_id: projectId,
        owner_id: ownerId,
        location,
        metadata
      })
      .select(`
        *,
        projects (
          id,
          name,
          slug
        )
      `)
      .single()

    if (error) {
      logger.error('Error creating asset', error)
      return NextResponse.json({ error: 'Failed to create asset' }, { status: 500 })
    }

    return NextResponse.json(asset, { status: 201 })
  } catch (error) {
    logger.error('Error creating asset', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
