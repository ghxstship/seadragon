
import { NextRequest, NextResponse } from "next/server"
import { logger } from "@/lib/logger"
import { auth } from "@/auth"
import { createClient } from "@/lib/supabase/server"

// POST /api/tickets/purchase - Purchase tickets with payment
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await createClient()
    const body = await request.json()
    const { eventId, ticketType, quantity = 1, paymentIntentId } = body

    if (!eventId || !ticketType) {
      return NextResponse.json({ error: "Event ID and ticket type are required" }, { status: 400 })
    }

    // Verify event exists
    const { data: event } = await supabase
      .from('events')
      .select('id')
      .eq('id', eventId)
      .single()

    if (!event) {
      return NextResponse.json({ error: "Event not found or access denied" }, { status: 403 })
    }

    // Create tickets
    const ticketsToInsert = []
    for (let i = 0; i < quantity; i++) {
      ticketsToInsert.push({
        event_id: eventId,
        user_id: paymentIntentId ? session.user.id : null,
        type: ticketType,
        status: paymentIntentId ? 'sold' : 'available',
        qr_code: paymentIntentId ? `TICKET-${Date.now()}-${i}` : null
      })
    }

    const { data: tickets, error } = await supabase
      .from('tickets')
      .insert(ticketsToInsert)
      .select()

    if (error) {
      logger.error("Error creating tickets", error)
      return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }

    // If payment intent provided, log purchase
    if (paymentIntentId && tickets && tickets.length > 0) {
      await supabase
        .from('activities')
        .insert({
          user_id: session.user.id,
          action: "ticket_purchase",
          entity: "ticket",
          entity_id: tickets[0].id,
          details: {
            eventId,
            ticketType,
            quantity,
            paymentIntentId,
            tickets: tickets.map(t => t.id)
          }
        })
    }

    return NextResponse.json({ tickets: tickets || [] }, { status: 201 })
  } catch (error) {
    logger.error("Error purchasing tickets", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
