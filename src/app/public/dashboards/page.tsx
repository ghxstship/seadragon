
'use client'

import { logger } from '@/lib/logger'
import { CommandBar } from '@/components/command-bar'
import { Dashboard } from '@/components/dashboard/dashboard'
import { DashboardWidget } from '@/components/dashboard/widgets'

interface DashboardData {
  id: string
  title: string
  description: string
  isPublic: boolean
  widgets: DashboardWidget[]
  layout: string
  columns: number
}

// Default dashboard data (used as fallback)
const defaultDashboard = {
  id: '1',
  title: 'Project Overview Dashboard',
  description: 'Track project progress, team workload, and key metrics',
  isPublic: true,
  widgets: [
    {
      id: 'summary-1',
      type: 'summary' as const,
      title: 'Task Summary',
      position: { x: 0, y: 0, w: 4, h: 3 },
      config: {},
      data: {
        total: 25,
        completed: 18,
        inProgress: 5,
        overdue: 2,
        percentage: 72
      },
      lastUpdated: new Date()
    },
    {
      id: 'chart-1',
      type: 'chart' as const,
      title: 'Tasks by Status',
      position: { x: 4, y: 0, w: 4, h: 3 },
      config: {},
      data: {
        datasets: [{
          label: 'Tasks',
          data: [18, 5, 2, 0],
          backgroundColor: '#3b82f6'
        }]
      },
      lastUpdated: new Date()
    },
    {
      id: 'metric-1',
      type: 'metric' as const,
      title: 'Total Tasks',
      position: { x: 0, y: 3, w: 2, h: 2 },
      config: {},
      data: {
        value: 25,
        previousValue: 22,
        unit: 'tasks',
        trend: 'up' as const,
        label: 'vs last month'
      },
      lastUpdated: new Date()
    },
    {
      id: 'metric-2',
      type: 'metric' as const,
      title: 'Completion Rate',
      position: { x: 2, y: 3, w: 2, h: 2 },
      config: {},
      data: {
        value: 72,
        previousValue: 68,
        unit: '%',
        trend: 'up' as const,
        label: 'vs last month'
      },
      lastUpdated: new Date()
    },
    {
      id: 'list-1',
      type: 'list' as const,
      title: 'Recent Tasks',
      position: { x: 4, y: 3, w: 4, h: 3 },
      config: {},
      data: {
        items: [
          { id: '1', title: 'Design system audit', value: 'Completed', status: 'completed', priority: 'high' },
          { id: '2', title: 'API documentation', value: 'In Progress', status: 'in_progress', priority: 'normal' },
          { id: '3', title: 'User testing session', value: 'Review', status: 'review', priority: 'urgent' },
          { id: '5', title: 'Security audit', value: 'Completed', status: 'completed', priority: 'high' }
        ]
      },
      lastUpdated: new Date()
    },
    {
      id: 'timer-1',
      type: 'timer' as const,
      title: 'Current Sprint',
      position: { x: 0, y: 5, w: 3, h: 2 },
      config: {},
      data: {
        totalSeconds: 604800, // 1 week
        elapsedSeconds: 259200, // 3 days
        isRunning: true,
        taskTitle: 'Sprint 2026-Q1'
      },
      lastUpdated: new Date()
    }
  ] as DashboardWidget[],
  layout: 'grid' as const,
  columns: 4
}

export default function PublicDashboardsPage() {
  const [currentDashboard, setCurrentDashboard] = useState(defaultDashboard)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    const loadDashboard = async () => {
      try {
        const res = await fetch('/api/dashboards/public')
        if (res.ok) {
          const data = await res.json()
          if (!cancelled && data.dashboard) {
            setCurrentDashboard(data.dashboard)
          }
        }
        if (!cancelled) setIsLoading(false)
      } catch (error) {
        logger.error('Error loading dashboard:', error)
        if (!cancelled) setIsLoading(false)
      }
    }

    loadDashboard()

    return () => { cancelled = true }
  }, [])

  const handleSaveDashboard = (dashboard: DashboardData) => {
    logger.action('save_dashboard', { dashboardId: dashboard.id })
    setCurrentDashboard(dashboard)
  }

  const handleCreateWidget = (widget: Omit<DashboardWidget, 'id'>) => {
    const newWidget = {
      ...widget,
      id: `widget-${Date.now()}`
    }
    setCurrentDashboard(prev => ({
      ...prev,
      widgets: [...prev.widgets, newWidget]
    }))
  }

  const handleUpdateWidget = (widgetId: string, updates: Partial<DashboardWidget>) => {
    setCurrentDashboard(prev => ({
      ...prev,
      widgets: prev.widgets.map(widget =>
        widget.id === widgetId ? { ...widget, ...updates } : widget
      )
    }))
  }

  const handleDeleteWidget = (widgetId: string) => {
    setCurrentDashboard(prev => ({
      ...prev,
      widgets: prev.widgets.filter(widget => widget.id !== widgetId)
    }))
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Command Bar - Fixed at top */}
      <div className="sticky top-0 z-50">
        <CommandBar
          isGuest={true}
          onSearch={(query) => logger.search(query)}
          onCreate={(type) => logger.action('create', { type })}/>
      </div>

      {/* Dashboard Content */}
      <div className="min-h-screen">
        <Dashboard
          dashboard={currentDashboard}
          onSave={handleSaveDashboard}
          onShare={() => logger.action('share_dashboard')}
          onCreateWidget={handleCreateWidget}
          onUpdateWidget={handleUpdateWidget}
          onDeleteWidget={handleDeleteWidget}
          isGuest={false}
        />
      </div>
    </div>
  )
}
