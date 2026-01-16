
import { NextRequest, NextResponse } from "next/server"
import { logger } from "@/lib/logger"
import { auth } from "@/auth"
import { createClient } from "@/lib/supabase/server"

// GET /api/likes - Get likes for an entity or user's likes
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
    const userId = searchParams.get('userId') || session.user.id

    if (entityType && entityId) {
      // Get likes for a specific entity
      const { data: likes, error } = await supabase
        .from('likes')
        .select(`
          *,
          users (
            id,
            first_name,
            last_name,
            username,
            avatar
          )
        `)
        .eq('entity_type', entityType)
        .eq('entity_id', entityId)
        .order('created_at', { ascending: false })

      if (error) {
        logger.error("Error fetching likes", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
      }

      const likeCount = (likes || []).length
      const userLiked = (likes || []).some((like) => like.user_id === session.user.id)

      return NextResponse.json({
        likes: likes || [],
        likeCount,
        userLiked
      })
    } else {
      // Get all likes by a user
      const { data: likes, error } = await supabase
        .from('likes')
        .select(`
          *,
          users (
            id,
            first_name,
            last_name,
            username,
            avatar
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) {
        logger.error("Error fetching likes", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
      }

      return NextResponse.json({ likes: likes || [] })
    }
  } catch (error) {
    logger.error("Error fetching likes", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/likes - Like/unlike an entity
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await createClient()
    const body = await request.json()
    const { entityType, entityId, action } = body // action: 'like' or 'unlike'

    if (!entityType || !entityId || !action) {
      return NextResponse.json({ error: "entityType, entityId, and action are required" }, { status: 400 })
    }

    if (action === 'like') {
      // Check if already liked
      const { data: existingLike } = await supabase
        .from('likes')
        .select('id')
        .eq('user_id', session.user.id)
        .eq('entity_type', entityType)
        .eq('entity_id', entityId)
        .single()

      if (existingLike) {
        return NextResponse.json({ error: "Already liked" }, { status: 400 })
      }

      const { data: like, error } = await supabase
        .from('likes')
        .insert({
          user_id: session.user.id,
          entity_type: entityType,
          entity_id: entityId
        })
        .select()
        .single()

      if (error) {
        logger.error("Error creating like", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
      }

      // Log activity
      await supabase
        .from('activities')
        .insert({
          user_id: session.user.id,
          action: "like_created",
          entity: entityType,
          entity_id: entityId,
          details: { likeId: like.id }
        })

      return NextResponse.json({ like }, { status: 201 })
    } else if (action === 'unlike') {
      const { error, count } = await supabase
        .from('likes')
        .delete()
        .eq('user_id', session.user.id)
        .eq('entity_type', entityType)
        .eq('entity_id', entityId)

      if (error) {
        logger.error("Error deleting like", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
      }

      return NextResponse.json({
        message: "Unliked successfully",
        deletedCount: count || 0
      })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    logger.error("Error managing like", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
