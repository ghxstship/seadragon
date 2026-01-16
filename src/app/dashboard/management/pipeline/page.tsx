'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
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
  GitBranch,
  DollarSign,
  Calendar,
  User,
  CheckCircle,
  Clock,
  XCircle,
  TrendingUp,
  Target
} from 'lucide-react'

interface PipelineItem {
  id: string
  title: string
  item_type: string
  stage: string
  value?: number
  probability?: number
  expected_close_date?: string
  assigned_to?: string
  created_at: string
}

export default function PipelinePage() {
  const { supabase } = useSupabase()
  const { data: session } = useSession()
  const [pipelineItems, setPipelineItems] = useState<PipelineItem[]>([])
  const [loading, setLoading] = useState(true)
  const [currentView, setCurrentView] = useState<ViewType>('table')
  const [searchTerm, setSearchTerm] = useState('')
  const [stageFilter, setStageFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  useEffect(() => {
    const loadPipeline = async () => {
      if (!session?.user?.organizationId) return

      const { data, error } = await supabase
        .from('pipeline_items')
        .select('*')
        .eq('organization_id', session.user.organizationId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading pipeline:', error)
      } else {
        setPipelineItems(data || [])
      }
      setLoading(false)
    }

    loadPipeline()
  }, [session, supabase])

  const filteredItems = pipelineItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStage = stageFilter === 'all' || item.stage === stageFilter
    const matchesType = typeFilter === 'all' || item.item_type === typeFilter

    return matchesSearch && matchesStage && matchesType
  })

  const getStageIcon = (stage: string) => {
    switch (stage) {
      case 'closed_won': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'closed_lost': return <XCircle className="h-4 w-4 text-red-500" />
      case 'negotiation': return <Target className="h-4 w-4 text-blue-500" />
      case 'proposal': return <GitBranch className="h-4 w-4 text-yellow-500" />
      case 'qualified': return <User className="h-4 w-4 text-purple-500" />
      default: return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'closed_won': return 'default'
      case 'closed_lost': return 'destructive'
      case 'negotiation': return 'secondary'
      case 'proposal': return 'outline'
      case 'qualified': return 'secondary'
      default: return 'outline'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'deal': return <DollarSign className="h-4 w-4" />
      case 'bid': return <Target className="h-4 w-4" />
      case 'lead': return <User className="h-4 w-4" />
      default: return <GitBranch className="h-4 w-4" />
    }
  }

  const renderTableView = () => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left p-4">Item</th>
            <th className="text-left p-4">Type</th>
            <th className="text-left p-4">Stage</th>
            <th className="text-left p-4">Value</th>
            <th className="text-left p-4">Probability</th>
            <th className="text-left p-4">Expected Close</th>
            <th className="text-left p-4">Assigned</th>
            <th className="text-left p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.map(item => (
            <tr key={item.id} className="border-b hover:bg-muted/50">
              <td className="p-4">
                <div>
                  <div className="font-medium">{item.title}</div>
                </div>
              </td>
              <td className="p-4">
                <div className="flex items-center gap-2">
                  {getTypeIcon(item.item_type)}
                  <Badge variant="outline" className="capitalize">
                    {item.item_type}
                  </Badge>
                </div>
              </td>
              <td className="p-4">
                <div className="flex items-center gap-2">
                  {getStageIcon(item.stage)}
                  <Badge variant={getStageColor(item.stage) as any} className="capitalize">
                    {item.stage.replace('_', ' ')}
                  </Badge>
                </div>
              </td>
              <td className="p-4">
                {item.value ? (
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    <span>{item.value.toLocaleString()}</span>
                  </div>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </td>
              <td className="p-4">
                {item.probability ? (
                  <span>{item.probability}%</span>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </td>
              <td className="p-4">
                {item.expected_close_date ? (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4" />
                    {new Date(item.expected_close_date).toLocaleDateString()}
                  </div>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </td>
              <td className="p-4">
                {item.assigned_to ? (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>Assigned</span>
                  </div>
                ) : (
                  <span className="text-muted-foreground">Unassigned</span>
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

  const renderBoardView = () => {
    const stages = ['prospect', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost']

    return (
      <div className="flex gap-6 overflow-x-auto pb-4">
        {stages.map(stage => {
          const stageItems = filteredItems.filter(item => item.stage === stage)
          const totalValue = stageItems.reduce((sum, item) => sum + (item.value || 0), 0)

          return (
            <div key={stage} className="flex-1 min-w-80">
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium flex items-center gap-2 capitalize">
                    {getStageIcon(stage)}
                    {stage.replace('_', ' ')}
                  </h3>
                  <Badge variant="secondary">{stageItems.length}</Badge>
                </div>
                {totalValue > 0 && (
                  <div className="text-sm text-muted-foreground mb-4">
                    ${totalValue.toLocaleString()} total value
                  </div>
                )}
                <div className="space-y-3">
                  {stageItems.slice(0, 5).map(item => (
                    <Card key={item.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-3">
                        <h4 className="font-medium text-sm mb-2">{item.title}</h4>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs capitalize">
                            {item.item_type}
                          </Badge>
                          {item.value && (
                            <span className="text-xs font-medium">
                              ${item.value.toLocaleString()}
                            </span>
                          )}
                        </div>
                        {item.probability && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {item.probability}% probability
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                  {stageItems.length > 5 && (
                    <div className="text-center text-sm text-muted-foreground py-2">
                      +{stageItems.length - 5} more items
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  const getStats = () => {
    const total = pipelineItems.length
    const totalValue = pipelineItems.reduce((sum, item) => sum + (item.value || 0), 0)
    const weightedValue = pipelineItems.reduce((sum, item) => {
      return sum + ((item.value || 0) * (item.probability || 0) / 100)
    }, 0)
    const won = pipelineItems.filter(item => item.stage === 'closed_won').length
    const lost = pipelineItems.filter(item => item.stage === 'closed_lost').length
    const active = pipelineItems.filter(item => !item.stage.includes('closed')).length

    return { total, totalValue, weightedValue, won, lost, active }
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
          <h1 className="text-3xl font-bold">Pipeline</h1>
          <p className="text-muted-foreground">
            Track leads, bids, deals, and opportunities through the sales process
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
          <ViewSwitcher
            currentView={currentView}
            availableViews={['table', 'board', 'analytics']}
            onViewChange={setCurrentView}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <GitBranch className="h-8 w-8 text-blue-500" />
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
              <TrendingUp className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Weighted Value</p>
                <p className="text-2xl font-bold">${stats.weightedValue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Closed Won</p>
                <p className="text-2xl font-bold">{stats.won}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <XCircle className="h-8 w-8 text-red-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Closed Lost</p>
                <p className="text-2xl font-bold">{stats.lost}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">{stats.active}</p>
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
                  placeholder="Search pipeline items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={stageFilter} onValueChange={setStageFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stages</SelectItem>
                <SelectItem value="prospect">Prospect</SelectItem>
                <SelectItem value="qualified">Qualified</SelectItem>
                <SelectItem value="proposal">Proposal</SelectItem>
                <SelectItem value="negotiation">Negotiation</SelectItem>
                <SelectItem value="closed_won">Closed Won</SelectItem>
                <SelectItem value="closed_lost">Closed Lost</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="lead">Lead</SelectItem>
                <SelectItem value="bid">Bid</SelectItem>
                <SelectItem value="proposal">Proposal</SelectItem>
                <SelectItem value="deal">Deal</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      <Card>
        <CardContent className="p-0">
          {currentView === 'table' && renderTableView()}
          {currentView === 'board' && renderBoardView()}
          {currentView === 'analytics' && (
            <div className="p-6 text-center text-muted-foreground">
              Analytics view coming soon
            </div>
          )}
        </CardContent>
      </Card>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <GitBranch className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No pipeline items found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || stageFilter !== 'all' || typeFilter !== 'all'
              ? 'Try adjusting your filters'
              : 'Add your first lead or opportunity to start building your pipeline'}
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Pipeline Item
          </Button>
        </div>
      )}
    </div>
  )
}
