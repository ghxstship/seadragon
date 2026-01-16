
'use client';

import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { Sparkles, X, ChevronRight, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PredictiveEngine, getCurrentContext, PredictedAction } from '@/services/predictiveActions';

interface SmartSuggestionsProps {
  className?: string;
  maxSuggestions?: number;
  position?: 'inline' | 'floating' | 'sidebar';
}

export function SmartSuggestions({
  className,
  maxSuggestions = 3,
  position = 'inline',
}: SmartSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<PredictedAction[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [engine] = useState(() => new PredictiveEngine());

  useEffect(() => {
    const loadSuggestions = async () => {
      setIsLoading(true);
      const context = getCurrentContext();
      const predictions = await engine.predictNextActions(context);
      setSuggestions(predictions.slice(0, maxSuggestions));
      setIsLoading(false);
    };

    loadSuggestions();

    // Refresh suggestions every 5 minutes
    const interval = setInterval(loadSuggestions, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [engine, maxSuggestions]);

  const handleDismiss = useCallback((id: string) => {
    setDismissed((prev) => new Set([...prev, id]));
    engine.dismissSuggestion(id);
    setSuggestions((prev) => prev.filter((s) => s.id !== id));
  }, [engine]);

  const handleAction = useCallback(async (suggestion: PredictedAction) => {
    await suggestion.trigger();
    handleDismiss(suggestion.id);
  }, [handleDismiss]);

  const visibleSuggestions = suggestions.filter((s) => !dismissed.has(s.id));

  if (isLoading || visibleSuggestions.length === 0) {
    return null;
  }

  if (position === 'floating') {
    return (
      <div
        className={cn(
          'fixed bottom-4 right-4 z-40',
          'w-80 p-4 rounded-xl',
          'bg-bg-elevated border border-border-default shadow-xl',
          'animate-in slide-in-from-bottom-4 fade-in duration-300',
          className
        )}
      >
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-accent-primary" />
          <span className="text-sm font-medium text-text-primary">Suggestions</span>
        </div>
        <div className="space-y-2">
          {visibleSuggestions.map((suggestion) => (
            <SuggestionCard
              key={suggestion.id}
              suggestion={suggestion}
              onAction={handleAction}
              onDismiss={handleDismiss}
              compact
            />
          ))}
        </div>
      </div>
    );
  }

  if (position === 'sidebar') {
    return (
      <div className={cn('space-y-3', className)}>
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-accent-primary" />
          <span className="text-sm font-medium text-text-primary">Quick Actions</span>
        </div>
        {visibleSuggestions.map((suggestion) => (
          <SuggestionCard
            key={suggestion.id}
            suggestion={suggestion}
            onAction={handleAction}
            onDismiss={handleDismiss}
            compact
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'p-4 rounded-xl',
        'bg-accent-primary/5 border border-accent-primary/20',
        className
      )}
    >
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-accent-primary" />
        <span className="text-sm font-medium text-text-primary">
          Suggested for you
        </span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {visibleSuggestions.map((suggestion) => (
          <SuggestionCard
            key={suggestion.id}
            suggestion={suggestion}
            onAction={handleAction}
            onDismiss={handleDismiss}
          />
        ))}
      </div>
    </div>
  );
}

interface SuggestionCardProps {
  suggestion: PredictedAction;
  onAction: (suggestion: PredictedAction) => void;
  onDismiss: (id: string) => void;
  compact?: boolean;
}

function SuggestionCard({
  suggestion,
  onAction,
  onDismiss,
  compact = false,
}: SuggestionCardProps) {
  return (
    <div
      className={cn(
        'group relative flex items-center gap-3',
        'p-3 rounded-lg',
        'bg-bg-elevated border border-border-default',
        'hover:border-accent-primary/50 hover:shadow-sm',
        'transition-all duration-200',
        compact && 'p-2'
      )}
    >
      <button
        onClick={() => onAction(suggestion)}
        className="flex-1 flex items-center gap-3 text-left"
      >
        <div
          className={cn(
            'flex items-center justify-center rounded-lg',
            'bg-accent-primary/10 text-accent-primary',
            compact ? 'w-8 h-8' : 'w-10 h-10'
          )}
        >
          <Sparkles className={cn(compact ? 'w-4 h-4' : 'w-5 h-5')} />
        </div>
        <div className="flex-1 min-w-0">
          <p
            className={cn(
              'font-medium text-text-primary truncate',
              compact ? 'text-sm' : 'text-base'
            )}
          >
            {suggestion.action}
          </p>
          {suggestion.description && !compact && (
            <p className="text-sm text-text-muted truncate">
              {suggestion.description}
            </p>
          )}
          {suggestion.context && (
            <p className="text-xs text-text-muted mt-0.5">
              {suggestion.context}
            </p>
          )}
        </div>
        <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-accent-primary transition-colors" />
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onDismiss(suggestion.id);
        }}
        className={cn(
          'absolute top-1 right-1',
          'p-1 rounded-md',
          'text-text-muted hover:text-text-primary hover:bg-surface-hover',
          'opacity-0 group-hover:opacity-100',
          'transition-all duration-200'
        )}
        aria-label="Dismiss suggestion"
      >
        <X className="w-3 h-3" />
      </button>

      {/* Confidence indicator */}
      {suggestion.confidence > 0.8 && (
        <div
          className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-accent-primary"
          title="High confidence suggestion"
        />
      )}
    </div>
  );
}

export function InlineSuggestion({
  action,
  description,
  onAccept,
  onDismiss,
  className,
}: {
  action: string;
  description?: string;
  onAccept: () => void;
  onDismiss: () => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 p-3 rounded-lg',
        'bg-accent-primary/5 border border-accent-primary/20',
        'animate-in fade-in slide-in-from-top-2 duration-300',
        className
      )}
    >
      <Lightbulb className="w-4 h-4 text-accent-primary flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-text-primary">{action}</p>
        {description && (
          <p className="text-xs text-text-muted">{description}</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onAccept}
          className={cn(
            'px-3 py-1.5 rounded-md text-sm font-medium',
            'bg-accent-primary text-white',
            'hover:bg-accent-secondary transition-colors'
          )}
        >
          Apply
        </button>
        <button
          onClick={onDismiss}
          className={cn(
            'p-1.5 rounded-md',
            'text-text-muted hover:text-text-primary hover:bg-surface-hover',
            'transition-colors'
          )}
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default SmartSuggestions;
