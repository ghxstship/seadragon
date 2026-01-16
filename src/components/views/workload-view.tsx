
import { format } from 'date-fns'

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
  estimatedHours?: number
  actualHours?: number
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

interface WorkloadViewProps {
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
    estimatedHours?: number
    actualHours?: number
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
  onCreateTask?: () => void
  isGuest?: boolean
}

const priorityWeights = {
  urgent: 4,
  high: 3,
  normal: 2,
  low: 1,
}

const statusColors = {
  in_progress: 'text-accent-primary',
  review: 'text-semantic-warning',
  done: 'text-semantic-success',
}

export function WorkloadView({
  tasks,
  onTaskClick,
  onTaskUpdate,
  onCreateTask,
  isGuest = false
}: WorkloadViewProps) {
  const [viewMode, setViewMode] = useState<'assignees' | 'projects'>('assignees')
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>('week')

  const assigneeWorkload = useMemo(() => {
    const workload: Record<string, {
      assignee: { id: string; name: string; avatar?: string }
      tasks: typeof tasks
      totalEstimated: number
      totalActual: number
      completedTasks: number
      overdueTasks: number
      priorityScore: number
    }> = {}

    tasks.forEach(task => {
      task.assignees.forEach(assignee => {
        if (!workload[assignee.id]) {
          workload[assignee.id] = {
            assignee,
            tasks: [],
            totalEstimated: 0,
            totalActual: 0,
            completedTasks: 0,
            overdueTasks: 0,
            priorityScore: 0,
          }
        }

        workload[assignee.id].tasks.push(task)
        workload[assignee.id].totalEstimated += task.estimatedHours || 0
        workload[assignee.id].totalActual += task.actualHours || 0

        if (task.status === 'done') {
          workload[assignee.id].completedTasks += 1
        }

        if (task.dueDate && task.dueDate < new Date() && task.status !== 'done') {
          workload[assignee.id].overdueTasks += 1
        }

        workload[assignee.id].priorityScore += priorityWeights[task.priority]
      })
    })

    return Object.values(workload).sort((a, b) => b.priorityScore - a.priorityScore)
  }, [tasks])

  const getWorkloadLevel = (estimatedHours: number, actualHours: number, taskCount: number) => {
    const avgHoursPerTask = estimatedHours / Math.max(taskCount, 1)
    const utilization = actualHours / Math.max(estimatedHours, 1)

    if (utilization > 1.2) return { level: 'overloaded', color: 'bg-semantic-error', text: 'Overloaded' }
    if (utilization > 0.9) return { level: 'high', color: 'bg-semantic-warning', text: 'High' }
    if (utilization > 0.7) return { level: 'moderate', color: 'bg-semantic-warning', text: 'Moderate' }
    return { level: 'low', color: 'bg-semantic-success', text: 'Low' }
  }

  const getCapacityIndicator = (estimatedHours: number) => {
    // Assuming 40 hours/week as standard capacity
    const capacityHours = timeRange === 'week' ? 40 : timeRange === 'month' ? 160 : 480
    const utilizationPercent = (estimatedHours / capacityHours) * 100

    return {
      percent: Math.min(utilizationPercent, 150), // Cap at 150% for display
      status: utilizationPercent > 120 ? 'over' : utilizationPercent > 80 ? 'high' : 'normal'
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-background border-b border-neutral-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Workload</h2>
          <div className="flex items-center space-x-2">
            <Select value={viewMode} onValueChange={(value: 'assignees' | 'projects') => setViewMode(value)}>
              <SelectTrigger className="w-32">
                <SelectValue/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="assignees">By Person</SelectItem>
                <SelectItem value="projects">By Project</SelectItem>
              </SelectContent>
            </Select>

            <Select value={timeRange} onValueChange={(value: 'week' | 'month' | 'quarter') => setTimeRange(value)}>
              <SelectTrigger className="w-32">
                <SelectValue/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="sm"
              onClick={onCreateTask}
              disabled={isGuest}
            >
              <Plus className="w-4 h-4 mr-1"/>
              New Task
            </Button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-neutral-500"/>
                <div>
                  <div className="text-2xl font-bold">{assigneeWorkload.length}</div>
                  <div className="text-sm text-neutral-600">Team Members</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-neutral-500"/>
                <div>
                  <div className="text-2xl font-bold">
                    {assigneeWorkload.reduce((sum, person) => sum + person.totalEstimated, 0)}
                  </div>
                  <div className="text-sm text-neutral-600">Est. Hours</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-neutral-500"/>
                <div>
                  <div className="text-2xl font-bold">
                    {assigneeWorkload.reduce((sum, person) => sum + person.completedTasks, 0)}
                  </div>
                  <div className="text-sm text-neutral-600">Completed</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-semantic-error"/>
                <div>
                  <div className="text-2xl font-bold text-semantic-error">
                    {assigneeWorkload.reduce((sum, person) => sum + person.overdueTasks, 0)}
                  </div>
                  <div className="text-sm text-neutral-600">Overdue</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Workload Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assigneeWorkload.map((person) => {
            const capacity = getCapacityIndicator(person.totalEstimated)
            const workloadLevel = getWorkloadLevel(
              person.totalEstimated,
              person.totalActual,
              person.tasks.length
            )

            return (
              <Card key={person.assignee.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center">
                      {person.assignee.avatar ? (
                        <Image
                          src={person.assignee.avatar}
                          alt={person.assignee.name}
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-full"/>
                      ) : (
                        <User className="w-5 h-5 text-neutral-600"/>
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{person.assignee.name}</CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className={`w-3 h-3 rounded-full ${workloadLevel.color}`}/>
                        <span className="text-sm text-neutral-600">{workloadLevel.text} workload</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Capacity Indicator */}
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span>Capacity ({timeRange})</span>
                      <span className={capacity.status === 'over' ? 'text-semantic-error' : capacity.status === 'high' ? 'text-semantic-warning' : 'text-neutral-600'}>
                        {Math.round(capacity.percent)}%
                      </span>
                    </div>
                    <Progress
                      value={Math.min(capacity.percent, 100)}
                      className="h-2"/>
                  </div>

                  {/* Task Summary */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-neutral-600">Active Tasks</div>
                      <div className="text-lg font-semibold">{person.tasks.filter(t => t.status !== 'done').length}</div>
                    </div>
                    <div>
                      <div className="text-neutral-600">Completed</div>
                      <div className="text-lg font-semibold">{person.completedTasks}</div>
                    </div>
                    <div>
                      <div className="text-neutral-600">Est. Hours</div>
                      <div className="text-lg font-semibold">{person.totalEstimated}</div>
                    </div>
                    <div>
                      <div className="text-neutral-600">Overdue</div>
                      <div className={`text-lg font-semibold ${person.overdueTasks > 0 ? 'text-semantic-error' : ''}`}>
                        {person.overdueTasks}
                      </div>
                    </div>
                  </div>

                  {/* Recent Tasks */}
                  <div>
                    <h4 className="text-sm font-medium text-neutral-700 mb-2">Recent Tasks</h4>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {person.tasks.slice(0, 5).map((task) => (
                        <div
                          key={task.id}
                          className="flex items-center space-x-2 p-2 rounded hover:bg-neutral-50 cursor-pointer"
                          onClick={() => onTaskClick?.(task.id)}
                        >
                          <div className={`w-2 h-2 rounded-full ${
                            task.status === 'done' ? 'bg-semantic-success' :
                            task.status === 'in_progress' ? 'bg-accent-primary' :
                            task.status === 'review' ? 'bg-semantic-warning' : 'bg-neutral-400'
                          }`}/>
                          <span className="text-sm flex-1 truncate">{task.title}</span>
                          <Badge variant="outline" className="text-xs">
                            {task.priority}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Priority Distribution */}
                  <div>
                    <h4 className="text-sm font-medium text-neutral-700 mb-2">Priority Breakdown</h4>
                    <div className="flex space-x-2">
                      {(['urgent', 'high', 'normal', 'low'] as const).map((priority) => {
                        const count = person.tasks.filter(t => t.priority === priority).length
                        return count > 0 ? (
                          <div key={priority} className="text-center">
                            <div className={`text-xs font-medium ${
                              priority === 'urgent' ? 'text-semantic-error' :
                              priority === 'high' ? 'text-semantic-warning' :
                              priority === 'normal' ? 'text-neutral-600' : 'text-neutral-500'
                            }`}>
                              {count}
                            </div>
                            <div className="text-xs text-neutral-500 capitalize">{priority}</div>
                          </div>
                        ) : null
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {assigneeWorkload.length === 0 && (
          <div className="flex items-center justify-center py-12 text-neutral-500">
            <div className="text-center">
              <Users className="w-12 h-12 mx-auto mb-4 text-neutral-300"/>
              <p>No team members with assigned tasks</p>
              <p className="text-sm mt-2">Assign tasks to team members to see workload distribution</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
