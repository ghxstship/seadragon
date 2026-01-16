
'use client';

import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import type { CSSProperties } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export interface PresenceUser {
  id: string;
  name: string;
  avatar?: string;
  color: string;
  cursor?: { x: number; y: number };
  lastActive: Date;
}

interface PresenceAvatarsProps {
  users: PresenceUser[];
  maxVisible?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'w-6 h-6 text-xs',
  md: 'w-8 h-8 text-sm',
  lg: 'w-10 h-10 text-base',
};

export function PresenceAvatars({
  users,
  maxVisible = 5,
  size = 'md',
  className,
}: PresenceAvatarsProps) {
  const visibleUsers = users.slice(0, maxVisible);
  const remainingCount = users.length - maxVisible;

  return (
    <div className={cn('flex items-center -space-x-2', className)}>
      {visibleUsers.map((user) => (
        <div
          key={user.id}
          className={cn(
            'relative rounded-full border-2 border-bg-primary',
            'flex items-center justify-center',
            'font-medium text-white',
            sizeClasses[size]
          )}
          style={{ backgroundColor: user.color }}
          title={user.name}
        >
          {user.avatar ? (
            <Image
              src={user.avatar}
              alt={user.name}
              width={32}
              height={32}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span>{user.name.charAt(0).toUpperCase()}</span>
          )}
          
          {/* Online indicator */}
          <span
            className={cn(
              'absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full',
              'bg-green-500 border-2 border-bg-primary'
            )}
          />
        </div>
      ))}

      {remainingCount > 0 && (
        <div
          className={cn(
            'rounded-full border-2 border-bg-primary',
            'flex items-center justify-center',
            'bg-neutral-200 dark:bg-neutral-700',
            'font-medium text-text-secondary',
            sizeClasses[size]
          )}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
}

interface CollaborativeCursorsProps {
  users: PresenceUser[];
  containerRef: React.RefObject<HTMLElement>;
}

export function CollaborativeCursors({
  users,
  containerRef: _containerRef,
}: CollaborativeCursorsProps) {
  return (
    <>
      {users.map((user) =>
        user.cursor ? (
          (() => {
            const colorVars = { '--presence-color': user.color } as CSSProperties
            return (
          <div
            key={user.id}
            className="absolute pointer-events-none z-50 transition-all duration-75"
            style={{ left: user.cursor.x, top: user.cursor.y }}
          >
            {/* Cursor */}
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className="text-[color:var(--presence-color)]"
              style={colorVars}
            >
              <path
                d="M5.5 2L16.5 22L12 15.5L5 19L5.5 2Z"
                fill="currentColor"
                stroke="white"
                strokeWidth="1.5"
              />
            </svg>
            
            {/* Name label */}
            <span
              className="absolute left-4 top-4 px-2 py-0.5 rounded text-xs font-medium text-white whitespace-nowrap bg-[color:var(--presence-color)]"
              style={colorVars}
            >
              {user.name}
            </span>
          </div>
            )
          })()
        ) : null
      )}
    </>
  );
}

interface TypingIndicatorProps {
  users: PresenceUser[];
  className?: string;
}

export function TypingIndicator({ users, className }: TypingIndicatorProps) {
  if (users.length === 0) return null;

  const names = users.map((u) => u.name);
  let text: string;

  if (names.length === 1) {
    text = `${names[0]} is typing...`;
  } else if (names.length === 2) {
    text = `${names[0]} and ${names[1]} are typing...`;
  } else {
    text = `${names[0]} and ${names.length - 1} others are typing...`;
  }

  return (
    <div className={cn('flex items-center gap-2 text-sm text-text-muted', className)}>
      <div className="flex gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-text-muted animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="w-1.5 h-1.5 rounded-full bg-text-muted animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="w-1.5 h-1.5 rounded-full bg-text-muted animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
      <span>{text}</span>
    </div>
  );
}

/**
 * Generate a consistent color from a string (user ID)
 */
export function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash) % 360;
  return `hsl(${h}, 70%, 50%)`;
}

/**
 * Hook for presence tracking (mock implementation)
 */
export function usePresence(documentId: string, currentUser: { id: string; name: string }) {
  const [users, setUsers] = useState<PresenceUser[]>([]);
  const [typingUsers, setTypingUsers] = useState<PresenceUser[]>([]);

  // In a real implementation, this would connect to a real-time service
  useEffect(() => {
    // Add current user
    const currentPresence: PresenceUser = {
      id: currentUser.id,
      name: currentUser.name,
      color: stringToColor(currentUser.id),
      lastActive: new Date(),
    };

    setUsers([currentPresence]);

    // Cleanup on unmount
    return () => {
      setUsers([]);
    };
  }, [documentId, currentUser.id, currentUser.name]);

  const updateCursor = useCallback((position: { x: number; y: number }) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === currentUser.id ? { ...u, cursor: position } : u
      )
    );
  }, [currentUser.id]);

  const setTyping = useCallback((isTyping: boolean) => {
    if (isTyping) {
      const user = users.find((u) => u.id === currentUser.id);
      if (user && !typingUsers.find((u) => u.id === currentUser.id)) {
        setTypingUsers((prev) => [...prev, user]);
      }
    } else {
      setTypingUsers((prev) => prev.filter((u) => u.id !== currentUser.id));
    }
  }, [users, typingUsers, currentUser.id]);

  return {
    users,
    typingUsers,
    updateCursor,
    setTyping,
  };
}

export default PresenceAvatars;
