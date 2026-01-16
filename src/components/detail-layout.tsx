
import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  ArrowLeft,
  Share
} from 'lucide-react'

export interface DetailLayoutProps {
  title: string
  subtitle?: string
  status?: string
  statusColor?: 'default' | 'secondary' | 'destructive' | 'outline'
  metadata?: Array<{
    label: string
    value: string | React.ReactNode
    icon?: React.ComponentType<{ className?: string }>
  }>
  actions?: Array<{
    label: string
    onClick: () => void
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
    icon?: React.ComponentType<{ className?: string }>
  }>
  children: React.ReactNode
  onBack?: () => void
  backLabel?: string
  className?: string
}

const DetailLayout: React.FC<DetailLayoutProps> = ({
  title,
  subtitle,
  status,
  statusColor = 'default',
  metadata = [],
  actions = [],
  children,
  onBack,
  backLabel = 'Back',
  className
}) => {
  return (
    <div className={`max-w-6xl mx-auto p-6 space-y-6 ${className || ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {onBack && (
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2"/>
              {backLabel}
            </Button>
          )}
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold">{title}</h1>
              {status && (
                <Badge variant={statusColor}>
                  {status}
                </Badge>
              )}
            </div>
            {subtitle && (
              <p className="text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {actions.map((action, index) => {
            const Icon = action.icon
            return (
              <Button
                key={index}
                variant={action.variant || 'outline'}
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

      {/* Metadata */}
      {metadata.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {metadata.map((item, index) => {
                const Icon = item.icon
                return (
                  <div key={index} className="flex items-center space-x-3">
                    {Icon && <Icon className="w-4 h-4 text-muted-foreground"/>}
                    <div>
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-sm text-muted-foreground">{item.value}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      <div className="space-y-6">
        {children}
      </div>
    </div>
  )
}

export default DetailLayout