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

// Schemas
const infoDeskSchema = z.object({
  location: z.string().min(1),
  operatingHours: z.string().optional(),
  services: z.string().optional(),
  staffing: z.string().optional(),
  satisfaction: z.coerce.number().optional()
})

const signageSchema = z.object({
  signageType: z.string().min(1),
  location: z.string().optional(),
  languages: z.string().optional(),
  effectiveness: z.coerce.number().optional()
})

const digitalGuideSchema = z.object({
  guideType: z.string().min(1),
  platform: z.string().optional(),
  features: z.string().optional(),
  usageCount: z.coerce.number().int().optional()
})

const accessibilitySchema = z.object({
  serviceName: z.string().min(1),
  location: z.string().optional(),
  availability: z.string().optional(),
  utilization: z.coerce.number().int().optional()
})

const vipLoungeSchema = z.object({
  loungeLocation: z.string().min(1),
  capacity: z.coerce.number().int().optional(),
  amenities: z.string().optional(),
  accessLevels: z.string().optional(),
  utilization: z.coerce.number().optional()
})

const conciergeSchema = z.object({
  serviceName: z.string().min(1),
  availability: z.string().optional(),
  requestCount: z.coerce.number().int().optional(),
  satisfaction: z.coerce.number().optional()
})

const meetGreetSchema = z.object({
  artistName: z.string().min(1),
  meetTime: z.string().optional(),
  location: z.string().optional(),
  attendeesCount: z.coerce.number().int().optional(),
  feedbackScore: z.coerce.number().optional()
})

const brandActivationSchema = z.object({
  brandName: z.string().min(1),
  activationLocation: z.string().optional(),
  activationType: z.string().optional(),
  engagementCount: z.coerce.number().int().optional(),
  impressions: z.coerce.number().int().optional(),
  roi: z.coerce.number().optional()
})

const interactiveSchema = z.object({
  experienceName: z.string().min(1),
  experienceLocation: z.string().optional(),
  technologyUsed: z.string().optional(),
  participantsCount: z.coerce.number().int().optional(),
  satisfaction: z.coerce.number().optional()
})

const samplingSchema = z.object({
  productName: z.string().min(1),
  samplingLocation: z.string().optional(),
  distributionCount: z.coerce.number().int().optional(),
  engagementRate: z.coerce.number().optional(),
  conversionRate: z.coerce.number().optional()
})

const performanceSchema = z.object({
  actName: z.string().min(1),
  stageName: z.string().optional(),
  performanceStart: z.string().optional(),
  durationMinutes: z.coerce.number().int().optional(),
  attendanceCount: z.coerce.number().int().optional(),
  engagementScore: z.coerce.number().optional()
})

const entertainmentAreaSchema = z.object({
  areaName: z.string().min(1),
  activities: z.string().optional(),
  capacity: z.coerce.number().int().optional(),
  utilization: z.coerce.number().optional(),
  satisfaction: z.coerce.number().optional()
})

const specialEventSchema = z.object({
  eventName: z.string().min(1),
  eventTime: z.string().optional(),
  eventLocation: z.string().optional(),
  participantsCount: z.coerce.number().int().optional(),
  feedbackScore: z.coerce.number().optional()
})

const servicePointSchema = z.object({
  serviceLocation: z.string().min(1),
  serviceType: z.string().optional(),
  capacity: z.coerce.number().int().optional(),
  averageWaitTime: z.coerce.number().int().optional(),
  satisfaction: z.coerce.number().optional(),
  revenue: z.coerce.number().optional()
})

const popularItemSchema = z.object({
  itemName: z.string().min(1),
  ordersCount: z.coerce.number().int().optional(),
  satisfaction: z.coerce.number().optional(),
  revenue: z.coerce.number().optional()
})

const menuAvailabilitySchema = z.object({
  itemName: z.string().min(1),
  currentStock: z.coerce.number().int().optional(),
  reorderPoint: z.coerce.number().int().optional(),
  availabilityStatus: z.enum(['available', 'low', 'out']).default('available')
})

const specialDietSchema = z.object({
  requirement: z.string().min(1),
  requestsCount: z.coerce.number().int().optional(),
  fulfillmentRate: z.coerce.number().optional(),
  satisfaction: z.coerce.number().optional()
})

const merchandiseSchema = z.object({
  itemName: z.string().min(1),
  price: z.coerce.number().optional(),
  salesCount: z.coerce.number().int().optional(),
  revenue: z.coerce.number().optional(),
  satisfaction: z.coerce.number().optional()
})

const checkoutSchema = z.object({
  checkoutLocation: z.string().min(1),
  technologyUsed: z.string().optional(),
  efficiency: z.coerce.number().optional(),
  satisfaction: z.coerce.number().optional(),
  revenue: z.coerce.number().optional()
})

const retailInventorySchema = z.object({
  itemName: z.string().min(1),
  currentStock: z.coerce.number().int().optional(),
  salesCount: z.coerce.number().int().optional(),
  turnoverRate: z.coerce.number().optional(),
  inventoryStatus: z.enum(['optimal', 'overstock', 'understock']).default('optimal')
})

const socialContentSchema = z.object({
  platform: z.string().min(1),
  contentType: z.string().optional(),
  postsCount: z.coerce.number().int().optional(),
  engagementRate: z.coerce.number().optional(),
  reachCount: z.coerce.number().int().optional(),
  sentiment: z.enum(['positive', 'neutral', 'negative']).default('neutral')
})

const liveStreamingSchema = z.object({
  platform: z.string().min(1),
  eventName: z.string().optional(),
  viewersCount: z.coerce.number().int().optional(),
  durationMinutes: z.coerce.number().int().optional(),
  engagementRate: z.coerce.number().optional()
})

// Types
type ExperienceWizardData = {
  infoDesk?: z.infer<typeof infoDeskSchema>
  signage?: z.infer<typeof signageSchema>
  digitalGuide?: z.infer<typeof digitalGuideSchema>
  accessibility?: z.infer<typeof accessibilitySchema>
  vipLounge?: z.infer<typeof vipLoungeSchema>
  concierge?: z.infer<typeof conciergeSchema>
  meetGreet?: z.infer<typeof meetGreetSchema>
  brandActivation?: z.infer<typeof brandActivationSchema>
  interactive?: z.infer<typeof interactiveSchema>
  sampling?: z.infer<typeof samplingSchema>
  performance?: z.infer<typeof performanceSchema>
  entertainment?: z.infer<typeof entertainmentAreaSchema>
  specialEvent?: z.infer<typeof specialEventSchema>
  servicePoint?: z.infer<typeof servicePointSchema>
  popularItem?: z.infer<typeof popularItemSchema>
  menuAvailability?: z.infer<typeof menuAvailabilitySchema>
  specialDiet?: z.infer<typeof specialDietSchema>
  merchandise?: z.infer<typeof merchandiseSchema>
  checkout?: z.infer<typeof checkoutSchema>
  retailInventory?: z.infer<typeof retailInventorySchema>
  socialContent?: z.infer<typeof socialContentSchema>
  liveStreaming?: z.infer<typeof liveStreamingSchema>
}

function parseJson(value?: string) {
  if (!value || !value.trim()) return null
  try { return JSON.parse(value) } catch (err) { logger.error('JSON parse failed', err); return null }
}

function createStep<T extends Record<string, unknown>>(opts: {
  schema: z.ZodSchema
  dataKey: keyof ExperienceWizardData
  defaults: T
  render: (form: ReturnType<typeof useForm<T>>) => React.ReactNode
}) {
  return function Step({ data, onChange, onValidationChange }: StepProps) {
    const existing = (data as ExperienceWizardData)[opts.dataKey] as T | undefined
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

// Steps definitions (focus on key tables to cover breadth; no partial TODOs)
const InfoDeskStep = createStep<z.infer<typeof infoDeskSchema>>({
  schema: infoDeskSchema,
  dataKey: 'infoDesk',
  defaults: { location: '', operatingHours: '', services: '', staffing: '', satisfaction: undefined },
  render: (form) => (
    <>
      <FormField control={form.control} name={'location' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Location</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'operatingHours' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Operating Hours</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'services' as never} render={({ field }) => (
        <FormItem className="md:col-span-2">
          <FormLabel>Services (JSON)</FormLabel>
          <FormControl><Textarea rows={3} {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'staffing' as never} render={({ field }) => (
        <FormItem className="md:col-span-2">
          <FormLabel>Staffing (JSON)</FormLabel>
          <FormControl><Textarea rows={3} {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'satisfaction' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Satisfaction</FormLabel>
          <FormControl><Input type="number" step="0.01" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
    </>
  )
})

const SignageStep = createStep<z.infer<typeof signageSchema>>({
  schema: signageSchema,
  dataKey: 'signage',
  defaults: { signageType: '', location: '', languages: '', effectiveness: undefined },
  render: (form) => (
    <>
      <FormField control={form.control} name={'signageType' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Signage Type</FormLabel>
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
      <FormField control={form.control} name={'languages' as never} render={({ field }) => (
        <FormItem className="md:col-span-2">
          <FormLabel>Languages (JSON)</FormLabel>
          <FormControl><Textarea rows={3} {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'effectiveness' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Effectiveness</FormLabel>
          <FormControl><Input type="number" step="0.01" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
    </>
  )
})

const DigitalGuideStep = createStep<z.infer<typeof digitalGuideSchema>>({
  schema: digitalGuideSchema,
  dataKey: 'digitalGuide',
  defaults: { guideType: '', platform: '', features: '', usageCount: undefined },
  render: (form) => (
    <>
      <FormField control={form.control} name={'guideType' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Guide Type</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'platform' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Platform</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'features' as never} render={({ field }) => (
        <FormItem className="md:col-span-2">
          <FormLabel>Features (JSON)</FormLabel>
          <FormControl><Textarea rows={3} {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'usageCount' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Usage Count</FormLabel>
          <FormControl><Input type="number" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
    </>
  )
})

const AccessibilityStep = createStep<z.infer<typeof accessibilitySchema>>({
  schema: accessibilitySchema,
  dataKey: 'accessibility',
  defaults: { serviceName: '', location: '', availability: '', utilization: undefined },
  render: (form) => (
    <>
      <FormField control={form.control} name={'serviceName' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Service Name</FormLabel>
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
      <FormField control={form.control} name={'availability' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Availability</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'utilization' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Utilization</FormLabel>
          <FormControl><Input type="number" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
    </>
  )
})

const VipStep = createStep<z.infer<typeof vipLoungeSchema>>({
  schema: vipLoungeSchema,
  dataKey: 'vipLounge',
  defaults: { loungeLocation: '', capacity: undefined, amenities: '', accessLevels: '', utilization: undefined },
  render: (form) => (
    <>
      <FormField control={form.control} name={'loungeLocation' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Lounge Location</FormLabel>
          <FormControl><Input {...field}/></FormControl>
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
      <FormField control={form.control} name={'amenities' as never} render={({ field }) => (
        <FormItem className="md:col-span-2">
          <FormLabel>Amenities (JSON)</FormLabel>
          <FormControl><Textarea rows={3} {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'accessLevels' as never} render={({ field }) => (
        <FormItem className="md:col-span-2">
          <FormLabel>Access Levels (JSON)</FormLabel>
          <FormControl><Textarea rows={3} {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'utilization' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Utilization</FormLabel>
          <FormControl><Input type="number" step="0.01" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
    </>
  )
})

const ConciergeStep = createStep<z.infer<typeof conciergeSchema>>({
  schema: conciergeSchema,
  dataKey: 'concierge',
  defaults: { serviceName: '', availability: '', requestCount: undefined, satisfaction: undefined },
  render: (form) => (
    <>
      <FormField control={form.control} name={'serviceName' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Service Name</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'availability' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Availability</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'requestCount' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Request Count</FormLabel>
          <FormControl><Input type="number" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'satisfaction' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Satisfaction</FormLabel>
          <FormControl><Input type="number" step="0.01" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
    </>
  )
})

const MeetGreetStep = createStep<z.infer<typeof meetGreetSchema>>({
  schema: meetGreetSchema,
  dataKey: 'meetGreet',
  defaults: { artistName: '', meetTime: '', location: '', attendeesCount: undefined, feedbackScore: undefined },
  render: (form) => (
    <>
      <FormField control={form.control} name={'artistName' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Artist Name</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'meetTime' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Meet Time</FormLabel>
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
      <FormField control={form.control} name={'attendeesCount' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Attendees Count</FormLabel>
          <FormControl><Input type="number" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'feedbackScore' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Feedback Score</FormLabel>
          <FormControl><Input type="number" step="0.01" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
    </>
  )
})

const BrandActivationStep = createStep<z.infer<typeof brandActivationSchema>>({
  schema: brandActivationSchema,
  dataKey: 'brandActivation',
  defaults: { brandName: '', activationLocation: '', activationType: '', engagementCount: undefined, impressions: undefined, roi: undefined },
  render: (form) => (
    <>
      <FormField control={form.control} name={'brandName' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Brand Name</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'activationLocation' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Activation Location</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'activationType' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Activation Type</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'engagementCount' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Engagement Count</FormLabel>
          <FormControl><Input type="number" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'impressions' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Impressions</FormLabel>
          <FormControl><Input type="number" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'roi' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>ROI</FormLabel>
          <FormControl><Input type="number" step="0.01" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
    </>
  )
})

const InteractiveStep = createStep<z.infer<typeof interactiveSchema>>({
  schema: interactiveSchema,
  dataKey: 'interactive',
  defaults: { experienceName: '', experienceLocation: '', technologyUsed: '', participantsCount: undefined, satisfaction: undefined },
  render: (form) => (
    <>
      <FormField control={form.control} name={'experienceName' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Experience Name</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'experienceLocation' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Location</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'technologyUsed' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Technology Used</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'participantsCount' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Participants Count</FormLabel>
          <FormControl><Input type="number" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'satisfaction' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Satisfaction</FormLabel>
          <FormControl><Input type="number" step="0.01" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
    </>
  )
})

const SamplingStep = createStep<z.infer<typeof samplingSchema>>({
  schema: samplingSchema,
  dataKey: 'sampling',
  defaults: { productName: '', samplingLocation: '', distributionCount: undefined, engagementRate: undefined, conversionRate: undefined },
  render: (form) => (
    <>
      <FormField control={form.control} name={'productName' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Product Name</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'samplingLocation' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Sampling Location</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'distributionCount' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Distribution Count</FormLabel>
          <FormControl><Input type="number" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'engagementRate' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Engagement Rate</FormLabel>
          <FormControl><Input type="number" step="0.01" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'conversionRate' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Conversion Rate</FormLabel>
          <FormControl><Input type="number" step="0.01" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
    </>
  )
})

const PerformanceStep = createStep<z.infer<typeof performanceSchema>>({
  schema: performanceSchema,
  dataKey: 'performance',
  defaults: { actName: '', stageName: '', performanceStart: '', durationMinutes: undefined, attendanceCount: undefined, engagementScore: undefined },
  render: (form) => (
    <>
      <FormField control={form.control} name={'actName' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Act Name</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'stageName' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Stage Name</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'performanceStart' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Performance Start</FormLabel>
          <FormControl><Input type="datetime-local" {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'durationMinutes' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Duration (minutes)</FormLabel>
          <FormControl><Input type="number" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'attendanceCount' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Attendance</FormLabel>
          <FormControl><Input type="number" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'engagementScore' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Engagement Score</FormLabel>
          <FormControl><Input type="number" step="0.01" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
    </>
  )
})

const EntertainmentAreaStep = createStep<z.infer<typeof entertainmentAreaSchema>>({
  schema: entertainmentAreaSchema,
  dataKey: 'entertainment',
  defaults: { areaName: '', activities: '', capacity: undefined, utilization: undefined, satisfaction: undefined },
  render: (form) => (
    <>
      <FormField control={form.control} name={'areaName' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Area Name</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'activities' as never} render={({ field }) => (
        <FormItem className="md:col-span-2">
          <FormLabel>Activities (JSON)</FormLabel>
          <FormControl><Textarea rows={3} {...field}/></FormControl>
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
      <FormField control={form.control} name={'utilization' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Utilization</FormLabel>
          <FormControl><Input type="number" step="0.01" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'satisfaction' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Satisfaction</FormLabel>
          <FormControl><Input type="number" step="0.01" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
    </>
  )
})

const SpecialEventStep = createStep<z.infer<typeof specialEventSchema>>({
  schema: specialEventSchema,
  dataKey: 'specialEvent',
  defaults: { eventName: '', eventTime: '', eventLocation: '', participantsCount: undefined, feedbackScore: undefined },
  render: (form) => (
    <>
      <FormField control={form.control} name={'eventName' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Event Name</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'eventTime' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Event Time</FormLabel>
          <FormControl><Input type="datetime-local" {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'eventLocation' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Event Location</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'participantsCount' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Participants Count</FormLabel>
          <FormControl><Input type="number" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'feedbackScore' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Feedback Score</FormLabel>
          <FormControl><Input type="number" step="0.01" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
    </>
  )
})

const ServicePointStep = createStep<z.infer<typeof servicePointSchema>>({
  schema: servicePointSchema,
  dataKey: 'servicePoint',
  defaults: { serviceLocation: '', serviceType: '', capacity: undefined, averageWaitTime: undefined, satisfaction: undefined, revenue: undefined },
  render: (form) => (
    <>
      <FormField control={form.control} name={'serviceLocation' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Service Location</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'serviceType' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Service Type</FormLabel>
          <FormControl><Input {...field}/></FormControl>
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
      <FormField control={form.control} name={'averageWaitTime' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Average Wait Time (mins)</FormLabel>
          <FormControl><Input type="number" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'satisfaction' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Satisfaction</FormLabel>
          <FormControl><Input type="number" step="0.01" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'revenue' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Revenue</FormLabel>
          <FormControl><Input type="number" step="0.01" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
    </>
  )
})

const PopularItemStep = createStep<z.infer<typeof popularItemSchema>>({
  schema: popularItemSchema,
  dataKey: 'popularItem',
  defaults: { itemName: '', ordersCount: undefined, satisfaction: undefined, revenue: undefined },
  render: (form) => (
    <>
      <FormField control={form.control} name={'itemName' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Item Name</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'ordersCount' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Orders Count</FormLabel>
          <FormControl><Input type="number" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'satisfaction' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Satisfaction</FormLabel>
          <FormControl><Input type="number" step="0.01" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'revenue' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Revenue</FormLabel>
          <FormControl><Input type="number" step="0.01" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
    </>
  )
})

const MenuAvailabilityStep = createStep<z.infer<typeof menuAvailabilitySchema>>({
  schema: menuAvailabilitySchema,
  dataKey: 'menuAvailability',
  defaults: { itemName: '', currentStock: undefined, reorderPoint: undefined, availabilityStatus: 'available' },
  render: (form) => (
    <>
      <FormField control={form.control} name={'itemName' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Item Name</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'currentStock' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Current Stock</FormLabel>
          <FormControl><Input type="number" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'reorderPoint' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Reorder Point</FormLabel>
          <FormControl><Input type="number" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'availabilityStatus' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Availability Status</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
    </>
  )
})

const SpecialDietStep = createStep<z.infer<typeof specialDietSchema>>({
  schema: specialDietSchema,
  dataKey: 'specialDiet',
  defaults: { requirement: '', requestsCount: undefined, fulfillmentRate: undefined, satisfaction: undefined },
  render: (form) => (
    <>
      <FormField control={form.control} name={'requirement' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Requirement</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'requestsCount' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Requests Count</FormLabel>
          <FormControl><Input type="number" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'fulfillmentRate' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Fulfillment Rate</FormLabel>
          <FormControl><Input type="number" step="0.01" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'satisfaction' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Satisfaction</FormLabel>
          <FormControl><Input type="number" step="0.01" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
    </>
  )
})

const MerchandiseStep = createStep<z.infer<typeof merchandiseSchema>>({
  schema: merchandiseSchema,
  dataKey: 'merchandise',
  defaults: { itemName: '', price: undefined, salesCount: undefined, revenue: undefined, satisfaction: undefined },
  render: (form) => (
    <>
      <FormField control={form.control} name={'itemName' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Item Name</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'price' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Price</FormLabel>
          <FormControl><Input type="number" step="0.01" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'salesCount' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Sales Count</FormLabel>
          <FormControl><Input type="number" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'revenue' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Revenue</FormLabel>
          <FormControl><Input type="number" step="0.01" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'satisfaction' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Satisfaction</FormLabel>
          <FormControl><Input type="number" step="0.01" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
    </>
  )
})

const CheckoutStep = createStep<z.infer<typeof checkoutSchema>>({
  schema: checkoutSchema,
  dataKey: 'checkout',
  defaults: { checkoutLocation: '', technologyUsed: '', efficiency: undefined, satisfaction: undefined, revenue: undefined },
  render: (form) => (
    <>
      <FormField control={form.control} name={'checkoutLocation' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Checkout Location</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'technologyUsed' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Technology Used</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'efficiency' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Efficiency</FormLabel>
          <FormControl><Input type="number" step="0.01" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'satisfaction' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Satisfaction</FormLabel>
          <FormControl><Input type="number" step="0.01" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'revenue' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Revenue</FormLabel>
          <FormControl><Input type="number" step="0.01" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
    </>
  )
})

const RetailInventoryStep = createStep<z.infer<typeof retailInventorySchema>>({
  schema: retailInventorySchema,
  dataKey: 'retailInventory',
  defaults: { itemName: '', currentStock: undefined, salesCount: undefined, turnoverRate: undefined, inventoryStatus: 'optimal' },
  render: (form) => (
    <>
      <FormField control={form.control} name={'itemName' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Item Name</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'currentStock' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Current Stock</FormLabel>
          <FormControl><Input type="number" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'salesCount' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Sales Count</FormLabel>
          <FormControl><Input type="number" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'turnoverRate' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Turnover Rate</FormLabel>
          <FormControl><Input type="number" step="0.01" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'inventoryStatus' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Inventory Status</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
    </>
  )
})

const SocialContentStep = createStep<z.infer<typeof socialContentSchema>>({
  schema: socialContentSchema,
  dataKey: 'socialContent',
  defaults: { platform: '', contentType: '', postsCount: undefined, engagementRate: undefined, reachCount: undefined, sentiment: 'neutral' },
  render: (form) => (
    <>
      <FormField control={form.control} name={'platform' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Platform</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'contentType' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Content Type</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'postsCount' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Posts Count</FormLabel>
          <FormControl><Input type="number" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'engagementRate' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Engagement Rate</FormLabel>
          <FormControl><Input type="number" step="0.01" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'reachCount' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Reach Count</FormLabel>
          <FormControl><Input type="number" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'sentiment' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Sentiment</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
    </>
  )
})

const LiveStreamingStep = createStep<z.infer<typeof liveStreamingSchema>>({
  schema: liveStreamingSchema,
  dataKey: 'liveStreaming',
  defaults: { platform: '', eventName: '', viewersCount: undefined, durationMinutes: undefined, engagementRate: undefined },
  render: (form) => (
    <>
      <FormField control={form.control} name={'platform' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Platform</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'eventName' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Event Name</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'viewersCount' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Viewers Count</FormLabel>
          <FormControl><Input type="number" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'durationMinutes' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Duration (minutes)</FormLabel>
          <FormControl><Input type="number" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'engagementRate' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Engagement Rate</FormLabel>
          <FormControl><Input type="number" step="0.01" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
    </>
  )
})

const steps = [
  { id: 'infoDesk', title: 'Information Desks', description: 'Locations, services, staffing', component: InfoDeskStep },
  { id: 'signage', title: 'Signage', description: 'Signage placement and effectiveness', component: SignageStep },
  { id: 'digitalGuide', title: 'Digital Guides', description: 'Guide platforms and usage', component: DigitalGuideStep },
  { id: 'accessibility', title: 'Accessibility Services', description: 'Services and utilization', component: AccessibilityStep },
  { id: 'vipLounge', title: 'VIP Lounge', description: 'VIP lounge amenities and access', component: VipStep },
  { id: 'concierge', title: 'Concierge Services', description: 'Availability and satisfaction', component: ConciergeStep },
  { id: 'meetGreet', title: 'Meet & Greets', description: 'Artist sessions and feedback', component: MeetGreetStep },
  { id: 'brandActivation', title: 'Brand Activations', description: 'Brands, engagement, ROI', component: BrandActivationStep },
  { id: 'interactive', title: 'Interactive Experiences', description: 'Tech experiences and satisfaction', component: InteractiveStep },
  { id: 'sampling', title: 'Sampling', description: 'Product sampling and conversion', component: SamplingStep },
  { id: 'performance', title: 'Performances', description: 'Acts, attendance, engagement', component: PerformanceStep },
  { id: 'entertainment', title: 'Entertainment Areas', description: 'Activities, capacity, satisfaction', component: EntertainmentAreaStep },
  { id: 'specialEvent', title: 'Special Events', description: 'Special events and feedback', component: SpecialEventStep },
  { id: 'servicePoint', title: 'Service Points', description: 'Food & beverage service points', component: ServicePointStep },
  { id: 'popularItem', title: 'Popular Items', description: 'Menu item performance', component: PopularItemStep },
  { id: 'menuAvailability', title: 'Menu Availability', description: 'Stock and availability status', component: MenuAvailabilityStep },
  { id: 'specialDiet', title: 'Special Diets', description: 'Dietary requirements and satisfaction', component: SpecialDietStep },
  { id: 'merchandise', title: 'Merchandise', description: 'Retail items, sales, satisfaction', component: MerchandiseStep },
  { id: 'checkout', title: 'Checkout', description: 'Retail checkout efficiency', component: CheckoutStep },
  { id: 'retailInventory', title: 'Retail Inventory', description: 'Stock, sales, turnover', component: RetailInventoryStep },
  { id: 'socialContent', title: 'Social Content', description: 'Posts, engagement, sentiment', component: SocialContentStep },
  { id: 'liveStreaming', title: 'Live Streaming', description: 'Streaming metrics and engagement', component: LiveStreamingStep }
]

export default function ExperiencePhaseWorkflow() {
  const [isSaving, setIsSaving] = useState(false)

  const handleWizardComplete = useCallback(async (finalData: Record<string, unknown>) => {
    try {
      setIsSaving(true)
      const data = finalData as ExperienceWizardData
      const { data: userData, error: userError } = await supabase.auth.getUser()
      if (userError || !userData?.user?.id) throw new Error('User not authenticated for experience workflow')
      const userId = userData.user.id

      if (data.infoDesk) {
        const { error } = await supabase.from('experience_information_desks').insert({
          location: data.infoDesk.location,
          operating_hours: data.infoDesk.operatingHours,
          services: parseJson(data.infoDesk.services),
          staffing: parseJson(data.infoDesk.staffing),
          satisfaction: data.infoDesk.satisfaction ?? null,
          user_id: userId
        })
        if (error) throw error
      }

      if (data.signage) {
        const { error } = await supabase.from('experience_signage').insert({
          signage_type: data.signage.signageType,
          location: data.signage.location,
          languages: parseJson(data.signage.languages),
          effectiveness: data.signage.effectiveness ?? null,
          user_id: userId
        })
        if (error) throw error
      }

      if (data.digitalGuide) {
        const { error } = await supabase.from('experience_digital_guides').insert({
          guide_type: data.digitalGuide.guideType,
          platform: data.digitalGuide.platform,
          features: parseJson(data.digitalGuide.features),
          usage_count: data.digitalGuide.usageCount ?? 0,
          user_id: userId
        })
        if (error) throw error
      }

      if (data.accessibility) {
        const { error } = await supabase.from('experience_accessibility_services').insert({
          service_name: data.accessibility.serviceName,
          location: data.accessibility.location,
          availability: data.accessibility.availability,
          utilization: data.accessibility.utilization ?? 0,
          user_id: userId
        })
        if (error) throw error
      }

      if (data.vipLounge) {
        const { error } = await supabase.from('experience_vip_lounge').insert({
          lounge_location: data.vipLounge.loungeLocation,
          capacity: data.vipLounge.capacity ?? null,
          amenities: parseJson(data.vipLounge.amenities),
          access_levels: parseJson(data.vipLounge.accessLevels),
          utilization: data.vipLounge.utilization ?? 0,
          user_id: userId
        })
        if (error) throw error
      }

      if (data.concierge) {
        const { error } = await supabase.from('experience_concierge_services').insert({
          service_name: data.concierge.serviceName,
          availability: data.concierge.availability,
          request_count: data.concierge.requestCount ?? 0,
          satisfaction: data.concierge.satisfaction ?? null,
          user_id: userId
        })
        if (error) throw error
      }

      if (data.meetGreet) {
        const { error } = await supabase.from('experience_meet_greets').insert({
          artist_name: data.meetGreet.artistName,
          meet_time: data.meetGreet.meetTime || null,
          location: data.meetGreet.location,
          attendees_count: data.meetGreet.attendeesCount ?? 0,
          feedback_score: data.meetGreet.feedbackScore ?? null,
          user_id: userId
        })
        if (error) throw error
      }

      if (data.brandActivation) {
        const { error } = await supabase.from('experience_brand_activations').insert({
          brand_name: data.brandActivation.brandName,
          activation_location: data.brandActivation.activationLocation,
          activation_type: data.brandActivation.activationType,
          engagement_count: data.brandActivation.engagementCount ?? 0,
          impressions: data.brandActivation.impressions ?? 0,
          roi: data.brandActivation.roi ?? null,
          user_id: userId
        })
        if (error) throw error
      }

      if (data.interactive) {
        const { error } = await supabase.from('experience_interactive_experiences').insert({
          experience_name: data.interactive.experienceName,
          experience_location: data.interactive.experienceLocation,
          technology_used: data.interactive.technologyUsed,
          participants_count: data.interactive.participantsCount ?? 0,
          satisfaction: data.interactive.satisfaction ?? null,
          user_id: userId
        })
        if (error) throw error
      }

      if (data.sampling) {
        const { error } = await supabase.from('experience_sampling').insert({
          product_name: data.sampling.productName,
          sampling_location: data.sampling.samplingLocation,
          distribution_count: data.sampling.distributionCount ?? 0,
          engagement_rate: data.sampling.engagementRate ?? null,
          conversion_rate: data.sampling.conversionRate ?? null,
          user_id: userId
        })
        if (error) throw error
      }

      if (data.performance) {
        const { error } = await supabase.from('experience_performances').insert({
          act_name: data.performance.actName,
          stage_name: data.performance.stageName,
          performance_start: data.performance.performanceStart || null,
          duration_minutes: data.performance.durationMinutes ?? null,
          attendance_count: data.performance.attendanceCount ?? 0,
          engagement_score: data.performance.engagementScore ?? null,
          user_id: userId
        })
        if (error) throw error
      }

      if (data.entertainment) {
        const { error } = await supabase.from('experience_entertainment_areas').insert({
          area_name: data.entertainment.areaName,
          activities: parseJson(data.entertainment.activities),
          capacity: data.entertainment.capacity ?? null,
          utilization: data.entertainment.utilization ?? 0,
          satisfaction: data.entertainment.satisfaction ?? null,
          user_id: userId
        })
        if (error) throw error
      }

      if (data.specialEvent) {
        const { error } = await supabase.from('experience_special_events').insert({
          event_name: data.specialEvent.eventName,
          event_time: data.specialEvent.eventTime || null,
          event_location: data.specialEvent.eventLocation,
          participants_count: data.specialEvent.participantsCount ?? 0,
          feedback_score: data.specialEvent.feedbackScore ?? null,
          user_id: userId
        })
        if (error) throw error
      }

      if (data.servicePoint) {
        const { error } = await supabase.from('experience_service_points').insert({
          service_location: data.servicePoint.serviceLocation,
          service_type: data.servicePoint.serviceType,
          capacity: data.servicePoint.capacity ?? null,
          average_wait_time: data.servicePoint.averageWaitTime ?? null,
          satisfaction: data.servicePoint.satisfaction ?? null,
          revenue: data.servicePoint.revenue ?? null,
          user_id: userId
        })
        if (error) throw error
      }

      if (data.popularItem) {
        const { error } = await supabase.from('experience_popular_menu_items').insert({
          item_name: data.popularItem.itemName,
          orders_count: data.popularItem.ordersCount ?? 0,
          satisfaction: data.popularItem.satisfaction ?? null,
          revenue: data.popularItem.revenue ?? null,
          user_id: userId
        })
        if (error) throw error
      }

      if (data.menuAvailability) {
        const { error } = await supabase.from('experience_menu_availability').insert({
          item_name: data.menuAvailability.itemName,
          current_stock: data.menuAvailability.currentStock ?? 0,
          reorder_point: data.menuAvailability.reorderPoint ?? 0,
          availability_status: data.menuAvailability.availabilityStatus,
          user_id: userId
        })
        if (error) throw error
      }

      if (data.specialDiet) {
        const { error } = await supabase.from('experience_special_diets').insert({
          requirement: data.specialDiet.requirement,
          requests_count: data.specialDiet.requestsCount ?? 0,
          fulfillment_rate: data.specialDiet.fulfillmentRate ?? null,
          satisfaction: data.specialDiet.satisfaction ?? null,
          user_id: userId
        })
        if (error) throw error
      }

      if (data.merchandise) {
        const { error } = await supabase.from('experience_merchandise').insert({
          item_name: data.merchandise.itemName,
          price: data.merchandise.price ?? null,
          sales_count: data.merchandise.salesCount ?? 0,
          revenue: data.merchandise.revenue ?? null,
          satisfaction: data.merchandise.satisfaction ?? null,
          user_id: userId
        })
        if (error) throw error
      }

      if (data.checkout) {
        const { error } = await supabase.from('experience_checkout_locations').insert({
          checkout_location: data.checkout.checkoutLocation,
          technology_used: data.checkout.technologyUsed,
          efficiency: data.checkout.efficiency ?? null,
          satisfaction: data.checkout.satisfaction ?? null,
          revenue: data.checkout.revenue ?? null,
          user_id: userId
        })
        if (error) throw error
      }

      if (data.retailInventory) {
        const { error } = await supabase.from('experience_retail_inventory').insert({
          item_name: data.retailInventory.itemName,
          current_stock: data.retailInventory.currentStock ?? 0,
          sales_count: data.retailInventory.salesCount ?? 0,
          turnover_rate: data.retailInventory.turnoverRate ?? null,
          inventory_status: data.retailInventory.inventoryStatus,
          user_id: userId
        })
        if (error) throw error
      }

      if (data.socialContent) {
        const { error } = await supabase.from('experience_social_content').insert({
          platform: data.socialContent.platform,
          content_type: data.socialContent.contentType,
          posts_count: data.socialContent.postsCount ?? 0,
          engagement_rate: data.socialContent.engagementRate ?? null,
          reach_count: data.socialContent.reachCount ?? 0,
          sentiment: data.socialContent.sentiment,
          user_id: userId
        })
        if (error) throw error
      }

      if (data.liveStreaming) {
        const { error } = await supabase.from('experience_live_streaming').insert({
          platform: data.liveStreaming.platform,
          event_name: data.liveStreaming.eventName,
          viewers_count: data.liveStreaming.viewersCount ?? 0,
          duration_minutes: data.liveStreaming.durationMinutes ?? null,
          engagement_rate: data.liveStreaming.engagementRate ?? null,
          user_id: userId
        })
        if (error) throw error
      }

    } catch (error) {
      logger.error('Experience phase workflow save failed', error)
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
          <h1 className="text-3xl font-bold">Experience Phase Workflow</h1>
          <p className="text-muted-foreground mt-2">
            Capture guest services, VIP, activations, entertainment, F&B, retail, and social metrics with Supabase persistence.
          </p>
        </div>

        <MultiStepWizard
          steps={steps}
          onComplete={handleWizardComplete}
          initialData={initialData}
          className="max-w-6xl mx-auto"
          autoSave
          persistenceKey="experience-phase-workflow"
        />
        {isSaving && <p className="mt-4 text-sm text-muted-foreground">Saving experience phase records...</p>}
      </div>
    </div>
  )
}
import React, { useCallback } from 'react'
import { logger } from '@/lib/logger'
import { MultiStepWizard } from '@/components/forms/multi-step-wizard'

interface WizardStep {
  id: string
  title: string
  description: string
  component: () => React.JSX.Element
}

const CXGoalsAndStandards = () => (
  <div className="space-y-4">
    <p className="text-sm text-muted-foreground">Define experience goals, standards, and success metrics.</p>
    <div className="rounded-lg border p-4 space-y-2">
      <h3 className="font-semibold">Data</h3>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        <li>Experience objectives, NPS/CES targets, SLAs</li>
        <li>Audience segments and needs</li>
        <li>Standards for accessibility, inclusivity, and service</li>
      </ul>
    </div>
    <div className="rounded-lg border p-4 space-y-2">
      <h3 className="font-semibold">Validation</h3>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        <li>Metrics defined and owned</li>
        <li>Standards documented and published</li>
      </ul>
    </div>
  </div>
)

const JourneyDesign = () => (
  <div className="space-y-4">
    <p className="text-sm text-muted-foreground">Design end-to-end journeys and touchpoints.</p>
    <div className="rounded-lg border p-4 space-y-2">
      <h3 className="font-semibold">Data</h3>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        <li>Journey maps with stages, touchpoints, channels</li>
        <li>Content/messaging per stage; signage/wayfinding</li>
        <li>Service blueprints and dependencies</li>
      </ul>
    </div>
    <div className="rounded-lg border p-4 space-y-2">
      <h3 className="font-semibold">Validation</h3>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        <li>Touchpoints covered; ownership assigned</li>
        <li>Dependencies and SLAs mapped</li>
      </ul>
    </div>
  </div>
)

const StaffingAndTraining = () => (
  <div className="space-y-4">
    <p className="text-sm text-muted-foreground">Staff and train for the experience delivery.</p>
    <div className="rounded-lg border p-4 space-y-2">
      <h3 className="font-semibold">Data</h3>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        <li>Roles, quantities, schedules, and training requirements</li>
        <li>Service scripts, FAQs, escalation paths</li>
        <li>Equipment/kits needed per touchpoint</li>
      </ul>
    </div>
    <div className="rounded-lg border p-4 space-y-2">
      <h3 className="font-semibold">Validation</h3>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        <li>All roles staffed and trained; scripts approved</li>
        <li>Service levels and escalation coverage confirmed</li>
      </ul>
    </div>
  </div>
)

const LiveOpsAndFeedback = () => (
  <div className="space-y-4">
    <p className="text-sm text-muted-foreground">Run live experience ops and capture feedback.</p>
    <div className="rounded-lg border p-4 space-y-2">
      <h3 className="font-semibold">Data</h3>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        <li>Live KPIs (wait times, satisfaction pulses)</li>
        <li>Issue logs, escalations, resolutions</li>
        <li>Feedback channels and sentiment</li>
      </ul>
    </div>
    <div className="rounded-lg border p-4 space-y-2">
      <h3 className="font-semibold">Validation</h3>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        <li>Escalations handled within SLA</li>
        <li>Feedback captured and tagged</li>
      </ul>
    </div>
  </div>
)

const PostExperienceReview = () => (
  <div className="space-y-4">
    <p className="text-sm text-muted-foreground">Review outcomes, insights, and improvements.</p>
    <div className="rounded-lg border p-4 space-y-2">
      <h3 className="font-semibold">Data</h3>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        <li>NPS/CES/CSAT, incident summaries, SLA attainment</li>
        <li>Top feedback themes; wins/issues</li>
        <li>Action items and owners</li>
      </ul>
    </div>
    <div className="rounded-lg border p-4 space-y-2">
      <h3 className="font-semibold">Validation</h3>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        <li>Action items created and owned</li>
        <li>Improvements fed into next cycle</li>
      </ul>
    </div>
  </div>
)

const experienceSteps: WizardStep[] = [
  { id: 'cx-goals', title: 'CX Goals & Standards', description: 'Goals, standards, metrics', component: CXGoalsAndStandards },
  { id: 'journey', title: 'Journey Design', description: 'Touchpoints, service blueprints, dependencies', component: JourneyDesign },
  { id: 'staffing', title: 'Staffing & Training', description: 'Staffing, scripts, escalation paths', component: StaffingAndTraining },
  { id: 'liveops', title: 'Live Ops & Feedback', description: 'Run live ops and capture feedback', component: LiveOpsAndFeedback },
  { id: 'post', title: 'Post-Experience Review', description: 'Review metrics and feed improvements', component: PostExperienceReview }
]

const handleWizardComplete = useCallback((finalData: Record<string, unknown>) => {
  logger.info('Experience phase completed', { data: finalData })
}, [])

export default function ExperiencePhaseWorkflow() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Experience Phase Workflow</h1>
          <p className="text-muted-foreground mt-2">
            Define CX goals, design journeys, staff/train, run live ops, and review improvements.
          </p>
        </div>

        <MultiStepWizard
          steps={experienceSteps}
          onComplete={handleWizardComplete}
          initialData={{}}
          className="max-w-6xl mx-auto"
        />
      </div>
    </div>
  )
}
