
import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  BarChart3,
  PieChart,
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
  AlertTriangle,
  Settings,
  MoreHorizontal,
  RefreshCw
} from 'lucide-react'
import { format } from 'date-fns'

// Base widget interface
export interface DashboardWidget {
  id: string
  type: 'chart' | 'list' | 'summary' | 'timer' | 'metric'
  title: string
  position: { x: number; y: number; w: number; h: number }
  config: WidgetConfig
  data?: any
  isLoading?: boolean
  lastUpdated?: Date
}

export interface WidgetConfig {
  filters?: Record<string, any>
  sorting?: { field: string; direction: 'asc' | 'desc' }
  grouping?: string
  timeRange?: 'today' | 'week' | 'month' | 'quarter' | 'year'
  refreshInterval?: number // in minutes
}

// Widget data interfaces
export interface ChartData {
  labels: string[]
  datasets: Array<{
    label: string
    data: number[]
    backgroundColor?: string
    borderColor?: string
  }>
}

export interface ListData {
  items: Array<{
    id: string
    title: string
    value: string | number
    status?: string
    priority?: string
  }>
}

export interface SummaryData {
  total: number
  completed: number
  inProgress: number
  overdue: number
  percentage: number
}

export interface TimerData {
  totalSeconds: number
  elapsedSeconds: number
  isRunning: boolean
  taskTitle?: string
}

export interface MetricData {
  value: number
  previousValue?: number
  unit: string
  trend: 'up' | 'down' | 'stable'
  label: string
}

export type WidgetData = ChartData | ListData | SummaryData | TimerData | MetricData | null

// Base widget component
interface BaseWidgetProps {
  widget: DashboardWidget
  onUpdate?: (widgetId: string, updates: Partial<DashboardWidget>) => void
  onDelete?: (widgetId: string) => void
  onRefresh?: (widgetId: string) => void
  isEditMode?: boolean
  className?: string
}

export function BaseWidget({
  widget,
  onUpdate,
  onDelete,
  onRefresh,
  isEditMode = false,
  className = '',
  children
}: BaseWidgetProps & { children: React.ReactNode }) {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await onRefresh?.(widget.id)
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  return (
    <Card className={`relative ${className} ${isEditMode ? 'border-dashed border-2 border-accent-primary' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{widget.title}</CardTitle>
          <div className="flex items-center space-x-1">
            {widget.lastUpdated && (
              <span className="text-xs text-neutral-500">
                {format(widget.lastUpdated, 'HH:mm')}
              </span>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="h-6 w-6 p-0"
            >
              <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`}/>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <MoreHorizontal className="h-3 w-3"/>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => onRefresh?.(widget.id)}>
                  Refresh Data
                </DropdownMenuItem>
                <DropdownMenuItem disabled={!isEditMode}>
                  Edit Widget
                </DropdownMenuItem>
                <DropdownMenuSeparator/>
                <DropdownMenuItem
                  onClick={() => onDelete?.(widget.id)}
                  className="text-semantic-error"
                >
                  Delete Widget
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {widget.isLoading ? (
          <div className="flex items-center justify-center h-32">
            <RefreshCw className="h-6 w-6 animate-spin text-neutral-400"/>
          </div>
        ) : (
          children
        )}
      </CardContent>
    </Card>
  )
}

// Chart Widget
interface ChartWidgetProps extends BaseWidgetProps {
  data: ChartData
}

export function ChartWidget({ data, ...props }: ChartWidgetProps) {
  // Simple bar chart representation
  const maxValue = Math.max(...data.datasets.flatMap(d => d.data))

  return (
    <BaseWidget {...props}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Select defaultValue="bar">
            <SelectTrigger className="w-24 h-8">
              <SelectValue/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bar">Bar</SelectItem>
              <SelectItem value="line">Line</SelectItem>
              <SelectItem value="pie">Pie</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          {data.labels.map((label, index) => (
            <div key={label} className="flex items-center space-x-3">
              <div className="w-16 text-xs text-neutral-600 truncate">{label}</div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <Progress
                    value={(data.datasets[0]?.data[index] || 0) / maxValue * 100}
                    className="flex-1 h-2"/>
                  <span className="text-xs font-medium w-8 text-right">
                    {data.datasets[0]?.data[index] || 0}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </BaseWidget>
  )
}

// List Widget
interface ListWidgetProps extends BaseWidgetProps {
  data: ListData
}

export function ListWidget({ data, ...props }: ListWidgetProps) {
  return (
    <BaseWidget {...props}>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {data.items.slice(0, 10).map((item) => (
          <div key={item.id} className="flex items-center justify-between p-2 rounded hover:bg-neutral-50">
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{item.title}</div>
              <div className="flex items-center space-x-2 mt-1">
                {item.status && <Badge variant="outline" className="text-xs">{item.status}</Badge>}
                {item.priority && <Badge variant="secondary" className="text-xs">{item.priority}</Badge>}
              </div>
            </div>
            <div className="text-sm font-medium text-neutral-900">
              {typeof item.value === 'number' ? item.value.toLocaleString() : item.value}
            </div>
          </div>
        ))}
        {data.items.length > 10 && (
          <div className="text-xs text-neutral-500 text-center py-2">
            +{data.items.length - 10} more items
          </div>
        )}
      </div>
    </BaseWidget>
  )
}

// Summary Widget
interface SummaryWidgetProps extends BaseWidgetProps {
  data: SummaryData
}

export function SummaryWidget({ data, ...props }: SummaryWidgetProps) {
  return (
    <BaseWidget {...props}>
      <div className="space-y-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-accent-primary">{data.total}</div>
          <div className="text-sm text-neutral-600">Total Items</div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-semantic-success"/>
              <span className="text-sm">Completed</span>
            </div>
            <span className="text-sm font-medium">{data.completed}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-accent-primary"/>
              <span className="text-sm">In Progress</span>
            </div>
            <span className="text-sm font-medium">{data.inProgress}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-semantic-error"/>
              <span className="text-sm">Overdue</span>
            </div>
            <span className="text-sm font-medium">{data.overdue}</span>
          </div>
        </div>

        <Progress value={data.percentage} className="h-2"/>
        <div className="text-xs text-neutral-600 text-center">
          {data.percentage.toFixed(1)}% Complete
        </div>
      </div>
    </BaseWidget>
  )
}

// Timer Widget
interface TimerWidgetProps extends BaseWidgetProps {
  data: TimerData
  onStart?: () => void
  onStop?: () => void
  onReset?: () => void
}

export function TimerWidget({ data, onStart, onStop, onReset, ...props }: TimerWidgetProps) {
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const progressPercent = (data.elapsedSeconds / data.totalSeconds) * 100

  return (
    <BaseWidget {...props}>
      <div className="space-y-4">
        <div className="text-center">
          <div className="text-2xl font-mono font-bold">
            {formatTime(data.elapsedSeconds)}
          </div>
          <div className="text-sm text-neutral-600">
            of {formatTime(data.totalSeconds)}
          </div>
        </div>

        {data.taskTitle && (
          <div className="text-center">
            <div className="text-sm font-medium">{data.taskTitle}</div>
          </div>
        )}

        <Progress value={Math.min(progressPercent, 100)} className="h-2"/>

        <div className="flex items-center justify-center space-x-2">
          {!data.isRunning ? (
            <Button onClick={onStart} size="sm">
              <Clock className="w-4 h-4 mr-1"/>
              Start
            </Button>
          ) : (
            <Button onClick={onStop} variant="outline" size="sm">
              <Clock className="w-4 h-4 mr-1"/>
              Stop
            </Button>
          )}
          <Button onClick={onReset} variant="ghost" size="sm">
            Reset
          </Button>
        </div>
      </div>
    </BaseWidget>
  )
}

// Metric Widget
interface MetricWidgetProps extends BaseWidgetProps {
  data: MetricData
}

export function MetricWidget({ data, ...props }: MetricWidgetProps) {
  const trendIcon = data.trend === 'up' ? '↗' : data.trend === 'down' ? '↘' : '→'
  const trendColor = data.trend === 'up' ? 'text-semantic-success' : data.trend === 'down' ? 'text-semantic-error' : 'text-neutral-600'

  return (
    <BaseWidget {...props}>
      <div className="space-y-2">
        <div className="text-3xl font-bold">{data.value.toLocaleString()}</div>
        <div className="text-sm text-neutral-600">{data.unit}</div>
        <div className="flex items-center space-x-2">
          <span className={`text-sm font-medium ${trendColor}`}>
            {trendIcon}
          </span>
          <span className="text-sm text-neutral-600">{data.label}</span>
        </div>
        {data.previousValue && (
          <div className="text-xs text-neutral-500">
            Previous: {data.previousValue.toLocaleString()}
          </div>
        )}
      </div>
    </BaseWidget>
  )
}
