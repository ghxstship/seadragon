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

type PlanningFormValues = z.infer<typeof planningSchema>
type AudienceFormValues = z.infer<typeof audienceSchema>
type ContentFormValues = z.infer<typeof contentSchema>
type ChannelFormValues = z.infer<typeof channelSchema>
type BudgetFormValues = z.infer<typeof budgetSchema>
type MeasurementFormValues = z.infer<typeof measurementSchema>

type MarketingWizardData = {
  planning?: PlanningFormValues
  audience?: AudienceFormValues
  content?: ContentFormValues
  channels?: ChannelFormValues
  budget?: BudgetFormValues
  measurement?: MeasurementFormValues
}

const planningSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  status: z.enum(['draft', 'active', 'completed', 'paused', 'cancelled']).default('draft'),
  budget: z.coerce.number().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional()
})

const audienceSchema = z.object({
  segmentName: z.string().min(1),
  description: z.string().optional(),
  size: z.coerce.number().int().optional(),
  demographics: z.string().optional(),
  interests: z.string().optional()
})

const contentSchema = z.object({
  title: z.string().min(1),
  type: z.enum(['image', 'video', 'text', 'social', 'email', 'web']),
  status: z.enum(['draft', 'approved', 'published', 'archived']).default('draft'),
  content: z.string().optional(),
  metadata: z.string().optional()
})

const channelSchema = z.object({
  channel: z.string().min(1),
  impressions: z.coerce.number().int().optional(),
  reach: z.coerce.number().int().optional(),
  engagement: z.coerce.number().int().optional(),
  clicks: z.coerce.number().int().optional(),
  conversions: z.coerce.number().int().optional(),
  cost: z.coerce.number().optional(),
  roi: z.coerce.number().optional()
})

const budgetSchema = z.object({
  category: z.string().min(1),
  allocated: z.coerce.number().optional(),
  spent: z.coerce.number().optional(),
  remaining: z.coerce.number().optional(),
  roi: z.coerce.number().optional()
})

const measurementSchema = z.object({
  kpi: z.string().min(1),
  value: z.coerce.number().optional(),
  notes: z.string().optional()
})

function createStep<T extends Record<string, unknown>>(opts: {
  schema: z.ZodSchema
  dataKey: keyof MarketingWizardData
  defaults: T
  render: (form: ReturnType<typeof useForm<T>>) => React.ReactNode
}) {
  return function Step({ data, onChange, onValidationChange }: StepProps) {
    const existing = (data as MarketingWizardData)[opts.dataKey] as T | undefined
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

const PlanningStep = createStep<PlanningFormValues>({
  schema: planningSchema,
  dataKey: 'planning',
  defaults: { name: '', description: '', status: 'draft', budget: undefined, startDate: '', endDate: '' },
  render: (form) => (
    <>
      <FormField control={form.control} name={'name' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Campaign Name</FormLabel>
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
      <FormField control={form.control} name={'status' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Status</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'budget' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Budget</FormLabel>
          <FormControl><Input type="number" step="0.01" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'startDate' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Start Date</FormLabel>
          <FormControl><Input type="date" {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'endDate' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>End Date</FormLabel>
          <FormControl><Input type="date" {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
    </>
  )
})

const AudienceStep = createStep<AudienceFormValues>({
  schema: audienceSchema,
  dataKey: 'audience',
  defaults: { segmentName: '', description: '', size: undefined, demographics: '', interests: '' },
  render: (form) => (
    <>
      <FormField control={form.control} name={'segmentName' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Segment Name</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'size' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Size</FormLabel>
          <FormControl><Input type="number" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'demographics' as never} render={({ field }) => (
        <FormItem className="md:col-span-2">
          <FormLabel>Demographics (JSON)</FormLabel>
          <FormControl><Textarea rows={3} {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'interests' as never} render={({ field }) => (
        <FormItem className="md:col-span-2">
          <FormLabel>Interests (JSON)</FormLabel>
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

const ContentStep = createStep<ContentFormValues>({
  schema: contentSchema,
  dataKey: 'content',
  defaults: { title: '', type: 'text', status: 'draft', content: '', metadata: '' },
  render: (form) => (
    <>
      <FormField control={form.control} name={'title' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Title</FormLabel>
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
      <FormField control={form.control} name={'status' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Status</FormLabel>
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
      <FormField control={form.control} name={'metadata' as never} render={({ field }) => (
        <FormItem className="md:col-span-2">
          <FormLabel>Metadata (JSON)</FormLabel>
          <FormControl><Textarea rows={3} {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
    </>
  )
})

const ChannelStep = createStep<ChannelFormValues>({
  schema: channelSchema,
  dataKey: 'channels',
  defaults: { channel: '', impressions: undefined, reach: undefined, engagement: undefined, clicks: undefined, conversions: undefined, cost: undefined, roi: undefined },
  render: (form) => (
    <>
      <FormField control={form.control} name={'channel' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Channel</FormLabel>
          <FormControl><Input {...field}/></FormControl>
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
      <FormField control={form.control} name={'reach' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Reach</FormLabel>
          <FormControl><Input type="number" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'engagement' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Engagement</FormLabel>
          <FormControl><Input type="number" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'clicks' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Clicks</FormLabel>
          <FormControl><Input type="number" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'conversions' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Conversions</FormLabel>
          <FormControl><Input type="number" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'cost' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Cost</FormLabel>
          <FormControl><Input type="number" step="0.01" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'roi' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>ROI (%)</FormLabel>
          <FormControl><Input type="number" step="0.01" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
    </>
  )
})

const BudgetStep = createStep<BudgetFormValues>({
  schema: budgetSchema,
  dataKey: 'budget',
  defaults: { category: '', allocated: undefined, spent: undefined, remaining: undefined, roi: undefined },
  render: (form) => (
    <>
      <FormField control={form.control} name={'category' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Category</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'allocated' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Allocated</FormLabel>
          <FormControl><Input type="number" step="0.01" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'spent' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Spent</FormLabel>
          <FormControl><Input type="number" step="0.01" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'remaining' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Remaining</FormLabel>
          <FormControl><Input type="number" step="0.01" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'roi' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>ROI (%)</FormLabel>
          <FormControl><Input type="number" step="0.01" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
    </>
  )
})

const MeasurementStep = createStep<MeasurementFormValues>({
  schema: measurementSchema,
  dataKey: 'measurement',
  defaults: { kpi: '', value: undefined, notes: '' },
  render: (form) => (
    <>
      <FormField control={form.control} name={'kpi' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>KPI</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'value' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Value</FormLabel>
          <FormControl><Input type="number" step="0.01" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'notes' as never} render={({ field }) => (
        <FormItem className="md:col-span-2">
          <FormLabel>Notes</FormLabel>
          <FormControl><Textarea rows={3} {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
    </>
  )
})

const steps = [
  { id: 'planning', title: 'Campaign Planning', description: 'Objectives, strategy, budget, and KPIs', component: PlanningStep },
  { id: 'audience', title: 'Audience & Personas', description: 'Segments and targeting criteria', component: AudienceStep },
  { id: 'content', title: 'Content & Calendar', description: 'Creative assets and approvals', component: ContentStep },
  { id: 'channels', title: 'Channel Mix', description: 'Channel performance metrics', component: ChannelStep },
  { id: 'budget', title: 'Budget & Forecast', description: 'Allocation and spend tracking', component: BudgetStep },
  { id: 'measurement', title: 'Measurement & Optimization', description: 'KPIs and notes', component: MeasurementStep }
]

function parseJsonOrNull(value?: string) {
  if (!value || value.trim() === '') return null
  try {
    return JSON.parse(value)
  } catch (err) {
    logger.error('Failed to parse JSON field', err)
    return null
  }
}

export function MarketingCampaignWorkflow() {
  const [isSaving, setIsSaving] = useState(false)

  const handleWizardComplete = useCallback(async (finalData: Record<string, unknown>) => {
    try {
      setIsSaving(true)
      const data = finalData as MarketingWizardData
      const { data: userData, error: userError } = await supabase.auth.getUser()
      if (userError || !userData?.user?.id) throw new Error('User not authenticated for marketing workflow')
      const userId = userData.user.id

      // Insert campaign
      let campaignId: string | null = null
      if (data.planning) {
        const { data: campaignRow, error } = await supabase.from('marketing_campaigns').insert({
          name: data.planning.name,
          description: data.planning.description,
          status: data.planning.status,
          budget: data.planning.budget ?? null,
          start_date: data.planning.startDate || null,
          end_date: data.planning.endDate || null,
          campaign_data: {},
          user_id: userId
        }).select('id').single()
        if (error) throw error
        campaignId = campaignRow?.id ?? null
      }

      // Audience
      if (data.audience && campaignId) {
        const { error } = await supabase.from('marketing_audience_segments').insert({
          campaign_id: campaignId,
          name: data.audience.segmentName,
          description: data.audience.description,
          size: data.audience.size ?? null,
          demographics: parseJsonOrNull(data.audience.demographics),
          interests: parseJsonOrNull(data.audience.interests)
        })
        if (error) throw error
      }

      // Content
      if (data.content && campaignId) {
        const { error } = await supabase.from('marketing_content_pieces').insert({
          campaign_id: campaignId,
          title: data.content.title,
          type: data.content.type,
          status: data.content.status,
          content: data.content.content,
          metadata: parseJsonOrNull(data.content.metadata)
        })
        if (error) throw error
      }

      // Channel performance
      if (data.channels && campaignId) {
        const { error } = await supabase.from('marketing_channel_performance').insert({
          campaign_id: campaignId,
          channel: data.channels.channel,
          impressions: data.channels.impressions ?? null,
          reach: data.channels.reach ?? null,
          engagement: data.channels.engagement ?? null,
          clicks: data.channels.clicks ?? null,
          conversions: data.channels.conversions ?? null,
          cost: data.channels.cost ?? null,
          roi: data.channels.roi ?? null
        })
        if (error) throw error
      }

      // Budget tracking
      if (data.budget && campaignId) {
        const { error } = await supabase.from('marketing_budget_tracking').insert({
          campaign_id: campaignId,
          category: data.budget.category,
          allocated: data.budget.allocated ?? null,
          spent: data.budget.spent ?? null,
          remaining: data.budget.remaining ?? null,
          roi: data.budget.roi ?? null
        })
        if (error) throw error
      }

      // Measurement placeholder stored in campaign_data extension
      if (campaignId && data.measurement) {
        await supabase.from('marketing_campaigns').update({
          campaign_data: {
            measurement: {
              kpi: data.measurement.kpi,
              value: data.measurement.value ?? null,
              notes: data.measurement.notes
            }
          }
        }).eq('id', campaignId)
      }

    } catch (error) {
      logger.error('Marketing campaign workflow save failed', error)
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
          <h1 className="text-3xl font-bold">Marketing Campaign Workflow</h1>
          <p className="text-muted-foreground mt-2">
            Plan, run, and optimize campaigns with Supabase-backed data.
          </p>
        </div>

        <MultiStepWizard
          steps={steps}
          onComplete={handleWizardComplete}
          initialData={initialData}
          className="max-w-6xl mx-auto"
          autoSave
          persistenceKey="marketing-campaign-workflow"
        />
        {isSaving && <p className="mt-4 text-sm text-muted-foreground">Saving marketing campaign data...</p>}
      </div>
    </div>
  )
}

export default MarketingCampaignWorkflow
