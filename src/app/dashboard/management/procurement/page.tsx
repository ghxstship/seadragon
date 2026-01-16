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
  Truck,
  FileText,
  DollarSign,
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  Package,
  ShoppingCart
} from 'lucide-react'

interface ProcurementItem {
  id: string
  title: string
  item_type: string
  vendor_id?: string
  status: string
  total_value?: number
  delivery_date?: string
  created_at: string
  vendor?: { first_name: string; last_name: string }
}

export default function ProcurementPage() {
  const { supabase } = useSupabase()
  const { data: session } = useSession()
  const [procurementItems, setProcurementItems] = useState<ProcurementItem[]>([])
  const [loading, setLoading] = useState(true)
  const [currentView, setCurrentView] = useState<ViewType>('table')
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    const loadProcurement = async () => {
      if (!session?.user?.organizationId) return

      const { data, error } = await supabase
        .from('procurement_items')
        .select(`
          *,
          vendor:people(first_name, last_name)
        `)
        .eq('organization_id', session.user.organizationId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading procurement:', error)
      } else {
        setProcurementItems(data || [])
      }
      setLoading(false)
    }

    loadProcurement()
  }, [session, supabase])

  const filteredItems = procurementItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === 'all' || item.item_type === typeFilter
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter

    return matchesSearch && matchesType && matchesStatus
  })

  const getProcurementTypeIcon = (type: string) => {
    switch (type) {
      case 'purchase_order': return <ShoppingCart className="h-4 w-4" />
      case 'contract': return <FileText className="h-4 w-4" />
      case 'vendor': return <Truck className="h-4 w-4" />
      case 'requisition': return <Package className="h-4 w-4" />
      default: return <Package className="h-4 w-4" />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'ordered': return <Package className="h-4 w-4 text-blue-500" />
      case 'received': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'cancelled': return <XCircle className="h-4 w-4 text-red-500" />
      default: return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'default'
      case 'ordered': return 'secondary'
      case 'received': return 'default'
      case 'cancelled': return 'destructive'
      default: return 'outline'
    }
  }

  const renderTableView = () => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left p-4">Procurement Item</th>
            <th className="text-left p-4">Type</th>
            <th className="text-left p-4">Vendor</th>
            <th className="text-left p-4">Status</th>
            <th className="text-left p-4">Value</th>
            <th className="text-left p-4">Delivery Date</th>
            <th className="text-left p-4">Created</th>
            <th className="text-left p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.map(item => (
            <tr key={item.id} className="border-b hover:bg-muted/50">
              <td className="p-4">
                <div>
                  <div className="font-medium flex items-center gap-2">
                    {getProcurementTypeIcon(item.item_type)}
                    {item.title}
                  </div>
                </div>
              </td>
              <td className="p-4">
                <Badge variant="outline" className="capitalize">
                  {item.item_type.replace('_', ' ')}
                </Badge>
              </td>
              <td className="p-4">
                {item.vendor ? (
                  <span>{item.vendor.first_name} {item.vendor.last_name}</span>
                ) : (
                  <span className="text-muted-foreground">No Vendor</span>
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
              <td className="p-4">
                {item.total_value ? (
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    <span>{item.total_value.toLocaleString()}</span>
                  </div>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </td>
              <td className="p-4">
                {item.delivery_date ? (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4" />
                    {new Date(item.delivery_date).toLocaleDateString()}
                  </div>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </td>
              <td className="p-4 text-sm text-muted-foreground">
                {new Date(item.created_at).toLocaleDateString()}
              </td>
              <td className="p-4">
                <Button variant="ghost" size="sm">View</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  const renderCardView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredItems.map(item => (
        <Card key={item.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                {getProcurementTypeIcon(item.item_type)}
                <CardTitle className="text-lg">{item.title}</CardTitle>
              </div>
              {getStatusIcon(item.status)}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span>Type:</span>
                <Badge variant="outline" className="capitalize">{item.item_type.replace('_', ' ')}</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>Status:</span>
                <Badge variant={getStatusColor(item.status) as any}>
                  {item.status}
                </Badge>
              </div>
              {item.vendor && (
                <div className="flex justify-between text-sm">
                  <span>Vendor:</span>
                  <span className="text-muted-foreground">
                    {item.vendor.first_name} {item.vendor.last_name}
                  </span>
                </div>
              )}
              {item.total_value && (
                <div className="flex justify-between text-sm">
                  <span>Value:</span>
                  <span className="text-muted-foreground">${item.total_value.toLocaleString()}</span>
                </div>
              )}
              {item.delivery_date && (
                <div className="flex justify-between text-sm">
                  <span>Delivery:</span>
                  <span className="text-muted-foreground">
                    {new Date(item.delivery_date).toLocaleDateString()}
                  </span>
                </div>
              )}
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
      ))}
    </div>
  )

  const getStats = () => {
    const total = procurementItems.length
    const approved = procurementItems.filter(item => item.status === 'approved').length
    const ordered = procurementItems.filter(item => item.status === 'ordered').length
    const received = procurementItems.filter(item => item.status === 'received').length
    const totalValue = procurementItems.reduce((sum, item) => sum + (item.total_value || 0), 0)
    const purchaseOrders = procurementItems.filter(item => item.item_type === 'purchase_order').length
    const contracts = procurementItems.filter(item => item.item_type === 'contract').length

    return { total, approved, ordered, received, totalValue, purchaseOrders, contracts }
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
          <h1 className="text-3xl font-bold">Procurement</h1>
          <p className="text-muted-foreground">
            Manage vendors, purchasing, contracts, and procurement processes
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Procurement
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
              <ShoppingCart className="h-8 w-8 text-blue-500" />
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
                <p className="text-sm font-medium text-muted-foreground">Approved</p>
                <p className="text-2xl font-bold">{stats.approved}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Ordered</p>
                <p className="text-2xl font-bold">{stats.ordered}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Truck className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Received</p>
                <p className="text-2xl font-bold">{stats.received}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Value</p>
                <p className="text-2xl font-bold">${stats.totalValue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <ShoppingCart className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Purchase Orders</p>
                <p className="text-2xl font-bold">{stats.purchaseOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Contracts</p>
                <p className="text-2xl font-bold">{stats.contracts}</p>
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
                  placeholder="Search procurement..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Procurement Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="purchase_order">Purchase Order</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="vendor">Vendor</SelectItem>
                <SelectItem value="requisition">Requisition</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="ordered">Ordered</SelectItem>
                <SelectItem value="received">Received</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
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
          <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No procurement items found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || typeFilter !== 'all' || statusFilter !== 'all'
              ? 'Try adjusting your filters'
              : 'Create your first purchase order or contract'}
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Procurement
          </Button>
        </div>
      )}
    </div>
  )
}
