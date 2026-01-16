'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ViewSwitcher, ViewType } from '@/lib/design-system/patterns/view-switcher'
import { useSupabase } from '@/contexts/SupabaseContext'
import { useSession } from 'next-auth/react'
import {
  Plus,
  Search,
  Filter,
  CheckSquare,
  Clock,
  AlertTriangle,
  User,
  Calendar
} from 'lucide-react'

interface Task {
  id: string
  title: string
  description?: string
  status: string
  priority: string
  assigned_to: string[]
  due_date?: string
  created_by: string
  created_at: string
}

export default function TasksPage() {
  const { supabase } = useSupabase()
  const { data: session } = useSession()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [currentView, setCurrentView] = useState<ViewType>('table')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')

  useEffect(() => {
    const loadTasks = async () => {
      if (!session?.user?.organizationId) return

      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          created_by_user:users!tasks_created_by_fkey(first_name, last_name)
        `)
        .eq('organization_id', session.user.organizationId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading tasks:', error)
      } else {
        setTasks(data || [])
      }
      setLoading(false)
    }

    loadTasks()
  }, [session, supabase])

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckSquare className="h-4 w-4 text-green-500" />
      case 'in_progress': return <Clock className="h-4 w-4 text-blue-500" />
      case 'review': return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      default: return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'destructive'
      case 'high': return 'default'
      case 'medium': return 'secondary'
      case 'low': return 'outline'
      default: return 'outline'
    }
  }

  const renderTableView = () => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left p-4">Task</th>
            <th className="text-left p-4">Status</th>
            <th className="text-left p-4">Priority</th>
            <th className="text-left p-4">Assigned To</th>
            <th className="text-left p-4">Due Date</th>
            <th className="text-left p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTasks.map(task => (
            <tr key={task.id} className="border-b hover:bg-muted/50">
              <td className="p-4">
                <div>
                  <div className="font-medium">{task.title}</div>
                  {task.description && (
                    <div className="text-sm text-muted-foreground truncate max-w-xs">
                      {task.description}
                    </div>
                  )}
                </div>
              </td>
              <td className="p-4">
                <div className="flex items-center gap-2">
                  {getStatusIcon(task.status)}
                  <span className="capitalize">{task.status.replace('_', ' ')}</span>
                </div>
              </td>
              <td className="p-4">
                <Badge variant={getPriorityColor(task.priority) as any}>
                  {task.priority}
                </Badge>
              </td>
              <td className="p-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{task.assigned_to?.length || 0} assigned</span>
                </div>
              </td>
              <td className="p-4">
                {task.due_date ? (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {new Date(task.due_date).toLocaleDateString()}
                  </div>
                ) : (
                  <span className="text-muted-foreground">No due date</span>
                )}
              </td>
              <td className="p-4">
                <Button variant="ghost" size="sm">Edit</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  const renderListView = () => (
    <div className="space-y-4">
      {filteredTasks.map(task => (
        <Card key={task.id}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {getStatusIcon(task.status)}
                  <h3 className="font-medium">{task.title}</h3>
                  <Badge variant={getPriorityColor(task.priority) as any}>
                    {task.priority}
                  </Badge>
                </div>
                {task.description && (
                  <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                )}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{task.assigned_to?.length || 0} assigned</span>
                  {task.due_date && (
                    <span>Due {new Date(task.due_date).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
              <Button variant="ghost" size="sm">Edit</Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  const renderBoardView = () => {
    const columns = ['todo', 'in_progress', 'review', 'completed']

    return (
      <div className="flex gap-6 overflow-x-auto pb-4">
        {columns.map(column => {
          const columnTasks = filteredTasks.filter(task => task.status === column)

          return (
            <div key={column} className="flex-1 min-w-80">
              <div className="bg-muted/50 rounded-lg p-4">
                <h3 className="font-medium mb-4 capitalize flex items-center gap-2">
                  {getStatusIcon(column)}
                  {column.replace('_', ' ')}
                  <Badge variant="secondary">{columnTasks.length}</Badge>
                </h3>
                <div className="space-y-3">
                  {columnTasks.map(task => (
                    <Card key={task.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-3">
                        <h4 className="font-medium text-sm mb-2">{task.title}</h4>
                        <div className="flex items-center justify-between">
                          <Badge variant={getPriorityColor(task.priority) as any} className="text-xs">
                            {task.priority}
                          </Badge>
                          {task.due_date && (
                            <span className="text-xs text-muted-foreground">
                              {new Date(task.due_date).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded"></div>
          <div className="h-96 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Tasks</h1>
          <p className="text-muted-foreground">
            Manage and track atomic work units across your organization
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Button>
          <ViewSwitcher
            currentView={currentView}
            availableViews={['table', 'list', 'board', 'calendar']}
            onViewChange={setCurrentView}
          />
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="todo">To Do</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="review">Review</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      <Card>
        <CardContent className="p-0">
          {currentView === 'table' && renderTableView()}
          {currentView === 'list' && renderListView()}
          {currentView === 'board' && renderBoardView()}
          {currentView === 'calendar' && (
            <div className="p-6 text-center text-muted-foreground">
              Calendar view coming soon
            </div>
          )}
        </CardContent>
      </Card>

      {filteredTasks.length === 0 && (
        <div className="text-center py-12">
          <CheckSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No tasks found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all'
              ? 'Try adjusting your filters'
              : 'Create your first task to get started'}
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Task
          </Button>
        </div>
      )}
    </div>
  )
}
