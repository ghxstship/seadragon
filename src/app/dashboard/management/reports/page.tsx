'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ViewSwitcher, ViewType } from '@/lib/design-system/patterns/view-switcher'
import { useSupabase } from '@/contexts/SupabaseContext'
import { useSession } from 'next-auth/react'
import {
  Plus,
  Search,
  BarChart3,
  FileText,
  Download,
  Calendar,
  TrendingUp,
  Users,
  DollarSign,
  Clock,
  Eye,
  Settings
} from 'lucide-react'

interface Report {
  id: string
  name: string
  report_type: string
  config: any
  schedule?: any
  last_run?: string
  is_active: boolean
  created_at: string
}

export default function ReportsPage() {
  const { supabase } = useSupabase()
  const { data: session } = useSession()
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [currentView, setCurrentView] = useState<ViewType>('table')
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    const loadReports = async () => {
      if (!session?.user?.organizationId) return

      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('organization_id', session.user.organizationId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading reports:', error)
      } else {
        setReports(data || [])
      }
      setLoading(false)
    }

    loadReports()
  }, [session, supabase])

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === 'all' || report.report_type === typeFilter
    const matchesStatus = statusFilter === 'all' ||
                         (statusFilter === 'active' && report.is_active) ||
                         (statusFilter === 'inactive' && !report.is_active)

    return matchesSearch && matchesType && matchesStatus
  })

  const getReportTypeIcon = (type: string) => {
    switch (type) {
      case 'financial': return <DollarSign className="h-4 w-4" />
      case 'operational': return <BarChart3 className="h-4 w-4" />
      case 'compliance': return <FileText className="h-4 w-4" />
      case 'performance': return <TrendingUp className="h-4 w-4" />
      default: return <BarChart3 className="h-4 w-4" />
    }
  }

  const getStatusIcon = (isActive: boolean) => {
    return isActive ? <Eye className="h-4 w-4 text-green-500" /> : <Clock className="h-4 w-4 text-gray-500" />
  }

  const renderTableView = () => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left p-4">Report</th>
            <th className="text-left p-4">Type</th>
            <th className="text-left p-4">Status</th>
            <th className="text-left p-4">Schedule</th>
            <th className="text-left p-4">Last Run</th>
            <th className="text-left p-4">Created</th>
            <th className="text-left p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredReports.map(report => (
            <tr key={report.id} className="border-b hover:bg-muted/50">
              <td className="p-4">
                <div>
                  <div className="font-medium flex items-center gap-2">
                    {getReportTypeIcon(report.report_type)}
                    {report.name}
                  </div>
                </div>
              </td>
              <td className="p-4">
                <Badge variant="outline" className="capitalize">
                  {report.report_type}
                </Badge>
              </td>
              <td className="p-4">
                <div className="flex items-center gap-2">
                  {getStatusIcon(report.is_active)}
                  <Badge variant={report.is_active ? 'default' : 'secondary'}>
                    {report.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </td>
              <td className="p-4">
                {report.schedule ? (
                  <div className="text-sm">
                    <div>Frequency: {report.schedule.frequency || 'Manual'}</div>
                    {report.schedule.next_run && (
                      <div className="text-muted-foreground">
                        Next: {new Date(report.schedule.next_run).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                ) : (
                  <span className="text-muted-foreground">Manual</span>
                )}
              </td>
              <td className="p-4 text-sm text-muted-foreground">
                {report.last_run ? new Date(report.last_run).toLocaleDateString() : 'Never'}
              </td>
              <td className="p-4 text-sm text-muted-foreground">
                {new Date(report.created_at).toLocaleDateString()}
              </td>
              <td className="p-4">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  const renderCardView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredReports.map(report => (
        <Card key={report.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                {getReportTypeIcon(report.report_type)}
                <CardTitle className="text-lg">{report.name}</CardTitle>
              </div>
              {getStatusIcon(report.is_active)}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span>Type:</span>
                <Badge variant="outline" className="capitalize">{report.report_type}</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>Status:</span>
                <Badge variant={report.is_active ? 'default' : 'secondary'}>
                  {report.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              {report.schedule && (
                <div className="text-sm">
                  <span>Schedule:</span>
                  <div className="text-muted-foreground mt-1">
                    {report.schedule.frequency || 'Manual'}
                    {report.schedule.next_run && (
                      <div>Next: {new Date(report.schedule.next_run).toLocaleDateString()}</div>
                    )}
                  </div>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span>Last Run:</span>
                <span className="text-muted-foreground">
                  {report.last_run ? new Date(report.last_run).toLocaleDateString() : 'Never'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Created:</span>
                <span className="text-muted-foreground">
                  {new Date(report.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                <Eye className="h-4 w-4 mr-2" />
                View Report
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  const getStats = () => {
    const total = reports.length
    const active = reports.filter(r => r.is_active).length
    const scheduled = reports.filter(r => r.schedule).length
    const financial = reports.filter(r => r.report_type === 'financial').length
    const operational = reports.filter(r => r.report_type === 'operational').length
    const compliance = reports.filter(r => r.report_type === 'compliance').length
    const performance = reports.filter(r => r.report_type === 'performance').length

    return { total, active, scheduled, financial, operational, compliance, performance }
  }

  const stats = getStats()

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
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="text-muted-foreground">
            Generate and schedule cross-module reports and analytics
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Report
          </Button>
          <ViewSwitcher
            currentView={currentView}
            availableViews={['table', 'board', 'analytics']}
            onViewChange={setCurrentView}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Reports</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Eye className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">{stats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Scheduled</p>
                <p className="text-2xl font-bold">{stats.scheduled}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Financial</p>
                <p className="text-2xl font-bold">{stats.financial}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Operational</p>
                <p className="text-2xl font-bold">{stats.operational}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Compliance</p>
                <p className="text-2xl font-bold">{stats.compliance}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-red-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Performance</p>
                <p className="text-2xl font-bold">{stats.performance}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Report Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="financial">Financial</SelectItem>
                <SelectItem value="operational">Operational</SelectItem>
                <SelectItem value="compliance">Compliance</SelectItem>
                <SelectItem value="performance">Performance</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      <Card>
        <CardContent className="p-0">
          {currentView === 'table' && renderTableView()}
          {currentView === 'board' && renderCardView()}
          {currentView === 'analytics' && (
            <div className="p-6 text-center text-muted-foreground">
              Analytics dashboard coming soon
            </div>
          )}
        </CardContent>
      </Card>

      {filteredReports.length === 0 && (
        <div className="text-center py-12">
          <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No reports found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || typeFilter !== 'all' || statusFilter !== 'all'
              ? 'Try adjusting your filters'
              : 'Create your first report to start analyzing your data'}
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Report
          </Button>
        </div>
      )}
    </div>
  )
}
