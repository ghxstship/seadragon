
import React, { useState, useCallback } from 'react'
import { Button } from '@/components/ui'
import { Input } from '@/components/ui'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { Badge } from '@/components/ui'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui'
import { Checkbox } from '@/components/ui'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui'
import {
  Search,
  Filter,
  SortAsc,
  SortDesc,
  ChevronLeft,
  ChevronRight,
  Download,
  Upload,
  Plus
} from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ListLayoutFilter {
  id: string
  label: string
  type: 'select' | 'multiselect' | 'date' | 'daterange' | 'text' | 'number' | 'boolean'
  options?: Array<{ value: string; label: string }>
  value?: string | number | boolean | string[]
  placeholder?: string
}

export interface ListLayoutSortOption {
  id: string
  label: string
  direction: 'asc' | 'desc'
}

export interface ListLayoutBulkAction {
  id: string
  label: string
  icon?: React.ReactNode
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  onClick: (selectedIds: string[]) => void
  confirmMessage?: string
}

export interface ListLayoutProps {
  title: string
  subtitle?: string
  totalItems?: number
  currentPage?: number
  totalPages?: number
  pageSize?: number
  pageSizeOptions?: number[]
  onPageChange?: (page: number) => void
  onPageSizeChange?: (pageSize: number) => void

  // Search
  searchValue?: string
  searchPlaceholder?: string
  onSearchChange?: (value: string) => void

  // Filters
  filters?: ListLayoutFilter[]
  onFilterChange?: (filterId: string, value: string | number | boolean | string[]) => void
  activeFiltersCount?: number

  // Sorting
  sortOptions?: ListLayoutSortOption[]
  currentSort?: ListLayoutSortOption
  onSortChange?: (sort: ListLayoutSortOption) => void

  // Bulk actions
  bulkActions?: ListLayoutBulkAction[]
  selectedItems?: string[]
  onSelectionChange?: (selectedIds: string[]) => void
  selectable?: boolean

  // Actions
  primaryAction?: {
    label: string
    onClick: () => void
    icon?: React.ReactNode
  }
  secondaryActions?: Array<{
    label: string
    onClick: () => void
    icon?: React.ReactNode
  }>

  // View controls
  viewOptions?: Array<{
    id: string
    label: string
    icon: React.ReactNode
  }>
  currentView?: string
  onViewChange?: (viewId: string) => void

  // Export/Import
  onExport?: (format: 'csv' | 'excel' | 'pdf') => void
  onImport?: (file: File) => void

  // Loading and empty states
  loading?: boolean
  emptyState?: {
    title: string
    description?: string
    action?: {
      label: string
      onClick: () => void
    }
  }

  // Layout options
  compact?: boolean
  showFilters?: boolean
  showBulkActions?: boolean
  showPagination?: boolean
  showSearch?: boolean

  children: React.ReactNode
  className?: string
}

const ListLayout = ({
  title,
  subtitle,
  totalItems = 0,
  currentPage = 1,
  totalPages = 1,
  pageSize = 10,
  pageSizeOptions = [10, 25, 50, 100],
  onPageChange,
  onPageSizeChange,

  searchValue = '',
  searchPlaceholder = 'Search...',
  onSearchChange,

  filters = [],
  onFilterChange,
  activeFiltersCount = 0,

  sortOptions = [],
  currentSort,
  onSortChange,

  bulkActions = [],
  selectedItems = [],
  onSelectionChange,
  selectable = false,

  primaryAction,
  secondaryActions = [],

  viewOptions = [],
  currentView,
  onViewChange,

  onExport,
  onImport,

  loading = false,
  emptyState,

  compact = false,
  showFilters = true,
  showBulkActions = true,
  showPagination = true,
  showSearch = true,

  children,
  className
}: ListLayoutProps) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [localSearchValue, setLocalSearchValue] = useState(searchValue)

  const handleSearchChange = useCallback((value: string) => {
    setLocalSearchValue(value)
    onSearchChange?.(value)
  }, [onSearchChange])

  const handleFilterChange = useCallback((filterId: string, value: string | number | boolean | string[]) => {
    onFilterChange?.(filterId, value)
  }, [onFilterChange])

  const handleBulkAction = useCallback((action: ListLayoutBulkAction) => {
    if (action.confirmMessage && !window.confirm(action.confirmMessage)) {
      return
    }
    action.onClick(selectedItems)
  }, [selectedItems])

  const handleSelectAll = useCallback((checked: boolean) => {
    if (checked) {
      // This would need to be implemented by parent component
      // For now, just clear selection
      onSelectionChange?.([])
    } else {
      onSelectionChange?.([])
    }
  }, [onSelectionChange])

  const renderFilterControl = (filter: ListLayoutFilter) => {
    switch (filter.type) {
      case 'select':
        return (
          <Select
            value={filter.value as string || ''}
            onValueChange={(value: string) => handleFilterChange(filter.id, value)}
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
            value={(filter.value as string[])?.join(',') || ''}
            onValueChange={(value: string) => handleFilterChange(filter.id, value ? value.split(',') : [])}
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

      case 'text':
        return (
          <Input
            value={filter.value as string || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFilterChange(filter.id, e.target.value)}
            placeholder={filter.placeholder || `Enter ${filter.label}`}/>
        )

      case 'number':
        return (
          <Input
            type="number"
            value={filter.value as number || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFilterChange(filter.id, parseFloat(e.target.value) || 0)}
            placeholder={filter.placeholder || `Enter ${filter.label}`}/>
        )

      case 'boolean':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={filter.value as boolean || false}
              onCheckedChange={(checked: boolean) => handleFilterChange(filter.id, checked)}/>
            <label className="text-sm">{filter.label}</label>
          </div>
        )

      default:
        return null
    }
  }

  const startItem = (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, totalItems)

  return (
    <div className={cn("w-full space-y-4", className)}>
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl flex items-center space-x-2">
                <span>{title}</span>
                {totalItems > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {totalItems.toLocaleString()}
                  </Badge>
                )}
              </CardTitle>
              {subtitle && (
                <p className="text-muted-foreground mt-1">{subtitle}</p>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {/* View Options */}
              {viewOptions.length > 0 && (
                <div className="flex items-center border rounded-md">
                  {viewOptions.map(option => (
                    <Button
                      key={option.id}
                      variant={currentView === option.id ? "default" : "ghost"}
                      size="sm"
                      onClick={() => onViewChange?.(option.id)}
                      title={option.label}
                      className="rounded-none first:rounded-l-md last:rounded-r-md"
                    >
                      {option.icon}
                    </Button>
                  ))}
                </div>
              )}

              {/* Export/Import */}
              {(onExport || onImport) && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2"/>
                      Actions
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {onExport && (
                      <>
                        <DropdownMenuItem onClick={() => onExport('csv')}>
                          <Download className="w-4 h-4 mr-2"/>
                          Export CSV
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onExport('excel')}>
                          <Download className="w-4 h-4 mr-2"/>
                          Export Excel
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onExport('pdf')}>
                          <Download className="w-4 h-4 mr-2"/>
                          Export PDF
                        </DropdownMenuItem>
                      </>
                    )}
                    {onImport && (
                      <DropdownMenuItem>
                        <Upload className="w-4 h-4 mr-2"/>
                        Import Data
                        <Input
                          type="file"
                          className="hidden"
                          accept=".csv,.xlsx,.xls"
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const file = e.target.files?.[0]
                            if (file) onImport(file)
                          }}/>
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {/* Secondary Actions */}
              {secondaryActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={action.onClick}
                >
                  {action.icon}
                  <span className="ml-2">{action.label}</span>
                </Button>
              ))}

              {/* Primary Action */}
              {primaryAction && (
                <Button onClick={primaryAction.onClick}>
                  {primaryAction.icon || <Plus className="w-4 h-4 mr-2"/>}
                  {primaryAction.label}
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        {/* Search and Filters */}
        {(showSearch || showFilters) && (
          <CardContent className="pt-0">
            <div className="flex flex-col space-y-4">
              {/* Search Bar */}
              {showSearch && (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4"/>
                  <Input
                    value={localSearchValue}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSearchChange(e.target.value)}
                    placeholder={searchPlaceholder}
                    className="pl-10"/>
                </div>
              )}

              {/* Filters Row */}
              {showFilters && filters.length > 0 && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                      className="flex items-center space-x-2"
                    >
                      <Filter className="w-4 h-4"/>
                      <span>Filters</span>
                      {activeFiltersCount > 0 && (
                        <Badge variant="secondary" className="ml-2 text-xs">
                          {activeFiltersCount}
                        </Badge>
                      )}
                    </Button>

                    {/* Sort Options */}
                    {sortOptions.length > 0 && (
                      <Select
                        value={currentSort ? `${currentSort.id}-${currentSort.direction}` : ''}
                        onValueChange={(value: string) => {
                          const [id, direction] = value.split('-')
                          const sortOption = sortOptions.find(s => s.id === id)
                          if (sortOption) {
                            onSortChange?.({ ...sortOption, direction: direction as 'asc' | 'desc' })
                          }
                        }}
                      >
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="Sort by..."/>
                        </SelectTrigger>
                        <SelectContent>
                          {sortOptions.map(option => (
                            <React.Fragment key={`${option.id}-${option.direction}`}>
                              <SelectItem value={`${option.id}-${option.direction}`}>
                                <div className="flex items-center space-x-2">
                                  {option.direction === 'asc' ? (
                                    <SortAsc className="w-4 h-4"/>
                                  ) : (
                                    <SortDesc className="w-4 h-4"/>
                                  )}
                                  <span>{option.label}</span>
                                </div>
                              </SelectItem>
                            </React.Fragment>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>

                  {/* Bulk Actions */}
                  {showBulkActions && bulkActions.length > 0 && selectedItems.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">
                        {selectedItems.length} selected
                      </span>
                      {bulkActions.map(action => (
                        <Button
                          key={action.id}
                          variant={action.variant || 'outline'}
                          size="sm"
                          onClick={() => handleBulkAction(action)}
                        >
                          {action.icon}
                          <span className="ml-2">{action.label}</span>
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Advanced Filters */}
              {showAdvancedFilters && showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
                  {filters.map(filter => (
                    <div key={filter.id} className="space-y-2">
                      <label className="text-sm font-medium">{filter.label}</label>
                      {renderFilterControl(filter)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Content */}
      <Card>
        <CardContent className={cn("p-0", compact ? "p-2" : "p-6")}>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary"></div>
              <span className="ml-2 text-muted-foreground">Loading...</span>
            </div>
          ) : totalItems === 0 && emptyState ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-muted-foreground"/>
              </div>
              <h3 className="text-lg font-medium mb-2">{emptyState.title}</h3>
              {emptyState.description && (
                <p className="text-muted-foreground mb-4 max-w-md">
                  {emptyState.description}
                </p>
              )}
              {emptyState.action && (
                <Button onClick={emptyState.action.onClick}>
                  {emptyState.action.label}
                </Button>
              )}
            </div>
          ) : (
            <div className={cn("space-y-4", compact && "space-y-2")}>
              {/* Select All Checkbox */}
              {selectable && showBulkActions && (
                <div className="flex items-center space-x-2 px-4 py-2 border-b">
                  <Checkbox
                    checked={selectedItems.length > 0}
                    onCheckedChange={handleSelectAll}/>
                  <span className="text-sm text-muted-foreground">
                    Select all ({totalItems})
                  </span>
                </div>
              )}

              {/* List Content */}
              {children}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">
                  Showing {startItem}-{endItem} of {totalItems.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center space-x-4">
                {/* Page Size Selector */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">Show:</span>
                  <Select
                    value={pageSize.toString()}
                    onValueChange={(value: string) => onPageSizeChange?.(parseInt(value))}
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue/>
                    </SelectTrigger>
                    <SelectContent>
                      {pageSizeOptions.map(size => (
                        <SelectItem key={size} value={size.toString()}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange?.(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4"/>
                    Previous
                  </Button>

                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i
                      if (page > totalPages) return null

                      return (
                        <Button
                          key={page}
                          variant={page === currentPage ? "default" : "outline"}
                          size="sm"
                          onClick={() => onPageChange?.(page)}
                          className="w-8 h-8 p-0"
                        >
                          {page}
                        </Button>
                      )
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange?.(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="w-4 h-4"/>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default ListLayout
