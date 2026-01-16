'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useSupabase } from '@/contexts/SupabaseContext'
import { useSession } from 'next-auth/react'
import {
  Clock,
  Search,
  Filter,
  Download,
  User,
  Settings,
  FileText,
  Activity,
  Calendar,
  CheckCircle,
  Eye
} from 'lucide-react'

interface ActivityLog {
  id: string
  action: string
  entity_type: string
  entity_id: string
  description: string
  user_id: string
  user_name: string
  created_at: string
  ip_address?: string
  user_agent?: string
}

export default function HistoryPage() {
  const { supabase } = useSupabase()
  const { data: session } = useSession()
  const [activities, setActivities] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [actionFilter, setActionFilter] = useState('all')
  const [entityFilter, setEntityFilter] = useState('all')
  const [currentTab, setCurrentTab] = useState('activity')

  useEffect(() => {
    const loadActivityLogs = async () => {
      if (!session?.user?.organizationId) return

      // Mock activity data for now - in real implementation, this would come from audit logs
      const mockActivities: ActivityLog[] = [
        {
          id: '1',
          action: 'created',
          entity_type: 'project',
          entity_id: 'proj_123',
          description: 'Created new project "Website Redesign"',
          user_id: session.user.id,
          user_name: 'John Doe',
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          ip_address: '192.168.1.100'
        },
        {
          id: '2',
          action: 'updated',
          entity_type: 'task',
          entity_id: 'task_456',
          description: 'Updated task "Design homepage mockup"',
          user_id: session.user.id,
          user_name: 'John Doe',
          created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          ip_address: '192.168.1.100'
        },
        {
          id: '3',
          action: 'completed',
          entity_type: 'task',
          entity_id: 'task_789',
          description: 'Marked task "Review design feedback" as completed',
          user_id: session.user.id,
          user_name: 'John Doe',
          created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          ip_address: '192.168.1.100'
        },
        {
          id: '4',
          action: 'invited',
          entity_type: 'user',
          entity_id: 'user_101',
          description: 'Invited jane@example.com to join the organization',
          user_id: session.user.id,
          user_name: 'John Doe',
          created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          ip_address: '192.168.1.100'
        },
        {
          id: '5',
          action: 'updated',
          entity_type: 'organization',
          entity_id: session.user.organizationId,
          description: 'Updated organization branding settings',
          user_id: session.user.id,
          user_name: 'John Doe',
          created_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
          ip_address: '192.168.1.100'
        }
      ]

      setActivities(mockActivities)
      setLoading(false)
    }

    loadActivityLogs()
  }, [session])

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.user_name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesAction = actionFilter === 'all' || activity.action === actionFilter
    const matchesEntity = entityFilter === 'all' || activity.entity_type === entityFilter

    return matchesSearch && matchesAction && matchesEntity
  })

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'created': return <FileText className="h-4 w-4 text-green-500" />
      case 'updated': return <Settings className="h-4 w-4 text-blue-500" />
      case 'deleted': return <Activity className="h-4 w-4 text-red-500" />
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'invited': return <User className="h-4 w-4 text-purple-500" />
      default: return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const getEntityBadgeColor = (entityType: string) => {
    switch (entityType) {
      case 'project': return 'default'
      case 'task': return 'secondary'
      case 'user': return 'outline'
      case 'organization': return 'destructive'
      default: return 'outline'
    }
  }

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)

    if (diffHours < 1) return 'Just now'
    if (diffHours < 24) return `${diffHours} hours ago`
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString()
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
        <h1 className="text-3xl font-bold">Activity History</h1>
        <p className="text-muted-foreground">
          Track and review all activities, changes, and events across your organization
        </p>
      </div>

      <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="activity" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Activity Log
          </TabsTrigger>
          <TabsTrigger value="audit" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Audit Trail
          </TabsTrigger>
          <TabsTrigger value="exports" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Data Exports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="activity" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Filters */}
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-64">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search activities..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={actionFilter} onValueChange={setActionFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Actions</SelectItem>
                    <SelectItem value="created">Created</SelectItem>
                    <SelectItem value="updated">Updated</SelectItem>
                    <SelectItem value="deleted">Deleted</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="invited">Invited</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={entityFilter} onValueChange={setEntityFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Entity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Entities</SelectItem>
                    <SelectItem value="project">Projects</SelectItem>
                    <SelectItem value="task">Tasks</SelectItem>
                    <SelectItem value="user">Users</SelectItem>
                    <SelectItem value="organization">Organization</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>

              {/* Activity List */}
              <div className="space-y-4">
                {filteredActivities.map(activity => (
                  <div key={activity.id} className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex-shrink-0 mt-1">
                      {getActionIcon(activity.action)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{activity.user_name}</span>
                        <Badge variant={getEntityBadgeColor(activity.entity_type) as any} className="text-xs">
                          {activity.entity_type}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatRelativeTime(activity.created_at)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{activity.description}</p>
                      {activity.ip_address && (
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>IP: {activity.ip_address}</span>
                          {activity.user_agent && (
                            <span className="truncate max-w-xs">
                              {activity.user_agent.substring(0, 50)}...
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {filteredActivities.length === 0 && (
                <div className="text-center py-12">
                  <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No activities found</h3>
                  <p className="text-muted-foreground">
                    {searchTerm || actionFilter !== 'all' || entityFilter !== 'all'
                      ? 'Try adjusting your filters'
                      : 'Activity history will appear here as you use the system'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Audit Trail
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Data Retention</h4>
                    <p className="text-sm text-muted-foreground">Activity logs are retained for 7 years</p>
                  </div>
                  <Badge variant="secondary">7 years</Badge>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Compliance Logging</h4>
                    <p className="text-sm text-muted-foreground">GDPR and SOX compliant audit trails</p>
                  </div>
                  <Badge variant="default">Enabled</Badge>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Real-time Monitoring</h4>
                    <p className="text-sm text-muted-foreground">Automated alerts for suspicious activity</p>
                  </div>
                  <Badge variant="default">Active</Badge>
                </div>
              </div>

              <div className="text-center py-8">
                <Eye className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Advanced Audit Features</h3>
                <p className="text-muted-foreground mb-4">
                  Enterprise-grade audit trails and compliance monitoring
                </p>
                <Button variant="outline">View Audit Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exports" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Data Exports
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Activity Report</h4>
                    <p className="text-sm text-muted-foreground">Complete activity log for the past 30 days</p>
                  </div>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">User Activity Summary</h4>
                    <p className="text-sm text-muted-foreground">Aggregated user activity statistics</p>
                  </div>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export PDF
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Audit Log Archive</h4>
                    <p className="text-sm text-muted-foreground">Complete audit trail for compliance</p>
                  </div>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export JSON
                  </Button>
                </div>
              </div>

              <div className="text-center py-8">
                <Download className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Scheduled Exports</h3>
                <p className="text-muted-foreground mb-4">
                  Automate regular data exports for compliance and reporting
                </p>
                <Button variant="outline">Configure Scheduled Exports</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
