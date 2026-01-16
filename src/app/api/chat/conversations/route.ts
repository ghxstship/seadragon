
import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import type { Conversation } from '@/components/chat/ChatInterface'

// GET /api/chat/conversations - Get user's conversations from database
export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Query conversations from database
    const conversations = await db.query<any>('ai_conversations', {
      filters: { user_id: session.user.id },
      order: { column: 'updated_at', ascending: false },
      limit: 50
    })

    const mapped: Conversation[] = await Promise.all(
      conversations.map(async (conv) => {
        const last = await db.query<any>('ai_messages', {
          filters: { conversation_id: conv.id },
          order: { column: 'created_at', ascending: false },
          limit: 1
        })

        const lastRow = last[0]
        const lastMessage = lastRow
          ? {
              id: String(lastRow.id),
              senderId: lastRow.role === 'user' ? session.user.id : 'assistant',
              senderName: lastRow.role === 'user' ? (session.user.name || 'You') : 'Assistant',
              content: String(lastRow.content || ''),
              timestamp: new Date(lastRow.created_at),
              type: 'text' as const,
              read: true
            }
          : undefined

        return {
          id: String(conv.id),
          type: 'direct',
          name: String(conv.title || 'Conversation'),
          avatar: undefined,
          lastMessage,
          unreadCount: 0,
          participants: [
            { id: session.user.id, name: session.user.name || 'You' },
            { id: 'assistant', name: 'Assistant' }
          ],
          updatedAt: new Date(conv.updated_at || conv.created_at)
        }
      })
    )

    return NextResponse.json({
      conversations: mapped,
      total: mapped.length,
      currentUserId: session.user.id
    })
  } catch (error) {
    logger.error('Error fetching conversations', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/chat/conversations - Create new conversation
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, context } = body

    // Create conversation in database
    const newConversation = await db.insert('ai_conversations', {
      user_id: session.user.id,
      title: title || 'New Conversation',
      context: context || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })

    const mapped: Conversation = {
      id: String((newConversation as any).id),
      type: 'direct',
      name: String((newConversation as any).title || 'Conversation'),
      avatar: undefined,
      unreadCount: 0,
      participants: [
        { id: session.user.id, name: session.user.name || 'You' },
        { id: 'assistant', name: 'Assistant' }
      ],
      updatedAt: new Date((newConversation as any).updated_at || (newConversation as any).created_at)
    }

    return NextResponse.json(mapped, { status: 201 })
  } catch (error) {
    logger.error('Error creating conversation', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
