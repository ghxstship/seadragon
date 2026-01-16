
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'
import { auth } from '@/auth'

// GET /api/procurement - Get procurement requests
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const category = searchParams.get('category')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = supabase
      .from('procurement_requests')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (status) {
      query = query.eq('status', status)
    }

    if (category) {
      query = query.eq('category', category)
    }

    const { data, error, count } = await query

    if (error) {
      throw error
    }

    return NextResponse.json({
      data: data || [],
      total: count || 0,
      limit,
      offset
    })
  } catch (error) {
    logger.error('Error fetching procurement requests', error)
    return NextResponse.json(
      { error: 'Failed to fetch procurement requests' },
      { status: 500 }
    )
  }
}

// POST /api/procurement - Create new procurement request
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createClient()
    const body = await request.json()

    // Validate required fields
    const { title, description, category, estimated_cost, organization_id } = body
    if (!title || !description || !category || !estimated_cost || !organization_id) {
      return NextResponse.json(
        { error: 'Missing required fields: title, description, category, estimated_cost, organization_id' },
        { status: 400 }
      )
    }

    // Create new procurement request in Supabase
    const { data, error } = await supabase
      .from('procurement_requests')
      .insert({
        organization_id,
        requester_id: session.user.id,
        title,
        description,
        category,
        priority: body.priority || 'medium',
        estimated_cost: parseFloat(estimated_cost),
        currency: body.currency || 'USD',
        status: 'draft',
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    logger.error('Error creating procurement request', error)
    return NextResponse.json(
      { error: 'Failed to create procurement request' },
      { status: 500 }
    )
  }
}
