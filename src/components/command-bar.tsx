
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Home,
  Calendar,
  MessageSquare,
  Brain,
  Layers,
  Inbox,
  Grid3X3,
  Pin,
  MoreHorizontal,
  Search,
  Plus,
  ChevronDown
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface CommandBarProps {
  isGuest?: boolean
  currentPage?: string
  onSearch?: (query: string) => void
  onCreate?: (type: string) => void
  onNavigate?: (path: string) => void
  // Page-level actions (not individual record actions)
  onImport?: () => void
  onExport?: () => void
  onSharePage?: () => void
  onBookmarkPage?: () => void
  onPageSettings?: () => void
  // User menu actions
  onProfile?: () => void
  onSettings?: () => void
  onLogout?: () => void
}

export function CommandBar({
  isGuest = false,
  currentPage = '',
  onSearch,
  onCreate,
  onNavigate,
  onImport,
  onExport,
  onSharePage,
  onBookmarkPage,
  onPageSettings,
  onProfile,
  onSettings,
  onLogout
}: CommandBarProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchFocused, setIsSearchFocused] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch?.(searchQuery)
  }

  const primaryItems = [
    { icon: Home, label: 'Home', href: '/home', badge: null },
    { icon: Calendar, label: 'Planner', href: '/planner', badge: null },
    { icon: MessageSquare, label: 'Chat', href: '/chat', badge: 3 },
    { icon: Brain, label: 'AI Hub', href: '/ai-hub', badge: null },
    { icon: Layers, label: 'Spaces', href: '/spaces', badge: null },
    { icon: Inbox, label: 'Inbox', href: '/inbox', badge: 12 },
    { icon: Grid3X3, label: 'App Center', href: '/app-center', badge: null },
  ]

  const pinnedItems = [
    { label: 'My Tasks', href: '/tasks' },
    { label: 'Project Alpha', href: '/projects/alpha' },
    { label: 'Q4 Roadmap', href: '/roadmaps/q4' },
  ]

  const moreItems = [
    { label: 'Time Tracking', href: '/time-tracking' },
    { label: 'Reports', href: '/reports' },
    { label: 'Integrations', href: '/integrations' },
    { label: 'Settings', href: '/settings' },
  ]

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-background border-b border-neutral-200 shadow-sm">
      {/* Left Section - Primary Navigation */}
      <div className="flex items-center space-x-1">
        {primaryItems.map((item) => (
          <Button
            key={item.label}
            variant="ghost"
            size="sm"
            className="relative flex items-center space-x-2 px-3 py-2 h-9"
            disabled={isGuest && ['/home', '/chat', '/ai-hub'].includes(item.href)}
          >
            <item.icon className="w-4 h-4"/>
            <span className="hidden sm:inline">{item.label}</span>
            {item.badge && (
              <Badge variant="destructive" className="absolute -top-1 -right-1 w-5 h-5 p-0 text-xs flex items-center justify-center">
                {item.badge}
              </Badge>
            )}
          </Button>
        ))}
      </div>

      {/* Center Section - Search/Command Bar */}
      <div className="flex-1 max-w-2xl mx-4">
        <form onSubmit={handleSearch} className="relative">
          <div className={`relative flex items-center ${isSearchFocused ? 'ring-2 ring-accent-primary' : ''}`}>
            <Search className="absolute left-3 w-4 h-4 text-neutral-400"/>
            <Input
              type="text"
              placeholder={isGuest ? "Search public content..." : "Search or create anything... (⌘K)"}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="pl-10 pr-4 py-2 w-full bg-neutral-50 border-neutral-300 focus:bg-background"/>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-2 p-1"
              onClick={() => onCreate?.('task')}
            >
              <Plus className="w-4 h-4"/>
            </Button>
          </div>
        </form>
      </div>

      {/* Right Section - Page Actions, More Menu, User */}
      <div className="flex items-center space-x-2">
        {/* Page-level Actions (only show when not guest and relevant) */}
        {!isGuest && currentPage && (
          <div className="flex items-center space-x-1">
            {onImport && (
              <Button variant="ghost" size="sm" onClick={onImport}>
                Import
              </Button>
            )}
            {onExport && (
              <Button variant="ghost" size="sm" onClick={onExport}>
                Export
              </Button>
            )}
            {onSharePage && (
              <Button variant="ghost" size="sm" onClick={onSharePage}>
                Share
              </Button>
            )}
            {onBookmarkPage && (
              <Button variant="ghost" size="sm" onClick={onBookmarkPage}>
                <Pin className="w-4 h-4"/>
              </Button>
            )}
          </div>
        )}

        {/* More Menu - Standardized across all pages */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="w-4 h-4"/>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Page Actions</DropdownMenuLabel>
            <DropdownMenuSeparator/>
            {onPageSettings && (
              <DropdownMenuItem onClick={onPageSettings}>
                Page Settings
              </DropdownMenuItem>
            )}
            {!isGuest && (
              <>
                <DropdownMenuItem onClick={() => onCreate?.('page')}>
                  Create New Page
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onCreate?.('folder')}>
                  Create Folder
                </DropdownMenuItem>
                <DropdownMenuSeparator/>
                <DropdownMenuItem onClick={() => onNavigate?.('/templates')}>
                  Browse Templates
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onNavigate?.('/automations')}>
                  Automations
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuSeparator/>
            <DropdownMenuItem onClick={() => onNavigate?.('/help')}>
              Help & Support
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onNavigate?.('/feedback')}>
              Send Feedback
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu - Standardized */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="flex items-center space-x-2">
              <Avatar className="w-6 h-6">
                <AvatarImage src="/avatars/user.jpg"/>
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <ChevronDown className="w-4 h-4"/>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator/>
            <DropdownMenuItem onClick={onProfile}>
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onSettings}>
              Settings
            </DropdownMenuItem>
            {!isGuest && (
              <>
                <DropdownMenuSeparator/>
                <DropdownMenuItem onClick={() => onNavigate?.('/billing')}>
                  Billing
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onNavigate?.('/team')}>
                  Team Management
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuSeparator/>
            <DropdownMenuItem onClick={onLogout}>
              {isGuest ? 'Sign In' : 'Sign Out'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
