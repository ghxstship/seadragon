
import { NextRequest, NextResponse } from "next/server"
import { logger } from "@/lib/logger"
import { auth } from "@/auth"
import { createClient } from "@/lib/supabase/server"

// GET /api/follows - Get user's following/followers
export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // 'following' or 'followers'
    const userId = searchParams.get('userId') || session.user.id

    if (type === 'following') {
      const { data: following, error } = await supabase
        .from('follows')
        .select(`
          following:users!follows_following_id_fkey (
            id,
            first_name,
            last_name,
            username,
            avatar
          )
        `)
        .eq('follower_id', userId)

      if (error) {
        logger.error("Error fetching following", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
      }

      return NextResponse.json({ following: (following || []).map((f) => f.following) })
    } else if (type === 'followers') {
      const { data: followers, error } = await supabase
        .from('follows')
        .select(`
          follower:users!follows_follower_id_fkey (
            id,
            first_name,
            last_name,
            username,
            avatar
          )
        `)
        .eq('following_id', userId)

      if (error) {
        logger.error("Error fetching followers", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
      }

      return NextResponse.json({ followers: (followers || []).map((f) => f.follower) })
    }

    return NextResponse.json({ error: "Invalid type parameter" }, { status: 400 })
  } catch (error) {
    logger.error("Error fetching follows", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/follows - Follow/unfollow a user
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await createClient()
    const body = await request.json()
    const { targetUserId, action } = body // action: 'follow' or 'unfollow'

    if (!targetUserId || !action) {
      return NextResponse.json({ error: "targetUserId and action are required" }, { status: 400 })
    }

    if (action === 'follow') {
      // Check if already following
      const { data: existingFollow } = await supabase
        .from('follows')
        .select('id')
        .eq('follower_id', session.user.id)
        .eq('following_id', targetUserId)
        .single()

      if (existingFollow) {
        return NextResponse.json({ error: "Already following this user" }, { status: 400 })
      }

      const { data: follow, error } = await supabase
        .from('follows')
        .insert({
          follower_id: session.user.id,
          following_id: targetUserId
        })
        .select()
        .single()

      if (error) {
        logger.error("Error creating follow", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
      }

      return NextResponse.json({ follow }, { status: 201 })
    } else if (action === 'unfollow') {
      const { error } = await supabase
        .from('follows')
        .delete()
        .eq('follower_id', session.user.id)
        .eq('following_id', targetUserId)

      if (error) {
        logger.error("Error deleting follow", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
      }

      return NextResponse.json({ message: "Unfollowed successfully" })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    logger.error("Error managing follow", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
