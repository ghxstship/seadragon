
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'
import { auth } from '@/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const jobId = searchParams.get('job_posting_id')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = supabase
      .from('applicants')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (status) {
      query = query.eq('status', status)
    }

    if (jobId) {
      query = query.eq('job_posting_id', jobId)
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
    logger.error('Error fetching candidates', error)
    return NextResponse.json(
      { error: 'Failed to fetch candidates' },
      { status: 500 }
    )
  }
}

// POST /api/recruitment/candidates - Create new candidate/applicant
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createClient()
    const body = await request.json()

    // Validate required fields
    const { name, email, job_posting_id, organization_id } = body
    if (!name || !email || !job_posting_id || !organization_id) {
      return NextResponse.json(
        { error: 'name, email, job_posting_id, and organization_id are required' },
        { status: 400 }
      )
    }

    // Create new applicant in Supabase
    const { data, error } = await supabase
      .from('applicants')
      .insert({
        organization_id,
        job_posting_id,
        name,
        email,
        phone: body.phone || null,
        resume_url: body.resume_url || null,
        cover_letter: body.cover_letter || null,
        status: 'applied',
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    logger.error('Error creating candidate', error)
    return NextResponse.json(
      { error: 'Failed to create candidate' },
      { status: 500 }
    )
  }
}
