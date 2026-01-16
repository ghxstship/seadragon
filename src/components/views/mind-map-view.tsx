
import { useState, useRef, useCallback, useMemo } from 'react'
import { logger } from '@/lib/logger'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Plus,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Move,
  Trash2
} from 'lucide-react'

type Assignee = {
  id: string
  name: string
  avatar?: string
}

interface MindMapViewProps {
  tasks: Array<{
    id: string
    title: string
    description?: string
    priority: 'urgent' | 'high' | 'normal' | 'low'
    assignees: Array<{
      id: string
      name: string
      avatar?: string
    }>
    dueDate?: Date
    startDate?: Date
    parentId?: string
    dependencies?: Array<{
      id: string
      title: string
      type: 'blocks' | 'blocked_by'
    }>
    customFields?: Array<{
      id: string
      label: string
      value: string | number | boolean
      type: 'text' | 'number' | 'date' | 'select' | 'checkbox'
    }>
    tags?: string[]
    subtasks?: Array<{
      id: string
      title: string
      completed: boolean
    }>
  }>
  onTaskClick?: (taskId: string) => void
  onTaskUpdate?: (taskId: string, updates: Partial<{
    title?: string
    description?: string
    priority?: 'urgent' | 'high' | 'normal' | 'low'
    assignees?: Array<{
      id: string
      name: string
      avatar?: string
    }>
    dueDate?: Date
    startDate?: Date
    parentId?: string
    dependencies?: Array<{
      id: string
      title: string
      type: 'blocks' | 'blocked_by'
    }>
    customFields?: Array<{
      id: string
      label: string
      value: string | number | boolean
      type: 'text' | 'number' | 'date' | 'select' | 'checkbox'
    }>
    tags?: string[]
    subtasks?: Array<{
      id: string
      title: string
      completed: boolean
    }>
  }>) => void
  onCreateTask?: (parentId?: string) => void
  onDeleteTask?: (taskId: string) => void
  isGuest?: boolean
}

interface Node {
  id: string
  x: number
  y: number
  task: {
    id: string
    title: string
    description?: string
    priority: 'urgent' | 'high' | 'normal' | 'low'
    assignees: Array<{
      id: string
      name: string
      avatar?: string
    }>
    dueDate?: Date
    startDate?: Date
    parentId?: string
    dependencies?: Array<{
      id: string
      title: string
      type: 'blocks' | 'blocked_by'
    }>
    customFields?: Array<{
      id: string
      label: string
      value: string | number | boolean
      type: 'text' | 'number' | 'date' | 'select' | 'checkbox'
    }>
    tags?: string[]
    subtasks?: Array<{
      id: string
      title: string
      completed: boolean
    }>
  }
  children: Node[]
  parent?: Node
}

const statusColors = {
  in_progress: 'bg-accent-primary/10 border-blue-300',
  review: 'bg-semantic-warning/10 border-orange-300',
  done: 'bg-semantic-success/10 border-green-300',
}

const priorityColors = {
  urgent: 'ring-red-400',
  high: 'ring-orange-400',
  normal: 'ring-blue-400',
  low: 'ring-neutral-400',
}

export function MindMapView({
  tasks,
  onTaskClick,
  onCreateTask,
  onDeleteTask,
  isGuest = false
}: MindMapViewProps) {
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [draggedNode, setDraggedNode] = useState<string | null>(null)
  const [isPanning, setIsPanning] = useState(false)
  const canvasRef = useRef<HTMLDivElement>(null)

  // Build mind map tree structure
  const mindMapTree = useMemo(() => {
    const nodes = new Map<string, Node>()

    // Create nodes
    tasks.forEach(task => {
      nodes.set(task.id, {
        id: task.id,
        x: 0,
        y: 0,
        task,
        children: []
      })
    })

    // Build hierarchy
    tasks.forEach(task => {
      if (task.parentId) {
        const parentNode = nodes.get(task.parentId)
        const childNode = nodes.get(task.id)
        if (parentNode && childNode) {
          parentNode.children.push(childNode)
          childNode.parent = parentNode
        }
      }
    })

    // Find root nodes (no parent)
    const rootNodes = Array.from(nodes.values()).filter(node => !node.parent)

    // Position nodes
    const positionNode = (node: Node, startX: number, startY: number, level = 0) => {
      node.x = startX
      node.y = startY

      if (node.children.length > 0) {
        const childSpacing = 120
        const totalWidth = (node.children.length - 1) * childSpacing
        const startChildX = startX - totalWidth / 2

        node.children.forEach((child, index) => {
          const childX = startChildX + index * childSpacing
          const childY = startY + 150
          positionNode(child, childX, childY, level + 1)
        })
      }
    }

    // Position all root nodes
    rootNodes.forEach((root, index) => {
      const startX = index * 300
      positionNode(root, startX, 0)
    })

    return Array.from(nodes.values())
  }, [tasks])

  const handleZoom = useCallback((delta: number) => {
    setZoom(prev => Math.max(0.1, Math.min(3, prev + delta)))
  }, [])

  const handlePan = useCallback((deltaX: number, deltaY: number) => {
    setPan(prev => ({ x: prev.x + deltaX, y: prev.y + deltaY }))
  }, [])

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.altKey)) { // Middle mouse or Alt+click
      setIsPanning(true)
      e.preventDefault()
    }
  }

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      handlePan(e.movementX, e.movementY)
    }
  }

  const handleCanvasMouseUp = () => {
    setIsPanning(false)
  }

  const handleNodeDragStart = (nodeId: string, e: React.DragEvent) => {
    setDraggedNode(nodeId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleNodeDragEnd = () => {
    setDraggedNode(null)
  }

  const handleNodeDrop = (nodeId: string, e: React.DragEvent) => {
    e.preventDefault()
    if (draggedNode && draggedNode !== nodeId) {
      // In a real implementation, this would update the parent relationship
      logger.action('move_node', { draggedNode, targetNode: nodeId })
    }
  }

  const renderNode = (node: Node) => {
    const isSelected = selectedNode === node.id
    const isDragged = draggedNode === node.id

    return (
      <div
        key={node.id}
        className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all ${
          isDragged ? 'opacity-50 scale-105' : 'hover:scale-105'
        }`}
        style={{
          left: `${pan.x + node.x * zoom}px`,
          top: `${pan.y + node.y * zoom}px`,
          transform: `scale(${zoom}) translate(-50%, -50%)`,
        }}
        onClick={() => {
          setSelectedNode(isSelected ? null : node.id)
          onTaskClick?.(node.id)
        }}
        draggable={!isGuest}
        onDragStart={(e) => handleNodeDragStart(node.id, e)}
        onDragEnd={handleNodeDragEnd}
        onDrop={(e) => handleNodeDrop(node.id, e)}
        onDragOver={(e) => e.preventDefault()}
      >
        {/* Node Card */}
        <div
          className={`p-3 rounded-lg border-2 shadow-sm min-w-32 max-w-48 ${
            statusColors[node.task.status as keyof typeof statusColors]
          } ${isSelected ? 'ring-2 ring-accent-primary' : ''} ${
            priorityColors[node.task.priority as keyof typeof priorityColors]
          }`}
        >
          <div className="text-sm font-medium mb-1 truncate" title={node.task.title}>
            {node.task.title}
          </div>

          <div className="flex items-center justify-between text-xs">
            <Badge variant="outline" className="text-xs">
              {node.task.status.replace('_', ' ')}
            </Badge>
            <span className={`capitalize ${
              node.task.priority === 'urgent' ? 'text-semantic-error' :
              node.task.priority === 'high' ? 'text-semantic-warning' :
              node.task.priority === 'normal' ? 'text-accent-secondary' : 'text-neutral-600'
            }`}>
              {node.task.priority}
            </span>
          </div>

          {node.task.assignees.length > 0 && (
            <div className="flex -space-x-1 mt-2">
              {node.task.assignees.slice(0, 3).map((assignee: Assignee) => (
                <div
                  key={assignee.id}
                  className="w-5 h-5 rounded-full bg-neutral-200 border border-white flex items-center justify-center text-xs"
                  title={assignee.name}
                >
                  {assignee.name.split(' ').map((n: string) => n[0]).join('')}
                </div>
              ))}
            </div>
          )}

          {/* Action buttons on hover */}
          <div className={`absolute -top-2 -right-2 flex space-x-1 opacity-0 hover:opacity-100 transition-opacity ${
            isSelected ? 'opacity-100' : ''
          }`}>
            {!isGuest && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-6 w-6 p-0"
                  onClick={(e) => {
                    e.stopPropagation()
                    onCreateTask?.(node.id)
                  }}
                >
                  <Plus className="w-3 h-3"/>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-6 w-6 p-0"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDeleteTask?.(node.id)
                  }}
                >
                  <Trash2 className="w-3 h-3"/>
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Connection lines to children */}
        {node.children.map((child) => (
          <svg
            key={child.id}
            className="absolute top-0 left-0 pointer-events-none"
            style={{
              width: `${Math.abs(child.x - node.x) * zoom}px`,
              height: `${Math.abs(child.y - node.y) * zoom}px`,
              left: child.x > node.x ? '100%' : `${(child.x - node.x) * zoom}px`,
              top: child.y > node.y ? '100%' : `${(child.y - node.y) * zoom}px`,
            }}
          >
            <path
              d={`M 0 ${child.y > node.y ? 0 : '100%'} Q ${Math.abs(child.x - node.x) * zoom / 2} ${Math.abs(child.y - node.y) * zoom / 2} ${child.x > node.x ? Math.abs(child.x - node.x) * zoom : 0} ${child.y > node.y ? Math.abs(child.y - node.y) * zoom : 0}`}
              stroke="#d1d5db"
              strokeWidth="2"
              fill="none"/>
          </svg>
        ))}
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-background border-b border-neutral-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Mind Map</h2>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => handleZoom(-0.1)}>
              <ZoomOut className="w-4 h-4"/>
            </Button>
            <span className="text-sm text-neutral-600">{Math.round(zoom * 100)}%</span>
            <Button variant="outline" size="sm" onClick={() => handleZoom(0.1)}>
              <ZoomIn className="w-4 h-4"/>
            </Button>
            <Button variant="outline" size="sm" onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }) }}>
              <RotateCcw className="w-4 h-4"/>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onCreateTask?.()}
              disabled={isGuest}
            >
              <Plus className="w-4 h-4 mr-1"/>
              New Task
            </Button>
          </div>
        </div>

        <div className="text-sm text-neutral-600">
          {tasks.length} tasks • Drag nodes to reorganize • Click + to add subtasks
        </div>
      </div>

      {/* Mind Map Canvas */}
      <div
        ref={canvasRef}
        className={`flex-1 relative overflow-hidden bg-neutral-50 ${
          isPanning ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        onMouseDown={handleCanvasMouseDown}
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleCanvasMouseUp}
        onMouseLeave={handleCanvasMouseUp}
      >
        {/* Grid background */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(to right, #e5e7eb 1px, transparent 1px),
              linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
            `,
            backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
            backgroundPosition: `${pan.x}px ${pan.y}px`,
          }}/>

        {/* Render all nodes */}
        {mindMapTree.map(renderNode)}

        {/* Instructions overlay for empty state */}
        {tasks.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-neutral-200 flex items-center justify-center">
                <Move className="w-8 h-8 text-neutral-400"/>
              </div>
              <h3 className="text-lg font-medium text-neutral-900 mb-2">Create Your Mind Map</h3>
              <p className="text-neutral-600 mb-4 max-w-md">
                Start by creating tasks. Drag them to create relationships and build your project&apos;s visual structure.
              </p>
              {!isGuest && (
                <Button onClick={() => onCreateTask?.()}>
                  <Plus className="w-4 h-4 mr-1"/>
                  Create First Task
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
