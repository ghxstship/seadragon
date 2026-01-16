'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useSupabase } from '@/contexts/SupabaseContext'
import { useSession } from 'next-auth/react'
import {
  Users,
  FolderKanban,
  Calendar,
  CheckSquare,
  TrendingUp,
  AlertTriangle,
  Clock,
  DollarSign,
  Activity,
  Target
} from 'lucide-react'

interface DashboardWidget {
  id: string
  title: string
  type: 'metric' | 'chart' | 'list' | 'progress'
  size: 'small' | 'medium' | 'large'
  data: any
}

export default function DashboardPage() {
  const { supabase } = useSupabase()
  const { data: session } = useSession()
  const [widgets, setWidgets] = useState<DashboardWidget[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDashboard = async () => {
      if (!session?.user?.organizationId) return

      const orgId = session.user.organizationId

      // Load dashboard configuration
      const { data: config } = await supabase
        .from('dashboard_configs')
        .select('*')
        .eq('organization_id', orgId)
        .eq('user_id', session.user.id)
        .single()

      // If no user-specific config, load organization default
      const dashboardConfig = config || await supabase
        .from('dashboard_configs')
        .select('*')
        .eq('organization_id', orgId)
        .is('user_id', null)
        .eq('is_default', true)
        .single()

      if (dashboardConfig?.data?.widgets) {
        setWidgets(dashboardConfig.data.widgets)
      } else {
        // Default widgets
        setWidgets([
          {
            id: 'active_projects',
            title: 'Active Projects',
            type: 'metric',
            size: 'small',
            data: { value: 0, change: 0 }
          },
          {
            id: 'tasks_completed',
            title: 'Tasks Completed',
            type: 'metric',
            size: 'small',
            data: { value: 0, change: 0 }
          },
          {
            id: 'upcoming_deadlines',
            title: 'Upcoming Deadlines',
            type: 'list',
            size: 'medium',
            data: []
          },
          {
            id: 'team_activity',
            title: 'Team Activity',
            type: 'chart',
            size: 'large',
            data: []
          }
        ])
      }

      // Load actual data for widgets
      await loadWidgetData()
      setLoading(false)
    }

    const loadWidgetData = async () => {
      if (!session?.user?.organizationId) return

      const orgId = session.user.organizationId

      // Load projects count
      const { count: projectsCount } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('organization_id', orgId)

      // Load tasks count
      const { count: tasksCount } = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .eq('organization_id', orgId)

      // Load upcoming deadlines
      const { data: deadlines } = await supabase
        .from('tasks')
        .select('title, due_date, priority')
        .eq('organization_id', orgId)
        .not('due_date', 'is', null)
        .gte('due_date', new Date().toISOString())
        .order('due_date')
        .limit(5)

      // Update widgets with real data
      setWidgets(prev => prev.map(widget => {
        switch (widget.id) {
          case 'active_projects':
            return { ...widget, data: { value: projectsCount || 0, change: 0 } }
          case 'tasks_completed':
            return { ...widget, data: { value: tasksCount || 0, change: 0 } }
          case 'upcoming_deadlines':
            return { ...widget, data: deadlines || [] }
          default:
            return widget
        }
      }))
    }

    loadDashboard()
  }, [session, supabase])

  const renderWidget = (widget: DashboardWidget) => {
    const sizeClasses = {
      small: 'col-span-1',
      medium: 'col-span-1 md:col-span-2',
      large: 'col-span-1 md:col-span-2 lg:col-span-3'
    }

    return (
      <div key={widget.id} className={sizeClasses[widget.size]}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {widget.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {renderWidgetContent(widget)}
          </CardContent>
        </Card>
      </div>
    )
  }

  const renderWidgetContent = (widget: DashboardWidget) => {
    switch (widget.type) {
      case 'metric':
        return (
          <div className="flex items-center">
            <div className="text-2xl font-bold">{widget.data.value}</div>
            {widget.data.change !== 0 && (
              <Badge variant={widget.data.change > 0 ? 'default' : 'destructive'} className="ml-2">
                {widget.data.change > 0 ? '+' : ''}{widget.data.change}
              </Badge>
            )}
          </div>
        )

      case 'list':
        return (
          <div className="space-y-2">
            {widget.data.slice(0, 3).map((item: any, index: number) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm">{item.title}</span>
                <Badge variant="outline" className="text-xs">
                  {new Date(item.due_date).toLocaleDateString()}
                </Badge>
              </div>
            ))}
            {widget.data.length === 0 && (
              <p className="text-sm text-muted-foreground">No upcoming deadlines</p>
            )}
          </div>
        )

      case 'progress':
        return (
          <div className="space-y-2">
            <Progress value={widget.data.value} className="w-full" />
            <p className="text-xs text-muted-foreground">
              {widget.data.value}% complete
            </p>
          </div>
        )

      default:
        return <p className="text-sm text-muted-foreground">Widget content</p>
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-4 bg-muted rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your organization's activity.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {widgets.map(renderWidget)}
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button variant="outline" className="h-20 flex-col gap-2">
            <CheckSquare className="h-6 w-6" />
            Create Task
          </Button>
          <Button variant="outline" className="h-20 flex-col gap-2">
            <FolderKanban className="h-6 w-6" />
            New Project
          </Button>
          <Button variant="outline" className="h-20 flex-col gap-2">
            <Calendar className="h-6 w-6" />
            Schedule Event
          </Button>
          <Button variant="outline" className="h-20 flex-col gap-2">
            <Users className="h-6 w-6" />
            Add Team Member
          </Button>
        </div>
      </div>
    </div>
  )
}
