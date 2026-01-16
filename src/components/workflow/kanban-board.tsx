
import React, { useState, useCallback, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import {
  Plus,
  MoreVertical,
  Users,
  Clock,
  Flag,
  MessageSquare,
  Paperclip,
  Edit,
  Trash2,
  Move,
  Copy,
  User,
  AlertTriangle
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { colors } from '@/lib/design-system'
import { useDrag, useDrop, DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

export interface KanbanCard {
  id: string
  title: string
  description?: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  assignee?: {
    id: string
    name: string
    avatar?: string
  }
  labels?: Array<{
    id: string
    name: string
    color: string
  }>
  dueDate?: Date
  comments?: number
  attachments?: number
  swimlaneId?: string
}

export interface KanbanColumn {
  id: string
  title: string
  cards: KanbanCard[]
  wipLimit?: number
  color?: string
}

export interface KanbanSwimlane {
  id: string
  title: string
  color?: string
}

export interface KanbanBoardProps {
  columns: KanbanColumn[]
  swimlanes?: KanbanSwimlane[]
  onCardMove?: (cardId: string, fromColumnId: string, toColumnId: string, position?: number) => void
  onCardCreate?: (columnId: string, card: Omit<KanbanCard, 'id'>) => void
  onCardUpdate?: (cardId: string, updates: Partial<KanbanCard>) => void
  onCardDelete?: (cardId: string) => void
  onColumnCreate?: (column: Omit<KanbanColumn, 'id' | 'cards'>) => void
  onColumnUpdate?: (columnId: string, updates: Partial<KanbanColumn>) => void
  onColumnDelete?: (columnId: string) => void
  currentUserId?: string
  collaborators?: Array<{
    id: string
    name: string
    avatar?: string
    cursor?: { x: number; y: number; columnId?: string }
  }>
  className?: string
}

const priorityConfig = {
  low: { icon: Flag, color: 'text-muted-foreground', bg: 'bg-muted/50' },
  medium: { icon: Flag, color: 'text-semantic-info', bg: 'bg-semantic-info/10' },
  high: { icon: Flag, color: 'text-semantic-warning', bg: 'bg-semantic-warning/10' },
  urgent: { icon: AlertTriangle, color: 'text-semantic-error', bg: 'bg-semantic-error/10' }
}

const CardItem = ({ card, onUpdate, onDelete, currentUserId }: {
  card: KanbanCard
  onUpdate?: (cardId: string, updates: Partial<KanbanCard>) => void
  onDelete?: (cardId: string) => void
  currentUserId?: string
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'CARD',
    item: { id: card.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }))

  const priority = priorityConfig[card.priority]
  const PriorityIcon = priority.icon

  return (
    <Card
      ref={drag}
      className={cn(
        "cursor-move transition-all duration-200 hover:shadow-md",
        isDragging && "opacity-50 rotate-2 scale-105",
        "bg-background border-border"
      )}
    >
      <CardContent className="p-3">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <h4 className="text-sm font-medium leading-tight">{card.title}</h4>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <MoreVertical className="h-3 w-3"/>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onUpdate?.(card.id, {})}>
                  <Edit className="h-4 w-4 mr-2"/>
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onUpdate?.(card.id, {})}>
                  <Copy className="h-4 w-4 mr-2"/>
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDelete?.(card.id)}
                  className="text-semantic-error"
                >
                  <Trash2 className="h-4 w-4 mr-2"/>
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {card.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {card.description}
            </p>
          )}

          {card.labels && card.labels.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {card.labels.slice(0, 3).map((label) => (
                <Badge
                  key={label.id}
                  variant="secondary"
                  className="text-xs px-1.5 py-0.5"
                  style={{ backgroundColor: `${label.color}20`, color: label.color }}
                >
                  {label.name}
                </Badge>
              ))}
              {card.labels.length > 3 && (
                <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                  +{card.labels.length - 3}
                </Badge>
              )}
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <PriorityIcon className={cn("h-3 w-3", priority.color)}/>
              {card.dueDate && (
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3"/>
                  <span>{new Date(card.dueDate).toLocaleDateString()}</span>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-1">
              {card.comments && card.comments > 0 && (
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  <MessageSquare className="h-3 w-3"/>
                  <span>{card.comments}</span>
                </div>
              )}
              {card.attachments && card.attachments > 0 && (
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  <Paperclip className="h-3 w-3"/>
                  <span>{card.attachments}</span>
                </div>
              )}
              {card.assignee && (
                <Avatar className="h-5 w-5">
                  <AvatarImage src={card.assignee.avatar}/>
                  <AvatarFallback className="text-xs">
                    {card.assignee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const Column = ({
  column,
  onCardMove,
  onCardCreate,
  onCardUpdate,
  onCardDelete,
  onColumnUpdate,
  swimlaneId
}: {
  column: KanbanColumn
  onCardMove?: (cardId: string, fromColumnId: string, toColumnId: string, position?: number) => void
  onCardCreate?: (columnId: string, card: Omit<KanbanCard, 'id'>) => void
  onCardUpdate?: (cardId: string, updates: Partial<KanbanCard>) => void
  onCardDelete?: (cardId: string) => void
  onColumnUpdate?: (columnId: string, updates: Partial<KanbanColumn>) => void
  swimlaneId?: string
}) => {
  const [newCardTitle, setNewCardTitle] = useState('')
  const [showAddCard, setShowAddCard] = useState(false)

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'CARD',
    drop: (item: { id: string }) => {
      onCardMove?.(item.id, '', column.id)
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }))

  const handleAddCard = () => {
    if (newCardTitle.trim()) {
      onCardCreate?.(column.id, {
        title: newCardTitle.trim(),
        priority: 'medium',
        swimlaneId
      })
      setNewCardTitle('')
      setShowAddCard(false)
    }
  }

  const isWipLimitExceeded = column.wipLimit && column.cards.length > column.wipLimit

  return (
    <div
      ref={drop}
      className={cn(
        "flex flex-col w-80 bg-muted/30 rounded-lg p-4 space-y-3 min-h-[600px]",
        isOver && "ring-2 ring-accent-primary/50 bg-accent-primary/5",
        isWipLimitExceeded && "ring-2 ring-semantic-error/50"
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h3 className="font-semibold text-sm">{column.title}</h3>
          <Badge variant="secondary" className="text-xs">
            {column.cards.length}
            {column.wipLimit && `/${column.wipLimit}`}
          </Badge>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <MoreVertical className="h-3 w-3"/>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setShowAddCard(true)}>
              <Plus className="h-4 w-4 mr-2"/>
              Add Card
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onColumnUpdate?.(column.id, {})}>
              <Edit className="h-4 w-4 mr-2"/>
              Edit Column
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {isWipLimitExceeded && (
        <div className="flex items-center space-x-2 text-xs text-semantic-error bg-semantic-error/10 p-2 rounded">
          <AlertTriangle className="h-3 w-3"/>
          <span>WIP limit exceeded</span>
        </div>
      )}

      <div className="flex-1 space-y-2 overflow-y-auto">
        {column.cards.map((card) => (
          <CardItem
            key={card.id}
            card={card}
            onUpdate={onCardUpdate}
            onDelete={onCardDelete}/>
        ))}
      </div>

      {showAddCard ? (
        <div className="space-y-2">
          <Textarea
            placeholder="Enter card title..."
            value={newCardTitle}
            onChange={(e) => setNewCardTitle(e.target.value)}
            className="min-h-[60px] text-sm"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleAddCard()
              }
              if (e.key === 'Escape') {
                setShowAddCard(false)
                setNewCardTitle('')
              }
            }}/>
          <div className="flex items-center space-x-2">
            <Button size="sm" onClick={handleAddCard} disabled={!newCardTitle.trim()}>
              Add Card
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setShowAddCard(false)
                setNewCardTitle('')
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-foreground"
          onClick={() => setShowAddCard(true)}
        >
          <Plus className="h-4 w-4 mr-2"/>
          Add a card
        </Button>
      )}
    </div>
  )
}

const Swimlane = ({
  swimlane,
  columns,
  onCardMove,
  onCardCreate,
  onCardUpdate,
  onCardDelete,
  onColumnUpdate
}: {
  swimlane: KanbanSwimlane
  columns: KanbanColumn[]
  onCardMove?: (cardId: string, fromColumnId: string, toColumnId: string, position?: number) => void
  onCardCreate?: (columnId: string, card: Omit<KanbanCard, 'id'>) => void
  onCardUpdate?: (cardId: string, updates: Partial<KanbanCard>) => void
  onCardDelete?: (cardId: string) => void
  onColumnUpdate?: (columnId: string, updates: Partial<KanbanColumn>) => void
}) => {
  const filteredColumns = columns.map(column => ({
    ...column,
    cards: column.cards.filter(card => card.swimlaneId === swimlane.id)
  }))

  return (
    <div className="mb-6">
      <div className="flex items-center space-x-2 mb-4">
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: swimlane.color || colors.primary[500] }}/>
        <h4 className="font-medium text-sm">{swimlane.title}</h4>
      </div>
      <div className="flex space-x-4 overflow-x-auto pb-4">
        {filteredColumns.map((column) => (
          <Column
            key={column.id}
            column={column}
            onCardMove={onCardMove}
            onCardCreate={onCardCreate}
            onCardUpdate={onCardUpdate}
            onCardDelete={onCardDelete}
            onColumnUpdate={onColumnUpdate}
            swimlaneId={swimlane.id}/>
        ))}
      </div>
    </div>
  )
}

export function KanbanBoard({
  columns,
  swimlanes,
  onCardMove,
  onCardCreate,
  onCardUpdate,
  onCardDelete,
  onColumnCreate,
  onColumnUpdate,
  onColumnDelete,
  currentUserId,
  collaborators = [],
  className
}: KanbanBoardProps) {
  const [newColumnTitle, setNewColumnTitle] = useState('')
  const [showAddColumn, setShowAddColumn] = useState(false)

  const handleAddColumn = () => {
    if (newColumnTitle.trim()) {
      onColumnCreate?.({
        title: newColumnTitle.trim(),
        cards: []
      })
      setNewColumnTitle('')
      setShowAddColumn(false)
    }
  }

  const boardColumns = swimlanes && swimlanes.length > 0
    ? columns.map(column => ({
        ...column,
        cards: column.cards.filter(card => !card.swimlaneId)
      }))
    : columns

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={cn("w-full", className)}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold">Kanban Board</h2>
            {collaborators.length > 0 && (
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-muted-foreground"/>
                <div className="flex -space-x-2">
                  {collaborators.slice(0, 3).map((user) => (
                    <Avatar key={user.id} className="h-6 w-6 border-2 border-background">
                      <AvatarImage src={user.avatar}/>
                      <AvatarFallback className="text-xs">
                        {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  {collaborators.length > 3 && (
                    <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs">
                      +{collaborators.length - 3}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <Button onClick={() => setShowAddColumn(true)}>
            <Plus className="h-4 w-4 mr-2"/>
            Add Column
          </Button>
        </div>

        {/* Swimlanes or Columns */}
        <div className="space-y-6">
          {swimlanes && swimlanes.length > 0 ? (
            swimlanes.map((swimlane) => (
              <Swimlane
                key={swimlane.id}
                swimlane={swimlane}
                columns={columns}
                onCardMove={onCardMove}
                onCardCreate={onCardCreate}
                onCardUpdate={onCardUpdate}
                onCardDelete={onCardDelete}
                onColumnUpdate={onColumnUpdate}/>
            ))
          ) : (
            <div className="flex space-x-4 overflow-x-auto pb-4">
              {boardColumns.map((column) => (
                <Column
                  key={column.id}
                  column={column}
                  onCardMove={onCardMove}
                  onCardCreate={onCardCreate}
                  onCardUpdate={onCardUpdate}
                  onCardDelete={onCardDelete}
                  onColumnUpdate={onColumnUpdate}/>
              ))}
            </div>
          )}
        </div>

        {/* Add Column Dialog */}
        <Dialog open={showAddColumn} onOpenChange={setShowAddColumn}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Column</DialogTitle>
              <DialogDescription>
                Create a new column to organize your tasks.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Column Title</label>
                <Input
                  value={newColumnTitle}
                  onChange={(e) => setNewColumnTitle(e.target.value)}
                  placeholder="e.g., To Do, In Progress, Done"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAddColumn()
                    }
                  }}/>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddColumn(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddColumn} disabled={!newColumnTitle.trim()}>
                Add Column
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Collaborator Cursors */}
        {collaborators.map((user) => (
          user.cursor && (
            <div
              key={user.id}
              className="fixed pointer-events-none z-50 transition-all duration-100"
              style={{
                left: user.cursor.x,
                top: user.cursor.y,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <div className="flex items-center space-x-2 bg-background border rounded-lg px-2 py-1 shadow-lg">
                <Avatar className="h-4 w-4">
                  <AvatarImage src={user.avatar}/>
                  <AvatarFallback className="text-xs">
                    {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs font-medium">{user.name}</span>
              </div>
            </div>
          )
        ))}
      </div>
    </DndProvider>
  )
}

export default KanbanBoard

// Export types for external usage
export type { KanbanCard, KanbanColumn, KanbanSwimlane, KanbanBoardProps }
