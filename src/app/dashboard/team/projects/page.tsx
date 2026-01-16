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
  FolderKanban,
  Calendar,
  Users,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Play,
  Pause,
  Clock,
  DollarSign
} from 'lucide-react'

interface Project {
  id: string
  name: string
  slug: string
  description?: string
  status: string
  priority: string
  budget?: number
  start_date?: string
  end_date?: string
  manager_id?: string
  manager?: { first_name: string; last_name: string }
  team_members: string[]
  created_at: string
}

export default function ProjectsPage() {
  const { supabase } = useSupabase()
  const { data: session } = useSession()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [currentView, setCurrentView] = useState<ViewType>('table')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')

  useEffect(() => {
    const loadProjects = async () => {
      if (!session?.user?.organizationId) return

      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          manager:users!projects_manager_id_fkey(first_name, last_name)
        `)
        .eq('organization_id', session.user.organizationId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading projects:', error)
      } else {
        setProjects(data || [])
      }
      setLoading(false)
    }

    loadProjects()
  }, [session, supabase])

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || project.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'active': return <Play className="h-4 w-4 text-blue-500" />
      case 'on_hold': return <Pause className="h-4 w-4 text-yellow-500" />
      case 'cancelled': return <AlertTriangle className="h-4 w-4 text-red-500" />
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
            <th className="text-left p-4">Project</th>
            <th className="text-left p-4">Status</th>
            <th className="text-left p-4">Priority</th>
            <th className="text-left p-4">Manager</th>
            <th className="text-left p-4">Timeline</th>
            <th className="text-left p-4">Budget</th>
            <th className="text-left p-4">Team</th>
            <th className="text-left p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProjects.map(project => (
            <tr key={project.id} className="border-b hover:bg-muted/50">
              <td className="p-4">
                <div>
                  <div className="font-medium">{project.name}</div>
                  {project.description && (
                    <div className="text-sm text-muted-foreground truncate max-w-xs">
                      {project.description}
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground mt-1">
                    {project.slug}
                  </div>
                </div>
              </td>
              <td className="p-4">
                <div className="flex items-center gap-2">
                  {getStatusIcon(project.status)}
                  <span className="capitalize">{project.status.replace('_', ' ')}</span>
                </div>
              </td>
              <td className="p-4">
                <Badge variant={getPriorityColor(project.priority) as any}>
                  {project.priority}
                </Badge>
              </td>
              <td className="p-4">
                {project.manager ? (
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>{project.manager.first_name} {project.manager.last_name}</span>
                  </div>
                ) : (
                  <span className="text-muted-foreground">Unassigned</span>
                )}
              </td>
              <td className="p-4">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4" />
                  {project.start_date && project.end_date ? (
                    <span>
                      {new Date(project.start_date).toLocaleDateString()} - {new Date(project.end_date).toLocaleDateString()}
                    </span>
                  ) : project.start_date ? (
                    <span>Started {new Date(project.start_date).toLocaleDateString()}</span>
                  ) : (
                    <span className="text-muted-foreground">No timeline</span>
                  )}
                </div>
              </td>
              <td className="p-4">
                {project.budget ? (
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    <span>{project.budget.toLocaleString()}</span>
                  </div>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </td>
              <td className="p-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>{project.team_members?.length || 0} members</span>
                </div>
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

  const renderCardView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredProjects.map(project => (
        <Card key={project.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <FolderKanban className="h-5 w-5" />
                <CardTitle className="text-lg">{project.name}</CardTitle>
              </div>
              {getStatusIcon(project.status)}
            </div>
          </CardHeader>
          <CardContent>
            {project.description && (
              <p className="text-sm text-muted-foreground mb-4">{project.description}</p>
            )}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span>Status:</span>
                <Badge variant={getPriorityColor(project.status) as any}>
                  {project.status.replace('_', ' ')}
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>Priority:</span>
                <Badge variant={getPriorityColor(project.priority) as any}>
                  {project.priority}
                </Badge>
              </div>
              {project.manager && (
                <div className="flex justify-between text-sm">
                  <span>Manager:</span>
                  <span className="text-muted-foreground">
                    {project.manager.first_name} {project.manager.last_name}
                  </span>
                </div>
              )}
              {project.budget && (
                <div className="flex justify-between text-sm">
                  <span>Budget:</span>
                  <span className="text-muted-foreground">${project.budget.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span>Team:</span>
                <span className="text-muted-foreground">{project.team_members?.length || 0} members</span>
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full">
              View Details
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  const getStats = () => {
    const total = projects.length
    const active = projects.filter(p => p.status === 'active').length
    const completed = projects.filter(p => p.status === 'completed').length
    const onHold = projects.filter(p => p.status === 'on_hold').length
    const totalBudget = projects.reduce((sum, p) => sum + (p.budget || 0), 0)

    return { total, active, completed, onHold, totalBudget }
  }

  const stats = getStats()

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
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground">
            Manage top-level initiatives, budgets, and timelines
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
          <ViewSwitcher
            currentView={currentView}
            availableViews={['table', 'board', 'calendar']}
            onViewChange={setCurrentView}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <FolderKanban className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Projects</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Play className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">{stats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{stats.completed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Pause className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">On Hold</p>
                <p className="text-2xl font-bold">{stats.onHold}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Budget</p>
                <p className="text-2xl font-bold">${stats.totalBudget.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects..."
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
                <SelectItem value="planning">Planning</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="on_hold">On Hold</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
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
          {currentView === 'board' && renderCardView()}
          {currentView === 'calendar' && (
            <div className="p-6 text-center text-muted-foreground">
              Calendar view coming soon
            </div>
          )}
        </CardContent>
      </Card>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <FolderKanban className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No projects found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all'
              ? 'Try adjusting your filters'
              : 'Create your first project to get started'}
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Project
          </Button>
        </div>
      )}
    </div>
  )
}
