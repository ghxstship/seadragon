
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export interface DashboardWidget {
  id: string
  title: string
  size: 'small' | 'medium' | 'large'
  content: React.ReactNode
}

export interface DashboardAction {
  label: string
  icon?: React.ComponentType<{ className?: string }>
  onClick: () => void
}

export interface DashboardLayoutProps {
  title: string
  subtitle?: string
  widgets: DashboardWidget[]
  actions?: DashboardAction[]
  sidebar?: React.ReactNode
  className?: string
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  title,
  subtitle,
  widgets,
  actions = [],
  sidebar,
  className
}) => {
  const getWidgetSize = (size: string) => {
    switch (size) {
      case 'large': return 'col-span-1 md:col-span-2 lg:col-span-3'
      case 'medium': return 'col-span-1 md:col-span-1 lg:col-span-2'
      case 'small': return 'col-span-1'
      default: return 'col-span-1'
    }
  }

  return (
    <div className={`min-h-screen bg-background ${className || ''}`}>
      <div className="flex">
        {/* Optional Sidebar */}
        {sidebar && (
          <div className="w-64 border-r bg-muted/10 p-4">
            {sidebar}
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
          <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-14 items-center px-4">
              <div className="flex items-center space-x-4 ml-4">
                <div>
                  <h1 className="font-semibold">{title}</h1>
                  {subtitle && <p className="text-muted-foreground text-sm">{subtitle}</p>}
                </div>
              </div>
              <div className="ml-auto flex items-center space-x-4">
                {actions.map((action, index) => {
                  const Icon = action.icon
                  return (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={action.onClick}
                    >
                      {Icon && <Icon className="w-4 h-4 mr-2"/>}
                      {action.label}
                    </Button>
                  )
                })}
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 overflow-auto p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {widgets.map((widget) => (
                <div key={widget.id} className={getWidgetSize(widget.size)}>
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle className="text-lg">{widget.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1">
                      {widget.content}
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout
