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
  MapPin,
  Users,
  Building2,
  Warehouse,
  Tent,
  CheckCircle,
  AlertTriangle,
  Phone,
  Mail
} from 'lucide-react'

interface Place {
  id: string
  name: string
  place_type: string
  address: any
  capacity?: number
  rental_rates?: any
  contact_info?: any
  status: string
  created_at: string
}

export default function PlacesPage() {
  const { supabase } = useSupabase()
  const { data: session } = useSession()
  const [places, setPlaces] = useState<Place[]>([])
  const [loading, setLoading] = useState(true)
  const [currentView, setCurrentView] = useState<ViewType>('table')
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    const loadPlaces = async () => {
      if (!session?.user?.organizationId) return

      const { data, error } = await supabase
        .from('places')
        .select('*')
        .eq('organization_id', session.user.organizationId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading places:', error)
      } else {
        setPlaces(data || [])
      }
      setLoading(false)
    }

    loadPlaces()
  }, [session, supabase])

  const filteredPlaces = places.filter(place => {
    const matchesSearch = place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         place.address?.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         place.address?.state?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === 'all' || place.place_type === typeFilter
    const matchesStatus = statusFilter === 'all' || place.status === statusFilter

    return matchesSearch && matchesType && matchesStatus
  })

  const getPlaceTypeIcon = (type: string) => {
    switch (type) {
      case 'venue': return <Building2 className="h-4 w-4" />
      case 'office': return <Building2 className="h-4 w-4" />
      case 'warehouse': return <Warehouse className="h-4 w-4" />
      case 'event_space': return <Tent className="h-4 w-4" />
      default: return <MapPin className="h-4 w-4" />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'maintenance': return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      default: return <AlertTriangle className="h-4 w-4 text-gray-500" />
    }
  }

  const formatAddress = (address: any) => {
    if (!address) return 'No address'
    const parts = [address.street, address.city, address.state, address.zip].filter(Boolean)
    return parts.join(', ')
  }

  const renderTableView = () => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left p-4">Place</th>
            <th className="text-left p-4">Type</th>
            <th className="text-left p-4">Address</th>
            <th className="text-left p-4">Capacity</th>
            <th className="text-left p-4">Contact</th>
            <th className="text-left p-4">Status</th>
            <th className="text-left p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredPlaces.map(place => (
            <tr key={place.id} className="border-b hover:bg-muted/50">
              <td className="p-4">
                <div>
                  <div className="font-medium flex items-center gap-2">
                    {getPlaceTypeIcon(place.place_type)}
                    {place.name}
                  </div>
                </div>
              </td>
              <td className="p-4">
                <Badge variant="outline" className="capitalize">
                  {place.place_type.replace('_', ' ')}
                </Badge>
              </td>
              <td className="p-4">
                <div className="text-sm">
                  {formatAddress(place.address)}
                </div>
              </td>
              <td className="p-4">
                {place.capacity ? (
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>{place.capacity.toLocaleString()}</span>
                  </div>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </td>
              <td className="p-4">
                <div className="text-sm space-y-1">
                  {place.contact_info?.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-3 w-3" />
                      <span>{place.contact_info.phone}</span>
                    </div>
                  )}
                  {place.contact_info?.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-3 w-3" />
                      <span>{place.contact_info.email}</span>
                    </div>
                  )}
                </div>
              </td>
              <td className="p-4">
                <div className="flex items-center gap-2">
                  {getStatusIcon(place.status)}
                  <span className="capitalize">{place.status}</span>
                </div>
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
      {filteredPlaces.map(place => (
        <Card key={place.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                {getPlaceTypeIcon(place.place_type)}
                <CardTitle className="text-lg">{place.name}</CardTitle>
              </div>
              {getStatusIcon(place.status)}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span>Type:</span>
                <Badge variant="outline" className="capitalize">{place.place_type.replace('_', ' ')}</Badge>
              </div>
              <div className="text-sm">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{formatAddress(place.address)}</span>
                </div>
              </div>
              {place.capacity && (
                <div className="flex justify-between text-sm">
                  <span>Capacity:</span>
                  <span className="text-muted-foreground">{place.capacity.toLocaleString()}</span>
                </div>
              )}
              {place.contact_info?.phone && (
                <div className="flex justify-between text-sm">
                  <span>Phone:</span>
                  <span className="text-muted-foreground">{place.contact_info.phone}</span>
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
    const total = places.length
    const active = places.filter(p => p.status === 'active').length
    const venues = places.filter(p => p.place_type === 'venue').length
    const offices = places.filter(p => p.place_type === 'office').length
    const totalCapacity = places.reduce((sum, p) => sum + (p.capacity || 0), 0)

    return { total, active, venues, offices, totalCapacity }
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
          <h1 className="text-3xl font-bold">Places</h1>
          <p className="text-muted-foreground">
            Manage venues, sites, locations, and facilities
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Place
          </Button>
          <ViewSwitcher
            currentView={currentView}
            availableViews={['table', 'board', 'map']}
            onViewChange={setCurrentView}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <MapPin className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Places</p>
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
              <Building2 className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Venues</p>
                <p className="text-2xl font-bold">{stats.venues}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Offices</p>
                <p className="text-2xl font-bold">{stats.offices}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Capacity</p>
                <p className="text-2xl font-bold">{stats.totalCapacity.toLocaleString()}</p>
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
                  placeholder="Search places..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Place Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="venue">Venue</SelectItem>
                <SelectItem value="office">Office</SelectItem>
                <SelectItem value="warehouse">Warehouse</SelectItem>
                <SelectItem value="event_space">Event Space</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
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
          {currentView === 'map' && (
            <div className="p-6 text-center text-muted-foreground">
              Map view coming soon
            </div>
          )}
        </CardContent>
      </Card>

      {filteredPlaces.length === 0 && (
        <div className="text-center py-12">
          <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No places found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || typeFilter !== 'all' || statusFilter !== 'all'
              ? 'Try adjusting your filters'
              : 'Add your first venue or location to get started'}
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Place
          </Button>
        </div>
      )}
    </div>
  )
}
