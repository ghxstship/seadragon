'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useSupabase } from '@/contexts/SupabaseContext'
import { useSession } from 'next-auth/react'
import { sidebarNav, allowedForRole, Role, NavItem, NavSection } from '@/config/navigation'
import { ChevronDown, ChevronRight } from 'lucide-react'

interface SidebarProps {
  className?: string
}

function NavItemComponent({ item, level = 0, terminology, featureToggles }: {
  item: NavItem;
  level?: number;
  terminology: Record<string, {singular: string, plural: string}>;
  featureToggles: Record<string, boolean>
}) {
  const pathname = usePathname()
  const { data: session } = useSession()

  const userRole = (session?.user?.role as Role) || 'guest'
  const hasAccess = allowedForRole(item, userRole)

  // Check if feature is enabled
  const isFeatureEnabled = featureToggles[item.id] !== false
  if (!isFeatureEnabled) return null

  if (!hasAccess) return null

  const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
  const hasChildren = item.children && item.children.length > 0

  // Get custom terminology
  const customLabel = terminology[item.id]?.plural || terminology[item.id]?.singular || item.label

  return (
    <div>
      <Link
        href={item.href}
        className={cn(
          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors',
          isActive && 'bg-accent text-accent-foreground',
          level > 0 && 'ml-6'
        )}
        onClick={(e) => {
          if (hasChildren) {
            e.preventDefault()
            setIsOpen(!isOpen)
          }
        }}
      >
        {item.icon ? <item.icon className="h-4 w-4"/> : null}
        <span className="flex-1">{customLabel}</span>
        {hasChildren && (
          isOpen ? <ChevronDown className="h-4 w-4"/> : <ChevronRight className="h-4 w-4"/>
        )}
      </Link>
      {hasChildren && isOpen && (
        <div className="mt-1">
          {item.children?.map((child: NavItem) => (
            <NavItemComponent
              key={child.href}
              item={child}
              level={level + 1}
              terminology={terminology}
              featureToggles={featureToggles}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function Sidebar({ className }: SidebarProps) {
  const { supabase } = useSupabase()
  const { data: session } = useSession()
  const [featureToggles, setFeatureToggles] = useState<Record<string, boolean>>({})
  const [terminology, setTerminology] = useState<Record<string, {singular: string, plural: string}>>({})

  useEffect(() => {
    const loadFeatureToggles = async () => {
      if (session?.user?.organizationId) {
        const { data } = await supabase
          .from('organization_features')
          .select('feature_name, is_enabled')
          .eq('organization_id', session.user.organizationId)

        if (data) {
          const toggles: Record<string, boolean> = {}
          data.forEach(feature => {
            toggles[feature.feature_name] = feature.is_enabled
          })
          setFeatureToggles(toggles)
        }
      }
    }

    const loadTerminology = async () => {
      if (session?.user?.organizationId) {
        const { data } = await supabase
          .from('terminology_overrides')
          .select('key, singular, plural')
          .eq('organization_id', session.user.organizationId)

        if (data) {
          const terms: Record<string, {singular: string, plural: string}> = {}
          data.forEach(term => {
            terms[term.key] = { singular: term.singular, plural: term.plural }
          })
          setTerminology(terms)
        }
      }
    }

    if (session) {
      loadFeatureToggles()
      loadTerminology()
    }
  }, [session, supabase])

  // Filter sections based on feature toggles
  const filteredNav = sidebarNav.filter(section =>
    featureToggles[section.id] !== false
  )

  return (
    <div className={cn('flex h-full w-64 flex-col border-r bg-background', className)}>
      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-6">
          {filteredNav.map((section: NavSection) => {
            // Get custom section label
            const customSectionLabel = terminology[section.id.toLowerCase()]?.plural || section.label

            return (
              <div key={section.id}>
                <h2 className="mb-2 px-3 text-xs font-semibold tracking-tight text-muted-foreground uppercase">
                  {customSectionLabel}
                </h2>
                <nav className="space-y-1">
                  {section.items.map((item: NavItem) => (
                    <NavItemComponent
                      key={item.href}
                      item={item}
                      terminology={terminology}
                      featureToggles={featureToggles}
                    />
                  ))}
                </nav>
              </div>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}
