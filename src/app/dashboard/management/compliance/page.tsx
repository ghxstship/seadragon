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
  Shield,
  FileText,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  MapPin,
  Building2
} from 'lucide-react'

interface ComplianceItem {
  id: string
  title: string
  compliance_type: string
  entity_id?: string
  entity_type?: string
  status: string
  issue_date?: string
  expiry_date?: string
  created_at: string
}

export default function CompliancePage() {
  const { supabase } = useSupabase()
  const { data: session } = useSession()
  const [complianceItems, setComplianceItems] = useState<ComplianceItem[]>([])
  const [loading, setLoading] = useState(true)
  const [currentView, setCurrentView] = useState<ViewType>('table')
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    const loadCompliance = async () => {
      if (!session?.user?.organizationId) return

      const { data, error } = await supabase
        .from('compliance_items')
        .select('*')
        .eq('organization_id', session.user.organizationId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading compliance:', error)
      } else {
        setComplianceItems(data || [])
      }
      setLoading(false)
    }

    loadCompliance()
  }, [session, supabase])

  const filteredItems = complianceItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === 'all' || item.compliance_type === typeFilter
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter

    return matchesSearch && matchesType && matchesStatus
  })

  const getComplianceTypeIcon = (type: string) => {
    switch (type) {
      case 'permit': return <FileText className="h-4 w-4" />
      case 'insurance': return <Shield className="h-4 w-4" />
      case 'certification': return <CheckCircle className="h-4 w-4" />
      case 'license': return <FileText className="h-4 w-4" />
      default: return <Shield className="h-4 w-4" />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'expired': return <XCircle className="h-4 w-4 text-red-500" />
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />
      case 'revoked': return <AlertTriangle className="h-4 w-4 text-red-500" />
      default: return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default'
      case 'expired': return 'destructive'
      case 'pending': return 'secondary'
      case 'revoked': return 'destructive'
      default: return 'outline'
    }
  }

  const getExpiryStatus = (item: ComplianceItem) => {
    if (!item.expiry_date) return { status: 'no_expiry', label: 'No Expiry', color: 'outline' }

    const expiryDate = new Date(item.expiry_date)
    const now = new Date()
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    if (daysUntilExpiry < 0) return { status: 'expired', label: 'Expired', color: 'destructive' }
    if (daysUntilExpiry <= 30) return { status: 'expires_soon', label: 'Expires Soon', color: 'secondary' }
    if (daysUntilExpiry <= 90) return { status: 'expires_month', label: 'Expires This Month', color: 'outline' }
    return { status: 'valid', label: 'Valid', color: 'default' }
  }

  const renderTableView = () => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left p-4">Compliance Item</th>
            <th className="text-left p-4">Type</th>
            <th className="text-left p-4">Entity</th>
            <th className="text-left p-4">Status</th>
            <th className="text-left p-4">Issue Date</th>
            <th className="text-left p-4">Expiry Date</th>
            <th className="text-left p-4">Expiry Status</th>
            <th className="text-left p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.map(item => {
            const expiryStatus = getExpiryStatus(item)

            return (
              <tr key={item.id} className="border-b hover:bg-muted/50">
                <td className="p-4">
                  <div>
                    <div className="font-medium flex items-center gap-2">
                      {getComplianceTypeIcon(item.compliance_type)}
                      {item.title}
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <Badge variant="outline" className="capitalize">
                    {item.compliance_type}
                  </Badge>
                </td>
                <td className="p-4">
                  {item.entity_type && item.entity_id ? (
                    <div className="flex items-center gap-2">
                      {item.entity_type === 'place' && <MapPin className="h-4 w-4" />}
                      {item.entity_type === 'work_order' && <FileText className="h-4 w-4" />}
                      <span className="capitalize">{item.entity_type}</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">General</span>
                  )}
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(item.status)}
                    <Badge variant={getStatusColor(item.status) as any}>
                      {item.status}
                    </Badge>
                  </div>
                </td>
                <td className="p-4 text-sm text-muted-foreground">
                  {item.issue_date ? new Date(item.issue_date).toLocaleDateString() : '-'}
                </td>
                <td className="p-4 text-sm text-muted-foreground">
                  {item.expiry_date ? new Date(item.expiry_date).toLocaleDateString() : '-'}
                </td>
                <td className="p-4">
                  <Badge variant={expiryStatus.color as any}>
                    {expiryStatus.label}
                  </Badge>
                </td>
                <td className="p-4">
                  <Button variant="ghost" size="sm">View</Button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )

  const renderCardView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredItems.map(item => {
        const expiryStatus = getExpiryStatus(item)

        return (
          <Card key={item.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {getComplianceTypeIcon(item.compliance_type)}
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </div>
                {getStatusIcon(item.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span>Type:</span>
                  <Badge variant="outline" className="capitalize">{item.compliance_type}</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Status:</span>
                  <Badge variant={getStatusColor(item.status) as any}>
                    {item.status}
                  </Badge>
                </div>
                {item.entity_type && (
                  <div className="flex justify-between text-sm">
                    <span>Entity:</span>
                    <span className="text-muted-foreground capitalize">{item.entity_type}</span>
                  </div>
                )}
                {item.issue_date && (
                  <div className="flex justify-between text-sm">
                    <span>Issued:</span>
                    <span className="text-muted-foreground">
                      {new Date(item.issue_date).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {item.expiry_date && (
                  <div className="flex justify-between text-sm">
                    <span>Expires:</span>
                    <span className="text-muted-foreground">
                      {new Date(item.expiry_date).toLocaleDateString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span>Expiry Status:</span>
                  <Badge variant={expiryStatus.color as any}>
                    {expiryStatus.label}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Created:</span>
                  <span className="text-muted-foreground">
                    {new Date(item.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                View Details
              </Button>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )

  const getStats = () => {
    const total = complianceItems.length
    const active = complianceItems.filter(item => item.status === 'active').length
    const expired = complianceItems.filter(item => item.status === 'expired').length
    const expiringSoon = complianceItems.filter(item => {
      if (!item.expiry_date) return false
      const days = Math.ceil((new Date(item.expiry_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      return days >= 0 && days <= 30
    }).length
    const permits = complianceItems.filter(item => item.compliance_type === 'permit').length
    const insurance = complianceItems.filter(item => item.compliance_type === 'insurance').length
    const certifications = complianceItems.filter(item => item.compliance_type === 'certification').length

    return { total, active, expired, expiringSoon, permits, insurance, certifications }
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
          <h1 className="text-3xl font-bold">Compliance</h1>
          <p className="text-muted-foreground">
            Manage permits, insurance, certifications, and regulatory requirements
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Compliance Item
          </Button>
          <ViewSwitcher
            currentView={currentView}
            availableViews={['table', 'board', 'list']}
            onViewChange={setCurrentView}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Items</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-500" />
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
              <XCircle className="h-8 w-8 text-red-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Expired</p>
                <p className="text-2xl font-bold">{stats.expired}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Expiring Soon</p>
                <p className="text-2xl font-bold">{stats.expiringSoon}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Permits</p>
                <p className="text-2xl font-bold">{stats.permits}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Insurance</p>
                <p className="text-2xl font-bold">{stats.insurance}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Certifications</p>
                <p className="text-2xl font-bold">{stats.certifications}</p>
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
                  placeholder="Search compliance items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Compliance Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="permit">Permit</SelectItem>
                <SelectItem value="insurance">Insurance</SelectItem>
                <SelectItem value="certification">Certification</SelectItem>
                <SelectItem value="license">License</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="revoked">Revoked</SelectItem>
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
          {currentView === 'list' && (
            <div className="p-6 text-center text-muted-foreground">
              List view coming soon
            </div>
          )}
        </CardContent>
      </Card>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No compliance items found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || typeFilter !== 'all' || statusFilter !== 'all'
              ? 'Try adjusting your filters'
              : 'Add your first permit, insurance policy, or certification'}
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Compliance Item
          </Button>
        </div>
      )}
    </div>
  )
}
