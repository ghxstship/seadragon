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
  Users,
  User,
  Briefcase,
  Phone,
  Mail,
  Star,
  CheckCircle,
  AlertTriangle,
  XCircle
} from 'lucide-react'

interface Person {
  id: string
  first_name: string
  last_name: string
  email?: string
  phone?: string
  role: string
  department?: string
  certifications: string[]
  skills: string[]
  rate_hourly?: number
  rate_daily?: number
  status: string
  created_at: string
}

export default function PeoplePage() {
  const { supabase } = useSupabase()
  const { data: session } = useSession()
  const [people, setPeople] = useState<Person[]>([])
  const [loading, setLoading] = useState(true)
  const [currentView, setCurrentView] = useState<ViewType>('table')
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    const loadPeople = async () => {
      if (!session?.user?.organizationId) return

      const { data, error } = await supabase
        .from('people')
        .select('*')
        .eq('organization_id', session.user.organizationId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading people:', error)
      } else {
        setPeople(data || [])
      }
      setLoading(false)
    }

    loadPeople()
  }, [session, supabase])

  const filteredPeople = people.filter(person => {
    const fullName = `${person.first_name} ${person.last_name}`.toLowerCase()
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) ||
                         person.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         person.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         person.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesRole = roleFilter === 'all' || person.role === roleFilter
    const matchesStatus = statusFilter === 'all' || person.status === statusFilter

    return matchesSearch && matchesRole && matchesStatus
  })

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'crew': return <Users className="h-4 w-4" />
      case 'staff': return <User className="h-4 w-4" />
      case 'talent': return <Star className="h-4 w-4" />
      case 'vendor': return <Briefcase className="h-4 w-4" />
      default: return <User className="h-4 w-4" />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'inactive': return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'terminated': return <XCircle className="h-4 w-4 text-red-500" />
      default: return <AlertTriangle className="h-4 w-4 text-gray-500" />
    }
  }

  const renderTableView = () => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left p-4">Person</th>
            <th className="text-left p-4">Role</th>
            <th className="text-left p-4">Contact</th>
            <th className="text-left p-4">Skills</th>
            <th className="text-left p-4">Rates</th>
            <th className="text-left p-4">Status</th>
            <th className="text-left p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredPeople.map(person => (
            <tr key={person.id} className="border-b hover:bg-muted/50">
              <td className="p-4">
                <div>
                  <div className="font-medium">
                    {person.first_name} {person.last_name}
                  </div>
                  {person.department && (
                    <div className="text-sm text-muted-foreground">
                      {person.department}
                    </div>
                  )}
                </div>
              </td>
              <td className="p-4">
                <div className="flex items-center gap-2">
                  {getRoleIcon(person.role)}
                  <Badge variant="outline" className="capitalize">
                    {person.role}
                  </Badge>
                </div>
              </td>
              <td className="p-4">
                <div className="space-y-1 text-sm">
                  {person.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-3 w-3" />
                      <span>{person.email}</span>
                    </div>
                  )}
                  {person.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-3 w-3" />
                      <span>{person.phone}</span>
                    </div>
                  )}
                </div>
              </td>
              <td className="p-4">
                <div className="flex flex-wrap gap-1">
                  {person.skills.slice(0, 3).map(skill => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {person.skills.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{person.skills.length - 3}
                    </Badge>
                  )}
                </div>
              </td>
              <td className="p-4">
                <div className="text-sm">
                  {person.rate_hourly && (
                    <div>${person.rate_hourly}/hr</div>
                  )}
                  {person.rate_daily && (
                    <div>${person.rate_daily}/day</div>
                  )}
                  {!person.rate_hourly && !person.rate_daily && (
                    <span className="text-muted-foreground">-</span>
                  )}
                </div>
              </td>
              <td className="p-4">
                <div className="flex items-center gap-2">
                  {getStatusIcon(person.status)}
                  <span className="capitalize">{person.status}</span>
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredPeople.map(person => (
        <Card key={person.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                {getRoleIcon(person.role)}
                <CardTitle className="text-lg">
                  {person.first_name} {person.last_name}
                </CardTitle>
              </div>
              {getStatusIcon(person.status)}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span>Role:</span>
                <Badge variant="outline" className="capitalize">{person.role}</Badge>
              </div>
              {person.department && (
                <div className="flex justify-between text-sm">
                  <span>Department:</span>
                  <span className="text-muted-foreground">{person.department}</span>
                </div>
              )}
              {person.email && (
                <div className="flex justify-between text-sm">
                  <span>Email:</span>
                  <span className="text-muted-foreground">{person.email}</span>
                </div>
              )}
              {person.phone && (
                <div className="flex justify-between text-sm">
                  <span>Phone:</span>
                  <span className="text-muted-foreground">{person.phone}</span>
                </div>
              )}
              {(person.rate_hourly || person.rate_daily) && (
                <div className="flex justify-between text-sm">
                  <span>Rate:</span>
                  <span className="text-muted-foreground">
                    {person.rate_hourly ? `$${person.rate_hourly}/hr` : `$${person.rate_daily}/day`}
                  </span>
                </div>
              )}
            </div>
            {person.skills.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-4">
                {person.skills.slice(0, 4).map(skill => (
                  <Badge key={skill} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
                {person.skills.length > 4 && (
                  <Badge variant="secondary" className="text-xs">
                    +{person.skills.length - 4}
                  </Badge>
                )}
              </div>
            )}
            <Button variant="outline" size="sm" className="w-full">
              View Profile
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  const getStats = () => {
    const total = people.length
    const active = people.filter(p => p.status === 'active').length
    const crew = people.filter(p => p.role === 'crew').length
    const staff = people.filter(p => p.role === 'staff').length
    const talent = people.filter(p => p.role === 'talent').length
    const vendors = people.filter(p => p.role === 'vendor').length

    return { total, active, crew, staff, talent, vendors }
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
          <h1 className="text-3xl font-bold">People</h1>
          <p className="text-muted-foreground">
            Manage crew, staff, vendors, and talent across your organization
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Person
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
              <Users className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total People</p>
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
              <Users className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Crew</p>
                <p className="text-2xl font-bold">{stats.crew}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <User className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Staff</p>
                <p className="text-2xl font-bold">{stats.staff}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Star className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Talent</p>
                <p className="text-2xl font-bold">{stats.talent}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Briefcase className="h-8 w-8 text-gray-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Vendors</p>
                <p className="text-2xl font-bold">{stats.vendors}</p>
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
                  placeholder="Search people..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="crew">Crew</SelectItem>
                <SelectItem value="staff">Staff</SelectItem>
                <SelectItem value="talent">Talent</SelectItem>
                <SelectItem value="vendor">Vendor</SelectItem>
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
                <SelectItem value="terminated">Terminated</SelectItem>
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

      {filteredPeople.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No people found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || roleFilter !== 'all' || statusFilter !== 'all'
              ? 'Try adjusting your filters'
              : 'Add your first team member to get started'}
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Person
          </Button>
        </div>
      )}
    </div>
  )
}
