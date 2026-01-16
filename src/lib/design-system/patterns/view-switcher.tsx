'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import {
  Table,
  List,
  Kanban,
  Calendar,
  GitBranch,
  GalleryHorizontal,
  Map,
  FormInput,
  BarChart3,
  MoreHorizontal,
  Check
} from 'lucide-react'

export type ViewType =
  | 'table'
  | 'list'
  | 'board'
  | 'calendar'
  | 'timeline'
  | 'gallery'
  | 'map'
  | 'form'
  | 'analytics'

interface ViewOption {
  id: ViewType
  label: string
  icon: React.ComponentType<{ className?: string }>
  description: string
}

const viewOptions: ViewOption[] = [
  {
    id: 'table',
    label: 'Table',
    icon: Table,
    description: 'Spreadsheet-style view with columns and rows'
  },
  {
    id: 'list',
    label: 'List',
    icon: List,
    description: 'Simple vertical list of items'
  },
  {
    id: 'board',
    label: 'Board',
    icon: Kanban,
    description: 'Kanban-style board with columns and cards'
  },
  {
    id: 'calendar',
    label: 'Calendar',
    icon: Calendar,
    description: 'Calendar view with date-based layout'
  },
  {
    id: 'timeline',
    label: 'Timeline',
    icon: GitBranch,
    description: 'Gantt chart timeline view'
  },
  {
    id: 'gallery',
    label: 'Gallery',
    icon: GalleryHorizontal,
    description: 'Grid layout with image thumbnails'
  },
  {
    id: 'map',
    label: 'Map',
    icon: Map,
    description: 'Geographic map view'
  },
  {
    id: 'form',
    label: 'Form',
    icon: FormInput,
    description: 'Form-based data entry view'
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: BarChart3,
    description: 'Dashboard with charts and metrics'
  }
]

interface ViewSwitcherProps {
  currentView: ViewType
  availableViews?: ViewType[]
  onViewChange: (view: ViewType) => void
  className?: string
}

export function ViewSwitcher({
  currentView,
  availableViews = ['table', 'list', 'board', 'calendar'],
  onViewChange,
  className
}: ViewSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false)

  const filteredViews = viewOptions.filter(v => availableViews.includes(v.id))

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`gap-2 ${className}`}
        >
          {currentViewOption && (
            <>
              <currentViewOption.icon className="h-4 w-4" />
              {currentViewOption.label}
            </>
          )}
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {filteredViews.map((view) => {
          const Icon = view.icon
          const isSelected = view.id === currentView

          return (
            <DropdownMenuItem
              key={view.id}
              onClick={() => {
                onViewChange(view.id)
                setIsOpen(false)
              }}
              className="flex items-center gap-3 cursor-pointer"
            >
              <Icon className="h-4 w-4" />
              <div className="flex flex-col flex-1">
                <span className="font-medium">{view.label}</span>
                <span className="text-xs text-muted-foreground">{view.description}</span>
              </div>
              {isSelected && <Check className="h-4 w-4 text-primary" />}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Compact version for toolbar use
export function CompactViewSwitcher({
  currentView,
  availableViews = ['table', 'list', 'board', 'calendar'],
  onViewChange,
  className
}: ViewSwitcherProps) {
  const currentViewOption = viewOptions.find(v => v.id === currentView)
  const filteredViews = viewOptions.filter(v => availableViews.includes(v.id))

  return (
    <div className={`flex items-center border rounded-md ${className}`}>
      {filteredViews.map((view, index) => {
        const Icon = view.icon
        const isSelected = view.id === currentView

        return (
          <div key={view.id} className="flex">
            {index > 0 && <div className="w-px h-6 bg-border" />}
            <Button
              variant={isSelected ? "secondary" : "ghost"}
              size="sm"
              onClick={() => onViewChange(view.id)}
              className="rounded-none border-0 h-8 px-3"
            >
              <Icon className="h-4 w-4" />
              <span className="sr-only">{view.label}</span>
            </Button>
          </div>
        )
      })}
    </div>
  )
}
