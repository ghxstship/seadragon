
import React, { useState, useMemo } from 'react'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Check,
  X,
  Star,
  TrendingUp,
  TrendingDown,
  Minus,
  Filter,
  Download,
  Plus
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Metadata {
  price?: number
  rating?: number
  reviews?: number
  availability?: string
  location?: string
  features?: string[]
  specifications?: Record<string, string | number | boolean>
  [key: string]: unknown
}

export interface ComparisonItem {
  id: string
  name: string
  description?: string
  image?: string
  category?: string
  metadata?: Metadata
}

export interface ComparisonFeature {
  id: string
  name: string
  type: 'text' | 'number' | 'rating' | 'boolean' | 'select' | 'date'
  better?: 'higher' | 'lower' // For numeric/rating types
  unit?: string // For numeric types
  options?: string[] // For select types
  weight?: number // For scoring calculations
}

type FeatureValue = string | number | boolean | Date | null | undefined

export interface ComparisonValue {
  itemId: string
  featureId: string
  value: FeatureValue
  notes?: string
  source?: string
  confidence?: 'high' | 'medium' | 'low'
}

export interface ComparisonMatrixProps {
  items: ComparisonItem[]
  features: ComparisonFeature[]
  values: ComparisonValue[]
  title?: string
  subtitle?: string
  showFilters?: boolean
  showScoring?: boolean
  showHighlighting?: boolean
  allowSelection?: boolean
  allowEditing?: boolean
  onItemSelect?: (itemId: string) => void
  onValueChange?: (itemId: string, featureId: string, value: FeatureValue) => void
  onItemAdd?: () => void
  onFeatureAdd?: () => void
  onExport?: (format: 'csv' | 'json' | 'pdf') => void
  className?: string
}

const ComparisonMatrix: React.FC<ComparisonMatrixProps> = ({
  items,
  features,
  values,
  title = 'Comparison Matrix',
  subtitle,
  showFilters = true,
  showScoring = true,
  showHighlighting = false,
  allowSelection = true,
  allowEditing = false,
  onItemSelect,
  onValueChange,
  onItemAdd,
  onFeatureAdd,
  onExport,
  className
}) => {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [filters, setFilters] = useState({
    category: '',
    search: ''
  })
  const [sortConfig, setSortConfig] = useState<{
    featureId: string | null
    direction: 'asc' | 'desc'
  }>({ featureId: null, direction: 'asc' })

  // Filter items based on search and category
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = !filters.search ||
        item.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.description?.toLowerCase().includes(filters.search.toLowerCase())
      const matchesCategory = !filters.category || item.category === filters.category

      return matchesSearch && matchesCategory
    })
  }, [items, filters])

  // Sort items based on selected feature
  const sortedItems = useMemo(() => {
    if (!sortConfig.featureId) return filteredItems

    return [...filteredItems].sort((a, b) => {
      const aValue = values.find(v => v.itemId === a.id && v.featureId === sortConfig.featureId)?.value
      const bValue = values.find(v => v.itemId === b.id && v.featureId === sortConfig.featureId)?.value

      const feature = features.find(f => f.id === sortConfig.featureId)
      let comparison = 0

      if (feature?.type === 'number' || feature?.type === 'rating') {
        const aNum = typeof aValue === 'number' ? aValue : parseFloat(String(aValue || 0))
        const bNum = typeof bValue === 'number' ? bValue : parseFloat(String(bValue || 0))
        comparison = aNum - bNum
      } else {
        comparison = String(aValue || '').localeCompare(String(bValue || ''))
      }

      return sortConfig.direction === 'asc' ? comparison : -comparison
    })
  }, [filteredItems, values, features, sortConfig])

  // Calculate scores for items (weighted average)
  const itemScores = useMemo(() => {
    if (!showScoring) return {}

    const scores: Record<string, { score: number; maxScore: number }> = {}

    sortedItems.forEach(item => {
      let totalScore = 0
      let totalWeight = 0

      features.forEach(feature => {
        const value = values.find(v => v.itemId === item.id && v.featureId === feature.id)
        const weight = feature.weight || 1

        if (value?.value !== null && value?.value !== undefined) {
          if (feature.type === 'boolean') {
            totalScore += (value.value ? 1 : 0) * weight
          } else if (feature.type === 'rating' || feature.type === 'number') {
            const numValue = typeof value.value === 'number' ? value.value : parseFloat(String(value.value))
            if (!isNaN(numValue)) {
              // Normalize to 0-1 scale for scoring
              totalScore += Math.max(0, Math.min(1, numValue / 10)) * weight
            }
          }
          totalWeight += weight
        }
      })

      scores[item.id] = {
        score: totalWeight > 0 ? (totalScore / totalWeight) * 100 : 0,
        maxScore: 100
      }
    })

    return scores
  }, [sortedItems, features, values, showScoring])

  const getValueDisplay = (value: ComparisonValue | undefined, feature: ComparisonFeature) => {
    if (!value?.value) return <span className="text-muted-foreground">-</span>

    switch (feature.type) {
      case 'boolean':
        return value.value ? <Check className="w-4 h-4 text-semantic-success"/> : <X className="w-4 h-4 text-semantic-error"/>

      case 'rating':
        const rating = typeof value.value === 'number' ? value.value : parseInt(String(value.value))
        return (
          <div className="flex items-center space-x-1">
            {Array.from({ length: 5 }, (_, i) => (
              <Star
                key={i}
                className={cn(
                  "w-3 h-3",
                  i < rating ? "text-semantic-warning fill-current" : "text-neutral-300"
                )}/>
            ))}
            <span className="text-xs ml-1">{rating}/5</span>
          </div>
        )

      case 'number':
        const numValue = typeof value.value === 'number' ? value.value : parseFloat(String(value.value))
        return (
          <span>
            {isNaN(numValue) ? String(value.value) : numValue.toLocaleString()}
            {feature.unit && <span className="text-xs text-muted-foreground ml-1">{feature.unit}</span>}
          </span>
        )

      default:
        return <span>{String(value.value)}</span>
    }
  }

  const getCellHighlighting = (value: ComparisonValue | undefined, feature: ComparisonFeature, itemId: string) => {
    if (!showHighlighting || !value?.value || !feature.better) return ''

    const allValues = values
      .filter(v => v.featureId === feature.id && v.value !== null)
      .map(v => ({
        value: v.value,
        itemId: v.itemId
      }))

    if (feature.type === 'number' || feature.type === 'rating') {
      const numValue = typeof value.value === 'number' ? value.value : parseFloat(String(value.value))
      const valuesList = allValues.map(v =>
        typeof v.value === 'number' ? v.value : parseFloat(String(v.value))
      ).filter(v => !isNaN(v))

      if (valuesList.length === 0) return ''

      const max = Math.max(...valuesList)
      const min = Math.min(...valuesList)

      if (feature.better === 'higher' && numValue === max) {
        return 'bg-green-50 border-green-200'
      } else if (feature.better === 'lower' && numValue === min) {
        return 'bg-green-50 border-green-200'
      } else if (feature.better === 'higher' && numValue < max * 0.8) {
        return 'bg-red-50 border-red-200'
      } else if (feature.better === 'lower' && numValue > min * 1.2) {
        return 'bg-red-50 border-red-200'
      }
    }

    return ''
  }

  const handleItemToggle = (itemId: string) => {
    const newSelected = new Set(selectedItems)
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId)
    } else {
      newSelected.add(itemId)
    }
    setSelectedItems(newSelected)
  }

  const handleSort = (featureId: string) => {
    setSortConfig(prev => ({
      featureId,
      direction: prev.featureId === featureId && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  const handleValueEdit = (itemId: string, featureId: string, newValue: FeatureValue) => {
    if (allowEditing && onValueChange) {
      onValueChange(itemId, featureId, newValue)
    }
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            {subtitle && <p className="text-muted-foreground text-sm">{subtitle}</p>}
          </div>
          <div className="flex items-center space-x-2">
            {onExport && (
              <Button variant="outline" size="sm" onClick={() => onExport('csv')}>
                <Download className="w-4 h-4 mr-2"/>
                Export
              </Button>
            )}
            {onFeatureAdd && (
              <Button variant="outline" size="sm" onClick={onFeatureAdd}>
                <Plus className="w-4 h-4 mr-2"/>
                Add Feature
              </Button>
            )}
            {onItemAdd && (
              <Button variant="outline" size="sm" onClick={onItemAdd}>
                <Plus className="w-4 h-4 mr-2"/>
                Add Item
              </Button>
            )}
          </div>
        </div>

        {showFilters && (
          <div className="flex items-center space-x-4 pt-4">
            <div className="flex-1">
              <Label htmlFor="search">Search</Label>
              <Input
                id="search"
                placeholder="Search items..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}/>
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={filters.category}
                onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="All"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All</SelectItem>
                  {Array.from(new Set(items.map(i => i.category).filter(Boolean))).map(cat => (
                    <SelectItem key={cat} value={cat!}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {allowSelection && (
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedItems.size === sortedItems.length}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedItems(new Set(sortedItems.map(i => i.id)))
                        } else {
                          setSelectedItems(new Set())
                        }
                      }}/>
                  </TableHead>
                )}
                <TableHead className="min-w-48">Item</TableHead>
                {showScoring && <TableHead className="w-24 text-center">Score</TableHead>}
                {features.map(feature => (
                  <TableHead
                    key={feature.id}
                    className="min-w-32 cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort(feature.id)}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{feature.name}</span>
                      {sortConfig.featureId === feature.id && (
                        sortConfig.direction === 'asc' ?
                          <TrendingUp className="w-3 h-3"/> :
                          <TrendingDown className="w-3 h-3"/>
                      )}
                    </div>
                    {feature.better && (
                      <div className="text-xs text-muted-foreground">
                        Better: {feature.better}
                      </div>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedItems.map(item => (
                <TableRow
                  key={item.id}
                  className={cn(
                    "cursor-pointer hover:bg-muted/50",
                    selectedItems.has(item.id) && "bg-muted"
                  )}
                  onClick={() => {
                    if (allowSelection) {
                      handleItemToggle(item.id)
                    }
                    onItemSelect?.(item.id)
                  }}
                >
                  {allowSelection && (
                    <TableCell>
                      <Checkbox
                        checked={selectedItems.has(item.id)}
                        onCheckedChange={() => handleItemToggle(item.id)}/>
                    </TableCell>
                  )}
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      {item.image && (
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={32}
                          height={32}
                          className="w-8 h-8 rounded object-cover"/>
                      )}
                      <div>
                        <div className="font-medium">{item.name}</div>
                        {item.description && (
                          <div className="text-sm text-muted-foreground">{item.description}</div>
                        )}
                        {item.category && (
                          <Badge variant="outline" className="text-xs mt-1">
                            {item.category}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  {showScoring && (
                    <TableCell className="text-center">
                      {itemScores[item.id] && (
                        <div className="flex flex-col items-center">
                          <div className="text-sm font-medium">
                            {itemScores[item.id].score.toFixed(1)}%
                          </div>
                          <div className="w-12 h-1.5 bg-muted rounded-full">
                            <div
                              className="h-1.5 bg-primary rounded-full"
                              style={{ width: `${itemScores[item.id].score}%` }}/>
                          </div>
                        </div>
                      )}
                    </TableCell>
                  )}
                  {features.map(feature => {
                    const value = values.find(v => v.itemId === item.id && v.featureId === feature.id)
                    const cellClass = getCellHighlighting(value, feature, item.id)

                    return (
                      <TableCell
                        key={feature.id}
                        className={cn("text-center", cellClass)}
                      >
                        {allowEditing && feature.type === 'boolean' ? (
                          <Checkbox
                            checked={Boolean(value?.value)}
                            onCheckedChange={(checked) => handleValueEdit(item.id, feature.id, checked)}/>
                        ) : allowEditing && feature.type === 'select' && feature.options ? (
                          <Select
                            value={String(value?.value || '')}
                            onValueChange={(val) => handleValueEdit(item.id, feature.id, val)}
                          >
                            <SelectTrigger className="w-20 h-8">
                              <SelectValue/>
                            </SelectTrigger>
                            <SelectContent>
                              {feature.options.map(option => (
                                <SelectItem key={option} value={option}>{option}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          getValueDisplay(value, feature)
                        )}
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {sortedItems.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No items match the current filters.
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default ComparisonMatrix