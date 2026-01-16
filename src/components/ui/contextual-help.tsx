
'use client';

import * as React from 'react';
import { useState } from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';
import { HelpCircle, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ContextualHelpProps {
  content: React.ReactNode;
  learnMoreUrl?: string;
  children?: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  className?: string;
  triggerClassName?: string;
}

export function ContextualHelp({
  content,
  learnMoreUrl,
  children,
  side = 'top',
  align = 'center',
  className,
  triggerClassName,
}: ContextualHelpProps) {
  return (
    <Tooltip.Provider delayDuration={200}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button
            type="button"
            className={cn(
              'inline-flex items-center gap-1 text-text-muted hover:text-text-primary',
              'transition-colors duration-200',
              'focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 rounded',
              triggerClassName
            )}
          >
            {children}
            <HelpCircle className="w-4 h-4" />
          </button>
        </Tooltip.Trigger>

        <Tooltip.Portal>
          <Tooltip.Content
            className={cn(
              'z-50 max-w-xs px-3 py-2 rounded-lg',
              'bg-neutral-900 text-white text-sm',
              'shadow-lg',
              'animate-in fade-in-0 zoom-in-95 duration-200',
              'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
              className
            )}
            sideOffset={5}
            side={side}
            align={align}
          >
            <p>{content}</p>
            {learnMoreUrl && (
              <a
                href={learnMoreUrl}
                className="inline-flex items-center gap-1 mt-2 text-accent-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn more
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
            <Tooltip.Arrow className="fill-neutral-900" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}

interface TruncatedContentProps {
  content: string;
  maxLength?: number;
  expandLabel?: string;
  collapseLabel?: string;
  className?: string;
}

export function TruncatedContent({
  content,
  maxLength = 200,
  expandLabel = 'Show more',
  collapseLabel = 'Show less',
  className,
}: TruncatedContentProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldTruncate = content.length > maxLength;

  if (!shouldTruncate) {
    return <p className={className}>{content}</p>;
  }

  return (
    <div className={cn('space-y-2', className)}>
      <p>
        {isExpanded ? content : `${content.slice(0, maxLength)}...`}
      </p>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          'text-sm font-medium text-accent-primary',
          'hover:underline focus:outline-none focus:underline'
        )}
        aria-expanded={isExpanded}
      >
        {isExpanded ? collapseLabel : expandLabel}
      </button>
    </div>
  );
}

export default ContextualHelp;
