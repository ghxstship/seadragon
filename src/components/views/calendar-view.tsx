
import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  Clock
} from 'lucide-react'
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns'

interface CalendarViewProps {
  tasks: Array<{
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
  }>
  onTaskClick?: (taskId: string) => void
  onCreateTask?: (date?: Date) => void
  isGuest?: boolean
}

const statusColors = {
  in_progress: 'bg-accent-primary/10 border-blue-200 text-accent-tertiary',
  review: 'bg-semantic-warning/10 border-orange-200 text-orange-700',
  done: 'bg-semantic-success/10 border-green-200 text-semantic-success',
}

export function CalendarView({
  tasks,
  onTaskClick,
  onCreateTask,
  isGuest = false
}: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<'month' | 'week'>('month')

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calendarStart = startOfWeek(monthStart)
  const calendarEnd = endOfWeek(monthEnd)

  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  })

  const tasksByDate = useMemo(() => {
    const grouped: Record<string, typeof tasks> = {}
    tasks.forEach(task => {
      if (task.dueDate) {
        const dateKey = format(task.dueDate, 'yyyy-MM-dd')
        if (!grouped[dateKey]) {
          grouped[dateKey] = []
        }
        grouped[dateKey].push(task)
      }
    })
    return grouped
  }, [tasks])

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev =>
      direction === 'next' ? addMonths(prev, 1) : subMonths(prev, 1)
    )
  }

  const getTasksForDate = (date: Date) => {
    const dateKey = format(date, 'yyyy-MM-dd')
    return tasksByDate[dateKey] || []
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-background border-b border-neutral-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('prev')}
            >
              <ChevronLeft className="w-4 h-4"/>
            </Button>

            <h2 className="text-lg font-semibold">
              {format(currentDate, 'MMMM yyyy')}
            </h2>

            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('next')}
            >
              <ChevronRight className="w-4 h-4"/>
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Select value={view} onValueChange={(value: 'month' | 'week') => setView(value)}>
              <SelectTrigger className="w-32">
                <SelectValue/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Month</SelectItem>
                <SelectItem value="week">Week</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onCreateTask?.()}
              disabled={isGuest}
            >
              <Plus className="w-4 h-4 mr-1"/>
              New Task
            </Button>
          </div>
        </div>

        {/* Calendar Grid Header */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="p-2 text-center text-sm font-medium text-neutral-600">
              {day}
            </div>
          ))}
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => {
            const dayTasks = getTasksForDate(day)
            const isCurrentMonth = isSameMonth(day, currentDate)
            const isToday = isSameDay(day, new Date())

            return (
              <Card
                key={index}
                className={`min-h-32 ${
                  isCurrentMonth ? 'bg-background' : 'bg-neutral-50'
                } ${isToday ? 'ring-2 ring-accent-primary' : ''} cursor-pointer hover:shadow-md transition-shadow`}
                onClick={() => !isGuest && onCreateTask?.(day)}
              >
                <CardContent className="p-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm font-medium ${
                      isCurrentMonth ? 'text-neutral-900' : 'text-neutral-400'
                    }`}>
                      {format(day, 'd')}
                    </span>
                    {dayTasks.length > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {dayTasks.length}
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-1">
                    {dayTasks.slice(0, 3).map((task) => (
                      <div
                        key={task.id}
                        className={`p-1 rounded text-xs cursor-pointer hover:opacity-80 ${statusColors[task.status]}`}
                        onClick={(e) => {
                          e.stopPropagation()
                          onTaskClick?.(task.id)
                        }}
                      >
                        <div className="font-medium truncate">{task.title}</div>
                        {task.assignees.length > 0 && (
                          <div className="flex items-center space-x-1 mt-1">
                            <div className="flex -space-x-1">
                              {task.assignees.slice(0, 2).map((assignee) => (
                                <div
                                  key={assignee.id}
                                  className="w-4 h-4 rounded-full bg-neutral-300 border border-white flex items-center justify-center text-xs"
                                >
                                  {assignee.name.split(' ').map(n => n[0]).join('')}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}

                    {dayTasks.length > 3 && (
                      <div className="text-xs text-neutral-500">
                        +{dayTasks.length - 3} more
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
