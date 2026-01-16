
import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import {
  Building2,
  Briefcase,
  Folder,
  Calendar,
  Settings,
  Users,
  CheckSquare,
  ChevronRight,
  Home,
  Plus,
  Search,
  Filter
} from 'lucide-react'

// Hierarchy levels
export type HierarchyLevel = 'organization' | 'workspace' | 'project' | 'event' | 'component' | 'task' | 'subtask'

export interface HierarchyItem {
  id: string
  name: string
  type: HierarchyLevel
  parentId?: string
  children?: HierarchyItem[]
  metadata?: {
    status?: string
    priority?: string
    dueDate?: Date
    assignees?: Array<{ id: string; name: string }>
    progress?: number
    color?: string
  }
}

interface HierarchyNavigationProps {
  currentPath: HierarchyItem[]
  availableItems: Record<HierarchyLevel, HierarchyItem[]>
  onNavigate?: (item: HierarchyItem) => void
  onCreateItem?: (type: HierarchyLevel, parentId?: string) => void
  onSearch?: (query: string, level: HierarchyLevel) => void
  isGuest?: boolean
}

const levelIcons = {
  organization: Building2,
  workspace: Briefcase,
  project: Folder,
  event: Calendar,
  component: Settings,
  task: CheckSquare,
  subtask: CheckSquare
}

const levelColors = {
  organization: 'text-accent-primary',
  workspace: 'text-accent-secondary',
  project: 'text-semantic-success',
  event: 'text-semantic-warning',
  component: 'text-semantic-error',
  task: 'text-neutral-600',
  subtask: 'text-neutral-500'
}

export function HierarchyNavigation({
  currentPath,
  availableItems,
  onNavigate,
  onCreateItem,
  onSearch,
  isGuest = false
}: HierarchyNavigationProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLevel, setSelectedLevel] = useState<HierarchyLevel>('organization')

  const currentItem = currentPath[currentPath.length - 1]
  const parentItem = currentPath[currentPath.length - 2]

  const filteredItems = useMemo(() => {
    const items = availableItems[selectedLevel] || []
    if (!searchQuery) return items

    return items.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [availableItems, selectedLevel, searchQuery])

  const getLevelLabel = (level: HierarchyLevel): string => {
    switch (level) {
      case 'organization': return 'Organizations'
      case 'workspace': return 'Workspaces'
      case 'project': return 'Projects'
      case 'event': return 'Events'
      case 'component': return 'Components'
      case 'task': return 'Tasks'
      case 'subtask': return 'Subtasks'
      default: return level
    }
  }

  const canCreateAtLevel = (level: HierarchyLevel): boolean => {
    return !isGuest && ['workspace', 'project', 'event', 'component', 'task', 'subtask'].includes(level)
  }

  const renderBreadcrumb = () => {
    if (currentPath.length === 0) return null

    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" className="flex items-center">
              <Home className="w-4 h-4 mr-1"/>
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>

          {currentPath.map((item, index) => {
            const Icon = levelIcons[item.type]
            const isLast = index === currentPath.length - 1

            return (
              <div key={item.id} className="flex items-center">
                <BreadcrumbSeparator/>
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage className="flex items-center">
                      <Icon className={`w-4 h-4 mr-1 ${levelColors[item.type]}`}/>
                      {item.name}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink
                      className="flex items-center cursor-pointer hover:text-accent-primary"
                      onClick={() => onNavigate?.(item)}
                    >
                      <Icon className={`w-4 h-4 mr-1 ${levelColors[item.type]}`}/>
                      {item.name}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </div>
            )
          })}
        </BreadcrumbList>
      </Breadcrumb>
    )
  }

  const renderLevelSelector = () => {
    const levels: HierarchyLevel[] = ['organization', 'workspace', 'project', 'event', 'component', 'task', 'subtask']

    return (
      <div className="flex items-center space-x-2 mb-4">
        <span className="text-sm font-medium text-neutral-700">Navigate to:</span>
        <div className="flex space-x-1">
          {levels.map((level) => {
            const Icon = levelIcons[level]
            const isActive = selectedLevel === level
            const hasItems = availableItems[level]?.length > 0

            return (
              <Button
                key={level}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedLevel(level)}
                disabled={!hasItems}
                className="flex items-center space-x-1"
              >
                <Icon className={`w-3 h-3 ${isActive ? 'text-primary-foreground' : levelColors[level]}`}/>
                <span className="hidden sm:inline">{getLevelLabel(level)}</span>
                {availableItems[level]?.length > 0 && (
                  <Badge variant="secondary" className="text-xs ml-1">
                    {availableItems[level].length}
                  </Badge>
                )}
              </Button>
            )
          })}
        </div>
      </div>
    )
  }

  const renderItemCard = (item: HierarchyItem) => {
    const Icon = levelIcons[item.type]
    const hasChildren = item.children && item.children.length > 0

    return (
      <div
        key={item.id}
        className="p-4 border border-neutral-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer bg-background"
        onClick={() => onNavigate?.(item)}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${item.metadata?.color || 'bg-neutral-100'}`}>
              <Icon className={`w-5 h-5 ${levelColors[item.type]}`}/>
            </div>
            <div>
              <h3 className="font-medium text-neutral-900">{item.name}</h3>
              <p className="text-sm text-neutral-600 capitalize">{item.type}</p>
            </div>
          </div>

          {hasChildren && (
            <div className="flex items-center space-x-1">
              <Badge variant="outline" className="text-xs">
                {item.children!.length} items
              </Badge>
              <ChevronRight className="w-4 h-4 text-neutral-400"/>
            </div>
          )}
        </div>

        {/* Metadata */}
        {item.metadata && (
          <div className="space-y-2">
            {item.metadata.status && (
              <Badge variant="outline" className="text-xs">
                {item.metadata.status}
              </Badge>
            )}

            {item.metadata.priority && (
              <Badge variant="secondary" className="text-xs">
                {item.metadata.priority}
              </Badge>
            )}

            {item.metadata.dueDate && (
              <div className="text-xs text-neutral-500">
                Due: {item.metadata.dueDate.toLocaleDateString()}
              </div>
            )}

            {item.metadata.progress !== undefined && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-neutral-600">
                  <span>Progress</span>
                  <span>{item.metadata.progress}%</span>
                </div>
                <div className="w-full bg-neutral-200 rounded-full h-1.5">
                  <div
                    className="bg-accent-primary h-1.5 rounded-full transition-all"
                    style={{ width: `${item.metadata.progress}%` }}/>
                </div>
              </div>
            )}

            {item.metadata.assignees && item.metadata.assignees.length > 0 && (
              <div className="flex items-center space-x-1">
                <Users className="w-3 h-3 text-neutral-500"/>
                <div className="flex -space-x-1">
                  {item.metadata.assignees.slice(0, 3).map((assignee) => (
                    <div
                      key={assignee.id}
                      className="w-6 h-6 rounded-full bg-neutral-200 border border-white flex items-center justify-center text-xs"
                      title={assignee.name}
                    >
                      {assignee.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  ))}
                  {item.metadata.assignees.length > 3 && (
                    <div className="w-6 h-6 rounded-full bg-neutral-300 border border-white flex items-center justify-center text-xs">
                      +{item.metadata.assignees.length - 3}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-100">
          <Button variant="ghost" size="sm" className="text-xs">
            View Details
          </Button>

          {!isGuest && canCreateAtLevel(item.type) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-xs">
                  <Plus className="w-3 h-3 mr-1"/>
                  Create
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Create New</DropdownMenuLabel>
                <DropdownMenuSeparator/>
                {item.type === 'organization' && (
                  <DropdownMenuItem onClick={() => onCreateItem?.('workspace', item.id)}>
                    New Workspace
                  </DropdownMenuItem>
                )}
                {item.type === 'workspace' && (
                  <DropdownMenuItem onClick={() => onCreateItem?.('project', item.id)}>
                    New Project
                  </DropdownMenuItem>
                )}
                {item.type === 'project' && (
                  <DropdownMenuItem onClick={() => onCreateItem?.('event', item.id)}>
                    New Event
                  </DropdownMenuItem>
                )}
                {item.type === 'event' && (
                  <DropdownMenuItem onClick={() => onCreateItem?.('component', item.id)}>
                    New Component
                  </DropdownMenuItem>
                )}
                {item.type === 'component' && (
                  <DropdownMenuItem onClick={() => onCreateItem?.('task', item.id)}>
                    New Task
                  </DropdownMenuItem>
                )}
                {item.type === 'task' && (
                  <DropdownMenuItem onClick={() => onCreateItem?.('subtask', item.id)}>
                    New Subtask
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-neutral-50">
      {/* Header with Breadcrumbs */}
      <div className="bg-background border-b border-neutral-200 p-4">
        {renderBreadcrumb()}
      </div>

      {/* Navigation Controls */}
      <div className="bg-background border-b border-neutral-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Hierarchy Navigation</h2>

          {!isGuest && canCreateAtLevel(selectedLevel) && (
            <Button onClick={() => onCreateItem?.(selectedLevel)}>
              <Plus className="w-4 h-4 mr-1"/>
              Create {getLevelLabel(selectedLevel).slice(0, -1)}
            </Button>
          )}
        </div>

        {/* Search */}
        <div className="flex items-center space-x-4 mb-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400"/>
            <Input
              type="text"
              placeholder={`Search ${getLevelLabel(selectedLevel).toLowerCase()}...`}
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-primary focus:border-transparent"/>
          </div>

          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-1"/>
            Filters
          </Button>
        </div>

        {/* Level Selector */}
        {renderLevelSelector()}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-200 flex items-center justify-center">
              {(() => {
                const Icon = levelIcons[selectedLevel]
                return <Icon className={`w-8 h-8 ${levelColors[selectedLevel]}`}/>
              })()}
            </div>
            <h3 className="text-lg font-medium text-neutral-900 mb-2">
              No {getLevelLabel(selectedLevel).toLowerCase()} found
            </h3>
            <p className="text-neutral-600 mb-4 max-w-md">
              {searchQuery
                ? `No ${getLevelLabel(selectedLevel).toLowerCase()} match your search for "${searchQuery}".`
                : `Get started by creating your first ${getLevelLabel(selectedLevel).slice(0, -1).toLowerCase()}.`
              }
            </p>
            {!isGuest && canCreateAtLevel(selectedLevel) && (
              <Button onClick={() => onCreateItem?.(selectedLevel)}>
                <Plus className="w-4 h-4 mr-1"/>
                Create {getLevelLabel(selectedLevel).slice(0, -1)}
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map(renderItemCard)}
          </div>
        )}
      </div>
    </div>
  )
}
