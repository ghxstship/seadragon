
import React, { useState, useMemo } from 'react'
import type { CSSProperties } from 'react'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import {
  BarChart3,
  Download,
  Maximize,
  Minimize,
  TrendingUp,
  TrendingDown,
  Minus,
  RefreshCw
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { colors } from '@/lib/design-system/tokens'

export interface ChartDataPoint {
  [key: string]: string | number | Date | null | undefined
}

export interface ChartSeries {
  id: string
  name: string
  dataKey: string
  color?: string
  type?: 'line' | 'area' | 'bar' | 'scatter' | 'pie' | 'composed'
  strokeWidth?: number
  fill?: string
  strokeDasharray?: string
}

export type TooltipEntry = {
  color?: string
  name?: string
  value?: number
}

type LegendEntry = {
  color?: string
  value?: string
}

type NormalizedSeries = {
  id: string
  name: string
  dataKey: string
  color: string
  type: NonNullable<ChartSeries['type']>
  strokeWidth: number
  fill: string
  strokeDasharray: string
}

export interface AnalyticsChartProps {
  title?: string
  subtitle?: string
  data: ChartDataPoint[]
  series?: ChartSeries[]
  chartType?: 'line' | 'area' | 'bar' | 'pie' | 'scatter' | 'composed'
  /** legacy alias used in tests */
  type?: 'line' | 'area' | 'bar' | 'pie' | 'scatter' | 'composed'
  xAxisKey?: string
  yAxisKey?: string
  showLegend?: boolean
  showTooltip?: boolean
  showGrid?: boolean
  interactive?: boolean
  height?: number
  width?: string | number
  margin?: {
    top?: number
    right?: number
    bottom?: number
    left?: number
  }
  colors?: string[]
  onDataPointClick?: (data: ChartDataPoint, index: number) => void
  onLegendClick?: (data: LegendEntry) => void
  onExport?: (format: 'png' | 'svg' | 'csv' | 'json') => void
  loading?: boolean
  error?: string
  emptyStateMessage?: string
  className?: string
  showChartTypeSelector?: boolean
  showFullscreenToggle?: boolean
  trendIndicators?: boolean
  showDataTable?: boolean
  showLabels?: boolean
  // optional test-facing props (no-ops for compatibility)
  dataTransform?: (data: ChartDataPoint[]) => ChartDataPoint[]
  dataFilter?: (item: ChartDataPoint) => boolean
  tooltipContent?: (args: { active?: boolean; payload?: TooltipEntry[]; label?: string }) => React.ReactNode
  overlayData?: ChartDataPoint[]
  dateFormat?: string
  decimalPlaces?: number
  enableZoom?: boolean
  theme?: string
  animated?: boolean
  onExportCSV?: (data: ChartDataPoint[]) => void
  // allow forward-compat props for tests
  [key: string]: unknown
}

// Recharts component prop types
interface RechartsTooltipProps {
  active?: boolean
  payload?: Array<{
    color?: string
    name?: string
    value?: number | string
    payload?: unknown
  }>
  label?: string | number
}

interface RechartsLegendProps {
  payload?: Array<{
    color?: string
    value?: string
    type?: string
  }>
}


type ChartType = 'line' | 'area' | 'bar' | 'pie' | 'scatter'

const defaultColors = [
  colors.semantic.success[500], // emerald
  colors.primary[500], // blue
  colors.semantic.warning[500], // amber
  colors.semantic.error[500], // red
  colors.extended.violet[500], // violet
  colors.semantic.info[500], // cyan
  colors.extended.lime[500], // lime
  colors.extended.orange[500], // orange
  colors.extended.pink[500], // pink
  colors.neutral[500], // gray
  colors.semantic.info[500], // cyan (duplicate)
]

const AnalyticsChart: React.FC<AnalyticsChartProps> = ({
  title,
  subtitle,
  data,
  series = [],
  chartType: incomingChartType = 'line',
  type,
  xAxisKey = 'name',
  yAxisKey,
  showLegend = true,
  showTooltip = true,
  showGrid = true,
  interactive = true,
  height = 400,
  width = '100%',
  margin = { top: 20, right: 30, left: 20, bottom: 5 },
  colors = defaultColors,
  onDataPointClick,
  onLegendClick,
  onExport,
  loading = false,
  error,
  emptyStateMessage = 'No data available',
  className,
  showChartTypeSelector = true,
  showFullscreenToggle = false,
  trendIndicators = false,
  showDataTable: _showDataTable = false,
  showLabels: _showLabels,
  dataTransform: _dataTransform,
  dataFilter: _dataFilter,
  tooltipContent: _tooltipContent,
  overlayData: _overlayData,
  dateFormat: _dateFormat,
  decimalPlaces: _decimalPlaces,
  enableZoom: _enableZoom,
  theme: _theme,
  animated: _animated,
  onExportCSV: _onExportCSV
}) => {
  const initialChartType = type || incomingChartType
  const [selectedChartType, setSelectedChartType] = useState(initialChartType)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const processedSeries: NormalizedSeries[] = useMemo(() => {
    const baseSeries = series.length > 0 ? series : [{
      id: 'default',
      name: 'Value',
      dataKey: yAxisKey || 'value'
    }]

    const palette: string[] = (colors && colors.length > 0 ? colors : defaultColors).filter(Boolean)
    const safePalette = palette.length > 0 ? palette : defaultColors
    const fallbackColor = safePalette[0] ?? defaultColors[0]

    return baseSeries.map<NormalizedSeries>((s, index) => {
      const color = s.color ?? safePalette[index % safePalette.length] ?? fallbackColor
      const type = (s.type ?? selectedChartType) as NonNullable<ChartSeries['type']>
      const strokeWidth = s.strokeWidth ?? 2
      const fill = (s.fill ?? color) as string
      const strokeDasharray = s.strokeDasharray ?? ''
      return {
        id: s.id,
        name: s.name,
        dataKey: s.dataKey,
        strokeWidth,
        fill,
        strokeDasharray,
        color: color as string,
        type
      }
    })
  }, [series, colors, selectedChartType, yAxisKey])

  const trendData = useMemo(() => {
    if (!trendIndicators || data.length < 2) return null

    return processedSeries.map(seriesItem => {
      const values = data.map(d => Number(d[seriesItem.dataKey])).filter(v => !isNaN(v))
      if (values.length < 2) return null

      const first = values[0]
      const last = values[values.length - 1]
      if (first === undefined || last === undefined) return null
      const change = ((last - first) / first) * 100
      const trend = change > 0 ? 'up' : change < 0 ? 'down' : 'neutral'

      return {
        seriesId: seriesItem.id,
        change: Math.abs(change),
        trend,
        current: last,
        previous: first
      }
    }).filter(Boolean)
  }, [data, processedSeries, trendIndicators])

  const CustomTooltip = ({ active, payload, label }: RechartsTooltipProps) => {
    if (!active || !payload || !payload.length) return null

    return (
      <div className="bg-background border border-border rounded-lg shadow-lg p-3">
        <p className="font-medium text-sm mb-2">{label}</p>
        {payload.map((entry, index: number) => (
          <div key={index} className="flex items-center space-x-2 text-sm">
            <div
              className="w-3 h-3 rounded-full bg-[color:var(--chart-color)]"
              style={{ '--chart-color': entry.color } as CSSProperties}/>
            <span className="font-medium">{entry.name}:</span>
            <span>{entry.value?.toLocaleString()}</span>
          </div>
        ))}
      </div>
    )
  }

  const CustomLegend = ({ payload }: RechartsLegendProps) => {
    if (!payload || !showLegend) return null

    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {payload.map((entry, index: number) => (
          <div
            key={index}
            className="flex items-center space-x-2 cursor-pointer hover:opacity-75"
            onClick={() => onLegendClick?.(entry)}
          >
            <div
              className="w-3 h-3 rounded-full bg-[color:var(--chart-color)]"
              style={{ '--chart-color': entry.color } as CSSProperties}/>
            <span className="text-sm font-medium">{entry.value}</span>
          </div>
        ))}
      </div>
    )
  }

  const renderChart = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-full">
          <RefreshCw className="w-8 h-8 animate-spin text-muted-foreground"/>
        </div>
      )
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-full text-destructive">
          <div className="text-center">
            <p className="font-medium">Chart Error</p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        </div>
      )
    }

    if (!data || data.length === 0) {
      return (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50"/>
            <p>{emptyStateMessage}</p>
          </div>
        </div>
      )
    }

    const commonProps = {
      data,
      margin
    }

    switch (selectedChartType) {
      case 'line':
        return (
          <LineChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" className="opacity-30"/>}
            <XAxis
              dataKey={xAxisKey}
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}/>
            <YAxis
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}/>
            {showTooltip && <Tooltip content={<CustomTooltip/>}/>}
            {showLegend && <Legend content={<CustomLegend/>}/>}
            {processedSeries.map((seriesItem, index) => {
              const strokeColor = seriesItem.color ?? colors[index % colors.length] ?? defaultColors[0]
              return (
                <Line
                  key={seriesItem.id}
                  type="monotone"
                  dataKey={seriesItem.dataKey}
                  stroke={strokeColor}
                  strokeWidth={seriesItem.strokeWidth || 2}
                  name={seriesItem.name}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              )
            })}
          </LineChart>
        )

      case 'area':
        return (
          <AreaChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" className="opacity-30"/>}
            <XAxis
              dataKey={xAxisKey}
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}/>
            <YAxis
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}/>
            {showTooltip && <Tooltip content={<CustomTooltip/>}/>}
            {showLegend && <Legend content={<CustomLegend/>}/>}
            {processedSeries.map((seriesItem, index) => {
              const strokeColor = seriesItem.color ?? colors[index % colors.length] ?? defaultColors[0]
              const fillColor = seriesItem.fill || strokeColor
              return (
                <Area
                  key={seriesItem.id}
                  type="monotone"
                  dataKey={seriesItem.dataKey}
                  stackId="1"
                  stroke={strokeColor as string}
                  fill={fillColor as string}
                  fillOpacity={0.6}
                  name={seriesItem.name}
                />
              )
            })}
          </AreaChart>
        )

      case 'bar':
        return (
          <BarChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" className="opacity-30"/>}
            <XAxis
              dataKey={xAxisKey}
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}/>
            <YAxis
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}/>
            {showTooltip && <Tooltip content={<CustomTooltip/>}/>}
            {showLegend && <Legend content={<CustomLegend/>}/>}
            {processedSeries.map((seriesItem, index) => {
              const strokeColor = seriesItem.color ?? colors[index % colors.length] ?? defaultColors[0]
              return (
                <Bar
                  key={seriesItem.id}
                  dataKey={seriesItem.dataKey}
                  fill={strokeColor}
                  name={seriesItem.name}
                />
              )
            })}
          </BarChart>
        )

      case 'pie':
        const pieData = processedSeries.map(seriesItem => ({
          name: seriesItem.name,
          value: data.reduce((sum, d) => sum + (Number(d[seriesItem.dataKey]) || 0), 0),
          fill: seriesItem.color ?? colors[processedSeries.indexOf(seriesItem) % colors.length] ?? defaultColors[0]
        }))

        const handlePieClick =
          interactive && onDataPointClick
            ? (_entry: unknown, index: number) => onDataPointClick(pieData[index] as ChartDataPoint, index)
            : undefined

        return (
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent = 0 }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
              onClick={handlePieClick as any}
            >
              {pieData.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]}/>
              ))}
            </Pie>
            {showTooltip && <Tooltip/>}
            {showLegend && <Legend content={<CustomLegend/>}/>}
          </PieChart>
        )

      case 'scatter':
        return (
          <ScatterChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" className="opacity-30"/>}
            <XAxis
              type="number"
              dataKey={xAxisKey}
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}/>
            <YAxis
              type="number"
              dataKey={(yAxisKey ?? processedSeries[0]?.dataKey ?? 'value') as string}
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}/>
            {showTooltip && <Tooltip content={<CustomTooltip/>}/>}
            {showLegend && <Legend content={<CustomLegend/>}/>}
            {processedSeries.map((seriesItem) => (
              <Scatter
                key={seriesItem.id}
                name={seriesItem.name}
                dataKey={seriesItem.dataKey}
                fill={seriesItem.color}/>
            ))}
          </ScatterChart>
        )

      default:
        return <div>Unsupported chart type</div>
    }
  }

  return (
    <Card className={cn("w-full", className)}>
      {(title || showChartTypeSelector || showFullscreenToggle || onExport) && (
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              {title && <CardTitle className="text-lg">{title}</CardTitle>}
              {subtitle && <p className="text-muted-foreground text-sm mt-1">{subtitle}</p>}
            </div>

            <div className="flex items-center space-x-2">
              {showChartTypeSelector && (
                <Select value={selectedChartType} onValueChange={(value: ChartType) => setSelectedChartType(value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="line">Line</SelectItem>
                    <SelectItem value="area">Area</SelectItem>
                    <SelectItem value="bar">Bar</SelectItem>
                    <SelectItem value="pie">Pie</SelectItem>
                    <SelectItem value="scatter">Scatter</SelectItem>
                  </SelectContent>
                </Select>
              )}

              {onExport && (
                <Button variant="outline" size="sm" onClick={() => onExport('png')}>
                  <Download className="w-4 h-4 mr-2"/>
                  Export
                </Button>
              )}

              {showFullscreenToggle && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                >
                  {isFullscreen ? <Minimize className="w-4 h-4"/> : <Maximize className="w-4 h-4"/>}
                </Button>
              )}
            </div>
          </div>

          {/* Trend Indicators */}
          {trendIndicators && trendData && trendData.some(t => t) && (
            <div className="flex flex-wrap gap-2 mt-4">
              {trendData.map((trend) => {
                if (!trend) return null
                const series = processedSeries.find(s => s.id === trend.seriesId)
                return (
                  <Badge
                    key={trend.seriesId}
                    variant="outline"
                    className={cn(
                      "flex items-center space-x-1",
                      trend.trend === 'up' && "border-green-200 text-semantic-success",
                      trend.trend === 'down' && "border-red-200 text-semantic-error",
                      trend.trend === 'neutral' && "border-neutral-200 text-neutral-700"
                    )}
                  >
                    {trend.trend === 'up' && <TrendingUp className="w-3 h-3"/>}
                    {trend.trend === 'down' && <TrendingDown className="w-3 h-3"/>}
                    {trend.trend === 'neutral' && <Minus className="w-3 h-3"/>}
                    <span className="text-xs">
                      {series?.name}: {trend.change.toFixed(1)}%
                    </span>
                  </Badge>
                )
              })}
            </div>
          )}
        </CardHeader>
      )}

      <CardContent>
        <div
          className={cn(
            "w-full",
            isFullscreen && "fixed inset-0 z-50 bg-background p-6"
          )}
          style={{ height: isFullscreen ? 'calc(100vh - 12rem)' : height }}
        >
          <ResponsiveContainer width={typeof width === 'number' ? width : '100%'} height={"100%"}>
            {renderChart()}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export default AnalyticsChart