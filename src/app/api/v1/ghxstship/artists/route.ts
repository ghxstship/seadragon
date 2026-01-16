
import { NextRequest, NextResponse } from "next/server"
import { logger } from "@/lib/logger"
import { db } from "@/lib/db"

// GET /api/v1/ghxstship/artists - List all artists/people from database
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const organizationId = searchParams.get('organizationId')
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '50')

    let people = await db.getPeople({ 
      organizationId: organizationId || undefined,
      limit 
    })

    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase()
      people = people.filter(p =>
        p.display_name?.toLowerCase().includes(searchLower) ||
        p.first_name?.toLowerCase().includes(searchLower) ||
        p.last_name?.toLowerCase().includes(searchLower) ||
        p.email?.toLowerCase().includes(searchLower)
      )
    }

    return NextResponse.json({
      artists: people,
      total: people.length,
      meta: {
        organizationId: organizationId || null,
        search: search || null,
        limit
      }
    })
  } catch (error) {
    logger.error("Error fetching artists/people", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
