
import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { createClient } from '@/lib/supabase/server'
import { auth } from '@/lib/auth'

// GET /api/v1/vendors - List vendors (using Supplier model)
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const organizationId = searchParams.get('organizationId')
    const name = searchParams.get('name')
    const isActive = searchParams.get('isActive')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    const supabase = await createClient()
    let query = supabase
      .from('suppliers')
      .select(`
        *,
        organizations (
          id,
          name
        ),
        procurement_orders (
          id,
          order_number,
          status,
          total_amount
        )
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (organizationId) query = query.eq('organization_id', organizationId)
    if (name) query = query.ilike('name', `%${name}%`)
    if (isActive !== null) query = query.eq('is_active', isActive === 'true')

    const { data: vendors, error } = await query

    if (error) {
      logger.error('Error fetching vendors', error)
      return NextResponse.json({ error: 'Failed to fetch vendors' }, { status: 500 })
    }

    return NextResponse.json(vendors || [])
  } catch (error) {
    logger.error('Error fetching vendors', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/v1/vendors - Create vendor (using Supplier model)
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { organizationId, name, contactInfo, address, taxId, paymentTerms } = body

    if (!organizationId || !name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: vendor, error } = await supabase
      .from('suppliers')
      .insert({
        organization_id: organizationId,
        name,
        contact_info: contactInfo,
        address,
        tax_id: taxId,
        payment_terms: paymentTerms,
        is_active: true
      })
      .select(`
        *,
        organizations (
          id,
          name
        )
      `)
      .single()

    if (error) {
      logger.error('Error creating vendor', error)
      return NextResponse.json({ error: 'Failed to create vendor' }, { status: 500 })
    }

    return NextResponse.json(vendor, { status: 201 })
  } catch (error) {
    logger.error('Error creating vendor', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
