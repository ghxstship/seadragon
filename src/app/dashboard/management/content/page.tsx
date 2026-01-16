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
  FileImage,
  FileVideo,
  FileText,
  Upload,
  Download,
  Eye,
  Edit,
  CheckCircle,
  Clock,
  AlertTriangle,
  Folder,
  Tag
} from 'lucide-react'

interface ContentItem {
  id: string
  title: string
  content_type: string
  project_id?: string
  programming_id?: string
  status: string
  tags: string[]
  created_at: string
  project?: { name: string }
}

export default function ContentPage() {
  const { supabase } = useSupabase()
  const { data: session } = useSession()
  const [contentItems, setContentItems] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [currentView, setCurrentView] = useState<ViewType>('table')
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    const loadContent = async () => {
      if (!session?.user?.organizationId) return

      const { data, error } = await supabase
        .from('content_items')
        .select(`
          *,
          project:projects(name)
        `)
        .eq('organization_id', session.user.organizationId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading content:', error)
      } else {
        setContentItems(data || [])
      }
      setLoading(false)
    }

    loadContent()
  }, [session, supabase])

  const filteredItems = contentItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesType = typeFilter === 'all' || item.content_type === typeFilter
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter

    return matchesSearch && matchesType && matchesStatus
  })

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'media': return <FileVideo className="h-4 w-4" />
      case 'deliverable': return <FileText className="h-4 w-4" />
      case 'collateral': return <FileImage className="h-4 w-4" />
      case 'documentation': return <FileText className="h-4 w-4" />
      default: return <FileImage className="h-4 w-4" />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'review': return <Clock className="h-4 w-4 text-yellow-500" />
      case 'draft': return <AlertTriangle className="h-4 w-4 text-gray-500" />
      default: return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'default'
      case 'review': return 'secondary'
      case 'draft': return 'outline'
      default: return 'outline'
    }
  }

  const renderTableView = () => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left p-4">Content</th>
            <th className="text-left p-4">Type</th>
            <th className="text-left p-4">Project</th>
            <th className="text-left p-4">Status</th>
            <th className="text-left p-4">Tags</th>
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
                    {getContentTypeIcon(item.content_type)}
                    {item.title}
                  </div>
                </div>
              </td>
              <td className="p-4">
                <Badge variant="outline" className="capitalize">
                  {item.content_type}
                </Badge>
              </td>
              <td className="p-4">
                {item.project?.name ? (
                  <div className="flex items-center gap-2">
                    <Folder className="h-4 w-4" />
                    <span>{item.project.name}</span>
                  </div>
                ) : (
                  <span className="text-muted-foreground">No Project</span>
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
                <div className="flex flex-wrap gap-1">
                  {item.tags.slice(0, 3).map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {item.tags.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{item.tags.length - 3}
                    </Badge>
                  )}
                </div>
              </td>
              <td className="p-4 text-sm text-muted-foreground">
                {new Date(item.created_at).toLocaleDateString()}
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
                    <Edit className="h-4 w-4" />
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredItems.map(item => (
        <Card key={item.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                {getContentTypeIcon(item.content_type)}
                <CardTitle className="text-lg line-clamp-2">{item.title}</CardTitle>
              </div>
              {getStatusIcon(item.status)}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span>Type:</span>
                <Badge variant="outline" className="capitalize">{item.content_type}</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>Status:</span>
                <Badge variant={getStatusColor(item.status) as any}>
                  {item.status}
                </Badge>
              </div>
              {item.project?.name && (
                <div className="flex justify-between text-sm">
                  <span>Project:</span>
                  <span className="text-muted-foreground">{item.project.name}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span>Created:</span>
                <span className="text-muted-foreground">
                  {new Date(item.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
            {item.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-4">
                {item.tags.slice(0, 4).map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {item.tags.length > 4 && (
                  <Badge variant="secondary" className="text-xs">
                    +{item.tags.length - 4}
                  </Badge>
                )}
              </div>
            )}
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
      ))}
    </div>
  )

  const getStats = () => {
    const total = contentItems.length
    const approved = contentItems.filter(item => item.status === 'approved').length
    const review = contentItems.filter(item => item.status === 'review').length
    const draft = contentItems.filter(item => item.status === 'draft').length
    const media = contentItems.filter(item => item.content_type === 'media').length
    const deliverables = contentItems.filter(item => item.content_type === 'deliverable').length

    return { total, approved, review, draft, media, deliverables }
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
          <h1 className="text-3xl font-bold">Content</h1>
          <p className="text-muted-foreground">
            Manage creative content, deliverables, and marketing collateral
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button>
            <Upload className="h-4 w-4 mr-2" />
            Upload Content
          </Button>
          <ViewSwitcher
            currentView={currentView}
            availableViews={['table', 'board', 'gallery']}
            onViewChange={setCurrentView}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <FileImage className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Content</p>
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
              <Clock className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">In Review</p>
                <p className="text-2xl font-bold">{stats.review}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Edit className="h-8 w-8 text-gray-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Drafts</p>
                <p className="text-2xl font-bold">{stats.draft}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <FileVideo className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Media</p>
                <p className="text-2xl font-bold">{stats.media}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Deliverables</p>
                <p className="text-2xl font-bold">{stats.deliverables}</p>
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
                  placeholder="Search content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Content Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="media">Media</SelectItem>
                <SelectItem value="deliverable">Deliverable</SelectItem>
                <SelectItem value="collateral">Collateral</SelectItem>
                <SelectItem value="documentation">Documentation</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="review">In Review</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
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

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <FileImage className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No content found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || typeFilter !== 'all' || statusFilter !== 'all'
              ? 'Try adjusting your filters'
              : 'Upload your first creative content or deliverable'}
          </p>
          <Button>
            <Upload className="h-4 w-4 mr-2" />
            Upload Content
          </Button>
        </div>
      )}
    </div>
  )
}
