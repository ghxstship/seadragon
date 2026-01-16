
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Plus,
  Search,
  SlidersHorizontal,
  Eye,
  Settings,
  X
} from 'lucide-react'

type ViewUpdate = {
  filters?: Record<string, string | number | boolean | null | undefined>
  sorting?: { field: string; direction: 'asc' | 'desc' }
  grouping?: string
  isPinned?: boolean
  isPrivate?: boolean
}

interface ViewsBarProps {
  currentView: string
  availableViews: Array<{
    id: string
    name: string
    type: 'list' | 'board' | 'calendar' | 'table' | 'timeline' | 'mindmap' | 'map' | 'activity'
    isPinned?: boolean
    isPrivate?: boolean
  }>
  onViewChange?: (viewId: string) => void
  onCreateView?: (type: string) => void
  onPinView?: (viewId: string, pinned: boolean) => void
  onUpdateView?: (viewId: string, updates: ViewUpdate) => void
  // Page-level command bar props
  searchQuery?: string
  onSearchChange?: (query: string) => void
  availableFilters?: Array<{
    id: string
    name: string
    type: 'text' | 'select' | 'date' | 'boolean' | 'number'
    options?: Array<{ label: string; value: string }>
  }>
  availableSortFields?: Array<{
    id: string
    name: string
    type: 'string' | 'number' | 'date'
  }>
  activeFilters?: Record<string, unknown>
  activeSorting?: { field: string; direction: 'asc' | 'desc' } | null
  activeGrouping?: string
  onAdvancedFilterChange?: (filters: Record<string, unknown>) => void
  onAdvancedSortChange?: (sorting: { field: string; direction: 'asc' | 'desc' } | null) => void
  onAdvancedGroupChange?: (grouping: string) => void
  onClearFilters?: () => void
  onSaveFilterPreset?: (name: string, filters: Record<string, unknown>) => void
  filterPresets?: Array<{ id: string; name: string; filters: Record<string, unknown> }>
  // Additional actions
  onCreateRecord?: () => void
  onImport?: () => void
  onExport?: () => void
  onScan?: () => void
  onToggleFieldVisibility?: (fieldId: string, visible: boolean) => void
  availableFields?: Array<{
    id: string
    name: string
    visible: boolean
  }>
  isGuest?: boolean
}

const viewIcons = {
  list: () => <span></span>,
  board: () => <span></span>,
  calendar: () => <span></span>,
  table: () => <span></span>,
  timeline: () => <span></span>,
  mindmap: () => <span></span>,
  map: () => <span>️</span>,
  activity: () => <span></span>,
}

export function ViewsBar({
  currentView,
  availableViews,
  onViewChange,
  searchQuery = '',
  onSearchChange,
  availableFilters = [],
  availableSortFields = [],
  activeFilters = {},
  activeSorting = null,
  activeGrouping = '',
  onAdvancedFilterChange,
  onAdvancedSortChange,
  onAdvancedGroupChange,
  onClearFilters,
  onSaveFilterPreset,
  filterPresets = [],
  onCreateRecord,
  onImport,
  onExport,
  onScan,
  onToggleFieldVisibility,
  availableFields,
  isGuest = false
}: ViewsBarProps) {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery)
  const [localFilters, setLocalFilters] = useState<Record<string, unknown>>(activeFilters)
  const [localSorting, setLocalSorting] = useState<{ field: string; direction: 'asc' | 'desc' } | null>(activeSorting)
  const [localGrouping, setLocalGrouping] = useState<string>(activeGrouping)

  const handleSearchChange = (query: string) => {
    setLocalSearchQuery(query)
    onSearchChange?.(query)
  }

  const handleAdvancedFilterChange = (key: string, value: unknown) => {
    const newFilters = { ...localFilters, [key]: value }
    if (!value || value === 'all' || value === '') {
      delete newFilters[key]
    }
    setLocalFilters(newFilters)
    onAdvancedFilterChange?.(newFilters)
  }

  const handleAdvancedSortChange = (field: string) => {
    const direction = localSorting?.field === field && localSorting.direction === 'asc' ? 'desc' : 'asc'
    const sorting = { field, direction: direction as 'asc' | 'desc' }
    setLocalSorting(sorting)
    onAdvancedSortChange?.(sorting)
  }

  const handleAdvancedGroupChange = (grouping: string) => {
    setLocalGrouping(grouping)
    onAdvancedGroupChange?.(grouping)
  }

  const handleRemoveFilter = (key: string) => {
    const newFilters = { ...localFilters }
    delete newFilters[key]
    setLocalFilters(newFilters)
    onAdvancedFilterChange?.(newFilters)
  }

  const handleClearAllFilters = () => {
    setLocalFilters({})
    setLocalSorting(null)
    setLocalGrouping('')
    onClearFilters?.()
  }

  const activeFilterCount = Object.keys(localFilters).length + (localSorting ? 1 : 0) + (localGrouping ? 1 : 0)

  return (
    <div className="bg-background border-b border-neutral-200 px-4 py-3 space-y-3">
      {/* Top Row - Search and Quick Actions */}
      <div className="flex items-center justify-between">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400"/>
            <Input
              placeholder="Search records..."
              value={localSearchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"/>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center space-x-2">
          {/* View/Hide Fields */}
          {availableFields && availableFields.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Eye className="w-4 h-4"/>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>View/Hide Fields</DropdownMenuLabel>
                <DropdownMenuSeparator/>
                {availableFields.map((field) => (
                  <DropdownMenuCheckboxItem
                    key={field.id}
                    checked={field.visible}
                    onCheckedChange={(checked) => onToggleFieldVisibility?.(field.id, checked)}
                  >
                    {field.name}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Create Record */}
          {!isGuest && onCreateRecord && (
            <Button variant="outline" size="sm" onClick={onCreateRecord}>
              <Plus className="w-4 h-4 mr-1"/>
              Create
            </Button>
          )}

          {/* More Actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4"/>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>More Actions</DropdownMenuLabel>
              <DropdownMenuSeparator/>
              {!isGuest && onImport && (
                <DropdownMenuItem onClick={onImport}>
                  Import Data
                </DropdownMenuItem>
              )}
              {onExport && (
                <DropdownMenuItem onClick={onExport}>
                  Export Data
                </DropdownMenuItem>
              )}
              {onScan && (
                <DropdownMenuItem onClick={onScan}>
                  Scan (QR/Barcode/RFID)
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Bottom Row - Advanced Controls and View Switcher */}
      <div className="flex items-center justify-between">
        {/* Left Side - Advanced Controls */}
        <div className="flex items-center space-x-2">
          {/* Advanced Filters */}
          <Popover open={showAdvancedFilters} onOpenChange={setShowAdvancedFilters}>
            <PopoverTrigger asChild>
              <Button
                variant={activeFilterCount > 0 ? "default" : "outline"}
                size="sm"
                className="flex items-center space-x-2"
              >
                <SlidersHorizontal className="w-4 h-4"/>
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Advanced Filters</h4>
                  <Button variant="ghost" size="sm" onClick={handleClearAllFilters}>
                    Clear All
                  </Button>
                </div>

                {/* Filter Options */}
                <div className="space-y-3">
                  {availableFilters.map((filter) => (
                    <div key={filter.id} className="space-y-2">
                      <label className="text-sm font-medium">{filter.name}</label>
                      {filter.type === 'select' && filter.options ? (
                        <Select
                          value={(localFilters[filter.id] as string) || ''}
                          onValueChange={(value) => handleAdvancedFilterChange(filter.id, value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={`Select ${filter.name.toLowerCase()}`}/>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">All</SelectItem>
                            {filter.options.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : filter.type === 'boolean' ? (
                        <Select
                          value={(localFilters[filter.id] as string) || ''}
                          onValueChange={(value) => handleAdvancedFilterChange(filter.id, value === 'true')}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={`Select ${filter.name.toLowerCase()}`}/>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">All</SelectItem>
                            <SelectItem value="true">Yes</SelectItem>
                            <SelectItem value="false">No</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          placeholder={`Filter by ${filter.name.toLowerCase()}`}
                          value={(localFilters[filter.id] as string) || ''}
                          onChange={(e) => handleAdvancedFilterChange(filter.id, e.target.value)}/>
                      )}
                    </div>
                  ))}
                </div>

                {/* Sort Options */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sort By</label>
                  <Select
                    value={localSorting?.field || ''}
                    onValueChange={(field) => field ? handleAdvancedSortChange(field) : onAdvancedSortChange?.(null)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="No sorting"/>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No sorting</SelectItem>
                      {availableSortFields.map((field) => (
                        <SelectItem key={field.id} value={field.id}>
                          {field.name} {localSorting?.field === field.id && (localSorting.direction === 'asc' ? '↑' : '↓')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Group Options */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Group By</label>
                  <Select
                    value={localGrouping}
                    onValueChange={handleAdvancedGroupChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="No grouping"/>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No grouping</SelectItem>
                      <SelectItem value="status">Status</SelectItem>
                      <SelectItem value="priority">Priority</SelectItem>
                      <SelectItem value="assignee">Assignee</SelectItem>
                      <SelectItem value="project">Project</SelectItem>
                      <SelectItem value="date">Date</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Save Filter Preset */}
                {!isGuest && onSaveFilterPreset && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      const name = prompt('Save filter preset as:')
                      if (name) {
                        onSaveFilterPreset(name, localFilters)
                      }
                    }}
                  >
                    Save as Preset
                  </Button>
                )}
              </div>
            </PopoverContent>
          </Popover>

          {/* Filter Presets */}
          {filterPresets.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Presets
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Filter Presets</DropdownMenuLabel>
                <DropdownMenuSeparator/>
                {filterPresets.map((preset) => (
                  <DropdownMenuItem
                    key={preset.id}
                    onClick={() => onAdvancedFilterChange?.(preset.filters)}
                  >
                    {preset.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Right Side - Contextual Filter Pills and View Switcher */}
        <div className="flex items-center space-x-2">
          {/* Contextual Filter Pills */}
          {Object.keys(localFilters).length > 0 && (
            <div className="flex items-center space-x-1">
              {Object.entries(localFilters).map(([key, value]) => {
                const filter = availableFilters.find(f => f.id === key)
                const displayValue = filter?.options?.find(o => o.value === value)?.label || String(value)
                return (
                  <Badge key={key} variant="secondary" className="flex items-center space-x-1">
                    <span className="text-xs">
                      {filter?.name || key}: {displayValue}
                    </span>
                    <X
                      className="w-3 h-3 cursor-pointer hover:text-semantic-error"
                      onClick={() => handleRemoveFilter(key)}/>
                  </Badge>
                )
              })}
            </div>
          )}

          {/* View Switcher */}
          <Select value={currentView} onValueChange={onViewChange}>
            <SelectTrigger className="w-40">
              <SelectValue/>
            </SelectTrigger>
            <SelectContent>
              {availableViews.map((view) => {
                const IconComponent = viewIcons[view.type]
                return (
                  <SelectItem key={view.id} value={view.id}>
                    <div className="flex items-center space-x-2">
                      <IconComponent/>
                      <span>{view.name}</span>
                    </div>
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
