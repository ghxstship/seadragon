# ATLVS Mobile Navigation Design

## Overview
This document outlines the mobile navigation implementation for the ATLVS authenticated UI rebuild, following the specified IA requirements.

## Mobile Navigation Requirements (from IA)

### Bottom Nav (Primary 5)
- Dashboard
- Calendar  
- Tasks
- Workflows
- Inbox

### More Drawer
- Assets
- Documents
- Network
- Account
- Reports & Insights (role gated)

## Implementation Plan

### Bottom Navigation Component
```typescript
// /src/components/navigation/MobileBottomNav.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  LayoutDashboard,
  Calendar,
  CheckSquare,
  Workflow,
  Inbox,
  MoreHorizontal
} from 'lucide-react'
import { useState } from 'react'
import { MobileMoreDrawer } from './MobileMoreDrawer'

const bottomNavItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    mobile: 'primary'
  },
  {
    id: 'calendar',
    label: 'Calendar',
    href: '/dashboard/calendar',
    icon: Calendar,
    mobile: 'primary'
  },
  {
    id: 'tasks',
    label: 'Tasks',
    href: '/dashboard/tasks',
    icon: CheckSquare,
    mobile: 'primary'
  },
  {
    id: 'workflows',
    label: 'Workflows',
    href: '/dashboard/workflows',
    icon: Workflow,
    mobile: 'primary'
  },
  {
    id: 'inbox',
    label: 'Inbox',
    href: '/dashboard/messages',
    icon: Inbox,
    mobile: 'primary'
  }
]

export function MobileBottomNav() {
  const pathname = usePathname()
  const [showMoreDrawer, setShowMoreDrawer] = useState(false)

  return (
    <>
      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
        <div className="grid h-16 grid-cols-6">
          {bottomNavItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  'flex flex-col items-center justify-center space-y-1 py-2 text-xs transition-colors',
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-[10px] leading-none">{item.label}</span>
              </Link>
            )
          })}
          {/* More Button */}
          <button
            onClick={() => setShowMoreDrawer(true)}
            className="flex flex-col items-center justify-center space-y-1 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <MoreHorizontal className="h-5 w-5" />
            <span className="text-[10px] leading-none">More</span>
          </button>
        </div>
      </nav>

      {/* More Drawer */}
      <MobileMoreDrawer
        isOpen={showMoreDrawer}
        onClose={() => setShowMoreDrawer(false)}
      />

      {/* Bottom padding for content */}
      <div className="h-16 md:hidden" />
    </>
  )
}
```

### More Drawer Component
```typescript
// /src/components/navigation/MobileMoreDrawer.tsx
'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import {
  Boxes,
  FileText,
  Network,
  User,
  BarChart3,
  Sparkles,
  X
} from 'lucide-react'
import { Role } from '@/config/navigation'

const moreDrawerItems = [
  {
    id: 'assets',
    label: 'Assets',
    href: '/dashboard/assets',
    icon: Boxes,
    roles: ['member', 'manager', 'admin', 'super_admin', 'platform_dev']
  },
  {
    id: 'documents',
    label: 'Documents',
    href: '/dashboard/documents',
    icon: FileText,
    roles: ['member', 'manager', 'admin', 'super_admin', 'platform_dev']
  },
  {
    id: 'network',
    label: 'Network',
    href: '/dashboard/network',
    icon: Network,
    roles: ['member', 'manager', 'admin', 'super_admin', 'platform_dev']
  },
  {
    id: 'account',
    label: 'Account',
    href: '/dashboard/account/profile',
    icon: User,
    roles: ['member', 'manager', 'admin', 'super_admin', 'platform_dev']
  },
  {
    id: 'reports',
    label: 'Reports & Insights',
    href: '/dashboard/reports',
    icon: BarChart3,
    roles: ['manager', 'admin', 'super_admin', 'platform_dev']
  }
]

interface MobileMoreDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileMoreDrawer({ isOpen, onClose }: MobileMoreDrawerProps) {
  const { data: session } = useSession()
  const pathname = usePathname()
  const userRole = (session?.user?.role as Role) || 'guest'

  const allowedItems = moreDrawerItems.filter(item =>
    !item.roles || item.roles.includes(userRole)
  )

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[60vh] rounded-t-lg">
        <SheetHeader className="text-left">
          <div className="flex items-center justify-between">
            <SheetTitle>More</SheetTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        <div className="mt-6 grid grid-cols-2 gap-4">
          {allowedItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'flex flex-col items-center justify-center space-y-2 rounded-lg border p-4 transition-colors hover:bg-accent',
                  isActive && 'border-primary bg-accent'
                )}
              >
                <item.icon className="h-6 w-6" />
                <span className="text-sm font-medium text-center">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </SheetContent>
    </Sheet>
  )
}
```

## Integration with Dashboard Layout

### Updated DashboardShell
```typescript
// /src/components/app/DashboardShell.tsx
'use client'

import { ReactNode } from 'react'
import { Header } from '@/lib/design-system/patterns/header'
import { Sidebar } from '@/lib/design-system/patterns/sidebar'
import { MobileBottomNav } from '@/components/navigation/MobileBottomNav'
import { RoleGuard } from '@/components/app/RoleGuard'
import { Role } from '@/config/navigation'

interface DashboardShellProps {
  children: ReactNode
  allowed?: Role[]
}

export function DashboardShell({ children, allowed = ['member','manager','admin','super_admin','platform_dev'] }: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header showAuth={false}/>
      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <Sidebar/>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto px-6 py-6 space-y-4">
            <RoleGuard allowed={allowed}>
              {children}
            </RoleGuard>
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  )
}
```

## Responsive Behavior

### Breakpoint Strategy
- **Mobile (< 768px)**: Bottom nav + more drawer, hide sidebar
- **Tablet (768px - 1024px)**: Show sidebar, hide bottom nav
- **Desktop (> 1024px)**: Full sidebar, no bottom nav

### CSS Implementation
```css
/* Mobile-first approach */
.mobile-nav {
  @apply md:hidden;
}

.desktop-sidebar {
  @apply hidden md:block;
}

/* Content spacing */
.main-content {
  @apply pb-16 md:pb-0;
}
```

## Role-Based Filtering

### Implementation Details
- Bottom nav items are always visible for authenticated users
- More drawer filters items based on user roles
- Reports & Insights only show for manager+ roles
- Network access requires member+ roles

### Access Control Logic
```typescript
const userRole = (session?.user?.role as Role) || 'guest'

// Filter navigation items based on roles
const allowedItems = navigationItems.filter(item =>
  !item.roles || item.roles.includes(userRole)
)
```

## User Experience Considerations

### Touch Targets
- Minimum 44px touch targets for accessibility
- Generous spacing between navigation items
- Clear visual feedback on touch

### Performance
- Lazy load drawer content
- Minimize re-renders with proper memoization
- Optimize icon loading

### Accessibility
- Proper ARIA labels for screen readers
- Keyboard navigation support
- Focus management for drawer open/close

## Testing Strategy

### Mobile Testing Checklist
- [ ] Bottom nav appears on mobile devices
- [ ] All 5 primary items accessible
- [ ] More drawer opens/closes properly
- [ ] Role-based filtering works correctly
- [ ] Active states show correctly
- [ ] Touch targets meet accessibility standards
- [ ] Landscape orientation works
- [ ] Different screen sizes handled properly

### Integration Testing
- [ ] Navigation updates URL correctly
- [ ] Page transitions work smoothly
- [ ] No layout shift on navigation
- [ ] Back button behavior correct
- [ ] Deep linking from external sources works
