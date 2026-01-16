
import { NextRequest, NextResponse } from "next/server"
import { logger } from "@/lib/logger"
import { db } from "@/lib/db"

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/v1/ghxstship/venues/[id] - Get single venue
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    const venue = await db.getVenueById(id)

    if (!venue) {
      return NextResponse.json({ error: "Venue not found" }, { status: 404 })
    }

    return NextResponse.json({ venue })
  } catch (error) {
    logger.error("Error fetching venue", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
