
import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { createClient } from '@/lib/supabase/server'
import { auth } from '@/lib/auth'

// GET /api/v1/people - List people/contacts
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')
    const type = searchParams.get('type')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    const supabase = await createClient()
    let query = supabase
      .from('people')
      .select(`
        *,
        projects (
          id,
          name,
          slug
        ),
        credentials (
          id,
          type,
          level,
          status
        )
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (projectId) query = query.eq('project_id', projectId)
    if (type) query = query.eq('type', type)

    const { data: people, count, error } = await query

    if (error) {
      logger.error('Error fetching people', error)
      return NextResponse.json({ error: 'Failed to fetch people' }, { status: 500 })
    }

    return NextResponse.json({
      people: people || [],
      pagination: {
        total: count || 0,
        limit,
        offset,
        hasMore: offset + limit < (count || 0)
      }
    })
  } catch (error) {
    logger.error('Error fetching people', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/v1/people - Create person/contact
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { firstName, lastName, email, phone, company, role, projectId, type, metadata } = body

    if (!firstName || !lastName || !projectId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: person, error } = await supabase
      .from('people')
      .insert({
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        company,
        role,
        project_id: projectId,
        type: type || 'contact',
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
      logger.error('Error creating person', error)
      return NextResponse.json({ error: 'Failed to create person' }, { status: 500 })
    }

    return NextResponse.json(person, { status: 201 })
  } catch (error) {
    logger.error('Error creating person', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
