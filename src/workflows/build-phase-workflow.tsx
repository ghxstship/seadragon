"use client"

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
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

type TaskFormValues = z.infer<typeof taskSchema>
type ResourceFormValues = z.infer<typeof resourceSchema>
type MilestoneFormValues = z.infer<typeof milestoneSchema>
type InspectionFormValues = z.infer<typeof inspectionSchema>
type ChecklistFormValues = z.infer<typeof checklistSchema>
type IssueFormValues = z.infer<typeof issueSchema>
type SubcontractorFormValues = z.infer<typeof subcontractorSchema>

type BuildWizardData = {
  task?: TaskFormValues
  resource?: ResourceFormValues
  milestone?: MilestoneFormValues
  inspection?: InspectionFormValues
  checklist?: ChecklistFormValues
  issue?: IssueFormValues
  subcontractor?: SubcontractorFormValues
}

const taskSchema = z.object({
  taskName: z.string().min(2),
  description: z.string().optional(),
  category: z.string().min(1),
  priority: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
  assignedTo: z.string().optional(),
  estimatedHours: z.string().optional(),
  dueDate: z.string().optional()
})

const resourceSchema = z.object({
  resourceName: z.string().min(2),
  resourceType: z.string().min(1),
  quantity: z.coerce.number().int().nonnegative().default(0),
  unitCost: z.string().optional(),
  supplier: z.string().optional(),
  deliveryDate: z.string().optional(),
  status: z.enum(['available', 'ordered', 'delivered', 'in_use', 'returned']).default('available')
})

const milestoneSchema = z.object({
  milestoneName: z.string().min(2),
  category: z.string().min(1),
  plannedDate: z.string(),
  responsibleParty: z.string().optional(),
  deliverables: z.string().optional()
})

const inspectionSchema = z.object({
  inspectionName: z.string().min(2),
  inspectionType: z.string().min(1),
  scheduledDate: z.string(),
  inspector: z.string().optional(),
  checklistItems: z.string().optional()
})

const checklistSchema = z.object({
  checklistName: z.string().min(2),
  category: z.string().min(1),
  phase: z.string().min(1),
  assignedTo: z.string().optional(),
  dueDate: z.string().optional(),
  notes: z.string().optional()
})

const issueSchema = z.object({
  issueTitle: z.string().min(2),
  description: z.string().min(2),
  severity: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
  category: z.string().min(1),
  assignedTo: z.string().optional()
})

const subcontractorSchema = z.object({
  companyName: z.string().min(2),
  contactName: z.string().optional(),
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().optional(),
  specialty: z.string().min(1),
  status: z.enum(['active', 'inactive', 'terminated']).default('active')
})

function TaskStep({ data, onChange, onValidationChange }: StepProps) {
  const taskData = (data as BuildWizardData).task
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: taskData || { taskName: '', category: '', priority: 'medium', description: '', assignedTo: '', estimatedHours: '', dueDate: '' }
  })

  useEffect(() => {
    const subscription = form.watch((values) => {
      onChange({ ...data, task: values as TaskFormValues })
      onValidationChange?.(form.formState.isValid)
    }) as unknown as { unsubscribe?: () => void }
    return () => subscription?.unsubscribe?.()
  }, [form, data, onChange, onValidationChange])

  return (
    <Form {...form}>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField control={form.control} name="taskName" render={({ field }) => (
          <FormItem>
            <FormLabel>Task Name</FormLabel>
            <FormControl><Input {...field}/></FormControl>
            <FormMessage/>
          </FormItem>
        )}/>
        <FormField control={form.control} name="category" render={({ field }) => (
          <FormItem>
            <FormLabel>Category</FormLabel>
            <FormControl><Input {...field}/></FormControl>
            <FormMessage/>
          </FormItem>
        )}/>
        <FormField control={form.control} name="priority" render={({ field }) => (
          <FormItem>
            <FormLabel>Priority</FormLabel>
            <FormControl><Input {...field}/></FormControl>
            <FormMessage/>
          </FormItem>
        )}/>
        <FormField control={form.control} name="assignedTo" render={({ field }) => (
          <FormItem>
            <FormLabel>Assigned To</FormLabel>
            <FormControl><Input {...field}/></FormControl>
            <FormMessage/>
          </FormItem>
        )}/>
        <FormField control={form.control} name="estimatedHours" render={({ field }) => (
          <FormItem>
            <FormLabel>Estimated Hours</FormLabel>
            <FormControl><Input type="number" step="0.25" {...field}/></FormControl>
            <FormMessage/>
          </FormItem>
        )}/>
        <FormField control={form.control} name="dueDate" render={({ field }) => (
          <FormItem>
            <FormLabel>Due Date</FormLabel>
            <FormControl><Input type="date" {...field}/></FormControl>
            <FormMessage/>
          </FormItem>
        )}/>
        <FormField control={form.control} name="description" render={({ field }) => (
          <FormItem className="md:col-span-2">
            <FormLabel>Description</FormLabel>
            <FormControl><Textarea rows={3} {...field}/></FormControl>
            <FormMessage/>
          </FormItem>
        )}/>
      </form>
    </Form>
  )
}

function ResourceStep({ data, onChange, onValidationChange }: StepProps) {
  const resourceData = (data as BuildWizardData).resource
  const form = useForm<ResourceFormValues>({
    resolver: zodResolver(resourceSchema),
    defaultValues: resourceData || { resourceName: '', resourceType: '', quantity: 0, status: 'available', unitCost: '', supplier: '', deliveryDate: '' }
  })

  useEffect(() => {
    const subscription = form.watch((values) => {
      onChange({ ...data, resource: values as ResourceFormValues })
      onValidationChange?.(form.formState.isValid)
    }) as unknown as { unsubscribe?: () => void }
    return () => subscription?.unsubscribe?.()
  }, [form, data, onChange, onValidationChange])

  return (
    <Form {...form}>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField control={form.control} name="resourceName" render={({ field }) => (
          <FormItem>
            <FormLabel>Resource Name</FormLabel>
            <FormControl><Input {...field}/></FormControl>
            <FormMessage/>
          </FormItem>
        )}/>
        <FormField control={form.control} name="resourceType" render={({ field }) => (
          <FormItem>
            <FormLabel>Resource Type</FormLabel>
            <FormControl><Input placeholder="equipment/material/personnel" {...field}/></FormControl>
            <FormMessage/>
          </FormItem>
        )}/>
        <FormField control={form.control} name="quantity" render={({ field }) => (
          <FormItem>
            <FormLabel>Quantity</FormLabel>
            <FormControl><Input type="number" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
            <FormMessage/>
          </FormItem>
        )}/>
        <FormField control={form.control} name="unitCost" render={({ field }) => (
          <FormItem>
            <FormLabel>Unit Cost</FormLabel>
            <FormControl><Input type="number" step="0.01" {...field}/></FormControl>
            <FormMessage/>
          </FormItem>
        )}/>
        <FormField control={form.control} name="supplier" render={({ field }) => (
          <FormItem>
            <FormLabel>Supplier</FormLabel>
            <FormControl><Input {...field}/></FormControl>
            <FormMessage/>
          </FormItem>
        )}/>
        <FormField control={form.control} name="deliveryDate" render={({ field }) => (
          <FormItem>
            <FormLabel>Delivery Date</FormLabel>
            <FormControl><Input type="date" {...field}/></FormControl>
            <FormMessage/>
          </FormItem>
        )}/>
        <FormField control={form.control} name="status" render={({ field }) => (
          <FormItem>
            <FormLabel>Status</FormLabel>
            <FormControl><Input {...field}/></FormControl>
            <FormMessage/>
          </FormItem>
        )}/>
      </form>
    </Form>
  )
}

function MilestoneStep({ data, onChange, onValidationChange }: StepProps) {
  const milestoneData = (data as BuildWizardData).milestone
  const form = useForm<MilestoneFormValues>({
    resolver: zodResolver(milestoneSchema),
    defaultValues: milestoneData || { milestoneName: '', category: '', plannedDate: '', responsibleParty: '', deliverables: '' }
  })

  useEffect(() => {
    const subscription = form.watch((values) => {
      onChange({ ...data, milestone: values as MilestoneFormValues })
      onValidationChange?.(form.formState.isValid)
    }) as unknown as { unsubscribe?: () => void }
    return () => subscription?.unsubscribe?.()
  }, [form, data, onChange, onValidationChange])

  return (
    <Form {...form}>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField control={form.control} name="milestoneName" render={({ field }) => (
          <FormItem>
            <FormLabel>Milestone Name</FormLabel>
            <FormControl><Input {...field}/></FormControl>
            <FormMessage/>
          </FormItem>
        )}/>
        <FormField control={form.control} name="category" render={({ field }) => (
          <FormItem>
            <FormLabel>Category</FormLabel>
            <FormControl><Input {...field}/></FormControl>
            <FormMessage/>
          </FormItem>
        )}/>
        <FormField control={form.control} name="plannedDate" render={({ field }) => (
          <FormItem>
            <FormLabel>Planned Date</FormLabel>
            <FormControl><Input type="date" {...field}/></FormControl>
            <FormMessage/>
          </FormItem>
        )}/>
        <FormField control={form.control} name="responsibleParty" render={({ field }) => (
          <FormItem>
            <FormLabel>Responsible Party</FormLabel>
            <FormControl><Input {...field}/></FormControl>
            <FormMessage/>
          </FormItem>
        )}/>
        <FormField control={form.control} name="deliverables" render={({ field }) => (
          <FormItem className="md:col-span-2">
            <FormLabel>Deliverables</FormLabel>
            <FormControl><Textarea rows={3} {...field}/></FormControl>
            <FormMessage/>
          </FormItem>
        )}/>
      </form>
    </Form>
  )
}

function InspectionStep({ data, onChange, onValidationChange }: StepProps) {
  const inspectionData = (data as BuildWizardData).inspection
  const form = useForm<InspectionFormValues>({
    resolver: zodResolver(inspectionSchema),
    defaultValues: inspectionData || { inspectionName: '', inspectionType: '', scheduledDate: '', inspector: '', checklistItems: '' }
  })

  useEffect(() => {
    const subscription = form.watch((values) => {
      onChange({ ...data, inspection: values as InspectionFormValues })
      onValidationChange?.(form.formState.isValid)
    }) as unknown as { unsubscribe?: () => void }
    return () => subscription?.unsubscribe?.()
  }, [form, data, onChange, onValidationChange])

  return (
    <Form {...form}>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField control={form.control} name="inspectionName" render={({ field }) => (
          <FormItem>
            <FormLabel>Inspection Name</FormLabel>
            <FormControl><Input {...field}/></FormControl>
            <FormMessage/>
          </FormItem>
        )}/>
        <FormField control={form.control} name="inspectionType" render={({ field }) => (
          <FormItem>
            <FormLabel>Inspection Type</FormLabel>
            <FormControl><Input {...field}/></FormControl>
            <FormMessage/>
          </FormItem>
        )}/>
        <FormField control={form.control} name="scheduledDate" render={({ field }) => (
          <FormItem>
            <FormLabel>Scheduled Date</FormLabel>
            <FormControl><Input type="date" {...field}/></FormControl>
            <FormMessage/>
          </FormItem>
        )}/>
        <FormField control={form.control} name="inspector" render={({ field }) => (
          <FormItem>
            <FormLabel>Inspector</FormLabel>
            <FormControl><Input {...field}/></FormControl>
            <FormMessage/>
          </FormItem>
        )}/>
        <FormField control={form.control} name="checklistItems" render={({ field }) => (
          <FormItem className="md:col-span-2">
            <FormLabel>Checklist Items</FormLabel>
            <FormControl><Textarea rows={3} {...field}/></FormControl>
            <FormMessage/>
          </FormItem>
        )}/>
      </form>
    </Form>
  )
}

function ChecklistStep({ data, onChange, onValidationChange }: StepProps) {
  const checklistData = (data as BuildWizardData).checklist
  const form = useForm<ChecklistFormValues>({
    resolver: zodResolver(checklistSchema),
    defaultValues: checklistData || { checklistName: '', category: '', phase: '', assignedTo: '', dueDate: '', notes: '' }
  })

  useEffect(() => {
    const subscription = form.watch((values) => {
      onChange({ ...data, checklist: values as ChecklistFormValues })
      onValidationChange?.(form.formState.isValid)
    }) as unknown as { unsubscribe?: () => void }
    return () => subscription?.unsubscribe?.()
  }, [form, data, onChange, onValidationChange])

  return (
    <Form {...form}>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField control={form.control} name="checklistName" render={({ field }) => (
          <FormItem>
            <FormLabel>Checklist Name</FormLabel>
            <FormControl><Input {...field}/></FormControl>
            <FormMessage/>
          </FormItem>
        )}/>
        <FormField control={form.control} name="category" render={({ field }) => (
          <FormItem>
            <FormLabel>Category</FormLabel>
            <FormControl><Input {...field}/></FormControl>
            <FormMessage/>
          </FormItem>
        )}/>
        <FormField control={form.control} name="phase" render={({ field }) => (
          <FormItem>
            <FormLabel>Phase</FormLabel>
            <FormControl><Input {...field}/></FormControl>
            <FormMessage/>
          </FormItem>
        )}/>
        <FormField control={form.control} name="assignedTo" render={({ field }) => (
          <FormItem>
            <FormLabel>Assigned To</FormLabel>
            <FormControl><Input {...field}/></FormControl>
            <FormMessage/>
          </FormItem>
        )}/>
        <FormField control={form.control} name="dueDate" render={({ field }) => (
          <FormItem>
            <FormLabel>Due Date</FormLabel>
            <FormControl><Input type="date" {...field}/></FormControl>
            <FormMessage/>
          </FormItem>
        )}/>
        <FormField control={form.control} name="notes" render={({ field }) => (
          <FormItem className="md:col-span-2">
            <FormLabel>Notes</FormLabel>
            <FormControl><Textarea rows={3} {...field}/></FormControl>
            <FormMessage/>
          </FormItem>
        )}/>
      </form>
    </Form>
  )
}

function IssueStep({ data, onChange, onValidationChange }: StepProps) {
  const issueData = (data as BuildWizardData).issue
  const form = useForm<IssueFormValues>({
    resolver: zodResolver(issueSchema),
    defaultValues: issueData || { issueTitle: '', description: '', severity: 'medium', category: '', assignedTo: '' }
  })

  useEffect(() => {
    const subscription = form.watch((values) => {
      onChange({ ...data, issue: values as IssueFormValues })
      onValidationChange?.(form.formState.isValid)
    }) as unknown as { unsubscribe?: () => void }
    return () => subscription?.unsubscribe?.()
  }, [form, data, onChange, onValidationChange])

  return (
    <Form {...form}>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField control={form.control} name="issueTitle" render={({ field }) => (
          <FormItem>
            <FormLabel>Issue Title</FormLabel>
            <FormControl><Input {...field}/></FormControl>
            <FormMessage/>
          </FormItem>
        )}/>
        <FormField control={form.control} name="category" render={({ field }) => (
          <FormItem>
            <FormLabel>Category</FormLabel>
            <FormControl><Input {...field}/></FormControl>
            <FormMessage/>
          </FormItem>
        )}/>
        <FormField control={form.control} name="severity" render={({ field }) => (
          <FormItem>
            <FormLabel>Severity</FormLabel>
            <FormControl><Input {...field}/></FormControl>
            <FormMessage/>
          </FormItem>
        )}/>
        <FormField control={form.control} name="assignedTo" render={({ field }) => (
          <FormItem>
            <FormLabel>Assigned To</FormLabel>
            <FormControl><Input {...field}/></FormControl>
            <FormMessage/>
          </FormItem>
        )}/>
        <FormField control={form.control} name="description" render={({ field }) => (
          <FormItem className="md:col-span-2">
            <FormLabel>Description</FormLabel>
            <FormControl><Textarea rows={3} {...field}/></FormControl>
            <FormMessage/>
          </FormItem>
        )}/>
      </form>
    </Form>
  )
}

function SubcontractorStep({ data, onChange, onValidationChange }: StepProps) {
  const subcontractorData = (data as BuildWizardData).subcontractor
  const form = useForm<SubcontractorFormValues>({
    resolver: zodResolver(subcontractorSchema),
    defaultValues: subcontractorData || { companyName: '', specialty: '', status: 'active', contactName: '', contactEmail: '', contactPhone: '' }
  })

  useEffect(() => {
    const subscription = form.watch((values) => {
      onChange({ ...data, subcontractor: values as SubcontractorFormValues })
      onValidationChange?.(form.formState.isValid)
    }) as unknown as { unsubscribe?: () => void }
    return () => subscription?.unsubscribe?.()
  }, [form, data, onChange, onValidationChange])

  return (
    <Form {...form}>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField control={form.control} name="companyName" render={({ field }) => (
          <FormItem>
            <FormLabel>Company Name</FormLabel>
            <FormControl><Input {...field}/></FormControl>
            <FormMessage/>
          </FormItem>
        )}/>
        <FormField control={form.control} name="specialty" render={({ field }) => (
          <FormItem>
            <FormLabel>Specialty</FormLabel>
            <FormControl><Input {...field}/></FormControl>
            <FormMessage/>
          </FormItem>
        )}/>
        <FormField control={form.control} name="contactName" render={({ field }) => (
          <FormItem>
            <FormLabel>Contact Name</FormLabel>
            <FormControl><Input {...field}/></FormControl>
            <FormMessage/>
          </FormItem>
        )}/>
        <FormField control={form.control} name="contactEmail" render={({ field }) => (
          <FormItem>
            <FormLabel>Contact Email</FormLabel>
            <FormControl><Input type="email" {...field}/></FormControl>
            <FormMessage/>
          </FormItem>
        )}/>
        <FormField control={form.control} name="contactPhone" render={({ field }) => (
          <FormItem>
            <FormLabel>Contact Phone</FormLabel>
            <FormControl><Input {...field}/></FormControl>
            <FormMessage/>
          </FormItem>
        )}/>
        <FormField control={form.control} name="status" render={({ field }) => (
          <FormItem>
            <FormLabel>Status</FormLabel>
            <FormControl><Input {...field}/></FormControl>
            <FormMessage/>
          </FormItem>
        )}/>
      </form>
    </Form>
  )
}

const steps = [
  { id: 'task', title: 'Tasks', description: 'Build task definition and ownership', component: TaskStep },
  { id: 'resource', title: 'Resources', description: 'Allocate build resources', component: ResourceStep },
  { id: 'milestone', title: 'Milestones', description: 'Plan milestones and deliverables', component: MilestoneStep },
  { id: 'inspection', title: 'Inspections', description: 'Schedule and record inspections', component: InspectionStep },
  { id: 'checklist', title: 'Checklists', description: 'Operational checklists per phase', component: ChecklistStep },
  { id: 'issue', title: 'Issues', description: 'Track issues and resolutions', component: IssueStep },
  { id: 'subcontractor', title: 'Subcontractors', description: 'Manage subcontractor contacts', component: SubcontractorStep }
]

export default function BuildPhaseWorkflow() {
  const [isSaving, setIsSaving] = useState(false)

  const handleWizardComplete = useCallback(async (finalData: Record<string, unknown>) => {
    try {
      setIsSaving(true)
      const data = finalData as BuildWizardData

      const { data: userData, error: userError } = await supabase.auth.getUser()
      if (userError || !userData?.user?.id) {
        throw new Error('User not authenticated for build workflow persistence')
      }
      const userId = userData.user.id

      if (data.task) {
        const { error } = await supabase.from('build_tasks').insert({
          task_name: data.task.taskName,
          description: data.task.description,
          category: data.task.category,
          priority: data.task.priority,
          assigned_to: data.task.assignedTo,
          estimated_hours: data.task.estimatedHours ? Number(data.task.estimatedHours) : null,
          due_date: data.task.dueDate || null,
          user_id: userId
        })
        if (error) throw error
      }

      if (data.resource) {
        const { error } = await supabase.from('build_resources').insert({
          resource_name: data.resource.resourceName,
          resource_type: data.resource.resourceType,
          quantity_available: data.resource.quantity,
          unit_cost: data.resource.unitCost ? Number(data.resource.unitCost) : null,
          supplier: data.resource.supplier,
          delivery_date: data.resource.deliveryDate || null,
          status: data.resource.status,
          user_id: userId
        })
        if (error) throw error
      }

      if (data.milestone) {
        const { error } = await supabase.from('build_milestones').insert({
          milestone_name: data.milestone.milestoneName,
          description: data.milestone.deliverables,
          category: data.milestone.category,
          planned_date: data.milestone.plannedDate,
          responsible_party: data.milestone.responsibleParty,
          deliverables: data.milestone.deliverables ? [data.milestone.deliverables] : null,
          user_id: userId
        })
        if (error) throw error
      }

      if (data.inspection) {
        const { error } = await supabase.from('build_inspections').insert({
          inspection_name: data.inspection.inspectionName,
          inspection_type: data.inspection.inspectionType,
          scheduled_date: data.inspection.scheduledDate,
          inspector: data.inspection.inspector,
          checklist_items: data.inspection.checklistItems ? [data.inspection.checklistItems] : null,
          status: 'scheduled',
          user_id: userId
        })
        if (error) throw error
      }

      if (data.checklist) {
        const { error } = await supabase.from('build_checklists').insert({
          checklist_name: data.checklist.checklistName,
          category: data.checklist.category,
          phase: data.checklist.phase,
          assigned_to: data.checklist.assignedTo,
          due_date: data.checklist.dueDate || null,
          notes: data.checklist.notes,
          status: 'pending',
          user_id: userId
        })
        if (error) throw error
      }

      if (data.issue) {
        const { error } = await supabase.from('build_issues').insert({
          issue_title: data.issue.issueTitle,
          description: data.issue.description,
          severity: data.issue.severity,
          category: data.issue.category,
          assigned_to: data.issue.assignedTo,
          status: 'open',
          user_id: userId
        })
        if (error) throw error
      }

      if (data.subcontractor) {
        const { error } = await supabase.from('build_subcontractors').insert({
          company_name: data.subcontractor.companyName,
          contact_name: data.subcontractor.contactName,
          contact_email: data.subcontractor.contactEmail,
          contact_phone: data.subcontractor.contactPhone,
          specialty: data.subcontractor.specialty,
          status: data.subcontractor.status,
          user_id: userId
        })
        if (error) throw error
      }

    } catch (error) {
      logger.error('Build phase workflow save failed', error)
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
          <h1 className="text-3xl font-bold">Build Phase Workflow</h1>
          <p className="text-muted-foreground mt-2">
            Prepare site, build scenic, install technical systems, ensure safety, and close punchlist for operate handoff.
          </p>
        </div>

        <MultiStepWizard
          steps={steps}
          onComplete={handleWizardComplete}
          initialData={initialData}
          className="max-w-6xl mx-auto"
          autoSave
          persistenceKey="build-phase-workflow"
        />
        {isSaving && <p className="mt-4 text-sm text-muted-foreground">Saving build records...</p>}
      </div>
    </div>
  )
}
