
import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Hash,
  Users,
  Plus,
  Search,
  Settings,
  MoreHorizontal,
  Send,
  Paperclip,
  Smile,
  AtSign,
  Clock,
  Save,
  Mail,
  MessageSquare,
  CheckCircle
} from 'lucide-react'
import { format } from 'date-fns'

interface ChatMessage {
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
  attachments?: Array<{
    id: string
    name: string
    type: string
    url: string
    size: number
  }>
  mentions?: string[]
  isScheduled?: boolean
  scheduledFor?: Date
  replies?: ChatMessage[]
  threadId?: string
}

interface ChatChannel {
  id: string
  name: string
  type: 'channel' | 'dm' | 'group'
  description?: string
  members: Array<{
    id: string
    name: string
    avatar?: string
    isOnline?: boolean
    role?: 'admin' | 'member'
  }>
  emailAddress?: string
  lastMessage?: ChatMessage
  unreadCount?: number
  isArchived?: boolean
}

interface ChatSystemProps {
  channels: ChatChannel[]
  currentUser: {
    id: string
    name: string
    avatar?: string
  }
  onSendMessage?: (channelId: string, message: Omit<ChatMessage, 'id' | 'timestamp'>) => void
  onCreateChannel?: (channel: Omit<ChatChannel, 'id'>) => void
  onScheduleMessage?: (channelId: string, message: Omit<ChatMessage, 'id' | 'timestamp'>, scheduledFor: Date) => void
  onSaveMessage?: (messageId: string) => void
  onAssociateTask?: (messageId: string, taskId: string) => void
  isGuest?: boolean
}

export function ChatSystem({
  channels,
  currentUser,
  onSendMessage,
  onCreateChannel,
  onScheduleMessage,
  onSaveMessage,
  onAssociateTask,
  isGuest = false
}: ChatSystemProps) {
  const [selectedChannel, setSelectedChannel] = useState<string | null>(channels[0]?.id || null)
  const [newMessage, setNewMessage] = useState('')
  const [isCreateChannelOpen, setIsCreateChannelOpen] = useState(false)
  const [newChannelName, setNewChannelName] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [scheduledMessages, setScheduledMessages] = useState<ChatMessage[]>([])
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(() => {
    const initialMessages: Record<string, ChatMessage[]> = {}
    channels.forEach(channel => {
      initialMessages[channel.id] = [
        {
          id: '1',
          content: 'Welcome to the channel! ',
          author: { id: 'system', name: 'System' },
          timestamp: new Date(Date.now() - 3600000),
          reactions: [{ emoji: '', count: 3, users: ['1', '2', '3'] }]
        },
        {
          id: '2',
          content: 'Let\'s discuss the project timeline. What are your thoughts?',
          author: { id: '2', name: 'Jane Smith', avatar: '/avatars/jane.jpg' },
          timestamp: new Date(Date.now() - 1800000),
          mentions: ['1']
        },
        {
          id: '3',
          content: 'I think we should aim for the end of next week. Here\'s the updated schedule.',
          author: { id: '1', name: 'John Doe', avatar: '/avatars/john.jpg' },
          timestamp: new Date(Date.now() - 900000),
          attachments: [{
            id: '1',
            name: 'project-timeline.pdf',
            type: 'application/pdf',
            url: '/files/timeline.pdf',
            size: 2048000
          }]
        }
      ]
    })
    return initialMessages
  })
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, selectedChannel])

  const currentChannel = channels.find(c => c.id === selectedChannel)
  const currentMessages = selectedChannel ? messages[selectedChannel] || [] : []

  const filteredChannels = channels.filter(channel =>
    channel.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const messageCounterRef = useRef(0)

  // ... existing code ...

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedChannel) return

    const message: Omit<ChatMessage, 'id' | 'timestamp'> = {
      content: newMessage,
      author: currentUser,
      mentions: extractMentions(newMessage)
    }

    onSendMessage?.(selectedChannel, message)

    // Add to local state for immediate feedback
    messageCounterRef.current += 1
    const messageId = `msg-${selectedChannel}-${messageCounterRef.current}`
    const newMsg: ChatMessage = {
      ...message,
      id: messageId,
      timestamp: new Date()
    }

    setMessages(prev => ({
      ...prev,
      [selectedChannel]: [...(prev[selectedChannel] || []), newMsg]
    }))

    setNewMessage('')
  }

  const extractMentions = (content: string): string[] => {
    const mentionRegex = /@(\w+)/g
    const matches = content.match(mentionRegex)
    return matches ? matches.map(match => match.slice(1)) : []
  }

  const handleCreateChannel = () => {
    if (!newChannelName.trim()) return

    const newChannel: Omit<ChatChannel, 'id'> = {
      name: newChannelName,
      type: 'channel',
      members: [currentUser],
      emailAddress: `${newChannelName.replace(/\s+/g, '-')}@chat.example.com`
    }

    onCreateChannel?.(newChannel)
    setNewChannelName('')
    setIsCreateChannelOpen(false)
  }

  const handleScheduleMessage = (scheduledFor: Date) => {
    if (!newMessage.trim() || !selectedChannel) return

    const message: Omit<ChatMessage, 'id' | 'timestamp'> = {
      content: newMessage,
      author: currentUser,
      isScheduled: true,
      scheduledFor
    }

    onScheduleMessage?.(selectedChannel, message, scheduledFor)

    setScheduledMessages(prev => [...prev, {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date()
    } as ChatMessage])

    setNewMessage('')
  }

  const formatChannelName = (channel: ChatChannel) => {
    if (channel.type === 'dm') {
      const otherMembers = channel.members.filter(m => m.id !== currentUser.id)
      return otherMembers.map(m => m.name).join(', ')
    }
    return channel.name
  }

  return (
    <div className="h-screen flex bg-background">
      {/* Sidebar - Channels List */}
      <div className="w-64 border-r border-neutral-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-neutral-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-lg font-semibold">Chat</h1>
            {!isGuest && (
              <Dialog open={isCreateChannelOpen} onOpenChange={setIsCreateChannelOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline">
                    <Plus className="w-4 h-4"/>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Channel</DialogTitle>
                    <DialogDescription>
                      Create a new channel for team communication.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Channel Name</label>
                      <Input
                        value={newChannelName}
                        onChange={(e) => setNewChannelName(e.target.value)}
                        placeholder="e.g., project-updates"
                        onKeyDown={(e) => e.key === 'Enter' && handleCreateChannel()}/>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleCreateChannel} disabled={!newChannelName.trim()}>
                      Create Channel
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400"/>
            <Input
              placeholder="Search channels..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"/>
          </div>
        </div>

        {/* Channels List */}
        <ScrollArea className="flex-1">
          <div className="p-2">
            {filteredChannels.map((channel) => (
              <div
                key={channel.id}
                className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer hover:bg-neutral-50 ${
                  selectedChannel === channel.id ? 'bg-neutral-100' : ''
                }`}
                onClick={() => setSelectedChannel(channel.id)}
              >
                {channel.type === 'channel' ? (
                  <Hash className="w-5 h-5 text-neutral-500"/>
                ) : (
                  <Users className="w-5 h-5 text-neutral-500"/>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-medium truncate">
                      {formatChannelName(channel)}
                    </span>
                    {channel.unreadCount && channel.unreadCount > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        {channel.unreadCount}
                      </Badge>
                    )}
                  </div>
                  {channel.lastMessage && (
                    <div className="text-xs text-neutral-500 truncate">
                      {channel.lastMessage.author.name}: {channel.lastMessage.content}
                    </div>
                  )}
                  {channel.emailAddress && (
                    <div className="text-xs text-neutral-400 truncate">
                       {channel.emailAddress}
                    </div>
                  )}
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100">
                      <MoreHorizontal className="w-4 h-4"/>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem disabled={isGuest}>
                      Channel Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem disabled={isGuest}>
                      Invite Members
                    </DropdownMenuItem>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem disabled={isGuest}>
                      Leave Channel
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Scheduled Messages */}
        {scheduledMessages.length > 0 && (
          <div className="p-4 border-t border-neutral-200">
            <h3 className="text-sm font-medium mb-2">Scheduled Messages</h3>
            <div className="space-y-2">
              {scheduledMessages.slice(0, 3).map((msg) => (
                <div key={msg.id} className="text-xs p-2 bg-blue-50 rounded">
                  <div className="font-medium">{msg.content.slice(0, 30)}...</div>
                  <div className="text-neutral-500">
                    {msg.scheduledFor && format(msg.scheduledFor, 'MMM d, HH:mm')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Channel Header */}
        {currentChannel && (
          <div className="p-4 border-b border-neutral-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {currentChannel.type === 'channel' ? (
                  <Hash className="w-5 h-5 text-neutral-500"/>
                ) : (
                  <Users className="w-5 h-5 text-neutral-500"/>
                )}
                <div>
                  <h2 className="text-lg font-semibold">{formatChannelName(currentChannel)}</h2>
                  {currentChannel.description && (
                    <p className="text-sm text-neutral-600">{currentChannel.description}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Badge variant="outline">
                  {currentChannel.members.length} members
                </Badge>
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4"/>
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {currentMessages.map((message) => (
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
                      {format(message.timestamp, 'HH:mm')}
                    </span>
                    {message.isScheduled && (
                      <Badge variant="outline" className="text-xs">
                        <Clock className="w-3 h-3 mr-1"/>
                        Scheduled
                      </Badge>
                    )}
                  </div>

                  <div className="text-sm text-neutral-900 mb-2">
                    {message.content}
                  </div>

                  {/* Attachments */}
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="space-y-2 mb-2">
                      {message.attachments.map((attachment) => (
                        <Card key={attachment.id} className="w-fit">
                          <CardContent className="p-3">
                            <div className="flex items-center space-x-2">
                              <Paperclip className="w-4 h-4 text-neutral-500"/>
                              <div>
                                <div className="text-sm font-medium">{attachment.name}</div>
                                <div className="text-xs text-neutral-500">
                                  {(attachment.size / 1024 / 1024).toFixed(1)} MB
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
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
                        >
                          {reaction.emoji} {reaction.count}
                        </Button>
                      ))}
                    </div>
                  )}

                  {/* Message Actions */}
                  <div className="opacity-0 group-hover:opacity-100 flex items-center space-x-1">
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                      Reply
                    </Button>
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                      
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs"
                      onClick={() => onSaveMessage?.(message.id)}
                    >
                      <Save className="w-3 h-3 mr-1"/>
                      Save
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs"
                      onClick={() => onAssociateTask?.(message.id, '')}
                    >
                      <CheckCircle className="w-3 h-3 mr-1"/>
                      Create Task
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef}/>
          </div>
        </ScrollArea>

        {/* Message Input */}
        {!isGuest && (
          <div className="p-4 border-t border-neutral-200">
            <div className="flex items-end space-x-2">
              <div className="flex-1">
                <div className="relative">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                    placeholder={`Message ${currentChannel ? formatChannelName(currentChannel) : 'channel'}`}
                    className="pr-20"/>
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <Paperclip className="w-3 h-3"/>
                    </Button>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <Smile className="w-3 h-3"/>
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Clock className="w-4 h-4"/>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleScheduleMessage(new Date(Date.now() + 3600000))}>
                      In 1 hour
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleScheduleMessage(new Date(Date.now() + 86400000))}>
                      Tomorrow
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleScheduleMessage(new Date(Date.now() + 604800000))}>
                      Next week
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                  <Send className="w-4 h-4"/>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
