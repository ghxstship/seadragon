
import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Calendar,
  Clock,
  User,
  Flag,
  CheckCircle,
  Circle,
  AlertTriangle,
  Minus
} from 'lucide-react'
import { format } from 'date-fns'

interface TaskCardProps {
  task: {
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
    }>
  }
  onClick?: (taskId: string) => void
  onStatusChange?: (taskId: string, status: string) => void
  isCompact?: boolean
  showCustomFields?: boolean
}

const statusConfig = {
  in_progress: { icon: Clock, color: 'text-semantic-info', bg: 'bg-accent-primary/10' },
  review: { icon: AlertTriangle, color: 'text-semantic-warning', bg: 'bg-semantic-warning/10' },
  done: { icon: CheckCircle, color: 'text-semantic-success', bg: 'bg-semantic-success/10' },
}

const priorityConfig = {
  urgent: { icon: Flag, color: 'text-semantic-error', label: 'Urgent' },
  high: { icon: Flag, color: 'text-semantic-warning', label: 'High' },
  normal: { icon: Minus, color: 'text-muted-foreground', label: 'Normal' },
  low: { icon: Minus, color: 'text-muted-foreground/80', label: 'Low' },
}

export function TaskCard({
  task,
  onClick,
  onStatusChange,
  isCompact = false,
  showCustomFields = true
}: TaskCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const StatusIcon = statusConfig[task.status].icon
  const PriorityIcon = priorityConfig[task.priority].icon

  const handleStatusClick = (e: React.MouseEvent) => {
    e.stopPropagation()
                      task.status === 'in_progress' ? 'review' :
    onStatusChange?.(task.id, nextStatus)
  }

  const completedSubtasks = task.subtasks?.filter(st => st.completed).length || 0
  const totalSubtasks = task.subtasks?.length || 0

  return (
    <Card
      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
        isCompact ? 'p-3' : 'p-4'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onClick?.(task.id)}
    >
      <CardContent className="p-0">
        <div className="flex items-start space-x-3">
          {/* Status Indicator */}
          <Button
            variant="ghost"
            size="sm"
            className={`p-1 h-6 w-6 rounded-full ${statusConfig[task.status].bg} hover:opacity-80`}
            onClick={handleStatusClick}
          >
            <StatusIcon className={`w-3 h-3 ${statusConfig[task.status].color}`}/>
          </Button>

          <div className="flex-1 min-w-0">
            {/* Title */}
            <h3 className={`font-medium text-foreground mb-2 ${
              isCompact ? 'text-sm' : 'text-base'
            }`}>
              {task.title}
            </h3>

            {/* Description (if not compact) */}
            {!isCompact && task.description && (
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {task.description}
              </p>
            )}

            {/* Priority and Status Badges */}
            <div className="flex items-center space-x-2 mb-3">
              <Badge variant="outline" className={`flex items-center space-x-1 ${
                priorityConfig[task.priority].color
              }`}>
                <PriorityIcon className="w-3 h-3"/>
                <span className="text-xs">{priorityConfig[task.priority].label}</span>
              </Badge>

              <Badge variant="secondary" className="text-xs">
                {task.status.replace('_', ' ').toUpperCase()}
              </Badge>

              {/* Tags */}
              {task.tags?.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Dates */}
            {(task.dueDate || task.startDate) && (
              <div className="flex items-center space-x-4 mb-3 text-xs text-muted-foreground">
                {task.startDate && (
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3"/>
                    <span>Start: {format(task.startDate, 'MMM d')}</span>
                  </div>
                )}
                {task.dueDate && (
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3"/>
                    <span>Due: {format(task.dueDate, 'MMM d')}</span>
                  </div>
                )}
              </div>
            )}

            {/* Custom Fields */}
            {showCustomFields && task.customFields && task.customFields.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mb-3">
                {task.customFields.slice(0, 4).map((field) => (
                  <div key={field.id} className="text-xs">
                    <span className="font-medium text-foreground">{field.label}:</span>{' '}
                    <span className="text-muted-foreground">
                      {field.type === 'checkbox'
                        ? (field.value ? 'Yes' : 'No')
                        : field.type === 'date' && field.value
                        ? format(new Date(field.value as string), 'MMM d')
                        : String(field.value)
                      }
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Subtasks Progress */}
            {totalSubtasks > 0 && (
              <div className="mb-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                  <span>Subtasks</span>
                  <span>{completedSubtasks}/{totalSubtasks}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-1.5">
                  <div
                    className="bg-accent-primary h-1.5 rounded-full transition-all"
                    style={{ width: `${(completedSubtasks / totalSubtasks) * 100}%` }}/>
                </div>
              </div>
            )}

            {/* Assignees */}
            <div className="flex items-center justify-between">
              <div className="flex -space-x-1">
                {task.assignees.slice(0, 3).map((assignee) => (
                  <Avatar key={assignee.id} className="w-6 h-6 border-2 border-white">
                    <AvatarImage src={assignee.avatar}/>
                    <AvatarFallback className="text-xs">
                      {assignee.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {task.assignees.length > 3 && (
                  <div className="w-6 h-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                    <span className="text-xs text-muted-foreground">+{task.assignees.length - 3}</span>
                  </div>
                )}
              </div>

              {/* Hover Actions */}
              {isHovered && (
                <div className="flex items-center space-x-1 opacity-0 animate-in fade-in duration-200">
                  <Button variant="ghost" size="sm" className="p-1 h-6 w-6">
                    <User className="w-3 h-3"/>
                  </Button>
                  <Button variant="ghost" size="sm" className="p-1 h-6 w-6">
                    <Calendar className="w-3 h-3"/>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
