
import { NextRequest, NextResponse } from "next/server"
import { logger } from "@/lib/logger"
import { auth } from "@/auth"
import { createClient } from "@/lib/supabase/server"

// GET /api/messages - Get user's messages
export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await createClient()

    const { searchParams } = new URL(request.url)
    const conversationWith = searchParams.get('with') // User ID to get conversation with
    const limit = parseInt(searchParams.get('limit') || '50')

    if (conversationWith) {
      // Get conversation with specific user
      const { data: messages, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:sender_id(id, full_name, avatar_url),
          receiver:receiver_id(id, full_name, avatar_url)
        `)
        .or(`and(sender_id.eq.${session.user.id},receiver_id.eq.${conversationWith}),and(sender_id.eq.${conversationWith},receiver_id.eq.${session.user.id})`)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error

      return NextResponse.json({ messages: (messages || []).reverse() })
    } else {
      // Get all conversations (recent messages)
      const { data: recentMessages, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:sender_id(id, full_name, avatar_url),
          receiver:receiver_id(id, full_name, avatar_url)
        `)
        .or(`sender_id.eq.${session.user.id},receiver_id.eq.${session.user.id}`)
        .order('created_at', { ascending: false })
        .limit(100)

      if (error) throw error

      // Group by conversation partner
      const conversations = new Map()
      ;(recentMessages || []).forEach((message: { sender_id: string; receiver_id: string; sender: unknown; receiver: unknown; is_read: boolean }) => {
        const partnerId = message.sender_id === session.user.id ? message.receiver_id : message.sender_id
        const partner = message.sender_id === session.user.id ? message.receiver : message.sender

        if (!conversations.has(partnerId)) {
          conversations.set(partnerId, {
            partner,
            lastMessage: message,
            unreadCount: message.receiver_id === session.user.id && !message.is_read ? 1 : 0
          })
        } else {
          const conv = conversations.get(partnerId)
          if (message.receiver_id === session.user.id && !message.is_read) {
            conv.unreadCount++
          }
        }
      })

      return NextResponse.json({
        conversations: Array.from(conversations.values())
      })
    }
  } catch (error) {
    logger.error("Error fetching messages", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/messages - Send a message
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { content, receiver_id } = body

    const supabase = await createClient()

    if (!content || !receiver_id) {
      return NextResponse.json({ error: "content and receiver_id are required" }, { status: 400 })
    }

    // Verify receiver exists
    const { data: receiver, error: receiverError } = await supabase
      .from('platform_users')
      .select('id')
      .eq('id', receiver_id)
      .single()

    if (receiverError || !receiver) {
      return NextResponse.json({ error: "Receiver not found" }, { status: 404 })
    }

    // Create message
    const { data: message, error } = await supabase
      .from('messages')
      .insert({
        content,
        sender_id: session.user.id,
        receiver_id,
        is_read: false
      })
      .select(`
        *,
        sender:sender_id(id, full_name, avatar_url),
        receiver:receiver_id(id, full_name, avatar_url)
      `)
      .single()

    if (error) throw error

    // Log activity
    await supabase
      .from('activity_logs')
      .insert({
        user_id: session.user.id,
        action: "message_sent",
        entity_type: "message",
        entity_id: message.id,
        metadata: { receiver_id }
      })

    return NextResponse.json({ message }, { status: 201 })
  } catch (error) {
    logger.error("Error sending message", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
