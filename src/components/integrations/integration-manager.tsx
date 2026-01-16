
import React, { useState, useEffect } from 'react'
import { logger } from '@/lib/logger'
import { ErrorBoundary } from '@/lib/error-handling'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Plus,
  Settings,
  ExternalLink,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Key,
  Webhook,
  Database,
  Zap,
  Info
} from 'lucide-react'
import { integrationAuthManager } from '@/lib/integrations/auth-manager'
import { getWebhookStats } from '@/lib/integrations/webhook-processor'
import { getSyncConflicts } from '@/lib/integrations/sync-manager'

interface IntegrationConfig {
  id: string
  name: string
  description: string
  icon: React.ComponentType<any>
  category: 'payment' | 'project' | 'communication' | 'analytics' | 'development'
  authType: 'oauth2' | 'api_key' | 'webhook'
  status: 'connected' | 'disconnected' | 'error' | 'configuring'
  lastSync?: Date
  webhooksEnabled?: boolean
  apiKeyRequired?: boolean
  oauthRequired?: boolean
  config: Record<string, any>
}

interface IntegrationManagerProps {
  organizationId: string
  onIntegrationConnect?: (providerId: string) => void
  onIntegrationDisconnect?: (providerId: string) => void
  onConfigUpdate?: (providerId: string, config: Record<string, any>) => void
}

const INTEGRATION_PROVIDERS: IntegrationConfig[] = [
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'Payment processing and financial management',
    icon: Database,
    category: 'payment',
    authType: 'api_key',
    status: 'disconnected',
    apiKeyRequired: true,
    webhooksEnabled: true,
    config: {}
  },
  {
    id: 'google-analytics',
    name: 'Google Analytics',
    description: 'Web analytics and audience insights',
    icon: Database,
    category: 'analytics',
    authType: 'oauth2',
    status: 'disconnected',
    oauthRequired: true,
    config: {}
  },
  {
    id: 'github',
    name: 'GitHub',
    description: 'Code repository and development workflow',
    icon: Database,
    category: 'development',
    authType: 'oauth2',
    status: 'disconnected',
    oauthRequired: true,
    webhooksEnabled: true,
    config: {}
  },
  {
    id: 'jira',
    name: 'Jira',
    description: 'Project management and issue tracking',
    icon: Database,
    category: 'project',
    authType: 'oauth2',
    status: 'disconnected',
    oauthRequired: true,
    webhooksEnabled: true,
    config: {}
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Team communication and notifications',
    icon: Database,
    category: 'communication',
    authType: 'oauth2',
    status: 'disconnected',
    oauthRequired: true,
    webhooksEnabled: true,
    config: {}
  }
]

const IntegrationManager: React.FC<IntegrationManagerProps> = ({
  organizationId,
  onIntegrationConnect,
  onIntegrationDisconnect,
  onConfigUpdate
}) => {
  return (
    <ErrorBoundary>
      <IntegrationManagerInner
        organizationId={organizationId}
        onIntegrationConnect={onIntegrationConnect}
        onIntegrationDisconnect={onIntegrationDisconnect}
        onConfigUpdate={onConfigUpdate}
      />
    </ErrorBoundary>
  )
}

const IntegrationManagerInner: React.FC<IntegrationManagerProps> = ({
}) => {
  const [integrations, setIntegrations] = useState<IntegrationConfig[]>(INTEGRATION_PROVIDERS)
  const [selectedIntegration, setSelectedIntegration] = useState<IntegrationConfig | null>(null)
  const [showConfigDialog, setShowConfigDialog] = useState(false)
  const [showConnectDialog, setShowConnectDialog] = useState(false)
  const [configValues, setConfigValues] = useState<Record<string, any>>({})
  const [activeTab, setActiveTab] = useState('overview')

  const loadIntegrationStatus = useCallback(async () => {
    try {
      const activeSessions = integrationAuthManager.getActiveSessions(organizationId)

      setIntegrations(prev => prev.map(integration => {
        const session = activeSessions.find(s => s.providerId === integration.id)
        return {
          ...integration,
          status: session ? 'connected' : 'disconnected',
          lastSync: session?.updatedAt
        }
      }))
    } catch (error) {
      logger.error('Failed to load integration status', error)
    }
  }, [setIntegrations])

  // Load integration status on mount
  useEffect(() => {
    loadIntegrationStatus()
  }, [loadIntegrationStatus])

  const handleConnect = async (integration: IntegrationConfig) => {
    if (integration.authType === 'oauth2') {
      // Initiate OAuth flow
      try {
        const authUrl = await initiateOAuthFlow(integration.id)
        window.open(authUrl, '_blank')
        setShowConnectDialog(false)
        onIntegrationConnect?.(integration.id)
      } catch (error) {
        logger.error('Failed to initiate OAuth', error)
      }
    } else if (integration.authType === 'api_key') {
      setSelectedIntegration(integration)
      setShowConnectDialog(false)
      setShowConfigDialog(true)
    }
  }

  const handleDisconnect = async (integration: IntegrationConfig) => {
    try {
      const sessions = integrationAuthManager.getActiveSessions(organizationId)
      const session = sessions.find(s => s.providerId === integration.id)

      if (session) {
        await integrationAuthManager.revokeAuth(session.id)
      }

      setIntegrations(prev => prev.map(i =>
        i.id === integration.id ? { ...i, status: 'disconnected' } : i
      ))

      onIntegrationDisconnect?.(integration.id)
    } catch (error) {
      logger.error('Failed to disconnect integration', error)
    }
  }

  const handleConfigSave = async () => {
    if (!selectedIntegration) return

    try {
      if (selectedIntegration.authType === 'api_key') {
        const apiKey = configValues.apiKey
        if (!apiKey) return

        await integrationAuthManager.setupApiKeyAuth(
          selectedIntegration.id,
          organizationId,
          'current-user-id',
          apiKey,
          configValues
        )
      }

      setIntegrations(prev => prev.map(i =>
        i.id === selectedIntegration.id ? { ...i, status: 'connected', config: configValues } : i
      ))

      onConfigUpdate?.(selectedIntegration.id, configValues)
      setShowConfigDialog(false)
      setSelectedIntegration(null)
      setConfigValues({})
    } catch (error) {
      logger.error('Failed to save configuration', error)
    }
  }

  const initiateOAuthFlow = async (providerId: string) => {
    // This would call the backend API to start OAuth flow
    return `https://example.com/oauth/${providerId}`
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-4 h-4 text-semantic-success"/>
      case 'error':
        return <XCircle className="w-4 h-4 text-semantic-error"/>
      case 'configuring':
        return <AlertTriangle className="w-4 h-4 text-semantic-warning"/>
      default:
        return <XCircle className="w-4 h-4 text-neutral-400"/>
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      connected: 'default',
      disconnected: 'secondary',
      error: 'destructive',
      configuring: 'secondary'
    } as const

    return (
      <Badge variant={variants[status as keyof typeof variants]}>
        {status}
      </Badge>
    )
  }

  const webhookStats = getWebhookStats()
  const syncConflicts = getSyncConflicts()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Integrations</h1>
          <p className="text-muted-foreground mt-2">
            Connect and manage third-party services
          </p>
        </div>
        <Button onClick={() => setShowConnectDialog(true)}>
          <Plus className="w-4 h-4 mr-2"/>
          Add Integration
        </Button>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-semantic-success"/>
              <div>
                <p className="text-sm font-medium">Connected</p>
                <p className="text-2xl font-bold">
                  {integrations.filter(i => i.status === 'connected').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Webhook className="w-4 h-4 text-accent-secondary"/>
              <div>
                <p className="text-sm font-medium">Webhooks</p>
                <p className="text-2xl font-bold">{webhookStats.totalEvents}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Database className="w-4 h-4 text-accent-primary"/>
              <div>
                <p className="text-sm font-medium">Sync Conflicts</p>
                <p className="text-2xl font-bold">{syncConflicts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-semantic-warning"/>
              <div>
                <p className="text-sm font-medium">Failed Events</p>
                <p className="text-2xl font-bold">{webhookStats.failedEvents}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="sync">Data Sync</TabsTrigger>
          <TabsTrigger value="logs">Activity Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {integrations.map(integration => (
              <Card key={integration.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <integration.icon className="w-8 h-8"/>
                      <div>
                        <CardTitle className="text-lg">{integration.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{integration.category}</p>
                      </div>
                    </div>
                    {getStatusIcon(integration.status)}
                  </div>
                </CardHeader>

                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {integration.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span>Status</span>
                      {getStatusBadge(integration.status)}
                    </div>

                    {integration.lastSync && (
                      <div className="flex items-center justify-between text-sm">
                        <span>Last Sync</span>
                        <span className="text-muted-foreground">
                          {integration.lastSync.toLocaleDateString()}
                        </span>
                      </div>
                    )}

                    {integration.webhooksEnabled && (
                      <div className="flex items-center justify-between text-sm">
                        <span>Webhooks</span>
                        <Badge variant="outline" className="text-xs">
                          {integration.status === 'connected' ? 'Enabled' : 'Disabled'}
                        </Badge>
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    {integration.status === 'connected' ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedIntegration(integration)
                            setShowConfigDialog(true)
                          }}
                        >
                          <Settings className="w-4 h-4 mr-2"/>
                          Configure
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDisconnect(integration)}
                        >
                          Disconnect
                        </Button>
                      </>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleConnect(integration)}
                      >
                        Connect
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="webhooks" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Webhook Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <Info className="h-4 w-4"/>
                  <AlertDescription>
                    Webhooks automatically process events from connected services.
                    {webhookStats.failedEvents > 0 && (
                      <span className="text-semantic-error ml-2">
                        {webhookStats.failedEvents} events failed and need attention.
                      </span>
                    )}
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded">
                    <div className="text-2xl font-bold">{webhookStats.totalEvents}</div>
                    <div className="text-sm text-muted-foreground">Total Events</div>
                  </div>
                  <div className="text-center p-4 border rounded">
                    <div className="text-2xl font-bold text-semantic-success">{webhookStats.pendingEvents}</div>
                    <div className="text-sm text-muted-foreground">Processing</div>
                  </div>
                  <div className="text-center p-4 border rounded">
                    <div className="text-2xl font-bold text-semantic-error">{webhookStats.failedEvents}</div>
                    <div className="text-sm text-muted-foreground">Failed</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sync" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Data Synchronization</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <Database className="h-4 w-4"/>
                  <AlertDescription>
                    Data synchronization keeps your platform in sync with connected services.
                    {syncConflicts.length > 0 && (
                      <span className="text-semantic-warning ml-2">
                        {syncConflicts.length} conflicts need resolution.
                      </span>
                    )}
                  </AlertDescription>
                </Alert>

                {syncConflicts.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Active Conflicts</h4>
                    {syncConflicts.map(conflict => (
                      <div key={conflict.id} className="p-3 border rounded">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{conflict.entityId}</span>
                          <Badge variant="outline">{conflict.providerId}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {conflict.conflictFields.join(', ')} fields have conflicts
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Activity Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Database className="w-12 h-12 mx-auto mb-2 opacity-50"/>
                <p>Activity logs will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Connect Integration Dialog */}
      <Dialog open={showConnectDialog} onOpenChange={setShowConnectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Integration</DialogTitle>
            <DialogDescription>
              Choose an integration to connect to your workspace
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {integrations
              .filter(i => i.status === 'disconnected')
              .map(integration => (
                <Card
                  key={integration.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleConnect(integration)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <integration.icon className="w-8 h-8"/>
                      <div>
                        <h4 className="font-medium">{integration.name}</h4>
                        <p className="text-sm text-muted-foreground">{integration.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Configuration Dialog */}
      <Dialog open={showConfigDialog} onOpenChange={setShowConfigDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configure {selectedIntegration?.name}</DialogTitle>
            <DialogDescription>
              Set up your integration settings
            </DialogDescription>
          </DialogHeader>

          {selectedIntegration?.supportsWebhook && (
            <div className="space-y-2">
              <Label htmlFor="webhookUrl">Webhook URL</Label>
              <Input
                id="webhookUrl"
                placeholder="https://your-app.com/webhooks/stripe"
                value={configValues.webhookUrl || ''}
                onChange={(e) => setConfigValues(prev => ({ ...prev, webhookUrl: e.target.value }))}/>
              <p className="text-xs text-muted-foreground mt-1">
                Configure this URL in your {selectedIntegration.name} dashboard
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="syncFrequency">Sync Frequency</Label>
            <Select
              value={configValues.syncFrequency || 'daily'}
              onValueChange={(value: 'hourly' | 'daily' | 'weekly') =>
                setConfigValues(prev => ({ ...prev, syncFrequency: value }))
              }
            >
              <SelectTrigger className="mt-1">
                <SelectValue/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hourly">Hourly</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setShowConfigDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveConfig}>Save Configuration</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default IntegrationManager
