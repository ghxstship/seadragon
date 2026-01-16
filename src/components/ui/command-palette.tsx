
'use client';

import * as React from 'react';
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { logger } from '@/lib/logger';
import { 
  Search, 
  Command as CommandIcon, 
  ArrowRight, 
  FileText, 
  Settings, 
  User, 
  Home,
  BarChart3,
  Calendar,
  MessageSquare,
  Plus,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useBehaviorContext } from '@/contexts/BehaviorContext';

export interface CommandItem {
  id: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  keywords: string[];
  action: () => void | Promise<void>;
  category: string;
  shortcut?: string;
}

interface ParsedIntent {
  action: string;
  entity?: string;
  parameters: Record<string, unknown>;
  confidence: number;
  rawQuery: string;
}

const INTENT_PATTERNS = [
  { pattern: /^create (?:a |an )?(\w+)/i, action: 'create', entityGroup: 1 },
  { pattern: /^new (\w+)/i, action: 'create', entityGroup: 1 },
  { pattern: /^show (?:me )?(?:my )?(\w+)/i, action: 'navigate', entityGroup: 1 },
  { pattern: /^go to (\w+)/i, action: 'navigate', entityGroup: 1 },
  { pattern: /^open (\w+)/i, action: 'navigate', entityGroup: 1 },
  { pattern: /^search (?:for )?(.+)/i, action: 'search', entityGroup: 1 },
  { pattern: /^find (.+)/i, action: 'search', entityGroup: 1 },
  { pattern: /^export (.+) (?:as |to )(\w+)/i, action: 'export', entityGroup: 1 },
  { pattern: /^filter (.+) by (.+)/i, action: 'filter', entityGroup: 1 },
  { pattern: /^help(?: with)? ?(.+)?/i, action: 'help', entityGroup: 1 },
];

function parseIntent(query: string): ParsedIntent {
  for (const { pattern, action, entityGroup } of INTENT_PATTERNS) {
    const match = query.match(pattern);
    if (match) {
      const intent: ParsedIntent = {
        action,
        parameters: {},
        confidence: 0.9,
        rawQuery: query,
      };
      const entity = match[entityGroup];
      if (entity) intent.entity = entity;
      return intent;
    }
  }

  return {
    action: 'search',
    entity: query,
    parameters: {},
    confidence: 0.5,
    rawQuery: query,
  };
}

const defaultCommands: CommandItem[] = [
  {
    id: 'home',
    title: 'Go to Dashboard',
    description: 'Navigate to the main dashboard',
    icon: <Home className="w-4 h-4" />,
    keywords: ['home', 'dashboard', 'main'],
    action: () => { window.location.href = '/'; },
    category: 'Navigation',
    shortcut: '⌘H',
  },
  {
    id: 'analytics',
    title: 'View Analytics',
    description: 'Open analytics and reports',
    icon: <BarChart3 className="w-4 h-4" />,
    keywords: ['analytics', 'reports', 'stats', 'metrics'],
    action: () => { window.location.href = '/analytics'; },
    category: 'Navigation',
    shortcut: '⌘A',
  },
  {
    id: 'calendar',
    title: 'Open Calendar',
    description: 'View your calendar and events',
    icon: <Calendar className="w-4 h-4" />,
    keywords: ['calendar', 'events', 'schedule'],
    action: () => { window.location.href = '/calendar'; },
    category: 'Navigation',
  },
  {
    id: 'settings',
    title: 'Settings',
    description: 'Open application settings',
    icon: <Settings className="w-4 h-4" />,
    keywords: ['settings', 'preferences', 'config'],
    action: () => { window.location.href = '/settings'; },
    category: 'Navigation',
    shortcut: '⌘,',
  },
  {
    id: 'profile',
    title: 'My Profile',
    description: 'View and edit your profile',
    icon: <User className="w-4 h-4" />,
    keywords: ['profile', 'account', 'me'],
    action: () => { window.location.href = '/profile'; },
    category: 'Navigation',
  },
  {
    id: 'new-task',
    title: 'Create New Task',
    description: 'Create a new task or to-do item',
    icon: <Plus className="w-4 h-4" />,
    keywords: ['new', 'create', 'task', 'todo'],
    action: () => { logger.action('create_task'); },
    category: 'Actions',
    shortcut: '⌘N',
  },
  {
    id: 'new-document',
    title: 'Create New Document',
    description: 'Create a new document',
    icon: <FileText className="w-4 h-4" />,
    keywords: ['new', 'create', 'document', 'doc', 'file'],
    action: () => { logger.action('create_document'); },
    category: 'Actions',
  },
  {
    id: 'quick-action',
    title: 'Quick Actions',
    description: 'Access frequently used actions',
    icon: <Zap className="w-4 h-4" />,
    keywords: ['quick', 'action', 'fast'],
    action: () => { logger.action('quick_actions'); },
    category: 'Actions',
  },
  {
    id: 'feedback',
    title: 'Send Feedback',
    description: 'Send feedback to the team',
    icon: <MessageSquare className="w-4 h-4" />,
    keywords: ['feedback', 'report', 'bug', 'suggestion'],
    action: () => { logger.action('send_feedback'); },
    category: 'Help',
  },
];

interface CommandPaletteProps {
  commands?: CommandItem[];
  placeholder?: string;
  onClose?: () => void;
  className?: string;
}

export function CommandPalette({
  commands = defaultCommands,
  placeholder = 'Type a command or ask a question...',
  onClose,
}: CommandPaletteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [intent, setIntent] = useState<ParsedIntent | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const { trackFeature } = useBehaviorContext();

  // Filter commands based on query
  const filteredCommands = useMemo(() => {
    if (!query) return commands.slice(0, 10);

    const lowerQuery = query.toLowerCase();
    return commands
      .filter((cmd) =>
        cmd.title.toLowerCase().includes(lowerQuery) ||
        cmd.description?.toLowerCase().includes(lowerQuery) ||
        cmd.keywords.some((kw) => kw.toLowerCase().includes(lowerQuery))
      )
      .slice(0, 10);
  }, [commands, query]);

  // Group commands by category
  const groupedCommands = useMemo(() => {
    const groups: Record<string, CommandItem[]> = {};
    filteredCommands.forEach((cmd) => {
      if (!groups[cmd.category]) {
        groups[cmd.category] = [];
      }
      groups[cmd.category]!.push(cmd);
    });
    return groups;
  }, [filteredCommands]);

  // Parse intent when query changes
  useEffect(() => {
    if (query.length > 2) {
      const parsed = parseIntent(query);
      setIntent(parsed);
    } else {
      setIntent(null);
    }
  }, [query]);

  // Open with Cmd/Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
        trackFeature('command-palette-open');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [trackFeature]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setQuery('');
    setSelectedIndex(0);
    setIntent(null);
    onClose?.();
  }, [onClose]);

  const executeCommand = useCallback(async (command: CommandItem) => {
    trackFeature(`command-${command.id}`);
    await command.action();
    handleClose();
  }, [trackFeature, handleClose]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => 
          Math.min(prev + 1, filteredCommands.length - 1)
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          executeCommand(filteredCommands[selectedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        handleClose();
        break;
    }
  }, [filteredCommands, selectedIndex, executeCommand, handleClose]);

  // Scroll selected item into view
  useEffect(() => {
    const selectedElement = listRef.current?.querySelector(
      `[data-index="${selectedIndex}"]`
    );
    selectedElement?.scrollIntoView({ block: 'nearest' });
  }, [selectedIndex]);

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Command Palette */}
      <div
        className={cn(
          'fixed left-1/2 top-[20%] z-50 w-full max-w-xl -translate-x-1/2',
          'animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200'
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
      >
        <div
          className="overflow-hidden rounded-2xl border border-white/12 bg-[#0c0f18]/90 shadow-[0_20px_80px_rgba(0,0,0,0.55)]"
          style={{ fontFamily: 'Share Tech, sans-serif' }}
        >
          {/* Search Input */}
          <div className="flex items-center border-b border-white/10 px-4">
            <Search className="h-5 w-5 text-[#46f0ff]" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className={cn(
                'flex-1 bg-transparent px-4 py-4 text-base text-white placeholder:text-[#9fb0d3]',
                'focus:outline-none'
              )}
            />
            <kbd className="hidden sm:inline-flex h-6 items-center gap-1 rounded border border-white/10 bg-white/5 px-2 text-xs text-[#cdd8f5]">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>

          {/* Intent Preview */}
          {intent && intent.confidence > 0.7 && (
            <div className="border-b border-white/10 bg-white/5 px-4 py-2">
              <div className="flex items-center gap-2 text-sm" style={{ fontFamily: 'Share Tech, sans-serif' }}>
                <Zap className="h-4 w-4 text-[#ff4fd8]" />
                <span className="text-[#cdd8f5]">
                  Detected: <span className="font-medium text-white">{intent.action}</span>
                  {intent.entity && (
                    <> → <span className="text-white">{intent.entity}</span></>
                  )}
                </span>
              </div>
            </div>
          )}

          {/* Command List */}
          <div
            ref={listRef}
            className="max-h-80 overflow-y-auto p-2"
            role="listbox"
          >
            {Object.entries(groupedCommands).map(([category, items]) => (
              <div key={category} className="mb-2">
                <div className="px-2 py-1.5 text-xs font-medium uppercase tracking-[0.16em] text-[#9fb0d3]" style={{ fontFamily: 'Share Tech Mono, monospace' }}>
                  {category}
                </div>
                {items.map((command) => {
                  const globalIndex = filteredCommands.indexOf(command);
                  const isSelected = globalIndex === selectedIndex;

                  return (
                    <button
                      key={command.id}
                      data-index={globalIndex}
                      onClick={() => executeCommand(command)}
                      onMouseEnter={() => setSelectedIndex(globalIndex)}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition duration-100',
                        isSelected
                          ? 'bg-gradient-to-r from-[#ff4fd8]/70 via-[#46f0ff]/70 to-[#ffe76a]/70 text-white shadow-lg shadow-[#ff4fd8]/25'
                          : 'hover:bg-white/5'
                      )}
                      role="option"
                      aria-selected={isSelected}
                    >
                      <span className={cn(
                        'flex-shrink-0',
                        isSelected ? 'text-white' : 'text-[#9fb0d3]'
                      )}>
                        {command.icon || <CommandIcon className="h-4 w-4" />}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className={cn(
                          'truncate',
                          isSelected ? 'text-white' : 'text-white'
                        )} style={{ fontFamily: 'Bebas Neue, var(--font-sans)', letterSpacing: '0.04em' }}>
                          {command.title}
                        </div>
                        {command.description && (
                          <div className={cn(
                            'truncate text-sm',
                            isSelected ? 'text-white/85' : 'text-[#cdd8f5]'
                          )} style={{ fontFamily: 'Share Tech, sans-serif' }}>
                            {command.description}
                          </div>
                        )}
                      </div>
                      {command.shortcut && (
                        <kbd className={cn(
                          'hidden sm:inline-flex h-6 items-center rounded px-2 text-xs',
                          isSelected
                            ? 'bg-white/20 text-white'
                            : 'bg-white/5 text-[#9fb0d3]'
                        )}>
                          {command.shortcut}
                        </kbd>
                      )}
                      <ArrowRight className={cn(
                        'h-4 w-4 flex-shrink-0',
                        isSelected ? 'text-white' : 'text-[#46f0ff]'
                      )} />
                    </button>
                  );
                })}
              </div>
            ))}

            {filteredCommands.length === 0 && (
              <div className="py-8 text-center text-[#9fb0d3]">
                <Search className="mx-auto mb-2 h-8 w-8 opacity-50" />
                <p>No commands found for &ldquo;{query}&rdquo;</p>
                <p className="mt-1 text-sm">Try a different search term</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-white/10 px-4 py-2 text-xs text-[#cdd8f5]" style={{ fontFamily: 'Share Tech Mono, monospace' }}>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="rounded bg-white/5 px-1.5 py-0.5">↑↓</kbd>
                Navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="rounded bg-white/5 px-1.5 py-0.5">↵</kbd>
                Select
              </span>
              <span className="flex items-center gap-1">
                <kbd className="rounded bg-white/5 px-1.5 py-0.5">esc</kbd>
                Close
              </span>
            </div>
            <span>Type naturally to search</span>
          </div>
        </div>
      </div>
    </>
  );
}

export function useCommandPalette() {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  return { isOpen, open, close, toggle };
}

export default CommandPalette;
