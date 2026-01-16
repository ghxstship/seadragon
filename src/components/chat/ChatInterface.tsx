
'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Send,
  Search,
  MoreVertical,
  Phone,
  Video,
  Info,
  Smile,
  Paperclip,
  Image as ImageIcon,
  Mic,
  MicOff,
  Settings
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'

interface MessageApiResponse {
  id: string | number
  senderId: string | number
  senderName?: string
  senderAvatar?: string
  content?: string
  timestamp: string | Date
  type?: string
  read?: boolean
  edited?: boolean
  reactions?: { emoji: string; count: number; users: string[] }[]
}

export interface Message {
  id: string
  senderId: string
  senderName: string
  senderAvatar?: string
  content: string
  timestamp: Date
  type: 'text' | 'image' | 'file' | 'system'
  read: boolean
  edited?: boolean
  reactions?: { emoji: string; count: number; users: string[] }[]
}

export interface Conversation {
  id: string
  type: 'direct' | 'group' | 'support'
  name: string
  avatar?: string
  lastMessage?: Message
  unreadCount: number
  participants: Array<{
    id: string
    name: string
    avatar?: string
    role?: 'admin' | 'member'
  }>
  updatedAt: Date
}

interface ChatInterfaceProps {
  conversations: Conversation[]
  currentUserId: string
  onSendMessage: (conversationId: string, content: string, type?: Message['type']) => void
  onMarkAsRead: (conversationId: string) => void
  className?: string
}

export function ChatInterface({
  conversations,
  currentUserId,
  onSendMessage,
  onMarkAsRead,
  className
}: ChatInterfaceProps) {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(
    conversations.length > 0 ? conversations[0] : null
  )
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Mock messages for the selected conversation
  useEffect(() => {
    let cancelled = false

    const loadMessages = async () => {
      if (!selectedConversation) return
      setMessages([])

      try {
        const res = await fetch(`/api/chat/messages/${selectedConversation.id}?limit=200`)
        if (!res.ok) return

        const data = await res.json()

        const nextMessages: Message[] = (data.messages || []).map((m: any) => ({
          id: String(m.id),
          senderId: String(m.senderId),
          senderName: String(m.senderName || 'Unknown'),
          senderAvatar: m.senderAvatar ? String(m.senderAvatar) : undefined,
          content: String(m.content || ''),
          timestamp: new Date(m.timestamp),
          type: (m.type || 'text') as Message['type'],
          read: Boolean(m.read),
          edited: Boolean(m.edited)
        }))

        if (!cancelled) {
          setMessages(nextMessages)
          onMarkAsRead(selectedConversation.id)
        }
      } catch {
        if (!cancelled) {
          setMessages([])
        }
      }
    }

    loadMessages()

    return () => {
      cancelled = true
    }
  }, [selectedConversation, onMarkAsRead])

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return

    const message: Message = {
      id: Date.now().toString(),
      senderId: currentUserId,
      senderName: 'You',
      content: newMessage,
      timestamp: new Date(),
      type: 'text',
      read: true
    }

    setMessages(prev => [...prev, message])
    onSendMessage(selectedConversation.id, newMessage)
    setNewMessage('')

    setIsTyping(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatMessageTime = (timestamp: Date) => {
    const now = new Date()
    const diffInHours = (now.getTime() - timestamp.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return format(timestamp, 'HH:mm')
    } else if (diffInHours < 168) { // 7 days
      return format(timestamp, 'EEE')
    } else {
      return format(timestamp, 'MMM dd')
    }
  }

  return (
    <div className={cn('flex h-[600px] border rounded-lg overflow-hidden bg-background', className)}>
      {/* Conversations Sidebar */}
      <div className="w-80 border-r bg-muted/30">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Messages</h2>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4"/>
            </Button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"/>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="divide-y">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className={cn(
                  'p-4 cursor-pointer hover:bg-muted/50 transition-colors',
                  selectedConversation?.id === conversation.id && 'bg-muted'
                )}
                onClick={() => setSelectedConversation(conversation)}
              >
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={conversation.avatar} alt={conversation.name}/>
                    <AvatarFallback>
                      {conversation.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium truncate">{conversation.name}</h3>
                      <span className="text-xs text-muted-foreground">
                        {conversation.lastMessage ?
                          formatMessageTime(conversation.lastMessage.timestamp) :
                          ''
                        }
                      </span>
                    </div>

                    {conversation.lastMessage && (
                      <p className="text-sm text-muted-foreground truncate mt-1">
                        {conversation.lastMessage.senderId === currentUserId ? 'You: ' : ''}
                        {conversation.lastMessage.content}
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-2">
                        {conversation.type === 'group' && (
                          <Badge variant="secondary" className="text-xs">
                            Group
                          </Badge>
                        )}
                        {conversation.type === 'support' && (
                          <Badge variant="outline" className="text-xs">
                            Support
                          </Badge>
                        )}
                      </div>

                      {conversation.unreadCount > 0 && (
                        <Badge variant="destructive" className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                          {conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b bg-background">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={selectedConversation.avatar} alt={selectedConversation.name}/>
                    <AvatarFallback>
                      {selectedConversation.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <h3 className="font-medium">{selectedConversation.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedConversation.type === 'direct' ? 'Direct message' :
                       selectedConversation.type === 'group' ? `${selectedConversation.participants.length} members` :
                       'Customer support'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Phone className="h-4 w-4"/>
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Video className="h-4 w-4"/>
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Info className="h-4 w-4"/>
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4"/>
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      'flex',
                      message.senderId === currentUserId ? 'justify-end' : 'justify-start'
                    )}
                  >
                    <div className={cn(
                      'max-w-[70%] rounded-lg p-3',
                      message.senderId === currentUserId
                        ? 'bg-accent-primary text-primary-foreground'
                        : 'bg-muted'
                    )}>
                      <p className="text-sm">{message.content}</p>
                      <div className="flex items-center justify-end mt-1 space-x-1">
                        <span className="text-xs opacity-70">
                          {format(message.timestamp, 'HH:mm')}
                        </span>
                        {message.senderId === currentUserId && (
                          <div className="flex">
                            <div className="w-1 h-1 bg-background rounded-full opacity-70"></div>
                            <div className="w-1 h-1 bg-background rounded-full opacity-70 ml-1"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg p-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div ref={messagesEndRef}/>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t bg-background">
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Paperclip className="h-4 w-4"/>
                </Button>
                <Button variant="ghost" size="sm">
                  <ImageIcon className="h-4 w-4"/>
                </Button>

                <div className="flex-1 relative">
                  <Input
                    ref={inputRef}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    className="pr-12"/>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2"
                  >
                    <Smile className="h-4 w-4"/>
                  </Button>
                </div>

                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  size="sm"
                >
                  <Send className="h-4 w-4"/>
                </Button>

                <Button variant="ghost" size="sm">
                  <Mic className="h-4 w-4"/>
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="h-8 w-8 text-muted-foreground"/>
              </div>
              <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
              <p className="text-muted-foreground">
                Choose a conversation from the sidebar to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Compact chat widget for headers/navigation
interface ChatWidgetProps {
  unreadCount: number
  onClick: () => void
  className?: string
}

export function ChatWidget({ unreadCount, onClick, className }: ChatWidgetProps) {
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={onClick}
      className={cn('relative', className)}
    >
      <Send className="h-4 w-4"/>
      {unreadCount > 0 && (
        <Badge
          variant="destructive"
          className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
        >
          {unreadCount > 9 ? '9+' : unreadCount}
        </Badge>
      )}
    </Button>
  )
}
