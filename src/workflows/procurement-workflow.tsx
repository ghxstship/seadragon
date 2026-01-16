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

type RequestFormValues = z.infer<typeof requestSchema>
type ItemFormValues = z.infer<typeof itemSchema>
type ApprovalFormValues = z.infer<typeof approvalSchema>
type StatusFormValues = z.infer<typeof statusSchema>

type ProcurementWizardData = {
  request?: RequestFormValues
  item?: ItemFormValues
  approval?: ApprovalFormValues
  status?: StatusFormValues
}

const requestSchema = z.object({
  eventId: z.string().min(1, 'Event ID is required'),
  title: z.string().min(1),
  description: z.string().optional(),
  category: z.enum(['equipment', 'supplies', 'services', 'software', 'facilities', 'other']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  estimatedCost: z.coerce.number().nonnegative(),
  currency: z.string().min(1),
  vendorName: z.string().optional(),
  vendorContact: z.string().optional(),
  justification: z.string().optional(),
  requiredBy: z.string().optional()
})

const itemSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  quantity: z.coerce.number().int().positive(),
  unitPrice: z.coerce.number().nonnegative()
})

const approvalSchema = z.object({
  workflowName: z.string().optional(),
  workflowDescription: z.string().optional(),
  levelNumber: z.coerce.number().int().positive(),
  levelName: z.string().optional(),
  approverId: z.string().optional(),
  dueDate: z.string().optional()
})

const statusSchema = z.object({
  advanceStatus: z.enum(['draft', 'pending', 'approved', 'ordered', 'received']),
  comments: z.string().optional()
})

function createStep<T extends Record<string, unknown>>(opts: {
  schema: z.ZodType<T>
  dataKey: keyof ProcurementWizardData
  defaults: T
  render: (form: ReturnType<typeof useForm<T>>) => React.ReactNode
}) {
  return function Step({ data, onChange, onValidationChange }: StepProps) {
    const existing = (data as ProcurementWizardData)[opts.dataKey] as T | undefined
    const form = useForm<T>({ resolver: zodResolver(opts.schema), defaultValues: (existing ?? opts.defaults) as DefaultValues<T> })

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

    return <Form {...form}><form className="grid grid-cols-1 md:grid-cols-2 gap-4">{opts.render(form)}</form></Form>
  }
}

const RequestStep = createStep<RequestFormValues>({
  schema: requestSchema,
  dataKey: 'request',
  defaults: {
    eventId: '',
    title: '',
    category: 'equipment',
    priority: 'medium',
    estimatedCost: 0,
    currency: 'USD',
    vendorName: '',
    vendorContact: '',
    justification: '',
    requiredBy: ''
  },
  render: (form) => (
    <>
      <FormField control={form.control} name={'eventId' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Event ID</FormLabel>
          <FormControl><Input placeholder="UUID" {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'title' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Title</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'category' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Category</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'priority' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Priority</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'estimatedCost' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Estimated Cost</FormLabel>
          <FormControl><Input type="number" step="0.01" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'currency' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Currency</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'requiredBy' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Required By</FormLabel>
          <FormControl><Input type="date" {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'vendorName' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Vendor Name</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'vendorContact' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Vendor Contact</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'justification' as never} render={({ field }) => (
        <FormItem className="md:col-span-2">
          <FormLabel>Justification</FormLabel>
          <FormControl><Textarea rows={3} {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'description' as never} render={({ field }) => (
        <FormItem className="md:col-span-2">
          <FormLabel>Description</FormLabel>
          <FormControl><Textarea rows={3} {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
    </>
  )
})

const ItemStep = createStep<ItemFormValues>({
  schema: itemSchema,
  dataKey: 'item',
  defaults: { name: '', description: '', quantity: 1, unitPrice: 0 },
  render: (form) => (
    <>
      <FormField control={form.control} name={'name' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Item Name</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'description' as never} render={({ field }) => (
        <FormItem className="md:col-span-2">
          <FormLabel>Description</FormLabel>
          <FormControl><Textarea rows={3} {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'quantity' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Quantity</FormLabel>
          <FormControl><Input type="number" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'unitPrice' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Unit Price</FormLabel>
          <FormControl><Input type="number" step="0.01" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
    </>
  )
})

const ApprovalStep = createStep<ApprovalFormValues>({
  schema: approvalSchema,
  dataKey: 'approval',
  defaults: { workflowName: '', workflowDescription: '', levelNumber: 1, levelName: '', approverId: '', dueDate: '' },
  render: (form) => (
    <>
      <FormField control={form.control} name={'workflowName' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Workflow Name</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'workflowDescription' as never} render={({ field }) => (
        <FormItem className="md:col-span-2">
          <FormLabel>Workflow Description</FormLabel>
          <FormControl><Textarea rows={3} {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'levelNumber' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Level Number</FormLabel>
          <FormControl><Input type="number" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'levelName' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Level Name</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'approverId' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Approver User ID</FormLabel>
          <FormControl><Input placeholder="auth.users UUID" {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'dueDate' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Approval Due Date</FormLabel>
          <FormControl><Input type="datetime-local" {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
    </>
  )
})

const StatusStep = createStep<StatusFormValues>({
  schema: statusSchema,
  dataKey: 'status',
  defaults: { advanceStatus: 'pending', comments: '' },
  render: (form) => (
    <>
      <FormField control={form.control} name={'advanceStatus' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Set Request Status</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'comments' as never} render={({ field }) => (
        <FormItem className="md:col-span-2">
          <FormLabel>Comments</FormLabel>
          <FormControl><Textarea rows={3} {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
    </>
  )
})

const steps = [
  { id: 'request', title: 'Demand & Intake', description: 'Capture procurement request', component: RequestStep },
  { id: 'items', title: 'Line Item', description: 'Define item and pricing', component: ItemStep },
  { id: 'approvals', title: 'Approvals', description: 'Setup approval workflow', component: ApprovalStep },
  { id: 'status', title: 'Status & Closeout', description: 'Set status and comments', component: StatusStep }
]

export default function ProcurementWorkflow() {
  const [isSaving, setIsSaving] = useState(false)

  const handleWizardComplete = useCallback(async (finalData: Record<string, unknown>) => {
    try {
      setIsSaving(true)
      const data = finalData as ProcurementWizardData
      const { data: userData, error: userError } = await supabase.auth.getUser()
      if (userError || !userData?.user?.id) throw new Error('User not authenticated')
      const requesterId = userData.user.id

      if (!data.request) throw new Error('Request step is required')

      const { data: requestInsert, error: requestError } = await supabase
        .from('procurement_requests')
        .insert({
          event_id: data.request.eventId,
          requester_id: requesterId,
          title: data.request.title,
          description: data.request.description,
          category: data.request.category,
          priority: data.request.priority,
          estimated_cost: data.request.estimatedCost,
          currency: data.request.currency,
          vendor_name: data.request.vendorName,
          vendor_contact: data.request.vendorContact,
          justification: data.request.justification,
          required_by: data.request.requiredBy || null,
          status: 'pending'
        })
        .select('id, event_id')
        .single()

      if (requestError) throw requestError
      const requestId = requestInsert?.id as string
      const eventId = requestInsert?.event_id as string

      if (data.item) {
        const { error } = await supabase.from('procurement_request_items').insert({
          request_id: requestId,
          name: data.item.name,
          description: data.item.description,
          quantity: data.item.quantity,
          unit_price: data.item.unitPrice,
          total_price: data.item.quantity * data.item.unitPrice
        })
        if (error) throw error
      }

      let approvalLevelId: string | undefined
      if (data.approval && (data.approval.workflowName || data.approval.approverId)) {
        const { data: workflowRow, error: workflowError } = await supabase
          .from('procurement_approval_workflows')
          .insert({
            event_id: eventId,
            name: data.approval.workflowName || 'Default Workflow',
            description: data.approval.workflowDescription
          })
          .select('id')
          .single()
        if (workflowError) throw workflowError

        const workflowId = workflowRow?.id as string
        const { data: levelRow, error: levelError } = await supabase
          .from('procurement_approval_workflow_levels')
          .insert({
            workflow_id: workflowId,
            level_number: data.approval.levelNumber,
            name: data.approval.levelName || `Level ${data.approval.levelNumber}`,
            required_approvals: 1
          })
          .select('id')
          .single()
        if (levelError) throw levelError
        approvalLevelId = levelRow?.id as string

        if (data.approval.approverId) {
          const { error: approverError } = await supabase
            .from('procurement_approval_workflow_approvers')
            .insert({
              level_id: approvalLevelId,
              approver_id: data.approval.approverId
            })
          if (approverError) throw approverError

          const { error: approvalError } = await supabase
            .from('procurement_request_approvals')
            .insert({
              request_id: requestId,
              level_id: approvalLevelId,
              approver_id: data.approval.approverId,
              status: 'pending',
              due_date: data.approval.dueDate || null
            })
          if (approvalError) throw approvalError
        }
      }

      if (data.status) {
        const { error } = await supabase
          .from('procurement_requests')
          .update({ status: data.status.advanceStatus, justification: data.status.comments })
          .eq('id', requestId)
        if (error) throw error
      }

    } catch (error) {
      logger.error('Procurement workflow save failed', error)
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
          <h1 className="text-3xl font-bold">Procurement Workflow</h1>
          <p className="text-muted-foreground mt-2">
            Standardize procurement from intake through approvals and status tracking with Supabase persistence.
          </p>
        </div>

        <MultiStepWizard
          steps={steps}
          onComplete={handleWizardComplete}
          initialData={initialData}
          className="max-w-6xl mx-auto"
          autoSave
          persistenceKey="procurement-workflow"
        />
        {isSaving && <p className="mt-4 text-sm text-muted-foreground">Saving procurement records...</p>}
      </div>
    </div>
  )
}
