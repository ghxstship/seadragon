"use client"

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useForm, type DefaultValues } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { MultiStepWizard, type StepProps } from '@/components/forms/multi-step-wizard'
import { supabase } from '@/lib/supabase'
import { logger } from '@/lib/logger'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

type EventFormValues = z.infer<typeof eventSchema>
type DesignFormValues = z.infer<typeof designSchema>
type ComponentFormValues = z.infer<typeof componentSchema>
type InstanceFormValues = z.infer<typeof instanceSchema>
type LogFormValues = z.infer<typeof logSchema>
type IntegrationFormValues = z.infer<typeof integrationSchema>
type MonitoringFormValues = z.infer<typeof monitoringSchema>
type AlertFormValues = z.infer<typeof alertSchema>
type TicketFormValues = z.infer<typeof ticketSchema>
type KnowledgeFormValues = z.infer<typeof knowledgeSchema>

type CustomWorkflowWizardData = {
  event?: EventFormValues
  design?: DesignFormValues
  component?: ComponentFormValues
  instance?: InstanceFormValues
  log?: LogFormValues
  integration?: IntegrationFormValues
  monitoring?: MonitoringFormValues
  alert?: AlertFormValues
  ticket?: TicketFormValues
  knowledge?: KnowledgeFormValues
}

const eventSchema = z.object({
  eventId: z.string().uuid('Event ID must be a valid UUID')
})

const designSchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  description: z.string().optional(),
  steps: z.coerce.number().int().nonnegative().optional(),
  usageCount: z.coerce.number().int().nonnegative().optional(),
  status: z.enum(['active', 'draft', 'deprecated']).default('draft'),
  components: z.string().optional(),
  validationRules: z.string().optional(),
  testingScenarios: z.string().optional(),
  integrations: z.string().optional(),
  monitoringAlerts: z.string().optional()
})

const componentSchema = z.object({
  componentType: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
  inputs: z.string().optional(),
  outputs: z.string().optional(),
  version: z.string().min(1),
  compatibility: z.string().optional(),
  config: z.string().optional()
})

const instanceSchema = z.object({
  workflowName: z.string().min(1),
  status: z.enum(['running', 'completed', 'failed', 'paused', 'cancelled']).default('running'),
  startedAt: z.string().optional(),
  completedAt: z.string().optional(),
  currentStep: z.coerce.number().int().nonnegative().optional(),
  variables: z.string().optional(),
  metadata: z.string().optional()
})

const logSchema = z.object({
  stepNumber: z.coerce.number().int().nonnegative(),
  stepName: z.string().min(1),
  status: z.enum(['started', 'completed', 'failed', 'skipped']),
  inputData: z.string().optional(),
  outputData: z.string().optional(),
  errorMessage: z.string().optional(),
  durationMs: z.coerce.number().int().nonnegative().optional()
})

const integrationSchema = z.object({
  systemName: z.string().min(1),
  apiEndpoint: z.string().min(1),
  requestData: z.string().optional(),
  responseData: z.string().optional(),
  status: z.enum(['success', 'failed', 'pending']),
  executedAt: z.string().optional(),
  durationMs: z.coerce.number().int().nonnegative().optional()
})

const monitoringSchema = z.object({
  metricName: z.string().min(1),
  metricValue: z.coerce.number().optional(),
  recordedAt: z.string().optional()
})

const alertSchema = z.object({
  alertType: z.string().min(1),
  condition: z.string().min(1),
  severity: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
  message: z.string().optional(),
  triggeredAt: z.string().optional(),
  resolvedAt: z.string().optional(),
  status: z.enum(['active', 'acknowledged', 'resolved']).default('active')
})

const ticketSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
  status: z.enum(['open', 'in_progress', 'resolved', 'closed']).default('open'),
  assignedTo: z.string().optional(),
  createdBy: z.string().optional(),
  resolvedAt: z.string().optional()
})

const knowledgeSchema = z.object({
  kbTitle: z.string().min(1),
  content: z.string().optional(),
  category: z.string().min(1),
  tags: z.string().optional(),
  views: z.coerce.number().int().nonnegative().optional(),
  helpfulVotes: z.coerce.number().int().nonnegative().optional(),
  createdBy: z.string().optional()
})

const parseCsv = (value?: string) =>
  value ? value.split(',').map((v) => v.trim()).filter((v) => v.length > 0) : null

function simpleInput(label: string, name: keyof any, form: any, type?: string) {
  return (
    <FormField
      control={form.control}
      name={name as never}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input type={type} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

function simpleTextarea(label: string, name: keyof any, form: any, rows = 3) {
  return (
    <FormField
      control={form.control}
      name={name as never}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Textarea rows={rows} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

function createStep<T extends Record<string, unknown>>(opts: {
  schema: z.ZodSchema
  dataKey: keyof CustomWorkflowWizardData
  defaults: T
  render: (form: ReturnType<typeof useForm<T>>) => React.ReactNode
}) {
  return function Step({ data, onChange, onValidationChange }: StepProps) {
    const existing = (data as CustomWorkflowWizardData)[opts.dataKey] as T | undefined
    const form = useForm<T>({
      resolver: zodResolver(opts.schema),
      defaultValues: (existing ?? opts.defaults) as DefaultValues<T>
    })

    useEffect(() => {
      const subscription = form.watch((values) => {
        onChange({ ...data, [opts.dataKey]: values })
        onValidationChange?.(form.formState.isValid)
      })
      return () => {
        if (typeof subscription === 'object' && subscription && 'unsubscribe' in subscription) {
          ;(subscription as { unsubscribe: () => void }).unsubscribe()
        }
      }
    }, [form, data, onChange, onValidationChange])

    return (
      <Form {...form}>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4">{opts.render(form)}</form>
      </Form>
    )
  }
}

const EventStep = createStep<EventFormValues>({
  schema: eventSchema,
  dataKey: 'event',
  defaults: { eventId: '' },
  render: (form) => <>{simpleInput('Event ID', 'eventId', form)}</>
})

const DesignStep = createStep<DesignFormValues>({
  schema: designSchema,
  dataKey: 'design',
  defaults: { name: '', category: '', status: 'draft' },
  render: (form) => (
    <>
      {simpleInput('Name', 'name', form)}
      {simpleInput('Category', 'category', form)}
      {simpleTextarea('Description', 'description', form)}
      {simpleInput('Steps', 'steps', form, 'number')}
      {simpleInput('Usage Count', 'usageCount', form, 'number')}
      {simpleInput('Status', 'status', form)}
      {simpleTextarea('Components (comma separated)', 'components', form)}
      {simpleTextarea('Validation Rules (JSON/CSV)', 'validationRules', form)}
      {simpleTextarea('Testing Scenarios (JSON/CSV)', 'testingScenarios', form)}
      {simpleTextarea('Integrations (JSON/CSV)', 'integrations', form)}
      {simpleTextarea('Monitoring Alerts (JSON/CSV)', 'monitoringAlerts', form)}
    </>
  )
})

const ComponentStep = createStep<ComponentFormValues>({
  schema: componentSchema,
  dataKey: 'component',
  defaults: { componentType: '', name: '', version: '' },
  render: (form) => (
    <>
      {simpleInput('Component Type', 'componentType', form)}
      {simpleInput('Name', 'name', form)}
      {simpleTextarea('Description', 'description', form)}
      {simpleTextarea('Inputs (comma separated)', 'inputs', form)}
      {simpleTextarea('Outputs (comma separated)', 'outputs', form)}
      {simpleInput('Version', 'version', form)}
      {simpleTextarea('Compatibility (comma separated)', 'compatibility', form)}
      {simpleTextarea('Config (JSON)', 'config', form)}
    </>
  )
})

const InstanceStep = createStep<InstanceFormValues>({
  schema: instanceSchema,
  dataKey: 'instance',
  defaults: { workflowName: '', status: 'running' },
  render: (form) => (
    <>
      {simpleInput('Workflow Name', 'workflowName', form)}
      {simpleInput('Status', 'status', form)}
      {simpleInput('Started At', 'startedAt', form, 'datetime-local')}
      {simpleInput('Completed At', 'completedAt', form, 'datetime-local')}
      {simpleInput('Current Step', 'currentStep', form, 'number')}
      {simpleTextarea('Variables (JSON)', 'variables', form)}
      {simpleTextarea('Metadata (JSON)', 'metadata', form)}
    </>
  )
})

const LogStep = createStep<LogFormValues>({
  schema: logSchema,
  dataKey: 'log',
  defaults: { stepNumber: 0, stepName: '', status: 'started' as const },
  render: (form) => (
    <>
      {simpleInput('Step Number', 'stepNumber', form, 'number')}
      {simpleInput('Step Name', 'stepName', form)}
      {simpleInput('Status', 'status', form)}
      {simpleTextarea('Input Data (JSON)', 'inputData', form)}
      {simpleTextarea('Output Data (JSON)', 'outputData', form)}
      {simpleTextarea('Error Message', 'errorMessage', form)}
      {simpleInput('Duration (ms)', 'durationMs', form, 'number')}
    </>
  )
})

const IntegrationStep = createStep<IntegrationFormValues>({
  schema: integrationSchema,
  dataKey: 'integration',
  defaults: { systemName: '', apiEndpoint: '', status: 'pending' },
  render: (form) => (
    <>
      {simpleInput('System Name', 'systemName', form)}
      {simpleInput('API Endpoint', 'apiEndpoint', form)}
      {simpleTextarea('Request Data (JSON)', 'requestData', form)}
      {simpleTextarea('Response Data (JSON)', 'responseData', form)}
      {simpleInput('Status', 'status', form)}
      {simpleInput('Executed At', 'executedAt', form, 'datetime-local')}
      {simpleInput('Duration (ms)', 'durationMs', form, 'number')}
    </>
  )
})

const MonitoringStep = createStep<MonitoringFormValues & AlertFormValues>({
  schema: monitoringSchema.merge(alertSchema),
  dataKey: 'monitoring',
  defaults: {
    metricName: '',
    alertType: '',
    condition: '',
    severity: 'medium',
    status: 'active'
  } as unknown as MonitoringFormValues & AlertFormValues,
  render: (form) => (
    <>
      <div className="md:col-span-2 text-sm font-semibold">Performance Metric</div>
      {simpleInput('Metric Name', 'metricName', form)}
      {simpleInput('Metric Value', 'metricValue', form, 'number')}
      {simpleInput('Recorded At', 'recordedAt', form, 'datetime-local')}

      <div className="md:col-span-2 text-sm font-semibold mt-2">Alert</div>
      {simpleInput('Alert Type', 'alertType', form)}
      {simpleTextarea('Condition', 'condition', form)}
      {simpleInput('Severity', 'severity', form)}
      {simpleTextarea('Message', 'message', form)}
      {simpleInput('Triggered At', 'triggeredAt', form, 'datetime-local')}
      {simpleInput('Resolved At', 'resolvedAt', form, 'datetime-local')}
      {simpleInput('Alert Status', 'status', form)}
    </>
  )
})

const SupportStep = createStep<TicketFormValues & KnowledgeFormValues>({
  schema: ticketSchema.merge(knowledgeSchema),
  dataKey: 'ticket',
  defaults: {
    title: '',
    priority: 'medium',
    status: 'open',
    kbTitle: '',
    category: ''
  } as unknown as TicketFormValues & KnowledgeFormValues,
  render: (form) => (
    <>
      <div className="md:col-span-2 text-sm font-semibold">Support Ticket</div>
      {simpleInput('Title', 'title', form)}
      {simpleTextarea('Description', 'description', form, 4)}
      {simpleInput('Priority', 'priority', form)}
      {simpleInput('Status', 'status', form)}
      {simpleInput('Assigned To', 'assignedTo', form)}
      {simpleInput('Created By', 'createdBy', form)}
      {simpleInput('Resolved At', 'resolvedAt', form, 'datetime-local')}

      <div className="md:col-span-2 text-sm font-semibold mt-2">Knowledge Base</div>
      {simpleInput('Title', 'kbTitle', form)}
      {simpleTextarea('Content', 'content', form, 4)}
      {simpleInput('Category', 'category', form)}
      {simpleTextarea('Tags (comma separated)', 'tags', form)}
      {simpleInput('Views', 'views', form, 'number')}
      {simpleInput('Helpful Votes', 'helpfulVotes', form, 'number')}
      {simpleInput('Created By (KB)', 'createdBy', form)}
    </>
  )
})

const steps = [
  { id: 'event', title: 'Event Context', description: 'Provide event reference', component: EventStep },
  { id: 'design', title: 'Workflow Design', description: 'Design template metadata', component: DesignStep },
  { id: 'component', title: 'Components', description: 'Reusable components', component: ComponentStep },
  { id: 'instance', title: 'Execution Instance', description: 'Instance details and variables', component: InstanceStep },
  { id: 'log', title: 'Execution Log', description: 'Log step activity', component: LogStep },
  { id: 'integration', title: 'Integrations', description: 'External system calls', component: IntegrationStep },
  { id: 'monitoring', title: 'Monitoring & Alerts', description: 'Metrics and alerts', component: MonitoringStep },
  { id: 'support', title: 'Support & Knowledge', description: 'Tickets and KB entries', component: SupportStep }
]

export default function CustomWorkflowEngineWorkflow() {
  const [isSaving, setIsSaving] = useState(false)

  const handleWizardComplete = useCallback(async (finalData: Record<string, unknown>) => {
    try {
      setIsSaving(true)
      const data = finalData as CustomWorkflowWizardData
      const { data: userData, error: userError } = await supabase.auth.getUser()
      if (userError || !userData?.user?.id) throw new Error('User not authenticated')

      if (!data.event?.eventId) throw new Error('Event ID is required')
      const eventId = data.event.eventId

      let designId: string | undefined
      if (data.design) {
        const d = data.design
        const { data: designRow, error } = await supabase
          .from('custom_workflow_design_templates')
          .insert({
            event_id: eventId,
            name: d.name,
            category: d.category,
            description: d.description || null,
            steps: d.steps ?? 0,
            usage_count: d.usageCount ?? 0,
            status: d.status,
            components: d.components ? parseCsv(d.components) : [],
            validation_rules: d.validationRules ? JSON.parse(JSON.stringify(d.validationRules)) : [],
            testing_scenarios: d.testingScenarios ? JSON.parse(JSON.stringify(d.testingScenarios)) : [],
            integrations: d.integrations ? JSON.parse(JSON.stringify(d.integrations)) : [],
            monitoring_alerts: d.monitoringAlerts ? JSON.parse(JSON.stringify(d.monitoringAlerts)) : []
          })
          .select('id')
          .single()
        if (error) throw error
        designId = designRow.id
      }

      if (data.component) {
        const c = data.component
        const { error } = await supabase.from('custom_workflow_design_components').insert({
          event_id: eventId,
          component_type: c.componentType,
          name: c.name,
          description: c.description || null,
          inputs: c.inputs ? parseCsv(c.inputs) : null,
          outputs: c.outputs ? parseCsv(c.outputs) : null,
          version: c.version,
          compatibility: c.compatibility ? parseCsv(c.compatibility) : null,
          config: c.config ? JSON.parse(JSON.stringify(c.config)) : {}
        })
        if (error) throw error
      }

      let instanceId: string | undefined
      if (data.instance) {
        const i = data.instance
        const { data: instanceRow, error } = await supabase
          .from('custom_workflow_execution_instances')
          .insert({
            event_id: eventId,
            workflow_id: designId || null,
            name: i.workflowName,
            status: i.status,
            started_at: i.startedAt || null,
            completed_at: i.completedAt || null,
            current_step: i.currentStep ?? 0,
            variables: i.variables ? JSON.parse(JSON.stringify(i.variables)) : {},
            metadata: i.metadata ? JSON.parse(JSON.stringify(i.metadata)) : {}
          })
          .select('id')
          .single()
        if (error) throw error
        instanceId = instanceRow.id
      }

      if (data.log && instanceId) {
        const l = data.log
        const { error } = await supabase.from('custom_workflow_execution_logs').insert({
          event_id: eventId,
          instance_id: instanceId,
          step_number: l.stepNumber,
          step_name: l.stepName,
          status: l.status,
          input_data: l.inputData ? JSON.parse(JSON.stringify(l.inputData)) : {},
          output_data: l.outputData ? JSON.parse(JSON.stringify(l.outputData)) : {},
          error_message: l.errorMessage || null,
          duration_ms: l.durationMs ?? null
        })
        if (error) throw error
      }

      if (data.integration && instanceId) {
        const g = data.integration
        const { error } = await supabase.from('custom_workflow_execution_integrations').insert({
          event_id: eventId,
          instance_id: instanceId,
          system_name: g.systemName,
          api_endpoint: g.apiEndpoint,
          request_data: g.requestData ? JSON.parse(JSON.stringify(g.requestData)) : {},
          response_data: g.responseData ? JSON.parse(JSON.stringify(g.responseData)) : {},
          status: g.status,
          executed_at: g.executedAt || null,
          duration_ms: g.durationMs ?? null
        })
        if (error) throw error
      }

      if (data.monitoring) {
        const m = data.monitoring as MonitoringFormValues
        const a = data.monitoring as unknown as AlertFormValues
        const { error } = await supabase.from('custom_workflow_monitoring_performance').insert({
          event_id: eventId,
          workflow_id: designId || null,
          instance_id: null,
          metric_name: m.metricName,
          metric_value: m.metricValue ?? null,
          recorded_at: m.recordedAt || null
        })
        if (error) throw error

        const { error: alertError } = await supabase.from('custom_workflow_monitoring_alerts').insert({
          event_id: eventId,
          workflow_id: designId || null,
          alert_type: a.alertType,
          condition: a.condition,
          severity: a.severity,
          message: a.message || null,
          triggered_at: a.triggeredAt || null,
          resolved_at: a.resolvedAt || null,
          status: a.status
        })
        if (alertError) throw alertError
      }

      if (data.ticket) {
        const t = data.ticket as TicketFormValues
        const k = data.ticket as unknown as KnowledgeFormValues
        const { error } = await supabase.from('custom_workflow_support_tickets').insert({
          event_id: eventId,
          workflow_id: designId || null,
          instance_id: null,
          title: t.title,
          description: t.description || null,
          priority: t.priority,
          status: t.status,
          assigned_to: t.assignedTo || null,
          created_by: t.createdBy || null,
          resolved_at: t.resolvedAt || null
        })
        if (error) throw error

        const { error: kbError } = await supabase.from('custom_workflow_support_knowledge_base').insert({
          event_id: eventId,
          title: k.kbTitle,
          content: k.content || null,
          category: k.category,
          tags: k.tags ? parseCsv(k.tags) : null,
          views: k.views ?? 0,
          helpful_votes: k.helpfulVotes ?? 0,
          created_by: k.createdBy || null
        })
        if (kbError) throw kbError
      }
    } catch (error) {
      logger.error('Custom workflow engine save failed', error)
      throw error
    } finally {
      setIsSaving(false)
    }
  }, [])

  const initialData = useMemo(() => ({}), [])

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Custom Workflow Engine Workflow</h1>
          <p className="text-muted-foreground mt-2">
            Design, configure, test, deploy, and govern custom workflow engines with full auditability.
          </p>
        </div>

        <MultiStepWizard
          steps={steps}
          onComplete={handleWizardComplete}
          initialData={initialData}
          className="max-w-6xl mx-auto"
          autoSave
          persistenceKey="custom-workflow-engine-workflow"
        />
        {isSaving && <p className="mt-4 text-sm text-muted-foreground">Saving custom workflow engine records...</p>}
      </div>
    </div>
  )
}
