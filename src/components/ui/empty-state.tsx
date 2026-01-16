
'use client';

import * as React from 'react';
import { 
  Inbox, 
  Search, 
  FolderOpen, 
  Users, 
  FileText, 
  Calendar,
  BarChart3,
  MessageSquare,
  Plus,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getRandomMicrocopy } from '@/lib/microcopy';

type IllustrationType = 
  | 'inbox' 
  | 'search' 
  | 'projects' 
  | 'team' 
  | 'documents' 
  | 'calendar' 
  | 'analytics'
  | 'messages'
  | 'generic';

interface EmptyStateProps {
  illustration?: IllustrationType;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const illustrations: Record<IllustrationType, React.ComponentType<{ className?: string }>> = {
  inbox: Inbox,
  search: Search,
  projects: FolderOpen,
  team: Users,
  documents: FileText,
  calendar: Calendar,
  analytics: BarChart3,
  messages: MessageSquare,
  generic: FolderOpen,
};

const sizeClasses = {
  sm: {
    container: 'py-8',
    icon: 'w-12 h-12',
    title: 'text-base',
    description: 'text-sm',
  },
  md: {
    container: 'py-12',
    icon: 'w-16 h-16',
    title: 'text-lg',
    description: 'text-sm',
  },
  lg: {
    container: 'py-16',
    icon: 'w-20 h-20',
    title: 'text-xl',
    description: 'text-base',
  },
};

export function EmptyState({
  illustration = 'generic',
  title,
  description,
  action,
  secondaryAction,
  className,
  size = 'md',
}: EmptyStateProps) {
  const Icon = illustrations[illustration];
  const sizes = sizeClasses[size];

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center',
        sizes.container,
        'animate-in fade-in duration-300',
        className
      )}
    >
      {/* Illustration */}
      <div
        className={cn(
          'flex items-center justify-center rounded-full',
          'bg-neutral-100 dark:bg-neutral-800',
          'mb-4',
          size === 'sm' ? 'p-3' : size === 'md' ? 'p-4' : 'p-5'
        )}
      >
        <Icon className={cn(sizes.icon, 'text-neutral-400 dark:text-neutral-500')} />
      </div>

      {/* Title */}
      <h3 className={cn('font-semibold text-text-primary mb-1', sizes.title)}>
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p className={cn('text-text-muted max-w-sm mb-4', sizes.description)}>
          {description}
        </p>
      )}

      {/* Actions */}
      {(action || secondaryAction) && (
        <div className="flex items-center gap-3 mt-2">
          {action && (
            <button
              onClick={action.onClick}
              className={cn(
                'inline-flex items-center gap-2 px-4 py-2 rounded-lg',
                'bg-accent-primary text-white',
                'hover:bg-accent-secondary transition-colors',
                'font-medium text-sm'
              )}
            >
              {action.icon || <Plus className="w-4 h-4" />}
              {action.label}
            </button>
          )}
          {secondaryAction && (
            <button
              onClick={secondaryAction.onClick}
              className={cn(
                'px-4 py-2 rounded-lg',
                'text-text-secondary hover:text-text-primary',
                'hover:bg-surface-hover transition-colors',
                'font-medium text-sm'
              )}
            >
              {secondaryAction.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export function EmptySearchState({
  query,
  onClear,
  className,
}: {
  query: string;
  onClear?: () => void;
  className?: string;
}) {
  return (
    <EmptyState
      illustration="search"
      title="No results found"
      description={`We couldn't find anything matching "${query}". Try different keywords or filters.`}
      secondaryAction={onClear ? { label: 'Clear search', onClick: onClear } : undefined}
      className={className}
    />
  );
}

export function EmptyListState({
  itemType = 'items',
  onAdd,
  className,
}: {
  itemType?: string;
  onAdd?: () => void;
  className?: string;
}) {
  const microcopy = getRandomMicrocopy('emptyState');

  return (
    <EmptyState
      illustration="inbox"
      title={`No ${itemType} yet`}
      description={microcopy}
      action={onAdd ? { label: `Add ${itemType}`, onClick: onAdd } : undefined}
      className={className}
    />
  );
}

export function LoadingState({
  message,
  className,
}: {
  message?: string;
  className?: string;
}) {
  const microcopy = message || getRandomMicrocopy('loading');

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-12',
        className
      )}
    >
      <div className="relative w-12 h-12 mb-4">
        <div className="absolute inset-0 rounded-full border-2 border-neutral-200 dark:border-neutral-700" />
        <div className="absolute inset-0 rounded-full border-2 border-accent-primary border-t-transparent animate-spin" />
      </div>
      <p className="text-sm text-text-muted">{microcopy}</p>
    </div>
  );
}

export function ErrorState({
  title = 'Something went wrong',
  description,
  onRetry,
  className,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}) {
  const microcopy = description || getRandomMicrocopy('error');

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-12 text-center',
        className
      )}
    >
      <div className="w-16 h-16 mb-4 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
        <svg
          className="w-8 h-8 text-red-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-text-primary mb-1">{title}</h3>
      <p className="text-sm text-text-muted max-w-sm mb-4">{microcopy}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className={cn(
            'px-4 py-2 rounded-lg',
            'bg-accent-primary text-white',
            'hover:bg-accent-secondary transition-colors',
            'font-medium text-sm'
          )}
        >
          Try again
        </button>
      )}
    </div>
  );
}

export default EmptyState;
