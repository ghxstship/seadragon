
import { format, isToday, isYesterday, isThisWeek, isThisMonth } from 'date-fns'

interface ActivityDetails {
  oldValue?: string | number | boolean | Date | null
  newValue?: string | number | boolean | Date | null
  comment?: string
  attachmentName?: string
}

interface User {
  id: string
  name: string
  avatar?: string
}

interface ActivityViewProps {
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
    updatedAt?: Date
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
    }>
  }>
  activities?: Array<{
    id: string
    type: 'created' | 'updated' | 'status_changed' | 'assigned' | 'commented' | 'attachment_added' | 'due_date_changed'
    taskId: string
    taskTitle: string
    user: {
      id: string
      name: string
      avatar?: string
    }
    timestamp: Date
    details?: ActivityDetails
  }>
  onTaskClick?: (taskId: string) => void
  onActivityClick?: (activityId: string) => void
  isGuest?: boolean
}

const activityIcons = {
  created: CheckCircle,
  updated: Edit,
  status_changed: Activity,
  assigned: User,
  commented: MessageSquare,
  attachment_added: Paperclip,
  due_date_changed: Calendar,
}

const activityColors = {
  created: 'text-semantic-success',
  updated: 'text-accent-secondary',
  status_changed: 'text-accent-primary',
  assigned: 'text-semantic-warning',
  commented: 'text-neutral-600',
  attachment_added: 'text-semantic-info',
  due_date_changed: 'text-semantic-error',
}

export function ActivityView({
  tasks,
  activities = [],
  onTaskClick,
  onActivityClick,
  isGuest = false
}: ActivityViewProps) {
  const [filterType, setFilterType] = useState<string>('all')
  const [filterUser, setFilterUser] = useState<string>('all')
  const [timeRange, setTimeRange] = useState<string>('all')

  const filteredActivities = useMemo(() => {
    return activities.filter(activity => {
      if (filterType !== 'all' && activity.type !== filterType) return false
      if (filterUser !== 'all' && activity.user.id !== filterUser) return false

      if (timeRange !== 'all') {
        const now = new Date()
        switch (timeRange) {
          case 'today':
            if (!isToday(activity.timestamp)) return false
            break
          case 'yesterday':
            if (!isYesterday(activity.timestamp)) return false
            break
          case 'week':
            if (!isThisWeek(activity.timestamp)) return false
            break
          case 'month':
            if (!isThisMonth(activity.timestamp)) return false
            break
        }
      }

      return true
    })
  }, [activities, filterType, filterUser, timeRange])

  const groupedActivities = useMemo(() => {
    const groups: Record<string, typeof filteredActivities> = {}

    filteredActivities.forEach(activity => {
      const dateKey = format(activity.timestamp, 'yyyy-MM-dd')
      if (!groups[dateKey]) {
        groups[dateKey] = []
      }
      groups[dateKey].push(activity)
    })

    // Sort dates descending
    return Object.entries(groups)
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([date, activities]) => ({
        date,
        activities: activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      }))
  }, [filteredActivities])

  const allUsers = useMemo(() => {
    const users = new Map()
    activities.forEach(activity => {
      users.set(activity.user.id, activity.user)
    })
    return Array.from(users.values())
  }, [activities])

  const getActivityDescription = (activity: typeof activities[0]) => {
    switch (activity.type) {
      case 'created':
        return `created task "${activity.taskTitle}"`
      case 'updated':
        return `updated task "${activity.taskTitle}"`
      case 'status_changed':
        return `changed status of "${activity.taskTitle}" from ${activity.details?.oldValue || 'unknown'} to ${activity.details?.newValue || 'unknown'}`
      case 'assigned':
        return `assigned "${activity.taskTitle}" to ${activity.details?.newValue || 'someone'}`
      case 'commented':
        return `commented on "${activity.taskTitle}": "${activity.details?.comment?.slice(0, 50)}${activity.details?.comment && activity.details.comment.length > 50 ? '...' : ''}"`
      case 'attachment_added':
        return `added attachment "${activity.details?.attachmentName || 'file'}" to "${activity.taskTitle}"`
      case 'due_date_changed':
        return `changed due date of "${activity.taskTitle}" to ${activity.details?.newValue ? format(new Date(activity.details.newValue), 'MMM d, yyyy') : 'none'}`
      default:
        return `performed action on "${activity.taskTitle}"`
    }
  }

  const formatRelativeTime = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMins < 1) return 'just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return format(date, 'MMM d')
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-background border-b border-neutral-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Activity Feed</h2>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-4">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by type"/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Activities</SelectItem>
              <SelectItem value="created">Task Created</SelectItem>
              <SelectItem value="updated">Task Updated</SelectItem>
              <SelectItem value="status_changed">Status Changed</SelectItem>
              <SelectItem value="assigned">Assigned</SelectItem>
              <SelectItem value="commented">Commented</SelectItem>
              <SelectItem value="attachment_added">Attachment Added</SelectItem>
              <SelectItem value="due_date_changed">Due Date Changed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterUser} onValueChange={setFilterUser}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by user"/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              {allUsers.map((user: User) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Time range"/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="yesterday">Yesterday</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stats */}
        <div className="mt-4 text-sm text-neutral-600">
          Showing {filteredActivities.length} of {activities.length} activities
        </div>
      </div>

      {/* Activity Feed */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {groupedActivities.length === 0 ? (
            <div className="text-center py-12">
              <Activity className="w-12 h-12 mx-auto mb-4 text-neutral-300"/>
              <p className="text-neutral-500">No activities found</p>
              <p className="text-sm text-neutral-400 mt-2">
                Try adjusting your filters or check back later for updates
              </p>
            </div>
          ) : (
            groupedActivities.map(({ date, activities: dayActivities }) => (
              <div key={date}>
                {/* Date Header */}
                <div className="flex items-center space-x-4 mb-4">
                  <h3 className="text-sm font-medium text-neutral-700">
                    {isToday(new Date(date)) ? 'Today' :
                     isYesterday(new Date(date)) ? 'Yesterday' :
                     format(new Date(date), 'EEEE, MMMM d, yyyy')}
                  </h3>
                  <div className="flex-1 h-px bg-neutral-200"></div>
                </div>

                {/* Activities */}
                <div className="space-y-4">
                  {dayActivities.map((activity) => {
                    const Icon = activityIcons[activity.type]
                    const color = activityColors[activity.type]

                    return (
                      <Card
                        key={activity.id}
                        className="hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => {
                          onActivityClick?.(activity.id)
                          onTaskClick?.(activity.taskId)
                        }}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-3">
                            <Avatar className="w-8 h-8 mt-1">
                              <AvatarImage src={activity.user.avatar}/>
                              <AvatarFallback>
                                {activity.user.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="font-medium text-sm">{activity.user.name}</span>
                                <Icon className={`w-4 h-4 ${color}`}/>
                                <span className="text-xs text-neutral-500">
                                  {formatRelativeTime(activity.timestamp)}
                                </span>
                              </div>

                              <p className="text-sm text-neutral-700 mb-2">
                                {getActivityDescription(activity)}
                              </p>

                              {/* Activity Details */}
                              {activity.details && (
                                <div className="text-xs text-neutral-500 bg-neutral-50 rounded p-2">
                                  {activity.type === 'status_changed' && (
                                    <span>Status changed from <strong>{activity.details.oldValue}</strong> to <strong>{activity.details.newValue}</strong></span>
                                  )}
                                  {activity.type === 'due_date_changed' && (
                                    <span>Due date changed to <strong>{activity.details.newValue ? format(new Date(activity.details.newValue), 'PPP') : 'No due date'}</strong></span>
                                  )}
                                  {activity.type === 'attachment_added' && (
                                    <span>Added file: <strong>{activity.details.attachmentName}</strong></span>
                                  )}
                                </div>
                              )}

                              {/* Task Badge */}
                              <Badge
                                variant="outline"
                                className="text-xs cursor-pointer hover:bg-neutral-100"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onTaskClick?.(activity.taskId)
                                }}
                              >
                                {activity.taskTitle}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
