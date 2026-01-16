
'use client'

import { logger } from '@/lib/logger'
import { Header } from '@/lib/design-system'
import { ChatInterface, type Conversation, type Message } from '@/components/chat/ChatInterface'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Users, MessageCircle, Settings } from 'lucide-react'

interface ConversationApiResponse {
  id: string
  name?: string
  type: 'direct' | 'group'
  participants: string[]
  updatedAt: string
  lastMessage?: {
    id: string
    content: string
    senderId: string
    timestamp: string
  }
}

export default function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentUserId, setCurrentUserId] = useState<string>('')
  const [showNewChatDialog, setShowNewChatDialog] = useState(false)
  const [newChatType, setNewChatType] = useState<'direct' | 'group'>('direct')
  const [newChatRecipient, setNewChatRecipient] = useState('')
  const [newChatName, setNewChatName] = useState('')

  // Load conversations on mount
  useEffect(() => {
    const loadConversations = async () => {
      try {
        const response = await fetch('/api/chat/conversations')
        if (response.ok) {
          const data = await response.json()
          const mapped: Conversation[] = (data.conversations || []).map((c: ConversationApiResponse) => ({
            ...c,
            updatedAt: new Date(c.updatedAt),
            lastMessage: c.lastMessage
              ? {
                  ...c.lastMessage,
                  timestamp: new Date(c.lastMessage.timestamp)
                }
              : undefined
          }))
          setConversations(mapped)
          if (data.currentUserId) setCurrentUserId(String(data.currentUserId))
        }
      } catch (error) {
        logger.error('Error loading conversations', error)
        setConversations([])
      }
    }

    loadConversations()
  }, [])

  const handleSendMessage = async (conversationId: string, content: string, type?: Message['type']) => {
    try {
      const response = await fetch(`/api/chat/messages/${conversationId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      })

      if (response.ok) {
        const newMessage = await response.json()
        logger.action('message_sent', { messageId: newMessage.id })

        // Update conversation's last message and timestamp
        setConversations(prev => prev.map(conv =>
          conv.id === conversationId
            ? {
                ...conv,
                lastMessage: {
                  id: newMessage.id,
                  senderId: newMessage.senderId,
                  senderName: newMessage.senderName,
                  content: newMessage.content,
                  timestamp: new Date(newMessage.timestamp),
                  type: 'text',
                  read: true
                },
                updatedAt: new Date()
              }
            : conv
        ))
      }
    } catch (error) {
      logger.error('Error sending message', error)
    }
  }

  const handleMarkAsRead = async (conversationId: string) => {
    // Update local state
    setConversations(prev => prev.map(conv =>
      conv.id === conversationId
        ? { ...conv, unreadCount: 0 }
        : conv
    ))

    // In real app, call API to mark as read
    // await fetch(`/api/chat/conversations/${conversationId}/read`, { method: 'POST' })
  }

  const handleCreateNewChat = async () => {
    if (!newChatRecipient.trim()) return

    try {
      const response = await fetch('/api/chat/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newChatName || 'New Conversation',
          context: {
            type: newChatType,
            recipients: newChatRecipient
          }
        })
      })

      if (response.ok) {
        const newConversation = await response.json()
        setConversations(prev => [newConversation, ...prev])
        setShowNewChatDialog(false)
        setNewChatRecipient('')
        setNewChatName('')
      }
    } catch (error) {
      logger.error('Error creating conversation', error)
    }
  }

  const totalUnreadCount = conversations.reduce((total, conv) => total + conv.unreadCount, 0)

  return (
    <div className="min-h-screen bg-background">
      <Header/>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold">Messages</h1>
            <p className="text-muted-foreground">
              {totalUnreadCount > 0
                ? `You have ${totalUnreadCount} unread message${totalUnreadCount === 1 ? '' : 's'}`
                : 'Stay connected with your favorite experiences and fellow adventurers'
              }
            </p>
          </div>

          <Dialog open={showNewChatDialog} onOpenChange={setShowNewChatDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2"/>
                New Message
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Start New Conversation</DialogTitle>
                <DialogDescription>
                  Connect with experiences, professionals, or create group chats
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <Label>Conversation Type</Label>
                  <Select value={newChatType} onValueChange={(value: 'direct' | 'group') => setNewChatType(value)}>
                    <SelectTrigger>
                      <SelectValue/>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="direct">Direct Message</SelectItem>
                      <SelectItem value="group">Group Chat</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {newChatType === 'group' && (
                  <div>
                    <Label htmlFor="chatName">Group Name</Label>
                    <Input
                      id="chatName"
                      value={newChatName}
                      onChange={(e) => setNewChatName(e.target.value)}
                      placeholder="Enter group name"/>
                  </div>
                )}

                <div>
                  <Label htmlFor="recipients">
                    {newChatType === 'direct' ? 'Recipient' : 'Participants'}
                  </Label>
                  <Input
                    id="recipients"
                    value={newChatRecipient}
                    onChange={(e) => setNewChatRecipient(e.target.value)}
                    placeholder={
                      newChatType === 'direct'
                        ? 'Enter username or business name'
                        : 'Enter usernames separated by commas'
                    }/>
                  <p className="text-xs text-muted-foreground mt-1">
                    {newChatType === 'direct'
                      ? 'Start a conversation with any user or business'
                      : 'Add multiple participants to create a group chat'
                    }
                  </p>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setShowNewChatDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateNewChat} disabled={!newChatRecipient.trim()}>
                  Start Chat
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Chat Interface */}
        <ChatInterface
          conversations={conversations}
          currentUserId={currentUserId}
          onSendMessage={handleSendMessage}
          onMarkAsRead={handleMarkAsRead}
          className="h-[700px]"/>

        {/* Quick Actions */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <div className="text-center p-6 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
            <MessageCircle className="h-12 w-12 text-accent-primary mx-auto mb-4"/>
            <h3 className="font-semibold mb-2">Support Chat</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Get help with bookings, accounts, or any questions
            </p>
            <Button variant="outline" size="sm">
              Contact Support
            </Button>
          </div>

          <div className="text-center p-6 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
            <Users className="h-12 w-12 text-accent-primary mx-auto mb-4"/>
            <h3 className="font-semibold mb-2">Community Groups</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Join discussions with fellow adventurers and locals
            </p>
            <Button variant="outline" size="sm">
              Browse Groups
            </Button>
          </div>

          <div className="text-center p-6 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
            <Settings className="h-12 w-12 text-accent-primary mx-auto mb-4"/>
            <h3 className="font-semibold mb-2">Chat Settings</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Manage notifications, privacy, and chat preferences
            </p>
            <Button variant="outline" size="sm">
              Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
