
import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { createClient } from '@/lib/supabase/server'
import { auth } from '@/lib/auth'

// GET /api/v1/invoices - List invoices
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const organizationId = searchParams.get('organizationId')
    const clientId = searchParams.get('clientId')
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    const supabase = await createClient()
    let query = supabase
      .from('invoices')
      .select(`
        *,
        organizations (
          id,
          name
        ),
        clients (
          id,
          name
        )
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (organizationId) query = query.eq('organization_id', organizationId)
    if (clientId) query = query.eq('client_id', clientId)
    if (status) query = query.eq('status', status)

    const { data: invoices, error } = await query

    if (error) {
      logger.error('Error fetching invoices', error)
      return NextResponse.json({ error: 'Failed to fetch invoices' }, { status: 500 })
    }

    return NextResponse.json(invoices || [])
  } catch (error) {
    logger.error('Error fetching invoices', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/v1/invoices - Create invoice
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { organizationId, clientId, amount, dueDate, notes } = body

    if (!organizationId || !amount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: invoice, error } = await supabase
      .from('invoices')
      .insert({
        organization_id: organizationId,
        client_id: clientId,
        amount: parseFloat(amount),
        due_date: dueDate || null,
        notes,
        status: 'draft'
      })
      .select(`
        *,
        organizations (
          id,
          name
        ),
        clients (
          id,
          name
        )
      `)
      .single()

    if (error) {
      logger.error('Error creating invoice', error)
      return NextResponse.json({ error: 'Failed to create invoice' }, { status: 500 })
    }

    return NextResponse.json(invoice, { status: 201 })
  } catch (error) {
    logger.error('Error creating invoice', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
