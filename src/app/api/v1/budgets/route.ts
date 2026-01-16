
import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { createClient } from '@/lib/supabase/server'
import { auth } from '@/lib/auth'

// GET /api/v1/budgets - List budgets
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const eventId = searchParams.get('eventId')
    const category = searchParams.get('category')
    const status = searchParams.get('status')

    const supabase = await createClient()
    let query = supabase
      .from('budgets')
      .select(`
        *,
        events (
          id,
          name,
          slug,
          start_date,
          end_date
        )
      `)
      .order('created_at', { ascending: false })

    if (eventId) query = query.eq('event_id', eventId)
    if (category) query = query.eq('category', category)
    if (status) query = query.eq('status', status)

    const { data: budgets, error } = await query

    if (error) {
      logger.error('Error fetching budgets', error)
      return NextResponse.json({ error: 'Failed to fetch budgets' }, { status: 500 })
    }

    return NextResponse.json(budgets || [])
  } catch (error) {
    logger.error('Error fetching budgets', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/v1/budgets - Create budget
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { eventId, name, category, amount, currency } = body

    if (!eventId || !name || !category || amount === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: budget, error } = await supabase
      .from('budgets')
      .insert({
        event_id: eventId,
        name,
        category,
        amount: parseFloat(amount),
        currency: currency || 'USD'
      })
      .select(`
        *,
        events (
          id,
          name,
          slug
        )
      `)
      .single()

    if (error) {
      logger.error('Error creating budget', error)
      return NextResponse.json({ error: 'Failed to create budget' }, { status: 500 })
    }

    return NextResponse.json(budget, { status: 201 })
  } catch (error) {
    logger.error('Error creating budget', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
