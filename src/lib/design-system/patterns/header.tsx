'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { usePathname, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import {
  Search,
  Bell,
  Inbox,
  Settings,
  LifeBuoy,
  Languages,
  Moon,
  Sun,
  User,
  LogOut,
  ChevronRight,
  Sparkles,
  MessageCircle,
  CheckSquare,
  Workflow
} from 'lucide-react'
import { useThemeContext } from '@/contexts/ThemeContext'
import { useBrand } from '@/contexts/BrandContext'
import { useState, useEffect, useMemo, ReactNode } from 'react'
import Image from 'next/image'
import { useSupabase } from '@/contexts/SupabaseContext'

// Breadcrumbs component for IA hierarchy reflection
function Breadcrumbs() {
  const pathname = usePathname()
  const params = useParams()
  const { supabase } = useSupabase()
  const [breadcrumbs, setBreadcrumbs] = useState<Array<{label: string, href: string, type: string}>>([])
  const [terminology, setTerminology] = useState<Record<string, {singular: string, plural: string}>>({})

  useEffect(() => {
    const loadBreadcrumbs = async () => {
      const pathSegments = pathname.split('/').filter(Boolean)
      const crumbs: Array<{label: string, href: string, type: string}> = []

      // Always start with Dashboard
      crumbs.push({ label: 'Dashboard', href: '/dashboard', type: 'dashboard' })

      // Parse path for IA hierarchy
      for (let i = 0; i < pathSegments.length; i++) {
        const segment = pathSegments[i]
        const href = '/' + pathSegments.slice(0, i + 1).join('/')

        if (segment === 'dashboard') continue

        // Handle IA sections
        if (segment === 'core' && i + 1 < pathSegments.length) {
          const entity = pathSegments[i + 1]
          if (entity && terminology[entity]) {
            const entityLabel = terminology[entity]?.plural || entity.charAt(0).toUpperCase() + entity.slice(1).replace('-', ' ')
            crumbs.push({ label: entityLabel, href: href + '/' + entity, type: entity })
            i++ // Skip next segment as we handled it
          }
        } else if (segment === 'team' && i + 1 < pathSegments.length) {
          const entity = pathSegments[i + 1]
          if (entity && terminology[entity]) {
            const entityLabel = terminology[entity]?.plural || entity.charAt(0).toUpperCase() + entity.slice(1).replace('-', ' ')
            crumbs.push({ label: entityLabel, href: href + '/' + entity, type: entity })
            i++
          }
        } else if (segment === 'management' && i + 1 < pathSegments.length) {
          const entity = pathSegments[i + 1]
          if (entity && terminology[entity]) {
            const entityLabel = terminology[entity]?.plural || entity.charAt(0).toUpperCase() + entity.slice(1).replace('-', ' ')
            crumbs.push({ label: entityLabel, href: href + '/' + entity, type: entity })
            i++
          }
        } else if (segment === 'account') {
          crumbs.push({ label: 'Account', href: href, type: 'account' })
        } else if (segment === 'network') {
          crumbs.push({ label: 'Network', href: href, type: 'network' })
        } else if (segment && segment.length > 0) {
          // Handle entity IDs or specific pages
          const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace('-', ' ')
          crumbs.push({ label, href, type: 'entity' })
        }
      }

      setBreadcrumbs(crumbs)
    }

    const loadTerminology = async () => {
      try {
        const { data } = await supabase
          .from('terminology_overrides')
          .select('key, singular, plural')

        if (data) {
          const terms: Record<string, {singular: string, plural: string}> = {}
          data.forEach((term: any) => {
            terms[term.key] = { singular: term.singular, plural: term.plural }
          })
          setTerminology(terms)
        }
      } catch (error) {
        // Handle error silently
      }
    }

    loadTerminology()
    loadBreadcrumbs()
  }, [pathname, params, supabase, terminology])

  if (breadcrumbs.length <= 1) return null

  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground">
      {breadcrumbs.map((crumb, index) => (
        <div key={crumb.href} className="flex items-center">
          {index > 0 && <ChevronRight className="h-4 w-4 mx-1" />}
          {index === breadcrumbs.length - 1 ? (
            <span className="font-medium text-foreground">{crumb.label}</span>
          ) : (
            <Link href={crumb.href} className="hover:text-foreground transition-colors">
              {crumb.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  )
}

// AI Command Bar component
function AICommandBar() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')

  return (
    <div className="relative">
      <Button
        variant="outline"
        className="relative h-9 w-9 p-0 xl:h-10 xl:w-64 xl:justify-start xl:px-3 xl:py-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Search className="h-4 w-4 xl:mr-2" />
        <span className="hidden xl:inline-flex">Search or ask AI...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 xl:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      {isOpen && (
        <div className="absolute top-full mt-2 w-96 rounded-md border bg-popover p-4 shadow-md">
          <Input
            placeholder="Ask AI or search anything..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="mb-2"
          />
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Quick Actions:</div>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="ghost" size="sm" className="justify-start">
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Report
              </Button>
              <Button variant="ghost" size="sm" className="justify-start">
                <CheckSquare className="mr-2 h-4 w-4" />
                Create Task
              </Button>
              <Button variant="ghost" size="sm" className="justify-start">
                <Workflow className="mr-2 h-4 w-4" />
                Start Workflow
              </Button>
              <Button variant="ghost" size="sm" className="justify-start">
                <MessageCircle className="mr-2 h-4 w-4" />
                Send Message
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Notifications dropdown (session-gated, no mock data)
function NotificationsDropdown() {
  const items: Array<{ title: string; body: string }> = []

  if (items.length === 0) {
    return (
      <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
        <Bell className="h-4 w-4" />
      </Button>
    )
  }

  const unreadCount = items.length

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="max-h-64 overflow-y-auto">
          {items.map((item) => (
            <DropdownMenuItem key={item.title} className="flex flex-col items-start p-4">
              <div className="font-medium">{item.title}</div>
              <div className="text-sm text-muted-foreground">{item.body}</div>
            </DropdownMenuItem>
          ))}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-center">
          View all notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Inbox dropdown (session-gated, no mock data)
function InboxDropdown() {
  const items: Array<{ title: string; body: string }> = []

  if (items.length === 0) {
    return (
      <Button variant="ghost" size="icon" className="relative" aria-label="Inbox">
        <Inbox className="h-4 w-4" />
      </Button>
    )
  }

  const unreadCount = items.length

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label="Inbox">
          <Inbox className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Inbox</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="max-h-64 overflow-y-auto">
          {items.map((item) => (
            <DropdownMenuItem key={item.title} className="flex flex-col items-start p-4">
              <div className="font-medium">{item.title}</div>
              <div className="text-sm text-muted-foreground">{item.body}</div>
            </DropdownMenuItem>
          ))}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-center">
          View all messages
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Quick Settings dropdown
function QuickSettingsDropdown() {
  const { mode, setTheme, resolvedTheme } = useThemeContext()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Quick Settings</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setTheme(mode === 'dark' ? 'light' : 'dark')}>
          {resolvedTheme === 'dark' ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
          {resolvedTheme === 'dark' ? 'Light' : 'Dark'} Theme
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Languages className="mr-2 h-4 w-4" />
          Language
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

type HeaderVariant = 'auto' | 'app' | 'marketing' | 'auth'

interface TopBarProps {
  showAuth?: boolean
  className?: string | undefined
  variant?: HeaderVariant
}

interface HeaderShellProps {
  left: ReactNode
  center?: ReactNode
  right?: ReactNode
  className?: string | undefined
}

const baseHeaderClasses = 'sticky top-0 z-50 border-b border-[var(--border-default)] bg-[var(--bg-primary)]/95 backdrop-blur supports-[backdrop-filter]:bg-[var(--bg-primary)]/80'

function HeaderShell({ left, center, right, className }: HeaderShellProps) {
  return (
    <header className={`${baseHeaderClasses} ${className || ''}`} style={{ fontFamily: 'Share Tech, sans-serif' }}>
      <div className="container mx-auto flex items-center gap-4 px-4 py-3 min-h-[64px] text-[var(--text-primary)]">
        <div className="flex items-center gap-3 whitespace-nowrap">{left}</div>
        <div className="flex flex-1 items-center justify-center gap-4">
          {center}
        </div>
        <div className="flex items-center gap-2 whitespace-nowrap">{right}</div>
      </div>
    </header>
  )
}

export function Header({ showAuth = true, className, variant = 'auto' }: TopBarProps) {
  const { data: session, status } = useSession()
  const { brand } = useBrand()
  const { supabase } = useSupabase()
  const pathname = usePathname()
  const [branding, setBranding] = useState<any>(null)
  const [currentOrg, setCurrentOrg] = useState<any>(null)

  const resolvedVariant: HeaderVariant = useMemo(() => {
    if (variant !== 'auto') return variant
    if (!pathname) return 'marketing'
    if (pathname.startsWith('/auth')) return 'auth'
    if (pathname.startsWith('/dashboard') || pathname.startsWith('/home')) return 'app'
    return 'marketing'
  }, [variant, pathname])

  useEffect(() => {
    const loadBranding = async () => {
      if (session?.user?.organizationId) {
        const { data: brandingData } = await supabase
          .from('branding_settings')
          .select('*')
          .eq('organization_id', session.user.organizationId)
          .single()

        if (brandingData) {
          setBranding(brandingData)
        }

        const { data: orgData } = await supabase
          .from('organizations')
          .select('*')
          .eq('id', session.user.organizationId)
          .single()

        if (orgData) {
          setCurrentOrg(orgData)
        }
      }
    }

    if (session) {
      loadBranding()
    }
  }, [session, supabase])

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
  }

  const getUserRoleIcon = (role: string) => {
    switch (role) {
      case 'platform_dev':
        return <span className="text-xs">DEV</span>
      case 'super_admin':
        return <span className="text-xs">SA</span>
      case 'admin':
        return <span className="text-xs">ADM</span>
      default:
        return <User className="h-3 w-3" />
    }
  }

  const renderBrand = (destination: string, labelFallback: string) => (
    <Link href={destination} className="flex items-center space-x-2">
      {branding?.logo ? (
        <Image
          src={branding.logo.url}
          alt={branding.name || currentOrg?.name || labelFallback}
          width={32}
          height={32}
          className="h-8 w-auto"
        />
      ) : (
        <div
          className="text-xl font-display font-bold"
          style={{
            color: branding?.colors?.primary || undefined,
            fontFamily: branding?.typography?.fontFamily || undefined
          }}
        >
          {branding?.name || currentOrg?.name || labelFallback}
        </div>
      )}
    </Link>
  )

  const renderAuthCtas = () => (
    <div className="flex items-center space-x-2">
      <Button variant="ghost" asChild>
        <Link href="/auth/login">Sign In</Link>
      </Button>
      <Button asChild>
        <Link href="/auth/signup">Get Started</Link>
      </Button>
    </div>
  )

  const renderUserMenu = () => {
    if (status === 'loading') {
      return <div className="h-8 w-8 animate-pulse bg-muted rounded-full" />
    }

    if (!session?.user) {
      return showAuth ? renderAuthCtas() : null
    }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={(session.user as any).image || undefined} alt={session.user.name || ''} />
              <AvatarFallback>
                {session.user.name ? getInitials(session.user.name) : 'U'}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {session.user.name}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {session.user.email}
              </p>
              <div className="flex items-center space-x-1 pt-1">
                {getUserRoleIcon(session.user.role)}
                <span className="text-xs text-muted-foreground capitalize">
                  {session.user.role?.replace('_', ' ')}
                </span>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/dashboard/account/profile">
              <User className="mr-2 h-4 w-4" />
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  const renderAppHeader = () => (
    <HeaderShell
      className={className}
      left={<Breadcrumbs />}
      center={
        <div className="flex items-center gap-3">
          <AICommandBar />
          {renderBrand('/dashboard', brand.toUpperCase())}
        </div>
      }
      right={
        <div className="flex items-center gap-2">
          {session ? (
            <>
              <NotificationsDropdown />
              <InboxDropdown />
              <QuickSettingsDropdown />
              <Button variant="ghost" size="icon" asChild>
                <Link href="/dashboard/account/support">
                  <LifeBuoy className="h-4 w-4" />
                </Link>
              </Button>
            </>
          ) : null}
          {renderUserMenu()}
        </div>
      }
    />
  )

  const renderAuthHeader = () => (
    <HeaderShell
      className={className}
      left={renderBrand('/', brand.toUpperCase())}
      right={
        <Button
          className="h-9 rounded-full bg-[var(--color-accent-primary)] px-4 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition hover:brightness-95"
          asChild
        >
          <Link href="/auth/signup">Start free</Link>
        </Button>
      }
    />
  )

  const renderMarketingHeader = () => (
    <HeaderShell
      className={className}
      left={
        <div className="flex items-center gap-3">
          {renderBrand('/', brand.toUpperCase())}
          <span
            className="hidden rounded-full border border-[var(--border-default)] bg-[var(--surface-default)] px-3 py-1 text-xs uppercase tracking-[0.16em] text-[var(--text-secondary)] sm:inline"
            style={{ fontFamily: 'Share Tech Mono, monospace' }}
          >
            Live Ops Ecosystem
          </span>
        </div>
      }
      center={
        <nav className="hidden items-center gap-3 text-sm text-[var(--text-primary)] sm:flex" style={{ fontFamily: 'Share Tech, sans-serif' }}>
          <Link href="/products" className="rounded-full px-3 py-2 text-[var(--text-secondary)] transition hover:text-[var(--color-accent-primary)]">
            Products
          </Link>
          <Link href="/solutions" className="rounded-full px-3 py-2 text-[var(--text-secondary)] transition hover:text-[var(--color-accent-primary)]">
            Solutions
          </Link>
          <Link href="/features" className="rounded-full px-3 py-2 text-[var(--text-secondary)] transition hover:text-[var(--color-accent-primary)]">
            Features
          </Link>
          <Link href="#pricing" className="rounded-full px-3 py-2 text-[var(--text-secondary)] transition hover:text-[var(--color-accent-primary)]">
            Pricing
          </Link>
          <Link href="/faq" className="rounded-full px-3 py-2 text-[var(--text-secondary)] transition hover:text-[var(--color-accent-primary)]">
            FAQ
          </Link>
          <Link href="/contact/partnerships" className="rounded-full px-3 py-2 text-[var(--text-secondary)] transition hover:text-[var(--color-accent-primary)]">
            Contact
          </Link>
        </nav>
      }
      right={
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="h-9 rounded-full border-[var(--border-default)] bg-[var(--surface-default)] px-4 text-[var(--text-primary)] transition hover:border-[var(--color-accent-primary)] hover:text-[var(--color-accent-primary)]"
            asChild
          >
            <Link href="/auth/login">Sign In</Link>
          </Button>
          <Button
            className="h-9 rounded-full bg-[var(--color-accent-primary)] px-4 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition hover:brightness-95"
            asChild
          >
            <Link href="/auth/signup">Start free</Link>
          </Button>
        </div>
      }
    />
  )

  if (resolvedVariant === 'app') {
    return renderAppHeader()
  }

  if (resolvedVariant === 'auth') {
    return renderAuthHeader()
  }

  return renderMarketingHeader()
}
