
import { NextRequest, NextResponse } from "next/server"
import { logger } from "@/lib/logger"
import { auth } from "@/auth"
import { createClient } from "@/lib/supabase/server"

// GET /api/assets - List assets for authenticated user's organizations
export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')
    const type = searchParams.get('type')
    const status = searchParams.get('status')

    let query = supabase
      .from('assets')
      .select(`
        *,
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
      `)
      .order('updated_at', { ascending: false })

    if (projectId) query = query.eq('project_id', projectId)
    if (type) query = query.eq('type', type)
    if (status) query = query.eq('status', status)

    const { data: assets, error } = await query

    if (error) {
      logger.error("Error fetching assets", error)
      return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }

    return NextResponse.json({ assets: assets || [] })
  } catch (error) {
    logger.error("Error fetching assets", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/assets - Create new asset
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await createClient()
    const body = await request.json()
    const { name, type, category, description, projectId, ownerId, location, status, metadata } = body

    if (!name || !type || !projectId) {
      return NextResponse.json({ error: "Name, type, and project ID are required" }, { status: 400 })
    }

    // Check if user has access to the project
    const { data: project } = await supabase
      .from('projects')
      .select('id')
      .eq('id', projectId)
      .single()

    if (!project) {
      return NextResponse.json({ error: "Access denied or project not found" }, { status: 403 })
    }

    // Create asset
    const { data: asset, error } = await supabase
      .from('assets')
      .insert({
        name,
        type,
        category,
        description,
        project_id: projectId,
        owner_id: ownerId,
        location,
        status: status || "available",
        metadata: metadata || null
      })
      .select(`
        *,
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
      `)
      .single()

    if (error) {
      logger.error("Error creating asset", error)
      return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }

    return NextResponse.json({ asset }, { status: 201 })
  } catch (error) {
    logger.error("Error creating asset", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
