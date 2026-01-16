
import { NextRequest, NextResponse } from "next/server"
import { logger } from "@/lib/logger"
import { auth } from "@/auth"
import { createClient } from "@/lib/supabase/server"
import { getStripe } from "@/lib/stripe"



// POST /api/payments/create-intent - Create Stripe payment intent
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { items } = body

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Items are required" }, { status: 400 })
    }

    // Calculate total amount
    let totalAmount = 0
    const lineItems = []

    const supabase = await createClient()
    
    for (const item of items) {
      if (item.type === 'ticket') {
        // Look up ticket price from database
        const { data: ticket } = await supabase
          .from('tickets')
          .select('*, events(*)')
          .eq('id', item.id)
          .single()

        if (!ticket || !ticket.price) {
          return NextResponse.json({ error: `Ticket not found or no price: ${item.id}` }, { status: 400 })
        }

        totalAmount += Number(ticket.price) * 100 // Convert to cents
        lineItems.push({
          price_data: {
            currency: ticket.currency || 'usd',
            product_data: {
              name: `${ticket.events?.name || 'Event'} - Ticket`,
              description: `Ticket for ${ticket.events?.name || 'Event'}`,
            },
            unit_amount: Number(ticket.price) * 100,
          },
          quantity: 1,
        })
      } else if (item.type === 'experience') {
        // Handle experience bookings
        // For now, assume a fixed price or look up from database
        totalAmount += item.price * 100
        lineItems.push({
          price_data: {
            currency: 'usd',
            product_data: {
              name: item.name,
              description: item.description,
            },
            unit_amount: item.price * 100,
          },
          quantity: item.quantity || 1,
        })
      }
    }

    const stripe = getStripe()

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount,
      currency: 'usd',
      metadata: {
        userId: session.user.id,
        organizationId: session.user.organizationId || null,
        items: JSON.stringify(items)
      },
      automatic_payment_methods: {
        enabled: true,
      },
    })

    // Store payment intent in database for tracking
    await supabase
      .from('activities')
      .insert({
        user_id: session.user.id,
        action: "payment_intent_created",
        entity: "payment",
        entity_id: paymentIntent.id,
        details: {
          amount: totalAmount,
          currency: 'usd',
          items: items
        }
      })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    })
  } catch (error) {
    logger.error("Error creating payment intent", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
