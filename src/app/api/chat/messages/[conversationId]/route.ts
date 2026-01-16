
import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { auth } from '@/auth'
import { db } from '@/lib/db'

// GET /api/chat/messages/[conversationId] - Get messages for a conversation
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  try {
    const { conversationId } = await params
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')

    // Query messages from database
    const rows = await db.query<any>('ai_messages', {
      filters: { conversation_id: conversationId },
      order: { column: 'created_at', ascending: true },
      limit
    })

    const messages = rows.map((row) => {
      const senderId = row.role === 'user' ? session.user.id : 'assistant'
      const senderName = row.role === 'user' ? (session.user.name || 'You') : 'Assistant'

      return {
        id: String(row.id),
        senderId,
        senderName,
        content: String(row.content || ''),
        timestamp: String(row.created_at),
        type: 'text' as const,
        read: true,
        edited: false
      }
    })

    return NextResponse.json({
      messages,
      hasMore: messages.length === limit
    })
  } catch (error) {
    logger.error('Error fetching messages', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/chat/messages/[conversationId] - Send message to conversation
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  try {
    const { conversationId } = await params
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { content } = body

    if (!content) {
      return NextResponse.json({ error: 'Message content is required' }, { status: 400 })
    }

    // Create new message in database
    const row = await db.insert<any>('ai_messages', {
      conversation_id: conversationId,
      role: 'user',
      content,
      created_at: new Date().toISOString()
    })

    return NextResponse.json(
      {
        id: String(row.id),
        senderId: session.user.id,
        senderName: session.user.name || 'You',
        content: String(row.content || ''),
        timestamp: String(row.created_at),
        type: 'text' as const,
        read: true,
        edited: false
      },
      { status: 201 }
    )
  } catch (error) {
    logger.error('Error sending message', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/chat/messages/[conversationId] - Delete message
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  try {
    await params
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const messageId = searchParams.get('messageId')

    if (!messageId) {
      return NextResponse.json({ error: 'Message ID required' }, { status: 400 })
    }

    await db.delete('ai_messages', messageId)

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error('Error deleting message', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
