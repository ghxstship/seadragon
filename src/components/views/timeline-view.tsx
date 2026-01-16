
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, addWeeks, subWeeks } from 'date-fns'

interface TaskUpdate {
  title?: string
  description?: string
  priority?: 'urgent' | 'high' | 'normal' | 'low'
  assignees?: Array<{
    id: string
    name: string
    avatar?: string
  }>
  dueDate?: Date
  startDate?: Date
  createdAt?: Date
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

interface Assignee {
  id: string
  name: string
  avatar?: string
}

interface TimelineViewProps {
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
    createdAt?: Date
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
  onTaskUpdate?: (taskId: string, updates: TaskUpdate) => void
  onCreateTask?: (date?: Date) => void
  isGuest?: boolean
}

const statusColors = {
  in_progress: 'bg-accent-primary/10 border-blue-200',
  review: 'bg-semantic-warning/10 border-orange-200',
  done: 'bg-semantic-success/10 border-green-200',
}

const priorityColors = {
  urgent: 'text-semantic-error',
  high: 'text-semantic-warning',
  normal: 'text-neutral-600',
  low: 'text-neutral-500',
}

export function TimelineView({
  tasks,
  onTaskClick,
  onTaskUpdate,
  onCreateTask,
  isGuest = false
}: TimelineViewProps) {
  const [currentWeek, setCurrentWeek] = useState(new Date())
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week')
  const [selectedAssignee, setSelectedAssignee] = useState<string>('all')

  const weekStart = startOfWeek(currentWeek)
  const weekEnd = endOfWeek(currentWeek)
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd })

  const allAssignees = useMemo(() => {
    const assignees = new Map()
    tasks.forEach(task => {
      task.assignees.forEach(assignee => {
        assignees.set(assignee.id, assignee)
      })
    })
    return Array.from(assignees.values())
  }, [tasks])

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // Filter by assignee
      if (selectedAssignee !== 'all') {
        return task.assignees.some(assignee => assignee.id === selectedAssignee)
      }
      return true
    })
  }, [tasks, selectedAssignee])

  const tasksByDate = useMemo(() => {
    const grouped: Record<string, typeof filteredTasks> = {}
    filteredTasks.forEach(task => {
      if (task.dueDate && task.startDate) {
        // For timeline, we show tasks that span across dates
        const start = task.startDate
        const end = task.dueDate
        const days = eachDayOfInterval({ start, end })

        days.forEach(day => {
          const dateKey = format(day, 'yyyy-MM-dd')
          if (!grouped[dateKey]) {
            grouped[dateKey] = []
          }
          // Only add if not already in this date
          if (!grouped[dateKey].find(t => t.id === task.id)) {
            grouped[dateKey].push(task)
          }
        })
      } else if (task.dueDate) {
        // Single date task
        const dateKey = format(task.dueDate, 'yyyy-MM-dd')
        if (!grouped[dateKey]) {
          grouped[dateKey] = []
        }
        grouped[dateKey].push(task)
      }
    })
    return grouped
  }, [filteredTasks])

  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentWeek(prev =>
      direction === 'next' ? addWeeks(prev, 1) : subWeeks(prev, 1)
    )
  }

  const getTaskPosition = (task: typeof tasks[0], date: Date) => {
    if (!task.startDate || !task.dueDate) return null

    const taskStart = task.startDate.getTime()
    const taskEnd = task.dueDate.getTime()
    const dayStart = new Date(date).setHours(0, 0, 0, 0)
    const dayEnd = new Date(date).setHours(23, 59, 59, 999)

    // Check if task spans this day
    if (taskStart <= dayEnd && taskEnd >= dayStart) {
      const visibleStart = Math.max(taskStart, dayStart)
      const visibleEnd = Math.min(taskEnd, dayEnd)
      const duration = dayEnd - dayStart
      const startPercent = ((visibleStart - dayStart) / duration) * 100
      const widthPercent = ((visibleEnd - visibleStart) / duration) * 100

      return { startPercent, widthPercent }
    }

    return null
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
              onClick={() => navigateWeek('prev')}
            >
              <ChevronLeft className="w-4 h-4"/>
            </Button>

            <h2 className="text-lg font-semibold">
              {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
            </h2>

            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateWeek('next')}
            >
              <ChevronRight className="w-4 h-4"/>
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Select value={viewMode} onValueChange={(value: 'week' | 'month') => setViewMode(value)}>
              <SelectTrigger className="w-24">
                <SelectValue/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="month">Month</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedAssignee} onValueChange={setSelectedAssignee}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by assignee"/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Assignees</SelectItem>
                {allAssignees.map((assignee: Assignee) => (
                  <SelectItem key={assignee.id} value={assignee.id}>
                    {assignee.name}
                  </SelectItem>
                ))}
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
      </div>

      {/* Timeline Grid */}
      <div className="flex-1 overflow-x-auto">
        <div className="min-w-max">
          {/* Header Row */}
          <div className="flex border-b border-neutral-200 bg-neutral-50">
            <div className="w-48 p-4 border-r border-neutral-200">
              <h3 className="font-medium">Tasks</h3>
            </div>
            <div className="flex flex-1">
              {weekDays.map((day, index) => (
                <div
                  key={index}
                  className="flex-1 min-w-32 p-4 border-r border-neutral-200 text-center"
                >
                  <div className="text-sm font-medium text-neutral-900">
                    {format(day, 'EEE')}
                  </div>
                  <div className={`text-lg font-semibold ${
                    isSameDay(day, new Date()) ? 'text-accent-primary' : 'text-neutral-600'
                  }`}>
                    {format(day, 'd')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Task Rows */}
          <div className="relative">
            {filteredTasks.map((task, taskIndex) => (
              <div key={task.id} className="flex border-b border-neutral-100 hover:bg-neutral-50">
                {/* Task Info */}
                <div className="w-48 p-4 border-r border-neutral-200">
                  <div className="space-y-2">
                    <h4
                      className="font-medium cursor-pointer hover:text-accent-primary truncate"
                      onClick={() => onTaskClick?.(task.id)}
                      title={task.title}
                    >
                      {task.title}
                    </h4>
                    <div className="flex items-center space-x-2">
                      <Badge className={`text-xs ${statusColors[task.status]}`}>
                        {task.status.replace('_', ' ')}
                      </Badge>
                      <span className={`text-xs ${priorityColors[task.priority]}`}>
                        {task.priority}
                      </span>
                    </div>
                    {task.assignees.length > 0 && (
                      <div className="flex -space-x-1">
                        {task.assignees.slice(0, 3).map((assignee) => (
                          <div
                            key={assignee.id}
                            className="w-5 h-5 rounded-full bg-neutral-200 border border-white flex items-center justify-center text-xs"
                            title={assignee.name}
                          >
                            {assignee.name.split(' ').map(n => n[0]).join('')}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Timeline */}
                <div className="flex flex-1 relative">
                  {weekDays.map((day, dayIndex) => {
                    const position = getTaskPosition(task, day)
                    const dayTasks = tasksByDate[format(day, 'yyyy-MM-dd')] || []
                    const taskForDay = dayTasks.find(t => t.id === task.id)

                    return (
                      <div
                        key={dayIndex}
                        className="flex-1 min-w-32 p-2 border-r border-neutral-200 relative"
                        onClick={() => !isGuest && onCreateTask?.(day)}
                      >
                        {position && taskForDay && (
                          <div
                            className={`absolute top-${taskIndex * 8 + 2} left-0 h-6 rounded cursor-pointer hover:opacity-80 ${statusColors[task.status]} border`}
                            style={{
                              left: `${position.startPercent}%`,
                              width: `${Math.max(position.widthPercent, 10)}%`,
                              zIndex: 10
                            }}
                            onClick={(e) => {
                              e.stopPropagation()
                              onTaskClick?.(task.id)
                            }}
                            title={`${task.title} (${format(task.startDate!, 'MMM d')} - ${format(task.dueDate!, 'MMM d')})`}
                          >
                            <div className="px-2 py-1 text-xs font-medium truncate">
                              {task.title}
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}

            {filteredTasks.length === 0 && (
              <div className="flex items-center justify-center py-12 text-neutral-500">
                <div className="text-center">
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-neutral-300"/>
                  <p>No tasks in this time period</p>
                  {!isGuest && (
                    <Button className="mt-4" onClick={() => onCreateTask?.()}>
                      <Plus className="w-4 h-4 mr-1"/>
                      Add Task
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
