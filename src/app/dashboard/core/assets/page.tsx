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
  Package,
  Wrench,
  Truck,
  FileText,
  Monitor,
  CheckCircle,
  AlertTriangle,
  XCircle,
  DollarSign
} from 'lucide-react'

interface Asset {
  id: string
  name: string
  description?: string
  asset_type: string
  category?: string
  serial_number?: string
  status: string
  condition: string
  location_id?: string
  location?: { name: string }
  purchase_date?: string
  purchase_cost?: number
  created_at: string
}

export default function AssetsPage() {
  const { supabase } = useSupabase()
  const { data: session } = useSession()
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(true)
  const [currentView, setCurrentView] = useState<ViewType>('table')
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    const loadAssets = async () => {
      if (!session?.user?.organizationId) return

      const { data, error } = await supabase
        .from('assets')
        .select(`
          *,
          location:places(name)
        `)
        .eq('organization_id', session.user.organizationId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading assets:', error)
      } else {
        setAssets(data || [])
      }
      setLoading(false)
    }

    loadAssets()
  }, [session, supabase])

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.serial_number?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === 'all' || asset.asset_type === typeFilter
    const matchesStatus = statusFilter === 'all' || asset.status === statusFilter

    return matchesSearch && matchesType && matchesStatus
  })

  const getAssetTypeIcon = (type: string) => {
    switch (type) {
      case 'equipment': return <Wrench className="h-4 w-4" />
      case 'vehicle': return <Truck className="h-4 w-4" />
      case 'file': return <FileText className="h-4 w-4" />
      case 'software': return <Monitor className="h-4 w-4" />
      default: return <Package className="h-4 w-4" />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'in_use': return <Package className="h-4 w-4 text-blue-500" />
      case 'maintenance': return <Wrench className="h-4 w-4 text-yellow-500" />
      case 'retired': return <XCircle className="h-4 w-4 text-red-500" />
      default: return <AlertTriangle className="h-4 w-4 text-gray-500" />
    }
  }

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'excellent': return 'default'
      case 'good': return 'secondary'
      case 'fair': return 'outline'
      case 'poor': return 'destructive'
      default: return 'outline'
    }
  }

  const renderTableView = () => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left p-4">Asset</th>
            <th className="text-left p-4">Type</th>
            <th className="text-left p-4">Status</th>
            <th className="text-left p-4">Condition</th>
            <th className="text-left p-4">Location</th>
            <th className="text-left p-4">Cost</th>
            <th className="text-left p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredAssets.map(asset => (
            <tr key={asset.id} className="border-b hover:bg-muted/50">
              <td className="p-4">
                <div>
                  <div className="font-medium flex items-center gap-2">
                    {getAssetTypeIcon(asset.asset_type)}
                    {asset.name}
                  </div>
                  {asset.serial_number && (
                    <div className="text-sm text-muted-foreground">
                      SN: {asset.serial_number}
                    </div>
                  )}
                </div>
              </td>
              <td className="p-4">
                <Badge variant="outline" className="capitalize">
                  {asset.asset_type}
                </Badge>
              </td>
              <td className="p-4">
                <div className="flex items-center gap-2">
                  {getStatusIcon(asset.status)}
                  <span className="capitalize">{asset.status.replace('_', ' ')}</span>
                </div>
              </td>
              <td className="p-4">
                <Badge variant={getConditionColor(asset.condition) as any}>
                  {asset.condition}
                </Badge>
              </td>
              <td className="p-4">
                {asset.location?.name || 'Not assigned'}
              </td>
              <td className="p-4">
                {asset.purchase_cost ? (
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    {asset.purchase_cost.toLocaleString()}
                  </div>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </td>
              <td className="p-4">
                <Button variant="ghost" size="sm">Edit</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  const renderCardView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredAssets.map(asset => (
        <Card key={asset.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                {getAssetTypeIcon(asset.asset_type)}
                <CardTitle className="text-lg">{asset.name}</CardTitle>
              </div>
              {getStatusIcon(asset.status)}
            </div>
          </CardHeader>
          <CardContent>
            {asset.description && (
              <p className="text-sm text-muted-foreground mb-4">{asset.description}</p>
            )}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span>Type:</span>
                <Badge variant="outline" className="capitalize">{asset.asset_type}</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>Condition:</span>
                <Badge variant={getConditionColor(asset.condition) as any}>
                  {asset.condition}
                </Badge>
              </div>
              {asset.location?.name && (
                <div className="flex justify-between text-sm">
                  <span>Location:</span>
                  <span className="text-muted-foreground">{asset.location.name}</span>
                </div>
              )}
              {asset.purchase_cost && (
                <div className="flex justify-between text-sm">
                  <span>Cost:</span>
                  <span className="text-muted-foreground">${asset.purchase_cost.toLocaleString()}</span>
                </div>
              )}
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
    const total = assets.length
    const available = assets.filter(a => a.status === 'available').length
    const inUse = assets.filter(a => a.status === 'in_use').length
    const maintenance = assets.filter(a => a.status === 'maintenance').length
    const totalValue = assets.reduce((sum, a) => sum + (a.purchase_cost || 0), 0)

    return { total, available, inUse, maintenance, totalValue }
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
          <h1 className="text-3xl font-bold">Assets</h1>
          <p className="text-muted-foreground">
            Manage physical and digital assets, inventory, and equipment
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Asset
          </Button>
          <ViewSwitcher
            currentView={currentView}
            availableViews={['table', 'board', 'gallery']}
            onViewChange={setCurrentView}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Assets</p>
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
                <p className="text-sm font-medium text-muted-foreground">Available</p>
                <p className="text-2xl font-bold">{stats.available}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">In Use</p>
                <p className="text-2xl font-bold">{stats.inUse}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Wrench className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Maintenance</p>
                <p className="text-2xl font-bold">{stats.maintenance}</p>
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
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search assets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Asset Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="equipment">Equipment</SelectItem>
                <SelectItem value="vehicle">Vehicle</SelectItem>
                <SelectItem value="file">File</SelectItem>
                <SelectItem value="software">Software</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="in_use">In Use</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="retired">Retired</SelectItem>
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
          {currentView === 'gallery' && (
            <div className="p-6 text-center text-muted-foreground">
              Gallery view coming soon
            </div>
          )}
        </CardContent>
      </Card>

      {filteredAssets.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No assets found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || typeFilter !== 'all' || statusFilter !== 'all'
              ? 'Try adjusting your filters'
              : 'Add your first asset to start tracking inventory'}
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Asset
          </Button>
        </div>
      )}
    </div>
  )
}
