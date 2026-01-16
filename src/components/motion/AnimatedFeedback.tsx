
'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, Loader2, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

type FeedbackType = 'success' | 'error' | 'warning' | 'loading' | 'info';

interface AnimatedFeedbackProps {
  type: FeedbackType;
  message: string;
  show: boolean;
  onComplete?: () => void;
  duration?: number;
  className?: string;
}

const feedbackConfig: Record<FeedbackType, {
  icon: React.ComponentType<{ className?: string }>;
  bgColor: string;
  textColor: string;
  borderColor: string;
}> = {
  success: {
    icon: CheckCircle,
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    textColor: 'text-green-700 dark:text-green-400',
    borderColor: 'border-green-200 dark:border-green-800',
  },
  error: {
    icon: XCircle,
    bgColor: 'bg-red-50 dark:bg-red-900/20',
    textColor: 'text-red-700 dark:text-red-400',
    borderColor: 'border-red-200 dark:border-red-800',
  },
  warning: {
    icon: AlertCircle,
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
    textColor: 'text-yellow-700 dark:text-yellow-400',
    borderColor: 'border-yellow-200 dark:border-yellow-800',
  },
  loading: {
    icon: Loader2,
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    textColor: 'text-blue-700 dark:text-blue-400',
    borderColor: 'border-blue-200 dark:border-blue-800',
  },
  info: {
    icon: Info,
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    textColor: 'text-blue-700 dark:text-blue-400',
    borderColor: 'border-blue-200 dark:border-blue-800',
  },
};

const animations: Record<FeedbackType, string> = {
  success: 'animate-in zoom-in-95 fade-in duration-300',
  error: 'animate-in shake duration-500',
  warning: 'animate-in slide-in-from-top-2 fade-in duration-300',
  loading: '',
  info: 'animate-in slide-in-from-right-2 fade-in duration-300',
};

export function AnimatedFeedback({
  type,
  message,
  show,
  onComplete,
  duration = 3000,
  className,
}: AnimatedFeedbackProps) {
  const [isVisible, setIsVisible] = useState(false);
  const config = feedbackConfig[type];
  const Icon = config.icon;

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      
      if (type !== 'loading' && duration > 0) {
        const timer = setTimeout(() => {
          setIsVisible(false);
          onComplete?.();
        }, duration);
        
        return () => clearTimeout(timer);
      }
    } else {
      setIsVisible(false);
    }
    
    return undefined;
  }, [show, type, duration, onComplete]);

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-lg border',
        config.bgColor,
        config.textColor,
        config.borderColor,
        animations[type],
        'transition-all duration-300',
        className
      )}
      role={type === 'error' ? 'alert' : 'status'}
      aria-live={type === 'error' ? 'assertive' : 'polite'}
    >
      <Icon 
        className={cn(
          'w-5 h-5 flex-shrink-0',
          type === 'loading' && 'animate-spin'
        )} 
      />
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
}

export function AnimatedButton({
  children,
  isLoading = false,
  loadingText = 'Loading...',
  onClick,
  variant = 'primary',
  className,
  disabled,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  isLoading?: boolean;
  loadingText?: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
}) {
  const [isPressed, setIsPressed] = useState(false);

  const variantClasses = {
    primary: 'bg-accent-primary text-white hover:bg-accent-secondary',
    secondary: 'bg-surface-default border border-border-default hover:bg-surface-hover',
    ghost: 'hover:bg-surface-hover',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };

  return (
    <button
      className={cn(
        'relative inline-flex items-center justify-center gap-2',
        'px-4 py-2 rounded-lg font-medium text-sm',
        'transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variantClasses[variant],
        isPressed && 'scale-[0.98]',
        className
      )}
      onClick={onClick}
      disabled={disabled || isLoading}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>{loadingText}</span>
        </>
      ) : (
        children
      )}
      
      {/* Ripple effect overlay */}
      <span className="absolute inset-0 overflow-hidden rounded-lg">
        <span className="ripple-effect" />
      </span>
    </button>
  );
}

export function AnimatedNumber({
  value,
  duration = 1000,
  formatFn = (n: number) => n.toLocaleString(),
  className,
}: {
  value: number;
  duration?: number;
  formatFn?: (n: number) => string;
  className?: string;
}) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const startValue = displayValue;
    const diff = value - startValue;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = startValue + diff * eased;
      
      setDisplayValue(current);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration, displayValue]);

  return (
    <span className={cn('tabular-nums', className)}>
      {formatFn(Math.round(displayValue))}
    </span>
  );
}

export function Skeleton({
  width,
  height,
  variant = 'rect',
  className,
}: {
  width?: string | number;
  height?: string | number;
  variant?: 'text' | 'rect' | 'circle';
  className?: string;
}) {
  const variantClasses = {
    text: 'rounded',
    rect: 'rounded-lg',
    circle: 'rounded-full',
  };

  return (
    <div
      className={cn(
        'animate-pulse bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200',
        'dark:from-neutral-800 dark:via-neutral-700 dark:to-neutral-800',
        variantClasses[variant],
        className
      )}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
      }}
      aria-hidden="true"
    />
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('p-4 rounded-lg border border-border-default', className)}>
      <Skeleton variant="rect" height={120} className="mb-4" />
      <div className="space-y-2">
        <Skeleton variant="text" width="80%" height={16} />
        <Skeleton variant="text" width="60%" height={16} />
        <Skeleton variant="text" width="40%" height={16} />
      </div>
    </div>
  );
}

export function AnimatedList<T>({
  items,
  renderItem,
  keyExtractor,
  className,
  staggerDelay = 50,
}: {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T) => string;
  className?: string;
  staggerDelay?: number;
}) {
  return (
    <ul className={cn('space-y-2', className)}>
      {items.map((item, index) => (
        <li
          key={keyExtractor(item)}
          className="animate-in fade-in slide-in-from-left-2"
          style={{
            animationDelay: `${index * staggerDelay}ms`,
            animationFillMode: 'both',
          }}
        >
          {renderItem(item, index)}
        </li>
      ))}
    </ul>
  );
}

export function ProgressBar({
  value,
  max = 100,
  showLabel = false,
  size = 'md',
  variant = 'default',
  className,
}: {
  value: number;
  max?: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'error';
  className?: string;
}) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  const variantClasses = {
    default: 'bg-accent-primary',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
  };

  return (
    <div className={cn('w-full', className)}>
      <div
        className={cn(
          'w-full bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden',
          sizeClasses[size]
        )}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500 ease-out',
            variantClasses[variant]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-sm text-text-muted mt-1">
          {Math.round(percentage)}%
        </span>
      )}
    </div>
  );
}

export default AnimatedFeedback;
