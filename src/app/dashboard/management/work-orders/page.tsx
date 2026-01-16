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
  ClipboardList,
  Calendar,
  Clock,
  Users,
  MapPin,
  DollarSign,
  CheckCircle,
  AlertTriangle,
  Play,
  Briefcase,
  Package
} from 'lucide-react'

interface WorkOrder {
  id: string
  title: string
  work_order_type: string
  priority: string
  status: string
  start_date?: string
  end_date?: string
  estimated_duration?: any
  location_id?: string
  project_id?: string
  programming_id?: string
  assigned_crew: string[]
  assigned_assets: string[]
  cost_estimate?: number
  actual_cost?: number
  created_at: string
  project?: { name: string }
  location?: { name: string }
}

export default function WorkOrdersPage() {
  const { supabase } = useSupabase()
  const { data: session } = useSession()
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [currentView, setCurrentView] = useState<ViewType>('table')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')

  useEffect(() => {
    const loadWorkOrders = async () => {
      if (!session?.user?.organizationId) return

      const { data, error } = await supabase
        .from('work_orders')
        .select(`
          *,
          project:projects(name),
          location:places(name)
        `)
        .eq('organization_id', session.user.organizationId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading work orders:', error)
      } else {
        setWorkOrders(data || [])
      }
      setLoading(false)
    }

    loadWorkOrders()
  }, [session, supabase])

  const filteredWorkOrders = workOrders.filter(wo => {
    const matchesSearch = wo.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || wo.status === statusFilter
    const matchesType = typeFilter === 'all' || wo.work_order_type === typeFilter
    const matchesPriority = priorityFilter === 'all' || wo.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesType && matchesPriority
  })

  const getWorkOrderTypeIcon = (type: string) => {
    switch (type) {
      case 'setup': return <Package className="h-4 w-4" />
      case 'maintenance': return <Briefcase className="h-4 w-4" />
      case 'event_support': return <Calendar className="h-4 w-4" />
      case 'logistics': return <Package className="h-4 w-4" />
      default: return <ClipboardList className="h-4 w-4" />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'active': return <Play className="h-4 w-4 text-blue-500" />
      case 'scheduled': return <Clock className="h-4 w-4 text-yellow-500" />
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
            <th className="text-left p-4">Work Order</th>
            <th className="text-left p-4">Type</th>
            <th className="text-left p-4">Priority</th>
            <th className="text-left p-4">Status</th>
            <th className="text-left p-4">Project</th>
            <th className="text-left p-4">Location</th>
            <th className="text-left p-4">Timeline</th>
            <th className="text-left p-4">Assigned</th>
            <th className="text-left p-4">Cost</th>
            <th className="text-left p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredWorkOrders.map(wo => (
            <tr key={wo.id} className="border-b hover:bg-muted/50">
              <td className="p-4">
                <div>
                  <div className="font-medium flex items-center gap-2">
                    {getWorkOrderTypeIcon(wo.work_order_type)}
                    {wo.title}
                  </div>
                </div>
              </td>
              <td className="p-4">
                <Badge variant="outline" className="capitalize">
                  {wo.work_order_type.replace('_', ' ')}
                </Badge>
              </td>
              <td className="p-4">
                <Badge variant={getPriorityColor(wo.priority) as any}>
                  {wo.priority}
                </Badge>
              </td>
              <td className="p-4">
                <div className="flex items-center gap-2">
                  {getStatusIcon(wo.status)}
                  <span className="capitalize">{wo.status}</span>
                </div>
              </td>
              <td className="p-4">
                {wo.project?.name || <span className="text-muted-foreground">No Project</span>}
              </td>
              <td className="p-4">
                {wo.location?.name ? (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{wo.location.name}</span>
                  </div>
                ) : (
                  <span className="text-muted-foreground">TBD</span>
                )}
              </td>
              <td className="p-4">
                <div className="text-sm">
                  {wo.start_date && wo.end_date ? (
                    <div>
                      <div>{new Date(wo.start_date).toLocaleDateString()}</div>
                      <div className="text-muted-foreground">to {new Date(wo.end_date).toLocaleDateString()}</div>
                    </div>
                  ) : wo.start_date ? (
                    <div>Starts {new Date(wo.start_date).toLocaleDateString()}</div>
                  ) : (
                    <span className="text-muted-foreground">TBD</span>
                  )}
                </div>
              </td>
              <td className="p-4">
                <div className="text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>{wo.assigned_crew?.length || 0} crew</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Package className="h-4 w-4" />
                    <span>{wo.assigned_assets?.length || 0} assets</span>
                  </div>
                </div>
              </td>
              <td className="p-4">
                <div className="text-sm">
                  {wo.cost_estimate && (
                    <div>Est: ${wo.cost_estimate.toLocaleString()}</div>
                  )}
                  {wo.actual_cost && (
                    <div className="text-muted-foreground">Actual: ${wo.actual_cost.toLocaleString()}</div>
                  )}
                  {!wo.cost_estimate && !wo.actual_cost && (
                    <span className="text-muted-foreground">-</span>
                  )}
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
      {filteredWorkOrders.map(wo => (
        <Card key={wo.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                {getWorkOrderTypeIcon(wo.work_order_type)}
                <CardTitle className="text-lg">{wo.title}</CardTitle>
              </div>
              {getStatusIcon(wo.status)}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span>Type:</span>
                <Badge variant="outline" className="capitalize">{wo.work_order_type.replace('_', ' ')}</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>Priority:</span>
                <Badge variant={getPriorityColor(wo.priority) as any}>{wo.priority}</Badge>
              </div>
              {wo.project?.name && (
                <div className="flex justify-between text-sm">
                  <span>Project:</span>
                  <span className="text-muted-foreground">{wo.project.name}</span>
                </div>
              )}
              {wo.location?.name && (
                <div className="flex justify-between text-sm">
                  <span>Location:</span>
                  <span className="text-muted-foreground">{wo.location.name}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span>Crew:</span>
                <span className="text-muted-foreground">{wo.assigned_crew?.length || 0} assigned</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Assets:</span>
                <span className="text-muted-foreground">{wo.assigned_assets?.length || 0} assigned</span>
              </div>
              {(wo.cost_estimate || wo.actual_cost) && (
                <div className="flex justify-between text-sm">
                  <span>Cost:</span>
                  <span className="text-muted-foreground">
                    {wo.actual_cost ? `$${wo.actual_cost.toLocaleString()}` : `Est $${wo.cost_estimate?.toLocaleString()}`}
                  </span>
                </div>
              )}
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
    const total = workOrders.length
    const active = workOrders.filter(wo => wo.status === 'active').length
    const completed = workOrders.filter(wo => wo.status === 'completed').length
    const scheduled = workOrders.filter(wo => wo.status === 'scheduled').length
    const urgent = workOrders.filter(wo => wo.priority === 'urgent').length
    const totalEstimatedCost = workOrders.reduce((sum, wo) => sum + (wo.cost_estimate || 0), 0)
    const totalActualCost = workOrders.reduce((sum, wo) => sum + (wo.actual_cost || 0), 0)

    return { total, active, completed, scheduled, urgent, totalEstimatedCost, totalActualCost }
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
          <h1 className="text-3xl font-bold">Work Orders</h1>
          <p className="text-muted-foreground">
            Manage executable operational work, crew assignments, and schedules
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Work Order
          </Button>
          <ViewSwitcher
            currentView={currentView}
            availableViews={['table', 'board', 'calendar']}
            onViewChange={setCurrentView}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <ClipboardList className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
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
              <Clock className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Scheduled</p>
                <p className="text-2xl font-bold">{stats.scheduled}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Urgent</p>
                <p className="text-2xl font-bold">{stats.urgent}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Est. Cost</p>
                <p className="text-2xl font-bold">${stats.totalEstimatedCost.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Actual Cost</p>
                <p className="text-2xl font-bold">${stats.totalActualCost.toLocaleString()}</p>
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
                  placeholder="Search work orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="planned">Planned</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="setup">Setup</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="event_support">Event Support</SelectItem>
                <SelectItem value="logistics">Logistics</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-32">
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

      {filteredWorkOrders.length === 0 && (
        <div className="text-center py-12">
          <ClipboardList className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No work orders found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || statusFilter !== 'all' || typeFilter !== 'all' || priorityFilter !== 'all'
              ? 'Try adjusting your filters'
              : 'Create your first work order to manage operational tasks'}
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Work Order
          </Button>
        </div>
      )}
    </div>
  )
}
