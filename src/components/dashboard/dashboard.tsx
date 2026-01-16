
import { logger } from '@/lib/logger'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import {
  Plus,
  Share,
  Edit,
  Eye,
  EyeOff,
  Save,
  Move
} from 'lucide-react'
import {
  ChartWidget,
  ListWidget,
  SummaryWidget,
  TimerWidget,
  MetricWidget,
  DashboardWidget,
  ChartData,
  ListData,
  SummaryData,
  TimerData,
  MetricData,
  type WidgetData
} from './widgets'

interface DashboardData {
  id: string
  title: string
  description?: string
  isPublic: boolean
  widgets: DashboardWidget[]
  layout: 'grid' | 'masonry'
  columns: number
}

interface DashboardProps {
  dashboard?: DashboardData
  onSave?: (dashboard: DashboardData) => void
  onShare?: () => void
  onCreateWidget?: (widget: Omit<DashboardWidget, 'id'>) => void
  onUpdateWidget?: (widgetId: string, updates: Partial<DashboardWidget>) => void
  onDeleteWidget?: (widgetId: string) => void
  isGuest?: boolean
}

export function Dashboard({
  dashboard,
  onSave,
  onShare,
  onCreateWidget,
  onUpdateWidget,
  onDeleteWidget,
  isGuest = false
}: DashboardProps) {
  const [isEditMode, setIsEditMode] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newWidgetType, setNewWidgetType] = useState<DashboardWidget['type']>('summary')
  const [newWidgetTitle, setNewWidgetTitle] = useState('')

  const widgets = dashboard?.widgets || []

  const handleCreateWidget = () => {
    if (!newWidgetTitle.trim()) return

    const baseWidget = {
      type: newWidgetType,
      title: newWidgetTitle,
      position: { x: 0, y: 0, w: 4, h: 3 },
      config: {},
      data: getDefaultDataForType(newWidgetType)
    }

    onCreateWidget?.(baseWidget)
    setNewWidgetTitle('')
    setIsCreateDialogOpen(false)
  }

  const getDefaultDataForType = (type: DashboardWidget['type']): WidgetData => {
    switch (type) {
      case 'chart':
        return {
          labels: ['Jan', 'Feb', 'Mar', 'Apr'],
          datasets: [{
            label: 'Tasks',
            data: [12, 19, 3, 5],
            backgroundColor: '#3b82f6'
          }]
        } as ChartData
      case 'list':
        return {
          items: [
            { id: '1', title: 'Task 1', value: 100, status: 'completed' },
            { id: '2', title: 'Task 2', value: 80, status: 'in_progress' }
          ]
        } as ListData
      case 'summary':
        return {
          total: 25,
          completed: 18,
          inProgress: 5,
          overdue: 2,
          percentage: 72
        } as SummaryData
      case 'timer':
        return {
          totalSeconds: 3600,
          elapsedSeconds: 1800,
          isRunning: false,
          taskTitle: 'Current Task'
        } as TimerData
      case 'metric':
        return {
          value: 1250,
          previousValue: 1100,
          unit: 'tasks',
          trend: 'up' as const,
          label: 'This month'
        } as MetricData
      default:
        return null
    }
  }

  const renderWidget = (widget: DashboardWidget) => {
    const commonProps = {
      widget,
      onRefresh: (widgetId: string) => {
        // Implement refresh logic
        logger.action('refresh_widget', { widgetId })
      },
      isEditMode,
      ...(onUpdateWidget && { onUpdate: onUpdateWidget }),
      ...(onDeleteWidget && { onDelete: onDeleteWidget })
    }

    switch (widget.type) {
      case 'chart':
        return <ChartWidget {...commonProps} data={widget.data as ChartData}/>
      case 'list':
        return <ListWidget {...commonProps} data={widget.data as ListData}/>
      case 'summary':
        return <SummaryWidget {...commonProps} data={widget.data as SummaryData}/>
      case 'timer':
        return (
          <TimerWidget
            {...commonProps}
            data={widget.data as TimerData}
            onStart={() => logger.action('timer_start', { widgetId: widget.id })}
            onStop={() => logger.action('timer_stop', { widgetId: widget.id })}
            onReset={() => logger.action('timer_reset', { widgetId: widget.id })}/>
        )
      case 'metric':
        return <MetricWidget {...commonProps} data={widget.data as MetricData}/>
      default:
        return <div>Unknown widget type</div>
    }
  }

  const gridClasses = dashboard?.layout === 'masonry'
    ? 'columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4'
    : `grid grid-cols-${dashboard?.columns || 4} gap-4`

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-background border-b border-neutral-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">{dashboard?.title || 'Dashboard'}</h1>
            {dashboard?.description && (
              <p className="text-sm text-neutral-600 mt-1">{dashboard.description}</p>
            )}
            <div className="flex items-center space-x-2 mt-2">
              {dashboard?.isPublic ? (
                <Badge variant="secondary">
                  <Eye className="w-3 h-3 mr-1"/>
                  Public
                </Badge>
              ) : (
                <Badge variant="outline">
                  <EyeOff className="w-3 h-3 mr-1"/>
                  Private
                </Badge>
              )}
              <Badge variant="outline">
                {widgets.length} widgets
              </Badge>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {!isGuest && (
              <>
                <Button
                  variant={isEditMode ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsEditMode(!isEditMode)}
                >
                  {isEditMode ? <Eye className="w-4 h-4 mr-1"/> : <Edit className="w-4 h-4 mr-1"/>}
                  {isEditMode ? 'Preview' : 'Edit'}
                </Button>

                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" disabled={!isEditMode}>
                      <Plus className="w-4 h-4 mr-1"/>
                      Add Widget
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Widget</DialogTitle>
                      <DialogDescription>
                        Choose a widget type and give it a title.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="widget-type">Widget Type</Label>
                        <Select value={newWidgetType} onValueChange={(value: DashboardWidget['type']) => setNewWidgetType(value)}>
                          <SelectTrigger>
                            <SelectValue/>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="chart">Chart</SelectItem>
                            <SelectItem value="list">List</SelectItem>
                            <SelectItem value="summary">Summary</SelectItem>
                            <SelectItem value="timer">Timer</SelectItem>
                            <SelectItem value="metric">Metric</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="widget-title">Widget Title</Label>
                        <Input
                          id="widget-title"
                          value={newWidgetTitle}
                          onChange={(e) => setNewWidgetTitle(e.target.value)}
                          placeholder="Enter widget title..."/>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleCreateWidget} disabled={!newWidgetTitle.trim()}>
                        Add Widget
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Button variant="outline" size="sm" onClick={() => dashboard && onSave?.(dashboard)}>
                  <Save className="w-4 h-4 mr-1"/>
                  Save
                </Button>
              </>
            )}

            <Button variant="outline" size="sm" onClick={onShare}>
              <Share className="w-4 h-4 mr-1"/>
              Share
            </Button>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {widgets.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-200 flex items-center justify-center">
                <Plus className="w-8 h-8 text-neutral-400"/>
              </div>
              <h3 className="text-lg font-medium text-neutral-900 mb-2">
                {isEditMode ? 'Add Your First Widget' : 'No Widgets Yet'}
              </h3>
              <p className="text-neutral-600 mb-4 max-w-md">
                {isEditMode
                  ? 'Start building your dashboard by adding widgets to display your data.'
                  : 'Widgets will appear here once added to the dashboard.'
                }
              </p>
              {isEditMode && !isGuest && (
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-1"/>
                  Add Widget
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className={gridClasses}>
            {widgets.map((widget) => (
              <div
                key={widget.id}
                className={`${isEditMode ? 'relative' : ''}`}
                draggable={isEditMode}
              >
                {renderWidget(widget)}

                {isEditMode && (
                  <div className="absolute -top-2 -right-2 bg-background border border-neutral-200 rounded-full p-1 shadow-sm">
                    <Move className="w-3 h-3 text-neutral-500"/>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
