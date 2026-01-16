
import { NextRequest, NextResponse } from "next/server"
import { logger } from "@/lib/logger"
import { db } from "@/lib/db"

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/v1/ghxstship/events/[id] - Get single event
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const bySlug = searchParams.get('bySlug') === 'true'

    let event
    if (bySlug) {
      event = await db.getEventBySlug(id)
    } else {
      event = await db.getEventById(id)
    }

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    return NextResponse.json({ event })
  } catch (error) {
    logger.error("Error fetching event", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT /api/v1/ghxstship/events/[id] - Update event
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const body = await request.json()

    const updatedEvent = await db.update('events', id, body)

    return NextResponse.json({ event: updatedEvent })
  } catch (error) {
    logger.error("Error updating event", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE /api/v1/ghxstship/events/[id] - Delete event
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    await db.delete('events', id)

    return NextResponse.json({ message: "Event deleted successfully" })
  } catch (error) {
    logger.error("Error deleting event", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
