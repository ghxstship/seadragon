import { LucideIcon, LayoutDashboard, Calendar, CheckSquare, Workflow, Boxes, FileText, FolderOpen, Users, Package, MapPin, ListChecks, LineChart, Network, Briefcase, ShoppingCart, PenSquare, ShieldCheck, BarChart3, Sparkles, MessageCircle, Award, Store, Handshake, Link as LinkIcon, User, Building2, CreditCard, Clock, BookOpen, Cpu, LifeBuoy, Bell, Inbox, Settings as SettingsIcon, Languages, MoonStar } from 'lucide-react'

export type Role = 'guest' | 'member' | 'manager' | 'admin' | 'super_admin' | 'platform_dev'

export interface NavItem {
  id: string
  label: string
  href: string
  icon?: LucideIcon
  roles?: Role[]
  children?: NavItem[]
  mobile?: 'primary' | 'more' | 'hidden'
}

export interface NavSection {
  id: string
  label: string
  items: NavItem[]
}

export const topBarNav: NavItem[] = [
  { id: 'breadcrumbs', label: 'Breadcrumbs', href: '#', icon: Bell, mobile: 'hidden' },
  { id: 'ai-command', label: 'AI Command Bar', href: '/dashboard/ai-concierge', icon: Sparkles, roles: ['member','manager','admin','super_admin','platform_dev'], mobile: 'hidden' },
  { id: 'notifications', label: 'Notifications', href: '/dashboard/messages/notifications', icon: Bell, roles: ['member','manager','admin','super_admin','platform_dev'], mobile: 'hidden' },
  { id: 'inbox', label: 'Inbox', href: '/dashboard/messages', icon: Inbox, roles: ['member','manager','admin','super_admin','platform_dev'], mobile: 'primary' },
  { id: 'settings', label: 'Settings', href: '/dashboard/account/profile', icon: SettingsIcon, roles: ['member','manager','admin','super_admin','platform_dev'], mobile: 'more' },
  { id: 'support', label: 'Support', href: '/dashboard/account/support', icon: LifeBuoy, roles: ['guest','member','manager','admin','super_admin','platform_dev'], mobile: 'more' },
  { id: 'language', label: 'Language', href: '/dashboard/account/profile', icon: Languages, roles: ['member','manager','admin','super_admin','platform_dev'], mobile: 'more' },
  { id: 'theme', label: 'Theme', href: '/dashboard/account/profile', icon: MoonStar, roles: ['member','manager','admin','super_admin','platform_dev'], mobile: 'more' },
  { id: 'user', label: 'User', href: '/dashboard/account/profile', icon: User, roles: ['member','manager','admin','super_admin','platform_dev'], mobile: 'more' }
]

export const sidebarNav: NavSection[] = [
  {
    id: 'core',
    label: 'CORE',
    items: [
      { id: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['member','manager','admin','super_admin','platform_dev'], mobile: 'primary' },
      { id: 'calendar', label: 'Calendar', href: '/dashboard/core/calendar', icon: Calendar, roles: ['member','manager','admin','super_admin','platform_dev'], mobile: 'primary' },
      { id: 'tasks', label: 'Tasks', href: '/dashboard/core/tasks', icon: CheckSquare, roles: ['member','manager','admin','super_admin','platform_dev'], mobile: 'primary' },
      { id: 'workflows', label: 'Workflows', href: '/dashboard/core/workflows', icon: Workflow, roles: ['member','manager','admin','super_admin','platform_dev'], mobile: 'primary' },
      { id: 'assets', label: 'Assets', href: '/dashboard/core/assets', icon: Boxes, roles: ['member','manager','admin','super_admin','platform_dev'], mobile: 'more' },
      { id: 'documents', label: 'Documents', href: '/dashboard/core/documents', icon: FileText, roles: ['member','manager','admin','super_admin','platform_dev'], mobile: 'more' }
    ]
  },
  {
    id: 'team',
    label: 'TEAM',
    items: [
      { id: 'projects', label: 'Projects', href: '/dashboard/team/projects', icon: FolderOpen, roles: ['member','manager','admin','super_admin','platform_dev'], mobile: 'more' },
      { id: 'programming', label: 'Programming', href: '/dashboard/team/programming', icon: Calendar, roles: ['member','manager','admin','super_admin','platform_dev'], mobile: 'more' },
      { id: 'people', label: 'People', href: '/dashboard/team/people', icon: Users, roles: ['member','manager','admin','super_admin','platform_dev'], mobile: 'more' },
      { id: 'products', label: 'Products', href: '/dashboard/team/products', icon: Package, roles: ['member','manager','admin','super_admin','platform_dev'], mobile: 'more' },
      { id: 'places', label: 'Places', href: '/dashboard/team/places', icon: MapPin, roles: ['member','manager','admin','super_admin','platform_dev'], mobile: 'more' },
      { id: 'procedures', label: 'Procedures', href: '/dashboard/team/procedures', icon: ListChecks, roles: ['member','manager','admin','super_admin','platform_dev'], mobile: 'more' }
    ]
  },
  {
    id: 'management',
    label: 'MANAGEMENT',
    items: [
      { id: 'forecast', label: 'Forecast', href: '/dashboard/management/forecast', icon: LineChart, roles: ['manager','admin','super_admin','platform_dev'], mobile: 'more' },
      { id: 'pipeline', label: 'Pipeline', href: '/dashboard/management/pipeline', icon: Network, roles: ['manager','admin','super_admin','platform_dev'], mobile: 'more' },
      { id: 'work_orders', label: 'Work Orders', href: '/dashboard/management/work-orders', icon: Briefcase, roles: ['manager','admin','super_admin','platform_dev'], mobile: 'more' },
      { id: 'content', label: 'Content', href: '/dashboard/management/content', icon: PenSquare, roles: ['manager','admin','super_admin','platform_dev'], mobile: 'more' },
      { id: 'procurement', label: 'Procurement', href: '/dashboard/management/procurement', icon: ShoppingCart, roles: ['manager','admin','super_admin','platform_dev'], mobile: 'more' },
      { id: 'compliance', label: 'Compliance', href: '/dashboard/management/compliance', icon: ShieldCheck, roles: ['manager','admin','super_admin','platform_dev'], mobile: 'more' },
      { id: 'reports', label: 'Reports', href: '/dashboard/management/reports', icon: BarChart3, roles: ['manager','admin','super_admin','platform_dev'], mobile: 'more' },
      { id: 'insights', label: 'Insights', href: '/dashboard/management/insights', icon: Sparkles, roles: ['manager','admin','super_admin','platform_dev'], mobile: 'more' }
    ]
  },
  {
    id: 'network',
    label: 'NETWORK',
    items: [
      { id: 'network', label: 'Network', href: '/dashboard/network', icon: Network, roles: ['member','manager','admin','super_admin','platform_dev'], mobile: 'more' }
    ]
  },
  {
    id: 'account',
    label: 'ACCOUNT',
    items: [
      { id: 'profile', label: 'Profile', href: '/dashboard/account/profile', icon: User, roles: ['member','manager','admin','super_admin','platform_dev'], mobile: 'more' },
      { id: 'organization', label: 'Organization', href: '/dashboard/account/organization', icon: Building2, roles: ['member','manager','admin','super_admin','platform_dev'], mobile: 'more' },
      { id: 'billing', label: 'Billing', href: '/dashboard/account/billing', icon: CreditCard, roles: ['member','manager','admin','super_admin','platform_dev'], mobile: 'more' },
      { id: 'history', label: 'History', href: '/dashboard/account/history', icon: Clock, roles: ['member','manager','admin','super_admin','platform_dev'], mobile: 'more' },
      { id: 'resources', label: 'Resources', href: '/dashboard/account/resources', icon: BookOpen, roles: ['member','manager','admin','super_admin','platform_dev'], mobile: 'more' },
      { id: 'system', label: 'System', href: '/dashboard/account/system', icon: Cpu, roles: ['admin','super_admin','platform_dev'], mobile: 'more' },
      { id: 'support', label: 'Support', href: '/dashboard/account/support', icon: LifeBuoy, roles: ['member','manager','admin','super_admin','platform_dev'], mobile: 'more' }
    ]
  }
]

export function allowedForRole(item: NavItem, role: Role): boolean {
  if (!item.roles) return true
  return item.roles.includes(role)
}
