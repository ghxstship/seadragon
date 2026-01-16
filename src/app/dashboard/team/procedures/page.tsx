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
  FileCheck,
  AlertTriangle,
  BookOpen,
  CheckCircle,
  Clock,
  Eye,
  Edit,
  Download
} from 'lucide-react'

interface Procedure {
  id: string
  title: string
  procedure_type: string
  category?: string
  version: string
  required_roles: string[]
  last_reviewed?: string
  is_active: boolean
  created_at: string
}

export default function ProceduresPage() {
  const { supabase } = useSupabase()
  const { data: session } = useSession()
  const [procedures, setProcedures] = useState<Procedure[]>([])
  const [loading, setLoading] = useState(true)
  const [currentView, setCurrentView] = useState<ViewType>('table')
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    const loadProcedures = async () => {
      if (!session?.user?.organizationId) return

      const { data, error } = await supabase
        .from('procedures')
        .select('*')
        .eq('organization_id', session.user.organizationId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading procedures:', error)
      } else {
        setProcedures(data || [])
      }
      setLoading(false)
    }

    loadProcedures()
  }, [session, supabase])

  const filteredProcedures = procedures.filter(procedure => {
    const matchesSearch = procedure.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         procedure.category?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === 'all' || procedure.procedure_type === typeFilter
    const matchesStatus = statusFilter === 'all' ||
                         (statusFilter === 'active' && procedure.is_active) ||
                         (statusFilter === 'inactive' && !procedure.is_active)

    return matchesSearch && matchesType && matchesStatus
  })

  const getProcedureTypeIcon = (type: string) => {
    switch (type) {
      case 'sop': return <FileCheck className="h-4 w-4" />
      case 'emergency': return <AlertTriangle className="h-4 w-4" />
      case 'playbook': return <BookOpen className="h-4 w-4" />
      default: return <FileCheck className="h-4 w-4" />
    }
  }

  const getStatusIcon = (status: boolean) => {
    return status ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Clock className="h-4 w-4 text-gray-500" />
  }

  const getReviewStatus = (procedure: Procedure) => {
    if (!procedure.last_reviewed) return { status: 'never_reviewed', label: 'Never Reviewed', color: 'destructive' }

    const lastReview = new Date(procedure.last_reviewed)
    const now = new Date()
    const daysSinceReview = Math.floor((now.getTime() - lastReview.getTime()) / (1000 * 60 * 60 * 24))

    if (daysSinceReview > 365) return { status: 'overdue', label: 'Review Overdue', color: 'destructive' }
    if (daysSinceReview > 180) return { status: 'due_soon', label: 'Due Soon', color: 'secondary' }
    return { status: 'current', label: 'Current', color: 'default' }
  }

  const renderTableView = () => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left p-4">Procedure</th>
            <th className="text-left p-4">Type</th>
            <th className="text-left p-4">Category</th>
            <th className="text-left p-4">Version</th>
            <th className="text-left p-4">Review Status</th>
            <th className="text-left p-4">Required Roles</th>
            <th className="text-left p-4">Status</th>
            <th className="text-left p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProcedures.map(procedure => {
            const reviewStatus = getReviewStatus(procedure)

            return (
              <tr key={procedure.id} className="border-b hover:bg-muted/50">
                <td className="p-4">
                  <div>
                    <div className="font-medium flex items-center gap-2">
                      {getProcedureTypeIcon(procedure.procedure_type)}
                      {procedure.title}
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <Badge variant="outline" className="capitalize">
                    {procedure.procedure_type}
                  </Badge>
                </td>
                <td className="p-4">
                  {procedure.category ? (
                    <Badge variant="secondary" className="capitalize">
                      {procedure.category}
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </td>
                <td className="p-4">
                  <Badge variant="outline">v{procedure.version}</Badge>
                </td>
                <td className="p-4">
                  <Badge variant={reviewStatus.color as any}>
                    {reviewStatus.label}
                  </Badge>
                </td>
                <td className="p-4">
                  <div className="flex flex-wrap gap-1">
                    {procedure.required_roles.slice(0, 2).map(role => (
                      <Badge key={role} variant="outline" className="text-xs capitalize">
                        {role.replace('_', ' ')}
                      </Badge>
                    ))}
                    {procedure.required_roles.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{procedure.required_roles.length - 2}
                      </Badge>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(procedure.is_active)}
                    <span>{procedure.is_active ? 'Active' : 'Inactive'}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
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
      {filteredProcedures.map(procedure => {
        const reviewStatus = getReviewStatus(procedure)

        return (
          <Card key={procedure.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {getProcedureTypeIcon(procedure.procedure_type)}
                  <CardTitle className="text-lg line-clamp-2">{procedure.title}</CardTitle>
                </div>
                {getStatusIcon(procedure.is_active)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span>Type:</span>
                  <Badge variant="outline" className="capitalize">{procedure.procedure_type}</Badge>
                </div>
                {procedure.category && (
                  <div className="flex justify-between text-sm">
                    <span>Category:</span>
                    <Badge variant="secondary" className="capitalize">{procedure.category}</Badge>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span>Version:</span>
                  <Badge variant="outline">v{procedure.version}</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Review:</span>
                  <Badge variant={reviewStatus.color as any}>{reviewStatus.label}</Badge>
                </div>
                <div className="text-sm">
                  <span>Required Roles:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {procedure.required_roles.slice(0, 3).map(role => (
                      <Badge key={role} variant="outline" className="text-xs capitalize">
                        {role.replace('_', ' ')}
                      </Badge>
                    ))}
                    {procedure.required_roles.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{procedure.required_roles.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )

  const getStats = () => {
    const total = procedures.length
    const active = procedures.filter(p => p.is_active).length
    const sops = procedures.filter(p => p.procedure_type === 'sop').length
    const emergency = procedures.filter(p => p.procedure_type === 'emergency').length
    const overdue = procedures.filter(p => {
      if (!p.last_reviewed) return true
      const days = Math.floor((Date.now() - new Date(p.last_reviewed).getTime()) / (1000 * 60 * 60 * 24))
      return days > 365
    }).length

    return { total, active, sops, emergency, overdue }
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
          <h1 className="text-3xl font-bold">Procedures</h1>
          <p className="text-muted-foreground">
            Manage SOPs, emergency procedures, and operational playbooks
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Procedure
          </Button>
          <ViewSwitcher
            currentView={currentView}
            availableViews={['table', 'board', 'list']}
            onViewChange={setCurrentView}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <FileCheck className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Procedures</p>
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
              <FileCheck className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">SOPs</p>
                <p className="text-2xl font-bold">{stats.sops}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Emergency</p>
                <p className="text-2xl font-bold">{stats.emergency}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Review Overdue</p>
                <p className="text-2xl font-bold">{stats.overdue}</p>
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
                  placeholder="Search procedures..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Procedure Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="sop">SOP</SelectItem>
                <SelectItem value="emergency">Emergency</SelectItem>
                <SelectItem value="playbook">Playbook</SelectItem>
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

      {filteredProcedures.length === 0 && (
        <div className="text-center py-12">
          <FileCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No procedures found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || typeFilter !== 'all' || statusFilter !== 'all'
              ? 'Try adjusting your filters'
              : 'Create your first SOP or procedure to get started'}
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Procedure
          </Button>
        </div>
      )}
    </div>
  )
}
