
'use client';

import * as React from 'react';
import { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  BarChart,
  AreaChart,
  Line,
  Bar,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import { Sparkles, BarChart3, LineChartIcon, AreaChartIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { colors } from '@/lib/design-system/tokens'

export interface DataPoint {
  [key: string]: string | number;
}

export interface Anomaly {
  x: string | number;
  label: string;
  severity: 'low' | 'medium' | 'high';
}

export interface ChartRecommendation {
  type: 'line' | 'bar' | 'area';
  confidence: number;
  reason: string;
}

interface SmartChartProps {
  data: DataPoint[];
  type?: 'auto' | 'line' | 'bar' | 'area';
  xKey: string;
  yKeys: string[];
  anomalies?: Anomaly[];
  insights?: string[];
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  className?: string;
}

const chartColors: string[] = [
  'var(--color-accent-primary, #3b82f6)',
  colors.semantic.success[500],
  colors.semantic.warning[500],
  colors.semantic.error[500],
  colors.semantic.info[500],
  colors.extended.violet[500],
  colors.extended.pink[500],
  colors.extended.orange[500],
];

function recommendChartType(data: DataPoint[], xKey: string): ChartRecommendation[] {
  const recommendations: ChartRecommendation[] = [];
  
  if (data.length === 0) {
    return [{ type: 'bar', confidence: 0.5, reason: 'Default for empty data' }];
  }

  const firstXValue = data[0]?.[xKey];
  if (firstXValue === undefined || firstXValue === null) {
    return [{ type: 'bar', confidence: 0.6, reason: 'Fallback when x-axis value missing' }];
  }
  const isTimeSeries = typeof firstXValue === 'string' && 
    (firstXValue.includes('-') || firstXValue.includes('/') || 
     /^\d{4}/.test(firstXValue) || /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/i.test(firstXValue));

  if (isTimeSeries) {
    recommendations.push({
      type: 'line',
      confidence: 0.9,
      reason: 'Time-series data is best shown with line charts',
    });
    recommendations.push({
      type: 'area',
      confidence: 0.7,
      reason: 'Area charts emphasize magnitude over time',
    });
  }

  if (data.length <= 12) {
    recommendations.push({
      type: 'bar',
      confidence: isTimeSeries ? 0.6 : 0.85,
      reason: 'Bar charts work well for comparing categories',
    });
  }

  if (recommendations.length === 0) {
    recommendations.push({
      type: 'line',
      confidence: 0.7,
      reason: 'Default recommendation for continuous data',
    });
  }

  return recommendations.sort((a, b) => b.confidence - a.confidence);
}

function formatNumber(value: number): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toLocaleString();
}

const ChartTypeIcon: React.FC<{ type: string; className?: string }> = ({ type, className }) => {
  switch (type) {
    case 'line':
      return <LineChartIcon className={className} />;
    case 'bar':
      return <BarChart3 className={className} />;
    case 'area':
      return <AreaChartIcon className={className} />;
    default:
      return <BarChart3 className={className} />;
  }
};

const CustomTooltip: React.FC<{
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}> = ({ active, payload, label }) => {
  if (!active || !payload) return null;

  return (
    <div className="bg-bg-elevated border border-border-default rounded-lg shadow-lg p-3">
      <p className="text-sm font-medium text-text-primary mb-2">{label}</p>
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2 text-sm">
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-text-muted">{entry.name}:</span>
          <span className="font-medium text-text-primary">
            {formatNumber(entry.value)}
          </span>
        </div>
      ))}
    </div>
  );
};

export function SmartChart({
  data,
  type = 'auto',
  xKey,
  yKeys,
  anomalies = [],
  insights = [],
  height = 300,
  showGrid = true,
  showLegend = true,
  className,
}: SmartChartProps) {
  const recommendations = useMemo(
    () => (type === 'auto' ? recommendChartType(data, xKey) : []),
    [data, xKey, type]
  );

  const [selectedType, setSelectedType] = useState<'line' | 'bar' | 'area'>(
    type === 'auto' ? recommendations[0]?.type || 'line' : type
  );

  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 10, right: 30, left: 0, bottom: 0 },
    };

    const renderContent = () => (
      <>
        {showGrid && (
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--border-default)"
            opacity={0.5}
          />
        )}
        <XAxis
          dataKey={xKey}
          tick={{ fontSize: 12, fill: 'var(--text-muted)' }}
          tickLine={false}
          axisLine={{ stroke: 'var(--border-default)' }}
        />
        <YAxis
          tick={{ fontSize: 12, fill: 'var(--text-muted)' }}
          tickLine={false}
          axisLine={false}
          tickFormatter={formatNumber}
        />
        <Tooltip content={<CustomTooltip />} />
        {showLegend && <Legend />}

        {yKeys.map((key, idx) => {
          const color = chartColors[idx % chartColors.length] ?? colors.extended.chart.default;
          
          switch (selectedType) {
            case 'line':
              return (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={color}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6, fill: color }}
                />
              );
            case 'bar':
              return (
                <Bar
                  key={key}
                  dataKey={key}
                  fill={color}
                  radius={[4, 4, 0, 0]}
                />
              );
            case 'area':
              return (
                <Area
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={color}
                  fill={color}
                  fillOpacity={0.2}
                />
              );
            default:
              return null;
          }
        })}

        {anomalies.map((anomaly, idx) => (
          <ReferenceLine
            key={idx}
            x={anomaly.x}
            stroke={
              anomaly.severity === 'high'
                ? 'var(--color-error)'
                : anomaly.severity === 'medium'
                ? 'var(--color-warning)'
                : 'var(--color-info)'
            }
            strokeDasharray="3 3"
            label={{
              value: anomaly.label,
              position: 'top',
              fill: 'var(--text-muted)',
              fontSize: 11,
            }}
          />
        ))}
      </>
    );

    switch (selectedType) {
      case 'line':
        return <LineChart {...commonProps}>{renderContent()}</LineChart>;
      case 'bar':
        return <BarChart {...commonProps}>{renderContent()}</BarChart>;
      case 'area':
        return <AreaChart {...commonProps}>{renderContent()}</AreaChart>;
      default:
        return <LineChart {...commonProps}>{renderContent()}</LineChart>;
    }
  };

  return (
    <div className={cn('w-full', className)}>
      {/* Chart type selector */}
      {type === 'auto' && recommendations.length > 1 && (
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm text-text-muted">Chart type:</span>
          {recommendations.slice(0, 3).map((rec) => (
            <button
              key={rec.type}
              onClick={() => setSelectedType(rec.type)}
              className={cn(
                'p-2 rounded-lg transition-colors',
                selectedType === rec.type
                  ? 'bg-accent-primary text-white'
                  : 'bg-surface-default hover:bg-surface-hover text-text-muted'
              )}
              title={rec.reason}
            >
              <ChartTypeIcon type={rec.type} className="w-4 h-4" />
            </button>
          ))}
        </div>
      )}

      {/* AI Insights */}
      {insights.length > 0 && (
        <div className="flex items-center gap-2 mb-4 p-3 rounded-lg bg-accent-primary/5 border border-accent-primary/20">
          <Sparkles className="w-4 h-4 text-accent-primary flex-shrink-0" />
          <p className="text-sm text-text-secondary">{insights[0]}</p>
        </div>
      )}

      {/* Chart */}
      <ResponsiveContainer width="100%" height={height}>
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
}

export function Sparkline({
  data,
  width = 100,
  height = 32,
  color = 'var(--color-accent-primary)',
  showArea = true,
  className,
}: {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  showArea?: boolean;
  className?: string;
}) {
  const points: { x: number; y: number }[] = useMemo(() => {
    if (data.length === 0) return [];
    
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    return data.map((value, index) => ({
      x: (index / Math.max(data.length - 1, 1)) * width,
      y: height - ((value - min) / range) * (height - 4) - 2,
    }));
  }, [data, width, height]);

  if (points.length === 0) return null;

  const pathD = points
    .map((point, i) => `${i === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ');

  const areaD = `${pathD} L ${width} ${height} L 0 ${height} Z`;

  let trend = 0;
  const firstValue = data[0];
  const lastValue = data[data.length - 1];
  if (data.length >= 2 && firstValue !== undefined && lastValue !== undefined) {
    trend = lastValue - firstValue;
  }
  const trendColor = trend >= 0 ? 'var(--color-success)' : 'var(--color-error)';

  const lastPoint = points.at(-1)

  return (
    <svg
      width={width}
      height={height}
      className={cn('sparkline', className)}
      role="img"
      aria-label={`Trend: ${trend >= 0 ? 'up' : 'down'} ${Math.abs(trend).toFixed(1)}`}
    >
      {showArea && (
        <path d={areaD} fill={color} fillOpacity={0.1} />
      )}
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {lastPoint && (
        <circle
          cx={lastPoint.x}
          cy={lastPoint.y}
          r={2.5}
          fill={trendColor}
        />
      )}
    </svg>
  );
}

export function TrendIndicator({
  direction,
  percentage,
  className,
}: {
  direction: 'up' | 'down' | 'flat';
  percentage: number;
  className?: string;
}) {
  const colors = {
    up: 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20',
    down: 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20',
    flat: 'text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-900/20',
  };

  const arrows = {
    up: '↑',
    down: '↓',
    flat: '→',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium',
        colors[direction],
        className
      )}
    >
      <span>{arrows[direction]}</span>
      <span>{percentage.toFixed(1)}%</span>
    </span>
  );
}

export default SmartChart;
