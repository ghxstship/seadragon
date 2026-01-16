
import React, { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Target,
  Activity,
  RefreshCw
} from 'lucide-react'
import { cn } from '@/lib/utils'

export interface MetricData {
  id: string
  label: string
  value: number
  previousValue?: number
  unit?: string
  trend?: 'up' | 'down' | 'neutral'
  format?: 'number' | 'currency' | 'percentage'
  description?: string
  icon?: React.ComponentType<{ className?: string }>
  color?: 'primary' | 'success' | 'warning' | 'error' | 'info'
}

export interface MetricsDashboardProps {
  metrics: MetricData[]
  title?: string
  className?: string
  timeRange?: string
  onTimeRangeChange?: (range: string) => void
  timeRangeOptions?: string[]
  showTrends?: boolean
  showDescriptions?: boolean
  layout?: 'grid' | 'list'
  onRefresh?: () => void
  isLoading?: boolean
}

const metricIcons = {
  revenue: DollarSign,
  users: Users,
  conversion: Target,
  activity: Activity,
  default: BarChart3,
}

const colorConfig = {
  primary: {
    bg: 'bg-accent-primary/10',
    text: 'text-accent-primary',
    border: 'border-accent-primary/20'
  },
  success: {
    bg: 'bg-semantic-success/10',
    text: 'text-semantic-success',
    border: 'border-semantic-success/20'
  },
  warning: {
    bg: 'bg-semantic-warning/10',
    text: 'text-semantic-warning',
    border: 'border-semantic-warning/20'
  },
  error: {
    bg: 'bg-semantic-error/10',
    text: 'text-semantic-error',
    border: 'border-semantic-error/20'
  },
  info: {
    bg: 'bg-semantic-info/10',
    text: 'text-semantic-info',
    border: 'border-semantic-info/20'
  }
}

function formatMetricValue(value: number, format?: MetricData['format'], unit?: string): string {
  switch (format) {
    case 'currency':
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value)
    case 'percentage':
      return `${value.toFixed(1)}%`
    default:
      if (unit) return `${value.toLocaleString()} ${unit}`
      return value.toLocaleString()
  }
}

function calculateTrend(current: number, previous?: number): MetricData['trend'] {
  if (!previous) return 'neutral'
  if (current > previous) return 'up'
  if (current < previous) return 'down'
  return 'neutral'
}

function calculateTrendPercentage(current: number, previous?: number): number {
  if (!previous || previous === 0) return 0
  return ((current - previous) / previous) * 100
}

function MetricCard({
  metric,
  showTrend = true,
  showDescription = true,
  variant = 'default'
}: {
  metric: MetricData
  showTrend?: boolean
  showDescription?: boolean
  variant?: 'default' | 'compact'
}) {
  const Icon = metric.icon || metricIcons[metric.label.toLowerCase() as keyof typeof metricIcons] || metricIcons.default
  const trend = metric.trend || calculateTrend(metric.value, metric.previousValue)
  const trendPercentage = calculateTrendPercentage(metric.value, metric.previousValue)
  const config = colorConfig[metric.color || 'primary']

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : null

  if (variant === 'compact') {
    return (
      <Card className={cn("transition-colors hover:shadow-md", config.border, config.bg)}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={cn("p-2 rounded-lg", config.bg)}>
                <Icon className={cn("w-4 h-4", config.text)}/>
              </div>
              <div>
                <div className="text-sm font-medium text-foreground">{metric.label}</div>
                <div className="text-lg font-bold text-foreground">
                  {formatMetricValue(metric.value, metric.format, metric.unit)}
                </div>
              </div>
            </div>
            {showTrend && trendPercentage !== 0 && (
              <div className={cn(
                "flex items-center space-x-1 text-xs",
                trend === 'up' ? 'text-semantic-success' : 'text-semantic-error'
              )}>
                {TrendIcon && <TrendIcon className="w-3 h-3"/>}
                <span>{Math.abs(trendPercentage).toFixed(1)}%</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn("transition-colors hover:shadow-md", config.border, config.bg)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={cn("p-2 rounded-lg", config.bg)}>
              <Icon className={cn("w-5 h-5", config.text)}/>
            </div>
            <CardTitle className="text-lg">{metric.label}</CardTitle>
          </div>
          {showTrend && trendPercentage !== 0 && (
            <Badge variant="outline" className={cn(
              "flex items-center space-x-1",
              trend === 'up' ? 'text-semantic-success border-semantic-success/20' :
              trend === 'down' ? 'text-semantic-error border-semantic-error/20' :
              'text-muted-foreground'
            )}>
              {TrendIcon && <TrendIcon className="w-3 h-3"/>}
              <span>{Math.abs(trendPercentage).toFixed(1)}%</span>
            </Badge>
          )}
        </div>
        {showDescription && metric.description && (
          <p className="text-sm text-muted-foreground">{metric.description}</p>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-foreground mb-2">
          {formatMetricValue(metric.value, metric.format, metric.unit)}
        </div>
        {metric.previousValue && (
          <div className="text-sm text-muted-foreground">
            Previous: {formatMetricValue(metric.previousValue, metric.format, metric.unit)}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function MetricsDashboard({
  metrics,
  title = "Metrics Dashboard",
  className,
  timeRange = "Last 30 days",
  onTimeRangeChange,
  timeRangeOptions = ["Last 7 days", "Last 30 days", "Last 90 days", "Last year"],
  showTrends = true,
  showDescriptions = true,
  layout = 'grid',
  onRefresh,
  isLoading = false
}: MetricsDashboardProps) {
  const enrichedMetrics = useMemo(() =>
    metrics.map(metric => ({
      ...metric,
      trend: metric.trend || calculateTrend(metric.value, metric.previousValue),
      icon: metric.icon || metricIcons[metric.label.toLowerCase() as keyof typeof metricIcons] || metricIcons.default,
      color: metric.color || 'primary'
    })), [metrics]
  )

  const summaryStats = useMemo(() => {
    const totalMetrics = enrichedMetrics.length
    const trendingUp = enrichedMetrics.filter(m => m.trend === 'up').length
    const trendingDown = enrichedMetrics.filter(m => m.trend === 'down').length

    return { totalMetrics, trendingUp, trendingDown }
  }, [enrichedMetrics])

  return (
    <div className={cn("w-full", className)}>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">{title}</h1>
            <p className="text-muted-foreground mt-1">
              Track key performance indicators and business metrics
            </p>
          </div>
          <div className="flex items-center space-x-3">
            {onTimeRangeChange && (
              <Select value={timeRange} onValueChange={onTimeRangeChange}>
                <SelectTrigger className="w-40">
                  <SelectValue/>
                </SelectTrigger>
                <SelectContent>
                  {timeRangeOptions.map(option => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {onRefresh && (
              <Button variant="outline" size="sm" onClick={onRefresh} disabled={isLoading}>
                <RefreshCw className={cn("w-4 h-4 mr-2", isLoading && "animate-spin")}/>
                Refresh
              </Button>
            )}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="flex items-center space-x-6 text-sm text-muted-foreground">
          <div>Total Metrics: {summaryStats.totalMetrics}</div>
          <div className="flex items-center space-x-1">
            <TrendingUp className="w-4 h-4 text-semantic-success"/>
            <span>{summaryStats.trendingUp} Trending Up</span>
          </div>
          <div className="flex items-center space-x-1">
            <TrendingDown className="w-4 h-4 text-semantic-error"/>
            <span>{summaryStats.trendingDown} Trending Down</span>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      {layout === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {enrichedMetrics.map((metric) => (
            <MetricCard
              key={metric.id}
              metric={metric}
              showTrend={showTrends}
              showDescription={showDescriptions}/>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {enrichedMetrics.map((metric) => (
            <MetricCard
              key={metric.id}
              metric={metric}
              showTrend={showTrends}
              showDescription={showDescriptions}
              variant="compact"/>
          ))}
        </div>
      )}

      {enrichedMetrics.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <BarChart3 className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50"/>
          <p className="text-muted-foreground">No metrics to display</p>
        </div>
      )}

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground"/>
          <span className="ml-2 text-muted-foreground">Loading metrics...</span>
        </div>
      )}
    </div>
  )
}

export default MetricsDashboard
