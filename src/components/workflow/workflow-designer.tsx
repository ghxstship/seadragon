
import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Play,
  Square,
  Circle,
  Diamond,
  Hexagon,
  ArrowRight,
  Settings,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Save,
  Download,
  Upload,
  Copy,
  Trash2,
  Edit,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Plus,
  Minus
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useDrag, useDrop, DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

export interface WorkflowNode {
  id: string
  type: 'start' | 'task' | 'decision' | 'process' | 'end' | 'subprocess'
  label: string
  position: { x: number; y: number }
  properties: Record<string, any>
  connections: string[] // IDs of connected nodes
  isValid?: boolean
  errors?: string[]
}

export interface WorkflowConnection {
  id: string
  fromNodeId: string
  toNodeId: string
  label?: string
  condition?: string
  style?: 'solid' | 'dashed' | 'dotted'
}

export interface WorkflowTemplate {
  id: string
  name: string
  description?: string
  nodes: WorkflowNode[]
  connections: WorkflowConnection[]
  category?: string
}

interface WorkflowImportData {
  nodes?: WorkflowNode[]
  connections?: WorkflowConnection[]
  template?: WorkflowTemplate
  format?: 'json' | 'xml' | 'yaml'
  metadata?: {
    name?: string
    description?: string
    version?: string
    author?: string
  }
}

export interface WorkflowDesignerProps {
  nodes?: WorkflowNode[]
  connections?: WorkflowConnection[]
  templates?: WorkflowTemplate[]
  onNodeAdd?: (node: Omit<WorkflowNode, 'id'>) => void
  onNodeUpdate?: (nodeId: string, updates: Partial<WorkflowNode>) => void
  onNodeDelete?: (nodeId: string) => void
  onConnectionAdd?: (connection: Omit<WorkflowConnection, 'id'>) => void
  onConnectionDelete?: (connectionId: string) => void
  onSave?: (nodes: WorkflowNode[], connections: WorkflowConnection[]) => void
  onValidate?: (nodes: WorkflowNode[], connections: WorkflowConnection[]) => void
  onExport?: (format: 'json' | 'xml' | 'yaml') => void
  onImport?: (data: WorkflowImportData) => void
  readOnly?: boolean
  className?: string
}

const nodeTypeConfig = {
  start: {
    icon: Play,
    color: 'bg-semantic-success',
    border: 'border-semantic-success',
    label: 'Start'
  },
  task: {
    icon: Square,
    color: 'bg-accent-primary',
    border: 'border-accent-primary',
    label: 'Task'
  },
  decision: {
    icon: Diamond,
    color: 'bg-semantic-warning',
    border: 'border-semantic-warning',
    label: 'Decision'
  },
  process: {
    icon: Circle,
    color: 'bg-semantic-info',
    border: 'border-semantic-info',
    label: 'Process'
  },
  subprocess: {
    icon: Hexagon,
    color: 'bg-muted',
    border: 'border-muted',
    label: 'Subprocess'
  },
  end: {
    icon: Square,
    color: 'bg-semantic-error',
    border: 'border-semantic-error',
    label: 'End'
  }
}

// Separate component to fix React hooks rules - hooks cannot be called inside callbacks
const DraggableNodeItem = ({
  type,
  config,
  readOnly,
  onNodeAdd
}: {
  type: string
  config: { icon: React.ComponentType<{ className?: string }>; color: string; label: string }
  readOnly?: boolean
  onNodeAdd?: (node: Omit<WorkflowNode, 'id'>) => void
}) => {
  const [{ isDragging: nodeDragging }, nodeDrag] = useDrag(() => ({
    type: 'NODE_TYPE',
    item: { nodeType: type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }))

  const Icon = config.icon

  return (
    <div
      ref={nodeDrag as any}
      className={cn(
        "flex items-center space-x-3 p-3 rounded-lg border cursor-move hover:bg-muted/50 transition-colors",
        nodeDragging && "opacity-50",
        readOnly && "cursor-not-allowed opacity-50"
      )}
      onClick={() => !readOnly && onNodeAdd?.({
        type: type as WorkflowNode['type'],
        label: config.label,
        position: { x: 100, y: 100 },
        properties: {},
        connections: []
      })}
    >
      <div className={cn(
        "w-8 h-8 rounded flex items-center justify-center",
        config.color
      )}>
        <Icon className="w-4 h-4 text-primary-foreground"/>
      </div>
      <span className="text-sm font-medium">{config.label}</span>
    </div>
  )
}

const NodePalette = ({
  onNodeAdd,
  readOnly
}: {
  onNodeAdd?: (node: Omit<WorkflowNode, 'id'>) => void
  readOnly?: boolean
}) => {
  return (
    <Card className="w-64">
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Settings className="w-5 h-5 mr-2"/>
          Node Palette
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {Object.entries(nodeTypeConfig).map(([type, config]) => (
            <DraggableNodeItem
              key={type}
              type={type}
              config={config}
              readOnly={readOnly}
              onNodeAdd={onNodeAdd}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

const WorkflowNode = ({
  node,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  readOnly,
  canvasRef
}: {
  node: WorkflowNode
  isSelected: boolean
  onSelect: (node: WorkflowNode) => void
  onUpdate?: (nodeId: string, updates: Partial<WorkflowNode>) => void
  onDelete?: (nodeId: string) => void
  readOnly?: boolean
  canvasRef: React.RefObject<HTMLDivElement>
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'WORKFLOW_NODE',
    item: { nodeId: node.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }))

  const config = nodeTypeConfig[node.type]
  const Icon = config.icon

  return (
    <div
      ref={drag}
      className={cn(
        "absolute flex items-center justify-center w-20 h-12 rounded-lg border-2 cursor-move transition-all",
        config.color,
        config.border,
        isSelected && "ring-2 ring-accent-primary",
        isDragging && "opacity-50 scale-105",
        !node.isValid && "ring-2 ring-semantic-error",
        readOnly && "cursor-default"
      )}
      style={{
        left: node.position.x,
        top: node.position.y,
        transform: 'translate(-50%, -50%)'
      }}
      onClick={() => onSelect(node)}
    >
      <Icon className="w-5 h-5 text-primary-foreground mr-1"/>
      <span className="text-xs text-primary-foreground font-medium truncate max-w-12">
        {node.label}
      </span>

      {/* Connection Points */}
      <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-background rounded-full border border-neutral-300"/>
      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-background rounded-full border border-neutral-300"/>
      <div className="absolute top-1/2 -left-1 transform -translate-y-1/2 w-2 h-2 bg-background rounded-full border border-neutral-300"/>
      <div className="absolute top-1/2 -right-1 transform -translate-y-1/2 w-2 h-2 bg-background rounded-full border border-neutral-300"/>

      {/* Validation Indicator */}
      {!node.isValid && (
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-semantic-error rounded-full flex items-center justify-center">
          <AlertTriangle className="w-2 h-2 text-primary-foreground"/>
        </div>
      )}
    </div>
  )
}

const WorkflowConnection = ({
  connection,
  nodes,
  onDelete
}: {
  connection: WorkflowConnection
  nodes: WorkflowNode[]
  onDelete?: (connectionId: string) => void
}) => {
  const fromNode = nodes.find(n => n.id === connection.fromNodeId)
  const toNode = nodes.find(n => n.id === connection.toNodeId)

  if (!fromNode || !toNode) return null

  const startX = fromNode.position.x
  const startY = fromNode.position.y
  const endX = toNode.position.x
  const endY = toNode.position.y

  // Calculate control points for curved connection
  const midX = (startX + endX) / 2
  const midY = (startY + endY) / 2
  const dx = endX - startX
  const dy = endY - startY
  const distance = Math.sqrt(dx * dx + dy * dy)
  const curvature = Math.min(distance * 0.3, 100)

  const cp1x = startX + curvature
  const cp1y = startY
  const cp2x = endX - curvature
  const cp2y = endY

  const pathData = `M ${startX} ${startY} C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${endX} ${endY}`

  return (
    <g>
      <path
        d={pathData}
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        className={cn(
          "text-muted-foreground",
          connection.style === 'dashed' && "stroke-dasharray-4",
          connection.style === 'dotted' && "stroke-dasharray-2"
        )}
        markerEnd="url(#arrowhead)"/>
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon
            points="0 0, 10 3.5, 0 7"
            fill="currentColor"
            className="text-muted-foreground"/>
        </marker>
      </defs>

      {/* Connection Label */}
      {connection.label && (
        <text
          x={midX}
          y={midY - 10}
          textAnchor="middle"
          className="text-xs fill-current text-muted-foreground"
        >
          {connection.label}
        </text>
      )}

      {/* Delete Button */}
      {onDelete && (
        <circle
          cx={midX}
          cy={midY}
          r="8"
          fill="white"
          stroke="currentColor"
          strokeWidth="1"
          className="cursor-pointer text-muted-foreground hover:text-semantic-error"
          onClick={() => onDelete(connection.id)}/>
      )}
    </g>
  )
}

const PropertyPanel = ({
  selectedNode,
  onUpdate,
  onClose
}: {
  selectedNode: WorkflowNode | null
  onUpdate?: (nodeId: string, updates: Partial<WorkflowNode>) => void
  onClose: () => void
}) => {
  const [properties, setProperties] = useState<Record<string, any>>({})

  useEffect(() => {
    if (selectedNode) {
      setProperties(selectedNode.properties)
    }
  }, [selectedNode])

  const handleSave = () => {
    if (selectedNode) {
      onUpdate?.(selectedNode.id, { properties })
    }
  }

  if (!selectedNode) return null

  return (
    <Card className="w-80">
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          <span>Node Properties</span>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <XCircle className="w-4 h-4"/>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="label">Label</Label>
          <Input
            id="label"
            value={selectedNode.label}
            onChange={(e) => onUpdate?.(selectedNode.id, { label: e.target.value })}/>
        </div>

        <div>
          <Label htmlFor="type">Type</Label>
          <Select
            value={selectedNode.type}
            onValueChange={(value) => onUpdate?.(selectedNode.id, { type: value as WorkflowNode['type'] })}
          >
            <SelectTrigger>
              <SelectValue/>
            </SelectTrigger>
            <SelectContent>
              {Object.entries(nodeTypeConfig).map(([type, config]) => (
                <SelectItem key={type} value={type}>
                  {config.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={properties.description || ''}
            onChange={(e) => setProperties(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Enter node description"/>
        </div>

        {/* Additional Properties based on node type */}
        {selectedNode.type === 'task' && (
          <div>
            <Label htmlFor="assignee">Assignee</Label>
            <Input
              id="assignee"
              value={properties.assignee || ''}
              onChange={(e) => setProperties(prev => ({ ...prev, assignee: e.target.value }))}
              placeholder="Assign to user"/>
          </div>
        )}

        {selectedNode.type === 'decision' && (
          <div>
            <Label htmlFor="condition">Condition</Label>
            <Textarea
              id="condition"
              value={properties.condition || ''}
              onChange={(e) => setProperties(prev => ({ ...prev, condition: e.target.value }))}
              placeholder="Enter decision condition"/>
          </div>
        )}

        <Button onClick={handleSave} className="w-full">
          Save Properties
        </Button>
      </CardContent>
    </Card>
  )
}

export function WorkflowDesigner({
  nodes = [],
  connections = [],
  templates = [],
  onNodeAdd,
  onNodeUpdate,
  onNodeDelete,
  onConnectionAdd,
  onConnectionDelete,
  onSave,
  onValidate,
  onExport,
  onImport,
  readOnly = false,
  className
}: WorkflowDesignerProps) {
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectionStart, setConnectionStart] = useState<string | null>(null)
  const [showTemplates, setShowTemplates] = useState(false)

  const canvasRef = useRef<HTMLDivElement>(null)

  const [{ isOver }, drop] = useDrop(() => ({
    accept: ['NODE_TYPE', 'WORKFLOW_NODE'],
    drop: (item, monitor) => {
      if (readOnly) return

      const offset = monitor.getSourceClientOffset()
      const canvasRect = canvasRef.current?.getBoundingClientRect()

      if (offset && canvasRect) {
        const x = (offset.x - canvasRect.left - pan.x) / zoom
        const y = (offset.y - canvasRect.top - pan.y) / zoom

        if (item.nodeType) {
          // Adding new node from palette
          const config = nodeTypeConfig[item.nodeType as keyof typeof nodeTypeConfig]
          onNodeAdd?.({
            type: item.nodeType,
            label: config.label,
            position: { x, y },
            properties: {},
            connections: []
          })
        }
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }))

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current) {
      setSelectedNode(null)
    }
  }

  const handleNodeSelect = (node: WorkflowNode) => {
    setSelectedNode(node)
  }

  const validateWorkflow = useCallback(() => {
    const updatedNodes = nodes.map(node => {
      const errors: string[] = []

      // Basic validation rules
      if (!node.label.trim()) {
        errors.push('Node must have a label')
      }

      // Check for isolated nodes (except start/end)
      if (node.type !== 'start' && node.type !== 'end') {
        const hasIncoming = connections.some(c => c.toNodeId === node.id)
        const hasOutgoing = connections.some(c => c.fromNodeId === node.id)

        if (!hasIncoming) {
          errors.push('Node has no incoming connections')
        }
        if (!hasOutgoing) {
          errors.push('Node has no outgoing connections')
        }
      }

      return {
        ...node,
        isValid: errors.length === 0,
        errors
      }
    })

    onValidate?.(updatedNodes, connections)
  }, [nodes, connections, onValidate])

  useEffect(() => {
    validateWorkflow()
  }, [validateWorkflow])

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={cn("h-full flex", className)}>
        {/* Left Sidebar */}
        <div className="w-80 border-r bg-muted/30 p-4 space-y-4">
          <Tabs defaultValue="palette" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="palette">Palette</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
            </TabsList>

            <TabsContent value="palette">
              <NodePalette onNodeAdd={onNodeAdd} readOnly={readOnly}/>
            </TabsContent>

            <TabsContent value="templates">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Templates</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96">
                    <div className="space-y-2">
                      {templates.map(template => (
                        <div
                          key={template.id}
                          className="p-3 rounded-lg border cursor-pointer hover:bg-muted/50"
                          onClick={() => {
                            // Load template logic would go here
                          }}
                        >
                          <div className="font-medium">{template.name}</div>
                          {template.description && (
                            <div className="text-sm text-muted-foreground mt-1">
                              {template.description}
                            </div>
                          )}
                          <Badge variant="secondary" className="text-xs mt-2">
                            {template.category || 'General'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Main Canvas */}
        <div className="flex-1 flex flex-col">
          {/* Toolbar */}
          <div className="border-b p-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-semibold">Workflow Designer</h2>
              <Badge variant="outline">
                {nodes.length} nodes, {connections.length} connections
              </Badge>
            </div>

            <div className="flex items-center space-x-2">
              {/* Zoom Controls */}
              <div className="flex items-center border rounded-md">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setZoom(Math.max(0.25, zoom - 0.25))}
                  disabled={zoom <= 0.25}
                >
                  <ZoomOut className="w-4 h-4"/>
                </Button>
                <span className="px-3 text-sm">{Math.round(zoom * 100)}%</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setZoom(Math.min(2, zoom + 0.25))}
                  disabled={zoom >= 2}
                >
                  <ZoomIn className="w-4 h-4"/>
                </Button>
              </div>

              {/* Action Buttons */}
              <Button variant="outline" size="sm" onClick={validateWorkflow}>
                <CheckCircle className="w-4 h-4 mr-2"/>
                Validate
              </Button>

              {!readOnly && (
                <>
                  <Button variant="outline" size="sm" onClick={() => onSave?.(nodes, connections)}>
                    <Save className="w-4 h-4 mr-2"/>
                    Save
                  </Button>

                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2"/>
                    Export
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 overflow-hidden relative">
            <div
              ref={drop}
              className={cn(
                "w-full h-full relative overflow-hidden cursor-crosshair",
                isOver && "bg-accent-primary/5"
              )}
              style={{
                backgroundImage: 'radial-gradient(circle, #e5e7eb 1px, transparent 1px)',
                backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
                backgroundPosition: `${pan.x}px ${pan.y}px`
              }}
            >
              <div
                ref={canvasRef}
                className="w-full h-full relative"
                style={{
                  transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                  transformOrigin: '0 0'
                }}
                onClick={handleCanvasClick}
              >
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {connections.map(connection => (
                    <WorkflowConnection
                      key={connection.id}
                      connection={connection}
                      nodes={nodes}
                      onDelete={readOnly ? undefined : onConnectionDelete}/>
                  ))}
                </svg>

                {nodes.map(node => (
                  <WorkflowNode
                    key={node.id}
                    node={node}
                    isSelected={selectedNode?.id === node.id}
                    onSelect={handleNodeSelect}
                    onUpdate={onNodeUpdate}
                    onDelete={onNodeDelete}
                    readOnly={readOnly}
                    canvasRef={canvasRef}/>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Properties */}
        {selectedNode && (
          <div className="w-80 border-l bg-muted/30 p-4">
            <PropertyPanel
              selectedNode={selectedNode}
              onUpdate={onNodeUpdate}
              onClose={() => setSelectedNode(null)}/>
          </div>
        )}
      </div>
    </DndProvider>
  )
}

export default WorkflowDesigner
