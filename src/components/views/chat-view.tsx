
import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Send,
  Smile,
  Paperclip,
  MoreHorizontal,
  Hash,
  Users,
  Settings,
  Search
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface ChatViewProps {
  channel?: {
    id: string
    name: string
    description?: string
    type: 'channel' | 'dm'
    members: Array<{
      id: string
      name: string
      avatar?: string
      isOnline?: boolean
    }>
  }
  messages?: Array<{
    id: string
    content: string
    author: {
      id: string
      name: string
      avatar?: string
    }
    timestamp: Date
    reactions?: Array<{
      emoji: string
      count: number
      users: string[]
    }>
    replies?: Array<{
      id: string
      content: string
      author: { id: string; name: string }
      timestamp: Date
    }>
    attachments?: Array<{
      id: string
      name: string
      type: string
      url: string
    }>
  }>
  onSendMessage?: (content: string) => void
  onReact?: (messageId: string, emoji: string) => void
  isGuest?: boolean
}

export function ChatView({
  channel,
  messages = [],
  onSendMessage,
  onReact,
  isGuest = false
}: ChatViewProps) {
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (newMessage.trim() && !isGuest) {
      onSendMessage?.(newMessage.trim())
      setNewMessage('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="h-full flex flex-col bg-neutral-50">
      {/* Header */}
      <div className="bg-background border-b border-neutral-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {channel?.type === 'channel' ? (
              <Hash className="w-5 h-5 text-neutral-500"/>
            ) : (
              <Users className="w-5 h-5 text-neutral-500"/>
            )}
            <div>
              <h1 className="text-lg font-semibold">{channel?.name || 'General'}</h1>
              {channel?.description && (
                <p className="text-sm text-neutral-600">{channel.description}</p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Search className="w-4 h-4"/>
            </Button>
            <Button variant="ghost" size="sm">
              <Users className="w-4 h-4"/>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-4 h-4"/>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem disabled={isGuest}>
                  Channel Settings
                </DropdownMenuItem>
                <DropdownMenuItem disabled={isGuest}>
                  Notification Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator/>
                <DropdownMenuItem disabled={isGuest}>
                  Leave Channel
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-neutral-400 mb-4">
                {channel?.type === 'channel' ? 'No messages in this channel yet.' : 'No messages yet.'}
              </div>
              {!isGuest && (
                <Button onClick={() => setNewMessage('Welcome to the channel! ')}>
                  Start the conversation
                </Button>
              )}
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className="group flex space-x-3">
                <Avatar className="w-8 h-8 mt-1">
                  <AvatarImage src={message.author.avatar}/>
                  <AvatarFallback>
                    {message.author.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-sm">{message.author.name}</span>
                    <span className="text-xs text-neutral-500">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>

                  <div className="text-sm text-neutral-900 mb-2">
                    {message.content}
                  </div>

                  {/* Attachments */}
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="space-y-2 mb-2">
                      {message.attachments.map((attachment) => (
                        <div key={attachment.id} className="flex items-center space-x-2 p-2 bg-neutral-100 rounded">
                          <Paperclip className="w-4 h-4 text-neutral-500"/>
                          <span className="text-sm">{attachment.name}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reactions */}
                  {message.reactions && message.reactions.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {message.reactions.map((reaction, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="h-6 px-2 text-xs"
                          onClick={() => !isGuest && onReact?.(message.id, reaction.emoji)}
                          disabled={isGuest}
                        >
                          {reaction.emoji} {reaction.count}
                        </Button>
                      ))}
                    </div>
                  )}

                  {/* Replies */}
                  {message.replies && message.replies.length > 0 && (
                    <div className="ml-4 space-y-1">
                      {message.replies.map((reply) => (
                        <div key={reply.id} className="flex items-start space-x-2 p-2 bg-neutral-50 rounded">
                          <Avatar className="w-5 h-5">
                            <AvatarFallback className="text-xs">
                              {reply.author.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center space-x-1 mb-1">
                              <span className="font-medium text-xs">{reply.author.name}</span>
                              <span className="text-xs text-neutral-500">
                                {formatTime(reply.timestamp)}
                              </span>
                            </div>
                            <p className="text-xs text-neutral-700">{reply.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Message Actions (on hover) */}
                  <div className="opacity-0 group-hover:opacity-100 flex items-center space-x-1 mt-1">
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                      Reply
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs"
                      disabled={isGuest}
                    >
                      
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs"
                      disabled={isGuest}
                    >
                      
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef}/>
        </div>
      </ScrollArea>

      {/* Message Input */}
      {!isGuest && (
        <div className="bg-background border-t border-neutral-200 p-4">
          <div className="flex items-end space-x-3">
            <div className="flex-1">
              <Textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={`Message ${channel?.type === 'channel' ? '#' : ''}${channel?.name || 'channel'}`}
                rows={1}
                className="min-h-[40px] max-h-32 resize-none"/>
            </div>

            <div className="flex items-center space-x-1">
              <Button variant="ghost" size="sm">
                <Smile className="w-4 h-4"/>
              </Button>
              <Button variant="ghost" size="sm">
                <Paperclip className="w-4 h-4"/>
              </Button>
              <Button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                size="sm"
              >
                <Send className="w-4 h-4"/>
              </Button>
            </div>
          </div>

          {isTyping && (
            <div className="text-xs text-neutral-500 mt-2">
              Someone is typing...
            </div>
          )}
        </div>
      )}

      {/* Guest Notice */}
      {isGuest && (
        <div className="bg-background border-t border-neutral-200 p-4">
          <div className="text-center text-neutral-600">
            <p className="text-sm mb-2">Sign in to participate in conversations</p>
            <Button size="sm">Sign In</Button>
          </div>
        </div>
      )}
    </div>
  )
}
