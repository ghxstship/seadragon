'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { useSupabase } from '@/contexts/SupabaseContext'
import { useSession } from 'next-auth/react'
import {
  Settings,
  Database,
  Shield,
  Activity,
  Users,
  Server,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Download,
  Upload
} from 'lucide-react'

interface SystemConfig {
  maintenance_mode: boolean
  debug_mode: boolean
  email_enabled: boolean
  backup_frequency: string
  log_retention_days: number
  max_file_size: number
}

interface SystemHealth {
  database: 'healthy' | 'warning' | 'error'
  api: 'healthy' | 'warning' | 'error'
  storage: 'healthy' | 'warning' | 'error'
  email: 'healthy' | 'warning' | 'error'
  uptime: string
  last_backup: string
}

export default function SystemPage() {
  const { supabase } = useSupabase()
  const { data: session } = useSession()
  const [config, setConfig] = useState<SystemConfig>({
    maintenance_mode: false,
    debug_mode: false,
    email_enabled: true,
    backup_frequency: 'daily',
    log_retention_days: 90,
    max_file_size: 100
  })
  const [health, setHealth] = useState<SystemHealth>({
    database: 'healthy',
    api: 'healthy',
    storage: 'healthy',
    email: 'healthy',
    uptime: '7d 14h 32m',
    last_backup: '2024-01-15 02:00 UTC'
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const loadSystemData = async () => {
      // Load system configuration and health data
      setLoading(false)
    }

    loadSystemData()
  }, [])

  const handleConfigChange = (key: keyof SystemConfig, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }))
  }

  const handleSaveConfig = async () => {
    setSaving(true)
    // Save configuration to Supabase
    setTimeout(() => setSaving(false), 1000)
  }

  const getHealthIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />
      default: return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'default'
      case 'warning': return 'secondary'
      case 'error': return 'destructive'
      default: return 'outline'
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded"></div>
          <div className="h-96 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">System Administration</h1>
        <p className="text-muted-foreground">
          Platform-level settings, monitoring, and maintenance controls
        </p>
      </div>

      <Tabs defaultValue="health" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="health" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Health
          </TabsTrigger>
          <TabsTrigger value="config" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Configuration
          </TabsTrigger>
          <TabsTrigger value="database" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Database
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="maintenance" className="flex items-center gap-2">
            <Server className="h-4 w-4" />
            Maintenance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="health" className="mt-6">
          <div className="space-y-6">
            {/* System Health Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Overall Status</p>
                      <p className="text-2xl font-bold text-green-600">Healthy</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Uptime</p>
                      <p className="text-2xl font-bold">{health.uptime}</p>
                    </div>
                    <Activity className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                      <p className="text-2xl font-bold">1,247</p>
                    </div>
                    <Users className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Service Health */}
            <Card>
              <CardHeader>
                <CardTitle>Service Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Database className="h-5 w-5" />
                      <div>
                        <h4 className="font-medium">Database</h4>
                        <p className="text-sm text-muted-foreground">PostgreSQL primary</p>
                      </div>
                    </div>
                    <Badge variant={getHealthColor(health.database) as any}>
                      {health.database}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Activity className="h-5 w-5" />
                      <div>
                        <h4 className="font-medium">API Services</h4>
                        <p className="text-sm text-muted-foreground">REST & GraphQL endpoints</p>
                      </div>
                    </div>
                    <Badge variant={getHealthColor(health.api) as any}>
                      {health.api}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Upload className="h-5 w-5" />
                      <div>
                        <h4 className="font-medium">File Storage</h4>
                        <p className="text-sm text-muted-foreground">S3-compatible storage</p>
                      </div>
                    </div>
                    <Badge variant={getHealthColor(health.storage) as any}>
                      {health.storage}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Settings className="h-5 w-5" />
                      <div>
                        <h4 className="font-medium">Email Service</h4>
                        <p className="text-sm text-muted-foreground">SMTP & transactional</p>
                      </div>
                    </div>
                    <Badge variant={getHealthColor(health.email) as any}>
                      {health.email}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>System Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Database className="h-4 w-4 text-blue-500" />
                      <div>
                        <p className="text-sm font-medium">Database backup completed</p>
                        <p className="text-xs text-muted-foreground">2 hours ago</p>
                      </div>
                    </div>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Users className="h-4 w-4 text-purple-500" />
                      <div>
                        <p className="text-sm font-medium">User authentication spike</p>
                        <p className="text-xs text-muted-foreground">4 hours ago</p>
                      </div>
                    </div>
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Server className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium">Scheduled maintenance window</p>
                        <p className="text-xs text-muted-foreground">Next Tuesday 2:00 AM UTC</p>
                      </div>
                    </div>
                    <Activity className="h-4 w-4 text-blue-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="config" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                System Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Maintenance Mode</Label>
                      <p className="text-sm text-muted-foreground">Put system in maintenance mode</p>
                    </div>
                    <Switch
                      checked={config.maintenance_mode}
                      onCheckedChange={(checked) => handleConfigChange('maintenance_mode', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Debug Mode</Label>
                      <p className="text-sm text-muted-foreground">Enable detailed logging</p>
                    </div>
                    <Switch
                      checked={config.debug_mode}
                      onCheckedChange={(checked) => handleConfigChange('debug_mode', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Service</Label>
                      <p className="text-sm text-muted-foreground">Enable email notifications</p>
                    </div>
                    <Switch
                      checked={config.email_enabled}
                      onCheckedChange={(checked) => handleConfigChange('email_enabled', checked)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="backup_frequency">Backup Frequency</Label>
                    <Select
                      value={config.backup_frequency}
                      onValueChange={(value) => handleConfigChange('backup_frequency', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="log_retention">Log Retention (days)</Label>
                    <Input
                      id="log_retention"
                      type="number"
                      value={config.log_retention_days}
                      onChange={(e) => handleConfigChange('log_retention_days', parseInt(e.target.value))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="max_file_size">Max File Size (MB)</Label>
                    <Input
                      id="max_file_size"
                      type="number"
                      value={config.max_file_size}
                      onChange={(e) => handleConfigChange('max_file_size', parseInt(e.target.value))}
                    />
                  </div>
                </div>
              </div>

              <Button onClick={handleSaveConfig} disabled={saving} className="w-full md:w-auto">
                <Settings className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save Configuration'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="database" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Database Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Database Size</h4>
                      <p className="text-sm text-muted-foreground">Current storage used</p>
                    </div>
                    <span className="font-medium">2.4 GB</span>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Active Connections</h4>
                      <p className="text-sm text-muted-foreground">Current connections</p>
                    </div>
                    <span className="font-medium">47</span>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Query Performance</h4>
                      <p className="text-sm text-muted-foreground">Average response time</p>
                    </div>
                    <span className="font-medium">23ms</span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Run Maintenance
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Data
                  </Button>
                  <Button variant="outline">
                    <Database className="h-4 w-4 mr-2" />
                    Query Analyzer
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Backup & Recovery</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Last Backup</h4>
                    <p className="text-sm text-muted-foreground">{health.last_backup}</p>
                  </div>
                  <Badge variant="default">Successful</Badge>
                </div>

                <div className="flex gap-4">
                  <Button>
                    <Database className="h-4 w-4 mr-2" />
                    Create Backup
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download Backup
                  </Button>
                  <Button variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Restore from Backup
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Two-Factor Authentication</h4>
                    <p className="text-sm text-muted-foreground">Required for all admin accounts</p>
                  </div>
                  <Badge variant="default">Enforced</Badge>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Session Timeout</h4>
                    <p className="text-sm text-muted-foreground">Automatic logout after inactivity</p>
                  </div>
                  <span className="text-sm">30 minutes</span>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">IP Whitelisting</h4>
                    <p className="text-sm text-muted-foreground">Restrict access to specific IP ranges</p>
                  </div>
                  <Badge variant="secondary">Disabled</Badge>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Audit Logging</h4>
                    <p className="text-sm text-muted-foreground">All admin actions are logged</p>
                  </div>
                  <Badge variant="default">Enabled</Badge>
                </div>
              </div>

              <Button variant="outline" className="w-full md:w-auto">
                <Shield className="h-4 w-4 mr-2" />
                Security Audit
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                System Maintenance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Cache Management</h4>
                    <p className="text-sm text-muted-foreground">Clear application caches</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Clear Cache
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Search Index</h4>
                    <p className="text-sm text-muted-foreground">Rebuild search indexes</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Rebuild Index
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Scheduled Maintenance</h4>
                    <p className="text-sm text-muted-foreground">Next maintenance window</p>
                  </div>
                  <span className="text-sm">Jan 20, 2024 02:00 UTC</span>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">System Updates</h4>
                    <p className="text-sm text-muted-foreground">Apply pending updates</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Update System
                  </Button>
                </div>
              </div>

              <div className="border-t pt-6">
                <div className="flex items-center gap-4">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <div>
                    <h4 className="font-medium text-red-600">Danger Zone</h4>
                    <p className="text-sm text-muted-foreground">Irreversible actions that affect the entire system</p>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <Button variant="destructive" size="sm">
                    <Server className="h-4 w-4 mr-2" />
                    Restart Services
                  </Button>
                  <Button variant="destructive" size="sm" className="ml-2">
                    <XCircle className="h-4 w-4 mr-2" />
                    Shutdown System
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
