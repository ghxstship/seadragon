
import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { createClient } from '@/lib/supabase/server'
import { auth } from '@/lib/auth'

// GET /api/v1/expenses - List expenses
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const organizationId = searchParams.get('organizationId')
    const userId = searchParams.get('userId')
    const category = searchParams.get('category')
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    const supabase = await createClient()
    let query = supabase
      .from('expense_reports')
      .select(`
        *,
        users (
          id,
          first_name,
          last_name,
          email
        ),
        organizations (
          id,
          name
        ),
        expense_approvals (
          *,
          approvers:users (
            id,
            first_name,
            last_name
          )
        )
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (organizationId) query = query.eq('organization_id', organizationId)
    if (userId) query = query.eq('user_id', userId)
    if (category) query = query.eq('category', category)
    if (status) query = query.eq('status', status)

    const { data: expenses, error } = await query

    if (error) {
      logger.error('Error fetching expenses', error)
      return NextResponse.json({ error: 'Failed to fetch expenses' }, { status: 500 })
    }

    return NextResponse.json(expenses || [])
  } catch (error) {
    logger.error('Error fetching expenses', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/v1/expenses - Create expense
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { organizationId, title, totalAmount, category, description } = body

    if (!organizationId || !title || totalAmount === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: expense, error } = await supabase
      .from('expense_reports')
      .insert({
        organization_id: organizationId,
        user_id: session.user.id,
        title,
        total_amount: parseFloat(totalAmount),
        category,
        description,
        status: 'draft'
      })
      .select(`
        *,
        users (
          id,
          first_name,
          last_name,
          email
        ),
        organizations (
          id,
          name
        )
      `)
      .single()

    if (error) {
      logger.error('Error creating expense', error)
      return NextResponse.json({ error: 'Failed to create expense' }, { status: 500 })
    }

    return NextResponse.json(expense, { status: 201 })
  } catch (error) {
    logger.error('Error creating expense', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
