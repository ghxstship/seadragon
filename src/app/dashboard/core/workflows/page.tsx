'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ViewSwitcher, ViewType } from '@/lib/design-system/patterns/view-switcher'
import { useSupabase } from '@/contexts/SupabaseContext'
import { useSession } from 'next-auth/react'
import {
  Plus,
  Workflow,
  Play,
  Pause,
  Settings,
  Eye,
  Edit,
  Trash2
} from 'lucide-react'

interface Workflow {
  id: string
  name: string
  description?: string
  trigger_type: string
  is_active: boolean
  created_by: string
  created_at: string
}

export default function WorkflowsPage() {
  const { supabase } = useSupabase()
  const { data: session } = useSession()
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [loading, setLoading] = useState(true)
  const [currentView, setCurrentView] = useState<ViewType>('table')

  useEffect(() => {
    const loadWorkflows = async () => {
      if (!session?.user?.organizationId) return

      const { data, error } = await supabase
        .from('workflows')
        .select(`
          *,
          created_by_user:users!workflows_created_by_fkey(first_name, last_name)
        `)
        .eq('organization_id', session.user.organizationId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading workflows:', error)
      } else {
        setWorkflows(data || [])
      }
      setLoading(false)
    }

    loadWorkflows()
  }, [session, supabase])

  const toggleWorkflow = async (workflowId: string, isActive: boolean) => {
    const { error } = await supabase
      .from('workflows')
      .update({ is_active: !isActive })
      .eq('id', workflowId)

    if (!error) {
      setWorkflows(prev => prev.map(w =>
        w.id === workflowId ? { ...w, is_active: !isActive } : w
      ))
    }
  }

  const renderTableView = () => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left p-4">Workflow</th>
            <th className="text-left p-4">Trigger</th>
            <th className="text-left p-4">Status</th>
            <th className="text-left p-4">Created</th>
            <th className="text-left p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {workflows.map(workflow => (
            <tr key={workflow.id} className="border-b hover:bg-muted/50">
              <td className="p-4">
                <div>
                  <div className="font-medium">{workflow.name}</div>
                  {workflow.description && (
                    <div className="text-sm text-muted-foreground">
                      {workflow.description}
                    </div>
                  )}
                </div>
              </td>
              <td className="p-4">
                <Badge variant="outline">
                  {workflow.trigger_type}
                </Badge>
              </td>
              <td className="p-4">
                <Badge variant={workflow.is_active ? 'default' : 'secondary'}>
                  {workflow.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </td>
              <td className="p-4 text-sm text-muted-foreground">
                {new Date(workflow.created_at).toLocaleDateString()}
              </td>
              <td className="p-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleWorkflow(workflow.id, workflow.is_active)}
                  >
                    {workflow.is_active ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
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

  const renderListView = () => (
    <div className="space-y-4">
      {workflows.map(workflow => (
        <Card key={workflow.id}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Workflow className="h-5 w-5" />
                  <h3 className="font-medium">{workflow.name}</h3>
                  <Badge variant={workflow.is_active ? 'default' : 'secondary'}>
                    {workflow.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                {workflow.description && (
                  <p className="text-sm text-muted-foreground mb-2">{workflow.description}</p>
                )}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>Trigger: {workflow.trigger_type}</span>
                  <span>Created {new Date(workflow.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleWorkflow(workflow.id, workflow.is_active)}
                >
                  {workflow.is_active ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  const renderCardView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {workflows.map(workflow => (
        <Card key={workflow.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Workflow className="h-5 w-5" />
                <CardTitle className="text-lg">{workflow.name}</CardTitle>
              </div>
              <Badge variant={workflow.is_active ? 'default' : 'secondary'}>
                {workflow.is_active ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {workflow.description && (
              <p className="text-sm text-muted-foreground mb-4">{workflow.description}</p>
            )}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span>Trigger:</span>
                <Badge variant="outline">{workflow.trigger_type}</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>Created:</span>
                <span className="text-muted-foreground">
                  {new Date(workflow.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => toggleWorkflow(workflow.id, workflow.is_active)}
              >
                {workflow.is_active ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                {workflow.is_active ? 'Pause' : 'Activate'}
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

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
          <h1 className="text-3xl font-bold">Workflows</h1>
          <p className="text-muted-foreground">
            Automate processes with triggers, conditions, and actions
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Workflow
          </Button>
          <ViewSwitcher
            currentView={currentView}
            availableViews={['table', 'list', 'board']}
            onViewChange={setCurrentView}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Workflow className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Workflows</p>
                <p className="text-2xl font-bold">{workflows.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Play className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Active Workflows</p>
                <p className="text-2xl font-bold">
                  {workflows.filter(w => w.is_active).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Pause className="h-8 w-8 text-gray-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Inactive Workflows</p>
                <p className="text-2xl font-bold">
                  {workflows.filter(w => !w.is_active).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content */}
      <Card>
        <CardContent className="p-0">
          {currentView === 'table' && renderTableView()}
          {currentView === 'list' && renderListView()}
          {currentView === 'board' && renderCardView()}
        </CardContent>
      </Card>

      {workflows.length === 0 && (
        <div className="text-center py-12">
          <Workflow className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No workflows yet</h3>
          <p className="text-muted-foreground mb-4">
            Create automated processes to streamline your operations
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Workflow
          </Button>
        </div>
      )}
    </div>
  )
}
