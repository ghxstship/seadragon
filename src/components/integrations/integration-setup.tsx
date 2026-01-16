
// Integration Setup and Configuration Component

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { CheckCircle, XCircle, AlertTriangle, Loader2, Settings, Zap, Shield, Webhook } from 'lucide-react'
import { integrationManager } from '@/lib/integrations/manager'
import { IntegrationProvider, IntegrationConnection, IntegrationConfig } from '@/lib/integrations/types'

interface IntegrationSetupProps {
  organizationId: string
  onConnectionAdded?: (connection: IntegrationConnection) => void
  onConnectionUpdated?: (connection: IntegrationConnection) => void
}

export function IntegrationSetup({ organizationId, onConnectionAdded, onConnectionUpdated }: IntegrationSetupProps) {
  const [providers] = useState<IntegrationProvider[]>(integrationManager.getProviders())
  const [connections, setConnections] = useState<IntegrationConnection[]>([])
  const [selectedProvider, setSelectedProvider] = useState<IntegrationProvider | null>(null)
  const [config, setConfig] = useState<IntegrationConfig>({
    additionalConfig: {}
  })
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectionError, setConnectionError] = useState<string>('')

  useEffect(() => {
    // Load existing connections
    const orgConnections = integrationManager.getConnectionsForOrganization(organizationId)
    setConnections(orgConnections)
  }, [organizationId])

  const handleProviderSelect = (provider: IntegrationProvider) => {
    setSelectedProvider(provider)
    setConfig({
      additionalConfig: {}
    })
    setConnectionError('')
  }

  const handleConfigChange = (field: string, value: string) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleAdditionalConfigChange = (field: string, value: string) => {
    setConfig(prev => ({
      ...prev,
      additionalConfig: {
        ...prev.additionalConfig,
        [field]: value
      }
    }))
  }

  const handleConnect = async () => {
    if (!selectedProvider) return

    setIsConnecting(true)
    setConnectionError('')

    try {
      const connectionData: IntegrationConnection = {
        id: `conn_${Date.now()}`,
        providerId: selectedProvider.id,
        organizationId,
        userId: 'current-user', // Would come from auth context
        name: `${selectedProvider.name} Connection`,
        config,
        status: 'pending' as const,
        metadata: {},
        createdAt: new Date(),
        updatedAt: new Date()
      }

      await integrationManager.addConnection(connectionData)

      // Refresh connections
      const updatedConnections = integrationManager.getConnectionsForOrganization(organizationId)
      setConnections(updatedConnections)

      onConnectionAdded?.(connectionData)
      setSelectedProvider(null)
      setConfig({ additionalConfig: {} })
    } catch (error) {
      setConnectionError(error instanceof Error ? error.message : 'Connection failed')
    } finally {
      setIsConnecting(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-4 h-4 text-semantic-success"/>
      case 'disconnected':
      case 'error':
        return <XCircle className="w-4 h-4 text-semantic-error"/>
      case 'pending':
        return <Loader2 className="w-4 h-4 text-semantic-warning animate-spin"/>
      default:
        return <AlertTriangle className="w-4 h-4 text-neutral-500"/>
    }
  }

  const renderConfigFields = () => {
    if (!selectedProvider) return null

    const fields = []

    switch (selectedProvider.authentication) {
      case 'api_key':
        fields.push(
          <div key="apiKey" className="space-y-2">
            <Label htmlFor="apiKey">API Key</Label>
            <Input
              id="apiKey"
              type="password"
              value={config.apiKey || ''}
              onChange={(e) => handleConfigChange('apiKey', e.target.value)}
              placeholder="Enter your API key"/>
            <Textarea
              id="description"
              value={config.additionalConfig?.description || ''}
              onChange={(e) => handleAdditionalConfigChange('description', e.target.value)}
              placeholder="Enter a description for your API key"/>
          </div>
        )
        break

      case 'oauth2':
        fields.push(
          <div key="oauth" className="space-y-2">
            <Label>OAuth2 Authentication</Label>
            <Button type="button" variant="outline">
              <Zap className="w-4 h-4 mr-2"/>
              Authorize with {selectedProvider.name}
            </Button>
          </div>
        )
        break

      case 'basic_auth':
        fields.push(
          <div key="basic" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={config.additionalConfig?.username || ''}
                onChange={(e) => handleAdditionalConfigChange('username', e.target.value)}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={config.apiKey || ''}
                onChange={(e) => handleConfigChange('apiKey', e.target.value)}/>
            </div>
          </div>
        )
        break
    }

    // Add webhook URL for webhook-enabled providers
    if (selectedProvider.category === 'version_control' || selectedProvider.category === 'ci_cd') {
      fields.push(
        <div key="webhook" className="space-y-2">
          <Label htmlFor="webhookUrl">Webhook URL (Optional)</Label>
          <Input
            id="webhookUrl"
            value={config.webhookUrl || ''}
            onChange={(e) => handleConfigChange('webhookUrl', e.target.value)}
            placeholder="https://your-app.com/webhooks/provider"/>
        </div>
      )
    }

    return fields
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="w-5 h-5 mr-2"/>
            Integration Setup
          </CardTitle>
          <CardDescription>
            Connect your favorite tools and services to enhance your workflow
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="providers" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="providers">Available Integrations</TabsTrigger>
              <TabsTrigger value="connections">My Connections</TabsTrigger>
            </TabsList>

            <TabsContent value="providers" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {providers.map(provider => (
                  <Card key={provider.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{provider.name}</h3>
                        <Badge variant="secondary" className="text-xs">
                          {provider.category.replace('_', ' ')}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{provider.description}</p>
                      <Button
                        size="sm"
                        onClick={() => handleProviderSelect(provider)}
                        className="w-full"
                      >
                        Connect
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="connections" className="space-y-4">
              <div className="space-y-3">
                {connections.map(connection => (
                  <Card key={connection.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(connection.status)}
                          <div>
                            <h3 className="font-semibold">{connection.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {providers.find(p => p.id === connection.providerId)?.name}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={connection.status === 'connected' ? 'default' : 'secondary'}>
                            {connection.status}
                          </Badge>
                          <Button variant="outline" size="sm">
                            Configure
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Connection Setup Dialog */}
      <Dialog open={!!selectedProvider} onOpenChange={() => setSelectedProvider(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2"/>
              Connect to {selectedProvider?.name}
            </DialogTitle>
            <DialogDescription>
              Configure your connection to {selectedProvider?.name} to enable seamless integration.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {renderConfigFields()}

            {connectionError && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4"/>
                <AlertDescription>{connectionError}</AlertDescription>
              </Alert>
            )}

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setSelectedProvider(null)}>
                Cancel
              </Button>
              <Button onClick={handleConnect} disabled={isConnecting}>
                {isConnecting && <Loader2 className="w-4 h-4 mr-2 animate-spin"/>}
                Connect
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
