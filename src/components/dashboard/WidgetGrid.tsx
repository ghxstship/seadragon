
'use client';

import * as React from 'react';
import { useState, useCallback, useRef } from 'react';
import { GripVertical, Settings, X, Maximize2, Minimize2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Widget {
  id: string;
  type: 'metric' | 'chart' | 'table' | 'activity' | 'custom';
  title: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  config: Record<string, unknown>;
  component?: React.ComponentType<{ config: Record<string, unknown> }>;
}

interface WidgetGridProps {
  widgets: Widget[];
  onWidgetsChange: (widgets: Widget[]) => void;
  onWidgetConfigure?: (widget: Widget) => void;
  onWidgetRemove?: (widgetId: string) => void;
  columns?: number;
  gap?: number;
  className?: string;
  editable?: boolean;
}

interface DragState {
  widgetId: string | null;
  startPosition: { x: number; y: number };
  currentPosition: { x: number; y: number };
}

export function WidgetGrid({
  widgets,
  onWidgetsChange,
  onWidgetConfigure,
  onWidgetRemove,
  columns = 3,
  gap = 16,
  className,
  editable = true,
}: WidgetGridProps) {
  const [dragState, setDragState] = useState<DragState>({
    widgetId: null,
    startPosition: { x: 0, y: 0 },
    currentPosition: { x: 0, y: 0 },
  });
  const [expandedWidget, setExpandedWidget] = useState<string | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const handleDragStart = useCallback((
    e: React.DragEvent<HTMLDivElement>,
    widgetId: string
  ) => {
    if (!editable) return;
    
    e.dataTransfer.effectAllowed = 'move';
    setDragState({
      widgetId,
      startPosition: { x: e.clientX, y: e.clientY },
      currentPosition: { x: e.clientX, y: e.clientY },
    });
  }, [editable]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDrop = useCallback((
    e: React.DragEvent<HTMLDivElement>,
    targetIndex: number
  ) => {
    e.preventDefault();
    
    if (!dragState.widgetId) return;

    const sourceIndex = widgets.findIndex((w) => w.id === dragState.widgetId);
    if (sourceIndex === -1 || sourceIndex === targetIndex) return;

    const newWidgets = [...widgets];
    const [removed] = newWidgets.splice(sourceIndex, 1);
    newWidgets.splice(targetIndex, 0, removed);

    onWidgetsChange(newWidgets);
    setDragState({
      widgetId: null,
      startPosition: { x: 0, y: 0 },
      currentPosition: { x: 0, y: 0 },
    });
  }, [dragState.widgetId, widgets, onWidgetsChange]);

  const handleDragEnd = useCallback(() => {
    setDragState({
      widgetId: null,
      startPosition: { x: 0, y: 0 },
      currentPosition: { x: 0, y: 0 },
    });
  }, []);

  const toggleExpand = useCallback((widgetId: string) => {
    setExpandedWidget((prev) => (prev === widgetId ? null : widgetId));
  }, []);

  return (
    <div
      ref={gridRef}
      className={cn(
        'grid auto-rows-min',
        className
      )}
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gap: `${gap}px`,
      }}
    >
      {widgets.map((widget, index) => {
        const isExpanded = expandedWidget === widget.id;
        const isDragging = dragState.widgetId === widget.id;

        return (
          <div
            key={widget.id}
            className={cn(
              'relative group',
              'bg-bg-elevated border border-border-default rounded-xl',
              'transition-all duration-200',
              isDragging && 'opacity-50 scale-95',
              isExpanded && 'col-span-full row-span-2',
              !isExpanded && widget.size.width > 1 && `col-span-${Math.min(widget.size.width, columns)}`,
              'hover:shadow-md hover:border-border-strong'
            )}
            style={{
              gridColumn: isExpanded ? '1 / -1' : undefined,
              minHeight: isExpanded ? '400px' : '200px',
            }}
            draggable={editable && !isExpanded}
            onDragStart={(e) => handleDragStart(e, widget.id)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
          >
            {/* Widget Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border-default">
              <div className="flex items-center gap-2">
                {editable && !isExpanded && (
                  <GripVertical className="w-4 h-4 text-text-muted cursor-grab opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
                <h3 className="font-medium text-text-primary">{widget.title}</h3>
              </div>

              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => toggleExpand(widget.id)}
                  className="p-1.5 rounded-md hover:bg-surface-hover text-text-muted hover:text-text-primary transition-colors"
                  aria-label={isExpanded ? 'Minimize' : 'Maximize'}
                >
                  {isExpanded ? (
                    <Minimize2 className="w-4 h-4" />
                  ) : (
                    <Maximize2 className="w-4 h-4" />
                  )}
                </button>

                {onWidgetConfigure && (
                  <button
                    onClick={() => onWidgetConfigure(widget)}
                    className="p-1.5 rounded-md hover:bg-surface-hover text-text-muted hover:text-text-primary transition-colors"
                    aria-label="Configure widget"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                )}

                {onWidgetRemove && editable && (
                  <button
                    onClick={() => onWidgetRemove(widget.id)}
                    className="p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 text-text-muted hover:text-red-600 transition-colors"
                    aria-label="Remove widget"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Widget Content */}
            <div className="p-4">
              {widget.component ? (
                <widget.component config={widget.config} />
              ) : (
                <WidgetPlaceholder type={widget.type} />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function WidgetPlaceholder({ type }: { type: Widget['type'] }) {
  return (
    <div className="flex items-center justify-center h-32 text-text-muted">
      <span className="text-sm">Widget: {type}</span>
    </div>
  );
}

export interface MetricWidgetProps {
  title: string;
  value: number | string;
  trend?: { direction: 'up' | 'down' | 'flat'; percentage: number };
  sparklineData?: number[];
  comparisonPeriod?: string;
  prefix?: string;
  suffix?: string;
}

export function MetricWidget({
  title,
  value,
  trend,
  sparklineData,
  comparisonPeriod,
  prefix,
  suffix,
}: MetricWidgetProps) {
  const formattedValue = typeof value === 'number' 
    ? value.toLocaleString() 
    : value;

  return (
    <div className="space-y-2">
      <p className="text-sm text-text-muted">{title}</p>
      
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-semibold text-text-primary">
          {prefix}{formattedValue}{suffix}
        </span>
        
        {trend && (
          <span
            className={cn(
              'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium',
              trend.direction === 'up' && 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20',
              trend.direction === 'down' && 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20',
              trend.direction === 'flat' && 'text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-900/20'
            )}
          >
            {trend.direction === 'up' ? '↑' : trend.direction === 'down' ? '↓' : '→'}
            {trend.percentage.toFixed(1)}%
          </span>
        )}
      </div>

      {sparklineData && sparklineData.length > 0 && (
        <div className="h-8 mt-2">
          <MiniSparkline data={sparklineData} />
        </div>
      )}

      {comparisonPeriod && (
        <p className="text-xs text-text-muted">vs. {comparisonPeriod}</p>
      )}
    </div>
  );
}

function MiniSparkline({ data }: { data: number[] }) {
  const width = 100;
  const height = 32;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((value, index) => ({
    x: (index / Math.max(data.length - 1, 1)) * width,
    y: height - ((value - min) / range) * (height - 4) - 2,
  }));

  const pathD = points
    .map((point, i) => `${i === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ');

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      <path
        d={pathD}
        fill="none"
        stroke="var(--color-accent-primary)"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default WidgetGrid;
