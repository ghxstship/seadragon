
import { NextRequest, NextResponse } from "next/server"
import { logger } from "@/lib/logger"
import { auth } from "@/auth"
import { createClient } from "@/lib/supabase/server"

// GET /api/comments - Get comments for an entity
export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const entityType = searchParams.get('entityType')
    const entityId = searchParams.get('entityId')

    if (!entityType || !entityId) {
      return NextResponse.json({ error: "entityType and entityId are required" }, { status: 400 })
    }

    const { data: comments, error } = await supabase
      .from('comments')
      .select(`
        *,
        author:users!comments_author_id_fkey (
          id,
          first_name,
          last_name,
          username,
          avatar
        ),
        replies:comments!comments_parent_id_fkey (
          *,
          author:users!comments_author_id_fkey (
            id,
            first_name,
            last_name,
            username,
            avatar
          )
        )
      `)
      .eq('entity_type', entityType)
      .eq('entity_id', entityId)
      .is('parent_id', null)
      .order('created_at', { ascending: false })

    if (error) {
      logger.error("Error fetching comments", error)
      return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }

    return NextResponse.json({ comments: comments || [] })
  } catch (error) {
    logger.error("Error fetching comments", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/comments - Create a new comment
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await createClient()
    const body = await request.json()
    const { content, entityType, entityId, parentId } = body

    if (!content || !entityType || !entityId) {
      return NextResponse.json({ error: "content, entityType, and entityId are required" }, { status: 400 })
    }

    const { data: comment, error } = await supabase
      .from('comments')
      .insert({
        content,
        author_id: session.user.id,
        entity_type: entityType,
        entity_id: entityId,
        parent_id: parentId || null
      })
      .select(`
        *,
        author:users!comments_author_id_fkey (
          id,
          first_name,
          last_name,
          username,
          avatar
        )
      `)
      .single()

    if (error) {
      logger.error("Error creating comment", error)
      return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }

    // Log activity
    await supabase
      .from('activities')
      .insert({
        user_id: session.user.id,
        action: "comment_created",
        entity: entityType,
        entity_id: entityId,
        details: { commentId: comment.id }
      })

    return NextResponse.json({ comment }, { status: 201 })
  } catch (error) {
    logger.error("Error creating comment", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
