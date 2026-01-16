
import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { createClient } from '@/lib/supabase/server'
import { auth } from '@/lib/auth'

// GET /api/v1/purchase-orders - List purchase orders
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const organizationId = searchParams.get('organizationId')
    const supplierId = searchParams.get('supplierId')
    const procurementRequestId = searchParams.get('procurementRequestId')
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    const supabase = await createClient()
    let query = supabase
      .from('procurement_orders')
      .select(`
        *,
        organizations (
          id,
          name
        ),
        suppliers (
          id,
          name,
          contact_info
        ),
        procurement_requests (
          id,
          item,
          quantity
        )
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (organizationId) query = query.eq('organization_id', organizationId)
    if (supplierId) query = query.eq('supplier_id', supplierId)
    if (procurementRequestId) query = query.eq('procurement_request_id', procurementRequestId)
    if (status) query = query.eq('status', status)

    const { data: purchaseOrders, error } = await query

    if (error) {
      logger.error('Error fetching purchase orders', error)
      return NextResponse.json({ error: 'Failed to fetch purchase orders' }, { status: 500 })
    }

    return NextResponse.json(purchaseOrders || [])
  } catch (error) {
    logger.error('Error fetching purchase orders', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/v1/purchase-orders - Create purchase order
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { organizationId, procurementRequestId, supplierId, totalAmount, status } = body

    if (!organizationId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: purchaseOrder, error } = await supabase
      .from('procurement_orders')
      .insert({
        organization_id: organizationId,
        procurement_request_id: procurementRequestId,
        supplier_id: supplierId,
        total_amount: totalAmount ? parseFloat(totalAmount) : null,
        status: status || 'draft'
      })
      .select(`
        *,
        organizations (
          id,
          name
        ),
        suppliers (
          id,
          name,
          contact_info
        ),
        procurement_requests (
          id,
          item,
          quantity
        )
      `)
      .single()

    if (error) {
      logger.error('Error creating purchase order', error)
      return NextResponse.json({ error: 'Failed to create purchase order' }, { status: 500 })
    }

    return NextResponse.json(purchaseOrder, { status: 201 })
  } catch (error) {
    logger.error('Error creating purchase order', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
