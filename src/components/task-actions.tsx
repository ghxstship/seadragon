"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Plus,
  Edit,
  Copy,
  Share,
  User,
  Flag,
  Calendar as CalendarIcon,
  Clock,
  Link,
  Timer,
  CheckSquare,
  Tag,
  Paperclip,
  MessageSquare,
  Mail,
  MoreHorizontal,
  Repeat
} from 'lucide-react'
import { format } from 'date-fns'

type Task = {
  id: string
  title: string
  priority: 'urgent' | 'high' | 'normal' | 'low'
  assignees: Array<{
    id: string
    name: string
    avatar?: string
  }>
  dueDate?: Date
  startDate?: Date
  tags?: string[]
  dependencies?: Array<{
    id: string
    title: string
    type: 'blocks' | 'blocked_by'
  }>
  timeEstimate?: number
  timeSpent?: number
}

interface RecurringConfig {
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly'
  interval: number // e.g., every 2 weeks
  daysOfWeek?: number[] // 0-6, Sunday = 0
  daysOfMonth?: number[] // 1-31
  endDate?: Date
  endAfterOccurrences?: number
  exceptions?: Date[] // dates to skip
}

interface TaskActionsProps {
  task: Task
  availableUsers: Array<{
    id: string
    name: string
    avatar?: string
  }>
  availableTags: string[]
  onCreate?: () => void
  onEdit?: (updates: Partial<Task>) => void
  onDuplicate?: () => void
  onShare?: () => void
  onAssign?: (userIds: string[]) => void
  onSetPriority?: (priority: string) => void
  onSetDates?: (startDate?: Date, dueDate?: Date) => void
  onSetRecurring?: (config: RecurringConfig) => void
  onAddDependency?: (taskId: string, type: 'blocks' | 'blocked_by') => void
  onTimeTracking?: (action: 'start' | 'stop' | 'log', minutes?: number) => void
  onAddSubtask?: (title: string) => void
  onAddTag?: (tag: string) => void
  onAddAttachment?: (file: File) => void
  onAddComment?: (content: string, mentions?: string[]) => void
  onScheduleEmail?: (content: string, scheduledFor: Date, to: string[]) => void
  isGuest?: boolean
}

export function TaskActions({
  task,
  availableUsers,
  availableTags,
  onCreate,
  onEdit,
  onDuplicate,
  onShare,
  onAssign,
  onSetPriority,
  onSetDates,
  onSetRecurring,
  onAddDependency,
  onTimeTracking,
  onAddSubtask,
  onAddTag,
  onAddAttachment,
  onAddComment,
  onScheduleEmail,
  isGuest = false
}: TaskActionsProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false)
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [editTitle, setEditTitle] = useState(task.title)
  const [editDescription, setEditDescription] = useState('')
  const [commentContent, setCommentContent] = useState('')
  const [emailContent, setEmailContent] = useState('')
  const [emailScheduledFor, setEmailScheduledFor] = useState<Date>()
  const [emailRecipients, setEmailRecipients] = useState<string[]>([])
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>(task.assignees.map(a => a.id))
  const [startDate, setStartDate] = useState<Date | undefined>(task.startDate)
  const [dueDate, setDueDate] = useState<Date | undefined>(task.dueDate)
  const [priority, setPriority] = useState(task.priority)
  const [isTimeTracking, setIsTimeTracking] = useState(false)

  const handleCreate = () => {
    if (newTaskTitle.trim()) {
      onCreate?.()
      setNewTaskTitle('')
      setIsCreateDialogOpen(false)
    }
  }

  const handleEdit = () => {
    if (editTitle.trim() && editTitle !== task.title) {
      onEdit?.({ title: editTitle.trim() })
      setIsEditDialogOpen(false)
    }
  }

  const handleAssign = (userIds: string[]) => {
    setSelectedAssignees(userIds)
    onAssign?.(userIds)
  }

  const handleSetPriority = (newPriority: string) => {
    setPriority(newPriority as typeof task.priority)
    onSetPriority?.(newPriority)
  }

  const handleSetDates = () => {
    onSetDates?.(startDate, dueDate)
  }

  const handleAddComment = () => {
    if (commentContent.trim()) {
      // Extract mentions from content (simple regex for @username)
      const mentions = commentContent.match(/@(\w+)/g)?.map(m => m.slice(1)) || []
      onAddComment?.(commentContent.trim(), mentions)
      setCommentContent('')
      setIsCommentDialogOpen(false)
    }
  }

  const handleScheduleEmail = () => {
    if (emailContent.trim() && emailScheduledFor && emailRecipients.length > 0) {
      onScheduleEmail?.(emailContent.trim(), emailScheduledFor, emailRecipients)
      setEmailContent('')
      setEmailScheduledFor(undefined)
      setEmailRecipients([])
      setIsEmailDialogOpen(false)
    }
  }

  const toggleTimeTracking = () => {
    const action = isTimeTracking ? 'stop' : 'start'
    onTimeTracking?.(action)
    setIsTimeTracking(!isTimeTracking)
  }

  return (
    <div className="flex items-center space-x-2">
      {/* Create */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" disabled={isGuest}>
            <Plus className="w-4 h-4 mr-1"/>
            Create
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
            <DialogDescription>
              Create a new task in this project.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="task-title">Task Title</Label>
              <Input
                id="task-title"
                value={newTaskTitle}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTaskTitle(e.target.value)}
                placeholder="Enter task title..."
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleCreate()}/>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleCreate} disabled={!newTaskTitle.trim()}>
              Create Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Quick Actions */}
      <div className="flex items-center space-x-1">
        {/* Assign */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" disabled={isGuest}>
              <User className="w-4 h-4"/>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Assign to</DropdownMenuLabel>
            <DropdownMenuSeparator/>
            {availableUsers.map((user) => (
              <DropdownMenuCheckboxItem
                key={user.id}
                checked={selectedAssignees.includes(user.id)}
                onCheckedChange={(checked) => {
                  const newAssignees = checked
                    ? [...selectedAssignees, user.id]
                    : selectedAssignees.filter(id => id !== user.id)
                  handleAssign(newAssignees)
                }}
              >
                <div className="flex items-center space-x-2">
                  <Avatar className="w-5 h-5">
                    <AvatarImage src={user.avatar}/>
                    <AvatarFallback className="text-xs">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <span>{user.name}</span>
                </div>
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Priority */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" disabled={isGuest}>
              <Flag className="w-4 h-4"/>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Set Priority</DropdownMenuLabel>
            <DropdownMenuSeparator/>
            <DropdownMenuItem onClick={() => handleSetPriority('urgent')}>
              <Flag className="w-4 h-4 mr-2 text-semantic-error"/>
              Urgent
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSetPriority('high')}>
              <Flag className="w-4 h-4 mr-2 text-semantic-warning"/>
              High
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSetPriority('normal')}>
              <Flag className="w-4 h-4 mr-2 text-neutral-500"/>
              Normal
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSetPriority('low')}>
              <Flag className="w-4 h-4 mr-2 text-neutral-400"/>
              Low
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Dates */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" disabled={isGuest}>
              <CalendarIcon className="w-4 h-4"/>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <div>
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={startDate ? format(startDate, 'yyyy-MM-dd') : ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStartDate(e.target.value ? new Date(e.target.value) : undefined)}/>
              </div>
              <div>
                <Label>Due Date</Label>
                <Input
                  type="date"
                  value={dueDate ? format(dueDate, 'yyyy-MM-dd') : ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDueDate(e.target.value ? new Date(e.target.value) : undefined)}/>
              </div>
              <Button onClick={handleSetDates} className="w-full">
                Set Dates
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {/* Time Tracking */}
        <Button
          variant={isTimeTracking ? "default" : "ghost"}
          size="sm"
          onClick={toggleTimeTracking}
          disabled={isGuest}
        >
          <Timer className="w-4 h-4"/>
        </Button>
      </div>

      {/* More Actions */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="w-4 h-4"/>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {/* Edit */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()} disabled={isGuest}>
              <Edit className="w-4 h-4 mr-2"/>
              Edit Task
            </DropdownMenuItem>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Task</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Task Title</Label>
                  <Input
                    value={editTitle}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditTitle(e.target.value)}
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleEdit()}/>
                </div>
                <div>
                  <Label>Task Description</Label>
                  <Textarea
                    value={editDescription}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEditDescription(e.target.value)}/>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleEdit} disabled={!editTitle.trim() || editTitle === task.title}>
                  Save Changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <DropdownMenuItem onClick={onDuplicate} disabled={isGuest}>
            <Copy className="w-4 h-4 mr-2"/>
            Duplicate
          </DropdownMenuItem>

          <DropdownMenuItem onClick={onShare} disabled={isGuest}>
            <Share className="w-4 h-4 mr-2"/>
            Share
          </DropdownMenuItem>

          <DropdownMenuSeparator/>

          {/* Recurring */}
          <DropdownMenuItem disabled={isGuest}>
            <Repeat className="w-4 h-4 mr-2"/>
            Make Recurring
          </DropdownMenuItem>

          {/* Dependencies */}
          <DropdownMenuItem disabled={isGuest}>
            <Link className="w-4 h-4 mr-2"/>
            Add Dependency
          </DropdownMenuItem>

          {/* Subtasks */}
          <DropdownMenuItem disabled={isGuest}>
            <CheckSquare className="w-4 h-4 mr-2"/>
            Add Subtask
          </DropdownMenuItem>

          {/* Tags */}
          <DropdownMenuItem disabled={isGuest}>
            <Tag className="w-4 h-4 mr-2"/>
            Add Tag
          </DropdownMenuItem>

          {/* Attachments */}
          <DropdownMenuItem disabled={isGuest}>
            <Paperclip className="w-4 h-4 mr-2"/>
            Add Attachment
          </DropdownMenuItem>

          <DropdownMenuSeparator/>

          {/* Comments */}
          <Dialog open={isCommentDialogOpen} onOpenChange={setIsCommentDialogOpen}>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <MessageSquare className="w-4 h-4 mr-2"/>
              Add Comment
            </DropdownMenuItem>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Comment</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Textarea
                  value={commentContent}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCommentContent(e.target.value)}
                  placeholder="Write a comment... Use @ to mention someone"
                  rows={4}/>
              </div>
              <DialogFooter>
                <Button onClick={handleAddComment} disabled={!commentContent.trim()}>
                  Add Comment
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Email */}
          <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()} disabled={isGuest}>
              <Mail className="w-4 h-4 mr-2"/>
              Schedule Email
            </DropdownMenuItem>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Schedule Email</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Recipients</Label>
                  <Select
                    value=""
                    onValueChange={(value) => setEmailRecipients(prev => [...prev, value])}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select recipients"/>
                    </SelectTrigger>
                    <SelectContent>
                      {availableUsers.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {emailRecipients.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {emailRecipients.map((userId) => {
                        const user = availableUsers.find(u => u.id === userId)
                        return (
                          <Badge key={userId} variant="secondary">
                            {user?.name}
                            <Button
                              onClick={() => setEmailRecipients(prev => prev.filter(id => id !== userId))}
                              className="ml-1"
                            >
                              ×
                            </Button>
                          </Badge>
                        )
                      })}
                    </div>
                  )}
                </div>
                <div>
                  <Label>Schedule For</Label>
                  <Input
                    type="datetime-local"
                    value={emailScheduledFor ? format(emailScheduledFor, "yyyy-MM-dd'T'HH:mm") : ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmailScheduledFor(e.target.value ? new Date(e.target.value) : undefined)}/>
                </div>
                <div>
                  <Label>Message</Label>
                  <Textarea
                    value={emailContent}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEmailContent(e.target.value)}
                    placeholder="Write your email..."
                    rows={4}/>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleScheduleEmail} disabled={!emailContent.trim() || !emailScheduledFor || emailRecipients.length === 0}>
                  Schedule Email
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
