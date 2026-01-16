
import { NextRequest, NextResponse } from "next/server"
import { logger } from "@/lib/logger"
import { auth } from "@/auth"
import { createClient } from "@/lib/supabase/server"

// GET /api/finance - List budgets for authenticated user's organizations
export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const eventId = searchParams.get('eventId')
    const status = searchParams.get('status')

    let query = supabase
      .from('budgets')
      .select(`
        *,
        events (
          id,
          name,
          slug,
          projects (
            id,
            name,
            slug,
            workspaces (
              id,
              name,
              slug,
              organizations (
                id,
                name,
                slug
              )
            )
          )
        )
      `)
      .order('created_at', { ascending: false })

    if (eventId) query = query.eq('event_id', eventId)
    if (status) query = query.eq('status', status)

    const { data: budgets, error } = await query

    if (error) {
      logger.error("Error fetching budgets", error)
      return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }

    return NextResponse.json({ budgets: budgets || [] })
  } catch (error) {
    logger.error("Error fetching budgets", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/finance - Create new budget
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await createClient()
    const body = await request.json()
    const { name, category, amount, currency, eventId, status } = body

    if (!name || !category || !amount || !eventId) {
      return NextResponse.json({ error: "Name, category, amount, and event ID are required" }, { status: 400 })
    }

    // Check if user has access to the event
    const { data: event } = await supabase
      .from('events')
      .select('id')
      .eq('id', eventId)
      .single()

    if (!event) {
      return NextResponse.json({ error: "Access denied or event not found" }, { status: 403 })
    }

    // Create budget
    const { data: budget, error } = await supabase
      .from('budgets')
      .insert({
        name,
        category,
        amount: parseFloat(amount),
        currency: currency || "USD",
        status: status || "planned",
        event_id: eventId
      })
      .select(`
        *,
        events (
          id,
          name,
          slug,
          projects (
            id,
            name,
            slug,
            workspaces (
              id,
              name,
              slug,
              organizations (
                id,
                name,
                slug
              )
            )
          )
        )
      `)
      .single()

    if (error) {
      logger.error("Error creating budget", error)
      return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }

    return NextResponse.json({ budget }, { status: 201 })
  } catch (error) {
    logger.error("Error creating budget", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
