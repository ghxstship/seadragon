
import React, { useState, useCallback, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  Search,
  Filter,
  X,
  Save,
  Bookmark,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react'
import { cn } from '@/lib/utils'

export type SearchFilterValue = 
  | { type: 'text'; value?: string }
  | { type: 'select'; value?: string }
  | { type: 'multiselect'; value?: string[] }
  | { type: 'number'; value?: number }
  | { type: 'date'; value?: Date }
  | { type: 'daterange'; value?: { start?: Date; end?: Date } }
  | { type: 'boolean'; value?: boolean }

export interface SearchFilter {
  id: string
  label: string
  type: SearchFilterValue['type']
  value?: SearchFilterValue['value']
  options?: Array<{ value: string; label: string }>
  placeholder?: string
  min?: number
  max?: number
}

export interface SavedFilter {
  id: string
  name: string
  filters: SearchFilter[]
  isDefault?: boolean
  createdAt: Date
}

export interface SearchFilterBarProps {
  searchValue?: string
  onSearchChange?: (value: string) => void
  searchPlaceholder?: string

  filters?: SearchFilter[]
  onFilterChange?: (filterId: string, value?: SearchFilterValue['value']) => void

  savedFilters?: SavedFilter[]
  onSaveFilter?: (name: string, filters: SearchFilter[]) => void
  onLoadFilter?: (filter: SavedFilter) => void

  resultCount?: number
  totalCount?: number
  onClearAll?: () => void

  showAdvancedFilters?: boolean
  onToggleAdvanced?: () => void

  className?: string
}

const SearchFilterBar = ({
  searchValue = '',
  onSearchChange,
  searchPlaceholder = 'Search...',

  filters = [],
  onFilterChange,

  savedFilters = [],
  onSaveFilter,
  onLoadFilter,

  resultCount,
  totalCount,
  onClearAll,

  showAdvancedFilters = false,
  onToggleAdvanced,

  className
}: SearchFilterBarProps) => {
  const [localSearchValue, setLocalSearchValue] = useState(searchValue)
  const [saveDialogOpen, setSaveDialogOpen] = useState(false)
  const [newFilterName, setNewFilterName] = useState('')
  const [showSavedFilters, setShowSavedFilters] = useState(false)

  const handleSearchChange = useCallback((value: string) => {
    setLocalSearchValue(value)
    onSearchChange?.(value)
  }, [onSearchChange])

  const handleFilterChange = useCallback((filterId: string, value: SearchFilterValue['value']) => {
    onFilterChange?.(filterId, value)
  }, [onFilterChange])

  const handleSaveFilter = useCallback(() => {
    if (newFilterName.trim() && filters.length > 0) {
      onSaveFilter?.(newFilterName.trim(), filters)
      setNewFilterName('')
      setSaveDialogOpen(false)
    }
  }, [newFilterName, filters, onSaveFilter])

  const handleLoadFilter = useCallback((filter: SavedFilter) => {
    onLoadFilter?.(filter)
    setShowSavedFilters(false)
  }, [onLoadFilter])

  const activeFiltersCount = useMemo(() => {
    return filters.filter(filter => {
      if (filter.type === 'text' || filter.type === 'number') {
        return filter.value && filter.value.toString().trim() !== ''
      }
      if (filter.type === 'select') {
        return filter.value && filter.value !== ''
      }
      if (filter.type === 'multiselect') {
        return filter.value && Array.isArray(filter.value) && filter.value.length > 0
      }
      if (filter.type === 'boolean') {
        return filter.value !== undefined && filter.value !== null
      }
      if (filter.type === 'date' || filter.type === 'daterange') {
        return filter.value
      }
      return false
    }).length
  }, [filters])

  const renderFilterControl = (filter: SearchFilter) => {
    switch (filter.type) {
      case 'text':
        return (
          <Input
            value={(filter.value as string) || ''}
            onChange={(e) => handleFilterChange(filter.id, e.target.value)}
            placeholder={filter.placeholder || `Enter ${filter.label}`}
            className="w-full"/>
        )

      case 'select':
        return (
          <Select
            value={(filter.value as string) || ''}
            onValueChange={(value) => handleFilterChange(filter.id, value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={filter.placeholder || `Select ${filter.label}`}/>
            </SelectTrigger>
            <SelectContent>
              {filter.options?.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      case 'multiselect':
        return (
          <Select
            value={Array.isArray(filter.value) ? filter.value.join(',') : ''}
            onValueChange={(value) => handleFilterChange(filter.id, value ? value.split(',') : [])}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={filter.placeholder || `Select ${filter.label}`}/>
            </SelectTrigger>
            <SelectContent>
              {filter.options?.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      case 'number':
        return (
          <Input
            type="number"
            value={(filter.value as number)?.toString() || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFilterChange(filter.id, parseFloat(e.target.value) || 0)}
            placeholder={filter.placeholder || `Enter ${filter.label}`}
            min={filter.min}
            max={filter.max}
            className="w-full"/>
        )

      case 'boolean':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={Boolean(filter.value)}
              onCheckedChange={(checked) => handleFilterChange(filter.id, Boolean(checked))}/>
            <label className="text-sm font-medium">{filter.label}</label>
          </div>
        )

      case 'date':
        return (
          <Input
            type="date"
            value={filter.value instanceof Date ? filter.value.toISOString().split('T')[0] : ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFilterChange(filter.id, e.target.value ? new Date(e.target.value) : undefined)}
            className="w-full"/>
        )

      case 'daterange':
        const rangeValue = filter.value && typeof filter.value === 'object' && 'start' in filter.value && 'end' in filter.value
          ? filter.value as { start?: Date; end?: Date }
          : { start: undefined, end: undefined }

        return (
          <div className="flex space-x-2">
            <Input
              type="date"
              value={rangeValue.start ? rangeValue.start.toISOString().split('T')[0] : ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleFilterChange(filter.id, {
                  ...rangeValue,
                  start: e.target.value ? new Date(e.target.value) : undefined
                })
              }
              placeholder="From"
              className="flex-1"/>
            <Input
              type="date"
              value={rangeValue.end ? rangeValue.end.toISOString().split('T')[0] : ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleFilterChange(filter.id, {
                  ...rangeValue,
                  end: e.target.value ? new Date(e.target.value) : undefined
                })
              }
              placeholder="To"
              className="flex-1"/>
          </div>
        )

      default:
        return null
    }
  }

  const activeFilterChips = filters.filter(filter => {
    if (filter.type === 'text' || filter.type === 'number') {
      return filter.value && filter.value.toString().trim() !== ''
    }
    if (filter.type === 'select') {
      return filter.value && filter.value !== ''
    }
    if (filter.type === 'multiselect') {
      return filter.value && Array.isArray(filter.value) && filter.value.length > 0
    }
    if (filter.type === 'boolean') {
      return filter.value !== undefined && filter.value !== null
    }
    if (filter.type === 'date' || filter.type === 'daterange') {
      return filter.value
    }
    return false
  })

  return (
    <div className={cn("w-full space-y-4", className)}>
      {/* Main Search Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4"/>
              <Input
                value={localSearchValue}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder={searchPlaceholder}
                className="pl-10"/>
            </div>

            {/* Filter Toggle */}
            {filters.length > 0 && (
              <Button
                variant="outline"
                onClick={onToggleAdvanced}
                className="flex items-center space-x-2"
              >
                <Filter className="w-4 h-4"/>
                <span>Filters</span>
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {activeFiltersCount}
                  </Badge>
                )}
                <ChevronDown className={cn("w-4 h-4 transition-transform", showAdvancedFilters && "rotate-180")}/>
              </Button>
            )}

            {/* Saved Filters */}
            {savedFilters.length > 0 && (
              <DropdownMenu open={showSavedFilters} onOpenChange={setShowSavedFilters}>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Bookmark className="w-4 h-4 mr-2"/>
                    Saved Filters
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Saved Filters</DropdownMenuLabel>
                  <DropdownMenuSeparator/>
                  {savedFilters.map(filter => (
                    <DropdownMenuItem
                      key={filter.id}
                      onClick={() => handleLoadFilter(filter)}
                      className="flex items-center justify-between"
                    >
                      <span>{filter.name}</span>
                      {filter.isDefault && (
                        <Badge variant="secondary" className="text-xs">Default</Badge>
                      )}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator/>
                  <DropdownMenuItem onClick={() => setSaveDialogOpen(true)}>
                    <Save className="w-4 h-4 mr-2"/>
                    Save Current Filters
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Clear All */}
            {(activeFiltersCount > 0 || localSearchValue) && (
              <Button
                variant="ghost"
                onClick={() => {
                  setLocalSearchValue('')
                  onSearchChange?.('')
                  onClearAll?.()
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4 mr-2"/>
                Clear All
              </Button>
            )}
          </div>

          {/* Active Filter Chips */}
          {activeFilterChips.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {activeFilterChips.map(filter => (
                <Badge
                  key={filter.id}
                  variant="secondary"
                  className="flex items-center space-x-1 pr-1"
                >
                  <span className="text-xs">{filter.label}:</span>
                  <span className="text-xs font-medium">
                    {filter.type === 'boolean'
                      ? (filter.value ? 'Yes' : 'No')
                      : filter.type === 'multiselect'
                      ? (Array.isArray(filter.value) ? `${filter.value.length} selected` : '0 selected')
                      : filter.type === 'daterange'
                      ? (filter.value && typeof filter.value === 'object' && filter.value !== null && 'start' in filter.value && 'end' in filter.value
                        ? `${(filter.value as { start?: Date; end?: Date }).start ? new Date((filter.value as { start?: Date; end?: Date }).start!).toLocaleDateString() : ''} - ${(filter.value as { start?: Date; end?: Date }).end ? new Date((filter.value as { start?: Date; end?: Date }).end!).toLocaleDateString() : ''}`
                        : 'No range set')
                      : filter.value?.toString() || 'Set'
                    }
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => handleFilterChange(filter.id, undefined)}
                  >
                    <X className="h-3 w-3"/>
                  </Button>
                </Badge>
              ))}
            </div>
          )}

          {/* Result Count */}
          {resultCount !== undefined && totalCount !== undefined && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                Showing <span className="font-medium text-foreground">{resultCount.toLocaleString()}</span> of{' '}
                <span className="font-medium text-foreground">{totalCount.toLocaleString()}</span> results
              </div>
              {activeFiltersCount > 0 && (
                <Button variant="outline" size="sm" onClick={() => setSaveDialogOpen(true)}>
                  <Save className="w-4 h-4 mr-2"/>
                  Save Filter
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Advanced Filters Panel */}
      {showAdvancedFilters && filters.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <SlidersHorizontal className="w-5 h-5 mr-2"/>
              Advanced Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filters.map(filter => (
                <div key={filter.id} className="space-y-2">
                  <label className="text-sm font-medium">{filter.label}</label>
                  {renderFilterControl(filter)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Save Filter Dialog */}
      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Filter</DialogTitle>
            <DialogDescription>
              Save your current filter configuration for quick access later.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Filter Name</label>
              <Input
                value={newFilterName}
                onChange={(e) => setNewFilterName(e.target.value)}
                placeholder="Enter a name for this filter"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleSaveFilter()
                  }
                }}/>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveFilter} disabled={!newFilterName.trim()}>
              Save Filter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default SearchFilterBar
