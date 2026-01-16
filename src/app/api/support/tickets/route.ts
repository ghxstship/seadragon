
import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { auth } from '@/auth'
import { createClient } from '@/lib/supabase/server'

// GET /api/support/tickets - List user's support tickets
export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '20')

    let query = supabase
      .from('support_tickets')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (status) {
      query = query.eq('status', status)
    }

    const { data: tickets, error } = await query

    if (error) {
      // If table doesn't exist, return empty array
      if (error.code === '42P01') {
        return NextResponse.json({
          success: true,
          data: [],
          message: 'Support tickets feature is being set up'
        })
      }
      throw error
    }

    return NextResponse.json({
      success: true,
      data: tickets || []
    })

  } catch (error) {
    logger.error('Error fetching support tickets', error)
    return NextResponse.json(
      { error: 'Failed to fetch support tickets' },
      { status: 500 }
    )
  }
}

// POST /api/support/tickets - Create new support ticket
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createClient()
    const body = await request.json()
    const { subject, category, priority, description } = body

    // Validate required fields
    if (!subject || !category || !description) {
      return NextResponse.json(
        { error: 'Subject, category, and description are required' },
        { status: 400 }
      )
    }

    // Create support ticket
    const { data: ticket, error } = await supabase
      .from('support_tickets')
      .insert({
        user_id: session.user.id,
        subject,
        category,
        priority: priority || 'normal',
        description,
        status: 'open',
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      // If table doesn't exist, log to activities instead
      if (error.code === '42P01') {
        const ticketId = `ticket_${Date.now()}`
        await supabase
          .from('activities')
          .insert({
            user_id: session.user.id,
            action: 'support_ticket_created',
            entity: 'support_ticket',
            entity_id: ticketId,
            details: {
              subject,
              category,
              priority: priority || 'normal',
              description
            }
          })

        return NextResponse.json({
          success: true,
          data: {
            id: ticketId,
            subject,
            category,
            priority: priority || 'normal',
            status: 'open'
          },
          message: 'Support ticket submitted successfully'
        }, { status: 201 })
      }
      throw error
    }

    // Log activity
    await supabase
      .from('activities')
      .insert({
        user_id: session.user.id,
        action: 'support_ticket_created',
        entity: 'support_ticket',
        entity_id: ticket.id,
        details: { subject, category, priority }
      })

    return NextResponse.json({
      success: true,
      data: ticket,
      message: 'Support ticket created successfully'
    }, { status: 201 })

  } catch (error) {
    logger.error('Error creating support ticket', error)
    return NextResponse.json(
      { error: 'Failed to create support ticket' },
      { status: 500 }
    )
  }
}
