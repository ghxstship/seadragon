
// Integration Status Monitoring and Management Component

import React, { useState, useEffect } from 'react'
import { logger } from '@/lib/logger'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Activity,
  Zap,
  Settings,
  Trash2,
  Play,
  Pause,
  BarChart3,
  Clock,
  Database
} from 'lucide-react'
import { integrationManager } from '@/lib/integrations/manager'
import { IntegrationConnection, IntegrationSyncResult } from '@/lib/integrations/types'

interface IntegrationMonitoringProps {
  organizationId: string
  onConnectionRemoved?: (connectionId: string) => void
  onSyncTriggered?: (connectionId: string, result: IntegrationSyncResult) => void
}

export function IntegrationMonitoring({
  organizationId,
  onConnectionRemoved,
  onSyncTriggered
}: IntegrationMonitoringProps) {
  const [connections, setConnections] = useState<IntegrationConnection[]>([])
  const [syncingConnections, setSyncingConnections] = useState<Set<string>>(new Set())
  const [syncResults, setSyncResults] = useState<Record<string, IntegrationSyncResult>>({})
  const [selectedConnection, setSelectedConnection] = useState<IntegrationConnection | null>(null)

  useEffect(() => {
    // Load connections
    const orgConnections = integrationManager.getConnectionsForOrganization(organizationId)
    setConnections(orgConnections)

    // Set up periodic refresh
    const interval = setInterval(() => {
      const updatedConnections = integrationManager.getConnectionsForOrganization(organizationId)
      setConnections(updatedConnections)
    }, 30000) // Refresh every 30 seconds

    return () => clearInterval(interval)
  }, [organizationId])

  const handleSync = async (connectionId: string) => {
    setSyncingConnections(prev => new Set(prev).add(connectionId))

    try {
      const result = await integrationManager.syncConnection(connectionId)
      setSyncResults(prev => ({ ...prev, [connectionId]: result }))
      onSyncTriggered?.(connectionId, result)
    } catch (error) {
      logger.error('Sync failed for connection', { connectionId, error })
      const errorResult: IntegrationSyncResult = {
        success: false,
        recordsProcessed: 0,
        errors: [error instanceof Error ? error.message : 'Sync failed'],
        metadata: {},
        syncStarted: new Date(),
        syncCompleted: new Date()
      }
      setSyncResults(prev => ({ ...prev, [connectionId]: errorResult }))
    } finally {
      setSyncingConnections(prev => {
        const newSet = new Set(prev)
        newSet.delete(connectionId)
        return newSet
      })
    }
  }

  const handleTestConnection = async (connectionId: string) => {
    const isConnected = await integrationManager.testConnection(connectionId)
    // Update connection status
    setConnections(prev => prev.map(conn =>
      conn.id === connectionId
        ? { ...conn, status: isConnected ? 'connected' : 'error' }
        : conn
    ))
  }

  const handleRemoveConnection = async (connectionId: string) => {
    integrationManager.removeConnection(connectionId)
    setConnections(prev => prev.filter(conn => conn.id !== connectionId))
    onConnectionRemoved?.(connectionId)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-5 h-5 text-semantic-success"/>
      case 'disconnected':
      case 'error':
        return <XCircle className="w-5 h-5 text-semantic-error"/>
      case 'pending':
        return <RefreshCw className="w-5 h-5 text-semantic-warning animate-spin"/>
      default:
        return <AlertTriangle className="w-5 h-5 text-neutral-500"/>
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'text-semantic-success bg-green-50 border-green-200'
      case 'disconnected':
      case 'error':
        return 'text-semantic-error bg-red-50 border-red-200'
      case 'pending':
        return 'text-semantic-warning bg-yellow-50 border-yellow-200'
      default:
        return 'text-neutral-600 bg-gray-50 border-neutral-200'
    }
  }

  const formatLastSync = (date?: Date) => {
    if (!date) return 'Never'
    return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
      Math.floor((date.getTime() - Date.now()) / (1000 * 60)),
      'minute'
    )
  }

  const getHealthScore = (connection: IntegrationConnection) => {
    let score = 100

    if (connection.status !== 'connected') score -= 50
    if (!connection.lastSync) score -= 20
    if (connection.errorMessage) score -= 30

    // Check if sync was recent (within last hour)
    if (connection.lastSync) {
      const hoursSinceSync = (Date.now() - connection.lastSync.getTime()) / (1000 * 60 * 60)
      if (hoursSinceSync > 24) score -= 20
      else if (hoursSinceSync > 1) score -= 10
    }

    return Math.max(0, score)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="w-5 h-5 mr-2"/>
            Integration Health Dashboard
          </CardTitle>
          <CardDescription>
            Monitor the status and performance of your integrations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="connections">Connections</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Connections</p>
                        <p className="text-2xl font-bold">{connections.length}</p>
                      </div>
                      <Database className="w-8 h-8 text-accent-primary"/>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Healthy Connections</p>
                        <p className="text-2xl font-bold text-semantic-success">
                          {connections.filter(c => c.status === 'connected').length}
                        </p>
                      </div>
                      <CheckCircle className="w-8 h-8 text-semantic-success"/>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Average Health</p>
                        <p className="text-2xl font-bold">
                          {connections.length > 0
                            ? Math.round(connections.reduce((sum, conn) => sum + getHealthScore(conn), 0) / connections.length)
                            : 0}%
                        </p>
                      </div>
                      <BarChart3 className="w-8 h-8 text-accent-primary"/>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Connection Health</h3>
                {connections.map(connection => (
                  <Card key={connection.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(connection.status)}
                          <div>
                            <h4 className="font-medium">{connection.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              Last sync: {formatLastSync(connection.lastSync)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="text-sm font-medium">{getHealthScore(connection)}%</div>
                            <Progress value={getHealthScore(connection)} className="w-20 h-2"/>
                          </div>
                          <Badge className={getStatusColor(connection.status)}>
                            {connection.status}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="connections" className="space-y-4">
              <div className="space-y-3">
                {connections.map(connection => {
                  const syncResult = syncResults[connection.id]

                  return (
                    <Card key={connection.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            {getStatusIcon(connection.status)}
                            <div>
                              <h3 className="font-semibold">{connection.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                Provider: {connection.providerId}
                              </p>
                            </div>
                          </div>
                          <Badge className={getStatusColor(connection.status)}>
                            {connection.status}
                          </Badge>
                        </div>

                        <div className="flex items-center space-x-2 mb-4">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSync(connection.id)}
                            disabled={syncingConnections.has(connection.id)}
                          >
                            {syncingConnections.has(connection.id) ? (
                              <RefreshCw className="w-4 h-4 mr-2 animate-spin"/>
                            ) : (
                              <Play className="w-4 h-4 mr-2"/>
                            )}
                            Sync Now
                          </Button>

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleTestConnection(connection.id)}
                          >
                            Test Connection
                          </Button>

                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline">
                                <Settings className="w-4 h-4 mr-2"/>
                                Details
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Connection Details</DialogTitle>
                                <DialogDescription>
                                  Detailed information about this integration connection
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <label className="text-sm font-medium">Status</label>
                                  <p className="text-sm">{connection.status}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Last Sync</label>
                                  <p className="text-sm">{connection.lastSync?.toLocaleString() || 'Never'}</p>
                                </div>
                                {connection.errorMessage && (
                                  <Alert variant="destructive">
                                    <AlertTriangle className="h-4 w-4"/>
                                    <AlertDescription>{connection.errorMessage}</AlertDescription>
                                  </Alert>
                                )}
                                {syncResult && (
                                  <div>
                                    <label className="text-sm font-medium">Last Sync Result</label>
                                    <div className="text-sm space-y-1">
                                      <p>Records processed: {syncResult.recordsProcessed}</p>
                                      <p>Success: {syncResult.success ? 'Yes' : 'No'}</p>
                                      {syncResult.errors.length > 0 && (
                                        <div>
                                          <p className="text-semantic-error">Errors:</p>
                                          <ul className="list-disc list-inside">
                                            {syncResult.errors.map((error, i) => (
                                              <li key={i} className="text-semantic-error">{error}</li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>

                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleRemoveConnection(connection.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-2"/>
                            Remove
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>

            <TabsContent value="activity" className="space-y-4">
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Recent Activity</h3>
                {Object.entries(syncResults).slice(0, 10).map(([connectionId, result]) => {
                  const connection = connections.find(c => c.id === connectionId)
                  return (
                    <Card key={`${connectionId}-${result.syncStarted.getTime()}`}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {result.success ? (
                              <CheckCircle className="w-5 h-5 text-semantic-success"/>
                            ) : (
                              <XCircle className="w-5 h-5 text-semantic-error"/>
                            )}
                            <div>
                              <h4 className="font-medium">{connection?.name || 'Unknown Connection'}</h4>
                              <p className="text-sm text-muted-foreground">
                                {result.recordsProcessed} records processed
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">
                              {result.syncCompleted.toLocaleTimeString()}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {Math.round((result.syncCompleted.getTime() - result.syncStarted.getTime()) / 1000)}s
                            </p>
                          </div>
                        </div>
                        {result.errors.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm text-semantic-error">Errors:</p>
                            <ul className="text-sm text-semantic-error list-disc list-inside">
                              {result.errors.map((error, i) => (
                                <li key={i}>{error}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
                {Object.keys(syncResults).length === 0 && (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Activity className="w-12 h-12 mx-auto mb-4 text-muted-foreground"/>
                      <h3 className="text-lg font-semibold mb-2">No Recent Activity</h3>
                      <p className="text-muted-foreground">
                        Sync your integrations to see activity here
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
