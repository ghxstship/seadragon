
import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
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
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Calendar,
  Clock,
  User,
  Flag,
  Paperclip,
  Link as LinkIcon,
  MessageSquare,
  CheckCircle,
  Circle,
  Plus,
  X,
  Edit,
  Save,
  Trash2
} from 'lucide-react'
import { format } from 'date-fns'
import { TaskCard } from './task-card'

type Task = {
  id: string
  title: string
  description?: string
  priority: 'urgent' | 'high' | 'normal' | 'low'
  assignees: Array<{
    id: string
    name: string
    avatar?: string
  }>
  dueDate?: Date
  startDate?: Date
  createdAt: Date
  updatedAt: Date
  creator: {
    id: string
    name: string
  }
  customFields?: Array<{
    id: string
    label: string
    value: string | number | boolean
    type: 'text' | 'number' | 'date' | 'select' | 'checkbox'
  }>
  tags?: string[]
  subtasks?: Array<{
    id: string
    title: string
    completed: boolean
    assignees?: Array<{ id: string; name: string }>
    dueDate?: Date
  }>
  linkedTasks?: Array<{
    id: string
    title: string
    type: 'blocks' | 'blocked_by' | 'relates_to' | 'duplicates'
  }>
  attachments?: Array<{
    id: string
    name: string
    url: string
    type: string
    size: number
  }>
  comments?: Array<{
    id: string
    content: string
    author: {
      id: string
      name: string
      avatar?: string
    }
    createdAt: Date
    replies?: Array<{
      id: string
      content: string
      author: { id: string; name: string; avatar?: string }
      createdAt: Date
    }>
  }>
}

interface TaskDetailViewProps {
  task: Task
  breadcrumbs: Array<{
    label: string
    href?: string
  }>
  onUpdate?: (updates: Partial<Task>) => void
  onClose?: () => void
  onDelete?: () => void
  isGuest?: boolean
}

const statusConfig = {
  in_progress: { label: 'In Progress', color: 'bg-accent-primary/10 text-accent-tertiary' },
  review: { label: 'Review', color: 'bg-semantic-warning/10 text-orange-700' },
  done: { label: 'Done', color: 'bg-semantic-success/10 text-semantic-success' },
}

const priorityConfig = {
  urgent: { label: 'Urgent', color: 'text-semantic-error' },
  high: { label: 'High', color: 'text-semantic-warning' },
  normal: { label: 'Normal', color: 'text-neutral-600' },
  low: { label: 'Low', color: 'text-neutral-500' },
}

export function TaskDetailView({
  task,
  breadcrumbs,
  onUpdate,
  onClose,
  onDelete,
  isGuest = false
}: TaskDetailViewProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [isEditingDescription, setIsEditingDescription] = useState(false)
  const [editedTitle, setEditedTitle] = useState(task.title)
  const [editedDescription, setEditedDescription] = useState(task.description || '')
  const [sidebarWidth, setSidebarWidth] = useState(320)
  const [isResizing, setIsResizing] = useState(false)
  const sidebarRef = useRef<HTMLDivElement>(null)

  const handleTitleSave = () => {
    if (editedTitle.trim() && editedTitle !== task.title) {
      onUpdate?.({ title: editedTitle.trim() })
    }
    setIsEditingTitle(false)
  }

  const handleDescriptionSave = () => {
    if (editedDescription !== task.description) {
      onUpdate?.({ description: editedDescription })
    }
    setIsEditingDescription(false)
  }

  const handleStatusChange = (newStatus: typeof task.status) => {
    onUpdate?.({ status: newStatus })
  }

  const handlePriorityChange = (newPriority: typeof task.priority) => {
    onUpdate?.({ priority: newPriority })
  }

  const handleMouseDown = () => {
    setIsResizing(true)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isResizing) return
    const newWidth = window.innerWidth - e.clientX
    if (newWidth >= 280 && newWidth <= 480) {
      setSidebarWidth(newWidth)
    }
  }

  const handleMouseUp = () => {
    setIsResizing(false)
  }

  return (
    <div
      className="flex h-screen bg-neutral-50"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-background border-b border-neutral-200 px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={onClose}>
                <ChevronLeft className="w-4 h-4 mr-1"/>
                Back
              </Button>

              <Breadcrumb>
                <BreadcrumbList>
                  {breadcrumbs.map((crumb, index) => (
                    <div key={index} className="flex items-center">
                      {index > 0 && <BreadcrumbSeparator/>}
                      <BreadcrumbItem>
                        {crumb.href ? (
                          <BreadcrumbLink href={crumb.href}>
                            {crumb.label}
                          </BreadcrumbLink>
                        ) : (
                          <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                        )}
                      </BreadcrumbItem>
                    </div>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            <div className="flex items-center space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4"/>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem disabled={isGuest}>
                    <Edit className="w-4 h-4 mr-2"/>
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuItem disabled={isGuest}>
                    <LinkIcon className="w-4 h-4 mr-2"/>
                    Share
                  </DropdownMenuItem>
                  <DropdownMenuSeparator/>
                  <DropdownMenuItem
                    className="text-semantic-error"
                    disabled={isGuest}
                    onClick={onDelete}
                  >
                    <Trash2 className="w-4 h-4 mr-2"/>
                    Delete Task
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Title */}
          <div className="flex items-center space-x-3 mb-4">
            <Button
              variant="ghost"
              size="sm"
              className={`p-1 h-6 w-6 rounded-full ${statusConfig[task.status].color}`}
              onClick={() => {
                const currentIndex = statuses.indexOf(task.status)
                const nextStatus = statuses[(currentIndex + 1) % statuses.length]
                handleStatusChange(nextStatus)
              }}
              disabled={isGuest}
            >
              {task.status === 'done' ? (
                <CheckCircle className="w-3 h-3"/>
              ) : (
                <Circle className="w-3 h-3"/>
              )}
            </Button>

            {isEditingTitle ? (
              <div className="flex items-center space-x-2 flex-1">
                <Input
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleTitleSave()
                    if (e.key === 'Escape') {
                      setEditedTitle(task.title)
                      setIsEditingTitle(false)
                    }
                  }}
                  className="text-xl font-semibold border-none p-0 h-auto focus:ring-0"
                  autoFocus/>
                <Button size="sm" onClick={handleTitleSave}>
                  <Save className="w-4 h-4"/>
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setEditedTitle(task.title)
                    setIsEditingTitle(false)
                  }}
                >
                  <X className="w-4 h-4"/>
                </Button>
              </div>
            ) : (
              <h1
                className="text-xl font-semibold cursor-pointer hover:bg-neutral-100 px-2 py-1 rounded"
                onClick={() => !isGuest && setIsEditingTitle(true)}
              >
                {task.title}
              </h1>
            )}
          </div>

          {/* Metadata Row */}
          <div className="flex items-center space-x-6 text-sm text-neutral-600">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4"/>
              <span>Created by {task.creator.name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4"/>
              <span>Created {format(task.createdAt, 'MMM d, yyyy')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4"/>
              <span>Updated {format(task.updatedAt, 'MMM d, yyyy')}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <Tabs defaultValue="details" className="h-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="subtasks">Subtasks ({task.subtasks?.length || 0})</TabsTrigger>
              <TabsTrigger value="attachments">Attachments ({task.attachments?.length || 0})</TabsTrigger>
              <TabsTrigger value="comments">Comments ({task.comments?.length || 0})</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="p-6 space-y-6 h-full overflow-y-auto">
              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Description</CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditingDescription ? (
                    <div className="space-y-2">
                      <Textarea
                        value={editedDescription}
                        onChange={(e) => setEditedDescription(e.target.value)}
                        rows={4}
                        placeholder="Add a description..."/>
                      <div className="flex space-x-2">
                        <Button size="sm" onClick={handleDescriptionSave}>
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setEditedDescription(task.description || '')
                            setIsEditingDescription(false)
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="min-h-[100px] cursor-pointer hover:bg-neutral-50 p-4 rounded border-2 border-dashed border-neutral-200"
                      onClick={() => !isGuest && setIsEditingDescription(true)}
                    >
                      {task.description ? (
                        <div className="whitespace-pre-wrap">{task.description}</div>
                      ) : (
                        <div className="text-neutral-500">Click to add description...</div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Custom Fields */}
              {task.customFields && task.customFields.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Custom Fields</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      {task.customFields.map((field) => (
                        <div key={field.id} className="space-y-1">
                          <label className="text-sm font-medium text-neutral-700">
                            {field.label}
                          </label>
                          <div className="text-sm text-neutral-900">
                            {field.type === 'checkbox'
                              ? (field.value ? 'Yes' : 'No')
                              : field.type === 'date' && field.value
                              ? format(new Date(field.value as string), 'MMM d, yyyy')
                              : String(field.value)
                            }
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Linked Tasks */}
              {task.linkedTasks && task.linkedTasks.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Linked Tasks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {task.linkedTasks.map((linkedTask) => (
                        <div key={linkedTask.id} className="flex items-center space-x-2 p-2 bg-neutral-50 rounded">
                          <Badge variant="outline" className="text-xs">
                            {linkedTask.type.replace('_', ' ')}
                          </Badge>
                          <span className="text-sm">{linkedTask.title}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="subtasks" className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Subtasks</h3>
                  <Button size="sm" disabled={isGuest}>
                    <Plus className="w-4 h-4 mr-1"/>
                    Add Subtask
                  </Button>
                </div>
                <div className="space-y-2">
                  {task.subtasks?.map((subtask) => (
                    <div key={subtask.id} className="flex items-center space-x-3 p-3 bg-background rounded border">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-1 h-6 w-6"
                        disabled={isGuest}
                      >
                        {subtask.completed ? (
                          <CheckCircle className="w-4 h-4 text-semantic-success"/>
                        ) : (
                          <Circle className="w-4 h-4 text-neutral-400"/>
                        )}
                      </Button>
                      <span className={`flex-1 ${subtask.completed ? 'line-through text-neutral-500' : ''}`}>
                        {subtask.title}
                      </span>
                      {subtask.dueDate && (
                        <span className="text-sm text-neutral-500">
                          Due {format(subtask.dueDate, 'MMM d')}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="attachments" className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Attachments</h3>
                  <Button size="sm" disabled={isGuest}>
                    <Plus className="w-4 h-4 mr-1"/>
                    Add Attachment
                  </Button>
                </div>
                <div className="space-y-2">
                  {task.attachments?.map((attachment) => (
                    <div key={attachment.id} className="flex items-center space-x-3 p-3 bg-background rounded border">
                      <Paperclip className="w-4 h-4 text-neutral-400"/>
                      <span className="flex-1">{attachment.name}</span>
                      <span className="text-sm text-neutral-500">
                        {(attachment.size / 1024 / 1024).toFixed(1)} MB
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="comments" className="p-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Comments</h3>
                <div className="space-y-4">
                  {task.comments?.map((comment) => (
                    <div key={comment.id} className="space-y-2">
                      <div className="flex items-start space-x-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={comment.author.avatar}/>
                          <AvatarFallback>
                            {comment.author.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-sm">{comment.author.name}</span>
                            <span className="text-xs text-neutral-500">
                              {format(comment.createdAt, 'MMM d, yyyy h:mm a')}
                            </span>
                          </div>
                          <p className="text-sm">{comment.content}</p>
                        </div>
                      </div>
                      {comment.replies && comment.replies.length > 0 && (
                        <div className="ml-11 space-y-2">
                          {comment.replies.map((reply) => (
                            <div key={reply.id} className="flex items-start space-x-3">
                              <Avatar className="w-6 h-6">
                                <AvatarImage src={reply.author.avatar}/>
                                <AvatarFallback className="text-xs">
                                  {reply.author.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <span className="font-medium text-xs">{reply.author.name}</span>
                                  <span className="text-xs text-neutral-500">
                                    {format(reply.createdAt, 'MMM d, h:mm a')}
                                  </span>
                                </div>
                                <p className="text-xs">{reply.content}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {!isGuest && (
                  <div className="mt-6">
                    <Textarea placeholder="Add a comment..." rows={3}/>
                    <div className="flex justify-end mt-2">
                      <Button size="sm">Comment</Button>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Resizable Sidebar */}
      <div
        ref={sidebarRef}
        className="bg-background border-l border-neutral-200 flex flex-col"
        style={{ width: sidebarWidth }}
      >
        {/* Resize Handle */}
        <div
          className="w-1 bg-neutral-200 cursor-col-resize hover:bg-accent-primary transition-colors"
          onMouseDown={handleMouseDown}/>

        <div className="p-4 space-y-6">
          {/* Fields & Metadata */}
          <div>
            <h3 className="font-medium text-sm text-neutral-900 mb-4">Fields & Metadata</h3>

            <div className="space-y-4">
              {/* Status */}
              <div>
                <label className="text-xs font-medium text-neutral-700 uppercase tracking-wide">
                  Status
                </label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-start mt-1">
                      <div className={`w-2 h-2 rounded-full mr-2 ${statusConfig[task.status].color.replace('text-', 'bg-').replace('700', '500')}`}/>
                      {statusConfig[task.status].label}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {Object.entries(statusConfig).map(([key, config]) => (
                      <DropdownMenuItem
                        key={key}
                        onClick={() => handleStatusChange(key as typeof task.status)}
                        disabled={isGuest}
                      >
                        <div className={`w-2 h-2 rounded-full mr-2 ${config.color.replace('text-', 'bg-').replace('700', '500')}`}/>
                        {config.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Priority */}
              <div>
                <label className="text-xs font-medium text-neutral-700 uppercase tracking-wide">
                  Priority
                </label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-start mt-1">
                      <Flag className={`w-4 h-4 mr-2 ${priorityConfig[task.priority].color}`}/>
                      {priorityConfig[task.priority].label}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {Object.entries(priorityConfig).map(([key, config]) => (
                      <DropdownMenuItem
                        key={key}
                        onClick={() => handlePriorityChange(key as typeof task.priority)}
                        disabled={isGuest}
                      >
                        <Flag className={`w-4 h-4 mr-2 ${config.color}`}/>
                        {config.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Assignees */}
              <div>
                <label className="text-xs font-medium text-neutral-700 uppercase tracking-wide">
                  Assignees
                </label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {task.assignees.map((assignee) => (
                    <div key={assignee.id} className="flex items-center space-x-2 bg-neutral-100 rounded-full px-2 py-1">
                      <Avatar className="w-5 h-5">
                        <AvatarImage src={assignee.avatar}/>
                        <AvatarFallback className="text-xs">
                          {assignee.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs">{assignee.name}</span>
                      {!isGuest && (
                        <Button variant="ghost" size="sm" className="p-0 h-4 w-4">
                          <X className="w-3 h-3"/>
                        </Button>
                      )}
                    </div>
                  ))}
                  {!isGuest && (
                    <Button variant="outline" size="sm" className="rounded-full">
                      <Plus className="w-3 h-3"/>
                    </Button>
                  )}
                </div>
              </div>

              {/* Due Date */}
              <div>
                <label className="text-xs font-medium text-neutral-700 uppercase tracking-wide">
                  Due Date
                </label>
                <div className="mt-1 p-2 border rounded text-sm">
                  {task.dueDate ? format(task.dueDate, 'MMM d, yyyy') : 'No due date'}
                </div>
              </div>

              {/* Tags */}
              {task.tags && task.tags.length > 0 && (
                <div>
                  <label className="text-xs font-medium text-neutral-700 uppercase tracking-wide">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {task.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator/>

          {/* Activity Feed */}
          <div>
            <h3 className="font-medium text-sm text-neutral-900 mb-4">Activity</h3>
            <div className="space-y-3 text-xs text-neutral-600">
              <div>Task created by {task.creator.name}</div>
              <div>Status changed to {statusConfig[task.status].label.toLowerCase()}</div>
              <div>Last updated {format(task.updatedAt, 'MMM d, h:mm a')}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
