// Workflow Orchestration and Automation Component

import React, { useState, Suspense } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { logger } from '@/lib/logger'
import { safeJsonParse } from '@/lib/safe-json'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  Plus,
  Play,
  Pause,
  Zap,
  GitBranch,
  MessageSquare,
  Database,
  Clock,
  ArrowRight,
  Trash2,
  Edit,
  Loader2
} from 'lucide-react'
import { WorkflowTemplateUtils } from '@/lib/integrations/workflow-templates'
import { integrationOrchestrator } from '@/lib/integrations/orchestration'
import { OrchestrationChain, OrchestrationCondition, OrchestrationStep } from '@/lib/integrations/orchestration'

// Loading fallback component
const LoadingFallback = ({ message }: { message: string }) => (
  <div className="flex items-center justify-center p-8">
    <Loader2 className="w-6 h-6 animate-spin mr-2"/>
    <span>{message}</span>
  </div>
)

// Workflow interfaces
interface Workflow {
  id: string
  name: string
  description: string
  organizationId: string
  steps: WorkflowStep[]
  status: OrchestrationChain['status']
  type: OrchestrationChain['type']
  createdAt: Date
  updatedAt: Date
}

interface WorkflowTemplate {
  id: string
  name: string
  description: string
  steps: WorkflowStep[]
  category?: string
  type: OrchestrationChain['type']
}

const convertTemplateStep = (step: OrchestrationStep, order: number): WorkflowStep => {
  const params = step.parameters as Record<string, unknown> | undefined
  const config: StepConfig = {
    type: step.action,
    provider: step.connectionId,
    params
  }

  if (typeof params?.['field'] === 'string') {
    config.field = params['field'] as string
  }

  if (step.conditions?.[0]?.operator) {
    config.operator = step.conditions[0].operator
  }

  if (typeof params?.['value'] === 'string') {
    config.value = params['value'] as string
  }

  return {
    id: step.id,
    type: 'action',
    config,
    order
  }
}

interface StepConfig {
  type?: string
  provider?: string
  cron?: string
  field?: string | undefined
  operator?: string | undefined
  value?: string | undefined
  params?: Record<string, unknown> | undefined
}

interface WorkflowStep {
  id: string
  type: 'trigger' | 'action' | 'condition'
  config: StepConfig
  order: number
}

interface WorkflowOrchestrationProps {
  organizationId: string
  onWorkflowCreated?: (workflow: Workflow) => void
  onWorkflowUpdated?: (workflow: Workflow) => void
  onWorkflowDeleted?: (workflowId: string) => void
}

export function WorkflowOrchestration({
  organizationId,
  onWorkflowCreated,
  onWorkflowUpdated,
  onWorkflowDeleted
}: WorkflowOrchestrationProps) {
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null)
  const [isCreatingWorkflow, setIsCreatingWorkflow] = useState(false)
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>([])
  const [workflowName, setWorkflowName] = useState('')
  const [workflowDescription, setWorkflowDescription] = useState('')

  const triggerTypes = [
    { value: 'webhook', label: 'Webhook Trigger', icon: Zap, description: 'Triggered by webhook events from integrated services' },
    { value: 'schedule', label: 'Scheduled Trigger', icon: Clock, description: 'Runs on a regular schedule' },
    { value: 'event', label: 'Event Trigger', icon: GitBranch, description: 'Triggered by system events' },
    { value: 'api', label: 'API Trigger', icon: Database, description: 'Triggered by API calls' }
  ]

  const actionTypes = [
    { value: 'sync_data', label: 'Sync Data', icon: Database, description: 'Synchronize data between services' },
    { value: 'send_notification', label: 'Send Notification', icon: MessageSquare, description: 'Send notifications via integrated channels' },
    { value: 'create_issue', label: 'Create Issue/Task', icon: Plus, description: 'Create issues or tasks in project management tools' },
    { value: 'update_record', label: 'Update Record', icon: Edit, description: 'Update records in connected systems' },
    { value: 'run_command', label: 'Run Command', icon: Play, description: 'Execute commands in CI/CD systems' }
  ]

  const conditionTypes = [
    { value: 'equals', label: 'Equals', description: 'Check if field equals value' },
    { value: 'not_equals', label: 'Not Equals', description: 'Check if field does not equal value' },
    { value: 'contains', label: 'Contains', description: 'Check if field contains value' },
    { value: 'greater_than', label: 'Greater Than', description: 'Check if field is greater than value' },
    { value: 'less_than', label: 'Less Than', description: 'Check if field is less than value' }
  ]

  const addStep = (type: 'trigger' | 'action' | 'condition') => {
    const newStep: WorkflowStep = {
      id: `step_${Date.now()}`,
      type,
      config: {},
      order: workflowSteps.length
    }
    setWorkflowSteps(prev => [...prev, newStep])
  }

  const updateStepConfig = (stepId: string, config: StepConfig) => {
    setWorkflowSteps(prev => prev.map(step =>
      step.id === stepId ? { ...step, config } : step
    ))
  }

  const removeStep = (stepId: string) => {
    setWorkflowSteps(prev => prev.filter(step => step.id !== stepId))
  }

  const moveStep = (stepId: string, direction: 'up' | 'down') => {
    setWorkflowSteps(prev => {
      const index = prev.findIndex(step => step.id === stepId)
      if (index === -1) return prev

      const newIndex = direction === 'up' ? index - 1 : index + 1
      if (newIndex < 0 || newIndex >= prev.length) return prev

      const newSteps = [...prev]
      const currentStep = newSteps[index]
      const swapStep = newSteps[newIndex]
      if (!currentStep || !swapStep) return prev

      newSteps[index] = swapStep
      newSteps[newIndex] = currentStep

      // Update order
      newSteps.forEach((step, i) => step.order = i)
      return newSteps
    })
  }

  const buildOrchestrationChain = (workflow: Workflow): OrchestrationChain => {
    return {
      id: workflow.id,
      name: workflow.name,
      description: workflow.description,
      type: workflow.type,
      organizationId: workflow.organizationId,
      status: workflow.status,
      createdAt: workflow.createdAt,
      updatedAt: workflow.updatedAt,
      steps: workflow.steps.map((step): OrchestrationStep => {
        const connectionId = step.config.provider || (step.type === 'trigger' && step.config.type === 'schedule' ? 'system-scheduler' : undefined)
        if (!connectionId) {
          throw new Error('Each step must specify a provider or a schedule-based connectionId')
        }

        const parameters: Record<string, unknown> = {
          ...(step.config.params || {}),
          cron: step.config.cron,
          field: step.config.field,
          operator: step.config.operator,
          value: step.config.value,
          kind: step.type
        }

        const baseStep: OrchestrationStep = {
          id: step.id,
          name: step.config.type || step.type,
          description: step.config.field ? `${step.config.field}${step.config.operator ? ` ${step.config.operator}` : ''}` : '',
          connectionId,
          action: step.config.type || 'sync_data',
          parameters,
          retryCount: 0,
          retryDelay: 1000,
          timeout: 30000
        }

        if (step.order > 0) {
          baseStep.dependsOn = [`step_${step.order - 1}`]
        }

        if (step.type === 'condition' && step.config.field && step.config.operator) {
          const operator = step.config.operator as OrchestrationCondition['operator']
          baseStep.conditions = [
            {
              field: step.config.field,
              operator,
              value: step.config.value ?? '',
              action: 'continue'
            }
          ]
        }

        return baseStep
      })
    }
  }

  const saveWorkflow = () => {
    if (!workflowName.trim()) return

    const workflow: Workflow = {
      id: selectedWorkflow?.id || `workflow_${Date.now()}`,
      name: workflowName,
      description: workflowDescription,
      type: selectedWorkflow?.type || 'sequential',
      organizationId,
      steps: workflowSteps,
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    if (selectedWorkflow) {
      setWorkflows(prev => prev.map(w => w.id === workflow.id ? workflow : w))
      onWorkflowUpdated?.(workflow)
    } else {
      setWorkflows(prev => [...prev, workflow])
      onWorkflowCreated?.(workflow)
    }

    // Reset form
    setWorkflowName('')
    setWorkflowDescription('')
    setWorkflowSteps([])
    setSelectedWorkflow(null)
    setIsCreatingWorkflow(false)
  }

  const deleteWorkflow = (workflowId: string) => {
    setWorkflows(prev => prev.filter(w => w.id !== workflowId))
    onWorkflowDeleted?.(workflowId)
  }

  const executeWorkflow = async (workflow: Workflow) => {
    try {
      const chain = buildOrchestrationChain({ ...workflow, status: 'active' })
      integrationOrchestrator.registerChain(chain)
      await integrationOrchestrator.executeChain(chain.id)
      logger.action('workflow_executed', { workflowId: workflow.id })
    } catch (error) {
      logger.error('workflow_execution_failed', { workflowId: workflow.id, error })
    }
  }

  const toggleWorkflowStatus = (workflowId: string) => {
    setWorkflows(prev => prev.map(w => {
      const newStatus = w.id === workflowId ? (w.status === 'active' ? 'inactive' : 'active') : w.status
      const updatedWorkflow: Workflow = { ...w, status: newStatus }
      if (newStatus === 'active') {
        const chain = buildOrchestrationChain(updatedWorkflow)
        integrationOrchestrator.registerChain(chain)
      }
      return updatedWorkflow
    }))
  }

  const renderStepConfig = (step: WorkflowStep) => {
    switch (step.type) {
      case 'trigger':
        return (
          <div className="space-y-4">
            <div>
              <Label>Trigger Type</Label>
              <Select
                value={step.config.type || ''}
                onValueChange={(value) => updateStepConfig(step.id, { ...step.config, type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select trigger type"/>
                </SelectTrigger>
                <SelectContent>
                  {triggerTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {step.config.type === 'webhook' && (
              <div>
                <Label>Provider</Label>
                <Select
                  value={step.config.provider || ''}
                  onValueChange={(value) => updateStepConfig(step.id, { ...step.config, provider: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select provider"/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="github">GitHub</SelectItem>
                    <SelectItem value="gitlab">GitLab</SelectItem>
                    <SelectItem value="slack">Slack</SelectItem>
                    <SelectItem value="jira">Jira</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {step.config.type === 'schedule' && (
              <div>
                <Label>Cron Expression</Label>
                <Input
                  value={step.config.cron || ''}
                  onChange={(e) => updateStepConfig(step.id, { ...step.config, cron: e.target.value })}
                  placeholder="0 9 * * 1"
                />
                <p className="text-xs text-muted-foreground mt-1">Every Monday at 9 AM</p>
              </div>
            )}
          </div>
        )

      case 'action':
        return (
          <div className="space-y-4">
            <div>
              <Label>Action Type</Label>
              <Select
                value={step.config.type || ''}
                onValueChange={(value) => updateStepConfig(step.id, { ...step.config, type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select action type"/>
                </SelectTrigger>
                <SelectContent>
                  {actionTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Target Provider</Label>
              <Select
                value={step.config.provider || ''}
                onValueChange={(value) => updateStepConfig(step.id, { ...step.config, provider: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select target provider"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="github">GitHub</SelectItem>
                  <SelectItem value="gitlab">GitLab</SelectItem>
                  <SelectItem value="slack">Slack</SelectItem>
                  <SelectItem value="jira">Jira</SelectItem>
                  <SelectItem value="asana">Asana</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Parameters (JSON)</Label>
              <Textarea
                value={JSON.stringify(step.config.params || {}, null, 2)}
                onChange={(e) => {
                  try {
                    const params = safeJsonParse<Record<string, unknown>>(e.target.value) || {}
                    updateStepConfig(step.id, { ...step.config, params })
                  } catch {
                    // Invalid JSON, ignore
                  }
                }}
                placeholder='{"key": "value"}'
                rows={4}/>
            </div>
          </div>
        )

      case 'condition':
        return (
          <div className="space-y-4">
            <div>
              <Label>Field</Label>
              <Input
                value={step.config.field || ''}
                onChange={(e) => updateStepConfig(step.id, { ...step.config, field: e.target.value })}
                placeholder="event.type"/>
            </div>

            <div>
              <Label>Operator</Label>
              <Select
                value={step.config.operator || ''}
                onValueChange={(value) => updateStepConfig(step.id, { ...step.config, operator: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select operator"/>
                </SelectTrigger>
                <SelectContent>
                  {conditionTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Value</Label>
              <Input
                value={step.config.value || ''}
                onChange={(e) => updateStepConfig(step.id, { ...step.config, value: e.target.value })}
                placeholder="pull_request"/>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Zap className="w-5 h-5 mr-2"/>
                Workflow Orchestration
              </CardTitle>
              <CardDescription>
                Create automated workflows that connect your integrations
              </CardDescription>
            </div>
            <Button onClick={() => setIsCreatingWorkflow(true)}>
              <Plus className="w-4 h-4 mr-2"/>
              New Workflow
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="workflows" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="workflows">My Workflows</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
            </TabsList>

            <TabsContent value="workflows" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {workflows.map(workflow => (
                  <Card key={workflow.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{workflow.name}</h3>
                        <Badge variant={workflow.status === 'active' ? 'default' : 'secondary'}>
                          {workflow.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {workflow.description || 'No description'}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {workflow.steps?.length || 0} steps
                        </span>
                        <div className="flex space-x-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => toggleWorkflowStatus(workflow.id)}
                          >
                            {workflow.status === 'active' ? <Pause className="w-3 h-3"/> : <Play className="w-3 h-3"/>}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => executeWorkflow(workflow)}
                            disabled={workflow.status !== 'active'}
                            title="Execute workflow manually"
                          >
                            <ArrowRight className="w-3 h-3"/>
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setSelectedWorkflow(workflow)
                              setWorkflowName(workflow.name)
                              setWorkflowDescription(workflow.description)
                              setWorkflowSteps(workflow.steps || [])
                              setIsCreatingWorkflow(true)
                            }}
                          >
                            <Edit className="w-3 h-3"/>
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteWorkflow(workflow.id)}
                          >
                            <Trash2 className="w-3 h-3"/>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {workflows.length === 0 && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Zap className="w-12 h-12 mx-auto mb-4 text-muted-foreground"/>
                    <h3 className="text-lg font-semibold mb-2">No Workflows Yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Create your first automated workflow to get started
                    </p>
                    <Button onClick={() => setIsCreatingWorkflow(true)}>
                      <Plus className="w-4 h-4 mr-2"/>
                      Create Workflow
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="templates" className="space-y-4">
              <Suspense fallback={<LoadingFallback message="Loading workflow templates..." />}>
                <WorkflowTemplates
                  onUseTemplate={(template: WorkflowTemplate) => {
                    setWorkflowName(template.name)
                    setWorkflowDescription(template.description)
                    setWorkflowSteps(template.steps)
                    setIsCreatingWorkflow(true)
                  }}
                />
              </Suspense>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Workflow Builder Dialog */}
      <Dialog open={isCreatingWorkflow} onOpenChange={setIsCreatingWorkflow}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedWorkflow ? 'Edit Workflow' : 'Create New Workflow'}
            </DialogTitle>
            <DialogDescription>
              Build automated workflows by connecting triggers, actions, and conditions
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Workflow Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="workflow-name">Workflow Name</Label>
                <Input
                  id="workflow-name"
                  value={workflowName}
                  onChange={(e) => setWorkflowName(e.target.value)}
                  placeholder="Enter workflow name"/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="workflow-description">Workflow Description</Label>
                <Textarea
                  id="workflow-description"
                  value={workflowDescription}
                  onChange={(e) => setWorkflowDescription(e.target.value)}
                  placeholder="Describe what this workflow does"/>
              </div>
            </div>

            {/* Step Builder */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Workflow Steps</h3>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" onClick={() => addStep('trigger')}>
                    <Plus className="w-3 h-3 mr-2"/>
                    Add Trigger
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => addStep('action')}>
                    <Plus className="w-3 h-3 mr-2"/>
                    Add Action
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => addStep('condition')}>
                    <Plus className="w-3 h-3 mr-2"/>
                    Add Condition
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                {workflowSteps.map((step, index) => (
                  <Card key={step.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <Badge variant="outline">
                            {step.type === 'trigger' && <Zap className="w-3 h-3 mr-1"/>}
                            {step.type === 'action' && <Play className="w-3 h-3 mr-1"/>}
                            {step.type === 'condition' && <GitBranch className="w-3 h-3 mr-1"/>}
                            {step.type.charAt(0).toUpperCase() + step.type.slice(1)}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            Step {index + 1}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => moveStep(step.id, 'up')}
                            disabled={index === 0}
                          >
                            ↑
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => moveStep(step.id, 'down')}
                            disabled={index === workflowSteps.length - 1}
                          >
                            ↓
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeStep(step.id)}
                          >
                            <Trash2 className="w-3 h-3"/>
                          </Button>
                        </div>
                      </div>

                      {renderStepConfig(step)}
                    </CardContent>
                  </Card>
                ))}

                {workflowSteps.length === 0 && (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <GitBranch className="w-12 h-12 mx-auto mb-4 text-muted-foreground"/>
                      <h3 className="text-lg font-semibold mb-2">No Steps Added</h3>
                      <p className="text-muted-foreground">
                        Start building your workflow by adding triggers, actions, or conditions
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Save/Cancel */}
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => {
                setIsCreatingWorkflow(false)
                setSelectedWorkflow(null)
                setWorkflowName('')
                setWorkflowDescription('')
                setWorkflowSteps([])
              }}>
                Cancel
              </Button>
              <Button onClick={saveWorkflow} disabled={!workflowName.trim()}>
                {selectedWorkflow ? 'Update Workflow' : 'Create Workflow'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Workflow Templates component
export function WorkflowTemplates({ onUseTemplate }: { onUseTemplate: (template: WorkflowTemplate) => void }) {
  const allTemplates: WorkflowTemplate[] = WorkflowTemplateUtils.getAllWorkflowTemplates().map(template => {
    const category = (template as { category?: string }).category
    const mapped: WorkflowTemplate = {
      id: template.id,
      name: template.name,
      description: template.description,
      type: template.type,
      steps: (template.steps ?? []).map((step, index) => convertTemplateStep(step, index))
    }

    if (typeof category === 'string') {
      mapped.category = category
    }

    return mapped
  })

  const getPhaseColor = (phase: string) => {
    const colors = {
      concept: 'bg-blue-100 text-blue-800',
      develop: 'bg-green-100 text-green-800',
      advance: 'bg-yellow-100 text-yellow-800',
      operate: 'bg-red-100 text-red-800',
      reconcile: 'bg-purple-100 text-purple-800',
      archive: 'bg-gray-100 text-gray-800'
    }
    return colors[phase as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getPhaseName = (phase: string) => {
    const names = {
      concept: 'Concept Phase',
      develop: 'Develop Phase',
      advance: 'Advance Phase',
      operate: 'Operate Phase',
      reconcile: 'Reconcile Phase',
      archive: 'Archive Phase'
    }
    return names[phase as keyof typeof names] || phase
  }

  // Group templates by phase
  const groupedTemplates = allTemplates.reduce((acc, template) => {
    // Extract phase from template id or name
    let phase = 'concept'
    if (template.id.includes('develop')) phase = 'develop'
    else if (template.id.includes('advance')) phase = 'advance'
    else if (template.id.includes('operate')) phase = 'operate'
    else if (template.id.includes('reconcile')) phase = 'reconcile'
    else if (template.id.includes('archive')) phase = 'archive'

    if (!acc[phase]) acc[phase] = []
    acc[phase]!.push(template)
    return acc
  }, {} as Record<string, WorkflowTemplate[]>)

  return (
    <div className="space-y-6">
      {Object.entries(groupedTemplates).map(([phase, templates]) => (
        <div key={phase}>
          <h3 className="text-lg font-semibold mb-4 capitalize">{getPhaseName(phase)}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map(template => (
              <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{template.name}</h4>
                    <Badge className={getPhaseColor(phase)}>
                      {phase}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {template.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {template.steps?.length || 0} steps
                    </span>
                    <Button
                      size="sm"
                      onClick={() => onUseTemplate({
                        id: template.id,
                        name: template.name,
                        description: template.description,
                        steps: template.steps || [],
                        category: phase,
                        type: template.type
                      })}
                    >
                      Use Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
export default WorkflowOrchestration
