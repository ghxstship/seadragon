
'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import { useBehaviorContext } from '@/contexts/BehaviorContext';
import { useThemeContext } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

interface LayoutConfig {
  sidebarPosition: 'left' | 'right' | 'hidden';
  primaryWidgets: string[];
  density: 'compact' | 'comfortable' | 'spacious';
  sidebarCollapsed: boolean;
}

interface AdaptiveLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  defaultConfig?: Partial<LayoutConfig>;
  onLayoutChange?: (config: LayoutConfig) => void;
}

const defaultLayoutConfig: LayoutConfig = {
  sidebarPosition: 'left',
  primaryWidgets: [],
  density: 'comfortable',
  sidebarCollapsed: false,
};

const densityClasses = {
  compact: {
    padding: 'p-2',
    gap: 'gap-2',
    text: 'text-sm',
  },
  comfortable: {
    padding: 'p-4',
    gap: 'gap-4',
    text: 'text-base',
  },
  spacious: {
    padding: 'p-6',
    gap: 'gap-6',
    text: 'text-base',
  },
};

export function AdaptiveLayout({
  children,
  sidebar,
  header,
  footer,
  className,
  defaultConfig,
  onLayoutChange,
}: AdaptiveLayoutProps) {
  const { suggestedLayout, timeOfDay, userRole, isInitialized } = useBehaviorContext();
  const { setTheme } = useThemeContext();
  
  const [layout, setLayout] = useState<LayoutConfig>({
    ...defaultLayoutConfig,
    ...defaultConfig,
  });
  
  const [isAdapting, setIsAdapting] = useState(false);
  const [showAdaptationNotice, setShowAdaptationNotice] = useState(false);

  // Apply adaptive layout changes gradually
  useEffect(() => {
    if (!isInitialized || !suggestedLayout) return;

    const newLayout: LayoutConfig = {
      sidebarPosition: suggestedLayout.sidebarPosition,
      primaryWidgets: suggestedLayout.primaryWidgets,
      density: suggestedLayout.density,
      sidebarCollapsed: layout.sidebarCollapsed,
    };
    
    // Check if layout actually changed
    const hasChanges = 
      newLayout.sidebarPosition !== layout.sidebarPosition ||
      newLayout.density !== layout.density ||
      JSON.stringify(newLayout.primaryWidgets) !== JSON.stringify(layout.primaryWidgets);

    if (hasChanges) {
      setIsAdapting(true);
      setShowAdaptationNotice(true);

      // Apply changes after a brief delay for smooth transition
      const timer = setTimeout(() => {
        setLayout(newLayout);
        onLayoutChange?.(newLayout);
        setIsAdapting(false);
        
        // Hide notice after 3 seconds
        setTimeout(() => setShowAdaptationNotice(false), 3000);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [isInitialized, suggestedLayout, layout.sidebarPosition, layout.density, layout.primaryWidgets, layout.sidebarCollapsed, onLayoutChange]);

  // Apply theme based on time of day
  useEffect(() => {
    if (suggestedLayout?.colorScheme && suggestedLayout.colorScheme !== 'auto') {
      setTheme(suggestedLayout.colorScheme);
    }
  }, [suggestedLayout?.colorScheme, setTheme]);

  const density = densityClasses[layout.density];

  const toggleSidebar = () => {
    setLayout((prev) => ({
      ...prev,
      sidebarCollapsed: !prev.sidebarCollapsed,
    }));
  };

  const sidebarWidth = layout.sidebarCollapsed ? 'w-16' : 'w-64';

  return (
    <div
      className={cn(
        'min-h-screen flex flex-col',
        'bg-bg-primary text-text-primary',
        'transition-all duration-300',
        isAdapting && 'opacity-95',
        className
      )}
      data-density={layout.density}
      data-sidebar-position={layout.sidebarPosition}
    >
      {/* Adaptation Notice */}
      {showAdaptationNotice && (
        <div
          className={cn(
            'fixed top-4 right-4 z-50',
            'px-4 py-2 rounded-lg',
            'bg-accent-primary/10 border border-accent-primary/20',
            'text-sm text-accent-primary',
            'animate-in fade-in slide-in-from-top-2 duration-300'
          )}
        >
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Layout adapted based on your activity
          </span>
        </div>
      )}

      {/* Header */}
      {header && (
        <header className={cn('sticky top-0 z-40 border-b border-border-default', density.padding)}>
          {header}
        </header>
      )}

      {/* Main Content Area */}
      <div className={cn('flex flex-1', density.gap)}>
        {/* Left Sidebar */}
        {sidebar && layout.sidebarPosition === 'left' && (
          <aside
            className={cn(
              'flex-shrink-0 border-r border-border-default',
              'bg-bg-secondary',
              'transition-all duration-300',
              sidebarWidth,
              density.padding
            )}
          >
            <div className="sticky top-20">
              {!layout.sidebarCollapsed && sidebar}
              <button
                onClick={toggleSidebar}
                className={cn(
                  'absolute -right-3 top-6',
                  'w-6 h-6 rounded-full',
                  'bg-bg-elevated border border-border-default',
                  'flex items-center justify-center',
                  'hover:bg-surface-hover transition-colors',
                  'focus:outline-none focus:ring-2 focus:ring-accent-primary'
                )}
                aria-label={layout.sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                <svg
                  className={cn(
                    'w-4 h-4 transition-transform',
                    layout.sidebarCollapsed && 'rotate-180'
                  )}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </div>
          </aside>
        )}

        {/* Main Content */}
        <main
          className={cn(
            'flex-1 min-w-0',
            density.padding,
            density.text
          )}
        >
          {children}
        </main>

        {/* Right Sidebar */}
        {sidebar && layout.sidebarPosition === 'right' && (
          <aside
            className={cn(
              'flex-shrink-0 border-l border-border-default',
              'bg-bg-secondary',
              'transition-all duration-300',
              sidebarWidth,
              density.padding
            )}
          >
            <div className="sticky top-20">
              {!layout.sidebarCollapsed && sidebar}
              <button
                onClick={toggleSidebar}
                className={cn(
                  'absolute -left-3 top-6',
                  'w-6 h-6 rounded-full',
                  'bg-bg-elevated border border-border-default',
                  'flex items-center justify-center',
                  'hover:bg-surface-hover transition-colors',
                  'focus:outline-none focus:ring-2 focus:ring-accent-primary'
                )}
                aria-label={layout.sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                <svg
                  className={cn(
                    'w-4 h-4 transition-transform',
                    !layout.sidebarCollapsed && 'rotate-180'
                  )}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </aside>
        )}
      </div>

      {/* Footer */}
      {footer && (
        <footer className={cn('border-t border-border-default', density.padding)}>
          {footer}
        </footer>
      )}
    </div>
  );
}

export function DynamicSidebar({
  widgets,
  className,
}: {
  widgets: string[];
  className?: string;
}) {
  return (
    <nav className={cn('space-y-2', className)}>
      {widgets.map((widget) => (
        <div
          key={widget}
          className={cn(
            'p-3 rounded-lg',
            'bg-surface-default hover:bg-surface-hover',
            'border border-border-default',
            'transition-colors duration-200',
            'cursor-pointer'
          )}
        >
          <span className="text-sm font-medium">{widget}</span>
        </div>
      ))}
    </nav>
  );
}

export default AdaptiveLayout;
