
import React, { useState } from 'react'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  ChevronLeft,
  ChevronRight,
  Edit,
  Share,
  Download,
  MoreVertical,
  Star,
  Heart,
  Bookmark,
  ExternalLink,
  Calendar,
  Users,
  MapPin,
  DollarSign,
  Clock,
  Tag,
  Link as LinkIcon
} from 'lucide-react'
import { cn } from '@/lib/utils'

export interface DetailLayoutBreadcrumbItem {
  label: string
  href?: string
  icon?: React.ComponentType<any>
}

export interface DetailLayoutAction {
  id?: string
  label: string
  onClick: () => void
  variant?: 'outline' | 'destructive' | 'default' | 'secondary' | 'link' | 'ghost' | string | null
  icon?: React.ComponentType<any>
  size?: 'sm' | 'md' | 'lg' | string
  disabled?: boolean
  loading?: boolean
}

export interface DetailLayoutTab {
  id: string
  label: string
  icon?: React.ComponentType<any>
  content: React.ReactNode
  badge?: string | number
  disabled?: boolean
}

export interface DetailLayoutSection {
  id: string
  title?: string
  content: React.ReactNode
  collapsible?: boolean
  defaultExpanded?: boolean
}

export interface DetailLayoutRelatedItem {
  id: string
  title: string
  subtitle?: string
  image?: string
  href?: string
  type?: 'link' | 'card' | string
  metadata?: Array<{
    label: string
    value: string | number
    icon?: React.ComponentType<any>
  }>
}

export interface DetailLayoutProps {
  // Header
  title: string
  subtitle?: string
  image?: string
  status?: {
    label: string
    variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success'
    icon?: React.ComponentType<any>
  }
  priority?: {
    level: 'low' | 'normal' | 'high' | 'urgent'
    label?: string
  }

  // Navigation
  breadcrumbs?: DetailLayoutBreadcrumbItem[]
  backHref?: string
  onBack?: () => void

  // Metadata
  metadata?: Array<{
    label: string
    value: string | number | React.ReactNode
    icon?: React.ComponentType<any>
    href?: string
  }>

  // Content
  tabs?: DetailLayoutTab[]
  sections?: DetailLayoutSection[]
  defaultTab?: string
  onTabChange?: (tabId: string) => void

  // Actions
  primaryAction?: DetailLayoutAction
  secondaryActions?: DetailLayoutAction[]
  menuActions?: DetailLayoutAction[]
  actions?: DetailLayoutAction[]
  actionMenu?: Array<{ label: string; items: Array<{ label: string; onClick: () => void }> }>

  // Related content
  relatedItems?: DetailLayoutRelatedItem[]
  relatedTitle?: string
  relatedItemsLoader?: () => void
  itemsPerPage?: number

  // Layout options
  variant?: 'default' | 'compact' | 'wide'
  loading?: boolean
  isLoading?: boolean
  error?: string
  showRelated?: boolean
  stickyHeader?: boolean
  className?: string
  children?: React.ReactNode

  // Callbacks
  onFavorite?: () => void
  onBookmark?: () => void
  onShare?: () => void
  isFavorited?: boolean
  isBookmarked?: boolean
}

const DetailLayout: React.FC<DetailLayoutProps> = ({
  title,
  subtitle,
  image,
  status,
  priority,
  breadcrumbs,
  backHref,
  onBack,
  metadata = [],
  tabs = [],
  sections = [],
  defaultTab,
  primaryAction,
  secondaryActions = [],
  menuActions = [],
  relatedItems = [],
  relatedTitle = 'Related Items',
  variant = 'default',
  onTabChange,
  showRelated = false,
  stickyHeader = false,
  className,
  onFavorite,
  onBookmark,
  onShare,
  isFavorited = false,
  isBookmarked = false,
  loading,
  isLoading = loading,
  children
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id || '')
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})

  const handleSectionToggle = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }))
  }

  const getPriorityColor = (level: string) => {
    switch (level) {
      case 'urgent': return 'text-semantic-error bg-red-50 border-red-200'
      case 'high': return 'text-semantic-warning bg-orange-50 border-orange-200'
      case 'normal': return 'text-accent-secondary bg-blue-50 border-blue-200'
      case 'low': return 'text-neutral-600 bg-gray-50 border-neutral-200'
      default: return 'text-neutral-600 bg-gray-50 border-neutral-200'
    }
  }

  const getStatusVariant = (variant?: string) => {
    switch (variant) {
      case 'secondary': return 'secondary'
      case 'destructive': return 'destructive'
      case 'outline': return 'outline'
      default: return 'default'
    }
  }

  const layoutClasses = cn(
    "w-full",
    {
      "max-w-7xl mx-auto": variant === 'wide',
      "max-w-4xl mx-auto": variant === 'default',
      "max-w-2xl mx-auto": variant === 'compact'
    },
    className
  )

  return (
    <div className={layoutClasses}>
      {/* Header Section */}
      <div className={cn(
        "bg-background border-b",
        stickyHeader && "sticky top-0 z-40"
      )}>
        <div className="px-6 py-6">
          {/* Breadcrumbs */}
          {breadcrumbs && breadcrumbs.length > 0 && (
            <Breadcrumb className="mb-4">
              <BreadcrumbList>
                {backHref && (
                  <BreadcrumbItem>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onBack}
                      className="p-0 h-auto font-normal text-muted-foreground hover:text-foreground"
                    >
                      <ChevronLeft className="w-4 h-4 mr-1"/>
                      Back
                    </Button>
                  </BreadcrumbItem>
                )}
                {breadcrumbs.map((crumb, index) => (
                  <React.Fragment key={crumb.label}>
                    {index > 0 && <BreadcrumbSeparator/>}
                    <BreadcrumbItem>
                      {crumb.href ? (
                        <BreadcrumbLink href={crumb.href} className="flex items-center">
                          {crumb.icon && <crumb.icon className="w-4 h-4 mr-1"/>}
                          {crumb.label}
                        </BreadcrumbLink>
                      ) : (
                        <BreadcrumbPage className="flex items-center">
                          {crumb.icon && <crumb.icon className="w-4 h-4 mr-1"/>}
                          {crumb.label}
                        </BreadcrumbPage>
                      )}
                    </BreadcrumbItem>
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          )}

          {/* Header Content */}
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3 mb-2">
                {image && (
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={image} alt={title}/>
                    <AvatarFallback>
                      {title.split(' ').map(w => w[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h1 className="text-2xl font-bold truncate">{title}</h1>
                    {status && (
                      <Badge variant={getStatusVariant(status.variant)} className="flex items-center space-x-1">
                        {status.icon && <status.icon className="w-3 h-3"/>}
                        <span>{status.label}</span>
                      </Badge>
                    )}
                    {priority && (
                      <Badge variant="outline" className={cn("text-xs", getPriorityColor(priority.level))}>
                        {priority.label || priority.level.toUpperCase()}
                      </Badge>
                    )}
                  </div>

                  {subtitle && (
                    <p className="text-muted-foreground text-lg">{subtitle}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2 ml-4">
              {onFavorite && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onFavorite}
                  className={cn(isFavorited && "text-semantic-error")}
                >
                  <Heart className={cn("w-4 h-4", isFavorited && "fill-current")}/>
                </Button>
              )}

              {onBookmark && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onBookmark}
                  className={cn(isBookmarked && "text-accent-secondary")}
                >
                  <Bookmark className={cn("w-4 h-4", isBookmarked && "fill-current")}/>
                </Button>
              )}

              {onShare && (
                <Button variant="ghost" size="sm" onClick={onShare}>
                  <Share className="w-4 h-4"/>
                </Button>
              )}

              {menuActions.length > 0 && (
                <div className="relative">
                  {/* Dropdown menu would go here */}
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="w-4 h-4"/>
                  </Button>
                </div>
              )}

              {secondaryActions.map(action => (
                <Button
                  key={action.id}
                  variant={(action.variant as "default" | "destructive" | "outline" | "secondary" | "ghost") || "outline"}
                  size={(action.size as "default" | "sm" | "lg" | "icon") || "sm"}
                  onClick={action.onClick}
                  disabled={action.disabled || action.loading}
                >
                  {action.icon && React.createElement(action.icon as any, { className: "w-4 h-4 mr-2" })}
                  {action.label}
                </Button>
              ))}

              {primaryAction && (
                <Button
                  variant={(primaryAction.variant as "default" | "destructive" | "outline" | "secondary" | "ghost") || "default"}
                  size={(primaryAction.size as "default" | "sm" | "lg" | "icon") || "sm"}
                  onClick={primaryAction.onClick}
                  disabled={primaryAction.disabled || primaryAction.loading}
                >
                  {primaryAction.icon && React.createElement(primaryAction.icon as any, { className: "w-4 h-4 mr-2" })}
                  {primaryAction.label}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Metadata Section */}
      {metadata.length > 0 && (
        <div className="px-6 py-4 bg-muted/30 border-b">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {metadata.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                {item.icon && React.createElement(item.icon as any, { className: "w-4 h-4 text-muted-foreground" })}
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                    {item.label}
                  </div>
                  <div className="text-sm font-medium truncate">
                    {item.href ? (
                      <a
                        href={item.href}
                        className="text-primary hover:underline flex items-center"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {item.value}
                        <ExternalLink className="w-3 h-3 ml-1"/>
                      </a>
                    ) : (
                      item.value
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex">
        {/* Main Content Area */}
        <div className="flex-1">
          <div className="p-6" role="main">
            {tabs.length > 0 ? (
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4 lg:grid-cols-6">
                  {tabs.map(tab => (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.id}
                      disabled={tab.disabled}
                      className="flex items-center space-x-2"
                    >
                      {tab.icon && React.createElement(tab.icon as any, { className: "w-4 h-4" })}
                      <span>{tab.label}</span>
                      {tab.badge && (
                        <Badge variant="secondary" className="text-xs ml-1">
                          {tab.badge}
                        </Badge>
                      )}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {tabs.map(tab => (
                  <TabsContent key={tab.id} value={tab.id} className="mt-6">
                    {tab.content}
                  </TabsContent>
                ))}
              </Tabs>
            ) : sections.length > 0 ? (
              <div className="space-y-6">
                {sections.map(section => (
                  <Card key={section.id}>
                    {section.title && (
                      <CardHeader>
                        <CardTitle className="text-lg">{section.title}</CardTitle>
                      </CardHeader>
                    )}
                    <CardContent>
                      {section.collapsible ? (
                        <details
                          open={expandedSections[section.id] ?? section.defaultExpanded ?? true}
                          onToggle={() => handleSectionToggle(section.id)}
                        >
                          <summary className="cursor-pointer font-medium mb-4">
                            {section.title}
                          </summary>
                          <div className="mt-4">
                            {section.content}
                          </div>
                        </details>
                      ) : (
                        section.content
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        {/* Related Items Sidebar */}
        {showRelated && relatedItems.length > 0 && (
          <div className="w-80 border-l bg-muted/10">
            <div className="p-6">
              <h3 className="font-semibold mb-4">{relatedTitle}</h3>
              <div className="space-y-3">
                {relatedItems.map(item => (
                  <Card key={item.id} className="cursor-pointer hover:shadow-sm transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        {item.image && (
                          <Image
                            src={item.image}
                            alt={item.title}
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded object-cover flex-shrink-0"/>
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{item.title}</h4>
                          {item.subtitle && (
                            <p className="text-xs text-muted-foreground truncate">{item.subtitle}</p>
                          )}
                          {item.metadata && item.metadata.length > 0 && (
                            <div className="flex items-center space-x-2 mt-2">
                              {item.metadata.slice(0, 2).map((meta, index) => (
                                <div key={index} className="flex items-center space-x-1 text-xs text-muted-foreground">
                                  {meta.icon && <meta.icon className="w-3 h-3"/>}
                                  <span>{meta.value}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        {item.type === 'link' && (
                          <ExternalLink className="w-4 h-4 text-muted-foreground flex-shrink-0"/>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      {children}
    </div>
  )
}

export default DetailLayout