
'use client';

import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CollapsibleSectionProps {
  title: string;
  defaultOpen?: boolean;
  badge?: number | string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  onToggle?: (isOpen: boolean) => void;
}

export function CollapsibleSection({
  title,
  defaultOpen = false,
  badge,
  icon,
  children,
  className,
  onToggle,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [height, setHeight] = useState<number | undefined>(defaultOpen ? undefined : 0);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (isOpen) {
          setHeight(entry.contentRect.height);
        }
      }
    });

    resizeObserver.observe(contentRef.current);
    return () => resizeObserver.disconnect();
  }, [isOpen]);

  const toggle = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    onToggle?.(newState);

    if (!newState) {
      setHeight(0);
    } else if (contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    }
  };

  return (
    <section className={cn('border border-border-default rounded-lg', className)}>
      <button
        className={cn(
          'flex items-center justify-between w-full px-4 py-3',
          'text-left font-medium',
          'hover:bg-surface-hover transition-colors duration-200',
          'focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent-primary',
          'rounded-t-lg',
          !isOpen && 'rounded-b-lg'
        )}
        onClick={toggle}
        aria-expanded={isOpen}
      >
        <span className="flex items-center gap-2">
          {icon && <span className="text-text-muted">{icon}</span>}
          <span>{title}</span>
          {badge !== undefined && (
            <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium rounded-full bg-accent-primary/10 text-accent-primary">
              {badge}
            </span>
          )}
        </span>
        <ChevronDown
          className={cn(
            'w-5 h-5 text-text-muted transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      <div
        className="overflow-hidden transition-[height] duration-200 ease-in-out"
        style={{ height: isOpen ? height : 0 }}
      >
        <div ref={contentRef} className="px-4 pb-4">
          {children}
        </div>
      </div>
    </section>
  );
}

export default CollapsibleSection;
