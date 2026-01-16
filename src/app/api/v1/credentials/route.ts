
import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { createClient } from '@/lib/supabase/server'
import { auth } from '@/lib/auth'

// GET /api/v1/credentials - List credentials
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const eventId = searchParams.get('eventId')
    const personId = searchParams.get('personId')
    const type = searchParams.get('type')
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    const supabase = await createClient()
    let query = supabase
      .from('credentials')
      .select(`
        *,
        people (
          id,
          first_name,
          last_name,
          email,
          company,
          role
        ),
        events (
          id,
          name,
          start_date,
          end_date
        )
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (eventId) query = query.eq('event_id', eventId)
    if (personId) query = query.eq('person_id', personId)
    if (type) query = query.eq('type', type)
    if (status) query = query.eq('status', status)

    const { data: credentials, error } = await query

    if (error) {
      logger.error('Error fetching credentials', error)
      return NextResponse.json({ error: 'Failed to fetch credentials' }, { status: 500 })
    }

    return NextResponse.json(credentials || [])
  } catch (error) {
    logger.error('Error fetching credentials', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/v1/credentials - Create credential
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { eventId, personId, type, level, zones, department, position, validFrom, validTo } = body

    if (!eventId || !personId || !type || !level) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: credential, error } = await supabase
      .from('credentials')
      .insert({
        event_id: eventId,
        person_id: personId,
        type,
        level,
        zones: zones || {},
        department,
        position,
        valid_from: validFrom,
        valid_to: validTo,
        status: 'active'
      })
      .select(`
        *,
        people (
          id,
          first_name,
          last_name,
          email,
          company,
          role
        ),
        events (
          id,
          name,
          start_date,
          end_date
        )
      `)
      .single()

    if (error) {
      logger.error('Error creating credential', error)
      return NextResponse.json({ error: 'Failed to create credential' }, { status: 500 })
    }

    return NextResponse.json(credential, { status: 201 })
  } catch (error) {
    logger.error('Error creating credential', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
