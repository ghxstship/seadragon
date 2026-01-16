
import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  ZoomIn,
  ZoomOut,
  Users,
  AlertTriangle,
  Play,
  Square,
  Plus,
  Download
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { format, addDays, differenceInDays, startOfDay, isAfter, isBefore } from 'date-fns'

export interface GanttTask {
  id: string
  name: string
  startDate: Date
  endDate: Date
  progress: number // 0-100
  type: 'task' | 'milestone' | 'summary'
  assignee?: {
    id: string
    name: string
    avatar?: string
  }
  dependencies?: string[] // Task IDs this task depends on
  resources?: Array<{
    id: string
    name: string
    allocation: number // percentage 0-100
  }>
  color?: string
  critical?: boolean
}

export interface GanttResource {
  id: string
  name: string
  avatar?: string
  capacity: number // hours per day
  allocation: number // current allocation percentage
}

export interface GanttChartProps {
  tasks: GanttTask[]
  resources?: GanttResource[]
  startDate: Date
  endDate: Date
  onTaskUpdate?: (taskId: string, updates: Partial<GanttTask>) => void
  onTaskCreate?: (task: Omit<GanttTask, 'id'>) => void
  className?: string
}

const taskTypeConfig = {
  task: { icon: Square, color: 'bg-accent-primary', border: 'border-accent-primary' },
  milestone: { icon: AlertTriangle, color: 'bg-semantic-warning', border: 'border-semantic-warning' },
  summary: { icon: Play, color: 'bg-muted', border: 'border-muted' }
}

const GanttChart = ({
  tasks,
  resources = [],
  startDate,
  endDate,
  onTaskUpdate,
  onTaskCreate,
  className
}: GanttChartProps) => {
  const [zoom, setZoom] = useState(1) // 0.5 to 2
  const [selectedTask, setSelectedTask] = useState<GanttTask | null>(null)
  const [draggedTask, setDraggedTask] = useState<GanttTask | null>(null)
  const [dragOffset, setDragOffset] = useState(0)
  const [showTaskDialog, setShowTaskDialog] = useState(false)
  const [newTask, setNewTask] = useState<Partial<GanttTask>>({
    type: 'task',
    progress: 0
  })

  const chartRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)

  const dayWidth = 40 * zoom // pixels per day

  const criticalPath = useMemo(() => {
    // Simple critical path calculation - tasks with no slack
    const taskMap = new Map(tasks.map(t => [t.id, t]))
    return tasks.filter(task => {
      if (task.dependencies && task.dependencies.length > 0) {
        return task.dependencies.some(depId => {
          const depTask = taskMap.get(depId)
          return depTask && isAfter(task.startDate, depTask.endDate)
        })
      }
      return false
    })
  }, [tasks])

  const getTaskPosition = useCallback((task: GanttTask) => {
    const startOffset = differenceInDays(task.startDate, startDate)
    const duration = differenceInDays(task.endDate, task.startDate) + 1
    return {
      left: startOffset * dayWidth,
      width: Math.max(duration * dayWidth, 20) // minimum width
    }
  }, [startDate, dayWidth])

  const handleTaskDrag = useCallback((e: MouseEvent) => {
    if (!draggedTask || !timelineRef.current) return

    const rect = timelineRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left - dragOffset
    const daysOffset = Math.round(x / dayWidth)

    const newStartDate = addDays(draggedTask.startDate, daysOffset)
    const newEndDate = addDays(draggedTask.endDate, daysOffset)

    // Ensure dates are within bounds
    if (isBefore(newStartDate, startDate) || isAfter(newEndDate, endDate)) return

    onTaskUpdate?.(draggedTask.id, {
      startDate: newStartDate,
      endDate: newEndDate
    })
  }, [draggedTask, timelineRef, dragOffset, dayWidth, startDate, endDate, onTaskUpdate])

  const handleTaskDragEnd = () => {
    setDraggedTask(null)
    setDragOffset(0)
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => handleTaskDrag(e)
    const handleMouseUp = () => handleTaskDragEnd()

    if (draggedTask) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [draggedTask, handleTaskDrag])

  const renderTimeline = () => {
    const weeks = []
    let currentDate = startOfDay(startDate)

    while (isBefore(currentDate, endDate) || currentDate.getTime() === endDate.getTime()) {
      const weekStart = currentDate
      const weekEnd = addDays(weekStart, 6)
      weeks.push({ start: weekStart, end: weekEnd })
      currentDate = addDays(currentDate, 7)
    }

    return (
      <div className="flex border-b bg-muted/30">
        {weeks.map((week, index) => (
          <div
            key={index}
            className="flex border-r border-border"
            style={{ width: 7 * dayWidth }}
          >
            <div className="text-xs text-muted-foreground p-2 border-r border-border flex-1 text-center">
              {format(week.start, 'MMM d')}
            </div>
            {Array.from({ length: 7 }, (_, i) => {
              const date = addDays(week.start, i)
              const isToday = format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
              return (
                <div
                  key={i}
                  className={cn(
                    "text-xs text-muted-foreground p-2 flex-1 text-center border-r border-border/50",
                    isToday && "bg-accent-primary/10"
                  )}
                  style={{ width: dayWidth }}
                >
                  {format(date, 'd')}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    )
  }

  const renderTaskBar = (task: GanttTask, rowIndex: number) => {
    const position = getTaskPosition(task)
    const isCritical = criticalPath.some(t => t.id === task.id)
    const typeConfig = taskTypeConfig[task.type]
    const TypeIcon = typeConfig.icon

    return (
      <div
        key={task.id}
        className="absolute flex items-center"
        style={{
          left: position.left,
          top: rowIndex * 40 + 8,
          width: position.width,
          height: 24
        }}
      >
        {/* Dependency lines */}
        {task.dependencies?.map(depId => {
          const depTask = tasks.find(t => t.id === depId)
          if (!depTask) return null

          const depPosition = getTaskPosition(depTask)
          const depRowIndex = tasks.findIndex(t => t.id === depId)
          const startX = depPosition.left + depPosition.width
          const endX = position.left
          const startY = depRowIndex * 40 + 20
          const endY = rowIndex * 40 + 20

          return (
            <svg
              key={depId}
              className="absolute inset-0 pointer-events-none w-full h-full"
            >
              <path
                d={`M ${startX} ${startY} L ${endX - 10} ${startY} L ${endX - 10} ${endY} L ${endX} ${endY}`}
                stroke="currentColor"
                strokeWidth="1"
                fill="none"
                className="text-muted-foreground"/>
              <polygon
                points={`${endX},${endY - 3} ${endX},${endY + 3} ${endX + 6},${endY}`}
                fill="currentColor"
                className="text-muted-foreground"/>
            </svg>
          )
        })}

        {/* Task bar */}
        <div
          className={cn(
            "relative h-6 rounded cursor-pointer hover:opacity-80",
            typeConfig.color,
            typeConfig.border,
            "border",
            isCritical && "ring-2 ring-semantic-error/50",
            draggedTask?.id === task.id && "opacity-50 scale-105"
          )}
          onClick={() => onTaskUpdate?.(task.id, {})}
          title={`${task.name} (${format(task.startDate, 'MMM d')} - ${format(task.endDate, 'MMM d')})`}
        >
          {/* Progress bar */}
          <div
            className={cn(
              "absolute inset-0 bg-neutral-900/20 rounded",
              `w-[${task.progress}%]`
            )}/>

          <div className="absolute inset-0 flex items-center justify-between px-2">
            <TypeIcon className="w-3 h-3 text-primary-foreground"/>
            <span className="text-xs text-primary-foreground font-medium truncate">
              {task.name}
            </span>
            {task.assignee && (
              <div className="w-4 h-4 rounded-full bg-background/20 flex items-center justify-center">
                <span className="text-xs text-primary-foreground font-bold">
                  {task.assignee.name[0].toUpperCase()}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  const handleCreateTask = () => {
    if (newTask.name && newTask.startDate && newTask.endDate) {
      onTaskCreate?.(newTask as Omit<GanttTask, 'id'>)
      setNewTask({ type: 'task', progress: 0 })
      setShowTaskDialog(false)
    }
  }

  return (
    <div className={cn("w-full", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold">Gantt Chart</h2>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setZoom(Math.max(0.5, zoom - 0.2))}
              disabled={zoom <= 0.5}
            >
              <ZoomOut className="w-4 h-4"/>
            </Button>
            <span className="text-sm text-muted-foreground">{Math.round(zoom * 100)}%</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setZoom(Math.min(2, zoom + 0.2))}
              disabled={zoom >= 2}
            >
              <ZoomIn className="w-4 h-4"/>
            </Button>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2"/>
            Export
          </Button>
          <Button onClick={() => setShowTaskDialog(true)}>
            <Plus className="w-4 h-4 mr-2"/>
            Add Task
          </Button>
        </div>
      </div>

      {/* Resource Overview */}
      {resources.length > 0 && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Users className="w-5 h-5 mr-2"/>
              Resource Allocation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {resources.map(resource => {
                const taskAllocation = tasks.reduce((sum, task) => {
                  const taskResource = task.resources?.find(r => r.id === resource.id)
                  return sum + (taskResource?.allocation || 0)
                }, 0)
                const overallocation = taskAllocation > 100

                return (
                  <div key={resource.id} className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      {resource.avatar ? (
                        <Image
                          src={resource.avatar}
                          alt={resource.name}
                          width={32}
                          height={32}
                          className="w-full h-full rounded-full"/>
                      ) : (
                        <span className="text-sm font-medium">
                          {resource.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{resource.name}</div>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-muted rounded-full h-2">
                          <div
                            className={cn(
                              "h-full rounded-full transition-all",
                              `w-[${Math.min(taskAllocation, 100)}%]`,
                              overallocation ? "bg-semantic-error" : "bg-accent-primary"
                            )}/>
                        </div>
                        <span className={cn(
                          "text-xs",
                          overallocation ? "text-semantic-error" : "text-muted-foreground"
                        )}>
                          {Math.round(taskAllocation)}%
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Chart */}
      <Card>
        <CardContent className="p-0">
          <div className="flex">
            {/* Task List */}
            <div className="w-80 border-r bg-muted/30">
              <div className="p-4 border-b bg-background">
                <h3 className="font-semibold">Tasks</h3>
              </div>
              <div className="overflow-y-auto max-h-96">
                {tasks.map((task) => {
                  const isCritical = criticalPath.some(t => t.id === task.id)
                  const typeConfig = taskTypeConfig[task.type]
                  const TypeIcon = typeConfig.icon

                  return (
                    <div
                      key={task.id}
                      className={cn(
                        "flex items-center justify-between p-3 border-b hover:bg-muted/50 cursor-pointer h-10",
                        selectedTask?.id === task.id && "bg-accent-primary/10",
                        isCritical && "border-l-4 border-semantic-error"
                      )}
                      onClick={() => setSelectedTask(task)}
                    >
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <TypeIcon className={cn("w-4 h-4 flex-shrink-0", typeConfig.color.replace('bg-', 'text-'))}/>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium truncate">{task.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {format(task.startDate, 'MMM d')} - {format(task.endDate, 'MMM d')}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 flex-shrink-0">
                        {isCritical && (
                          <Badge variant="destructive" className="text-xs">
                            Critical
                          </Badge>
                        )}
                        <div className="text-xs text-muted-foreground">
                          {task.progress}%
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Timeline */}
            <div className="flex-1 overflow-x-auto" ref={chartRef}>
              <div ref={timelineRef} className="relative">
                {renderTimeline()}
                <div className="relative" style={{ height: tasks.length * 40 + 16 }}>
                  {tasks.map((task, index) => renderTaskBar(task, index))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Task Dialog */}
      <Dialog open={showTaskDialog} onOpenChange={setShowTaskDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
            <DialogDescription>
              Create a new task in the Gantt chart.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Task Name</label>
              <Input
                value={newTask.name || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTask(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter task name"/>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Start Date</label>
                <Input
                  type="date"
                  value={newTask.startDate ? format(newTask.startDate, 'yyyy-MM-dd') : ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTask(prev => ({
                    ...prev,
                    startDate: new Date(e.target.value)
                  }))}/>
              </div>
              <div>
                <label className="text-sm font-medium">End Date</label>
                <Input
                  type="date"
                  value={newTask.endDate ? format(newTask.endDate, 'yyyy-MM-dd') : ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTask(prev => ({
                    ...prev,
                    endDate: new Date(e.target.value)
                  }))}/>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Task Type</label>
              <Select
                value={newTask.type}
                onValueChange={(value: 'task' | 'milestone' | 'summary') =>
                  setNewTask(prev => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="task">Task</SelectItem>
                  <SelectItem value="milestone">Milestone</SelectItem>
                  <SelectItem value="summary">Summary</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTaskDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateTask} disabled={!newTask.name}>
              Create Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default GanttChart
