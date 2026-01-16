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
type PerformanceFormValues = z.infer<typeof performanceSchema>
type FinancialFormValues = z.infer<typeof financialSchema>
type VendorSettlementFormValues = z.infer<typeof vendorSettlementSchema>
type ReportingFormValues = z.infer<typeof reportingSchema>
type LessonsFormValues = z.infer<typeof lessonsSchema>
type DocumentationFormValues = z.infer<typeof documentationSchema>
type CommunicationFormValues = z.infer<typeof communicationSchema>

type ReconcileWizardData = {
  event?: EventFormValues
  performance?: PerformanceFormValues
  financial?: FinancialFormValues
  vendor?: VendorSettlementFormValues
  reporting?: ReportingFormValues
  lessons?: LessonsFormValues
  documentation?: DocumentationFormValues
  communication?: CommunicationFormValues
}

const eventSchema = z.object({
  eventId: z.string().uuid('Event ID must be a valid UUID')
})

const performanceSchema = z.object({
  metric: z.string().min(1),
  target: z.string().optional(),
  actual: z.string().optional(),
  variance: z.string().optional(),
  rating: z.enum(['excellent', 'good', 'satisfactory', 'needs_improvement', 'poor']).default('good'),
  notes: z.string().optional()
})

const financialSchema = z.object({
  category: z.string().min(1),
  budgeted: z.string().min(1),
  actual: z.string().min(1),
  variance: z.string().min(1),
  notes: z.string().optional()
})

const vendorSettlementSchema = z.object({
  vendorName: z.string().min(1),
  contractValue: z.string().min(1),
  finalPayment: z.string().min(1),
  adjustments: z.string().optional(),
  status: z.enum(['pending', 'approved', 'paid']).default('pending'),
  paymentDate: z.string().optional(),
  notes: z.string().optional()
})

const reportingSchema = z.object({
  reportType: z.string().min(1),
  title: z.string().min(1),
  content: z.string().optional(),
  status: z.enum(['draft', 'review', 'approved', 'published']).default('draft'),
  createdBy: z.string().optional(),
  approvedBy: z.string().optional(),
  publishedAt: z.string().optional()
})

const lessonsSchema = z.object({
  category: z.string().min(1),
  lesson: z.string().min(1),
  impact: z.string().optional(),
  recommendation: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
  assignedTo: z.string().optional(),
  status: z.enum(['open', 'in_progress', 'implemented', 'closed']).default('open')
})

const documentationSchema = z.object({
  documentType: z.string().min(1),
  title: z.string().min(1),
  filePath: z.string().optional(),
  status: z.enum(['draft', 'review', 'approved', 'archived']).default('draft'),
  createdBy: z.string().optional(),
  reviewedBy: z.string().optional(),
  archivedAt: z.string().optional()
})

const communicationSchema = z.object({
  stakeholderType: z.string().min(1),
  communicationType: z.string().min(1),
  subject: z.string().min(1),
  content: z.string().optional(),
  sentAt: z.string().optional(),
  sentBy: z.string().optional(),
  status: z.enum(['draft', 'sent', 'delivered', 'read']).default('draft'),
  response: z.string().optional()
})

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
  dataKey: keyof ReconcileWizardData
  defaults: T
  render: (form: ReturnType<typeof useForm<T>>) => React.ReactNode
}) {
  return function Step({ data, onChange, onValidationChange }: StepProps) {
    const existing = (data as ReconcileWizardData)[opts.dataKey] as T | undefined
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

const PerformanceStep = createStep<PerformanceFormValues>({
  schema: performanceSchema,
  dataKey: 'performance',
  defaults: { metric: '', rating: 'good' },
  render: (form) => (
    <>
      {simpleInput('Metric', 'metric', form)}
      {simpleInput('Target', 'target', form, 'number')}
      {simpleInput('Actual', 'actual', form, 'number')}
      {simpleInput('Variance', 'variance', form, 'number')}
      {simpleInput('Rating', 'rating', form)}
      {simpleTextarea('Notes', 'notes', form)}
    </>
  )
})

const FinancialStep = createStep<FinancialFormValues>({
  schema: financialSchema,
  dataKey: 'financial',
  defaults: { category: '', budgeted: '', actual: '', variance: '' },
  render: (form) => (
    <>
      {simpleInput('Category', 'category', form)}
      {simpleInput('Budgeted', 'budgeted', form, 'number')}
      {simpleInput('Actual', 'actual', form, 'number')}
      {simpleInput('Variance', 'variance', form, 'number')}
      {simpleTextarea('Notes', 'notes', form)}
    </>
  )
})

const VendorSettlementStep = createStep<VendorSettlementFormValues>({
  schema: vendorSettlementSchema,
  dataKey: 'vendor',
  defaults: { vendorName: '', contractValue: '', finalPayment: '', status: 'pending' },
  render: (form) => (
    <>
      {simpleInput('Vendor Name', 'vendorName', form)}
      {simpleInput('Contract Value', 'contractValue', form, 'number')}
      {simpleInput('Final Payment', 'finalPayment', form, 'number')}
      {simpleInput('Adjustments', 'adjustments', form, 'number')}
      {simpleInput('Status', 'status', form)}
      {simpleInput('Payment Date', 'paymentDate', form, 'datetime-local')}
      {simpleTextarea('Notes', 'notes', form)}
    </>
  )
})

const ReportingStep = createStep<ReportingFormValues>({
  schema: reportingSchema,
  dataKey: 'reporting',
  defaults: { reportType: '', title: '', status: 'draft' },
  render: (form) => (
    <>
      {simpleInput('Report Type', 'reportType', form)}
      {simpleInput('Title', 'title', form)}
      {simpleTextarea('Content', 'content', form)}
      {simpleInput('Status', 'status', form)}
      {simpleInput('Created By', 'createdBy', form)}
      {simpleInput('Approved By', 'approvedBy', form)}
      {simpleInput('Published At', 'publishedAt', form, 'datetime-local')}
    </>
  )
})

const LessonsStep = createStep<LessonsFormValues>({
  schema: lessonsSchema,
  dataKey: 'lessons',
  defaults: { category: '', lesson: '', priority: 'medium', status: 'open' },
  render: (form) => (
    <>
      {simpleInput('Category', 'category', form)}
      {simpleTextarea('Lesson', 'lesson', form, 4)}
      {simpleTextarea('Impact', 'impact', form)}
      {simpleTextarea('Recommendation', 'recommendation', form)}
      {simpleInput('Priority', 'priority', form)}
      {simpleInput('Assigned To', 'assignedTo', form)}
      {simpleInput('Status', 'status', form)}
    </>
  )
})

const DocumentationStep = createStep<DocumentationFormValues>({
  schema: documentationSchema,
  dataKey: 'documentation',
  defaults: { documentType: '', title: '', status: 'draft' },
  render: (form) => (
    <>
      {simpleInput('Document Type', 'documentType', form)}
      {simpleInput('Title', 'title', form)}
      {simpleInput('File Path', 'filePath', form)}
      {simpleInput('Status', 'status', form)}
      {simpleInput('Created By', 'createdBy', form)}
      {simpleInput('Reviewed By', 'reviewedBy', form)}
      {simpleInput('Archived At', 'archivedAt', form, 'datetime-local')}
    </>
  )
})

const CommunicationStep = createStep<CommunicationFormValues>({
  schema: communicationSchema,
  dataKey: 'communication',
  defaults: { stakeholderType: '', communicationType: '', subject: '', status: 'draft' },
  render: (form) => (
    <>
      {simpleInput('Stakeholder Type', 'stakeholderType', form)}
      {simpleInput('Communication Type', 'communicationType', form)}
      {simpleInput('Subject', 'subject', form)}
      {simpleTextarea('Content', 'content', form)}
      {simpleInput('Sent At', 'sentAt', form, 'datetime-local')}
      {simpleInput('Sent By', 'sentBy', form)}
      {simpleInput('Status', 'status', form)}
      {simpleTextarea('Response', 'response', form)}
    </>
  )
})

const steps = [
  { id: 'event', title: 'Event Context', description: 'Provide event reference', component: EventStep },
  { id: 'performance', title: 'Performance Analysis', description: 'Metrics and variance', component: PerformanceStep },
  { id: 'financial', title: 'Financial Reconciliation', description: 'Budget vs actuals', component: FinancialStep },
  { id: 'vendor', title: 'Vendor Settlements', description: 'Contracts and final payments', component: VendorSettlementStep },
  { id: 'reporting', title: 'Final Reporting', description: 'Reports and approvals', component: ReportingStep },
  { id: 'lessons', title: 'Lessons Learned', description: 'Capture lessons and actions', component: LessonsStep },
  { id: 'documentation', title: 'Documentation', description: 'Docs and statuses', component: DocumentationStep },
  { id: 'communication', title: 'Stakeholder Communications', description: 'Outreach and responses', component: CommunicationStep }
]

export default function ReconcilePhaseWorkflow() {
  const [isSaving, setIsSaving] = useState(false)

  const handleWizardComplete = useCallback(async (finalData: Record<string, unknown>) => {
    try {
      setIsSaving(true)
      const data = finalData as ReconcileWizardData
      const { data: userData, error: userError } = await supabase.auth.getUser()
      if (userError || !userData?.user?.id) throw new Error('User not authenticated')

      if (!data.event?.eventId) throw new Error('Event ID is required')
      const eventId = data.event.eventId

      if (data.performance) {
        const p = data.performance
        const { error } = await supabase.from('reconcile_performance_analysis').insert({
          event_id: eventId,
          metric: p.metric,
          target: p.target ? Number(p.target) : null,
          actual: p.actual ? Number(p.actual) : null,
          variance: p.variance ? Number(p.variance) : null,
          rating: p.rating,
          notes: p.notes || null
        })
        if (error) throw error
      }

      if (data.financial) {
        const f = data.financial
        const { error } = await supabase.from('reconcile_financial_reconciliation').insert({
          event_id: eventId,
          category: f.category,
          budgeted: Number(f.budgeted),
          actual: Number(f.actual),
          variance: Number(f.variance),
          notes: f.notes || null
        })
        if (error) throw error
      }

      if (data.vendor) {
        const v = data.vendor
        const { error } = await supabase.from('reconcile_vendor_settlements').insert({
          event_id: eventId,
          vendor_name: v.vendorName,
          contract_value: Number(v.contractValue),
          final_payment: Number(v.finalPayment),
          adjustments: v.adjustments ? Number(v.adjustments) : 0,
          status: v.status,
          payment_date: v.paymentDate || null,
          notes: v.notes || null
        })
        if (error) throw error
      }

      if (data.reporting) {
        const r = data.reporting
        const { error } = await supabase.from('reconcile_final_reporting').insert({
          event_id: eventId,
          report_type: r.reportType,
          title: r.title,
          content: r.content || null,
          status: r.status,
          created_by: r.createdBy || null,
          approved_by: r.approvedBy || null,
          published_at: r.publishedAt || null
        })
        if (error) throw error
      }

      if (data.lessons) {
        const l = data.lessons
        const { error } = await supabase.from('reconcile_lessons_learned').insert({
          event_id: eventId,
          category: l.category,
          lesson: l.lesson,
          impact: l.impact || null,
          recommendation: l.recommendation || null,
          priority: l.priority,
          assigned_to: l.assignedTo || null,
          status: l.status
        })
        if (error) throw error
      }

      if (data.documentation) {
        const d = data.documentation
        const { error } = await supabase.from('reconcile_documentation').insert({
          event_id: eventId,
          document_type: d.documentType,
          title: d.title,
          file_path: d.filePath || null,
          status: d.status,
          created_by: d.createdBy || null,
          reviewed_by: d.reviewedBy || null,
          archived_at: d.archivedAt || null
        })
        if (error) throw error
      }

      if (data.communication) {
        const c = data.communication
        const { error } = await supabase.from('reconcile_stakeholder_communications').insert({
          event_id: eventId,
          stakeholder_type: c.stakeholderType,
          communication_type: c.communicationType,
          subject: c.subject,
          content: c.content || null,
          sent_at: c.sentAt || null,
          sent_by: c.sentBy || null,
          status: c.status,
          response: c.response || null
        })
        if (error) throw error
      }
    } catch (error) {
      logger.error('Reconcile phase workflow save failed', error)
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
          <h1 className="text-3xl font-bold">Reconcile Phase</h1>
          <p className="text-muted-foreground mt-2">
            Analyze performance, reconcile finances, and document lessons learned
          </p>
        </div>

        <MultiStepWizard
          steps={steps}
          onComplete={handleWizardComplete}
          initialData={initialData}
          className="max-w-6xl mx-auto"
          autoSave
          persistenceKey="reconcile-phase-workflow"
        />
        {isSaving && <p className="mt-4 text-sm text-muted-foreground">Saving reconcile records...</p>}
      </div>
    </div>
  )
}
