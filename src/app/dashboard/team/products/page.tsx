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
  ShoppingBag,
  DollarSign,
  Tag,
  CheckCircle,
  AlertTriangle,
  XCircle,
  TrendingUp,
  TrendingDown
} from 'lucide-react'

interface Product {
  id: string
  name: string
  sku: string
  description?: string
  product_type: string
  category?: string
  price?: number
  cost?: number
  inventory_count: number
  min_stock_level: number
  supplier_info?: any
  is_active: boolean
  created_at: string
}

export default function ProductsPage() {
  const { supabase } = useSupabase()
  const { data: session } = useSession()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [currentView, setCurrentView] = useState<ViewType>('table')
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    const loadProducts = async () => {
      if (!session?.user?.organizationId) return

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('organization_id', session.user.organizationId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading products:', error)
      } else {
        setProducts(data || [])
      }
      setLoading(false)
    }

    loadProducts()
  }, [session, supabase])

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === 'all' || product.product_type === typeFilter
    const matchesStatus = statusFilter === 'all' ||
                         (statusFilter === 'active' && product.is_active) ||
                         (statusFilter === 'inactive' && !product.is_active)

    return matchesSearch && matchesType && matchesStatus
  })

  const getProductTypeIcon = (type: string) => {
    switch (type) {
      case 'physical': return <Package className="h-4 w-4" />
      case 'digital': return <Tag className="h-4 w-4" />
      case 'service': return <ShoppingBag className="h-4 w-4" />
      case 'rental': return <Package className="h-4 w-4" />
      default: return <Package className="h-4 w-4" />
    }
  }

  const getStockStatus = (product: Product) => {
    if (product.inventory_count <= product.min_stock_level) {
      return { status: 'low_stock', icon: <AlertTriangle className="h-4 w-4 text-red-500" />, label: 'Low Stock' }
    }
    if (product.inventory_count > 0) {
      return { status: 'in_stock', icon: <CheckCircle className="h-4 w-4 text-green-500" />, label: 'In Stock' }
    }
    return { status: 'out_of_stock', icon: <XCircle className="h-4 w-4 text-gray-500" />, label: 'Out of Stock' }
  }

  const renderTableView = () => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left p-4">Product</th>
            <th className="text-left p-4">SKU</th>
            <th className="text-left p-4">Type</th>
            <th className="text-left p-4">Price</th>
            <th className="text-left p-4">Inventory</th>
            <th className="text-left p-4">Status</th>
            <th className="text-left p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map(product => {
            const stockStatus = getStockStatus(product)
            const profitMargin = product.price && product.cost ?
              ((product.price - product.cost) / product.price * 100) : null

            return (
              <tr key={product.id} className="border-b hover:bg-muted/50">
                <td className="p-4">
                  <div>
                    <div className="font-medium flex items-center gap-2">
                      {getProductTypeIcon(product.product_type)}
                      {product.name}
                    </div>
                    {product.description && (
                      <div className="text-sm text-muted-foreground truncate max-w-xs">
                        {product.description}
                      </div>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <code className="text-sm bg-muted px-2 py-1 rounded">
                    {product.sku}
                  </code>
                </td>
                <td className="p-4">
                  <Badge variant="outline" className="capitalize">
                    {product.product_type}
                  </Badge>
                </td>
                <td className="p-4">
                  <div className="text-sm">
                    {product.price ? (
                      <div className="font-medium">${product.price.toFixed(2)}</div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                    {product.cost && (
                      <div className="text-muted-foreground">
                        Cost: ${product.cost.toFixed(2)}
                      </div>
                    )}
                    {profitMargin !== null && (
                      <div className={`text-xs ${profitMargin > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {profitMargin > 0 ? <TrendingUp className="inline h-3 w-3 mr-1" /> : <TrendingDown className="inline h-3 w-3 mr-1" />}
                        {profitMargin.toFixed(1)}% margin
                      </div>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    {stockStatus.icon}
                    <span className="text-sm">{product.inventory_count}</span>
                    {product.inventory_count <= product.min_stock_level && (
                      <Badge variant="destructive" className="text-xs">
                        Low
                      </Badge>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <Badge variant={product.is_active ? 'default' : 'secondary'}>
                    {product.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </td>
                <td className="p-4">
                  <Button variant="ghost" size="sm">Edit</Button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )

  const renderCardView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredProducts.map(product => {
        const stockStatus = getStockStatus(product)
        const profitMargin = product.price && product.cost ?
          ((product.price - product.cost) / product.price * 100) : null

        return (
          <Card key={product.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {getProductTypeIcon(product.product_type)}
                  <CardTitle className="text-lg line-clamp-1">{product.name}</CardTitle>
                </div>
                <Badge variant={product.is_active ? 'default' : 'secondary'}>
                  {product.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span>SKU:</span>
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">{product.sku}</code>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Type:</span>
                  <Badge variant="outline" className="capitalize text-xs">{product.product_type}</Badge>
                </div>
                {product.price && (
                  <div className="flex justify-between text-sm">
                    <span>Price:</span>
                    <span className="font-medium">${product.price.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span>Stock:</span>
                  <div className="flex items-center gap-1">
                    {stockStatus.icon}
                    <span className="text-xs">{product.inventory_count}</span>
                  </div>
                </div>
                {profitMargin !== null && (
                  <div className="flex justify-between text-sm">
                    <span>Margin:</span>
                    <span className={`text-xs ${profitMargin > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {profitMargin.toFixed(1)}%
                    </span>
                  </div>
                )}
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
    const total = products.length
    const active = products.filter(p => p.is_active).length
    const inStock = products.filter(p => p.inventory_count > 0).length
    const lowStock = products.filter(p => p.inventory_count <= p.min_stock_level && p.inventory_count > 0).length
    const outOfStock = products.filter(p => p.inventory_count === 0).length
    const totalValue = products.reduce((sum, p) => sum + ((p.price || 0) * p.inventory_count), 0)

    return { total, active, inStock, lowStock, outOfStock, totalValue }
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
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground">
            Manage SKUs, pricing, inventory, and product catalog
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
          <ViewSwitcher
            currentView={currentView}
            availableViews={['table', 'board', 'list']}
            onViewChange={setCurrentView}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Products</p>
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
              <Package className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">In Stock</p>
                <p className="text-2xl font-bold">{stats.inStock}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Low Stock</p>
                <p className="text-2xl font-bold">{stats.lowStock}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <XCircle className="h-8 w-8 text-red-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Out of Stock</p>
                <p className="text-2xl font-bold">{stats.outOfStock}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Inventory Value</p>
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
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Product Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="physical">Physical</SelectItem>
                <SelectItem value="digital">Digital</SelectItem>
                <SelectItem value="service">Service</SelectItem>
                <SelectItem value="rental">Rental</SelectItem>
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
          {currentView === 'list' && (
            <div className="p-6 text-center text-muted-foreground">
              List view coming soon
            </div>
          )}
        </CardContent>
      </Card>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No products found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || typeFilter !== 'all' || statusFilter !== 'all'
              ? 'Try adjusting your filters'
              : 'Add your first product to start your catalog'}
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>
      )}
    </div>
  )
}
