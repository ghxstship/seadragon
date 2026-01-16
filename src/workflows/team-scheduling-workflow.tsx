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

type MemberFormValues = z.infer<typeof memberSchema>
type ShiftFormValues = z.infer<typeof shiftSchema>
type AssignmentFormValues = z.infer<typeof assignmentSchema>
type AvailabilityFormValues = z.infer<typeof availabilitySchema>
type ConflictFormValues = z.infer<typeof conflictSchema>
type CommunicationFormValues = z.infer<typeof communicationSchema>
type PerformanceFormValues = z.infer<typeof performanceSchema>
type ScheduleFormValues = z.infer<typeof scheduleSchema>

type TeamSchedulingWizardData = {
  member?: MemberFormValues
  shift?: ShiftFormValues
  assignment?: AssignmentFormValues
  availability?: AvailabilityFormValues
  conflict?: ConflictFormValues
  communication?: CommunicationFormValues
  performance?: PerformanceFormValues
  schedule?: ScheduleFormValues
}

const memberSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  department: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  skills: z.string().optional(),
  certifications: z.string().optional(),
  availability: z.string().optional(),
  status: z.enum(['active', 'inactive', 'on_leave']).default('active'),
  hireDate: z.string().optional()
})

const shiftSchema = z.object({
  shiftName: z.string().min(1),
  startTime: z.string().min(1),
  endTime: z.string().min(1),
  durationHours: z.string().optional(),
  requiredRoles: z.string().optional(),
  location: z.string().optional(),
  notes: z.string().optional(),
  isActive: z.boolean().default(true)
})

const assignmentSchema = z.object({
  shiftId: z.string().uuid('Shift ID must be a UUID'),
  memberId: z.string().uuid('Member ID must be a UUID'),
  assignmentDate: z.string().min(1),
  status: z.enum(['assigned', 'confirmed', 'completed', 'no_show', 'cancelled']).default('assigned'),
  notes: z.string().optional()
})

const availabilitySchema = z.object({
  memberId: z.string().uuid('Member ID must be a UUID'),
  date: z.string().min(1),
  available: z.boolean().default(true),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  reason: z.string().optional()
})

const conflictSchema = z.object({
  memberId: z.string().uuid('Member ID must be a UUID'),
  conflictType: z.string().min(1),
  description: z.string().min(1),
  date: z.string().optional(),
  shiftId: z.string().uuid('Shift ID must be a UUID').optional(),
  severity: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
  status: z.enum(['open', 'resolved', 'ignored']).default('open'),
  resolution: z.string().optional(),
  resolvedDate: z.string().optional()
})

const communicationSchema = z.object({
  type: z.string().min(1),
  subject: z.string().min(1),
  message: z.string().min(1),
  recipients: z.string().optional(),
  sendDate: z.string().min(1),
  sent: z.boolean().default(false),
  deliveryStatus: z.enum(['pending', 'sent', 'delivered', 'failed']).default('pending')
})

const performanceSchema = z.object({
  memberId: z.string().uuid('Member ID must be a UUID'),
  metricType: z.string().min(1),
  value: z.coerce.number().optional(),
  date: z.string().min(1),
  notes: z.string().optional()
})

const scheduleSchema = z.object({
  scheduleName: z.string().min(1),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  scheduleData: z.string().optional(),
  status: z.enum(['draft', 'published', 'active', 'archived']).default('draft')
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
  dataKey: keyof TeamSchedulingWizardData
  defaults: T
  render: (form: ReturnType<typeof useForm<T>>) => React.ReactNode
}) {
  return function Step({ data, onChange, onValidationChange }: StepProps) {
    const existing = (data as TeamSchedulingWizardData)[opts.dataKey] as T | undefined
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

const DemandImportStep = createStep<MemberFormValues>({
  schema: memberSchema,
  dataKey: 'member',
  defaults: { name: '', role: '', status: 'active' },
  render: (form) => (
    <>
      {simpleInput('Name', 'name', form)}
      {simpleInput('Role', 'role', form)}
      {simpleInput('Department', 'department', form)}
      {simpleInput('Email', 'email', form)}
      {simpleInput('Phone', 'phone', form)}
      {simpleTextarea('Skills (comma separated)', 'skills', form)}
      {simpleTextarea('Certifications (comma separated)', 'certifications', form)}
      {simpleTextarea('Availability (JSON)', 'availability', form)}
      {simpleInput('Status', 'status', form)}
      {simpleInput('Hire Date', 'hireDate', form, 'date')}
    </>
  )
})

const ShiftBuildStep = createStep<ShiftFormValues>({
  schema: shiftSchema,
  dataKey: 'shift',
  defaults: { shiftName: '', startTime: '', endTime: '', isActive: true },
  render: (form) => (
    <>
      {simpleInput('Shift Name', 'shiftName', form)}
      {simpleInput('Start Time', 'startTime', form, 'time')}
      {simpleInput('End Time', 'endTime', form, 'time')}
      {simpleInput('Duration (hours)', 'durationHours', form, 'number')}
      {simpleTextarea('Required Roles (comma separated)', 'requiredRoles', form)}
      {simpleInput('Location', 'location', form)}
      {simpleTextarea('Notes', 'notes', form)}
      <FormField control={form.control} name={'isActive' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Active</FormLabel>
          <FormControl>
            <Input type="checkbox" checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}/>
    </>
  )
})

const AssignmentStep = createStep<AssignmentFormValues>({
  schema: assignmentSchema,
  dataKey: 'assignment',
  defaults: { shiftId: '', memberId: '', assignmentDate: '', status: 'assigned' },
  render: (form) => (
    <>
      {simpleInput('Shift ID', 'shiftId', form)}
      {simpleInput('Member ID', 'memberId', form)}
      {simpleInput('Assignment Date', 'assignmentDate', form, 'date')}
      {simpleInput('Status', 'status', form)}
      {simpleTextarea('Notes', 'notes', form)}
    </>
  )
})

const SwapAndBackfillStep = createStep<AvailabilityFormValues & ConflictFormValues>({
  schema: availabilitySchema.merge(conflictSchema),
  dataKey: 'availability',
  defaults: {
    memberId: '',
    date: '',
    available: true,
    conflictType: '',
    description: '',
    severity: 'medium',
    status: 'open'
  } as unknown as AvailabilityFormValues & ConflictFormValues,
  render: (form) => (
    <>
      <div className="md:col-span-2 text-sm font-semibold">Availability</div>
      {simpleInput('Member ID', 'memberId', form)}
      {simpleInput('Date', 'date', form, 'date')}
      <FormField control={form.control} name={'available' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Available</FormLabel>
          <FormControl>
            <Input type="checkbox" checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}/>
      {simpleInput('Start Time', 'startTime', form, 'time')}
      {simpleInput('End Time', 'endTime', form, 'time')}
      {simpleTextarea('Reason', 'reason', form)}

      <div className="md:col-span-2 text-sm font-semibold mt-2">Conflict</div>
      {simpleInput('Conflict Type', 'conflictType', form)}
      {simpleTextarea('Description', 'description', form)}
      {simpleInput('Conflict Date', 'date', form, 'date')}
      {simpleInput('Related Shift ID', 'shiftId', form)}
      {simpleInput('Severity', 'severity', form)}
      {simpleInput('Status', 'status', form)}
      {simpleTextarea('Resolution', 'resolution', form)}
      {simpleInput('Resolved Date', 'resolvedDate', form, 'datetime-local')}
    </>
  )
})

const PublishAndNotifyStep = createStep<CommunicationFormValues & ScheduleFormValues>({
  schema: communicationSchema.merge(scheduleSchema),
  dataKey: 'communication',
  defaults: {
    type: '',
    subject: '',
    message: '',
    sendDate: '',
    deliveryStatus: 'pending',
    scheduleName: '',
    startDate: '',
    endDate: '',
    status: 'draft'
  } as unknown as CommunicationFormValues & ScheduleFormValues,
  render: (form) => (
    <>
      <div className="md:col-span-2 text-sm font-semibold">Communication</div>
      {simpleInput('Type', 'type', form)}
      {simpleInput('Subject', 'subject', form)}
      {simpleTextarea('Message', 'message', form, 4)}
      {simpleTextarea('Recipients (comma separated)', 'recipients', form)}
      {simpleInput('Send Date', 'sendDate', form, 'datetime-local')}
      <FormField control={form.control} name={'sent' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Sent</FormLabel>
          <FormControl>
            <Input type="checkbox" checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}/>
      {simpleInput('Delivery Status', 'deliveryStatus', form)}

      <div className="md:col-span-2 text-sm font-semibold mt-2">Schedule</div>
      {simpleInput('Schedule Name', 'scheduleName', form)}
      {simpleInput('Start Date', 'startDate', form, 'date')}
      {simpleInput('End Date', 'endDate', form, 'date')}
      {simpleTextarea('Schedule Data (JSON)', 'scheduleData', form)}
      {simpleInput('Schedule Status', 'status', form)}
    </>
  )
})

const AttendanceAndActualsStep = createStep<PerformanceFormValues>({
  schema: performanceSchema,
  dataKey: 'performance',
  defaults: { memberId: '', metricType: '', date: '' },
  render: (form) => (
    <>
      {simpleInput('Member ID', 'memberId', form)}
      {simpleInput('Metric Type', 'metricType', form)}
      {simpleInput('Value', 'value', form, 'number')}
      {simpleInput('Date', 'date', form, 'date')}
      {simpleTextarea('Notes', 'notes', form)}
    </>
  )
})

const steps = [
  { id: 'demand-import', title: 'Demand Import', description: 'Create team members', component: DemandImportStep },
  { id: 'shift-build', title: 'Shift Build', description: 'Create shifts', component: ShiftBuildStep },
  { id: 'assignment', title: 'Assignment', description: 'Assign members to shifts', component: AssignmentStep },
  { id: 'swap-backfill', title: 'Swap & Backfill', description: 'Manage availability and conflicts', component: SwapAndBackfillStep },
  { id: 'publish', title: 'Publish & Notify', description: 'Communications and schedules', component: PublishAndNotifyStep },
  { id: 'attendance', title: 'Attendance & Actuals', description: 'Performance metrics and actuals', component: AttendanceAndActualsStep }
]

export function TeamSchedulingWorkflow() {
  const [isSaving, setIsSaving] = useState(false)

  const handleWizardComplete = useCallback(async (finalData: Record<string, unknown>) => {
    try {
      setIsSaving(true)
      const data = finalData as TeamSchedulingWizardData
      const { data: userData, error: userError } = await supabase.auth.getUser()
      if (userError || !userData?.user?.id) throw new Error('User not authenticated')
      const userId = userData.user.id

      if (data.member) {
        const m = data.member
        const { error } = await supabase.from('team_members').insert({
          name: m.name,
          role: m.role,
          department: m.department || null,
          email: m.email || null,
          phone: m.phone || null,
          skills: m.skills ? parseCsv(m.skills) : null,
          certifications: m.certifications ? parseCsv(m.certifications) : null,
          availability: m.availability ? JSON.parse(JSON.stringify(m.availability)) : null,
          status: m.status,
          hire_date: m.hireDate || null,
          user_id: userId
        })
        if (error) throw error
      }

      if (data.shift) {
        const s = data.shift
        const { error } = await supabase.from('team_shifts').insert({
          shift_name: s.shiftName,
          start_time: s.startTime,
          end_time: s.endTime,
          duration_hours: s.durationHours ? Number(s.durationHours) : null,
          required_roles: s.requiredRoles ? parseCsv(s.requiredRoles) : null,
          location: s.location || null,
          notes: s.notes || null,
          is_active: s.isActive,
          user_id: userId
        })
        if (error) throw error
      }

      if (data.assignment) {
        const a = data.assignment
        const { error } = await supabase.from('team_shift_assignments').insert({
          shift_id: a.shiftId,
          member_id: a.memberId,
          assignment_date: a.assignmentDate,
          status: a.status,
          notes: a.notes || null,
          user_id: userId
        })
        if (error) throw error
      }

      if (data.availability) {
        const av = data.availability as AvailabilityFormValues
        const cf = data.availability as unknown as ConflictFormValues
        const { error } = await supabase.from('team_availability').insert({
          member_id: av.memberId,
          date: av.date,
          available: av.available,
          start_time: av.startTime || null,
          end_time: av.endTime || null,
          reason: av.reason || null,
          user_id: userId
        })
        if (error) throw error

        const { error: conflictError } = await supabase.from('team_scheduling_conflicts').insert({
          member_id: cf.memberId,
          conflict_type: cf.conflictType,
          description: cf.description,
          date: cf.date || null,
          shift_id: cf.shiftId || null,
          severity: cf.severity,
          status: cf.status,
          resolution: cf.resolution || null,
          resolved_date: cf.resolvedDate || null,
          user_id: userId
        })
        if (conflictError) throw conflictError
      }

      if (data.communication) {
        const c = data.communication as CommunicationFormValues
        const sc = data.communication as unknown as ScheduleFormValues
        const { error } = await supabase.from('team_communication').insert({
          type: c.type,
          subject: c.subject,
          message: c.message,
          recipients: c.recipients ? parseCsv(c.recipients) : null,
          send_date: c.sendDate,
          sent: c.sent,
          delivery_status: c.deliveryStatus,
          user_id: userId
        })
        if (error) throw error

        const { error: scheduleError } = await supabase.from('team_schedules').insert({
          schedule_name: sc.scheduleName,
          start_date: sc.startDate,
          end_date: sc.endDate,
          schedule_data: sc.scheduleData ? JSON.parse(JSON.stringify(sc.scheduleData)) : null,
          status: sc.status,
          user_id: userId
        })
        if (scheduleError) throw scheduleError
      }

      if (data.performance) {
        const p = data.performance
        const { error } = await supabase.from('team_performance_metrics').insert({
          member_id: p.memberId,
          metric_type: p.metricType,
          value: p.value ?? null,
          date: p.date,
          notes: p.notes || null,
          user_id: userId
        })
        if (error) throw error
      }
    } catch (error) {
      logger.error('Team scheduling workflow save failed', error)
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
          <h1 className="text-3xl font-bold">Team Scheduling Workflow</h1>
          <p className="text-muted-foreground mt-2">
            Build, assign, and reconcile shifts linked to manning requirements with compliance, RBAC, and auditability.
          </p>
        </div>

        <MultiStepWizard
          steps={steps}
          onComplete={handleWizardComplete}
          initialData={initialData}
          className="max-w-6xl mx-auto"
          autoSave
          persistenceKey="team-scheduling-workflow"
        />
        {isSaving && <p className="mt-4 text-sm text-muted-foreground">Saving team scheduling records...</p>}
      </div>
    </div>
  )
}

export default TeamSchedulingWorkflow
