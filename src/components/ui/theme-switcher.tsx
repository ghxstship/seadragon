
'use client';

import * as React from 'react';
import { Sun, Moon, CloudMoon, Monitor } from 'lucide-react';
import { useThemeContext } from '@/contexts/ThemeContext';
import { ThemeMode } from '@/lib/design-system/themes';
import { cn } from '@/lib/utils';

interface ThemeSwitcherProps {
  variant?: 'buttons' | 'dropdown' | 'toggle';
  showLabels?: boolean;
  className?: string;
}

const themeOptions: Array<{
  value: ThemeMode;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}> = [
  {
    value: 'light',
    label: 'Light',
    icon: Sun,
    description: 'Light mode for daytime use',
  },
  {
    value: 'dark',
    label: 'Dark',
    icon: Moon,
    description: 'Dark mode for reduced eye strain',
  },
  {
    value: 'lowLight',
    label: 'Low Light',
    icon: CloudMoon,
    description: 'Soft, atmospheric mode for late night',
  },
  {
    value: 'auto',
    label: 'Auto',
    icon: Monitor,
    description: 'Follow system preference',
  },
];

export function ThemeSwitcher({
  variant = 'buttons',
  showLabels = false,
  className,
}: ThemeSwitcherProps) {
  const { mode, setTheme } = useThemeContext();

  if (variant === 'toggle') {
    return (
      <button
        onClick={() => {
          const themeOrder: ThemeMode[] = ['light', 'dark', 'lowLight'];
          const currentIndex = themeOrder.indexOf(mode === 'auto' ? 'light' : mode);
          const nextIndex = (currentIndex + 1) % themeOrder.length;
          setTheme(themeOrder[nextIndex]);
        }}
        className={cn(
          'relative inline-flex h-10 w-10 items-center justify-center rounded-lg',
          'bg-surface-default hover:bg-surface-hover',
          'border border-border-default',
          'transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2',
          className
        )}
        aria-label="Toggle theme"
      >
        <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:rotate-90 dark:scale-0" />
        <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      </button>
    );
  }

  return (
    <div
      className={cn('flex items-center gap-1 p-1 rounded-lg bg-surface-default', className)}
      role="radiogroup"
      aria-label="Theme selection"
    >
      {themeOptions.map(({ value, label, icon: Icon, description }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          className={cn(
            'relative flex items-center justify-center gap-2 px-3 py-2 rounded-md',
            'transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-1',
            mode === value
              ? 'bg-accent-primary text-text-inverse shadow-sm'
              : 'hover:bg-surface-hover text-text-secondary hover:text-text-primary'
          )}
          role="radio"
          aria-checked={mode === value}
          aria-label={description}
          title={description}
        >
          <Icon className="h-4 w-4" />
          {showLabels && (
            <span className="text-sm font-medium">{label}</span>
          )}
        </button>
      ))}
    </div>
  );
}

export function ThemeDropdown({ className }: { className?: string }) {
  const { mode, setTheme } = useThemeContext();
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const currentTheme = themeOptions.find((t) => t.value === mode) || themeOptions[0];
  const CurrentIcon = currentTheme.icon;

  // Handle click outside to close dropdown
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Close on escape
  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className={cn('relative', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-lg',
          'bg-surface-default hover:bg-surface-hover',
          'border border-border-default',
          'transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2'
        )}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <CurrentIcon className="h-4 w-4" />
        <span className="text-sm font-medium">{currentTheme.label}</span>
        <svg
          className={cn(
            'h-4 w-4 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div
          className={cn(
            'absolute right-0 mt-2 w-48 py-1 rounded-lg',
            'bg-surface-elevated border border-border-default',
            'shadow-lg z-50',
            'animate-in fade-in-0 zoom-in-95 duration-200'
          )}
          role="listbox"
        >
          {themeOptions.map(({ value, label, icon: Icon, description }) => (
            <button
              key={value}
              onClick={() => {
                setTheme(value);
                setIsOpen(false);
              }}
              className={cn(
                'flex items-center gap-3 w-full px-3 py-2',
                'transition-colors duration-150',
                mode === value
                  ? 'bg-accent-primary/10 text-accent-primary'
                  : 'hover:bg-surface-hover text-text-primary'
              )}
              role="option"
              aria-selected={mode === value}
            >
              <Icon className="h-4 w-4" />
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium">{label}</span>
                <span className="text-xs text-text-muted">{description}</span>
              </div>
              {mode === value && (
                <svg
                  className="ml-auto h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ThemeSwitcher;
