
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { CheckCircle, Clock, AlertTriangle, XCircle, Play, Pause } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface StatusItem {
  id: string
  label: string
  status: 'pending' | 'in_progress' | 'completed' | 'error' | 'warning' | 'paused'
  progress?: number // 0-100
  description?: string
  timestamp?: Date
  metadata?: Record<string, unknown>
}

export interface StatusIndicatorProps {
  items: StatusItem[]
  title?: string
  className?: string
  showProgress?: boolean
  showTimestamps?: boolean
  variant?: 'default' | 'compact' | 'minimal'
  onItemClick?: (item: StatusItem) => void
}

const statusConfig = {
  pending: {
    icon: Clock,
    color: 'text-muted-foreground',
    bgColor: 'bg-muted',
    borderColor: 'border-muted',
    label: 'Pending'
  },
  in_progress: {
    icon: Play,
    color: 'text-semantic-info',
    bgColor: 'bg-accent-primary/10',
    borderColor: 'border-accent-primary/20',
    label: 'In Progress'
  },
  completed: {
    icon: CheckCircle,
    color: 'text-semantic-success',
    bgColor: 'bg-semantic-success/10',
    borderColor: 'border-semantic-success/20',
    label: 'Completed'
  },
  error: {
    icon: XCircle,
    color: 'text-semantic-error',
    bgColor: 'bg-semantic-error/10',
    borderColor: 'border-semantic-error/20',
    label: 'Error'
  },
  warning: {
    icon: AlertTriangle,
    color: 'text-semantic-warning',
    bgColor: 'bg-semantic-warning/10',
    borderColor: 'border-semantic-warning/20',
    label: 'Warning'
  },
  paused: {
    icon: Pause,
    color: 'text-muted-foreground',
    bgColor: 'bg-muted/50',
    borderColor: 'border-muted',
    label: 'Paused'
  }
}

export function StatusIndicator({
  items,
  title = "Status Overview",
  className,
  showProgress = true,
  showTimestamps = false,
  variant = 'default',
  onItemClick
}: StatusIndicatorProps) {
  const StatusIcon = ({ status }: { status: StatusItem['status'] }) => {
    const config = statusConfig[status]
    const Icon = config.icon
    return <Icon className={cn("w-4 h-4", config.color)}/>
  }

  const getStatusBadgeVariant = (status: StatusItem['status']): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'completed': return 'default'
      case 'error': return 'destructive'
      case 'warning': return 'secondary'
      default: return 'outline'
    }
  }

  const getOverallProgress = () => {
    if (items.length === 0) return 0
    const totalProgress = items.reduce((sum, item) => sum + (item.progress || 0), 0)
    return Math.round(totalProgress / items.length)
  }

  const getStatusCounts = () => {
    return items.reduce((counts, item) => {
      counts[item.status] = (counts[item.status] || 0) + 1
      return counts
    }, {} as Record<StatusItem['status'], number>)
  }

  if (variant === 'minimal') {
    return (
      <div className={cn("flex items-center space-x-4", className)}>
        <div className="flex items-center space-x-2">
          {Object.entries(getStatusCounts()).map(([status, count]) => {
            const config = statusConfig[status as StatusItem['status']]
            return (
              <div key={status} className="flex items-center space-x-1">
                <div className={cn("w-2 h-2 rounded-full", config.bgColor)}/>
                <span className="text-xs text-muted-foreground">{count}</span>
              </div>
            )
          })}
        </div>
        {showProgress && (
          <div className="flex items-center space-x-2">
            <Progress value={getOverallProgress()} className="w-20 h-1"/>
            <span className="text-xs text-muted-foreground">{getOverallProgress()}%</span>
          </div>
        )}
      </div>
    )
  }

  if (variant === 'compact') {
    return (
      <Card className={cn("", className)}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-foreground">{title}</h3>
            {showProgress && (
              <div className="flex items-center space-x-2">
                <Progress value={getOverallProgress()} className="w-16 h-1"/>
                <span className="text-xs text-muted-foreground">{getOverallProgress()}%</span>
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {items.map((item) => {
              const config = statusConfig[item.status]
              return (
                <Badge
                  key={item.id}
                  variant={getStatusBadgeVariant(item.status)}
                  className={cn(
                    "flex items-center space-x-1 cursor-pointer",
                    config.color,
                    onItemClick && "hover:opacity-80"
                  )}
                  onClick={() => onItemClick?.(item)}
                >
                  <StatusIcon status={item.status}/>
                  <span className="text-xs">{item.label}</span>
                </Badge>
              )
            })}
          </div>
        </CardContent>
      </Card>
    )
  }

  // Default variant
  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          <div className="flex items-center space-x-4">
            {showProgress && (
              <div className="flex items-center space-x-2">
                <Progress value={getOverallProgress()} className="w-24 h-2"/>
                <span className="text-sm text-muted-foreground">{getOverallProgress()}% Complete</span>
              </div>
            )}
            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
              {Object.entries(getStatusCounts()).map(([status, count]) => {
                const config = statusConfig[status as StatusItem['status']]
                return (
                  <div key={status} className="flex items-center space-x-1">
                    <div className={cn("w-2 h-2 rounded-full", config.bgColor)}/>
                    <span>{config.label}: {count}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {items.map((item) => {
            const config = statusConfig[item.status]
            return (
              <div
                key={item.id}
                className={cn(
                  "flex items-center justify-between p-3 rounded-lg border transition-colors",
                  config.borderColor,
                  config.bgColor,
                  onItemClick && "cursor-pointer hover:opacity-90"
                )}
                onClick={() => onItemClick?.(item)}
              >
                <div className="flex items-center space-x-3">
                  <StatusIcon status={item.status}/>
                  <div>
                    <div className="font-medium text-foreground text-sm">{item.label}</div>
                    {item.description && (
                      <div className="text-xs text-muted-foreground">{item.description}</div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {item.progress !== undefined && showProgress && (
                    <div className="flex items-center space-x-2">
                      <Progress value={item.progress} className="w-12 h-1"/>
                      <span className="text-xs text-muted-foreground">{item.progress}%</span>
                    </div>
                  )}

                  {showTimestamps && item.timestamp && (
                    <div className="text-xs text-muted-foreground">
                      {item.timestamp.toLocaleTimeString()}
                    </div>
                  )}

                  <Badge variant={getStatusBadgeVariant(item.status)} className="text-xs">
                    {config.label}
                  </Badge>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

export default StatusIndicator
