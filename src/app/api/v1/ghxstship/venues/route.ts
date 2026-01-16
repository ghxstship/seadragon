
import { NextRequest, NextResponse } from "next/server"
import { logger } from "@/lib/logger"
import { db } from "@/lib/db"

// GET /api/v1/ghxstship/venues - List all venues from database
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const venueType = searchParams.get('venueType')
    const limit = parseInt(searchParams.get('limit') || '50')

    let venues = await db.getVenues({ limit })

    // Filter by venue type if provided
    if (venueType) {
      venues = venues.filter(v => v.venue_type === venueType)
    }

    return NextResponse.json({
      venues,
      total: venues.length,
      meta: {
        venueType: venueType || null,
        limit
      }
    })
  } catch (error) {
    logger.error("Error fetching venues", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
