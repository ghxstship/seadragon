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
  Search,
  FileText,
  Upload,
  Download,
  Eye,
  Edit,
  Trash2,
  Tag,
  FileVideo
} from 'lucide-react'

interface Document {
  id: string
  title: string
  description?: string
  document_type: string
  file_size?: number
  mime_type?: string
  version: number
  status: string
  tags: string[]
  created_by: string
  created_at: string
}

export default function DocumentsPage() {
  const { supabase } = useSupabase()
  const { data: session } = useSession()
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [currentView, setCurrentView] = useState<ViewType>('table')
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    const loadDocuments = async () => {
      if (!session?.user?.organizationId) return

      const { data, error } = await supabase
        .from('documents')
        .select(`
          *,
          created_by_user:users!documents_created_by_fkey(first_name, last_name)
        `)
        .eq('organization_id', session.user.organizationId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading documents:', error)
      } else {
        setDocuments(data || [])
      }
      setLoading(false)
    }

    loadDocuments()
  }, [session, supabase])

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesType = typeFilter === 'all' || doc.document_type === typeFilter
    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter

    return matchesSearch && matchesType && matchesStatus
  })

  const getDocumentTypeIcon = (type: string) => {
    switch (type) {
      case 'contract': return <FileText className="h-4 w-4" />
      case 'permit': return <FileText className="h-4 w-4" />
      case 'plan': return <FileText className="h-4 w-4" />
      case 'media': return <FileVideo className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
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

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '-'
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  const renderTableView = () => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left p-4">Document</th>
            <th className="text-left p-4">Type</th>
            <th className="text-left p-4">Status</th>
            <th className="text-left p-4">Version</th>
            <th className="text-left p-4">Size</th>
            <th className="text-left p-4">Created</th>
            <th className="text-left p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredDocuments.map(doc => (
            <tr key={doc.id} className="border-b hover:bg-muted/50">
              <td className="p-4">
                <div>
                  <div className="font-medium flex items-center gap-2">
                    {getDocumentTypeIcon(doc.document_type)}
                    {doc.title}
                  </div>
                  {doc.description && (
                    <div className="text-sm text-muted-foreground">
                      {doc.description}
                    </div>
                  )}
                  {doc.tags.length > 0 && (
                    <div className="flex gap-1 mt-1">
                      {doc.tags.slice(0, 2).map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {doc.tags.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{doc.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </td>
              <td className="p-4">
                <Badge variant="outline" className="capitalize">
                  {doc.document_type}
                </Badge>
              </td>
              <td className="p-4">
                <Badge variant={getStatusColor(doc.status) as any}>
                  {doc.status}
                </Badge>
              </td>
              <td className="p-4">
                <Badge variant="secondary">v{doc.version}</Badge>
              </td>
              <td className="p-4 text-sm text-muted-foreground">
                {formatFileSize(doc.file_size)}
              </td>
              <td className="p-4 text-sm text-muted-foreground">
                {new Date(doc.created_at).toLocaleDateString()}
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
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredDocuments.map(doc => (
        <Card key={doc.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                {getDocumentTypeIcon(doc.document_type)}
                <CardTitle className="text-lg line-clamp-1">{doc.title}</CardTitle>
              </div>
              <Badge variant={getStatusColor(doc.status) as any}>
                {doc.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {doc.description && (
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {doc.description}
              </p>
            )}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span>Type:</span>
                <Badge variant="outline" className="capitalize text-xs">
                  {doc.document_type}
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>Version:</span>
                <Badge variant="secondary" className="text-xs">v{doc.version}</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>Size:</span>
                <span className="text-muted-foreground text-xs">
                  {formatFileSize(doc.file_size)}
                </span>
              </div>
            </div>
            {doc.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-4">
                {doc.tags.slice(0, 3).map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {doc.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{doc.tags.length - 3}
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
    const total = documents.length
    const approved = documents.filter(d => d.status === 'approved').length
    const review = documents.filter(d => d.status === 'review').length
    const draft = documents.filter(d => d.status === 'draft').length
    const totalSize = documents.reduce((sum, d) => sum + (d.file_size || 0), 0)

    return { total, approved, review, draft, totalSize }
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
          <h1 className="text-3xl font-bold">Documents</h1>
          <p className="text-muted-foreground">
            Manage contracts, permits, plans, and other versioned files
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button>
            <Upload className="h-4 w-4 mr-2" />
            Upload Document
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
              <FileText className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Documents</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-green-500" />
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
              <Eye className="h-8 w-8 text-yellow-500" />
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
              <Tag className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Size</p>
                <p className="text-2xl font-bold">{formatFileSize(stats.totalSize)}</p>
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
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Document Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="permit">Permit</SelectItem>
                <SelectItem value="plan">Plan</SelectItem>
                <SelectItem value="media">Media</SelectItem>
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
          {currentView === 'board' && renderGridView()}
          {currentView === 'gallery' && (
            <div className="p-6 text-center text-muted-foreground">
              Gallery view coming soon
            </div>
          )}
        </CardContent>
      </Card>

      {filteredDocuments.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No documents found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || typeFilter !== 'all' || statusFilter !== 'all'
              ? 'Try adjusting your filters'
              : 'Upload your first document to get started'}
          </p>
          <Button>
            <Upload className="h-4 w-4 mr-2" />
            Upload Document
          </Button>
        </div>
      )}
    </div>
  )
}
