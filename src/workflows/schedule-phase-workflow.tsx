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

type TimelineFormValues = z.infer<typeof timelineSchema>
type StaffFormValues = z.infer<typeof staffSchema>
type CriticalPathFormValues = z.infer<typeof criticalPathSchema>
type CommunicationFormValues = z.infer<typeof communicationSchema>
type ContingencyFormValues = z.infer<typeof contingencySchema>

type ScheduleWizardData = {
  timeline?: TimelineFormValues
  staff?: StaffFormValues
  criticalPath?: CriticalPathFormValues
  communication?: CommunicationFormValues
  contingency?: ContingencyFormValues
}

const timelineSchema = z.object({
  eventId: z.string().min(1),
  phase: z.string().min(1),
  startTime: z.string().min(1),
  endTime: z.string().min(1),
  activities: z.string().optional(),
  responsible: z.string().optional(),
  dependencies: z.string().optional(),
  status: z.enum(['scheduled', 'in_progress', 'completed']).default('scheduled')
})

const staffSchema = z.object({
  eventId: z.string().min(1),
  role: z.string().min(1),
  name: z.string().min(1),
  shiftStart: z.string().min(1),
  shiftEnd: z.string().min(1),
  location: z.string().optional(),
  responsibilities: z.string().optional(),
  status: z.enum(['assigned', 'confirmed', 'on_duty', 'completed']).default('assigned')
})

const criticalPathSchema = z.object({
  eventId: z.string().min(1),
  task: z.string().min(1),
  duration: z.coerce.number().int().min(0),
  dependencies: z.string().optional(),
  slack: z.coerce.number().int().optional(),
  critical: z.boolean().default(false)
})

const communicationSchema = z.object({
  eventId: z.string().min(1),
  updateType: z.string().min(1),
  content: z.string().min(1),
  targetAudience: z.string().optional(),
  scheduledTime: z.string().min(1),
  deliveredTime: z.string().optional(),
  deliveredBy: z.string().optional(),
  status: z.enum(['scheduled', 'sent', 'delivered']).default('scheduled')
})

const contingencySchema = z.object({
  eventId: z.string().min(1),
  scenario: z.string().min(1),
  triggerConditions: z.string().optional(),
  responsePlan: z.string().optional(),
  responsibleParty: z.string().optional(),
  backupResources: z.string().optional(),
  communicationPlan: z.string().optional(),
  status: z.enum(['planned', 'activated', 'resolved']).default('planned')
})

function parseArray(value?: string) {
  if (!value || !value.trim()) return [] as string[]
  return value.split(',').map((v) => v.trim()).filter(Boolean)
}

function createStep<T extends Record<string, unknown>>(opts: {
  schema: z.ZodSchema
  dataKey: keyof ScheduleWizardData
  defaults: T
  render: (form: ReturnType<typeof useForm<T>>) => React.ReactNode
}) {
  return function Step({ data, onChange, onValidationChange }: StepProps) {
    const existing = (data as ScheduleWizardData)[opts.dataKey] as T | undefined
    const form = useForm<T>({ resolver: zodResolver(opts.schema), defaultValues: (existing ?? opts.defaults) as DefaultValues<T> })

    useEffect(() => {
      const subscription = form.watch((values) => {
        onChange({ ...data, [opts.dataKey]: values })
        onValidationChange?.(form.formState.isValid)
      }) as unknown as { unsubscribe?: () => void }
      return () => subscription?.unsubscribe?.()
    }, [form, data, onChange, onValidationChange])

    return <Form {...form}><form className="grid grid-cols-1 md:grid-cols-2 gap-4">{opts.render(form)}</form></Form>
  }
}

const TimelineStep = createStep<TimelineFormValues>({
  schema: timelineSchema,
  dataKey: 'timeline',
  defaults: { eventId: '', phase: '', startTime: '', endTime: '', activities: '', responsible: '', dependencies: '', status: 'scheduled' },
  render: (form) => (
    <>
      <FormField control={form.control} name={'eventId' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Event ID</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'phase' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Phase</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'startTime' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Start Time</FormLabel>
          <FormControl><Input type="datetime-local" {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'endTime' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>End Time</FormLabel>
          <FormControl><Input type="datetime-local" {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'activities' as never} render={({ field }) => (
        <FormItem className="md:col-span-2">
          <FormLabel>Activities (comma separated)</FormLabel>
          <FormControl><Textarea rows={2} {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'responsible' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Responsible</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'dependencies' as never} render={({ field }) => (
        <FormItem className="md:col-span-2">
          <FormLabel>Dependencies (comma separated)</FormLabel>
          <FormControl><Textarea rows={2} {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'status' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Status</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
    </>
  )
})

const StaffStep = createStep<StaffFormValues>({
  schema: staffSchema,
  dataKey: 'staff',
  defaults: { eventId: '', role: '', name: '', shiftStart: '', shiftEnd: '', location: '', responsibilities: '', status: 'assigned' },
  render: (form) => (
    <>
      <FormField control={form.control} name={'eventId' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Event ID</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'role' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Role</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'name' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Name</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'shiftStart' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Shift Start</FormLabel>
          <FormControl><Input type="datetime-local" {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'shiftEnd' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Shift End</FormLabel>
          <FormControl><Input type="datetime-local" {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'location' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Location</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'responsibilities' as never} render={({ field }) => (
        <FormItem className="md:col-span-2">
          <FormLabel>Responsibilities (comma separated)</FormLabel>
          <FormControl><Textarea rows={2} {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'status' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Status</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
    </>
  )
})

const CriticalPathStep = createStep<CriticalPathFormValues>({
  schema: criticalPathSchema,
  dataKey: 'criticalPath',
  defaults: { eventId: '', task: '', duration: 0, dependencies: '', slack: 0, critical: false },
  render: (form) => (
    <>
      <FormField control={form.control} name={'eventId' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Event ID</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'task' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Task</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'duration' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Duration (minutes)</FormLabel>
          <FormControl><Input type="number" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'dependencies' as never} render={({ field }) => (
        <FormItem className="md:col-span-2">
          <FormLabel>Dependencies (comma separated)</FormLabel>
          <FormControl><Textarea rows={2} {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'slack' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Slack (minutes)</FormLabel>
          <FormControl><Input type="number" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'critical' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Critical</FormLabel>
          <FormControl><Input type="checkbox" checked={field.value ?? false} onChange={e => field.onChange(e.target.checked)}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
    </>
  )
})

const CommunicationStep = createStep<CommunicationFormValues>({
  schema: communicationSchema,
  dataKey: 'communication',
  defaults: { eventId: '', updateType: '', content: '', targetAudience: '', scheduledTime: '', deliveredTime: '', deliveredBy: '', status: 'scheduled' },
  render: (form) => (
    <>
      <FormField control={form.control} name={'eventId' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Event ID</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'updateType' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Update Type</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'content' as never} render={({ field }) => (
        <FormItem className="md:col-span-2">
          <FormLabel>Content</FormLabel>
          <FormControl><Textarea rows={3} {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'targetAudience' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Target Audience</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'scheduledTime' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Scheduled Time</FormLabel>
          <FormControl><Input type="datetime-local" {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'deliveredTime' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Delivered Time</FormLabel>
          <FormControl><Input type="datetime-local" {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'deliveredBy' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Delivered By</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'status' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Status</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
    </>
  )
})

const ContingencyStep = createStep<ContingencyFormValues>({
  schema: contingencySchema,
  dataKey: 'contingency',
  defaults: { eventId: '', scenario: '', triggerConditions: '', responsePlan: '', responsibleParty: '', backupResources: '', communicationPlan: '', status: 'planned' },
  render: (form) => (
    <>
      <FormField control={form.control} name={'eventId' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Event ID</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'scenario' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Scenario</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'triggerConditions' as never} render={({ field }) => (
        <FormItem className="md:col-span-2">
          <FormLabel>Trigger Conditions</FormLabel>
          <FormControl><Textarea rows={2} {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'responsePlan' as never} render={({ field }) => (
        <FormItem className="md:col-span-2">
          <FormLabel>Response Plan</FormLabel>
          <FormControl><Textarea rows={2} {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'responsibleParty' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Responsible Party</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'backupResources' as never} render={({ field }) => (
        <FormItem className="md:col-span-2">
          <FormLabel>Backup Resources (comma separated)</FormLabel>
          <FormControl><Textarea rows={2} {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'communicationPlan' as never} render={({ field }) => (
        <FormItem className="md:col-span-2">
          <FormLabel>Communication Plan</FormLabel>
          <FormControl><Textarea rows={2} {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'status' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Status</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
    </>
  )
})

const steps = [
  { id: 'timeline', title: 'Build Schedule', description: 'Master schedule timeline', component: TimelineStep },
  { id: 'staff', title: 'Resource Alignment', description: 'Staff assignments and shifts', component: StaffStep },
  { id: 'critical', title: 'Critical Path', description: 'Critical tasks and dependencies', component: CriticalPathStep },
  { id: 'communication', title: 'Publish & Notify', description: 'Schedule updates and notifications', component: CommunicationStep },
  { id: 'contingency', title: 'Monitor & Adjust', description: 'Contingencies and response plans', component: ContingencyStep }
]

export function SchedulePhaseWorkflow() {
  const [isSaving, setIsSaving] = useState(false)

  const handleWizardComplete = useCallback(async (finalData: Record<string, unknown>) => {
    try {
      setIsSaving(true)
      const data = finalData as ScheduleWizardData
      const { data: userData, error: userError } = await supabase.auth.getUser()
      if (userError || !userData?.user?.id) throw new Error('User not authenticated for schedule workflow')

      if (data.timeline) {
        const { error } = await supabase.from('schedule_master_schedule_event_timeline').insert({
          event_id: data.timeline.eventId,
          phase: data.timeline.phase,
          start_time: data.timeline.startTime,
          end_time: data.timeline.endTime,
          activities: parseArray(data.timeline.activities),
          responsible: data.timeline.responsible,
          dependencies: parseArray(data.timeline.dependencies),
          status: data.timeline.status
        })
        if (error) throw error
      }

      if (data.staff) {
        const { error } = await supabase.from('schedule_resource_allocation_staff').insert({
          event_id: data.staff.eventId,
          role: data.staff.role,
          name: data.staff.name,
          shift_start: data.staff.shiftStart,
          shift_end: data.staff.shiftEnd,
          location: data.staff.location,
          responsibilities: parseArray(data.staff.responsibilities),
          status: data.staff.status
        })
        if (error) throw error
      }

      if (data.criticalPath) {
        const { error } = await supabase.from('schedule_master_schedule_critical_path').insert({
          event_id: data.criticalPath.eventId,
          task: data.criticalPath.task,
          duration: data.criticalPath.duration,
          dependencies: parseArray(data.criticalPath.dependencies),
          slack: data.criticalPath.slack ?? 0,
          critical: data.criticalPath.critical ?? false
        })
        if (error) throw error
      }

      if (data.communication) {
        const { error } = await supabase.from('schedule_communication_plans_updates').insert({
          event_id: data.communication.eventId,
          update_type: data.communication.updateType,
          content: data.communication.content,
          target_audience: data.communication.targetAudience,
          scheduled_time: data.communication.scheduledTime,
          delivered_time: data.communication.deliveredTime || null,
          delivered_by: data.communication.deliveredBy,
          status: data.communication.status
        })
        if (error) throw error
      }

      if (data.contingency) {
        const { error } = await supabase.from('schedule_contingency_plans_scenarios').insert({
          event_id: data.contingency.eventId,
          scenario: data.contingency.scenario,
          trigger_conditions: data.contingency.triggerConditions,
          response_plan: data.contingency.responsePlan,
          responsible_party: data.contingency.responsibleParty,
          backup_resources: parseArray(data.contingency.backupResources),
          communication_plan: data.contingency.communicationPlan,
          status: data.contingency.status
        })
        if (error) throw error
      }

    } catch (error) {
      logger.error('Schedule phase workflow save failed', error)
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
          <h1 className="text-3xl font-bold">Schedule Phase Workflow</h1>
          <p className="text-muted-foreground mt-2">
            Build timelines, align resources, track critical path, publish updates, and manage contingencies with Supabase persistence.
          </p>
        </div>

        <MultiStepWizard
          steps={steps}
          onComplete={handleWizardComplete}
          initialData={initialData}
          className="max-w-6xl mx-auto"
          autoSave
          persistenceKey="schedule-phase-workflow"
        />
        {isSaving && <p className="mt-4 text-sm text-muted-foreground">Saving schedule phase records...</p>}
      </div>
    </div>
  )
}

export default SchedulePhaseWorkflow
