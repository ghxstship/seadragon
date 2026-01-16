
import { NextRequest, NextResponse } from "next/server"
import { logger } from "@/lib/logger"
import { db } from "@/lib/db"

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/v1/ghxstship/artists/[id] - Get single artist/person
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    const person = await db.getPersonById(id)

    if (!person) {
      return NextResponse.json({ error: "Artist not found" }, { status: 404 })
    }

    return NextResponse.json({ artist: person })
  } catch (error) {
    logger.error("Error fetching artist", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
