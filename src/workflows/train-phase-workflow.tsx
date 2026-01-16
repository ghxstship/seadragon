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

const briefingsAllHandsSchema = z.object({
  eventId: z.string().min(1),
  date: z.string().min(1),
  time: z.string().min(1),
  location: z.string().min(1),
  attendees: z.string().optional(),
  agenda: z.string().optional(),
  materials: z.string().optional()
})

const briefingsDepartmentSchema = z.object({
  eventId: z.string().min(1),
  department: z.string().min(1),
  date: z.string().min(1),
  time: z.string().min(1),
  location: z.string().min(1),
  attendees: z.string().optional(),
  topics: z.string().optional(),
  coordinator: z.string().optional(),
  status: z.enum(['scheduled', 'completed', 'cancelled']).default('scheduled')
})

const safetySessionSchema = z.object({
  eventId: z.string().min(1),
  topic: z.string().min(1),
  date: z.string().min(1),
  time: z.string().min(1),
  location: z.string().min(1),
  trainer: z.string().optional(),
  attendees: z.string().optional(),
  duration: z.coerce.number().int().min(0),
  certification: z.boolean().default(false),
  status: z.enum(['scheduled', 'completed', 'cancelled']).default('scheduled')
})

const safetyCertificationSchema = z.object({
  eventId: z.string().min(1),
  certification: z.string().min(1),
  requiredFor: z.string().optional(),
  validity: z.string().optional(),
  renewal: z.string().optional(),
  status: z.enum(['current', 'expiring', 'expired']).default('current')
})

const rehearsalSchema = z.object({
  eventId: z.string().min(1),
  session: z.string().min(1),
  date: z.string().min(1),
  time: z.string().min(1),
  duration: z.coerce.number().int().min(0),
  focus: z.string().optional(),
  participants: z.string().optional(),
  objectives: z.string().optional(),
  status: z.enum(['scheduled', 'in_progress', 'completed']).default('scheduled')
})

const soundCheckSchema = z.object({
  eventId: z.string().min(1),
  act: z.string().min(1),
  date: z.string().min(1),
  time: z.string().min(1),
  duration: z.coerce.number().int().min(0),
  engineer: z.string().optional(),
  equipment: z.string().optional(),
  issues: z.string().optional(),
  status: z.enum(['scheduled', 'completed', 'issues']).default('scheduled')
})

const lightingCueSchema = z.object({
  eventId: z.string().min(1),
  number: z.coerce.number().int().min(0),
  name: z.string().min(1),
  timing: z.string().min(1),
  duration: z.string().optional(),
  description: z.string().optional(),
  programmer: z.string().optional(),
  status: z.enum(['programmed', 'tested', 'approved']).default('programmed')
})

const evacuationSchema = z.object({
  eventId: z.string().min(1),
  route: z.string().min(1),
  primaryRoute: z.boolean().default(false),
  capacity: z.coerce.number().int().optional(),
  landmarks: z.string().optional(),
  time: z.string().optional()
})

const commsTestSchema = z.object({
  eventId: z.string().min(1),
  system: z.string().min(1),
  type: z.string().min(1),
  test: z.string().min(1),
  result: z.enum(['passed', 'failed', 'issues']),
  technician: z.string().optional(),
  date: z.string().optional()
})

type BriefingAllHandsFormValues = z.infer<typeof briefingsAllHandsSchema>
type BriefingDeptFormValues = z.infer<typeof briefingsDepartmentSchema>
type SafetySessionFormValues = z.infer<typeof safetySessionSchema>
type SafetyCertFormValues = z.infer<typeof safetyCertificationSchema>
type RehearsalFormValues = z.infer<typeof rehearsalSchema>
type SoundCheckFormValues = z.infer<typeof soundCheckSchema>
type LightingCueFormValues = z.infer<typeof lightingCueSchema>
type EvacFormValues = z.infer<typeof evacuationSchema>
type CommsTestFormValues = z.infer<typeof commsTestSchema>

type TrainWizardData = {
  allHands?: BriefingAllHandsFormValues
  department?: BriefingDeptFormValues
  safetySession?: SafetySessionFormValues
  safetyCert?: SafetyCertFormValues
  rehearsal?: RehearsalFormValues
  soundCheck?: SoundCheckFormValues
  lighting?: LightingCueFormValues
  evacuation?: EvacFormValues
  commsTest?: CommsTestFormValues
}

function parseArray(value?: string) {
  if (!value || !value.trim()) return [] as string[]
  return value.split(',').map((v) => v.trim()).filter(Boolean)
}

function createStep<T extends Record<string, unknown>>(opts: {
  schema: z.ZodSchema
  dataKey: keyof TrainWizardData
  defaults: T
  render: (form: ReturnType<typeof useForm<T>>) => React.ReactNode
}) {
  return function Step({ data, onChange, onValidationChange }: StepProps) {
    const existing = (data as TrainWizardData)[opts.dataKey] as T | undefined
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

const AllHandsStep = createStep<BriefingAllHandsFormValues>({
  schema: briefingsAllHandsSchema,
  dataKey: 'allHands',
  defaults: { eventId: '', date: '', time: '', location: '', attendees: '', agenda: '', materials: '' },
  render: (form) => (
    <>
      <FormField control={form.control} name={'eventId' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Event ID</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'date' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Date</FormLabel>
          <FormControl><Input type="datetime-local" {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'time' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Time</FormLabel>
          <FormControl><Input {...field}/></FormControl>
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
      <FormField control={form.control} name={'attendees' as never} render={({ field }) => (
        <FormItem className="md:col-span-2">
          <FormLabel>Attendees (comma separated)</FormLabel>
          <FormControl><Textarea rows={2} {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'agenda' as never} render={({ field }) => (
        <FormItem className="md:col-span-2">
          <FormLabel>Agenda (comma separated)</FormLabel>
          <FormControl><Textarea rows={2} {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'materials' as never} render={({ field }) => (
        <FormItem className="md:col-span-2">
          <FormLabel>Materials (comma separated)</FormLabel>
          <FormControl><Textarea rows={2} {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
    </>
  )
})

const DepartmentBriefingStep = createStep<BriefingDeptFormValues>({
  schema: briefingsDepartmentSchema,
  dataKey: 'department',
  defaults: { eventId: '', department: '', date: '', time: '', location: '', attendees: '', topics: '', coordinator: '', status: 'scheduled' },
  render: (form) => (
    <>
      <FormField control={form.control} name={'eventId' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Event ID</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'department' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Department</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'date' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Date</FormLabel>
          <FormControl><Input type="datetime-local" {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'time' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Time</FormLabel>
          <FormControl><Input {...field}/></FormControl>
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
      <FormField control={form.control} name={'attendees' as never} render={({ field }) => (
        <FormItem className="md:col-span-2">
          <FormLabel>Attendees (comma separated)</FormLabel>
          <FormControl><Textarea rows={2} {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'topics' as never} render={({ field }) => (
        <FormItem className="md:col-span-2">
          <FormLabel>Topics (comma separated)</FormLabel>
          <FormControl><Textarea rows={2} {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'coordinator' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Coordinator</FormLabel>
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

const SafetySessionStep = createStep<SafetySessionFormValues>({
  schema: safetySessionSchema,
  dataKey: 'safetySession',
  defaults: { eventId: '', topic: '', date: '', time: '', location: '', trainer: '', attendees: '', duration: 0, certification: false, status: 'scheduled' },
  render: (form) => (
    <>
      <FormField control={form.control} name={'eventId' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Event ID</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'topic' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Topic</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'date' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Date</FormLabel>
          <FormControl><Input type="datetime-local" {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'time' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Time</FormLabel>
          <FormControl><Input {...field}/></FormControl>
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
      <FormField control={form.control} name={'trainer' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Trainer</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'attendees' as never} render={({ field }) => (
        <FormItem className="md:col-span-2">
          <FormLabel>Attendees (comma separated)</FormLabel>
          <FormControl><Textarea rows={2} {...field}/></FormControl>
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
      <FormField control={form.control} name={'certification' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Certification</FormLabel>
          <FormControl><Input type="checkbox" checked={field.value ?? false} onChange={e => field.onChange(e.target.checked)}/></FormControl>
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

const SafetyCertStep = createStep<SafetyCertFormValues>({
  schema: safetyCertificationSchema,
  dataKey: 'safetyCert',
  defaults: { eventId: '', certification: '', requiredFor: '', validity: '', renewal: '', status: 'current' },
  render: (form) => (
    <>
      <FormField control={form.control} name={'eventId' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Event ID</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'certification' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Certification</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'requiredFor' as never} render={({ field }) => (
        <FormItem className="md:col-span-2">
          <FormLabel>Required For (comma separated)</FormLabel>
          <FormControl><Textarea rows={2} {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'validity' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Validity</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'renewal' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Renewal</FormLabel>
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

const RehearsalStep = createStep<RehearsalFormValues>({
  schema: rehearsalSchema,
  dataKey: 'rehearsal',
  defaults: { eventId: '', session: '', date: '', time: '', duration: 0, focus: '', participants: '', objectives: '', status: 'scheduled' },
  render: (form) => (
    <>
      <FormField control={form.control} name={'eventId' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Event ID</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'session' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Session</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'date' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Date</FormLabel>
          <FormControl><Input type="datetime-local" {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'time' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Time</FormLabel>
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
      <FormField control={form.control} name={'focus' as never} render={({ field }) => (
        <FormItem className="md:col-span-2">
          <FormLabel>Focus (comma separated)</FormLabel>
          <FormControl><Textarea rows={2} {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'participants' as never} render={({ field }) => (
        <FormItem className="md:col-span-2">
          <FormLabel>Participants (comma separated)</FormLabel>
          <FormControl><Textarea rows={2} {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'objectives' as never} render={({ field }) => (
        <FormItem className="md:col-span-2">
          <FormLabel>Objectives (comma separated)</FormLabel>
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

const SoundCheckStep = createStep<SoundCheckFormValues>({
  schema: soundCheckSchema,
  dataKey: 'soundCheck',
  defaults: { eventId: '', act: '', date: '', time: '', duration: 0, engineer: '', equipment: '', issues: '', status: 'scheduled' },
  render: (form) => (
    <>
      <FormField control={form.control} name={'eventId' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Event ID</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'act' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Act</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'date' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Date</FormLabel>
          <FormControl><Input type="datetime-local" {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'time' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Time</FormLabel>
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
      <FormField control={form.control} name={'engineer' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Engineer</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'equipment' as never} render={({ field }) => (
        <FormItem className="md:col-span-2">
          <FormLabel>Equipment (comma separated)</FormLabel>
          <FormControl><Textarea rows={2} {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'issues' as never} render={({ field }) => (
        <FormItem className="md:col-span-2">
          <FormLabel>Issues (comma separated)</FormLabel>
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

const LightingStep = createStep<LightingCueFormValues>({
  schema: lightingCueSchema,
  dataKey: 'lighting',
  defaults: { eventId: '', number: 0, name: '', timing: '', duration: '', description: '', programmer: '', status: 'programmed' },
  render: (form) => (
    <>
      <FormField control={form.control} name={'eventId' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Event ID</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'number' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Cue Number</FormLabel>
          <FormControl><Input type="number" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
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
      <FormField control={form.control} name={'timing' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Timing</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'duration' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Duration</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'description' as never} render={({ field }) => (
        <FormItem className="md:col-span-2">
          <FormLabel>Description</FormLabel>
          <FormControl><Textarea rows={2} {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'programmer' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Programmer</FormLabel>
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

const EvacuationStep = createStep<EvacFormValues>({
  schema: evacuationSchema,
  dataKey: 'evacuation',
  defaults: { eventId: '', route: '', primaryRoute: false, capacity: undefined, landmarks: '', time: '' },
  render: (form) => (
    <>
      <FormField control={form.control} name={'eventId' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Event ID</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'route' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Route</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'primaryRoute' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Primary Route</FormLabel>
          <FormControl><Input type="checkbox" checked={field.value ?? false} onChange={e => field.onChange(e.target.checked)}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'capacity' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Capacity</FormLabel>
          <FormControl><Input type="number" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'landmarks' as never} render={({ field }) => (
        <FormItem className="md:col-span-2">
          <FormLabel>Landmarks (comma separated)</FormLabel>
          <FormControl><Textarea rows={2} {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'time' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Evacuation Time</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
    </>
  )
})

const CommsTestStep = createStep<CommsTestFormValues>({
  schema: commsTestSchema,
  dataKey: 'commsTest',
  defaults: { eventId: '', system: '', type: '', test: '', result: 'passed', technician: '', date: '' },
  render: (form) => (
    <>
      <FormField control={form.control} name={'eventId' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Event ID</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'system' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>System</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'type' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Type</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'test' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Test</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'result' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Result</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'technician' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Technician</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'date' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Date</FormLabel>
          <FormControl><Input type="datetime-local" {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
    </>
  )
})

const steps = [
  { id: 'allHands', title: 'All-hands Briefing', description: 'All-hands schedules, attendees, materials', component: AllHandsStep },
  { id: 'department', title: 'Department Briefing', description: 'Dept briefings with topics and coordinators', component: DepartmentBriefingStep },
  { id: 'safetySession', title: 'Safety Training Session', description: 'Safety sessions and attendance', component: SafetySessionStep },
  { id: 'safetyCert', title: 'Safety Certifications', description: 'Certifications and renewals', component: SafetyCertStep },
  { id: 'rehearsal', title: 'Technical Rehearsal', description: 'Rehearsals with objectives and participants', component: RehearsalStep },
  { id: 'soundCheck', title: 'Sound Checks', description: 'Sound checks for acts and equipment', component: SoundCheckStep },
  { id: 'lighting', title: 'Lighting Cues', description: 'Lighting cues and programming status', component: LightingStep },
  { id: 'evacuation', title: 'Emergency Evacuation', description: 'Evacuation routes and capacities', component: EvacuationStep },
  { id: 'commsTest', title: 'Comms Testing', description: 'Comms systems tests and results', component: CommsTestStep }
]

export default function TrainPhaseWorkflow() {
  const [isSaving, setIsSaving] = useState(false)

  const handleWizardComplete = useCallback(async (finalData: Record<string, unknown>) => {
    try {
      setIsSaving(true)
      const data = finalData as TrainWizardData
      const { data: userData, error: userError } = await supabase.auth.getUser()
      if (userError || !userData?.user?.id) throw new Error('User not authenticated for train workflow')

      if (data.allHands) {
        const { error } = await supabase.from('train_briefings_all_hands').insert({
          event_id: data.allHands.eventId,
          date: data.allHands.date,
          time: data.allHands.time,
          location: data.allHands.location,
          attendees: parseArray(data.allHands.attendees),
          agenda: parseArray(data.allHands.agenda),
          materials: parseArray(data.allHands.materials)
        })
        if (error) throw error
      }

      if (data.department) {
        const { error } = await supabase.from('train_briefings_department').insert({
          event_id: data.department.eventId,
          department: data.department.department,
          date: data.department.date,
          time: data.department.time,
          location: data.department.location,
          attendees: parseArray(data.department.attendees),
          topics: parseArray(data.department.topics),
          coordinator: data.department.coordinator,
          status: data.department.status
        })
        if (error) throw error
      }

      if (data.safetySession) {
        const { error } = await supabase.from('train_safety_training_sessions').insert({
          event_id: data.safetySession.eventId,
          topic: data.safetySession.topic,
          date: data.safetySession.date,
          time: data.safetySession.time,
          location: data.safetySession.location,
          trainer: data.safetySession.trainer,
          attendees: parseArray(data.safetySession.attendees),
          duration: data.safetySession.duration,
          certification: data.safetySession.certification ?? false,
          status: data.safetySession.status
        })
        if (error) throw error
      }

      if (data.safetyCert) {
        const { error } = await supabase.from('train_safety_training_certifications').insert({
          event_id: data.safetyCert.eventId,
          certification: data.safetyCert.certification,
          required_for: parseArray(data.safetyCert.requiredFor),
          validity: data.safetyCert.validity,
          renewal: data.safetyCert.renewal,
          status: data.safetyCert.status
        })
        if (error) throw error
      }

      if (data.rehearsal) {
        const { error } = await supabase.from('train_technical_rehearsals_schedule').insert({
          event_id: data.rehearsal.eventId,
          session: data.rehearsal.session,
          date: data.rehearsal.date,
          time: data.rehearsal.time,
          duration: data.rehearsal.duration,
          focus: parseArray(data.rehearsal.focus),
          participants: parseArray(data.rehearsal.participants),
          objectives: parseArray(data.rehearsal.objectives),
          status: data.rehearsal.status
        })
        if (error) throw error
      }

      if (data.soundCheck) {
        const { error } = await supabase.from('train_sound_checks_sessions').insert({
          event_id: data.soundCheck.eventId,
          act: data.soundCheck.act,
          date: data.soundCheck.date,
          time: data.soundCheck.time,
          duration: data.soundCheck.duration,
          engineer: data.soundCheck.engineer,
          equipment: parseArray(data.soundCheck.equipment),
          issues: parseArray(data.soundCheck.issues),
          status: data.soundCheck.status
        })
        if (error) throw error
      }

      if (data.lighting) {
        const { error } = await supabase.from('train_lighting_cues').insert({
          event_id: data.lighting.eventId,
          number: data.lighting.number,
          name: data.lighting.name,
          timing: data.lighting.timing,
          duration: data.lighting.duration,
          description: data.lighting.description,
          programmer: data.lighting.programmer,
          status: data.lighting.status
        })
        if (error) throw error
      }

      if (data.evacuation) {
        const { error } = await supabase.from('train_emergency_procedures_evacuation').insert({
          event_id: data.evacuation.eventId,
          route: data.evacuation.route,
          primary_route: data.evacuation.primaryRoute ?? false,
          capacity: data.evacuation.capacity ?? null,
          landmarks: parseArray(data.evacuation.landmarks),
          time: data.evacuation.time
        })
        if (error) throw error
      }

      if (data.commsTest) {
        const { error } = await supabase.from('train_communication_testing_systems').insert({
          event_id: data.commsTest.eventId,
          system: data.commsTest.system,
          type: data.commsTest.type,
          test: data.commsTest.test,
          result: data.commsTest.result,
          technician: data.commsTest.technician,
          date: data.commsTest.date || null
        })
        if (error) throw error
      }

    } catch (error) {
      logger.error('Train phase workflow save failed', error)
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
          <h1 className="text-3xl font-bold">Train Phase Workflow</h1>
          <p className="text-muted-foreground mt-2">
            Coordinate briefings, safety sessions, rehearsals, sound checks, lighting, evacuation, and comms testing with Supabase persistence.
          </p>
        </div>

        <MultiStepWizard
          steps={steps}
          onComplete={handleWizardComplete}
          initialData={initialData}
          className="max-w-6xl mx-auto"
          autoSave
          persistenceKey="train-phase-workflow"
        />
        {isSaving && <p className="mt-4 text-sm text-muted-foreground">Saving train phase records...</p>}
      </div>
    </div>
  )
}
