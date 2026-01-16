
'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Home,
  Compass,
  Calendar,
  MessageCircle,
  User,
  ChevronLeft,
  RefreshCw,
  Filter,
  Search
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'

// Mobile Navigation Component
interface MobileNavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
  unreadNotifications?: number
  unreadMessages?: number
  className?: string
}

export function MobileNavigation({
  activeTab,
  onTabChange,
  unreadMessages = 0,
  className
}: MobileNavigationProps) {
  const navigationItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'discover', label: 'Discover', icon: Compass },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'messages', label: 'Messages', icon: MessageCircle, badge: unreadMessages },
    { id: 'profile', label: 'Profile', icon: User }
  ]

  return (
    <div className={cn(
      'fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50',
      'safe-area-inset-bottom',
      className
    )}>
      <div className="flex items-center justify-around px-2 py-2">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id

          return (
            <Button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                'flex flex-col items-center justify-center p-2 rounded-lg transition-colors',
                'min-w-0 flex-1 max-w-16',
                isActive
                  ? 'bg-accent-primary/10 text-accent-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <div className="relative">
                <Icon className="h-5 w-5"/>
                {item.badge && item.badge > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-4 w-4 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    {item.badge > 9 ? '9+' : item.badge}
                  </Badge>
                )}
              </div>
              <span className="text-xs mt-1 truncate">{item.label}</span>
            </Button>
          )
        })}
      </div>
    </div>
  )
}
interface MobileHeaderProps {
  title: string
  subtitle?: string
  showBack?: boolean
  onBack?: () => void
  actions?: React.ReactNode[]
  className?: string
}

export function MobileHeader({
  title,
  subtitle,
  showBack = false,
  onBack,
  actions = [],
  className
}: MobileHeaderProps) {
  return (
    <div className={cn(
      'sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-40',
      'safe-area-inset-top',
      className
    )}>
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          {showBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="p-2 -ml-2"
            >
              <ChevronLeft className="h-5 w-5"/>
            </Button>
          )}

          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-semibold truncate">{title}</h1>
            {subtitle && (
              <p className="text-sm text-muted-foreground truncate">{subtitle}</p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-1">
          {actions.map((action, index) => (
            <div key={index}>{action}</div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Pull to Refresh Hook
export function usePullToRefresh(onRefresh: () => Promise<void>) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const [startY, setStartY] = useState(0)
  const [isPulling, setIsPulling] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let isAtTop = false

    const handleTouchStart = (e: TouchEvent) => {
      if (container.scrollTop === 0) {
        isAtTop = true
        setStartY(e.touches[0].clientY)
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!isAtTop || isRefreshing) return

      const currentY = e.touches[0].clientY
      const distance = Math.max(0, currentY - startY)

      if (distance > 0) {
        setIsPulling(true)
        setPullDistance(Math.min(distance * 0.5, 80)) // Limit max pull distance
        e.preventDefault()
      }
    }

    const handleTouchEnd = async () => {
      if (!isPulling || isRefreshing) return

      setIsPulling(false)

      if (pullDistance > 50) { // Minimum pull distance to trigger refresh
        setIsRefreshing(true)
        try {
          await onRefresh()
        } finally {
          setIsRefreshing(false)
        }
      }

      setPullDistance(0)
      setStartY(0)
      isAtTop = false
    }

    container.addEventListener('touchstart', handleTouchStart, { passive: true })
    container.addEventListener('touchmove', handleTouchMove, { passive: false })
    container.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchmove', handleTouchMove)
      container.removeEventListener('touchend', handleTouchEnd)
    }
  }, [pullDistance, startY, isPulling, isRefreshing, onRefresh])

  return {
    containerRef,
    isRefreshing,
    pullDistance,
    isPulling
  }
}

// Pull to Refresh Component
interface PullToRefreshProps {
  onRefresh: () => Promise<void>
  children: React.ReactNode
  className?: string
}

export function PullToRefresh({ onRefresh, children, className }: PullToRefreshProps) {
  const { containerRef, isRefreshing, pullDistance, isPulling } = usePullToRefresh(onRefresh)

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* Refresh Indicator */}
      <div
        className={cn(
          'absolute top-0 left-0 right-0 z-10 flex items-center justify-center bg-background transition-transform duration-200',
          isPulling || isRefreshing ? 'translate-y-0' : '-translate-y-full'
        )}
        style={{
          transform: isRefreshing ? 'translateY(0)' : `translateY(${-60 + pullDistance}px)`,
          height: '60px'
        }}
      >
        <div className="flex items-center space-x-2">
          <RefreshCw className={cn(
            'h-5 w-5 text-accent-primary',
            isRefreshing && 'animate-spin'
          )}/>
          <span className="text-sm text-muted-foreground">
            {isRefreshing ? 'Refreshing...' : 'Pull to refresh'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div
        ref={containerRef}
        className="overflow-y-auto h-full"
        style={{
          transform: isPulling ? `translateY(${pullDistance}px)` : 'translateY(0)',
          transition: isRefreshing ? 'none' : 'transform 0.2s ease-out'
        }}
      >
        {children}
      </div>
    </div>
  )
}

// Swipe Gesture Hook
export function useSwipeGesture(
  onSwipeLeft?: () => void,
  onSwipeRight?: () => void,
  onSwipeUp?: () => void,
  onSwipeDown?: () => void,
  threshold = 50
) {
  const [startX, setStartX] = useState(0)
  const [startY, setStartY] = useState(0)

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX)
    setStartY(e.touches[0].clientY)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!startX || !startY) return

    const endX = e.changedTouches[0].clientX
    const endY = e.changedTouches[0].clientY

    const diffX = startX - endX
    const diffY = startY - endY

    const absDiffX = Math.abs(diffX)
    const absDiffY = Math.abs(diffY)

    // Determine if it's a horizontal or vertical swipe
    if (Math.max(absDiffX, absDiffY) > threshold) {
      if (absDiffX > absDiffY) {
        // Horizontal swipe
        if (diffX > 0 && onSwipeLeft) {
          onSwipeLeft()
        } else if (diffX < 0 && onSwipeRight) {
          onSwipeRight()
        }
      } else {
        // Vertical swipe
        if (diffY > 0 && onSwipeUp) {
          onSwipeUp()
        } else if (diffY < 0 && onSwipeDown) {
          onSwipeDown()
        }
      }
    }

    setStartX(0)
    setStartY(0)
  }

  return {
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd
  }
}

// Swipeable Card Component
interface SwipeableCardProps {
  children: React.ReactNode
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  threshold?: number
  className?: string
}

export function SwipeableCard({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = 50,
  className
}: SwipeableCardProps) {
  const { onTouchStart, onTouchEnd } = useSwipeGesture(
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    threshold
  )

  return (
    <div
      className={className}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {children}
    </div>
  )
}

// Mobile Search Component
interface MobileSearchProps {
  placeholder?: string
  value: string
  onChange: (value: string) => void
  onSubmit?: () => void
  showFilter?: boolean
  onFilter?: () => void
  className?: string
}

export function MobileSearch({
  placeholder = "Search experiences...",
  value,
  onChange,
  onSubmit,
  showFilter = false,
  onFilter,
  className
}: MobileSearchProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && onSubmit) {
      onSubmit()
    }
  }

  return (
    <div className={cn('px-4 py-3 bg-background border-b border-border', className)}>
      <div className="flex items-center space-x-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
          <Input
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full pl-10 pr-4 py-2 bg-muted rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-accent-primary"/>
        </div>

        {showFilter && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onFilter}
            className="p-2"
          >
            <Filter className="h-4 w-4"/>
          </Button>
        )}
      </div>
    </div>
  )
}

// Mobile Action Sheet Component
interface ActionSheetProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  actions: Array<{
    label: string
    icon?: React.ReactNode
    onClick: () => void
    destructive?: boolean
  }>
}

export function ActionSheet({ isOpen, onClose, title, actions }: ActionSheetProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-neutral-900/50"
        onClick={onClose}/>

      {/* Sheet */}
      <div className="absolute bottom-0 left-0 right-0 bg-background rounded-t-xl">
        <div className="w-12 h-1 bg-muted rounded-full mx-auto mt-3 mb-2"/>

        {title && (
          <div className="px-4 py-2 border-b border-border">
            <h3 className="text-lg font-semibold text-center">{title}</h3>
          </div>
        )}

        <div className="py-2">
          {actions.map((action, index) => (
            <Button
              key={index}
              onClick={() => {
                action.onClick()
                onClose()
              }}
              className={cn(
                'w-full px-4 py-3 text-left flex items-center space-x-3 hover:bg-muted transition-colors',
                action.destructive && 'text-semantic-error'
              )}
            >
              {action.icon && <div className="flex-shrink-0">{action.icon}</div>}
              <span>{action.label}</span>
            </Button>
          ))}
        </div>

        <div className="p-4 border-t border-border">
          <Button variant="ghost" onClick={onClose} className="w-full">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}

// Infinite Scroll Hook
export function useInfiniteScroll(
  loadMore: () => Promise<void>,
  hasMore: boolean,
  isLoading: boolean,
  threshold = 100
) {
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel || !hasMore || isLoading || isLoadingMore) return

    const observer = new IntersectionObserver(
      async (entries) => {
        if (entries[0].isIntersecting) {
          setIsLoadingMore(true)
          try {
            await loadMore()
          } finally {
            setIsLoadingMore(false)
          }
        }
      },
      { threshold: 0.1, rootMargin: `${threshold}px` }
    )

    observer.observe(sentinel)

    return () => {
      observer.unobserve(sentinel)
    }
  }, [loadMore, hasMore, isLoading, isLoadingMore, threshold])

  return {
    sentinelRef,
    isLoadingMore
  }
}

// Infinite Scroll Component
interface InfiniteScrollProps {
  loadMore: () => Promise<void>
  hasMore: boolean
  isLoading: boolean
  threshold?: number
  children: React.ReactNode
  loadingComponent?: React.ReactNode
}

export function InfiniteScroll({
  loadMore,
  hasMore,
  isLoading,
  threshold = 100,
  children,
  loadingComponent
}: InfiniteScrollProps) {
  const { sentinelRef, isLoadingMore } = useInfiniteScroll(
    loadMore,
    hasMore,
    isLoading,
    threshold
  )

  return (
    <div>
      {children}

      {/* Loading indicator */}
      {isLoadingMore && (
        <div className="flex justify-center py-4">
          {loadingComponent || (
            <div className="flex items-center space-x-2">
              <RefreshCw className="h-4 w-4 animate-spin" data-testid="refresh-cw-icon"/>
              <span className="text-sm text-muted-foreground">Loading more...</span>
            </div>
          )}
        </div>
      )}

      {/* Sentinel element for intersection observer */}
      {hasMore && !isLoading && <div ref={sentinelRef} className="h-4"/>}
    </div>
  )
}

// Mobile Bottom Sheet Component
interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  snapPoints?: number[]
  initialSnap?: number
}

export function BottomSheet({
  isOpen,
  onClose,
  title,
  children,
  snapPoints = [0.5, 1],
  initialSnap = 0
}: BottomSheetProps) {
  const [currentSnap, setCurrentSnap] = useState(initialSnap)
  const sheetRef = useRef<HTMLDivElement>(null)

  if (!isOpen) return null

  const snapToPoint = (index: number) => {
    if (sheetRef.current) {
      const height = window.innerHeight * snapPoints[index]
      sheetRef.current.style.transform = `translateY(${window.innerHeight - height}px)`
      setCurrentSnap(index)
    }
  }

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-neutral-900/50 transition-opacity"
        onClick={onClose}
      />

      <div
        ref={sheetRef}
        data-testid="dialog"
        data-sheet-container
        className={cn(
          'absolute bottom-0 left-0 right-0 bg-background rounded-t-xl transition-transform duration-300 z-50',
          'max-h-[90vh] overflow-hidden'
        )}
        style={{
          transform: `translateY(${window.innerHeight * (1 - snapPoints[initialSnap])}px)`
        }}
      >
        <div className="flex justify-center py-3">
          <div className="w-12 h-1.5 bg-muted rounded-full" data-testid="sheet-handle"/>
        </div>

        {/* Header */}
        {title && (
          <div className="px-4 pb-2 border-b border-border">
            <h3 className="text-lg font-semibold">{title}</h3>
          </div>
        )}

        {/* Content */}
        <div
          data-sheet-body
          data-testid="sheet-content"
          className="overflow-y-auto max-h-[calc(90vh-100px)]"
        >
          {children}
        </div>

        {/* Snap points indicator */}
        {snapPoints.length > 1 && (
          <div className="flex justify-center space-x-2 p-2 border-t border-border">
            {snapPoints.map((_, index) => (
              <Button
                key={index}
                onClick={() => snapToPoint(index)}
                className={cn(
                  'w-2 h-2 rounded-full transition-colors',
                  currentSnap === index ? 'bg-accent-primary' : 'bg-muted'
                )}/>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
