
import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Brain,
  Search,
  Mic,
  MicOff,
  Play,
  Pause,
  Square,
  MessageSquare,
  Calendar,
  Clock,
  Lightbulb,
  Zap,
  Send,
  Plus,
  X,
  ChevronLeft,
  ChevronRight,
  Settings,
  Sparkles
} from 'lucide-react'
import { format } from 'date-fns'

interface MeetingDetails {
  title: string
  participants: string[]
  startTime: Date
  endTime: Date
  description?: string
  location?: string
}

interface Task {
  id: string
  title: string
  description?: string
  status: 'todo' | 'in_progress' | 'done'
  priority: 'low' | 'medium' | 'high'
  dueDate?: Date
  assignedTo?: string
}

interface Project {
  id: string
  name: string
  description?: string
  status: 'planning' | 'active' | 'completed' | 'on_hold'
  dueDate?: Date
  teamMembers: string[]
}

interface ActivityItem {
  id: string
  type: 'task_created' | 'task_completed' | 'meeting_scheduled' | 'comment_added'
  description: string
  timestamp: Date
  userId: string
  relatedEntityId?: string
}

interface AISidebarProps {
  isOpen: boolean
  onClose: () => void
  onSearch?: (query: string) => void
  onGenerateTasks?: (content: string) => void
  onScheduleMeeting?: (details: MeetingDetails) => void
  onTimeBlock?: (blocks: TimeBlock[]) => void
  context?: {
    currentTask?: Task
    currentProject?: Project
    recentActivity?: ActivityItem[]
  }
  isGuest?: boolean
}

interface AIMessage {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
  suggestions?: string[]
}

interface TimeBlock {
  id: string
  title: string
  startTime: Date
  endTime: Date
  type: 'meeting' | 'focus' | 'break'
}

export function AISidebar({
  isOpen,
  onClose,
  onSearch,
  onGenerateTasks,
  onScheduleMeeting,
  onTimeBlock,
  context,
  isGuest = false
}: AISidebarProps) {
  const [activeTab, setActiveTab] = useState<'chat' | 'search' | 'schedule' | 'tasks'>('chat')
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hello! I\'m your AI assistant. I can help you search, summarize content, generate tasks, and manage your schedule. What would you like to do?',
      timestamp: new Date(),
      suggestions: [
        'Summarize my recent tasks',
        'Find available time slots',
        'Generate tasks from meeting notes',
        'Schedule a follow-up meeting'
      ]
    }
  ])
  const [currentMessage, setCurrentMessage] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [transcription, setTranscription] = useState('')
  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>(() => [
    {
      id: '1',
      title: 'Team Standup',
      startTime: new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
      endTime: new Date(Date.now() + 90 * 60 * 1000), // 1.5 hours from now
      type: 'meeting'
    }
  ])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (!currentMessage.trim()) return

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: currentMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setCurrentMessage('')

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: AIMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `I understand you want: "${currentMessage}". Let me help you with that.`,
        timestamp: new Date(),
        suggestions: [
          'Show me related tasks',
          'Add to my calendar',
          'Create a reminder',
          'Find similar items'
        ]
      }
      setMessages(prev => [...prev, aiResponse])
    }, 1000)
  }

  const handleVoiceRecord = () => {
    if (isRecording) {
      setIsRecording(false)
      // Simulate transcription
      setTranscription('Meeting notes: Discussed project timeline, assigned tasks to team members, set deadline for next milestone.')
    } else {
      setIsRecording(true)
      setTranscription('')
    }
  }

  const handleGenerateTasks = () => {
    if (transcription) {
      onGenerateTasks?.(transcription)
      setTranscription('')
      // Add success message
      const successMessage: AIMessage = {
        id: Date.now().toString(),
        type: 'ai',
        content: 'I\'ve generated tasks from your notes! Check your task list for the new items.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, successMessage])
    }
  }

  const handleSmartSchedule = () => {
    const suggestions = [
      { time: '2:00 PM - 3:00 PM', reason: 'Best focus time' },
      { time: '4:30 PM - 5:30 PM', reason: 'Team availability' }
    ]

    const scheduleMessage: AIMessage = {
      id: Date.now().toString(),
      type: 'ai',
      content: `Based on your calendar and preferences, here are optimal time slots:\n\n${suggestions.map(s => `• ${s.time} (${s.reason})`).join('\n')}`,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, scheduleMessage])
  }

  const renderChatTab = () => (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-accent-primary text-primary-foreground'
                    : 'bg-neutral-100 text-neutral-900'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs opacity-70">
                    {format(message.timestamp, 'HH:mm')}
                  </span>
                  {message.suggestions && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {message.suggestions.slice(0, 2).map((suggestion, index) => (
                        <Button
                          key={index}
                          className="text-xs bg-background bg-opacity-20 rounded px-2 py-1 hover:bg-opacity-30"
                          onClick={() => setCurrentMessage(suggestion)}
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef}/>
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-neutral-200">
        <div className="flex items-end space-x-2">
          <div className="flex-1">
            <Textarea
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage()
                }
              }}
              placeholder="Ask me anything..."
              rows={2}
              className="resize-none"/>
          </div>
          <div className="flex flex-col space-y-2">
            <Button
              size="sm"
              variant={isRecording ? "destructive" : "outline"}
              onClick={handleVoiceRecord}
              disabled={isGuest}
            >
              {isRecording ? <MicOff className="w-4 h-4"/> : <Mic className="w-4 h-4"/>}
            </Button>
            <Button size="sm" onClick={handleSendMessage} disabled={!currentMessage.trim()}>
              <Send className="w-4 h-4"/>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderSearchTab = () => (
    <div className="p-4 space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Natural Language Search</h3>
        <p className="text-sm text-neutral-600">
          Ask me to find anything in your workspace using natural language.
        </p>
      </div>

      <div className="space-y-3">
        <Input
          placeholder="e.g., 'Find tasks assigned to me due this week'"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onSearch?.(e.currentTarget.value)
            }
          }}/>

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Quick Searches</h4>
          <div className="grid grid-cols-1 gap-2">
            {[
              'Overdue tasks',
              'My tasks this week',
              'High priority items',
              'Recent activity',
              'Team meetings'
            ].map((query) => (
              <Button
                key={query}
                variant="outline"
                size="sm"
                className="justify-start text-left"
                onClick={() => onSearch?.(query)}
              >
                <Search className="w-4 h-4 mr-2"/>
                {query}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  const renderScheduleTab = () => (
    <div className="p-4 space-y-6">
      {/* Time Blocking */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Smart Time Blocking</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handleSmartSchedule} className="w-full">
            <Sparkles className="w-4 h-4 mr-2"/>
            Find Optimal Time Slots
          </Button>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Today&apos;s Schedule</h4>
            <div className="space-y-2">
              {timeBlocks.map((block) => (
                <div key={block.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded">
                  <div>
                    <div className="font-medium text-sm">{block.title}</div>
                    <div className="text-xs text-neutral-600">
                      {format(block.startTime, 'HH:mm')} - {format(block.endTime, 'HH:mm')}
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {block.type}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Meeting Scheduler */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Schedule Meeting</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={() => onScheduleMeeting?.({})} className="w-full">
            <Calendar className="w-4 h-4 mr-2"/>
            Schedule New Meeting
          </Button>
        </CardContent>
      </Card>
    </div>
  )

  const renderTasksTab = () => (
    <div className="p-4 space-y-4">
      {/* Transcription */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Meeting Notes & Transcription</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Button
              variant={isRecording ? "destructive" : "outline"}
              onClick={handleVoiceRecord}
              disabled={isGuest}
            >
              {isRecording ? (
                <>
                  <Square className="w-4 h-4 mr-2"/>
                  Stop Recording
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4 mr-2"/>
                  Start Recording
                </>
              )}
            </Button>
            {transcription && (
              <Badge variant="secondary">{transcription.length} chars</Badge>
            )}
          </div>

          {transcription && (
            <div className="space-y-2">
              <Textarea
                value={transcription}
                onChange={(e) => setTranscription(e.target.value)}
                rows={4}
                placeholder="Transcription will appear here..."/>
              <Button onClick={handleGenerateTasks} className="w-full">
                <Zap className="w-4 h-4 mr-2"/>
                Generate Tasks from Notes
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contextual Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">AI Suggestions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {context?.currentTask && (
              <div className="p-3 bg-blue-50 rounded">
                <div className="flex items-center space-x-2 mb-1">
                  <Lightbulb className="w-4 h-4 text-accent-secondary"/>
                  <span className="text-sm font-medium">Task Suggestion</span>
                </div>
                <p className="text-sm text-neutral-700">
                  Break down &quot;{context.currentTask.title}&quot; into smaller subtasks?
                </p>
              </div>
            )}

            <div className="p-3 bg-green-50 rounded">
              <div className="flex items-center space-x-2 mb-1">
                <Clock className="w-4 h-4 text-semantic-success"/>
                <span className="text-sm font-medium">Time Suggestion</span>
              </div>
              <p className="text-sm text-neutral-700">
                Schedule a 25-minute focus session for deep work.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  if (!isOpen) return null

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-background border-l border-neutral-200 shadow-xl z-40 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-neutral-200">
        <div className="flex items-center space-x-2">
          <Brain className="w-5 h-5 text-accent-primary"/>
          <h2 className="text-lg font-semibold">AI Assistant</h2>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4"/>
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'chat' | 'search' | 'schedule' | 'tasks')} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-4 m-4">
          <TabsTrigger value="chat" className="text-xs">
            <MessageSquare className="w-4 h-4 mr-1"/>
            Chat
          </TabsTrigger>
          <TabsTrigger value="search" className="text-xs">
            <Search className="w-4 h-4 mr-1"/>
            Search
          </TabsTrigger>
          <TabsTrigger value="schedule" className="text-xs">
            <Calendar className="w-4 h-4 mr-1"/>
            Schedule
          </TabsTrigger>
          <TabsTrigger value="tasks" className="text-xs">
            <Lightbulb className="w-4 h-4 mr-1"/>
            Tasks
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="flex-1 m-0">
          {renderChatTab()}
        </TabsContent>

        <TabsContent value="search" className="flex-1 m-0">
          {renderSearchTab()}
        </TabsContent>

        <TabsContent value="schedule" className="flex-1 m-0 overflow-y-auto">
          {renderScheduleTab()}
        </TabsContent>

        <TabsContent value="tasks" className="flex-1 m-0 overflow-y-auto">
          {renderTasksTab()}
        </TabsContent>
      </Tabs>
    </div>
  )
}
