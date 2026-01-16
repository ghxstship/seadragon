
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'
import { auth } from '@/lib/auth'

// GET /api/v1/settlements - List settlements from Supabase
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const organizationId = searchParams.get('organizationId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = (page - 1) * limit

    let query = supabase
      .from('settlements')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (status) {
      query = query.eq('status', status)
    }

    if (organizationId) {
      query = query.eq('organization_id', organizationId)
    }

    const { data: settlements, error, count } = await query

    if (error) throw error

    return NextResponse.json({
      settlements: settlements || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit)
      }
    })
  } catch (error) {
    logger.error('Error fetching settlements', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/v1/settlements - Create settlement in Supabase
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createClient()
    const body = await request.json()
    const { organization_id, amount, currency, description } = body

    if (!organization_id || !amount || !currency) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Create settlement in Supabase
    const { data: settlement, error } = await supabase
      .from('settlements')
      .insert({
        organization_id,
        amount,
        currency,
        description,
        status: 'pending',
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(settlement, { status: 201 })
  } catch (error) {
    logger.error('Error creating settlement', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
