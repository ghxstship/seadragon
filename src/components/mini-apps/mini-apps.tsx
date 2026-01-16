
import { useState, useMemo } from 'react'
import { logger } from '@/lib/logger'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Plus,
  Settings,
  Zap,
  Tag,
  Clock,
  AlertTriangle,
  CheckCircle,
  Play,
  Pause,
  Square,
  Target,
  Users,
  Calendar,
  BarChart3
} from 'lucide-react'

// Mini-app types
export type MiniAppType = 'custom-fields' | 'automations' | 'time-tracking' | 'sprints' | 'dependencies' | 'tags' | 'assignees' | 'priority-flags' | 'nested-subtasks'

export interface MiniApp {
  id: string
  type: MiniAppType
  name: string
  description: string
  icon: string
  isEnabled: boolean
  config: Record<string, unknown>
  createdAt: Date
}

// Custom Fields mini-app
interface CustomField {
  id: string
  name: string
  type: 'text' | 'number' | 'date' | 'select' | 'checkbox'
  required: boolean
  options?: string[]
  defaultValue?: string | number | Date | string[] | boolean
}

export function CustomFieldsApp({ fields, onAddField, onUpdateField, onDeleteField, isGuest }: {
  fields: CustomField[]
  onAddField?: (field: Omit<CustomField, 'id'>) => void
  onUpdateField?: (fieldId: string, updates: Partial<CustomField>) => void
  onDeleteField?: (fieldId: string) => void
  isGuest?: boolean
}) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newField, setNewField] = useState({
    name: '',
    type: 'text' as CustomField['type'],
    required: false,
    options: [] as string[]
  })

  const handleAddField = () => {
    if (!newField.name.trim()) return
    onAddField?.(newField)
    setNewField({ name: '', type: 'text', required: false, options: [] })
    setIsAddDialogOpen(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Settings className="w-5 h-5"/>
          <span>Custom Fields</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {fields.map((field) => (
            <div key={field.id} className="flex items-center justify-between p-3 border rounded">
              <div>
                <div className="font-medium">{field.name}</div>
                <div className="text-sm text-neutral-600">
                  {field.type} {field.required && '(required)'}
                </div>
              </div>
              {!isGuest && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">Actions</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => logger.action('edit_field', { fieldId: field.id })}>
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDeleteField?.(field.id)} className="text-semantic-error">
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          ))}
        </div>

        {!isGuest && (
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                <Plus className="w-4 h-4 mr-1"/>
                Add Custom Field
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Custom Field</DialogTitle>
                <DialogDescription>
                  Create a custom field for your tasks.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Field Name</label>
                  <Input
                    value={newField.name}
                    onChange={(e) => setNewField(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Priority Score"/>
                </div>
                <div>
                  <label className="text-sm font-medium">Field Type</label>
                  <Select
                    value={newField.type}
                    onValueChange={(value: CustomField['type']) => setNewField(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue/>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="number">Number</SelectItem>
                      <SelectItem value="date">Date</SelectItem>
                      <SelectItem value="select">Select</SelectItem>
                      <SelectItem value="checkbox">Checkbox</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddField} disabled={!newField.name.trim()}>
                  Add Field
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  )
}

// Time Tracking mini-app
export function TimeTrackingApp({ sessions, onStart, onStop, onLogTime, isGuest }: {
  sessions: Array<{
    id: string
    taskId: string
    taskTitle: string
    startTime: Date
    endTime?: Date
    duration: number // in minutes
  }>
  onStart?: (taskId: string) => void
  onStop?: () => void
  onLogTime?: (taskId: string, minutes: number) => void
  isGuest?: boolean
}) {
  const [isRunning, setIsRunning] = useState(false)
  const [currentTask, setCurrentTask] = useState<string | null>(null)
  const [elapsedTime, setElapsedTime] = useState(0)

  const activeSession = sessions.find(s => !s.endTime)

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}:${mins.toString().padStart(2, '0')}`
  }

  const handleStart = (taskId: string, taskTitle: string) => {
    setIsRunning(true)
    setCurrentTask(taskTitle)
    setElapsedTime(0)
    onStart?.(taskId)
  }

  const handleStop = () => {
    setIsRunning(false)
    setCurrentTask(null)
    setElapsedTime(0)
    onStop?.()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Clock className="w-5 h-5"/>
          <span>Time Tracking</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activeSession ? (
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Currently tracking:</span>
              <Badge variant="secondary">{formatTime(activeSession.duration)}</Badge>
            </div>
            <div className="text-sm text-neutral-600 mb-3">
              {activeSession.taskTitle}
            </div>
            <Button onClick={handleStop} variant="outline" size="sm">
              <Square className="w-4 h-4 mr-1"/>
              Stop Timer
            </Button>
          </div>
        ) : (
          <div className="text-center py-4">
            <Clock className="w-8 h-8 mx-auto mb-2 text-neutral-400"/>
            <p className="text-sm text-neutral-600">No active timer</p>
          </div>
        )}

        <div className="space-y-3">
          <h4 className="font-medium">Recent Sessions</h4>
          {sessions.slice(0, 5).map((session) => (
            <div key={session.id} className="flex items-center justify-between p-3 border rounded">
              <div>
                <div className="font-medium text-sm">{session.taskTitle}</div>
                <div className="text-xs text-neutral-500">
                  {session.startTime.toLocaleDateString()}
                </div>
              </div>
              <Badge variant="outline">{formatTime(session.duration)}</Badge>
            </div>
          ))}
        </div>

        {!isGuest && (
          <Button variant="outline" className="w-full">
            <Plus className="w-4 h-4 mr-1"/>
            Log Time Manually
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

// Automations mini-app
interface AutomationRule {
  id: string
  name: string
  trigger: string
  conditions: string[]
  actions: string[]
  isActive: boolean
}

interface Task {
  id: string
  title: string
  status: string
  storyPoints?: number
}

interface Sprint {
  id: string
  name: string
  startDate: Date
  endDate: Date
  status: 'planning' | 'active' | 'completed'
  goal: string
  tasks: Task[]
}

export function AutomationsApp({ rules, onAddRule, onUpdateRule, onDeleteRule, isGuest }: {
  onAddRule?: (rule: Omit<AutomationRule, 'id'>) => void
  onUpdateRule?: (ruleId: string, updates: Partial<AutomationRule>) => void
  onDeleteRule?: (ruleId: string) => void
  isGuest?: boolean
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Zap className="w-5 h-5"/>
          <span>Automations</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {rules.map((rule) => (
            <div key={rule.id} className="flex items-center justify-between p-3 border rounded">
              <div>
                <div className="font-medium">{rule.name}</div>
                <div className="text-sm text-neutral-600">
                  {rule.trigger} → {rule.actions.length} actions
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={rule.isActive ? "default" : "secondary"}>
                  {rule.isActive ? "Active" : "Inactive"}
                </Badge>
                {!isGuest && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">Actions</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => onUpdateRule?.(rule.id, { isActive: !rule.isActive })}>
                        {rule.isActive ? 'Deactivate' : 'Activate'}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => logger.action('edit_rule', { ruleId: rule.id })}>
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDeleteRule?.(rule.id)} className="text-semantic-error">
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
          ))}
        </div>

        {!isGuest && (
          <Button variant="outline" className="w-full">
            <Plus className="w-4 h-4 mr-1"/>
            Create Automation
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

// Sprints mini-app
export function SprintsApp({ sprints, onCreateSprint, onUpdateSprint, isGuest }: {
  sprints: Sprint[]
  onCreateSprint?: (sprint: Omit<Sprint, 'id'>) => void
  onUpdateSprint?: (sprintId: string, updates: Partial<Sprint>) => void
  isGuest?: boolean
}) {
  const activeSprint = sprints.find(s => s.status === 'active')

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Target className="w-5 h-5"/>
          <span>Sprints</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activeSprint ? (
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Active Sprint:</span>
              <Badge variant="default">Active</Badge>
            </div>
            <div className="text-sm font-medium">{activeSprint.name}</div>
            <div className="text-xs text-neutral-600 mb-2">
              {activeSprint.startDate.toLocaleDateString()} - {activeSprint.endDate.toLocaleDateString()}
            </div>
            <div className="text-sm">{activeSprint.goal}</div>
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs mb-1">
                <span>Progress</span>
                <span>{activeSprint.tasks.filter(t => t.status === 'done').length}/{activeSprint.tasks.length} tasks</span>
              </div>
              <Progress value={(activeSprint.tasks.filter(t => t.status === 'done').length / activeSprint.tasks.length) * 100}/>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <Target className="w-8 h-8 mx-auto mb-2 text-neutral-400"/>
            <p className="text-sm text-neutral-600">No active sprint</p>
          </div>
        )}

        <div className="space-y-3">
          <h4 className="font-medium">Sprint History</h4>
          {sprints.filter(s => s.status === 'completed').slice(0, 3).map((sprint) => (
            <div key={sprint.id} className="flex items-center justify-between p-3 border rounded">
              <div>
                <div className="font-medium text-sm">{sprint.name}</div>
                <div className="text-xs text-neutral-500">
                  {sprint.startDate.toLocaleDateString()} - {sprint.endDate.toLocaleDateString()}
                </div>
              </div>
              <Badge variant="outline">
                {sprint.tasks.filter(t => t.status === 'done').length}/{sprint.tasks.length} completed
              </Badge>
            </div>
          ))}
        </div>

        {!isGuest && (
          <Button variant="outline" className="w-full">
            <Plus className="w-4 h-4 mr-1"/>
            Start New Sprint
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

// Dependencies mini-app
export function DependenciesApp({ dependencies, onAddDependency, onRemoveDependency, isGuest }: {
  dependencies: Array<{
    id: string
    fromTask: { id: string; title: string }
    toTask: { id: string; title: string }
    type: 'blocks' | 'blocked_by' | 'relates_to'
    status: 'pending' | 'completed' | 'at_risk'
  }>
  onAddDependency?: (fromId: string, toId: string, type: string) => void
  onRemoveDependency?: (dependencyId: string) => void
  isGuest?: boolean
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-semantic-success'
      case 'at_risk': return 'text-semantic-error'
      default: return 'text-neutral-600'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5"/>
          <span>Dependencies</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {dependencies.map((dep) => (
            <div key={dep.id} className="p-3 border rounded">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{dep.type.replace('_', ' ')}</Badge>
                  <span className={`text-sm ${getStatusColor(dep.status)}`}>
                    {dep.status}
                  </span>
                </div>
                {!isGuest && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveDependency?.(dep.id)}
                    className="text-semantic-error hover:text-semantic-error"
                  >
                    Remove
                  </Button>
                )}
              </div>
              <div className="text-sm">
                <span className="font-medium">{dep.fromTask.title}</span>
                <span className="text-neutral-500 mx-2">
                  {dep.type === 'blocks' ? '→' : dep.type === 'blocked_by' ? '←' : '↔'}
                </span>
                <span className="font-medium">{dep.toTask.title}</span>
              </div>
            </div>
          ))}
        </div>

        {!isGuest && (
          <Button variant="outline" className="w-full">
            <Plus className="w-4 h-4 mr-1"/>
            Add Dependency
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
